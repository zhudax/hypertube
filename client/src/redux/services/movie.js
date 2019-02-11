import axios from '../../assets/helpers/axios';

const getAllGenre = async () => {

	let res = await axios.get(
		'/api/get_data/all_genre'
		)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const initMovies = async () => {

	let res = await axios.get(
		'/api/get_data/all_movies'
		)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const getMovies = async (name, min_rating, max_rating, min_year, max_year, genres, order, nb) => {
	let res = await axios.post(`/api/get_data/all_movies/${nb}`, {
		name,
		min_rating,
		max_rating,
		min_year,
		max_year,
		genres,
		order
	})
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const getMovieInfo = async (id) => {

	let res = await axios.get(
		`/api/get_data/movie/${id}`
		)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const startMovieDownload = async (id, quality) => {
	let res = await axios.get(
		`/play/${id}/${quality}`
		)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const getMovieDownload = async (action, id, qualite) => {
	let res = await axios.post(`/play`, {
			action,
			id,
			qualite
	})
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const getComments = async (id) => {
	let res = await axios.get(`/api/comments/${id}`
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const postComment = async (movie_id, comment) => {
	let res = await axios.post(`/api/comments/`, {
		movie_id,
		comment
	})
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const movieViewed = async (movie_id) => {
	let res = await axios.post(`/api/get_data/movie/${movie_id}/viewed`
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

export default {
	getAllGenre,
	initMovies,
	getMovies,
	getMovieInfo,
	startMovieDownload,
	getMovieDownload,
	getComments,
	postComment,
	movieViewed
}

// /movie/:movie_id/viewed jpense avoir trouvé