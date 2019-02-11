const create_database = "CREATE DATABASE IF NOT EXISTS hypertube";

const drop_database = "DROP DATABASE IF EXISTS hypertube";

const create_table_users = `CREATE TABLE IF NOT EXISTS users
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		lastname VARCHAR(30) NOT NULL,
		firstname VARCHAR(30) NOT NULL,
		username VARCHAR(30) NOT NULL UNIQUE,
		password VARCHAR(100),
		email VARCHAR(100) UNIQUE,
		language ENUM('french', 'english') NOT NULL DEFAULT 'english',
		profile TEXT NOT NULL,
		token VARCHAR(100) DEFAULT NULL,
		isVerified INT DEFAULT 0,
		id42 INT DEFAULT NULL UNIQUE,
		githubid BIGINT DEFAULT NULL UNIQUE,
		googleid VARCHAR(30) DEFAULT NULL UNIQUE,
		reset_pass_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`;

const create_table_movies = `CREATE TABLE IF NOT EXISTS movies
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		movie_id VARCHAR(50) NOT NULL,
		title VARCHAR(100),
		year INT,
		language VARCHAR(200),
		type VARCHAR(30),
		rating FLOAT DEFAULT 0,
		runtime INT NOT NULL,
		director TEXT,
		writer TEXT,
		actors TEXT,
		description TEXT,
		img TEXT
	)`;

const create_table_movies_viewed = `CREATE TABLE IF NOT EXISTS viewed
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		uid INT NOT NULL,
		movie_id VARCHAR(50) NOT NULL
	)`;

const create_table_movies_genre = `CREATE TABLE IF NOT EXISTS genre
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		movie_id VARCHAR(50) NOT NULL,
		genre ENUM('Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
			'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir',
			'History', 'Horror', 'Music', 'Musical', 'Mystery', 'News', 'Reality-TV',
			'Romance', 'Sci-Fi', 'science-fiction', 'short', 'Sport', 'Talk-Show', 'Thriller',
			'tv-movie', 'War', 'Western'
		)
	)`;

const create_table_movies_torrent = `CREATE TABLE IF NOT EXISTS torrent
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		movie_id VARCHAR(50) NOT NULL,
		url TEXT NOT NULL,
		quality VARCHAR(10) NOT NULL,
		seeds INT NOT NULL,
		peers INT NOT NULL,
		size_bytes BIGINT
	)`;

const create_table_movies_file = `CREATE TABLE IF NOT EXISTS file
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		movie_id VARCHAR(50) NOT NULL,
		quality VARCHAR(10) NOT NULL,
		path TEXT NOT NULL,
		last_view TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`;

const create_table_movies_subtitle = `CREATE TABLE IF NOT EXISTS subtitle
	(
		id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		movie_id VARCHAR(50) NOT NULL,
		language VARCHAR(255) NOT NULL,
		path TEXT NOT NULL
	)`;

const create_table_comments = `CREATE TABLE IF NOT EXISTS comments
	(
		id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		comment VARCHAR(1000) NOT NULL,
		date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)`;

const create_table_comments_movies_users = `CREATE TABLE IF NOT EXISTS comments_movies_users
	(
		id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		movie_id VARCHAR(50) NOT NULL,
		comment_id INT NOT NULL,
		user_id INT NOT NULL
	)`;

