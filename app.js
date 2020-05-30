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
    $(response).each((i, v) => {
        countriesList.push(v.name);
    })
    // console.log(response);
    // console.log(countriesList);
});

// Load Google Map
async function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        //GPS coordinate for map to centre on
        // aprox level of details/ zoom: 1: World, 5:andmass/continent, 10:City, 15:Streets, 20:Buildings
        center: { lat: -33.8688, lng: 151.2093 },
        zoom: 1
    });
}

// Auto Suggest countries
$(() => {
    $("#searchField").autocomplete({
        source: countriesList
    });
});


// On submit
let $error = $(".error");
let $results = $(".results");
let $serachField = $("#searchField")

$("#submitBtn").on("click", () => {

    let country = "";
    $error.empty();
    $(".no").html("0");
    $("[role='status'").empty();
    $(".hour").remove();

    // Search a country
    if ($serachField.val().length != 0) {
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
            if (response.length == 0) {
                $error.append("Country not found. Try again.")                              // If result is empty
            } else {
                $("#country").html(response[0].country);
                $("#confirmed").html(response[0].confirmed);
                $("#active").html(response[0].confirmed - (response[0].recovered + response[0].critical + response[0].deaths));
                $("#critical").html(response[0].critical);
                $("#deaths").html(response[0].deaths);
                $("#recovered").html(response[0].recovered);
                $($results).append(`<div class="hour">Updated last ${moment(response[0].lastChange).fromNow()}</div>`);

                // clear previous marker
                // if (markers.length != 0){markers.setMap(null);}  // figure out how to clear the previous markers
                // add marker
                var marker = new google.maps.Marker({
                    position: { lat: response[0].latitude, lng: response[0].longitude },
                    map: map,
                    title: response[0].country,
                });

                // info window when clicked
                var infowindow = new google.maps.InfoWindow({
                    content: `<div>
                    <img src="https://www.countryflags.io/${response[0].code}/shiny/64.png">
                    <p>${response[0].confirmed}<span> confirmed</span></p>
                    <p>${response[0].confirmed - (response[0].recovered + response[0].critical + response[0].deaths)}<span> active</span></p>
                    <p>${response[0].critical}<span> critical</span></p>
                    <p>${response[0].deaths}<span> deaths</span></p>
                    <p>${response[0].recovered}<span> recovered</span></p>   
                    </div>`
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });

                // Fun little animation
                marker.addListener('click', toggleBounce);
                function toggleBounce() {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }
                map.setCenter(marker.getPosition());
                map.setZoom(4);
            }
            console.log(response);
        }).catch((e) => {
            $error.append("Oops! An Error Occurred. Something is broken. Please let us know what you were doing when this error occurred. We will fix it as soon as possible. Sorry for any inconvenience caused.")
        });
    } else {
        $error.append("Field is empty");
    }
    $serachField.val("");
})

// Quiz
const myQuestions = [
    {
        question: "question 1",
        answers: {
            a: "answer a",
            b: "answer b",
            c: "answer c"
        },
        correctAnswer: "c",
        explain: "Explain a"
    },
    {
        question: "question 2",
        answers: {
            a: "answer a",
            b: "Tanswer b",
            c: "answer c"
        },
        correctAnswer: "c",
        explain: "Explain b"
    },
    {
        question: "question 3",
        answers: {
            a: "answer a",
            b: "answer b",
            c: "answer c",
        },
        correctAnswer: "a",
        explain: "Explain b"
    }
];

// show questions - Work on how to rolate questions later

// on ready
$(() => {
    $(".question").append(`<p>${myQuestions[0].question}</p>
    <div class="answers" id="a">
    <input type="radio" value="a">
    <label>${myQuestions[0].answers.a}</label>
    </div>
    <div class="answers" id="b">
    <input type="radio" value="b">
    <label>${myQuestions[0].answers.b}</label>
    </div>
    <div class="answers" id="c">
    <input type="radio" value="c">
    <label>${myQuestions[0].answers.c}</label>
    </div>
  `);
    // $(".next").prop("disabled", true);
    startQuiz();
    console.log($('.radioInput').length);
});

// click answer - disable all other answers and show results , display explaination and color

// Click > disable all other answers
function startQuiz() {
    let radioBtns = $('input[type="radio"]');

    // click any radio
    $(radioBtns.on("click", (e) => {
        console.log(e);
        $(radioBtns).attr("disabled", true);  // disable all radio buttons

        // get current answer - CLEAN UP to make it DRY
        currentRadio = e.target;
        console.log(currentRadio.value);
        // check if answeser is correct, if yes current radio turns green and display Correct or tick
        if (currentRadio.value == myQuestions[0].correctAnswer) {
            $(`#${currentRadio.value}`).addClass("correct-answer");
            //display explaination - how back when at step to roate the questions to display sepcfic ansser explaination
            explain("Correct");
        }
        // else current radio turns red and display Flase or cross & correct answer turns green
        else {
            $(`#${currentRadio.value}`).addClass("wrong-answer");
            $(`#${myQuestions[0].correctAnswer}`).addClass("correct-answer");
            explain("Wrong");
        }

        $(".next").prop("disabled", false);   // enable next button

        function explain(status) {
            $(".question").append(`<p>${status}! ${myQuestions[0].explain}</p>`);
        }
    })
    )

    // click next and when question is finished, stop
    let count = 0;


    $(".next").on("click", (e) => {

        //action
        count++
        if (count <= 2) {

            console.log("Next Clicked!")
            console.log(count);
        } else {
            $(".next").prop("disabled", false);
        }
    }
    )
}
