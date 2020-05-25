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

// Auto Suggest countries
$(()=>{
    $("#searchField").autocomplete({
      source: countriesList
    });
  });


// On submit
let $error = $(".error");
let $results = $(".results");

$("#submitBtn").on("click", ()=>{

    let country = "";
    $error.empty();
    $results.empty();
    $("[role='status'").empty();

// Search a country
if($("#searchField").val().length != 0){
    country = $("#searchField").val();

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
            $error.append("Country not found. Try again.")
        } else{
            $results.append(`
            <li class="country">Country: ${response[0].country}</li>
            <li class="confirmed">Confirmed Cases: ${response[0].confirmed}</li>
            <li class="critical">Crital: ${response[0].critical}</li>
            <li class="deaths">Death:${response[0].deaths}</li>
            <li class="recovered">Death:${response[0].recovered}</li>
            `);
        }
        console.log(response);
    }).catch((e) => {
        // console.log(e);
        $error.append("Oops! An Error Occurred. Something is broken. Please let us know what you were doing when this error occurred. We will fix it as soon as possible. Sorry for any inconvenience caused.")
    });

// If sucess find the value in the name array

// If sucess print the result
} else{
    $error.append("Field is empty");
}
})