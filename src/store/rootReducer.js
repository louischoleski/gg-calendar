import { combineReducers } from 'redux';

import appReducer, { appState } from './reducers/app';
import entriesReducer, { entriesState } from './reducers/entries';

// Combine all states.
export const preloadedState = {
	app: appState,
	entries: entriesState,
};

// Combine all reducers.
const rootReducer = combineReducers({
	app: appReducer,
	entries: entriesReducer,
});

export default rootReducer;