const add_movie = "INSERT INTO movies (movie_id, title, year, language, type, rating, runtime, director, writer, actors, description, img) VALUES ?";
const get_all_movies_by_rating = "SELECT * FROM movies ORDER BY rating DESC LIMIT 20 OFFSET 0";
const add_movie_genre = "INSERT INTO genre (movie_id, genre) VALUES ?";
const add_movie_torrent = "INSERT INTO torrent (movie_id, url, quality, seeds, peers, size_bytes) VALUES ?";
const check_movie_exists = "SELECT * FROM movies WHERE movie_id=?";
const get_movie = "SELECT *, ifNULL(rating, 'N/A') as rating FROM movies WHERE movie_id=?";
const get_movie_genre = "SELECT genre FROM genre WHERE movie_id=?";
const get_movie_torrent_info = "SELECT quality, seeds, peers, size_bytes FROM torrent WHERE movie_id=?";
const get_movie_torrent = "SELECT * FROM torrent WHERE movie_id=? AND quality=?";
const add_movie_file = "INSERT INTO file (movie_id, quality, path) VALUES (?)";
const update_movie_file_date = "UPDATE file SET last_view=CURRENT_TIMESTAMP WHERE movie_id=? AND quality=?";
const delete_movie_file = "DELETE FROM file WHERE path=?";
const add_movie_subtitle = "INSERT INTO subtitle (movie_id, language, path) VALUES ?";
const get_movie_file = "SELECT * FROM file WHERE movie_id=? AND quality=?";
const get_movie_file_by_time = "SELECT path FROM file WHERE DATEDIFF(NOW(), last_view) > 30";
const get_movie_subtitle = "SELECT * FROM subtitle WHERE movie_id=?";
const get_all_genre = "SELECT genre FROM genre GROUP BY genre";
const add_comment = "INSERT INTO comments (comment) VALUES (?)";
const add_comment_movie_user = "INSERT INTO comments_movies_users (movie_id, comment_id, user_id) VALUES (?)";
const get_comment_user_id = "SELECT * FROM comments_movies_users WHERE movie_id=? ORDER BY id DESC";
const get_comment = "SELECT * FROM comments WHERE id=?";
const insert_user = "INSERT INTO users (lastname,firstname,username,password,email,profile) VALUES(?)";
const update_profile = "UPDATE users SET profile=? WHERE id=?";
const get_user = "SELECT * FROM users WHERE id=? || username=? || email=?";
const add_movie_view = "INSERT INTO viewed (uid, movie_id) VALUES (?)";
const get_movie_view = "SELECT * FROM viewed WHERE uid=? AND movie_id=?";
const update_reset_pass_time = "UPDATE users SET reset_pass_time=CURRENT_TIMESTAMP WHERE username=?";
const update_user_settings = "UPDATE users SET lastname=?, firstname=?, username=?, language=?, profile=?, password=?, email=? WHERE id=?";
const update_oauth_settings = "UPDATE users SET lastname=?, firstname=?, username=?, language=?, profile=? WHERE id=?";

module.exports = {
	create_database: create_database,
	drop_database: drop_database,
	create_table_users: create_table_users,
	create_table_movies: create_table_movies,
	create_table_movies_viewed: create_table_movies_viewed,
	create_table_movies_genre: create_table_movies_genre,
	create_table_movies_torrent: create_table_movies_torrent,
	create_table_movies_file: create_table_movies_file,
	create_table_movies_subtitle: create_table_movies_subtitle,
	create_table_comments: create_table_comments,
	create_table_comments_movies_users: create_table_comments_movies_users,
	add_movie: add_movie,
	get_all_movies_by_rating: get_all_movies_by_rating,
	get_movie: get_movie,
	get_movie_genre: get_movie_genre,
	get_movie_torrent: get_movie_torrent,
	get_movie_torrent_info: get_movie_torrent_info,
	add_movie_genre: add_movie_genre,
	add_movie_torrent: add_movie_torrent,
	check_movie_exists: check_movie_exists,
	add_movie_file: add_movie_file,
	update_movie_file_date: update_movie_file_date,
	delete_movie_file: delete_movie_file,
	add_movie_subtitle: add_movie_subtitle,
	get_movie_file: get_movie_file,
	get_movie_file_by_time: get_movie_file_by_time,
	get_movie_subtitle: get_movie_subtitle,
	get_all_genre: get_all_genre,
	insert_user: insert_user,
	update_profile: update_profile,
	get_user: get_user,
	add_comment: add_comment,
	add_comment_movie_user: add_comment_movie_user,
	get_comment_user_id: get_comment_user_id,
	get_comment: get_comment,
	add_movie_view: add_movie_view,
	get_movie_view: get_movie_view,
	update_reset_pass_time: update_reset_pass_time,
	update_user_settings: update_user_settings,
	update_oauth_settings: update_oauth_settings
};