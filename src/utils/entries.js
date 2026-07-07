import { WEEK_START } from '@constants/calendar';
import { testDate, compareDates } from '@utils/dates';

export const QUARTERS_PER_DAY = 96; 	// 24h * 4 (15 minute intervals)

export const QUARTER_HEIGHT = 12.5; 	// px per 15 minute interval (grid is 1200px tall)

// 'yyyy-m-d' key used to group/lookup entries per day.
export const toDateKey = (date) => {
	const d = testDate(date);
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const startOfDay = (date) => {
	const d = new Date(testDate(date));
	d.setHours(0, 0, 0, 0);
	return d;
};

export const endOfDay = (date) => {
	const d = new Date(testDate(date));
	d.setHours(23, 59, 59, 999);
	return d;
};

// Convert a 15-minute interval index (0-96) into a Date on the given day.
export const quarterToDate = (baseDate, quarter) => {
	const d = new Date(testDate(baseDate));

	if (quarter >= QUARTERS_PER_DAY) {
		d.setHours(23, 59, 0, 0);
	} else {
		d.setHours(Math.floor(quarter / 4), (quarter % 4) * 15, 0, 0);
	}

	return d;
};

// Nearest 15-minute interval index for a Date.
export const dateToQuarter = (date) => {
	const d = testDate(date);
	return d.getHours() * 4 + Math.floor(d.getMinutes() / 15);
};

/**
 * generateCoordinates
 * Coordinates based on start/end times of an entry.
 * Entries spanning beyond a single day render at the top of
 * the week/day grid in a static position (allDay: true).
 */
export const generateCoordinates = (start, end, startWeekIndex = WEEK_START) => {
	[ start, end ] = [ testDate(start), testDate(end) ];

	const startMin = dateToQuarter(start);
	const endMin = dateToQuarter(end);
	const height = endMin - startMin;
	const total = startMin + height;

	const startIdx = (start.getDay() - startWeekIndex + 7) % 7;
	const endIdx = (end.getDay() - startWeekIndex + 7) % 7;

	if (!compareDates(start, end)) {
		return {
			allDay: true,
			x: startIdx,
			x2: endIdx,
		};
	}

	return {
		allDay: false,
		x: startIdx,
		y: startMin,
		h: Math.max(height, 1),
		e: total,
	};
};

/**
 * getWeekBoxes
 * Split the entries that overlap the given week into single-day
 * boxes (positioned in columns) and allDay boxes (top module).
 * Column indexes are clamped to the week bounds.
 */
export const getWeekBoxes = (entries = [], weekArray = []) => {
	const boxes = { day: [], allDay: [] };

	if (!weekArray.length) return boxes;

	const [ weekStart, weekEnd ] = [ startOfDay(weekArray[0]), endOfDay(weekArray[6]) ];

	entries.forEach((entry) => {
		const [ start, end ] = [ new Date(entry.start), new Date(entry.end) ];

		if (start > weekEnd || end < weekStart) return;

		const coordinates = generateCoordinates(start, end);

		if (coordinates.allDay) {
			// Clamp multi-day entries to the visible week.
			coordinates.x = start < weekStart ?
				0 :
				weekArray.findIndex((d) => compareDates(d, start));
			coordinates.x2 = end > weekEnd ?
				6 :
				weekArray.findIndex((d) => compareDates(d, end));

			boxes.allDay.push({ ...entry, coordinates });
		} else if (start >= weekStart && start <= weekEnd) {
			coordinates.x = weekArray.findIndex((d) => compareDates(d, start));
			boxes.day.push({ ...entry, coordinates });
		}
	});

	boxes.day.sort((a, b) => (
		(a.coordinates.y - b.coordinates.y) || (a.coordinates.e - b.coordinates.e)
	));

	return boxes;
};

/**
 * getDayBoxes
 * Same as getWeekBoxes but for a single day.
 */
export const getDayBoxes = (entries = [], date) => {
	const boxes = { day: [], allDay: [] };

	const [ dayStart, dayEnd ] = [ startOfDay(date), endOfDay(date) ];

	entries.forEach((entry) => {
		const [ start, end ] = [ new Date(entry.start), new Date(entry.end) ];

		if (start > dayEnd || end < dayStart) return;

		const coordinates = generateCoordinates(start, end);

		if (coordinates.allDay) {
			boxes.allDay.push({ ...entry, coordinates });
		} else {
			boxes.day.push({ ...entry, coordinates });
		}
	});

	boxes.day.sort((a, b) => (
		(a.coordinates.y - b.coordinates.y) || (a.coordinates.e - b.coordinates.e)
	));

	return boxes;
};

/**
 * getEntriesByDateKey
 * Map of 'yyyy-m-d' -> entries starting that day (sorted by start).
 */
export const getEntriesByDateKey = (entries = []) => {
	const map = {};

	[ ...entries ]
		.sort((a, b) => new Date(a.start) - new Date(b.start))
		.forEach((entry) => {
			const key = toDateKey(new Date(entry.start));
			(map[key] = map[key] || []).push(entry);
		});

	return map;
};

/**
 * getColumnLayout
 * Assign left/width fractions + z-index to overlapping boxes of a
 * column so stacked events remain clickable (port of the original
 * setBoxWidthWeek / handleOverlap system).
 */
export const getColumnLayout = (columnBoxes = []) => {
	const layout = {};

	columnBoxes.forEach(({ id }) => {
		layout[id] = { left: 0, width: 1, z: 1 };
	});

	// Collision detection: pairs of boxes that intersect vertically.
	const overlaps = [];

	for (let i = 0; i < columnBoxes.length; i++) {
		for (let j = i + 1; j < columnBoxes.length; j++) {
			const [ e1, e2 ] = [ columnBoxes[i], columnBoxes[j] ];

			if (
				e1.coordinates.y < e2.coordinates.e &&
				e1.coordinates.e > e2.coordinates.y
			) {
				if (!overlaps.includes(e1)) overlaps.push(e1);
				if (!overlaps.includes(e2)) overlaps.push(e2);
			}
		}
	}

	overlaps
		.sort((a, b) => (
			(a.coordinates.y - b.coordinates.y) || (a.coordinates.e - b.coordinates.e)
		))
		.forEach((box, i) => {
			const left = Math.min((i % 15) * 0.15, 0.85);
			layout[box.id] = { left, width: 1 - left, z: i + 1 };
		});

	return layout;
};

/**
 * getMonthCells
 * 35/42-cell matrix (Sunday first) covering the given month,
 * padded with prev/next month days.
 */
export const getMonthCells = (year, month) => {
	const firstOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const leading = firstOfMonth.getDay();

	const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;

	return new Array(totalCells).fill(null).map((_, idx) => (
		new Date(year, month, idx + 1 - leading)
	));
};

export default {
	toDateKey,
	startOfDay,
	endOfDay,
	getDayBoxes,
	getWeekBoxes,
	getMonthCells,
	quarterToDate,
	dateToQuarter,
	getColumnLayout,
	getEntriesByDateKey,
	generateCoordinates,
	QUARTER_HEIGHT,
	QUARTERS_PER_DAY,
}
