import React from 'react';

import { WEEK_START } from '@constants/calendar';
import { testDate, compareDates } from '@utils/dates';

const ctg = {
	'default': {
		'color': '#2C52BA',
		'active': true
	},
	'Testing': {
		'color': '#C20000',
		'active': true
	}
}

const store = [
	{
		category: 'default',
		completed: false,
		description: '',
		end: '2024-11-27T07:00:00.000Z',
		id: 'lsm06ujyr33rjnw3pm',
		start: '2024-11-27T06:00:00.000Z',
		title: 'First entry',
		// 'coordinates': {
		// 	allDay: false,
		// 	x: 3,
		// 	y: 4,
		// 	h: 4,
		// 	e: 8
		// }
	},
	{
		category: 'default',
		completed: false,
		description: '',
		end: '2024-11-27T15:00:00.000Z',
		id: 'lsm075xmwbzyx9lupk',
		start: '2024-11-27T13:00:00.000Z',
		title: 'Second entry',
		// 'coordinates': {
		// 	x: 1,
		// 	y: 32,
		// 	h: 8,
		// 	e: 40
		// }
	},
	{
		category: 'default',
		completed: false,
		description: '',
		end: '2024-11-27T23:00:00.000Z',
		id: 'lsm07fg3ihs1bgdvpig',
		start: '2024-11-27T22:00:00.000Z',
		title: 'Third entry'
	}
];

const useDayGrid = () => {
	/* *************************************** */
	/* SEGMENT ENTRIES FOR SPECIFIC VIEWS (YEAR/MONTH/...ect)*/

	// @generateCoordinates -- (only used in week and day view)
	// generates coordinates based on start and end times for a given entry
	// if an entry spans beyond a day, it will render at the top of the grid in
	// a static (immobile) position.
	const generateCoordinates = (start, end, startWeekIndex = WEEK_START) => {
		[ start, end ] = [ testDate(start), testDate(end) ];

		const startMin = start.getHours() * 4 + Math.floor(start.getMinutes() / 15);
		const endMin = end.getHours() * 4 + Math.floor(end.getMinutes() / 15);
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
		} else {
			return {
				allDay: false,
				x: startIdx,
				y: startMin,
				h: height,
				e: total,
			};
		}
	}

	const getActiveCategories = () => {
		const active = Object.keys(ctg).filter((key) => ctg[key].active);
		return (active.length > 0) ? active : [];
	}

	const getActiveEntries = () => {
		const active = getActiveCategories();

		if (!active) return [];

		const activeEntries = store.filter((entry) => {
			return active ? active.indexOf(entry.category) > -1 : [];
		});

		return activeEntries;
	}

	const getDayEntries = (day) => {
		const activeEntries = getActiveEntries();

		const boxes = {
			allDay: [], 	// entries that start on one day and end on another
			day: [], 	// entries that start and end on same day
		};

		if (activeEntries.length === 0) return boxes;

		const dayEntries = activeEntries.filter((entry) => {
			const entryDate = new Date(entry.start);

			const [ y, m, d ] = [
				entryDate.getFullYear(),
				entryDate.getMonth(),
				entryDate.getDate(),
			];

			return (
				y === day.getFullYear() && 
				m === day.getMonth() && 
				d === day.getDate()
			);
		});

		dayEntries.forEach((entry) => {
			entry.coordinates = generateCoordinates(
				new Date(entry.start),
				new Date(entry.end)
			);

			if (entry.coordinates.allDay) {
				boxes.allDay.push(entry);
			} else {
				boxes.day.push(entry);
			}
		});

		return boxes;
	}

	return {
		getDayEntries,
	}
}

export default useDayGrid;
