$(document).ready(function () {
    $('#concertInformation').hide();
    $('#goingBack').hide();
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
        $('#goingBack').hide();
        event.preventDefault();
        $('#concertInformation').hide();
        var userGuess = $('.whatDoYouGot').val().trim();
        // hideMe.reset();
        $('#countryList').empty();
        $('#countryList').show(1000);
        $('#goodResults').hide();
        database.ref().push({
            userGuess
        });


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
                $btn.attr('data-country', countries[k])
                $btn.text(countries[k])
                $btn.addClass('country-btn')
                $('#countryList').append($btn)
            }
        })
    })

    var $latitude = 0;
    var $longitude = 0;


    $(document).on('click', '.country-btn', function () {

        $('#goodResults').show();
        $('#goodResults').empty();
        event.preventDefault();
        var country = $(this).data('country')
        var goodResults = [];

        for (var i = 0; i < showList.length; i++) {
            if (showList[i].venue.country === country) {
                goodResults.push(showList[i])
            }
        }
        // console.log(goodResults);

        for (var l = 0; l < goodResults.length; l++) {
            var $div = $('<div>')
            $div.addClass('show-details')

            var _starGif = $('<button type="button" class="starConcert"><i class="fas fa-star"></i></button>')

            var $description = $('<p>')
            $description.text('Concert Information: ' + goodResults[l].description)
            var $lineUp = $('<p>')
            $lineUp.text('Lineup: ' + goodResults[l].lineup)
            var $dateTime = $('<p>')
            $dateTime.text('Date: ' + goodResults[l].datetime)
            var $venueName = $('<p>')
            $venueName.text('Venue: ' + goodResults[l].venue.name)
            var $region = $('<p>')
            $region.text('Region: ' + goodResults[l].venue.city)
            var $latitude = $('<p>')
            $latitude.text('Latitude: ' + goodResults[l].venue.latitude)
            var $longitude = $('<p>')
            $longitude.text('Latitude: ' + goodResults[l].venue.longitude)

            _starGif.attr('data-description', goodResults[l].description)
                .attr('data-lineup', goodResults[l].lineup)
                .attr('data-dateTime', goodResults[l].datetime)
                .attr('data-venue', goodResults[l].venue.name)
                .attr('data-region', goodResults[l].venue.city)
                .attr('data-latitude', goodResults[l].venue.latitude)
                .attr('data-longitude', goodResults[l].venue.longitude)

            $div.append($description, $lineUp, $dateTime, $venueName, $region, $latitude, $longitude, _starGif)
            $('#goodResults').append($div)
        }
    })

    // if (!Array.isArray(savedConcerts)) {
    //     savedConcerts = [];
    // } 

    $(document).on('click', '.starConcert', function () {
        $(this).remove();
        console.log("clicked");
        favConcert = { 'data-description': $(this).attr('data-description'), 'data-lineup': $(this).attr('data-lineup'), 'data-dateTime': $(this).attr('data-dateTime'), 'data-venue': $(this).attr('data-venue'), 'data-region': $(this).attr('data-region') }
        console.log($(this).attr('data-description'))
        savedConcerts.push(favConcert)
        console.log("HELLO" + favConcert)
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
            // var removeConcert = $('<button type="button" class="starConcert"><i class="fas fa-star"></i></button>')
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
        var idIndex = $(this).attr('id')
        console.log(idIndex)
        console.log(idIndex.charAt(1))
        var indexOfDiv = idIndex.charAt(1)
        $(`#${indexOfDiv}`).remove()
        // $("#" + indexOfDiv).remove()
    });

    $(document).on('click', '#goingBack', function () {

        $('#concertInformation').hide(1000);
        $('#countryList').show(1000);
        $('#goodResults').show();
        $('#goingBack').hide();
    })

    // $(document).on("click", "#favorites", concertData);
})
