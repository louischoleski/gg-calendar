import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectDate } from '@store/selectors/app';
import { setDate, setView } from '@store/actions/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS } from '@constants/calendar';

import { setWeekViewHeaderClassName } from './WeekHeader.controller';

const WeekHeader = ({
	weekArray = [],
}) => {
	const dispatch = useDispatch();

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
			<div className="weekview--header">
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
			<div className="weekview--allday-module">
				{daysOfWeek.map(({ date, num }) => (
					<div
						key={date}
						data-wv-top="true"
						data-wvtop-day={num}
						className="allday--col"
						data-allday-column={0}
					/>
				))}
			</div>
		</div>
	);
}

export default WeekHeader;
