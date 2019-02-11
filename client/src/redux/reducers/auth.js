import { userConstants } from '../constants';

export function authReducer(state = {isAuth: false}, action) {
	switch (action.type) {
		case userConstants.LOGIN_REQUEST:
			return state;
		case userConstants.LOGIN_SUCCESS:
			return {
				isAuth: true,
			};
		case userConstants.RESETPASS_EMAIL_REQUEST:
			return state
		case userConstants.RESETPASS_EMAIL_SUCCESS:
			return state
		case userConstants.RESETPASS_TOKEN_SUCCESS:
			return state
		case userConstants.LOGOUT:
			return {isAuth: false};
		default:
			return state;
	}
}