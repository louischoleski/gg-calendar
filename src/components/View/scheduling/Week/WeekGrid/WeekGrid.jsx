import React from 'react';

import { TOTAL_DAY_WEEK } from '@constants/calendar';

import WeekCell from './WeekCell';
import useWeekGrid from './useWeekGrid';
import { Week } from './WeekGrid.controller'; 

const filterCoordinate = (data = [], colIdx) => {
	const colData = data.filter(({ coordinates }) => (
		coordinates?.x === colIdx
	));

	return colData && colData.length ? colData : []
}

const WeekGrid = ({ weekArray = [] }) => {
	const { getWeekEntries } = useWeekGrid();

	const entries = React.useMemo(() => (
		getWeekEntries(weekArray)
	), [ weekArray ]);

	const [ topBoxes, allBoxes ] = React.useMemo(() => {
		const boxes = new Week(entries.day, entries.allDay);
		return [ boxes.getBoxesTopLengths(), boxes.getBoxes() ];
	}, [ entries ]);

	return (
		<div className="weekview--calendar">
			{new Array(TOTAL_DAY_WEEK).fill(null).map((_, colIdx) => (
				<WeekCell
					colIdx={colIdx} 
					key={`week--col-${colIdx}`} 
					data={filterCoordinate(allBoxes, colIdx)}
				/>
			))}
		</div>
	);
}

export default WeekGrid;
