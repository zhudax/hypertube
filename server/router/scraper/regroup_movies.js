const axios = require('axios');
const fs = require('fs');

var regroup_movies = async function () {
	// Lire les fichiers json et regrouper tous les films dans une variable
	var popcorn_file = __dirname + "/popcorn_movies.json";
	var yts_file = __dirname + "/yts_movies.json";
	var popcorn_content = fs.readFileSync(popcorn_file, 'utf-8');
	var yts_content = fs.readFileSync(yts_file, 'utf-8');
	if (popcorn_content.slice(-1) == ",")
		popcorn_content = popcorn_content.substr(0, popcorn_content.length - 1) + "]";
	if (yts_content.slice(-1) == ",")
		yts_content = yts_content.substr(0, yts_content.length - 1) + "]";
	var content = JSON.parse(yts_content).concat(JSON.parse(popcorn_content));

	// Variable qui verifie si un film est deja stocké
	var movies = [];

	// Ecrire dans le nouveau fichier
	var movies_file = __dirname + "/movies.json";
	fs.writeFileSync(movies_file, "[");

	// Sauvegarder tous les films dans le fichier movies.json
	for (let i = 0; i < content.length; i++) {
		try {
			if (!movies.includes(content[i].movie[0]) && content[i].movie[1] && content[i].movie[1] !== "#DUPE#" &&
			content[i].movie[11] && content[i].movie[11] !== "N/A" && content[i].movie[11].substr(0, 4) === "http") {
				await axios.get(content[i].movie[11]);
				fs.appendFileSync(movies_file, JSON.stringify(content[i]) + ",", 'utf8');
                movies.push(content[i].movie[0]);
                if (i == content.length - 1) {
					console.log("Regroup finish");
					return ;
				}
			}
		} catch (err) {

		};
	}
};

regroup_movies();