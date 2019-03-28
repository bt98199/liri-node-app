require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var chalk = require("chalk");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var parameter = process.argv.slice(3).join(" ");

function switchCase() {

  switch (action) {

    case 'concert-this':
      bandsInTown(parameter);                   
      break;                          

    case 'spotify-this-song':
      spotSong(parameter);
      break;

    case 'movie-this':
      getMovie(parameter);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

      default:                            
      console.log("Invalid please use 'spotify-this-song', 'movie-this', 'concert-this', 'do-what-it-says'");
      break;

  }
};
switchCase();

function bandsInTown (parameter) {
// const bandsInTown = (parameter) => {

    var searchBand = "IronMaiden"; // Lets get something back on bad calls just to make sure the interface is working
    if (process.argv[3]) {
        searchBand = parameter;
    }
    console.log(searchBand);
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchBand + "/events?app_id=codingbootcamp";
   console.log(queryUrl);
    axios.get(queryUrl)
    .then(function(response){
        response.data.forEach(concert => {
          createLog("Band Name: " + concert.venue.name);
          createLog("Concert Location: " + concert.venue.city + ", " + concert.venue.region);
          createLog(moment(concert.datetime).format("MM/DD/YYYY"));
          createLog(concert.id);
          createLog(concert.artist_id);
          createLog(concert.url);
          })
        });  
    };

function spotSong(parameter) {

    var spotify = new Spotify(keys.spotify);
    var songName = "The Sign"; // Per task requirements, return this rather than a song called undefined
    if (parameter == ""){
    } else {
        songName = parameter;
    }
    // if (process.argv[3]) {
    //     songName = parameter;
    // }
    console.log("Spot Song Loaded: " + songName); // special characters throw the logic.
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
            return console.log("Error: There was a problem with the spotify interface. " + err );
        }
        createLog("Song Name: " + data.tracks.items[0].name);
        createLog("Artist: " + data.tracks.items[0].artists[0].name);
        if(data.tracks.items[0].preview_url !== null) { createLog("Preview: " + data.tracks.items[0].preview_url); }
        createLog("From the album: '" + data.tracks.items[0].album.name + "'");
      });
  };


function getMovie (parameter) {
    // const bandsInTown = (parameter) => {
    movieName = "Mr. Nobody";
    if (process.argv[3]) {
        movieName = parameter;
    }
    // if (parameter !== "undefined") {
    //       movieName = parameter;
    //     }

    var queryUrl = "http://www.omdbapi.com/?&y=&plot=short&apikey=trilogy&t=" + movieName;
    axios.get(queryUrl).then(
    function(response){
      createLog("Title: " + response.data.Title + " ("+  response.data.Year + ")");
      createLog("Ratings (IMDB||Rotten Tomatoes): " + response.data.Ratings[0].Value + " || " + response.data.Ratings[1].Value);
      createLog("Country: " + response.data.Country);
      createLog("Language: " + response.data.Language);
      createLog("Starring: " + response.data.Actors);
      createLog("Plot: " + response.data.Plot);
      createLog("API response code: " + response.status);
    });  
};


function getRandom() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log("ERROR: " + err);
		}
        data = data.split(",");
        console.log("0: " + data[0]);
        console.log("1: " + data[1]);
		if(data[0] === "concert-this") {
			bandsInTown(data[1]);
		}
		else if(data[0] === "spotify-this-song") {
            // for (let i = 0; i < 2; i++) {
            //     data.push(data[1].slice(1,-1));
            // }
            console.log (data);
            data[1]= data[1].slice(1,-1);
			spotSong(data[1]);
		}
		else if(data[0] === "movie-this") {
			getMovie(data[1]);
		}
		else {
			console.log("random.txt is not formatted correctly, please edit the file");
		}
	});
};


function createLog(data) {
    console.log(data);
	fs.appendFile('log.txt', data + '\n', function(err) {
		if (err) return createLog('Error logging data to file: ' + err);	
	});
};


