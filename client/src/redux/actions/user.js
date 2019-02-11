import u from '../services/user';
import { userConstants } from '../constants';

const getUser = () => async dispatch => {
	function request() { return { type: userConstants.LOGIN_REQUEST} };
	function success(user) { return { type: userConstants.LOGIN_SUCCESS, user} };

	dispatch(request());
	let res = await u.getUser()
		.then(
			res => {
				if (res.status === 200) {
					dispatch(success(res.data));
					return res;
				}
				else
					return res;
			}
		);
	return res;
}

const getOtherUser = (id) => async dispatch => {
	function request() { return { type: userConstants.GET_OTHER_USER_REQUEST} };
	function success(oUser) { return { type: userConstants.GET_OTHER_USER_SUCCESS, oUser} };

	dispatch(request());
	let res = await u.getOtherUser(id)
		.then(
			res => {
				if (res.status === 200) {
					dispatch(success(res.data.user));
					return res;
				}
				else
					return res;
			}
		);
	return res;
}

const signup = (user) => async dispatch => {
	function request() { return { type: userConstants.SIGNUP_REQUEST} };
	function success(user) { return { type: userConstants.SIGNUP_SUCCESS, user} };

	dispatch(request());
	let res = await u.signup(user)
		.then(
			res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success(res.data));
					return res;
				}
			}
		);
	return res;
}

const verifEmail = (username, token) => async dispatch => {
	function request() { return { type: userConstants.EMAIL_VERIFICATION_REQUEST} };
	function success() { return { type: userConstants.EMAIL_VERIFICATION_SUCCESS} };

	dispatch(request());
	let res = await u.verifEmail(username, token)
		.then(
			res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success());
					return res;
				}
			}
		);
	return res;
}

const resendMail = (email) => async dispatch => {
	function request() { return { type: userConstants.EMAIL_VERIFICATION_REQUEST} };
	function success() { return { type: userConstants.EMAIL_VERIFICATION_SUCCESS} };

	dispatch(request());
	let res = await u.resendMail(email)
		.then(
			res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success());
					return res;
				}
			}
		);
	return res;
}

const update = (user, photo) => async dispatch => {
	function request() { return { type: userConstants.UPDATE_REQUEST} };
	function success(user) { return { type: userConstants.UPDATE_SUCCESS, user} };

	dispatch(request());
	let res = await u.update(user, photo)
		.then(
			res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success(res.data.user));
					return res;
				}
			}
		);
	return res;
}

const signupPhoto = (photo) => async dispatch => {
	function success(photo) { return { type: userConstants.SIGNUP_PHOTO, photo} };
	dispatch(success(photo));
}

const deletePhoto = () => async dispatch => {
	function success() { return { type: userConstants.DELETE_PHOTO} };
	dispatch(success());
}

export const userActions = {
	getUser,
	getOtherUser,
	signup,
	signupPhoto,
	deletePhoto,
	verifEmail,
	resendMail,
	update,
};