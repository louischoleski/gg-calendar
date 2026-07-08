import api from '@api';

import * as actionTypes from '../types';

export const appLoading = app => ({
	type: actionTypes.APP_LOADING,
	app
});

export const setView = (view) => ({
	type: actionTypes.APP_VIEW_UPDATED,
	view
});

export const toggleView = () => ({
	type: actionTypes.APP_VIEW_TOGGLED,
});

export const setTheme = (theme) => ({
	type: actionTypes.APP_THEME_UPDATED,
	theme
});

export const toggleTheme = () => ({
	type: actionTypes.APP_THEME_TOGGLED,
});

export const toggleShortcut = (shortcut) => ({
	type: actionTypes.APP_SHORTCUT_TOGGLED,
	shortcut
});

export const toggleAnimation = (animation) => ({
	type: actionTypes.APP_ANIMATION_TOGGLED,
	animation
});

export const setModal = (modal) => ({
	type: actionTypes.APP_MODAL_UPDATED,
	modal
});

export const toggleCollapsed = {
	header: () => ({
		type: actionTypes.APP_COLLAPSED_HEADER_TOGGLED,
	}),
	sidebar: () => ({
		type: actionTypes.APP_COLLAPSED_SIDEBAR_TOGGLED,
	}),
	category: () => ({
		type: actionTypes.APP_COLLAPSED_CATEGORY_TOGGLED,
	}),
}

export const setCategories = (categories) => ({
	type: actionTypes.APP_CATEGORY_INSERTED,
	categories
});

export const updateCategories = (index, value) => ({
	type: actionTypes.APP_CATEGORY_UPDATED,
	index, value
});

export const loadingApp = (loading = false) => (dispatch) => (
	dispatch(appLoading({ loading }))
);

// 
export const setDay = (day) => ({
	type: actionTypes.APP_SELECTED_DAY_UPDATED,
	day: String(day),
});

export const setMonth = (month) => ({
	type: actionTypes.APP_SELECTED_MONTH_UPDATED,
	month: String(month),
});

export const setYear = (year) => ({
	type: actionTypes.APP_SELECTED_YEAR_UPDATED,
	year: String(year),
});

export const setDate = (year, month, day) => (dispatch) => {
	dispatch(setYear(year));
	dispatch(setMonth(month));
	dispatch(setDay(day));
}

// export const setDateSelected = (date) => ({
// 	this.dateSelected = date;
// 	Context.setLocalDateSelected(date);
// })

