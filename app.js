// Seperate after
let $error = $(".error");
let $results = $(".results");

$("#submitBtn").on("click", ()=>{

    let country = "myanmar";
    $error.empty();
    $results.empty();

// Search a country
if($("#searchField").val().length != 0){
    country = $("#searchField").val();

    // Get API
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://covid-19-data.p.rapidapi.com/country?format=json&name=${country}`,
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
            <li class="deaths">Death: ${response[0].deaths}</li>
            `);
        }
        console.log(response);
    }).catch((e) => {
        console.log(e);
        $error.children().remove();
        $error.append("Oops! An Error Occurred. Something is broken. Please let us know what you were doing when this error occurred. We will fix it as soon as possible. Sorry for any inconvenience caused.")
    });

// If sucess find the value in the name array

// If sucess print the result
} else{
    $error.append("Field is empty");
}
})