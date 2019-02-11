const connection = require('../db/db').connection_db;

const findOne = (userObj) => {
	const id = userObj.id ? userObj.id : null
	const username = userObj.username ? userObj.username : null
	const email = userObj.email ? userObj.email : null
	const id42 = userObj.id42 ? userObj.id42 : null
	const githubid = userObj.githubid ? userObj.githubid : null
	const googleid = userObj.googleid ? userObj.googleid : null

	const sql = 'SELECT * FROM users WHERE id = ? OR username = ? OR email = ? OR id42 = ? OR githubid = ? OR googleid = ?'

	return new Promise((resolve, reject) => {
		connection.query(sql, [id, username, email, id42, githubid, googleid], async (err, user) => {
			if (err) {
				reject(err)
			}
			if (!user[0]) {
				resolve(null)                    
			} else {
				resolve(user[0])
			}
		})    
	})
}

const findOrCreate = async (userObj) => {
	const sql = 'INSERT INTO users (lastname,firstname,username,email,password,profile,isVerified,id42,googleid,githubid) VALUES(?)'
	const userData = [
		userObj.lastname,
		userObj.firstname, 
		userObj.username,
		userObj.email,
		null,
		userObj.profile,
		1,
		userObj.id42 ? userObj.id42 : null,
		userObj.googleid ? userObj.googleid : null,
		userObj.githubid ? userObj.githubid : null
	]
	let user = await findOne(userObj)
	if (user[0])
		return user[0]
	else {
		return new Promise((resolve, reject) => {
			return connection.query(sql, userData, (err, user) => {
				(err) ? reject(err) : resolve(user)
			})
		})
	}
}

const createOne = async (userObj) => {
	const sql = 'INSERT INTO users (lastname, firstname, username, email, password, profile, isVerified, id42, googleid, githubid) VALUES(?)';
	const userData = [
		userObj.lastname,
		userObj.firstname, 
		userObj.username,
		userObj.email,
		null,
		userObj.profile,
		1,
		userObj.id42 ? userObj.id42 : null,
		userObj.googleid ? userObj.googleid : null,
		userObj.githubid ? userObj.githubid : null
	];
	return new Promise((resolve, reject) => {
		return connection.query(sql, [userData], (err, user) => {
			(err) ? reject(err) : resolve(user);
		});
	});
}

module.exports = {
	findOne,
	findOrCreate,
	createOne
}
