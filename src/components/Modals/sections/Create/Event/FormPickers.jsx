import React from 'react';

import { toDateKey } from '@utils/entries';
import { CALENDAR_LABELS } from '@constants/calendar';

const WEEKDAYS_NARROW = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

export const formatDateTitle = (dateValue) => {
	const [ y, m, d ] = dateValue.split('-').map(Number);
	return `${CALENDAR_LABELS.MONTH.SHORT[m - 1]} ${d}, ${y}`;
};

export const formatTimeTitle = (timeValue) => {
	const [ h, m ] = timeValue.split(':').map(Number);
	const hour12 = h % 12 === 0 ? 12 : h % 12;
	return `${hour12}:${String(m).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
};

const toMinutes = (timeValue) => {
	const [ h, m ] = timeValue.split(':').map(Number);
	return h * 60 + m;
};

// All 96 15-minute times of a day ('00:00' ... '23:45').
const DAY_TIMES = new Array(96).fill(null).map((_, i) => {
	const h = Math.floor(i / 4);
	const m = (i % 4) * 15;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

/**
 * TimePicker
 * Scrollable dropdown of 15-minute times (like the original).
 * When `minTime` is set (end field, same day) only later times show.
 */
export const TimePicker = ({
	value = '',
	minTime = null,
	position = { x: 0, y: 0 },
	onPick = () => null,
	onClose = () => null,
}) => {
	const selectedRef = React.useRef(null);

	const times = React.useMemo(() => (
		minTime ?
			DAY_TIMES.filter((t) => toMinutes(t) > toMinutes(minTime)) :
			DAY_TIMES
	), [ minTime ]);

	React.useEffect(() => {
		selectedRef.current?.scrollIntoView({ block: 'center' });
	}, []);

	return (
		<>
			<div
				className="timepicker"
				style={{
					position: 'fixed',
					top: `${Math.min(position.y, window.innerHeight - 210)}px`,
					left: `${Math.min(position.x, window.innerWidth - 190)}px`,
				}}
			>
				<div className="timepicker-times__container">
					{times.map((time) => (
						<div
							key={time}
							data-tp-time={time}
							ref={time === value ? selectedRef : null}
							onClick={() => { onPick(time); onClose(); }}
							className={[
								'timepicker-time',
								time === value ? 'timepicker-time--selected' : null,
							].filter(Boolean).join(' ')}
						>
							{formatTimeTitle(time)}
						</div>
					))}
				</div>
			</div>
			<div
				className="timepicker-overlay"
				onClick={onClose}
				style={{ position: 'fixed', inset: 0 }}
			/>
		</>
	);
};

/**
 * FormDatepicker
 * Mini month-grid popup for the form's date fields; reuses the
 * header datepicker styling.
 */
export const FormDatepicker = ({
	value = '',
	position = { x: 0, y: 0 },
	onPick = () => null,
	onClose = () => null,
}) => {
	const selected = React.useMemo(() => {
		const [ y, m, d ] = value.split('-').map(Number);
		return new Date(y, m - 1, d);
	}, [ value ]);

	const [ displayed, setDisplayed ] = React.useState({
		year: selected.getFullYear(),
		month: selected.getMonth(),
	});

	const cells = React.useMemo(() => {
		const first = new Date(displayed.year, displayed.month, 1);
		const daysInMonth = new Date(displayed.year, displayed.month + 1, 0).getDate();
		const leading = first.getDay();
		const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;

		return new Array(totalCells).fill(null).map((_, idx) => (
			new Date(displayed.year, displayed.month, idx + 1 - leading)
		));
	}, [ displayed ]);

	const onPrevClick = () => {
		const prev = new Date(displayed.year, displayed.month - 1, 1);
		setDisplayed({ year: prev.getFullYear(), month: prev.getMonth() });
	};

	const onNextClick = () => {
		const next = new Date(displayed.year, displayed.month + 1, 1);
		setDisplayed({ year: next.getFullYear(), month: next.getMonth() });
	};

	const setDatenameClassName = (day) => ([
		'datepicker__body--datename',
		day.getMonth() !== displayed.month ? 'datepicker__body--datename-disabled' : null,
		(
			day.getDate() === selected.getDate() &&
			day.getMonth() === selected.getMonth() &&
			day.getFullYear() === selected.getFullYear()
		) ? 'datepicker__body--datename-selected' : null,
	].filter(Boolean).join(' '));

	return (
		<>
			<aside
				className="datepicker"
				style={{
					top: `${Math.min(position.y, window.innerHeight - 230)}px`,
					left: `${Math.min(position.x, window.innerWidth - 270)}px`,
				}}
			>
				<div className="datepicker__header">
					<button type="button" className="datepicker-title" aria-label="button">
						{CALENDAR_LABELS.MONTH.LONG[displayed.month]} {displayed.year}
					</button>
					<div className="datepicker-nav">
						<button
							type="button"
							className="datepicker-nav--prev"
							onClick={onPrevClick}
							aria-label="button"
						>
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="var(--white3)" style={{ pointerEvents: 'none' }}>
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
							</svg>
						</button>
						<button
							type="button"
							className="datepicker-nav--next"
							onClick={onNextClick}
							aria-label="button"
						>
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="var(--white3)" style={{ pointerEvents: 'none' }}>
								<path d="M0 0h24v24H0z" fill="none" />
								<path d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z" />
							</svg>
						</button>
					</div>
				</div>
				<div className="datepicker__body">
					<div className="datepicker__body--header">
						{WEEKDAYS_NARROW.map((weekday, i) => (
							<div key={`fdp-weekday-${i}`} className="datepicker__body--header-cell">
								{weekday}
							</div>
						))}
					</div>
					<div className="datepicker__body--dates">
						{cells.map((day) => (
							<div key={toDateKey(day)} className="datepicker__body--dates-cell">
								<div
									className={setDatenameClassName(day)}
									onClick={() => { onPick(day); onClose(); }}
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
};
