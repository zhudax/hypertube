const axios = require('axios');
const fs = require('fs');
var throttledQueue = require('throttled-queue');
var throttle = throttledQueue(20, 10000);
const filename = __dirname + "/popcorn_movies.json";

// Recupere tous les films en recursive
async function get_all_movies(page, total_page) {
	if (page > total_page)
		return ;
	try {
		// Recupere tous les films de cette page
		const res = await axios.get('https://tv-v2.api-fetch.website/movies/' + page);

		// Parcourir tous les films
		for (let i = 0; i < res.data.length; i++) {
			let movie = res.data[i];
			let data = {};

			// Verifie si les données necessaires existe
			if (movie.imdb_id && movie.torrents.en && Object.keys(movie.torrents.en).length) {
				// Pour que le site nous bloque pas, on envoie 20 requests tous les 10 sec
				throttle(async function() {
					try {
						// Recupere les détails du films
						const omdb = await axios.get('http://www.omdbapi.com/?apikey=' + '988a398b' + '&plot=full&i=' + movie.imdb_id);

						// Sauvegarder les données dans des variables
						data['movie'] = [
							movie.imdb_id,
							omdb.data.Title,
							parseInt(movie.year),
							omdb.data.Language,
							omdb.data.Type,
							parseFloat(omdb.data.imdbRating),
							movie.runtime,
							omdb.data.Director,
							omdb.data.Writer,
							omdb.data.Actors,
							omdb.data.Plot,
							movie.images.poster
						];
			
						data['genre'] = 
						movie.genres.map(genre => {
							return [
								movie.imdb_id,
								genre
							]
						});
			
						data['torrent'] = [];
						let i = 0;
						if (movie.torrents.en['720p']) {
							data['torrent'][i] = [
								movie.imdb_id,
								movie.torrents.en['720p'].url,
								'720p',
								movie.torrents.en['720p'].seed,
								movie.torrents.en['720p'].peer,
								movie.torrents.en['720p'].size
							];
							i++;
						}
						if (movie.torrents.en['1080p']) {
							data['torrent'][i] = [
								movie.imdb_id,
								movie.torrents.en['1080p'].url,
								'1080p',
								movie.torrents.en['1080p'].seed,
								movie.torrents.en['1080p'].peer,
								movie.torrents.en['1080p'].size
							];
						}

						// Petit indice pour dire que c'est bientot fini
						if (page == total_page) {
							console.log("Soon finish");
						}

						// Apres chaque données des films on ajoute un ',' pour les séparés
						// A la fin du fichier il faut changer le ',' en ']' pour qu'on puisse lire correctement les données
						// On peut changer manuellement mais on verifie quand meme avec le code
						fs.appendFileSync(filename, JSON.stringify(data) + ",", 'utf8');
					} catch(err) {
						console.log("Error page:" + page);
						return ;
					}
				})
			}
		}
		get_all_movies(page + 1, total_page);
	} catch(err) {
		console.log(err);
	}
}

 var get_popcorn_movies = async function () {
	try {
		// On recupere le nombre totals des pages
		const res = await axios.get('https://tv-v2.api-fetch.website/movies/');
		const number_page = res.data.length;

		// On ecrit au debut du fichier un '[' pour lire correctement les données en json
		fs.writeFileSync(filename, "[");
		
		// Recupere tous les films en recursive
		get_all_movies(1, number_page);
	} catch(err) {
		console.log(err);
	}
};

get_popcorn_movies();