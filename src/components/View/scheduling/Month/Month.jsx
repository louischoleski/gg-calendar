import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isToday } from '@utils/dates';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectDate, selectView } from '@store/selectors/app';
import { updateEntry } from '@store/actions/entries';
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

	const gridRef = React.useRef(null);

	// Active box drag between cells:
	// { entry, toIdx, cellW, cellH } | null
	const [ drag, setDrag ] = React.useState(null);

	// Drag a month box across cells (snaps cell to cell, like the
	// original MV drag engine); under 4px of movement it's a click.
	const onBoxMouseDown = (e, entry) => {
		if (e.button !== 0 || !gridRef.current) return;

		e.preventDefault();
		e.stopPropagation();

		const rect = gridRef.current.getBoundingClientRect();
		const rows = cells.length / TOTAL_DAY_WEEK;
		const cellW = rect.width / TOTAL_DAY_WEEK;
		const cellH = rect.height / rows;

		// The grabbed box's exact offset inside its cell — the clone
		// reuses it so engaging the drag never shifts the box.
		const boxRect = e.currentTarget.getBoundingClientRect();
		const startCol = Math.floor((boxRect.left + 1 - rect.left) / cellW);
		const startRow = Math.floor((boxRect.top + 1 - rect.top) / cellH);
		const offsetX = boxRect.left - (rect.left + startCol * cellW);
		const offsetY = boxRect.top - (rect.top + startRow * cellH);
		const boxW = boxRect.width;

		const session = { moved: false, toIdx: null };

		const handleMove = (ev) => {
			if (!session.moved && (
				Math.abs(ev.clientX - e.clientX) > 3 ||
				Math.abs(ev.clientY - e.clientY) > 3
			)) {
				session.moved = true;
				document.body.style.cursor = 'move';
			}

			if (!session.moved) return;

			const cx = Math.min(Math.max(Math.floor((ev.clientX - rect.left) / cellW), 0), TOTAL_DAY_WEEK - 1);
			const cy = Math.min(Math.max(Math.floor((ev.clientY - rect.top) / cellH), 0), rows - 1);

			session.toIdx = cy * TOTAL_DAY_WEEK + cx;

			setDrag({ entry, toIdx: session.toIdx, cellW, cellH, offsetX, offsetY, boxW });
		};

		const handleUp = (ev) => {
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleUp);

			document.body.style.cursor = '';
			setDrag(null);

			if (!session.moved) {
				// Plain click: open the entry details popup.
				dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
					id: entry.id,
					x: ev.clientX,
					y: ev.clientY,
				}));
				return;
			}

			// Swallow the synthetic click that follows a drag so it
			// doesn't reach the cell's click-to-create handler.
			document.addEventListener('click', (ce) => {
				ce.stopPropagation();
			}, { capture: true, once: true });

			const target = cells[session.toIdx];

			if (!target) return;

			// Move to the dropped cell's day, keeping time and duration.
			const start = new Date(entry.start);
			const duration = new Date(entry.end) - start;

			const newStart = new Date(
				target.getFullYear(), target.getMonth(), target.getDate(),
				start.getHours(), start.getMinutes(), 0, 0
			);

			if (newStart.getTime() === start.getTime()) return;

			dispatch(updateEntry(entry.id, {
				start: newStart.toISOString(),
				end: new Date(newStart.getTime() + duration).toISOString(),
			}));
		};

		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleUp);
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
			<div
				ref={gridRef}
				style={{ position: 'relative' }}
				className={[
					'monthview--calendar',
					cells.length === 35 ? 'five-weeks' : null,
				].filter(Boolean).join(' ')}
			>
				{drag ? (
					// Snapped clone riding over the hovered cell.
					<div
						className="monthview--box box-mv-dragactive"
						style={{
							position: 'absolute',
							height: `${BOX_HEIGHT}px`,
							width: `${drag.boxW}px`,
							left: `${(drag.toIdx % TOTAL_DAY_WEEK) * drag.cellW + drag.offsetX}px`,
							top: `${Math.floor(drag.toIdx / TOTAL_DAY_WEEK) * drag.cellH + drag.offsetY}px`,
							backgroundColor: categoryColors[drag.entry.category] || 'rgb(44, 82, 186)',
						}}
					>
						<div className="monthview--title">
							{drag.entry.title}
						</div>
					</div>
				) : null}
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
								drag?.toIdx === idx ? 'current-drop-zone' : null,
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
										onMouseDown={(e) => onBoxMouseDown(e, entry)}
										style={{
											width: '100%',
											cursor: 'pointer',
											top: `${boxIdx * BOX_TOP}px`,
											height: `${BOX_HEIGHT}px`,
											opacity: drag?.entry.id === entry.id ? 0.5 : 1,
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
