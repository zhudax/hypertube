const axios = require('axios');
const fs = require('fs');
var throttledQueue = require('throttled-queue');
var throttle = throttledQueue(20, 10000);
const filename = __dirname + "/yts_movies.json";

// Recupere tous les films en recursive
async function get_all_movies(page, total_page) {

	if (page > total_page)
		return ;
	try {
		// Recupere tous les films de cette page
		const res = await axios.get('https://yts.am/api/v2/list_movies.json?limit=50&sort_by=rating&page=' + page);
		
		// Parcourir tous les films
		for (let i = 0; i < res.data.data.movies.length; i++) {
			let movie = res.data.data.movies[i];
			let data = {};

			// Verifie si les données necessaires existe
			if (movie.imdb_code && movie.torrents && Object.keys(movie.torrents).length) {
				// Pour que le site nous bloque pas, on envoie 20 requests tous les 10 sec
				throttle(async function() {
					try {
						// Recupere les détails du films
						const omdb = await axios.get('http://www.omdbapi.com/?apikey=' + '988a398b' + '&plot=full&i=' + movie.imdb_code);

						// Sauvegarder les données dans des variables
						data['movie'] = [
							movie.imdb_code,
							omdb.data.Title,
							movie.year,
							omdb.data.Language,
							omdb.data.Type,
							parseFloat(omdb.data.imdbRating),
							movie.runtime,
							omdb.data.Director,
							omdb.data.Writer,
							omdb.data.Actors,
							omdb.data.Plot,
							movie.large_cover_image
						];
			
						data['genre'] = 
						movie.genres.map(genre => {
							return [
								movie.imdb_code,
								genre
							]
						});
			
						data['torrent'] =
							movie.torrents.map(torrent => {
								return [
									movie.imdb_code,
									torrent.url,
									torrent.quality,
									torrent.seeds,
									torrent.peers,
									torrent.size_bytes
								]
							});
						
						// Petit indice pour dire que c'est fini
						if (page == total_page && i == res.data.data.movies.length - 1) {
							console.log("Get movie finish");
							return ;
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
		return ;
	}
}

var get_yts_movies = async function () {
	try {
		// Recupere les données pour compter le nombre total des pages
        const res = await axios.get('https://yts.am/api/v2/list_movies.json?limit=1&sort_by=rating');
		const number_page = parseInt(res.data.data.movie_count / 50) + 1
		
		// On ecrit au debut du fichier un '[' pour lire correctement les données en json
		fs.writeFileSync(filename, "[");

		// Recupere tous les films en recursive
		get_all_movies(1, number_page);
	} catch(err) {
		console.log(err);
    }
};

get_yts_movies();