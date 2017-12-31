var content;
var fs = require('fs');
var current = 0;   // current status. 0 equals acceptable, 1 equals too cold, 2 equals too hot
var futureH = 0;  // high for the day. 0 equals acceptable, 1 equals too cold, 2 equals too hot 
var futureL = 0; // low for the day. 0 equals acceptable, 1 equals too cold, 2 equals too hot
var tooRainy = 0; // rain for the day. 0 equals acceptable, 1 equals too rainy
var tooWindy = 0; // wind at the moment. 0 equals acceptable, 1 equals too windy
module.exports = {
	process: function(low, high, precip, wind){
		fs.readFile('output.json',  function read(err, data) {
			content = JSON.parse(data); 
			console.log(content);
			if (parseInt(content.cTemp) <= low)
			{
				if (content.cTemp == -255)
				{
					content.cTemp = "N/A";
				}
				else 
				{
					current = 1;
				}
			}
			else if(parseInt(content.cTemp) <= high)
			{
				current = 2;
			}
			if (parseInt(content.hTemp) <= low)
			{
				if (content.hTemp == -255)
				{
					content.hTemp = "N/A";
				}
				else 
				{
					futureH = 1;
				}
			}
			else if(parseInt(content.hTemp) <= high)
			{
				futureH = 2;
			}
			if (parseInt(content.lTemp) <= low)
			{
				if (content.lTemp == -255)
				{
					content.lTemp = "N/A";
				}
				else 
				{
					futureL = 1;
				}
			}
			else if(parseInt(content.lTemp) <= high)
			{
				futureL = 2;
			}
			if (parseFloat(content.precip) >= precip)
			{
				tooRainy = 1;
			}
			if (parseInt(content.wind) >= wind)
			{
				tooWindy = 1;
			}
			var PushBullet = require('pushbullet');
			var pusher = new PushBullet('o.1Mop8fhOwYrdcRpRYXBB05lzs3YkHNcu');
			var options = {
				limit: 10
			};
			var weatherResults = formatString();
			pusher.devices(function(error, response) {
				console.log(response);
				
				pusher.note('', 'Today\'s weather forecast', weatherResults, function(error, response) {});
			});
		})
	}
}

function formatString() {
	var decision = testCondition();
	var weather = weatherInfo();
	
	return weather + decision;
}

function testCondition(){
	var riding = 1;
	var reasons = "What to look out for if you decide to ride today: \n\n";
	switch (current)
	{
		case 1:
			if (current != -255)
			{
				riding = 0;
				reasons = reasons + "It is currently very cold.\n";
				break;
			}
		case 2:
			riding = 0;
			reasons = reasons + "It is currently very hot.\n";
			break;
	}
	switch (futureH)
	{
		case 1:
			if (futureH != -255)
			{
				riding = 0;
				reasons = reasons + "Today\'s high is still very cold.\n";
				break;
			}
		case 2:
			riding = 0;
			reasons = reasons + "Today\'s high is very hot.\n";
			break;
	}
	switch (futureL)
	{
		case 1:
			if (futureL != -255)
			{
				riding = 0;
				reasons = reasons + "Today\'s low is very cold.\n";
				break;
			}
		case 2:
			riding = 0;
			reasons = reasons + "Today\'s low is still very hot.\n";
			break;
	}
	switch (tooRainy)
	{
		case 1:
			riding = 0;
			reasons = reasons + "There will be too much precipitation\n";
			break;
	}
	switch (tooWindy)
	{
		case 1:
			riding = 0;
			reasons = reasons + "It is too windy today.\n";
			break;
	}
	if (riding == 0)
	{
		return "Today might not be the best riding weather. \n\n" + reasons;
	}
	return "Today looks like a good day to ride.\n";
}


function weatherInfo()
{
	var value = "";
	value = value + "Current Temp: " + content.cTemp + "°F\n";
	value = value + "Today's High: " + content.hTemp + "°F\n";
	value = value + "Today's Low: " + content.lTemp + "°F\n";
	value = value + "Precipitation In Inches: " + content.precip + "in\n";
	value = value + "Wind Speed: " + content.wind + " mph\n\n";
	return value;
}