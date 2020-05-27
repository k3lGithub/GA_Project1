// Refactor and seperate after

// Get All Countries

let countriesList = [];
$.ajax({
	"async": true,
	"crossDomain": true,
	"url": "https://covid-19-data.p.rapidapi.com/help/countries?format=json",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"x-rapidapi-key": "f61dae476fmsha5531a1479de271p1cc549jsn9081e48db9e3"
	}
}).done(function (response) {
    $(response).each((i, v)=>{
        countriesList.push(v.name);
    })
    // console.log(response);
    // console.log(countriesList);
});

// Load Google Map
async function initMap() {
    let latLng = { lat: -33.8688, lng: 151.2093 };
    map = new google.maps.Map(document.getElementById("map"), {
        //GPS coordinate for map to centre on
        // aprox level of details/ zoom: 1: World, 5:andmass/continent, 10:City, 15:Streets, 20:Buildings
        center: latLng,
        zoom: 1
    });
}
    
// Auto Suggest countries
$(()=>{
    $("#searchField").autocomplete({
      source: countriesList
    });
  });


// On submit
let $error = $(".error");
let $results = $(".results");
let $serachField = $("#searchField")

$("#submitBtn").on("click", ()=>{

    let country = "";
    $error.empty();
    $(".no").html("0");
    $("[role='status'").empty();

// Search a country
if($serachField.val().length != 0){
    country = $serachField.val();

    // Get API
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://covid-19-data.p.rapidapi.com/country?format=json&name=${country}`, // getDailyReportByCountryCode, Reason: getDialyReportAllCountries is not free T.T
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key": "f61dae476fmsha5531a1479de271p1cc549jsn9081e48db9e3"
        }
    }
    $.ajax(settings).done(function (response) {
        if(response.length == 0){
            $error.append("Country not found. Try again.")                              // If result is empty
        } else{
            $("#country").html(response[0].country);
            $("#confirmed").html(response[0].confirmed);
            $("#active").html(response[0].confirmed - (response[0].recovered + response[0].critical + response[0].deaths));
            $("#critical").html(response[0].critical);
            $("#deaths").html(response[0].deaths);
            $("#recovered").html(response[0].recovered);
            $($results).append(`<div class="hour">Updated last ${moment(response[0].lastChange).fromNow()}</div>`);
        }
        console.log(response);
    }).catch((e) => {
        $error.append("Oops! An Error Occurred. Something is broken. Please let us know what you were doing when this error occurred. We will fix it as soon as possible. Sorry for any inconvenience caused.")
    });
} else{
    $error.append("Field is empty");
}
$serachField.val("");
})