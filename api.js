//Foundation search bar
$(document).foundation();
$('.search').on('click', function (event) {
    $(".search-field").toggleClass("expand-search");
    // if the search field is expanded, focus on it
    if ($(".search-field").hasClass("expand-search")) {
        $(".search-field").focus();
    }
});

// GLOBAL VARIABLES
var cityInput = $("#city-input");
var cityName = "";
var cityNameTag = $("<h3>");
var tempTag = $("<p>");
var humidityTag = $("<p>");
var windTag = $("<p>");
var currentWeather = $("#current-weather");
var weatherTag = $("<p>");
var weather = "";
var weaBlock = $("#weather-block");
var inputSto = $("#input-storage");
var mainGif = $("#main-gif");
var searchCity = false;
var listItem = "";

// Local storage
var storedSearch = localStorage.getItem("list");
var searchList = storedSearch ? JSON.parse(storedSearch) : []


// function for current weather API call
function currentWeatherAPI(e) {
    // stop search unless user presses the Enter key. The Keycode for "enter" is the numer 13 - thanks Jess!
    if (e.keyCode !== 13) {
        return;
    }

    // store the input info from cityInput as value to be passed in function below
    cityName = cityInput.val();
    console.log("city searched: " + cityName);

    // building out container for weather info
    currentWeather.addClass("current-weather");
    // assign cityName to h3 tag
    $(cityNameTag).text(cityName);
    // append h3 tag to page
    currentWeather.append(cityNameTag);

    var apiKey = "c7cde66d595fb98577da25bd96a3df85";
    // query URL for city weather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    // API call for city weather
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("WEATHER QUERY URL - " + queryURL);

            // variable to get icon for todays weather
            var todayIcon = response.weather[0].icon;
            // assign value to todayIconURL
            var todayIconURL = "https://openweathermap.org/img/wn/" + todayIcon + ".png";
            // append todayIconURL next to cityNameTag
            $("cityNameTag").append("<img src =" + todayIconURL + ">");

            // create variables and assign weather info as text
            weather = response.weather[0].main;
            $(weatherTag).text("Weather: " + weather);
            var tempF = Math.floor((response.main.temp - 273.15) * 1.8 + 32);
            $(tempTag).text("Temperature: " + tempF + "°F");
            var humidity = response.main.humidity
            $(humidityTag).text("Humidity: " + humidity + "%");
            var windSpeed = response.wind.speed;
            $(windTag).text("Wind Speed: " + windSpeed + " MPH");

            // append weather info onto page
            $(currentWeather).append(weatherTag, tempTag, humidityTag, windTag,);
            mainGif.hide();
            weaBlock.show();
            inputSto.show();

            // call function to retrieve city images
            displayImg();
            createGif();
        });
}

// create function that pulls id of city button, calls API to gather images and append to carousel
function displayImg() {

    // clear div containing images
    $("#img-gallery").empty();

    var apiKey = "duheouvYAukp2dG98jzVI1Y2VnHKe-PnTeWRmeKt5ss";
    // API Query call
    var queryURL = "https://api.unsplash.com/search/photos?query=" + cityName + "&count=10&orientation=landscape&client_id=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("UNSPLASH QUERY URL - " + queryURL);

            // for-loop to create tags for images and append to carousel
            for (var i = 0; i < response.results.length; i++) {
                //create div tag that will contain img and append carousel-item classes
                var divImg = $("<div>").addClass("carousel-item");
                divImg.attr("id", i);

                //create img tag that will contain city img and append d-block w-100 classes
                var cityImg = $("<img>").addClass("d-block w-100");
                $(cityImg).attr("src", `${response.results[i].urls.regular}`);
                $(cityImg).attr("alt", cityName);

                // append cityImg to divImg
                $(divImg).append(cityImg);
                // append divImg to img-gallery id
                $("#img-gallery").append(divImg);

                var firstImgTag = $("#0").addClass("active");
            }

            // local storage function
            storeData();

        });
}

