import { createStore, combineReducers, applyMiddleware, compose} from 'redux';
import { authReducer } from '../redux/reducers/auth';
import { userReducer } from '../redux/reducers/user';
import { movieReducer } from '../redux/reducers/movie';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
	authReducer,
	userReducer,
	movieReducer
});


export const store = createStore(
	rootReducer,
	composeEnhancers(
	applyMiddleware(
		thunk,
	)
));