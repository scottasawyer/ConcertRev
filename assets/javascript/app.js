$(document).ready(function () {
    $('#concertInformation').hide();
    $('#goingBack').hide();
    $('.nav-wrapper').hide();
    var showList = [];
    var savedConcerts = [];

    var config = {
        apiKey: "AIzaSyDwVaReBYZNKqN2NV_5zyik1Huff2ka_ws",
        authDomain: "concertrev.firebaseapp.com",
        databaseURL: "https://concertrev.firebaseio.com",
        projectId: "concertrev",
        storageBucket: "",
        messagingSenderId: "12534350127"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $('.changeNow').on('click', function () {
        event.preventDefault();
        $('#openingContainer').hide()
        $('#goingBack').hide();
        $('#concertInformation').hide();
        $('#countryList').empty();
        $('#countryList').show(1000);
        $('#goodResults').hide();

        var userGuess = $('.whatDoYouGot').val().trim();
        console.log(userGuess);

        database.ref().set({ 
            Band: userGuess 
        });
        // this might not work, but it should

        var queryURL = "https://rest.bandsintown.com/artists/" + userGuess + "/events?app_id=ac5d152e5bb85a812504fe7f16f5ff23";
        // console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET",

        }).then(function (response) {
            // console.log(response)
            showList = [];

            var countries = [];

            for (var j = 0; j < response.length; j++) {
                if (countries.indexOf(response[j].venue.country) === -1) {
                    countries.push(response[j].venue.country)
                }
            }
            showList = response
            console.log(showList);
            for (var k = 0; k < countries.length; k++) {
                var $btn = $('<button>')
                $btn.attr({ 'data-country': countries[k], 'id': "animateImage" + k })
                $btn.text(countries[k])
                $btn.addClass('country-btn animated rubberBand')
                $('#countryList').append($btn)
            }
        })
    })

    $(document).on('click', '.country-btn', function () {

        $('.country-btn').not(this).toggle(1000);

        $('#goodResults').show();
        $('#goodResults').empty();
        event.preventDefault();             // prevents refresh
        var country = $(this).data('country')
        var goodResults = [];

        for (var i = 0; i < showList.length; i++) {
            if (showList[i].venue.country === country) {
                goodResults.push(showList[i])
            }
        }

        for (var l = 0; l < goodResults.length; l++) {
            var $div = $('<div>')
            $div.addClass('show-details')

            var _starGif = $('<button type="button" class="starConcert"><i class="fas fa-star"></i></button>')

            var $description = $('<p>')
            $description.text('Concert Information: ' + goodResults[l].description)
            var $lineUp = $('<p>')
            $lineUp.text('Lineup: ' + goodResults[l].lineup)
            var $dateTime = $('<p id="wDate">')
            var eDate = moment(goodResults[l].datetime).format('MMMM Do YYYY, h:mm a');
            $dateTime.text('Date: ' + eDate);
            var $venueName = $('<p>')
            $venueName.text('Venue: ' + goodResults[l].venue.name + " in " + goodResults[l].venue.city)


            var $venueWeather = $('<p><button type="button" class="weather"><i class="fas fa-cloud"></i></button>')
                .attr('data-latitude', goodResults[l].venue.latitude)
                .attr('data-longitude', goodResults[l].venue.longitude)
            _starGif.attr('data-description', goodResults[l].description)
                .attr('data-lineup', goodResults[l].lineup)
                .attr('data-dateTime', goodResults[l].datetime)
                .attr('data-venue', goodResults[l].venue.name)
                .attr('data-region', goodResults[l].venue.city)
                .attr('data-latitude', goodResults[l].venue.latitude)
                .attr('data-longitude', goodResults[l].venue.longitude)
            console.log("Latitude: " + goodResults[l].venue.latitude + ", Longitude: " + goodResults[l].venue.longitude);
            $div.append($description, $lineUp, $dateTime, $venueName, $venueWeather, _starGif)
            $('#goodResults').append($div)
        }
    })

    if (!Array.isArray(savedConcerts)) {
        savedConcerts = [];
    }

    $(document).on('click', '.starConcert', function () {

        favConcert = { 'data-description': $(this).attr('data-description'), 'data-lineup': $(this).attr('data-lineup'), 'data-dateTime': $(this).attr('data-dateTime'), 'data-venue': $(this).attr('data-venue'), 'data-region': $(this).attr('data-region') }
        savedConcerts.push(favConcert)
        localStorage.setItem('savedConcerts', JSON.stringify(savedConcerts))
    })

    $('#favorites').on('click', function (event) {

        console.log("clicked");
        $('#goingBack').show();
        $('#concertInformation').slideToggle(1000);
        $('#concertInformation').empty();
        $('#countryList').hide(1000);
        $('#goodResults').hide(1000);

        event.preventDefault();
        var savedConcerts = JSON.parse(localStorage.getItem('savedConcerts'));
        console.log(savedConcerts)



        for (var m = 0; m < savedConcerts.length; m++) {
            console.log(savedConcerts[m]['data-description'])
            console.log(m)
            var concertDiv = $('<div>').attr('id', m).addClass('thisClass')

            var btnConcert = $('<button>')

            btnConcert.addClass('removeConcert').html('<i class="fas fa-trash-alt"></i>').attr('id', "m" + m)

            Object.keys(savedConcerts[m]).forEach(key => {

                console.log(key);
                console.log(savedConcerts[m][key])

                var concertInfo = $('<p>').addClass('_paragraph')
                    .text((savedConcerts[m][key]))

                concertDiv.append(concertInfo)
            })
            concertDiv.append(btnConcert)
            $('#concertInformation').append(concertDiv)
        }
    })

    $(document).on('click', '.removeConcert', function () {
        var concertsToGoTo = JSON.parse(localStorage.getItem('savedConcerts'));
        var idIndex = $(this).attr('id')
        console.log(idIndex)
        console.log(idIndex.charAt(1))
        var indexOfDiv = idIndex.charAt(1)
        $(`#${indexOfDiv}`).remove()
        // $("#" + indexOfDiv).remove()

        concertsToGoTo.splice(idIndex, 1);
        savedConcerts = concertsToGoTo;

        localStorage.setItem("savedConcerts", JSON.stringify(concertsToGoTo));


    });


    $(document).on('click', '#goingBack', function () {

        $('#concertInformation').hide(1000);
        $('#countryList').show(1000);
        $('#goodResults').show();
        $('#goingBack').hide();
    })

    //  var rotate = anime({
    //     targets: '#countryList',
    //     translateX: [
    //         {value:900, duration:10000,
    //         delay:0, elasticity:0}

    //     ],
    //     // rotate: [
    //     //     {value:'1turn', duration:1100,
    //     //     delay:1000, easing: 'easeInOutSine'}
    //     // ],
    //         autoplay: false
    //     });

    // document.querySelector('.btn-animate').onclick = rotate.restart;

    var rotate = anime({
        targets: '#favorites',
        rotate: [
            {
                value: '3turn', duration: 3000,
                easing: 'easeInOutSine'
            }
        ],
        opacity: [
            {
                value: 1, duration: 1000,
                delay: 0, elasticty: 0
            }
        ],
        autoplay: false
    });

    document.querySelector('.fas').onclick = rotate.restart;

    var relativeOffset = anime.timeline({
        autoplay: false
    });

    relativeOffset
        .add({
            targets: '#openingContainer .switch1.el',
            translateY: [{value:-700, duration:5000}],
            rotate:[{value:'1turn', duration:4000}],
            easing: 'easeOutExpo',
            // audio: url('../audio/dissonant-kick_G#_major.wav'), 
            begin: function() {
                document.getElementById("mysoundclip1").play()
            } 
    })

    .add({
        targets: '#openingContainer .switch2.el',
        translateX: 700,

        easing: 'easeOutExpo',
        offset: '-=3700', //Starts 3700ms before the previous animation ends
        begin: function() {
            document.getElementById("mysoundclip2").play()
        },
        complete:function() {
            $('.switch2').hide();
        }
    })
    .add({
        targets: '#openingContainer .switch4.el',
        translateY: 700,

        easing: 'easeOutExpo',
        offset: '-=2500', //Starts 800ms before the previous animation ends 
        begin: function() {
            document.getElementById("mysoundclip3").play()
        },
        complete:function() {
            $('.switch2').hide();
        } 
    })

    .add({
        targets: '#openingContainer .switch3.el',
        translateX: [{value:-400, duration:6000}],
        rotate: [{value:'1turn', duration:6000}],
        // easing: 'easeInQuart',
        offset: '-=1600', //Starts 800ms before the previous animation ends 
        begin: function() {
            document.getElementById("mysoundclip4").play()
        }
    })

    document.querySelector('.rotateBoxes').onclick = relativeOffset.restart;

    $(document).on('click', '.rotateBoxes', function () {
        $('.nav-wrapper').delay(1800).slideDown(300);
        $('.switch1').removeClass('animated bounceInLeft ')
        $('.switch2').removeClass('animated bounceInDown')
        $('.switch3').removeClass('animated bounceInUp')
        $('.switch4').removeClass('animated bounceInRight')

        var styles = {
            background: 'url(assets/images/concert.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPoistion: 'center',
            margin: 0,
            padding: 0,
            zIndex: 10,
        }
        $('body, html').css(styles)
        setTimeout(function () {
            $('.rotateBoxes').hide();
        }, 4500);
    })

    function begin() {
        $('.switch1').addClass('animated bounceInLeft ')
        $('.switch2').addClass('animated bounceInDown')
        $('.switch3').addClass('animated bounceInUp')
        $('.switch4').addClass('animated bounceInRight')
        $('.rotateBoxes').addClass('animated pulse infinite')
    }
    begin();

    database.ref().on("value", function(snapshot) {
        // Log everything that's coming out of snapshot
        console.log("Got Here");
        $("#recentSearch").text("Most recently searched artist: " + snapshot.val().Band);
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).on('click', '.weather', function () {
        console.log("clicked");
        console.log(this);
        var wLat = $(this).attr('data-latitude');
        var wLong = $(this).attr('data-longitude');
        var wCoords = (wLat + "," + wLong);
        console.log(wCoords);
        var wKey = "8c6957ee01f24957b5bd52d69928bd75";
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + wLat + "&lon=" + wLong + "&appid=" + wKey + "&units=imperial";
        $.ajax({
            url: weatherURL,
            method: "GET",
        }).then(function (response) {
            var vTempHigh = response.main.temp_max;
            console.log(vTempHigh);
            var vTempLow = response.main.temp_min;
            console.log(vTempLow);
            sessionStorage.setItem('highTemp', vTempHigh);
            sessionStorage.setItem('lowTemp', vTempLow)
        })
        var vTempHigh = sessionStorage.getItem('highTemp');
        var vTempLow = sessionStorage.getItem('lowTemp');
        $(this).text("Today's Forecast: High of " + vTempHigh + " and low of " + vTempLow + " (F)");
        
        
        

    })

})


