import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isToday } from '@utils/dates';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectDate, selectView } from '@store/selectors/app';
import { setDate, setView, setModal } from '@store/actions/app';
import { toDateKey, getMonthCells, getEntriesByDateKey } from '@utils/entries';
import { selectActiveEntries, selectCategoryColors } from '@store/selectors/entries';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS, TOTAL_DAY_WEEK } from '@constants/calendar';

const BOX_TOP = 20; 		// vertical offset between stacked boxes
const BOX_HEIGHT = 18; 		// box height (px)
const MAX_VISIBLE_BOXES = 4; 	// after this many entries the day is grouped

// Month grid always starts on Sunday (like the original).
const MONTH_WEEK_LABELS = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ];

const MonthScheduling = ({
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

	const categoryColors = useSelector(selectCategoryColors);

	const setPrevMonth = (d, m, y) => {
		const prevMonth = new Date(y, m - 1, 1);

		dispatch(setDate(
			prevMonth.getFullYear(),
			prevMonth.getMonth(),
			prevMonth.getDate(),
		));
	};

	const setNextMonth = (d, m, y) => {
		const nextMonth = new Date(y, m + 1, 1);

		dispatch(setDate(
			nextMonth.getFullYear(),
			nextMonth.getMonth(),
			nextMonth.getDate(),
		));
	};

	React.useEffect(() => {
		prevFnRef.current = { setPrevMonth };
	}, [ prevFnRef ]);

	React.useEffect(() => {
		nextFnRef.current = { setNextMonth };
	}, [ nextFnRef ]);

	// Set header view title.
	React.useEffect(() => {
		if (calendarView !== BASE_CALENDAR_VIEWS.MONTH) return null;

		setHeaderTitle(
			`${CALENDAR_LABELS.MONTH.LONG[selectedMonth]} ${selectedYear}`
		);
	}, [ selectedYear, selectedMonth ]);

	const cells = React.useMemo(() => (
		getMonthCells(selectedYear, selectedMonth)
	), [ selectedYear, selectedMonth ]);

	const entriesByKey = React.useMemo(() => (
		getEntriesByDateKey(activeEntries)
	), [ activeEntries ]);

	const openDayView = (day) => {
		dispatch(setDate(day.getFullYear(), day.getMonth(), day.getDate()));
		dispatch(setView(BASE_CALENDAR_VIEWS.DAY));
	};

	const onBoxClick = (e, id) => {
		e.stopPropagation();

		dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
			id,
			x: e.clientX,
			y: e.clientY,
		}));
	};

	// Click an empty cell to create an entry that morning.
	const onCellClick = (e, day) => {
		if (e.target !== e.currentTarget) return;

		const start = new Date(day);
		start.setHours(9, 0, 0, 0);
		const end = new Date(day);
		end.setHours(10, 0, 0, 0);

		dispatch(setModal(MODAL_SECTIONS.CREATE_EVENT, {
			start: start.toISOString(),
			end: end.toISOString(),
		}));
	};

	const setDayNumberClassName = (day) => ([
		'monthview--daynumber',
		day.getMonth() !== selectedMonth ? 'monthview--daynumber-prevnext' : null,
		isToday(day) ? 'monthview--daynumber-today' : null,
	].filter(Boolean).join(' '));

	const setDayNumberText = (day) => (
		(day.getMonth() !== selectedMonth || day.getDate() === 1) ?
			`${day.getDate()} ${CALENDAR_LABELS.MONTH.SHORT[day.getMonth()]}` :
			day.getDate()
	);

	return (
		<div className="monthview">
			<div className="monthview__top">
				{MONTH_WEEK_LABELS.map((weekday) => (
					<div key={weekday} className="monthview__top-weekname">
						{weekday}
					</div>
				))}
			</div>
			<div className={[
				'monthview--calendar',
				cells.length === 35 ? 'five-weeks' : null,
			].filter(Boolean).join(' ')}>
				{cells.map((day, idx) => {
					const dayEntries = entriesByKey[toDateKey(day)] || [];

					const isGrouped = dayEntries.length > MAX_VISIBLE_BOXES;

					const visibleEntries = isGrouped ?
						dayEntries.slice(0, MAX_VISIBLE_BOXES - 1) :
						dayEntries;

					return (
						<div
							key={toDateKey(day)}
							data-mv-idx={idx}
							data-mv-date={toDateKey(day)}
							data-mv-coordinates={`${day.getDay()},${Math.floor(idx / TOTAL_DAY_WEEK)}`}
							className={[
								'monthview--day',
								isToday(day) ? 'monthview--today' : null,
							].filter(Boolean).join(' ')}
						>
							<button
								onClick={() => openDayView(day)}
								className={[
									'monthview--dayofmonth',
									(
										day.getMonth() === selectedMonth &&
										day.getDate() === selectedDay
									) ? 'monthview--dayofmonth-selected' : null,
								].filter(Boolean).join(' ')}
							>
								<span className={setDayNumberClassName(day)}>
									{setDayNumberText(day)}
								</span>
							</button>
							<div
								className="monthview--daycontent"
								onClick={(e) => onCellClick(e, day)}
							>
								{visibleEntries.map((entry, boxIdx) => (
									<div
										key={entry.id}
										className="monthview--box"
										data-monthview-id={entry.id}
										onClick={(e) => onBoxClick(e, entry.id)}
										style={{
											width: '100%',
											cursor: 'pointer',
											top: `${boxIdx * BOX_TOP}px`,
											height: `${BOX_HEIGHT}px`,
											backgroundColor: categoryColors[entry.category] || 'rgb(44, 82, 186)',
										}}
									>
										<div className="monthview--title">
											{entry.title}
										</div>
									</div>
								))}
								{isGrouped ? (
									<div
										className="monthview--daygroup"
										onClick={() => openDayView(day)}
										data-mvgrouped-length={dayEntries.length}
										style={{
											cursor: 'pointer',
											position: 'absolute',
											width: '100%',
											top: `${(MAX_VISIBLE_BOXES - 1) * BOX_TOP}px`,
										}}
									>
										<div className="monthview--grouped">
											<div className="monthview--daycontent__grouped-title">
												{dayEntries.length - (MAX_VISIBLE_BOXES - 1)} more...
											</div>
										</div>
									</div>
								) : null}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default MonthScheduling;
