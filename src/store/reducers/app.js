import * as actionTypes from '../types';

import { toggleStringArray } from '@utils';
import { THEME_KEYS } from '@constants/themes';
import { MODAL_SECTIONS } from '@constants/modals';
import { BASE_CALENDAR_KEYS } from '@constants/calendar';

export const appState = {
	view: 'WEEK',
	theme: 'LIGHT',
	loading: false,
	shortcut: true,
	modal: 'CLOSED',
	animation: true,
	collapsed: {
		header: false,
		sidebar: false,
		category: false,
	},
	selected: {
		year: "2024",
		month: "1",
		day: "2",
	},
	categories: [
		{
			checked: true,
			name: 'default',
			id: 'category_0',
			color: 'rgb(44, 82, 186)'
		},
		{
			name: 'F - Ali.',
			color: '#DF2A79',
			checked: true,
			id: 'category_1'
		},
		{
			name: 'F - Loic.',
			color: '#2C52BA',
			checked: true,
			id: 'category_2'
		},
		{
			name: 'I - Aaron.',
			color: '#73113C',
			checked: true,
			id: 'category_3'
		},
		{
			name: 'O - Julian.',
			color: '#C20000',
			checked: true,
			id: 'category_4'
		},
		{
			name: 'O - Peter.',
			color: '#2C52BA',
			checked: true,
			id: 'category_5'
		},
		{
			name: 'T1 - Marek',
			color: '#E84334',
			checked: true,
			id: 'category_6'
		},
		{
			name: 'T1 - Mike.',
			color: '#2C52BA',
			checked: true,
			id: 'category_7'
		},
		{
			name: 'T1 - Billy.',
			color: '#167671',
			checked: true,
			id: 'category_8'
		},
		{
			name: 'T2 - Matthew.',
			color: '#604793',
			checked: true,
			id: 'category_9'
		},
		{
			name: 'T3 - Duncan.',
			color: '#2C52BA',
			checked: true,
			id: 'category_10'
		},
		{
			name: 'T3 - Eric.',
			color: '#516C7B',
			checked: true,
			id: 'category_11'
		}
	],
};

const appReducer = (state = appState, action) => {
	switch (action.type) {
		case actionTypes.APP_LOADING:
			return { ...state, ...action.app };
		case actionTypes.APP_THEME_UPDATED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state;

			if (state.theme === action.theme) return state;

			return { ...state, theme: action.theme };
		case actionTypes.APP_THEME_TOGGLED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state
			return {
				...state, 
				theme: toggleStringArray(state.theme, THEME_KEYS)
			};
		case actionTypes.APP_VIEW_UPDATED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state;
			
			if (state.view === action.view) return state;

			return { ...state, view: action.view };
		case actionTypes.APP_VIEW_TOGGLED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state;

			return {
				...state, 
				view: toggleStringArray(state.view, BASE_CALENDAR_KEYS)
			};
		case actionTypes.APP_MODAL_UPDATED:
			return {
				...state, 
				modal: (
					state.modal === action.modal ? 
					MODAL_SECTIONS.CLOSED : 
					action.modal
				)
			};
		case actionTypes.APP_SHORTCUT_TOGGLED:
			return { ...state, shortcut: !state.shortcut };
		case actionTypes.APP_CATEGORY_INSERTED:
			return { ...state, categories: action.categories };
		case actionTypes.APP_CATEGORY_UPDATED:
			const categories = [ ...state.categories ];

			categories[action.index] = action.value;

			return { ...state, categories };
		case actionTypes.APP_ANIMATION_TOGGLED:
			return { ...state, animation: !state.animation };
		case actionTypes.APP_COLLAPSED_HEADER_TOGGLED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state;

			return {
				...state, 
				collapsed: {
					...state.collapsed, 
					header: !state.collapsed.header,
				}
			};
		case actionTypes.APP_COLLAPSED_SIDEBAR_TOGGLED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state

			return {
				...state, 
				collapsed: {
					...state.collapsed, 
					sidebar: !state.collapsed.sidebar,
				}
			};
		case actionTypes.APP_COLLAPSED_CATEGORY_TOGGLED:
			if (state.modal !== MODAL_SECTIONS.CLOSED) return state

			return {
				...state, 
				collapsed: {
					...state.collapsed, 
					category: !state.collapsed.category,
				}
			};
		// Calendar
		case actionTypes.APP_SELECTED_DAY_UPDATED:
			// if (state.modal !== MODAL_SECTIONS.CLOSED) return state

			return {
				...state, 
				selected: {
					...state.selected, 
					day: action.day,
				}
			};
		case actionTypes.APP_SELECTED_MONTH_UPDATED:
			// if (state.modal !== MODAL_SECTIONS.CLOSED) return state

			return {
				...state, 
				selected: {
					...state.selected, 
					month: action.month,
				}
			};
		case actionTypes.APP_SELECTED_YEAR_UPDATED:
			// if (state.modal !== MODAL_SECTIONS.CLOSED) return state
			return {
				...state, 
				selected: {
					...state.selected, 
					year: action.year,
				}
			};
		default:
			return state;
	}
};

export default appReducer;
