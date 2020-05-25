var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://covid-19-data.p.rapidapi.com/help/countries?format=json",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"x-rapidapi-key": "f61dae476fmsha5531a1479de271p1cc549jsn9081e48db9e3"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});