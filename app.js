// ====================================== Map Start ======================================

let countriesList = [];
let $error = $(".error");
let $results = $(".results");
let $serachField = $("#searchField");

// Get All Countries
$.ajax({
    "async": true,
    "crossDomain": true,
    "url": "https://covid-19-data.p.rapidapi.com/help/countries?format=json",
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "f61dae476fmsha5531a1479de271p1cc549jsn9081e48db9e3"
    }
}).done(function (r) {
    $(r).each((i, v) => {
        countriesList.push(v.name);
    })
    // console.log(r);
    $("#searchField").autocomplete({            // Auto Suggest countries
        source: countriesList
    });
});

// Load Google Map
async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -33.8688, lng: 151.2093 },
        zoom: 1
    });
}

// Get Countries details on submit
$("#submitBtn").on("click", () => {
    let country = "";

    clearPreviousData();

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
        $.ajax(settings).done(function (r) {
            let data = r[0];
            if (r.length === 0) {
                $error.append("Country not found. Try again.")                              // If result is empty
            } else {
                $("#country").html(data.country);
                $("#confirmed").html(data.confirmed);
                $("#active").html(data.confirmed - (data.recovered + data.critical + data.deaths));
                $("#critical").html(data.critical);
                $("#deaths").html(data.deaths);
                $("#recovered").html(data.recovered);
                $($results).append(`<div class="hour">Updated last ${moment(data.lastChange).fromNow()}</div>`);

                // clear previous marker
                // *********************************** if (markers.length != 0){markers.setMap(null);}  // figure out how to clear the previous markers 

                // add marker
                var marker = new google.maps.Marker({
                    position: { lat: data.latitude, lng: data.longitude },
                    map: map,
                    title: data.country,
                });

                setInfoWindow(data, map, marker);           // info window when clicked

                marker.addListener('click', toggleBounce);      // Fun little animation
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
            // console.log(r);
        }).catch((e) => {
            $error.append("Oops! An Error Occurred. Something is broken. Please let us know what you were doing when this error occurred. We will fix it as soon as possible. Sorry for any inconvenience caused.")
        });
    } else {
        $error.append("Field is empty");                    // validation
    }
    $serachField.val("");                                   // reset search
})

// ====================================== Map Functions ======================================

function setInfoWindow(data, map, marker) {
    let infowindow = new google.maps.InfoWindow({
        content: `
        <div>
           <img src="https://www.countryflags.io/${data.code}/shiny/64.png">
           <p>${data.confirmed}<span> confirmed</span></p>
           <p>${data.confirmed - (data.recovered + data.critical + data.deaths)}<span> active</span></p>
           <p>${data.critical}<span> critical</span></p>
           <p>${data.deaths}<span> deaths</span></p>
           <p>${data.recovered}<span> recovered</span></p>
        </div>
        `
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
}

let clearPreviousData = () => {
    $error.empty();
    $("#country").html("Coutnry");
    $(".no").html("0");
    $("[role='status'").empty();
    $(".hour").remove();
}

// ====================================== Map Finish ======================================
// Quiz
const myQuestions = [
    {
        ques: "What are the most common symptoms of COVID-19?",
        ans: {
            a: "Sneezing and a runny nose.",
            b: "Chest pains and fever.",
            c: "High temperature, cough and tiredness."
        },
        correctAns: "c",
        explain: "The most common symptoms of COVID-19 are fever, tiredness, and a dry cough. It’s less common for people to experience sneezing and a runny nose. There is no suggestion that chest pains or vomiting are associated with the virus."
    },
    {
        ques: "How long can the virus survive on plastic and stainless steel surfaces, according to studies?",
        ans: {
            a: "72 hours or more",
            b: "24 to 60 hours",
            c: "4 to 12 hours"
        },
        correctAns: "a",
        explain: "Yes, it has been detected on a surface up to three days after initial contamination according to one study - and as long as seven days according to another. That's why it is important to keep washing your hands, and to avoid touching your face as much as possible"
    },
    {
        ques: "What is more effective at removing the coronavirus from your hands",
        ans: {
            a: "Alcohol-based hand sanitiser",
            b: "Soap and water",
            c: "hot water"
        },
        correctAns: "b",
        explain: "Soap loosens the lipids in the virus membrane, causing its structure to collapse and making the virus inactive. Alcohol-based hand sanitiser is still useful for removing the virus if soap and warm water is unavailable, but it is not as effective"
    }
];

let count = 0;
let currentQues = myQuestions[count];

// on ready
$(() => {
    prepareNext(count);
})

function prepareNext(count) {
    prepareQuiz(count);
    startQuiz(count);
}

// Show Questions
let prepareQuiz = (count) => {
    $(".question").html(`
    <p>${myQuestions[count].ques}</p>
    <div class="answers" id="a">
       <input type="radio" value="a">
       <label>${myQuestions[count].ans.a}</label>
    </div>
    <div class="answers" id="b">
       <input type="radio" value="b">
       <label>${myQuestions[count].ans.b}</label>
    </div>
    <div class="answers" id="c">
       <input type="radio" value="c">
       <label>${myQuestions[count].ans.c}</label>
    </div>
  `);
    $(".next").prop("disabled", true);
};

// click answer

// Click - disable all other answers
function startQuiz(count) {
    let radioBtns = $('input[type="radio"]');

    // click any radio
    $(radioBtns.on("click", (e) => {
        // console.log(e);
        $(radioBtns).attr("disabled", true);  // disable all radio buttons

        // get current answer
        currentRadio = e.target;

        // check if answer is correct, if yes current radio turns green and display Correct
        if (currentRadio.value == myQuestions[count].correctAns) {
            $(`#${currentRadio.value}`).addClass("correct-answer");
            explain("Correct", count);
        }

        // else current radio turns red and display correct answer
        else {
            $(`#${currentRadio.value}`).addClass("wrong-answer");
            $(`#${myQuestions[count].correctAns}`).addClass("correct-answer");
            explain("Wrong", count);
        }

        if (count < 2) {
            $(".next").prop("disabled", false);   // enable next button
            //click next
            $(".next").on("click", (e) => {
                count++;
                prepareNext(count);
            })
        } 
        // else {
        //     alert("Quiz Finished!");
        // }
    })
    )
}

function explain(status, count) {
    $(".question").append(`<p class="explain">${status}! ${myQuestions[count].explain}</p>`);
}