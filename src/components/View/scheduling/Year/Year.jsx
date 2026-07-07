import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setDate, setView } from '@store/actions/app';
import { selectDate, selectView } from '@store/selectors/app';
import { selectActiveEntries } from '@store/selectors/entries';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS } from '@constants/calendar';

const WEEKDAYS_NARROW = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

const YearScheduling = ({
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

	const setPrevYear = (d, m, y) => {
		dispatch(setDate(y - 1, m, 1));
	};

	const setNextYear = (d, m, y) => {
		dispatch(setDate(y + 1, m, 1));
	};

	React.useEffect(() => {
		prevFnRef.current = { setPrevYear };
	}, [ prevFnRef ]);

	React.useEffect(() => {
		nextFnRef.current = { setNextYear };
	}, [ nextFnRef ]);

	// Set header view title.
	React.useEffect(() => {
		if (calendarView !== BASE_CALENDAR_VIEWS.YEAR) return null;

		setHeaderTitle(`${selectedYear}`);
	}, [ selectedYear ]);

	// Days with entries: { [month]: Set<dayOfMonth> } for this year.
	const entryDays = React.useMemo(() => {
		const map = {};

		activeEntries.forEach(({ start }) => {
			const d = new Date(start);

			if (d.getFullYear() !== selectedYear) return;

			(map[d.getMonth()] = map[d.getMonth()] || new Set()).add(d.getDate());
		});

		return map;
	}, [ activeEntries, selectedYear ]);

	const today = new Date();

	const onDayClick = (month, day) => {
		dispatch(setDate(selectedYear, month, day));
		dispatch(setView(BASE_CALENDAR_VIEWS.DAY));
	};

	const renderMonthCell = (month) => {
		const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
		const firstDayOfMonth = new Date(selectedYear, month, 1).getDay();
		const daysInPrevMonth = new Date(selectedYear, month, 0).getDate();

		const isCurrentMonth = (
			month === selectedMonth
		);

		const leadingDays = new Array(firstDayOfMonth).fill(null).map((_, i) => (
			daysInPrevMonth - firstDayOfMonth + i + 1
		));

		const setDayClassName = (day) => ([
			'yv-monthcell__body--day-wrapper',
			(
				day === today.getDate() &&
				month === today.getMonth() &&
				selectedYear === today.getFullYear()
			) ? 'yvmb-today' : null,
			(
				day === selectedDay &&
				month === selectedMonth
			) ? 'yvmb-selected' : null,
			entryDays[month]?.has(day) ? 'yvmb-has-entry' : null,
		].filter(Boolean).join(' '));

		return (
			<div
				key={`yv-month-${month}`}
				className={[
					'yv-monthcell',
					isCurrentMonth ? 'cell-current' : null,
				].filter(Boolean).join(' ')}
			>
				<div className="yv-monthcell__header">
					<div className={[
						'yv-monthcell__header--rowone',
						isCurrentMonth ? 'yvmht-current' : null,
					].filter(Boolean).join(' ')}>
						{CALENDAR_LABELS.MONTH.LONG[month]}
					</div>
					<div className="yv-monthcell__header--weekdays">
						{WEEKDAYS_NARROW.map((weekday, i) => (
							<div
								key={`yv-weekday-${month}-${i}`}
								className="yv-monthcell__header--weekday"
							>
								{weekday}
							</div>
						))}
					</div>
				</div>
				<div className="yv-monthcell__body">
					{leadingDays.map((day) => (
						<div
							key={`yv-prev-${month}-${day}`}
							className="yv-monthcell__body--day-wrapper yvmb-prevnext"
						>
							{day}
						</div>
					))}
					{new Array(daysInMonth).fill(null).map((_, i) => (
						<div
							key={`yv-day-${month}-${i + 1}`}
							data-yv-date={`${selectedYear}-${month}-${i + 1}`}
							className={setDayClassName(i + 1)}
							onClick={() => onDayClick(month, i + 1)}
							style={{ cursor: 'pointer' }}
						>
							{i + 1}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="yearview">
			<div className="calendar__yearview">
				{new Array(12).fill(null).map((_, month) => (
					renderMonthCell(month)
				))}
			</div>
		</div>
	);
}

export default YearScheduling;
