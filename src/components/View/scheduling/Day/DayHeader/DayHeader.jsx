import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isToday } from '@utils/dates';
import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectDate, selectCollapsed } from '@store/selectors/app';
import { selectCategoryColors } from '@store/selectors/entries';
import { CALENDAR_LABELS, WEEK_START } from '@constants/calendar';

import {
	setDayTitleStyle,
	setDayTitleClassName,
} from './DayHeader.controller';

const DayHeader = ({ allDayBoxes = [] }) => {
	const dispatch = useDispatch();

	const categoryColors = useSelector(selectCategoryColors);

	// Eye toggle (CollapseView) hides the day header.
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
			<div className={[
				'dayview--header',
				isHeaderCollapsed ? 'dvh-collapse' : null,
			].filter(Boolean).join(' ')}>
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
				<div className="dayview--ontop-container" data-dv-top="true">
					{allDayBoxes.map(({ id, title, category }) => (
						<div
							key={id}
							onClick={(e) => onAllDayBoxClick(e, id)}
							style={{
								height: '18px',
								margin: '1px 8px',
								padding: '0 8px',
								overflow: 'hidden',
								cursor: 'pointer',
								fontSize: '0.75rem',
								lineHeight: '18px',
								borderRadius: '4px',
								whiteSpace: 'nowrap',
								color: 'var(--white1)',
								textOverflow: 'ellipsis',
								backgroundColor: categoryColors[category] || 'rgb(44, 82, 186)',
							}}
						>
							{title}
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default DayHeader;
