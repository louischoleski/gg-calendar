import { combineReducers } from 'redux';

import appReducer, { appState } from './reducers/app';

// Combine all states.
export const preloadedState = {
	app: appState,
};

// Combine all reducers.
const rootReducer = combineReducers({
	app: appReducer,
});

export default rootReducer;
