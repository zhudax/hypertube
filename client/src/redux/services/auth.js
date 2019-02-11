import axios from '../../assets/helpers/axios';

const login = async (email, password) => {
	let res = await axios.post(
		'/api/signin',{
		email,
		password
	})
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const oauth = async (name) => {
	let res = await axios.get(
		`/api/auth/${name}`,
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const logout = async () => {
	let res = await axios.get(
		'/api/logout'
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const resetPassEmail = async (email) => {
	let res = await axios.post(
		`/api/resetpassword/`, {
			email
	})
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const resetPassToken = async (username, token) => {
	let res = await axios.get(
		`/api/resetpassword/${username}/${token}`
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const resetPassToken2 = async (username, token, npassword, cpassword) => {
	let res = await axios.post(
		`/api/resetpassword/${username}/${token}`, {
			npassword,
			cpassword
		}
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

// const savePhoto = async (photo, defineAs, token) => {
// 	let formData = new FormData();
// 	formData.append('photo', photo.toString())
// 	formData.append('defineAs', defineAs)
	
// 	let res = await axios.post(
// 		'/api/profile/photos',
// 		formData,
// 		{ headers: {
// 			"Authorization": "Bearer " + token,
// 			"Content-Type": "multipart/form-data"
// 		}}
// 	)
// 	.then ((response) => {
// 		return (response)
// 	})
// 	.catch((error) => {
// 		return (error.response);
// 	})
// 	return res;
// }

export default {
	login,
	oauth,
	logout,
	resetPassEmail,
	resetPassToken,
	resetPassToken2,
}
