import { compareDates } from '@utils/dates';
import { formatStartEndTimes } from '@utils/time';

export const setDayTitleStyle = (isToday = false) => (
	isToday ? ({
		'color': 'var(--primary1)'
	}) : ({})
);

export const setDayTitleClassName = (isToday = false) => ([
	'dayview--header-day__number',
	(isToday ? 'dayview--header-day__number--today' : ''),
].join(' ').trim());

const formatEntryTimes = (entry) => {
	const [ start, end ] = [ new Date(entry.start), new Date(entry.end) ];

	return formatStartEndTimes(
		[ start.getHours(), end.getHours() ],
		[ start.getMinutes(), end.getMinutes() ]
	);
};

// Timeframe spanning the earliest start to the latest end of the
// day's boxes (from their quarter-hour coordinates).
const firstLastDates = (dayBoxes = []) => {
	let [ shortest, longest ] = [ 100, 0 ];

	dayBoxes.forEach(({ coordinates }) => {
		shortest = Math.min(shortest, coordinates.y);
		longest = Math.max(longest, coordinates.e);
	});

	return formatStartEndTimes(
		[ Math.floor(shortest / 4), Math.floor(longest / 4) ],
		[ (shortest % 4) * 15, (longest % 4) * 15 ]
	);
};

/**
 * getDayHeaderInfo
 * Header summary of how many entries start/end on the given day and
 * their timeframe (port of the original getDayviewHeaderEntryCount),
 * e.g. "3 entries starting & ending today ( 6 – 7am )".
 */
export const getDayHeaderInfo = (dayBoxes = [], allDayBoxes = [], currentDate = null) => {
	const allBoxes = [ ...dayBoxes, ...allDayBoxes ];

	if (allBoxes.length === 0) {
		return 'no entries';
	}

	let [ startingToday, endingToday ] = [ 0, 0 ];
	let lastEnding = null;

	allBoxes.forEach((entry) => {
		if (compareDates(new Date(entry.start), currentDate)) {
			startingToday++;
		}

		if (compareDates(new Date(entry.end), currentDate)) {
			endingToday++;
			lastEnding = entry;
		}
	});

	if (startingToday === 1 && endingToday === 1) {
		return `1 entry ( ${formatEntryTimes(allBoxes[0])} )`;
	}

	if (startingToday > 1 && startingToday === endingToday) {
		return `${startingToday} entries starting & ending today ( ${firstLastDates(dayBoxes)} )`;
	}

	let fullTitle = '';

	if (startingToday > 0) {
		fullTitle += startingToday === 1 ?
			`${startingToday} entry starting today` :
			`${startingToday} entries started`;
	} else {
		fullTitle += 'no entries started';
	}

	if (endingToday > 0) {
		fullTitle += endingToday === 1 ?
			` – ${endingToday} ending ( ${formatEntryTimes(lastEnding)} )` :
			` – ${endingToday} ending ( ${firstLastDates(dayBoxes)} )`;
	} else {
		fullTitle += ' – no entries ending today';
	}

	return fullTitle;
};
