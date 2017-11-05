// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   tdn_weather.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: ghippoda <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2017/11/05 15:15:43 by ghippoda          #+#    #+#             //
//   Updated: 2017/11/05 16:11:34 by ghippoda         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

var http = require('http');

let rawData = "";

function printMessage(city, temp)
{
	console.log("A " + city + " la temperature est de " + (temp - 273.15).toFixed(0) + " degree");
}

function printError(error){
	console.error(error.message)
}

function get(city){

	var	 request = http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=8eeaa422e8a43b7701e0d3ad71f492c4", function(reponse){
		reponse.on('data', function(chunk) {
			rawData += chunk;
		});
		reponse.on('end', function() {

			if (reponse.statusCode === 200)
			{
				try {
					var parsed = JSON.parse(rawData);
					temp = parsed.main.temp;
					printMessage(city, temp);
				}catch(error) {
					console.error(error.message);
				}
			} else
			{
				console.error({ message: " Impossible de recupere les informations"});
			}
		});
	});
	request.on('error', printError);
}

module.exports.get = get;


