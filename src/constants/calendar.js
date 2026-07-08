export const TOTAL_DAY_WEEK = 7;

export const TOTAL_DAY_HOURS = 24;

export const CALENDAR_SHORTCUTS = {
	D: 'D',
	W: 'W',
	M: 'M',
	Y: 'Y',
	L: 'L',
	ESCAPE: 'ESCAPE',
}

export const BASE_CALENDAR_VIEWS = {
	DAY: 'DAY',
	WEEK: 'WEEK',
	MONTH: 'MONTH',
	YEAR: 'YEAR',
	LIST: 'LIST',
}

export const WEEK_START = 1; 	// 0

export const WEEK_END = 8; 	// 7

export const BASE_CALENDAR_KEYS = Object.keys(BASE_CALENDAR_VIEWS || {});

export const CALENDAR_VIEWS = { ...BASE_CALENDAR_VIEWS, ESCAPE: 'ESCAPE' }

export const CALENDAR_VIEW_OPTIONS = [
	{
		id: CALENDAR_SHORTCUTS.D,
		slug: CALENDAR_VIEWS.DAY,
		text: 'Day',
	},
	{
		id: CALENDAR_SHORTCUTS.W,
		slug: CALENDAR_VIEWS.WEEK,
		text: 'Week',
	},
	{
		id: CALENDAR_SHORTCUTS.M,
		slug: CALENDAR_VIEWS.MONTH,
		text: 'Month',
	},
	{
		id: CALENDAR_SHORTCUTS.Y,
		slug: CALENDAR_VIEWS.YEAR,
		text: 'Year',
	},
	{
		id: CALENDAR_SHORTCUTS.L,
		slug: CALENDAR_VIEWS.LIST,
		text: 'List',
	}
];

export const CATEGORY_COLORS = [
	'#DF2A79',
	'#A51955',
	'#73113C',
	'#C20000',
	'#9D0000',
	'#690000',
	'#460000',
	'#EE756A',
	'#E84334',
	'#E77C2B',
	'#D56A18',
	'#954A11',
	'#6B350C',
	'#402007',
	'#1E9E98',
	'#1A8A84',
	'#167671',
	'#115855',
	'#0F4E4B',
	'#09312F',
	'#072726',
	'#14489A',
	'#125ab8',
	'#5578D7',
	'#2C52BA',
	'#234295',
	'#1B3375',
	'#142555',
	'#42338B',
	'#513FAB',
	'#614E7A',
	'#604793',
	'#49356F',
	'#342650',
	'#271D3C',
	'#858F93',
	'#4D5458',
	'#272B2C',
	'#202B31',
	'#2C3C44',
	'#384C56',
	'#516C7B',
];

export const CALENDAR_MONTH_LONG_ABELS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const CALENDAR_MONTH_LABELS = {
	LONG: CALENDAR_MONTH_LONG_ABELS,
	SHORT: CALENDAR_MONTH_LONG_ABELS.map((month) => month.substring(0, 3)),
};

// ⚠️  NOTE: Automatically adjust respect  to `WEEK_START` value.
const CALENDAR_WEEK_LONG_LABELS = [
	(WEEK_START === 0 ? 'Sunday' : null), 
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	(WEEK_START === 0 ? null : 'Sunday'),
].filter((wd) => wd);

export const CALENDAR_WEEK_LABELS = {
	LONG: CALENDAR_WEEK_LONG_LABELS,
	SHORT: CALENDAR_WEEK_LONG_LABELS.map((week) => week.substring(0, 3)),
};

export const CALENDAR_LABELS = {
	MONTH: CALENDAR_MONTH_LABELS,
	WEEK: CALENDAR_WEEK_LABELS,
}

export default {
	WEEK_END,
	WEEK_START,
	TOTAL_DAY_WEEK,
	CALENDAR_VIEWS,
	CATEGORY_COLORS,
	CALENDAR_LABELS,
	TOTAL_DAY_HOURS,
	CALENDAR_SHORTCUTS,
	BASE_CALENDAR_KEYS,
	BASE_CALENDAR_VIEWS,
	CALENDAR_VIEW_OPTIONS,
}