// using weather from currentWeather, search gifs, create tags and append to gif-gallery
function createGif() {

    // clear div containing gifs
    $("#weather-gif").empty();

    var apiKey = "sybBXVqNNyH0EPjFu28Tl0KiGOaCADFu";

    // query URLs for giphy search - testing out 2 different ones
    // var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + weather + "&limit=10&api_key=" + apiKey;
    var queryUrl = "https://api.giphy.com/v1/gifs/random?tag=" + weather + "&limit=10&api_key=" + apiKey;

    // ajax for RANDOM queryURL
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (response) {

            console.log("GIF QUERY URL - " + queryUrl);
            console.log("GIF URL - " + response.data.images.original.url);

            var weatherGif = $("<img>").addClass("col-lg-7 center");
            $(weatherGif).attr("src", response.data.images.original.url);
            $(weatherGif).attr("alt", weather);
            $("#weather-gif").append(weatherGif);
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
    //         $("").append(gifGallery);
    //     });
    // }
}

// function for local storage
function storeData() {
    // Push the input into local storage
    searchList.push(cityName);
    localStorage.setItem("list", JSON.stringify(searchList));
    const listGroup = $(".list-group-item");

    //Limit number of stored items on the page to 5
    if (listGroup.length > 4) {
        $(listGroup.get(4)).remove();
    }

    $("#input-storage").prepend(`<li class="list-group-item list-group-item-primary mb-1" id="${cityName}">${cityName}</li>`);
    searchList.reverse().slice(0, 5).forEach((citySearch) => {
        $("input-storage").append(`<li class="list-group-item list-group-item-primary mb-1" id="${cityName}">${citySearch}</li>`);
    });

    // user clicks on city from list
    $("li").on("click", function (event) {
        listItem = $(event.target).attr("id");
        console.log(listItem);
        searchCity = true;
        searchCityAgain();
    });

}



// function when city has been clicked
function searchCityAgain() {
    // stop search unless user presses the Enter key. The Keycode for "enter" is the numer 13 - thanks Jess!
    if (searchCity === false) {
        return;
    }

    // store the input info from cityInput as value to be passed in function below
    cityName = listItem;
    console.log("city clicked from list: " + cityName);

    // building out container for weather info
    currentWeather.addClass("current-weather");
    // assign cityName to h3 tag
    $(cityNameTag).text(cityName);
    // append h3 tag to page
    currentWeather.append(cityNameTag);

    var apiKey = "c7cde66d595fb98577da25bd96a3df85";
    // query URL for city weather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    // API call for city weather
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("WEATHER QUERY URL - " + queryURL);

            // variable to get icon for todays weather
            var todayIcon = response.weather[0].icon;
            // assign value to todayIconURL
            var todayIconURL = "https://openweathermap.org/img/wn/" + todayIcon + ".png";
            // append todayIconURL next to cityNameTag
            $("cityNameTag").append("<img src =" + todayIconURL + ">");

            // create variables and assign weather info as text
            weather = response.weather[0].main;
            $(weatherTag).text("Weather: " + weather);
            var tempF = Math.floor((response.main.temp - 273.15) * 1.8 + 32);
            $(tempTag).text("Temperature: " + tempF + "°F");
            var humidity = response.main.humidity
            $(humidityTag).text("Humidity: " + humidity + "%");
            var windSpeed = response.wind.speed;
            $(windTag).text("Wind Speed: " + windSpeed + " MPH");

            // append weather info onto page
            $(currentWeather).append(weatherTag, tempTag, humidityTag, windTag,);
            mainGif.hide();
            weaBlock.show();
            inputSto.show();

            // call function to retrieve city images
            displayImgAgain();
            createGifAgain();
        });
}

// create function that pulls id of city button, calls API to gather images and append to carousel
function displayImgAgain() {

    // clear div containing images
    $("#img-gallery").empty();

    var apiKey = "duheouvYAukp2dG98jzVI1Y2VnHKe-PnTeWRmeKt5ss";
    // API Query call
    var queryURL = "https://api.unsplash.com/search/photos?query=" + cityName + "&count=10&orientation=landscape&client_id=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("UNSPLASH QUERY URL - " + queryURL);

            // for-loop to create tags for images and append to carousel
            for (var i = 0; i < response.results.length; i++) {
                //create div tag that will contain img and append carousel-item classes
                var divImg = $("<div>").addClass("carousel-item");
                divImg.attr("id", i);

                //create img tag that will contain city img and append d-block w-100 classes
                var cityImg = $("<img>").addClass("d-block w-100");
                $(cityImg).attr("src", `${response.results[i].urls.regular}`);
                $(cityImg).attr("alt", cityName);

                // append cityImg to divImg
                $(divImg).append(cityImg);
                // append divImg to img-gallery id
                $("#img-gallery").append(divImg);

                var firstImgTag = $("#0").addClass("active");
            }
        });
}

// using weather from currentWeather, search gifs, create tags and append to gif-gallery
function createGifAgain() {

    // clear div containing gifs
    $("#weather-gif").empty();

    var apiKey = "sybBXVqNNyH0EPjFu28Tl0KiGOaCADFu";

    // query URLs for giphy search - testing out 2 different ones
    var queryUrl = "https://api.giphy.com/v1/gifs/random?tag=" + weather + "&limit=10&api_key=" + apiKey;

    // ajax for RANDOM queryURL
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (response) {

            console.log("GIF QUERY URL - " + queryUrl);
            console.log("GIF URL - " + response.data.images.original.url);

            var weatherGif = $("<img>").addClass("col-lg-7 center");
            $(weatherGif).attr("src", response.data.images.original.url);
            $(weatherGif).attr("alt", weather);
            $("#weather-gif").append(weatherGif);
        });
}

// user clicks Enter, function kicks off to get current weather, city images and weather gif
cityInput.on("keypress", currentWeatherAPI);
