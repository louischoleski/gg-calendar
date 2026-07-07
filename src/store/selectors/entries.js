import { createSelector } from 'reselect';

import { selectCategories } from './app';

const entriesSelect = (state) => state.entries;

export const selectEntries = createSelector(
	[ entriesSelect ],
	(entries) => entries.items
);

// Entries whose category checkbox is active in the sidebar.
export const selectActiveEntries = createSelector(
	[ selectEntries, selectCategories ],
	(items, categories) => {
		const active = categories
			.filter(({ checked }) => checked)
			.map(({ name }) => name);

		return items.filter(({ category }) => active.includes(category));
	}
);

// Map of category name -> color, for painting boxes.
export const selectCategoryColors = createSelector(
	[ selectCategories ],
	(categories) => categories.reduce((acc, { name, color }) => {
		acc[name] = color;
		return acc;
	}, {})
);
