import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { MODAL_SECTIONS } from '@constants/modals';
import { selectCategoryColors } from '@store/selectors/entries';
import { setDate, setView, setModal } from '@store/actions/app';
import { selectDate, selectCollapsed } from '@store/selectors/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS } from '@constants/calendar';

import { setWeekViewHeaderClassName } from './WeekHeader.controller';

// Multi-day entries stack at the top of the week grid.
const setAllDayBoxStyle = (coordinates, color, stackIdx) => ({
	left: '2px',
	height: '18px',
	cursor: 'pointer',
	position: 'absolute',
	borderRadius: '4px',
	backgroundColor: color,
	top: `${stackIdx * 20}px`,
	zIndex: 3 + stackIdx,
	width: `calc(${(coordinates.x2 - coordinates.x + 1) * 100}% - 6px)`,
});

const WeekHeader = ({
	weekArray = [],
	allDayBoxes = [],
}) => {
	const dispatch = useDispatch();

	const categoryColors = useSelector(selectCategoryColors);

	// Eye toggle (CollapseView) hides the day-names header.
	const { header: isHeaderCollapsed } = useSelector(selectCollapsed);

	const onAllDayBoxClick = (e, id) => {
		e.stopPropagation();

		dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
			id,
			x: e.clientX,
			y: e.clientY,
		}));
	};

	const {
		day: selectedDay, 
		month: selectedMonth, 
		year: selectedYear,
	} = useSelector(selectDate); 

	const gmtOffset = React.useMemo(() => {
		let gmtDelta = new Date().getTimezoneOffset() / 60;
		if (gmtDelta < 0) {
			gmtDelta = `+${Math.abs(gmtDelta)}`;
		}
		return gmtDelta;
	}, []);

	const daysOfWeek = React.useMemo(() => {
		let [ dayNumbers, ymd, hasToday, hasSelected ] = [ [], [] ];

		// const today = context.getToday();
		const today = new Date();

		const [ ty, tm, td ] = [ today.getFullYear(), today.getMonth(), today.getDate() ];

		weekArray.forEach((day, idx) => {
			const [ y, m, d ] = [ day.getFullYear(), day.getMonth(), day.getDate() ];

			dayNumbers.push(d);
			ymd.push(`${y}-${m}-${d}`);

			// if (d === context.getDateSelected() && m === selectedMonth) {
			if (d === selectedDay && m === selectedMonth) {
				hasSelected = d;
			}

			if (d === td && m === tm && y === ty) {
				hasToday = d;
			}
		});

		return dayNumbers.map((num, dayIdx) => {
			let isSelected = false; 
			let isToday = false;

			if (num === hasSelected) {
				isSelected = true;
			}

			if (num === hasToday) {
				isToday = true;
			}

			return {
				isSelected, isToday,
				num, date: ymd[dayIdx], 
			}
		});
	}, [ weekArray ]);

	const onWeekDayClick = (date) => {
		dispatch(setDate(...date.split('-')));
		dispatch(setView(BASE_CALENDAR_VIEWS.DAY));
	}

	return (
		<div className="weekview__top">
			<div />
			<div className={[
				'weekview--header',
				isHeaderCollapsed ? 'wvh-collapse' : null,
			].filter(Boolean).join(' ')}>
				{daysOfWeek.map(({ date, num, isSelected, isToday }, dayIdx) => (
					<div key={date} className="weekview--header-day">
						<span className="weekview--header-day__title">
							{CALENDAR_LABELS.WEEK.SHORT[dayIdx]}
						</span>
						{' '}
						<button
							data-weekview-date={date}
							onClick={() => onWeekDayClick(date)}
							className={setWeekViewHeaderClassName(isSelected, isToday)}
						>
							{num}
						</button>
					</div>
				))}
			</div>
			<div className="wv-gmt">
				UTC {gmtOffset}
			</div>
			<div
				className="weekview--allday-module"
				style={allDayBoxes.length ? { minHeight: `${(allDayBoxes.length * 20) + 4}px` } : null}
			>
				{daysOfWeek.map(({ date, num }, colIdx) => (
					<div
						key={date}
						data-wv-top="true"
						data-wvtop-day={num}
						className="allday--col"
						data-allday-column={0}
					>
						{allDayBoxes
							.filter(({ coordinates }) => coordinates.x === colIdx)
							.map(({ id, title, category, coordinates }, stackIdx) => (
								<div
									key={id}
									className="box box-ontop"
									onClick={(e) => onAllDayBoxClick(e, id)}
									style={setAllDayBoxStyle(
										coordinates,
										categoryColors[category] || 'rgb(44, 82, 186)',
										stackIdx
									)}
								>
									<div className="box__header">
										<div className="box-title">
											{title}
										</div>
									</div>
								</div>
							))}
					</div>
				))}
			</div>
		</div>
	);
}

export default WeekHeader;
