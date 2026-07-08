import React from 'react';
import { useSelector } from 'react-redux';

import { CALENDAR_VIEWS } from '@constants/calendar';
import { selectView, selectCollapsed } from '@store/selectors/app';

import { setViewClassName } from './View.controller';
import { Day, Week, Year, List, Month } from './scheduling';

const View = ({
	prevFnRef = null,
	nextFnRef = null,
	setHeaderTitle = () => null,
}) => {
	const calendarView = useSelector(selectView);

	const { sidebar: isSidebarCollapsed } = useSelector(selectCollapsed);

	return (
		<div className={setViewClassName(isSidebarCollapsed)}>
			{/* yearview */}
			{calendarView === CALENDAR_VIEWS.YEAR && (
				<Year 
					prevFnRef={prevFnRef}
					nextFnRef={nextFnRef}
					setHeaderTitle={setHeaderTitle}
				/>
			)}
			{/* monthview */}
			{calendarView === CALENDAR_VIEWS.MONTH && (
				<Month 
					prevFnRef={prevFnRef}
					nextFnRef={nextFnRef}
					setHeaderTitle={setHeaderTitle}
				/>
			)}
			{/* weekview */}
			{calendarView === CALENDAR_VIEWS.WEEK && (
				<Week 
					prevFnRef={prevFnRef}
					nextFnRef={nextFnRef}
					setHeaderTitle={setHeaderTitle}
				/>
			)}
			{/* dayview */}
			{calendarView === CALENDAR_VIEWS.DAY && (
				<Day 
					prevFnRef={prevFnRef}
					nextFnRef={nextFnRef}
					setHeaderTitle={setHeaderTitle}
				/>
			)}
			{/* listview */}
			{calendarView === CALENDAR_VIEWS.LIST && (
				<List 
					prevFnRef={prevFnRef}
					nextFnRef={nextFnRef}
					setHeaderTitle={setHeaderTitle}
				/>
			)}
			{/* stats view */}
		</div>
	);
}

export default View;
