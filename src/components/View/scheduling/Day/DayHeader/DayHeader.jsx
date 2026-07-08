import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isToday } from '@utils/dates';
import { selectDate } from '@store/selectors/app';
import { CALENDAR_LABELS, WEEK_START } from '@constants/calendar';

import {
	setDayTitleStyle, 
	setDayTitleClassName,
} from './DayHeader.controller';

const DayHeader = ({}) => {
	const {
		day: selectedDay, 
		year: selectedYear,
		month: selectedMonth, 
	} = useSelector(selectDate);

	// Evaluate gmt offset.
	const gmtOffset = React.useMemo(() => {
		let gmtDelta = new Date().getTimezoneOffset() / 60;
		if (gmtDelta < 0) {
			gmtDelta = `+${Math.abs(gmtDelta)}`;
		}
		return gmtDelta;
	}, []);

	// Evaluate if present date is today.
	const now = React.useMemo(() => (
		new Date(selectedYear, selectedMonth, selectedDay)
	), [ selectedYear, selectedMonth, selectedDay ]);

	// Set today.
	const hasToday = isToday(now);

	// Set week day.
	const weekDay = (now.getDay() + 7 - WEEK_START) % 7;

	return (
		<>
			<div className="dayview--header">
				<div className="dayview--header-day">
					<div className="dayview--header-day__title" style={setDayTitleStyle(hasToday)}>
						{CALENDAR_LABELS.WEEK.SHORT[weekDay % 7]}
					</div>
					<div className={setDayTitleClassName(hasToday)}>
						{selectedDay}
					</div>
				</div>
				<div className="dv-info-day-wrapper">
					<div className="dayview--header-day__info" />
				</div>
			</div>
			<div className="dv-ontop-row2">
				<div className="dv-gmt">
					UTC {gmtOffset}
				</div>
				<div className="dayview--ontop-container" data-dv-top="true" />
			</div>
		</>
	);
}

export default DayHeader;
