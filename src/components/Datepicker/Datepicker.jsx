import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isToday } from '@utils/dates';
import { setDate } from '@store/actions/app';
import { CALENDAR_LABELS } from '@constants/calendar';
import { selectEntries } from '@store/selectors/entries';
import { toDateKey, getEntriesByDateKey } from '@utils/entries';
import { selectDate, selectModalData } from '@store/selectors/app';

// Header datepicker opens Sunday-first (like the original).
const WEEKDAYS_NARROW = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

const POPUP_WIDTH = 256;

// Anchor the popup below the header title, clamped to the viewport.
const setPopupPosition = (x = 0, y = 0) => ({
	top: `${y || 56}px`,
	left: `${Math.max(Math.min(x, window.innerWidth - POPUP_WIDTH - 8), 8)}px`,
});

const Datepicker = ({
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const modalData = useSelector(selectModalData);

	// All entries (not just checked categories): the picker's
	// presentation stays identical when calendars are toggled.
	const allEntries = useSelector(selectEntries);

	const {
		day: selectedDay,
		year: selectedYear,
		month: selectedMonth,
	} = useSelector(selectDate);

	// Month currently displayed by the picker (navigates independently).
	const [ displayed, setDisplayed ] = React.useState({
		year: selectedYear,
		month: selectedMonth,
	});

	// Snapshot position once; modalData is cleared on close.
	const [ position ] = React.useState(() => (
		setPopupPosition(modalData?.x, modalData?.y)
	));

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
		onClose();
	};

	const entriesByKey = React.useMemo(() => (
		getEntriesByDateKey(allEntries)
	), [ allEntries ]);

	// Sunday-first grid covering the displayed month.
	const cells = React.useMemo(() => {
		const first = new Date(displayed.year, displayed.month, 1);
		const daysInMonth = new Date(displayed.year, displayed.month + 1, 0).getDate();
		const leading = first.getDay();
		const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;

		return new Array(totalCells).fill(null).map((_, idx) => (
			new Date(displayed.year, displayed.month, idx + 1 - leading)
		));
	}, [ displayed ]);

	// One state class at a time: today beats selected beats disabled
	// beats has-entries (today keeps its circle even in an adjacent
	// month's cells, like Google).
	const setDatenameClassName = (day) => {
		if (isToday(day)) {
			return 'datepicker__body--datename datepicker__body--datename-today';
		}

		if (
			day.getDate() === selectedDay &&
			day.getMonth() === selectedMonth &&
			day.getFullYear() === selectedYear
		) {
			return 'datepicker__body--datename datepicker__body--datename-selected';
		}

		if (day.getMonth() !== displayed.month) {
			return 'datepicker__body--datename datepicker__body--datename-disabled';
		}

		if (entriesByKey[toDateKey(day)]) {
			return 'datepicker__body--datename datepicker__body--datename-entries';
		}

		return 'datepicker__body--datename';
	};

	return (
		<>
			<aside className="datepicker" style={position}>
				<div className="datepicker__header">
					<button
						className="datepicker-title"
						role="button"
						aria-label="button"
					>
						{CALENDAR_LABELS.MONTH.LONG[displayed.month]} {displayed.year}
					</button>
					<div className="datepicker-nav">
						<button
							className="datepicker-nav--prev"
							onClick={onPrevClick}
							role="button"
							aria-label="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 0 24 24"
								width="24px"
								fill="var(--white3)"
								style={{ userSelect: "none", pointerEvents: "none" }}
							>
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
							</svg>
						</button>
						<button
							className="datepicker-nav--next"
							onClick={onNextClick}
							role="button"
							aria-label="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 0 24 24"
								width="24px"
								fill="var(--white3)"
								style={{ userSelect: "none", pointerEvents: "none" }}
							>
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z" />
							</svg>
						</button>
					</div>
				</div>
				<div className="datepicker__body">
					<div className="datepicker__body--header">
						{WEEKDAYS_NARROW.map((weekday, i) => (
							<div
								key={`dp-weekday-${i}`}
								className="datepicker__body--header-cell"
							>
								{weekday}
							</div>
						))}
					</div>
					<div className="datepicker__body--dates">
						{cells.map((day) => (
							<div
								key={toDateKey(day)}
								className="datepicker__body--dates-cell"
							>
								<div
									className={setDatenameClassName(day)}
									onClick={() => onDayClick(day)}
									data-datepicker-date={toDateKey(day)}
									style={{ cursor: 'pointer' }}
								>
									{day.getDate()}
								</div>
							</div>
						))}
					</div>
				</div>
			</aside>
			<aside
				className="datepicker-overlay"
				onClick={onClose}
				style={{ position: 'fixed', inset: 0 }}
			/>
		</>
	);
}

export default Datepicker;
