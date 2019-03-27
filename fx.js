function noQuotes(input) {
	var newInput = input[3];
	for (var i = 4; i < input.length; i++) {
		newInput = newInput + "+" + process.argv[i];
	}
	return newInput;
}

module.exports = {
	bands: function(band) {
		// Include the request npm package
		var axios = require("axios");
		var moment = require("moment");
		// moment().format();

		var bandName = "IronMaiden"; // Lets get something back on bad calls just to make sure the interface is working
		if(band != undefined) {
			bandName = band;
		}

		if(process.argv[3]) {
			bandName = noQuotes(process.argv);
		}

		// Setup the query to the OMDB API
		var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
		console.log(queryUrl);
	
		axios.get(queryUrl)
		.then(function(response){
			response.data.forEach(concert => {
		  	console.log("Band Name: " + concert.venue.name);
		  	console.log("Concert Location: " + concert.venue.city + ", " + concert.venue.region);
		  	console.log(moment(concert.datetime).format("MM/DD/YYYY"));
		  	console.log(concert.id);
		  	console.log(concert.artist_id);
			console.log(concert.url);
			})
		});  
	},
	spotify: function(song) {
		var Spotify = require('node-spotify-api');
		// Add code the code required to import the `keys.js` file and store it in a variable
		var keys = require("./keys.js");
		var spotify = new Spotify(keys.spotify);
		var songName = "The Sign"; // Per task requirements, return this rather than a song called undefined

		if(song != undefined) {
			songName = song;
		}

		// If the user passed a song name, update songName
		if(process.argv[3]) {
			songName = noQuotes(process.argv);
			console.log(songName);
		}

		spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
			if (err) {
				return console.log("Error: There was a problem with the spotify interface.");
			}

			// Returns the requested values for the song selected
		
			console.log("Song Name: " + data.tracks.items[0].name);
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			if(data.tracks.items[0].preview_url !== null) { console.log("Preview: " + data.tracks.items[0].preview_url); }
			console.log("From the album: '" + data.tracks.items[0].album.name + "'");
			
		});
	},
	omdb: function(movie) {
		// Include the request npm package
		var axios = require("axios");

		var movieName = "Mr+Nobody"; // per task requirements, returnd default of Mr Nobody instead of the movie called undefined (which exists)
		if(movie != undefined) {
			movieName = movie;
		}

		// If the user provided a movie, reset movieName
		if(process.argv[3]) {
			movieName = noQuotes(process.argv);
		}

		// Setup the query to the OMDB API
		var queryUrl = "http://www.omdbapi.com/?&y=&plot=short&apikey=trilogy&t=" + movieName;
		console.log(queryUrl);
		// Then run a request to the OMDB API with the movie specified
		axios.get(queryUrl).then(
		function(response){
		  console.log("Title: " + response.data.Title + " ("+  response.data.Year + ")");
		  console.log("Ratings (IMDB||Rotten Tomatoes): " + response.data.Ratings[0].Value + " || " + response.data.Ratings[1].Value);
		  console.log("Country: " + response.data.Country);
		  console.log("Language: " + response.data.Language);
		  console.log("Starring: " + response.data.Actors);
		  console.log("Plot: " + response.data.Plot);
		  console.log("API response code: " + response.status);
		});  
	},
	createLog: function (error) {
		// Load the fs package to read and write
		var fs = require("fs");

		if(error !== undefined) {
			fs.appendFile("log.txt", error, function(err) {
				if (err) {
					return console.log("ERROR: Unable to update log.txt. " + err);
				}
			});			
		}
		else {
			// We will add the value to the bank file.
			fs.appendFile("log.txt", process.argv, function(err) {
				if (err) {
					return console.log("ERROR: Unable to update log.txt. " + err);
				}
			});
		}
	}
};