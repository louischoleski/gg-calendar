import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setDate } from '@store/actions/app';
import { selectDate, selectView } from '@store/selectors/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS, WEEK_START, WEEK_END, } from '@constants/calendar';

import WeekGrid from './WeekGrid';
import WeekHeader from './WeekHeader';
import WeekSidebar from './WeekSidebar';

const WeekScheduling = ({
	prevFnRef = null,
	nextFnRef = null,
	setHeaderTitle = () => null,
}) => {
	const dispatch = useDispatch();

	const {
		day: selectedDay,
		year: selectedYear,
		month: selectedMonth,
	} = useSelector(selectDate);

	const calendarView = useSelector(selectView);

	const setPrevWeek = (d, m, y) => {
		const prevWeek = new Date(
			y, m, d - 7
		);

		dispatch(setDate(
			prevWeek.getFullYear(),
			prevWeek.getMonth(),
			prevWeek.getDate(),
		));
	};

	const setNextWeek = (d, m, y) => {
		const nextWeek = new Date(
			y, m, d + 7
		);

		dispatch(setDate(
			nextWeek.getFullYear(),
			nextWeek.getMonth(),
			nextWeek.getDate(),
		));
	};

	React.useEffect(() => {
		prevFnRef.current = { setPrevWeek };
	}, [prevFnRef]);

	React.useEffect(() => {
		nextFnRef.current = { setNextWeek };
	}, [nextFnRef]);

	// Set week array.
	const weekArray = React.useMemo(() => {
		const week = new Date(selectedYear, selectedMonth, selectedDay);

		week.setDate(week.getDate() - week.getDay());

		let weekArray = [];

		for (let i = WEEK_START; i < WEEK_END; i++) {
			if (i < 6) {
				weekArray.push(new Date(week.getFullYear(), week.getMonth(), week.getDate() + i));
			} else {
				weekArray.push(new Date(week.getFullYear(), week.getMonth(), week.getDate() + i, 23, 59, 59, 999));
			}
		}

		return weekArray;
	}, [selectedYear, selectedMonth, selectedDay]);

	// Set header view title.
	React.useEffect(() => {
		if (calendarView !== BASE_CALENDAR_VIEWS.WEEK) return null;

		const [[m1, m2], [d1, d2]] = [
			[weekArray[0].getMonth(), weekArray[6].getMonth()],
			[weekArray[0].getDate(), weekArray[6].getDate()]
		];

		let res = null;

		if (m1 === m2) {
			res = `${CALENDAR_LABELS.MONTH.SHORT[m1]} ${d1} – ${d2}, ${weekArray[0].getFullYear()}`;
		} else {
			res = `${CALENDAR_LABELS.MONTH.SHORT[m1]} ${d1} – ${d2} ${CALENDAR_LABELS.MONTH.SHORT[m2]}, ${weekArray[1].getFullYear()}`;
		}

		setHeaderTitle(res);
	}, [weekArray]);

	return (
		<div className="weekview">
			<WeekHeader
				weekArray={weekArray}
			/>
			<div className="weekview__grid">
				<WeekSidebar />
				<WeekGrid weekArray={weekArray} />
				<div />
				<div className="weekview--footer" />
			</div>
		</div>
	);
}

export default WeekScheduling;
