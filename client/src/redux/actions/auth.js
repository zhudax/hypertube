import a from '../services/auth';
import { userConstants } from '../constants';

const login = (email, password) => async dispatch => {
	function request(email) { return { type: userConstants.LOGIN_REQUEST, email } };
	function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } };
	dispatch(request(email));
	let res = await a.login(email, password)
		.then(
			async res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success(res.data))
					return res;
				}
		});
	return res;
};

const oauth = (name) => async dispatch => {
	function request() { return { type: userConstants.LOGIN_REQUEST } };
	function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } };
	dispatch(request(name));
	let res = await a.oauth(name)
		.then(
			async res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success(res.data))
					return res;
				}
		});
	return res;
};

const resetPassEmail = (email) => async dispatch => {
	function request() { return { type: userConstants.RESETPASS_EMAIL_REQUEST } };
	function success() { return { type: userConstants.RESETPASS_EMAIL_SUCCESS } };
	dispatch(request());
	let res = await a.resetPassEmail(email)
		.then(
			async res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success())
					return res;
				}
		});
	return res;
};

const resetPassToken = (username, token) => async dispatch => {
	function request() { return { type: userConstants.RESETPASS_TOKEN_REQUEST } };
	function success() { return { type: userConstants.RESETPASS_TOKEN_SUCCESS } };
	dispatch(request());
	let res = await a.resetPassToken(username, token)
		.then(
			async res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success())
					return res;
				}
		});
	return res;
};

const resetPassToken2 = (username, token, npassword, cpassword) => async dispatch => {
	function request() { return { type: userConstants.RESETPASS_TOKEN_REQUEST } };
	function success() { return { type: userConstants.RESETPASS_TOKEN_SUCCESS } };
	dispatch(request());
	let res = await a.resetPassToken2(username, token, npassword, cpassword)
		.then(
			async res => {
				if (res.status !== 200) {
					return res;
				}
				else {
					dispatch(success())
					return res;
				}
		});
	return res;
};

const logout = () => {
	a.logout();
	return { type: userConstants.LOGOUT };
};

export const authActions = {
	login,
	oauth,
	logout,
	resetPassEmail,
	resetPassToken,
	resetPassToken2,
};