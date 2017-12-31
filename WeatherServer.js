var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var current, high, low, precipatation, wind;
var json = { cTemp : "", hTemp : "", lTemp : "", precip: "", wind: ""};
const Schedule = require('./Scheduler');
app.get('/scrape', function(req, res){
		// The URL we will scrape from - in our example Anchorman 2.
	//precip page
	url = 'https://www.wunderground.com/precipitation/us/va/blacksburg/24060?cm_ven=localwx_modprecip';
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			$('.precip-amount-value').filter(function(){
				var data = $(this);
				precipatation = data.text().trim();
				precipatation = precipatation.substring(0, precipatation.length - 2);
				json.precip = checkValues(precipatation);
			})
					// To write to the system we will use the built in 'fs' library.
			// In this example we will pass 3 parameters to the writeFile function
			// Parameter 1 :  output.json - this is what the created filename will be called
			// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
			// Parameter 3 :  callback function - a callback function to let us know the status of our function

			fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
				console.log('File successfully written! - Check your project directory for the output.json file');
				Schedule.dataRecieved();
			})

			// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
			res.send('Check your console!');

		}
		else{
			console.log("ERRRRRRRRRRRROR");
		}
	})
	url = 'https://www.wunderground.com/weather/us/va/blacksburg';
		
	request(url, function(error, response, html){
			if(!error){
			var $ = cheerio.load(html);

		

		$('.condition-data').filter(function(){
			var data = $(this);
			current = data.children().first().next().text().trim().replace(/[^0-9\-]/g,'');    
			high = data.children().first().children().first().text().replace(/[^0-9\-]/g,'');
			low = data.children().first().children().last().text().replace(/[^0-9\-]/g,'');
			json.cTemp = checkValues(current);
			console.log(current);
			json.hTemp = checkValues(high);
			console.log(high);
			json.lTemp = checkValues(low);
			console.log(low);
		})

		$('.wind-speed').filter(function(){
			var data = $(this);
			wind = data.children().text().replace(/\D/g,'');
			json.wind = checkValues(wind);
			console.log(wind);
		})
	}
	else{
		console.log("ERRRRRRRRRRRROR");
	}
	
	});
})

function checkValues(value)
{
	if (isNaN(value))
	{
		return -255;
	}
	return value;
}
var CronJob = require('cron').CronJob;
var job = new CronJob('00 30 10 * * 0-6', function() {
	var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:8081/scrape");
	console.log("Timer");
	xhr.send(null);
	
}, null, true, 'America/New_York');

app.listen('8081')

console.log('Magic happens on port 8081');

//Intialize the desired values
Schedule.Intialize();

exports = module.exports = app;