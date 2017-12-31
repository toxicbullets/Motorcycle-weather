var prompt;
var Processor;
var pref;
module.exports = {
	Intialize: function(){	
	  var properties = [
		{
		  name: 'MinRidingTemp', 
		  validator: /^[0-9\-\.]+$/,
		  message: ' Minimum Riding Tempurature In Fahrenheit',
		  warning: 'Temperature must only contain numeric values (decimals possible)'
		},
		{
		  name: 'MaxRidingTemp',
		  validator: /^[0-9\-\.]+$/,
		  message: 'Maximum Riding Tempurature In Fahrenheit',
		  warning: 'Temperature must only contain numeric values (decimals possible)'
		},
		{
		  name: 'MaxPrecipatation', 
		  validator: /^[0-9\-\.]+$/,
		  message: 'Max Precipatation In Inches',
		  warning: 'Precipatation must be a numeric value (decimals possible)'
		},
		{
		  name: 'MaxWindSpeed',
		  validator: /^[0-9\-\.]+$/,
		  message: 'Max Wind Speed In MPH',
		  warning: 'Max Wind Speed must be a numeric value (decimals possible)'
		}
	  ];

	   prompt = require('prompt');
	   Processor = require('./WeatherProcessor');
	   prompt.start();
	   	
	  prompt.get(properties, function (err, result) {
		if (err) { return onErr(err); }
		console.log('Command-line input received:');
		console.log('  Min Riding Temp: ' + result.MinRidingTemp);
		console.log('  Max Riding Temp: ' + result.MaxRidingTemp);
		console.log('  Max Precipatation In Inches: ' + result.MaxPrecipatation);
		console.log('  Max Wind Speed: ' + result.MaxWindSpeed);
		pref = result;
	  });

	  function onErr(err) {
		console.log(err);
		return 1;
	  }
	},
	
	dataRecieved: function(low, high, precip, wind){
		console.log("Processor started" + pref.MinRidingTemp);
		Processor.process(pref.MinRidingTemp, pref.MaxRidingTemp, pref.MaxPrecipatation, pref.MaxWindSpeed);
	}
}