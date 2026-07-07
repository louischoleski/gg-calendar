import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getWeekBoxes } from '@utils/entries';
import { setDate } from '@store/actions/app';
import { selectActiveEntries } from '@store/selectors/entries';
import { selectDate, selectView, selectCollapsed } from '@store/selectors/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS, WEEK_START, TOTAL_DAY_WEEK } from '@constants/calendar';

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

	const activeEntries = useSelector(selectActiveEntries);

	// Eye toggle: grid reclaims the header space when collapsed.
	const { header: isHeaderCollapsed } = useSelector(selectCollapsed);

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

		// Back up to the first day of the week (respects WEEK_START).
		week.setDate(week.getDate() - ((week.getDay() - WEEK_START + 7) % 7));

		return new Array(TOTAL_DAY_WEEK).fill(null).map((_, i) => (
			new Date(week.getFullYear(), week.getMonth(), week.getDate() + i)
		));
	}, [selectedYear, selectedMonth, selectedDay]);

	// Split active entries into single-day / multi-day boxes for this week.
	const boxes = React.useMemo(() => (
		getWeekBoxes(activeEntries, weekArray)
	), [ activeEntries, weekArray ]);

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
			res = `${CALENDAR_LABELS.MONTH.SHORT[m1]} ${d1} – ${CALENDAR_LABELS.MONTH.SHORT[m2]} ${d2}, ${weekArray[6].getFullYear()}`;
		}

		setHeaderTitle(res);
	}, [weekArray]);

	return (
		<div className="weekview">
			<WeekHeader
				weekArray={weekArray}
				allDayBoxes={boxes.allDay}
			/>
			<div className={[
				'weekview__grid',
				isHeaderCollapsed ? 'wvh-body-collapse' : null,
			].filter(Boolean).join(' ')}>
				<WeekSidebar />
				<WeekGrid weekArray={weekArray} boxes={boxes.day} />
				<div />
				<div className="weekview--footer" />
			</div>
		</div>
	);
}

export default WeekScheduling;
