import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isToday } from '@utils/dates';
import { setDate } from '@store/actions/app';
import { selectDate } from '@store/selectors/app';
import { toDateKey, getEntriesByDateKey } from '@utils/entries';
import { selectActiveEntries } from '@store/selectors/entries';
import { CALENDAR_LABELS, WEEK_START, TOTAL_DAY_WEEK } from '@constants/calendar';

const DATEPICKER_WEEK_LABELS = [ 'M', 'T', 'W', 'T', 'F', 'S', 'S' ];

const SidebarDatepicker = () => {
	const dispatch = useDispatch();

	const {
		day: selectedDay,
		year: selectedYear,
		month: selectedMonth,
	} = useSelector(selectDate);

	const activeEntries = useSelector(selectActiveEntries);

	// Month currently displayed by the picker (navigates independently).
	const [ displayed, setDisplayed ] = React.useState({
		year: selectedYear,
		month: selectedMonth,
	});

	// Follow the app's selected date.
	React.useEffect(() => {
		setDisplayed({ year: selectedYear, month: selectedMonth });
	}, [ selectedYear, selectedMonth ]);

	const onPrevClick = () => {
		const prev = new Date(displayed.year, displayed.month - 1, 1);
		setDisplayed({ year: prev.getFullYear(), month: prev.getMonth() });
	};

	const onNextClick = () => {
		const next = new Date(displayed.year, displayed.month + 1, 1);
		setDisplayed({ year: next.getFullYear(), month: next.getMonth() });
	};

	const onDayClick = (day) => {
		dispatch(setDate(day.getFullYear(), day.getMonth(), day.getDate()));
	};

	const entriesByKey = React.useMemo(() => (
		getEntriesByDateKey(activeEntries)
	), [ activeEntries ]);

	// Monday-first grid covering the displayed month.
	const cells = React.useMemo(() => {
		const first = new Date(displayed.year, displayed.month, 1);
		const daysInMonth = new Date(displayed.year, displayed.month + 1, 0).getDate();
		const leading = (first.getDay() - WEEK_START + 7) % 7;
		const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;

		return new Array(totalCells).fill(null).map((_, idx) => (
			new Date(displayed.year, displayed.month, idx + 1 - leading)
		));
	}, [ displayed ]);

	// Bounds of the week holding the selected date (for week highlight).
	const [ weekStart, weekEnd ] = React.useMemo(() => {
		const start = new Date(selectedYear, selectedMonth, selectedDay);
		start.setDate(start.getDate() - ((start.getDay() - WEEK_START + 7) % 7));
		start.setHours(0, 0, 0, 0);

		const end = new Date(start);
		end.setDate(end.getDate() + TOTAL_DAY_WEEK);

		return [ start, end ];
	}, [ selectedYear, selectedMonth, selectedDay ]);

	const setDatenameClassName = (day) => ([
		'sbdatepicker__body--datename',
		day.getMonth() !== displayed.month ? 'sbdatepicker__body--datename-disabled' : null,
		isToday(day) ? 'sbdatepicker__body--datename-today' : null,
		(
			day.getDate() === selectedDay &&
			day.getMonth() === selectedMonth &&
			day.getFullYear() === selectedYear
		) ? 'sbdatepicker__body--datename-selected' : null,
		entriesByKey[toDateKey(day)] ? 'sbdatepicker__body--datename-entries' : null,
	].filter(Boolean).join(' '));

	return (
		<div className="datepicker-sidebar">
			<div className="sb-datepicker__content">
				<div className="sbdatepicker__header">
					<button
						className="sbdatepicker-title"
						aria-label="button"
						role="button"
					>
						{CALENDAR_LABELS.MONTH.LONG[displayed.month]} {displayed.year}
					</button>
					<div className="sbdatepicker-nav">
						<button
							className="sbdatepicker-nav--prev"
							onClick={onPrevClick}
							aria-label="button"
							role="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 0 24 24"
								width="24px"
								fill="var(--white3)"
								style={{ userSelect: 'none', pointerEvents: 'none' }}
							>
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
							</svg>
						</button>
						<button
							className="sbdatepicker-nav--next"
							onClick={onNextClick}
							aria-label="button"
							role="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 0 24 24"
								width="24px"
								fill="var(--white3)"
								style={{ userSelect: 'none', pointerEvents: 'none' }}
							>
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z" />
							</svg>
						</button>
					</div>
				</div>
				<div className="sbdatepicker__body">
					<div className="sbdatepicker__body--header">
						{DATEPICKER_WEEK_LABELS.map((weekday, i) => (
							<div
								key={`sbdp-weekday-${i}`}
								className="sbdatepicker__body--header-cell"
							>
								{weekday}
							</div>
						))}
					</div>
					<div className="sbdatepicker__body--dates">
						{cells.map((day) => (
							<div
								key={toDateKey(day)}
								className={[
									'sbdatepicker__body--dates-cell',
									(day >= weekStart && day < weekEnd) ? 'sbdatepicker__body--dates-week' : null,
								].filter(Boolean).join(' ')}
							>
								<div
									className={setDatenameClassName(day)}
									onClick={() => onDayClick(day)}
									data-sbdp-date={toDateKey(day)}
									style={{ cursor: 'pointer' }}
								>
									{day.getDate()}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SidebarDatepicker;
