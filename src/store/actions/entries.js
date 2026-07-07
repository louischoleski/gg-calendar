import uniqueId from '@utils/uinqueId';

import * as actionTypes from '../types';

export const setEntries = (items = []) => ({
	type: actionTypes.ENTRIES_SET,
	items
});

export const addEntry = (entry = {}) => ({
	type: actionTypes.ENTRY_ADDED,
	entry: {
		title: '(No title)',
		description: '',
		category: 'default',
		completed: false,
		...entry,
		id: entry.id || `entry_${uniqueId().toLowerCase()}${Date.now().toString(36)}`,
	}
});

export const updateEntry = (id, data = {}) => ({
	type: actionTypes.ENTRY_UPDATED,
	id, data
});

export const deleteEntry = (id) => ({
	type: actionTypes.ENTRY_DELETED,
	id
});
