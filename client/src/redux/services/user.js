import axios from '../../assets/helpers/axios';

const signup = async (user) => {
	
	let formData = new FormData();
	formData.append("photo", user.user.photo)
	formData.append("username", user.user.username)
	formData.append("email", user.user.email)
	formData.append("firstname", user.user.firstname)
	formData.append("lastname", user.user.lastname)
	formData.append("password", user.user.password)
	formData.append("cpassword", user.user.cpassword)

	let res = await axios.post(
		'/api/signup',
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } }
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const update = async (user, photo) => {
	let formData = new FormData();
	formData.append("photo", photo)
	formData.append("username", user.username)
	formData.append("email", user.email)
	formData.append("firstname", user.firstname)
	formData.append("lastname", user.lastname)
	formData.append("password", user.password)
	formData.append("npassword", user.npassword)
	formData.append("language", user.language)
	formData.append("cpassword", user.cpassword)

	let res = await axios.post(
		'/api/profile/settings',
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } }
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const getUser = async () => {
	let res = await axios.get(
		'/api/checklog'
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const getOtherUser = async (id) => {
	let res = await axios.get(
		`/api/user/${id}`
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const verifEmail = async (username, token) => {
	let res = await axios.get(
		`/api/emailvalidation/${username}/${token}`
	)
	.then ((response) => {
		return (response)
	})
	.catch((error) => {
		return (error.response);
	})
	return res;
}

const resendMail = async (email) => {
	let res = await axios.post(
		`/api/emailvalidation/`, {
			email
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

export default {
	signup,
	update,
	getUser,
	getOtherUser,
	verifEmail,
	resendMail,
}

