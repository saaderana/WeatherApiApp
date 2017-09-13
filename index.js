// =================================================
// Weather Reporter
// =================================================

function weatherReport(latitude, longitude) {
    // variables config for coordinates, url and api key
    // latitude and longitude are accepted arguments and passed
    // once a user has submitted the form.
    var apiKey       = 'b033f6a9900f2eebde44f0527acb3c50',
            url          = 'https://api.darksky.net/forecast/',
            lati         = latitude,
            longi        = longitude,
            api_call     = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

    // Hold our days of the week for reference later.
    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    // Hold hourly values for each day of the week.
    // This will store our 24 hour forecast results.
    var sunday    = [],
            monday    = [],
            tuesday   = [],
            wednesday = [],
            thursday  = [],
            friday    = [],
            saturday  = [];


    // Hourly report method to reference in our daily loop
    function hourlyReport(day, selector) {
        for(var i = 0, l = day.length; i < l; i++) {
            $("." + selector + " " + "ul").append('<li>' + ' ' +Math.round(day[i]) + '</li>');
        }
    }

    // Call to the DarkSky API to retrieve JSON
    $.getJSON(api_call, function(forecast) {

        // Loop thru hourly forecasts
        for(var j = 0, k = forecast.hourly.data.length; j < k; j++) {
            var hourly_date    = new Date(forecast.hourly.data[j].time * 1000),
                    hourly_day     = days[hourly_date.getDay()],
                    hourly_temp    = forecast.hourly.data[j].temperature;



            // push 24 hour forecast values to our empty days array
            switch(hourly_day) {
                case 'Sunday':
                    sunday.push(hourly_temp);
                    break;
                case 'Monday':
                    monday.push(hourly_temp);
                    break;
                case 'Tuesday':
                    tuesday.push(hourly_temp);
                    break;
                case 'Wednesday':
                    wednesday.push(hourly_temp);
                    break;
                case 'Thursday':
                    thursday.push(hourly_temp);
                    break;
                case 'Friday':
                    friday.push(hourly_temp);
                    break;
                case 'Saturday':
                    saturday.push(hourly_temp);
                    break;
                default: console.log(hourly_date.toLocaleTimeString());
                    break;
            }
        }

        // Loop thru daily forecasts
        for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

            var date     = new Date(forecast.daily.data[i].time * 1000),
                    day      = days[date.getDay()],
                    skicons  = forecast.daily.data[i].icon,
                    time     = forecast.daily.data[i].time,
                    humidity = forecast.daily.data[i].humidity,
                    summary  = forecast.daily.data[i].summary,
                    temp    = Math.round(forecast.hourly.data[i].temperature),
                    tempMax = Math.round(forecast.daily.data[i].temperatureMax);



            // Append Markup for each Forecast of the 7 day week
            $("#forecast").append(

                    "<div class = 'day'><b>Day</b>: " + date.toLocaleDateString() + "</div>" +
                    "<div><b>Temperature</b>: " + temp + "</div>" +
                    "<div><b>Max Temp.</b>: " + tempMax + "</div>" +
                    "<div><b>Humidity</b>: " + humidity + "</div>" +
                    '<p class="summary">' + summary + '</p>' +
                    '</div></div><div class="back card">' +
                    '<div class="hourly' + ' ' + day + '"><b>24hr Forecast</b><ul class="list-reset"></ul></div></div></div></div></li>'
            );

            // Daily forecast report for each day of the week
            switch(day) {
                case 'Sunday':
                    hourlyReport(sunday, days[0]);
                    break;
                case 'Monday':
                    hourlyReport(monday, days[1]);
                    break;
                case 'Tuesday':
                    hourlyReport(tuesday, days[2]);
                    break;
                case 'Wednesday':
                    hourlyReport(wednesday, days[3]);
                    break;
                case 'Thursday':
                    hourlyReport(thursday, days[4]);
                    break;
                case 'Friday':
                    hourlyReport(friday, days[5]);
                    break;
                case 'Saturday':
                    hourlyReport(saturday, days[6]);
                    break;
            }
        }


    });
}


// =================================================
// Get Weather Button Event
// =================================================

// Get Weather Button Event
$('button').on('click', function(e) {
    var lat       = $('#latitude').val(),
            long      = $('#longitude').val(),
            city_name = $('#city-search').val()

             var searchTerm = $('#city-search').val();


    // If the latitude and longitude inputs aren't empty
    // then continue with the code. Otherwise report error to user.
    if(lat && long !== '') {
        e.preventDefault();

        // Fade logo out when form is submitted
        $('#logo').fadeOut(100);

        // Fade the form out, submit the weather request,
        // inject "new forecast" button, city name & forecast cards.
        $('.form').fadeOut(100, function() {
            weatherReport(lat, long);
            $('.screen').append('<button id="back">New Forecast</button><h3 class="city">' + city_name + '</h3><ul class="list-reset fadein-stagger" id="forecast"></ul>');
              getRequest(searchTerm);
        });
    }

});

function getRequest(searchTerm) {
    $.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + searchTerm + '")&format=json', function (data) {
        /* Check that a place was found (we'll just grab the first) */
         let forecast = data.query.results.channel.item.description;
        forecast = forecast.substring(0,forecast.length-3);
        forecast = forecast.replace(/Low/g," Low");

        if (data.query.results === null) {
            bootbox.alert("Location not found: " + location + "!");

        } else {
            $('.screen').append('<h1 class = "yahoo">'+ 'Alternate Weather from Yahoo' +'</h1>'+'<h2>' + data.query.results.channel.item.title + '</h2>' +
                forecast);

        }

    });

}


// "new forecast" button. Allow user
// to return to forecast form.
$('body').on('click', '#back', function() {
    window.location.reload(true);
})


// =================================================
// Report City & AutoFill Coords
// =================================================

function insertGoogleScript() {
    var google_api = document.createElement('script'),
            api_key    = 'AIzaSyANTOAz8zmLLOI0CdfBssX33d7daKgaI8s';

    // Inject the script for Google's API and reference the initGoogleAPI
    // function as a callback.
    google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
    document.body.appendChild(google_api);
}


// SearchBox Method
function initGoogleAPI() {
    var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

    autocomplete.addListener('places_changed', function() {
        var place = autocomplete.getPlaces()[0];
        document.querySelector("#latitude").value = place.geometry.location.lat();
        document.querySelector("#longitude").value = place.geometry.location.lng();
    });


}


insertGoogleScript()