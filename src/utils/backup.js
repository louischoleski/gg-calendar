import uniqueId from '@utils/uinqueId';
import { THEME_KEYS } from '@constants/themes';
import { BASE_CALENDAR_KEYS } from '@constants/calendar';

const isEntry = (entry) => (
	entry &&
	typeof entry.title === 'string' &&
	typeof entry.category === 'string' &&
	!isNaN(new Date(entry.start).getTime()) &&
	!isNaN(new Date(entry.end).getTime())
);

const isCategory = (category) => (
	category &&
	typeof category.name === 'string' &&
	typeof category.color === 'string'
);

const normalizeEntries = (items) => items.map((entry) => ({
	completed: false,
	description: '',
	...entry,
	id: entry.id || `entry_${uniqueId().toLowerCase()}`,
}));

const normalizeCategories = (categories) => categories.map((category) => ({
	checked: category.checked !== false,
	...category,
	id: category.id || `category_${uniqueId().toLowerCase()}`,
}));

// Durable app settings accepted from a backup of this app.
const pickAppSettings = (app = {}) => {
	const settings = {};

	if (THEME_KEYS.includes(app.theme)) settings.theme = app.theme;
	if (BASE_CALENDAR_KEYS.includes(app.view)) settings.view = app.view;
	if (typeof app.shortcut === 'boolean') settings.shortcut = app.shortcut;
	if (typeof app.animation === 'boolean') settings.animation = app.animation;

	return settings;
};

/**
 * buildBackup
 * Snapshot of everything worth exporting, in the same shape the app
 * persists to localStorage.
 */
export const buildBackup = (app = {}, items = []) => ({
	app: {
		view: app.view,
		theme: app.theme,
		shortcut: app.shortcut,
		animation: app.animation,
		collapsed: app.collapsed,
		categories: app.categories,
	},
	entries: { items },
});

export const buildBackupFilename = (entriesCount, categoriesCount) => {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;

	return `ENT_${entriesCount}_CAT_${categoriesCount}_${stamp}.json`;
};

/**
 * parseBackup
 * Validate an uploaded backup. Accepts this app's export shape and
 * the original vanilla project's export (a dump of its localStorage,
 * where `store` and `ctg` are JSON strings). Returns
 * { entries, categories, appSettings } or null when unsupported —
 * unsupported data never overwrites anything.
 */
export const parseBackup = (raw = '') => {
	let data;

	try {
		data = JSON.parse(raw);
	} catch {
		return null;
	}

	// Original vanilla project backup.
	if (typeof data?.store === 'string' && typeof data?.ctg === 'string') {
		try {
			const entries = JSON.parse(data.store);
			const ctg = JSON.parse(data.ctg);

			if (!Array.isArray(entries) || !ctg || typeof ctg !== 'object') {
				return null;
			}

			const categories = Object.entries(ctg).map(([ name, value ]) => ({
				name,
				color: value?.color || '#2C52BA',
				checked: value?.active !== false,
			}));

			if (!entries.every(isEntry) || !categories.length) {
				return null;
			}

			return {
				appSettings: {},
				entries: normalizeEntries(entries),
				categories: normalizeCategories(categories),
			};
		} catch {
			return null;
		}
	}

	// This app's export shape ({ app: { categories }, entries: { items } }).
	const items = Array.isArray(data?.entries) ? data.entries : data?.entries?.items;
	const categories = Array.isArray(data?.categories) ? data.categories : data?.app?.categories;

	if (!Array.isArray(items) || !Array.isArray(categories) || !categories.length) {
		return null;
	}

	if (!items.every(isEntry) || !categories.every(isCategory)) {
		return null;
	}

	return {
		entries: normalizeEntries(items),
		categories: normalizeCategories(categories),
		appSettings: pickAppSettings(data?.app),
	};
};

export default {
	buildBackup,
	parseBackup,
	buildBackupFilename,
};
