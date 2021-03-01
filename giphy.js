// foundation Search button
$(document).foundation();
$(function () {
    $('.search')
        .bind('click', function (event) {
            $(".search-field").toggleClass("expand-search");

            // if the search field is expanded, focus on it
            if ($(".search-field").hasClass("expand-search")) {
                $(".search-field").focus();
            }
        })
});


// GLOBAL VARIABLES
// assign city name entered by user to variable
var cityName = $("#city-search");
// variable that will contain weather condition
var currentWeather = "";
// variable to contain temp in Fahrenheit
var tempF = "";
// variable to contain wind speed
var windSpeed = "";
// array to contain key words to search for gifs
var weatherKeys = [];
// array to contain gif URLs
var gifURLs = [];


// retrieve weather conditions for city entered by user
function getWeather() {
    var apiKey = "";
    // query URL for city weather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    // API call for city weather
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURL);

            // get weather conditions for city - assign to variables
            currentWeather = response.weather[0].main;
            console.log("Weather: " + currentWeather);
            tempF = Math.floor((response.main.temp - 273.15) * 1.8 + 32);
            console.log("Temp: " + tempF);
            windSpeed = response.wind.speed;
            console.log("Wind speed: " + windSpeed);

            // push weather condition to weatherKeys array
            weatherKeys.push(currentWeather);
            // call function to gather similar terms for weather condition
            getGifKeys();
        });
}

// search for similar key terms based on weather condition to use to get gif URLs
function getGifKeys() {
    var apiKey = "";

    // use this API call to get collection of words similar to currentWeather
    var queryUrl = "https://api.giphy.com/v1/gifs/search/tags?q=" + currentWeather + "&limit=10&api_key=" + apiKey;

    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryUrl);

            // loop thru response and retreive key term
            for (var i = 0; i < response.data.length; i++) {
                var gifKey = response.data[i].name;
                console.log(gifKey);
                // push key term to weatherKeys array
                weatherKeys.push(gifKey);
            }
            // show list of weather conditions
            console.log(weatherKeys);
            // call function to find gifs and append to page
            createGif();
        });
}

// using values from getGifKeys, search gifs, create tags and append to gallery
function createGif() {
    var apiKey = "";

    for (var i = 0; i < weatherKeys.length; i++) {

        // query URLs for giphy search - testing out 2 different ones
        // var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + weatherKeys[0] + "&limit=10&api_key=" + apiKey;
        var queryUrl = "https://api.giphy.com/v1/gifs/random?tag=" + weatherKeys[0] + "&limit=10&api_key=" + apiKey;

        gifURLs.push(queryUrl);
        console.log("RESPONSE - " + gifURLs[i]);

        // ajax for RANDOM queryURL
        $.ajax({
            url: gifURLs[i],
            method: "GET"
        })
            .then(function (response) {
                var gifURL = response.data.images.original.url;
                console.log("GIF URL - " + gifURL);
                var gifTitle = response.data.title;

                // create div tag to contain img tag
                var gifGallery = $("<div>").addClass("carousel-item");
                // create img tag to contain gif
                var weatherGif = $("<img>").addClass("d-block w-100");
                // add link to gif and alt
                $(weatherGif).attr("src", gifURL);
                $(weatherGif).attr("alt", cityName + "-" + gifTitle);
                // append gif to gallery
                $(gifGallery).append(weatherGif);
                // append gallery to page
                $(".carousel-inner").append(gifGallery);
            });

        // ajax for SEARCH queryURL
        // $.ajax({
        //     url: gifURLs[i],
        //     method: "GET"
        // })
        //     .then(function (response) {
        //         var gifURL = response.data[0].images.original.url;
        //         console.log(gifURL);
        //         var gifTitle = response.data[0].title;

        //         // create div tag to contain img tag
        //         var gifGallery = $("<div>").addClass("carousel-item");
        //         // create img tag to contain gif
        //         var weatherGif = $("<img>").addClass("d-block w-100");
        //         // add link to gif and alt
        //         $(weatherGif).attr("src", gifURL);
        //         $(weatherGif).attr("alt", cityName + "-" + gifTitle);
        //         // append gif to gallery
        //         $(gifGallery).append(weatherGif);
        //         // append gallery to page
        //         $(".carousel-inner").append(gifGallery);
        //     });
    }
}

// checks if user has entered a city and kicks off process to generate weather gifs based on city weather condition
$(".search").on("click", function (event) {
    cityName = $("#city-search").val();

    if (cityName === "") {
        console.log("enter a city name");
    }
    else {
        // display city name user chose
        console.log("user chose: " + cityName);

        // call funtion to get weather conditions for city
        getWeather();
    }

});







// TO-DO
// at any moment, when user clicks search button, delete any generated gifs from page
// - have a restart function with a refresh button?
//      - when refresh button is clicked, refresh page
//          - location.reload();
// 
// BONUS -> use fancy search that auto-fills city name


