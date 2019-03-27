require("dotenv").config(); // This allows us to store keys locally and refer to them from here.  The .env file is where the keys are stored, and a javascript file called keys.js uses the fs function to read from them.   (../keys.js)  Why do we need a separate keys.js file?  Probably to keep all the keys in one place for housekeeping/modularization reasons
var fs = require("fs");
var functions = require('./fx.js');

if (process.argv[2] === "concert-this") {
	functions.bands();
	functions.createLog();
}
else if (process.argv[2] === "spotify-this-song") {
	functions.spotify();
	functions.createLog();
}
else if (process.argv[2] === "movie-this") {
	functions.omdb();
	functions.createLog();
}
else if (process.argv[2] === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log("ERROR: " + err);
			functions.createLog(err);
		}

		// Break down the values inside random.txt
		data = data.split(",");

        // Find the command to run
        if(data[0] === "concert-this") {
			functions.bands(data[1]);
		}
        if(data[0] === "spotify-this-song") {
			functions.spotify(data[1]);
		}
		else if(data[0] === "movie-this") {
			functions.omdb(data[1]);
		}
		else {
			console.log("Read Fail: There needs to be (function),(data) text in the random txt file for this to execute");
		}
	});
	functions.createLog();
}
else {
	console.log("\n ***Command not found, these are your choices***");
	console.log("node liri.js concert-this '<artist/band name here>'");
	console.log("node liri.js spotify-this-song '<song name here>'");
	console.log("node liri.js movie-this '<movie name here>'");
	console.log("node liri.js do-what-it-says");
	functions.createLog();
};

