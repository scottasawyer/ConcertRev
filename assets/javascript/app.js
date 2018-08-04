var showList = [];

$('.changeNow').on('click', function () {
    event.preventDefault();

    var userGuess = $('.whatDoYouGot').val().trim();
    $('#countryList').empty();
    $('#goodResults').empty();

    var queryURL = "https://rest.bandsintown.com/artists/" + userGuess + "/events?app_id=ac5d152e5bb85a812504fe7f16f5ff23";
    // console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",

    }).then(function (response) {
        //  console.log(response)
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

$(document).on('click', '.country-btn', function () {
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
        $div.addClass('show-dtails')

        var $description = $('<p>')
            $description.text('Name: ' + goodResults[l].description)
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

        $div.append($description, $lineUp, $dateTime, $venueName, $region, $latitude, $longitude)
        $('#goodResults').append($div)


    }
})
