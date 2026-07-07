import * as actionTypes from '../types';

export const entriesState = {
	items: [],
};

const entriesReducer = (state = entriesState, action) => {
	switch (action.type) {
		case actionTypes.ENTRIES_SET:
			return { ...state, items: action.items };
		case actionTypes.ENTRY_ADDED:
			return { ...state, items: [ ...state.items, action.entry ] };
		case actionTypes.ENTRY_UPDATED:
			return {
				...state,
				items: state.items.map((item) => (
					item.id === action.id ? { ...item, ...action.data } : item
				)),
			};
		case actionTypes.ENTRY_DELETED:
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.id),
			};
		default:
			return state;
	}
};

export default entriesReducer;
