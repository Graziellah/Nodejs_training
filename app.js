// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: ghippoda <ghippoda@student.42.fr>          +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2017/11/05 18:02:17 by ghippoda          #+#    #+#             //
//   Updated: 2017/11/05 20:30:15 by ghippoda         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //


// Permet de faire des requetes HTTP vers d'autres sites
var request = require('request');
// Permet de creer de creer une API REST
var restify = require('restify');
// Librairie Microsoft qui permet de creer des robots
var builder = require('botbuilder');

// Configuration
var connectorAppId = process.env.MICROSOFT_APP_ID;
var connectorAppPassword = process.env.MICROSOFT_APP_PASSWORD;
var openWeatherMapAppId = '8eeaa422e8a43b7701e0d3ad71f492c4';

//Installation du server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function (){
	console.log('%s listening to %s', server.name, server.url);
});

// Creation du connecteur, ce dernier permet de au robot d'interagir avec les utilisateurs
// Il existe plusieurs type de connecteurs : 
//			-ConsoleConnector(permet de discuter directememt avec le robot depuuis la console)
//			-ChatConnector(permet de connecter le robot Microsoft Bot Connector(Skype, Faceboo, Slack) 
//			et au bot Framework Channell Emulator( outil permettant de simuler un service de messagerie pour faire des tests))
var connector = new builder.ChatConnector({
	appId: connectorAppId,
	appPassword: connectorAppPassword
});

var bot  = new builder.UniversalBot(connector);

server.post('api/messages', connector.listen());

// Intentdialog permet determiner quelle intention se cahce derriere chaque messages
var dialog = new builder.IntentDialog();
bot.dialog('/', dialog);

// Elaboration des dialogues
dialog.matches(/^Donne-moi la meteo/i, [
	function(session){
		builder.Prompts.text(session, 'De quelle ville voulez-vous connaitre la meteo?');
	},
	function (session, results){
		openWeathermap(results.response, function(success, previsions){
			if (!success)
				return session.send('Une erreur s\'est produite, veuilles reessayer.');
			var message = 'Voici la meteo pour ' + results.response + ':\n\n' +
				'-Temperature :' + previsions.temperature + 'C\n\n' +
				'-Humidite :' + previsions.humidity + '%\n\n' +
				'-Vent :' + previsions.wind + 'km/h\n\n';
			session.send(message);
		});
	}
]);

dialog.onDefault(function(session){
	session.send('je n\'ai pas compris votre demande, il faut ecrire"Donne-moi la meteo" !');
})

// Appel a l'API openWeathermap
var openWeathermap = function(city, callback){
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&lang=fr&units=metric&appid=' + openWeatherMapAppId;

	request(url, function(err, response, body){
		try {
			var result = JSON.parse(body);
			if (result.cod != 200){
				callback(false);
			} else {
				var previsions = {
					temperature : Math.round(result.main.temp),
					humidity : result.main.humidity,
					wind : Math.round(result.wind.speed * 3.6),
					city : result.name,
				};
				callback(true);
			}
		} catch(e){
			callback(false);
		}
	});
}
