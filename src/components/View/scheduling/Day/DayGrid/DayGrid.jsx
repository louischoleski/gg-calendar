import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectDate } from '@store/selectors/app';

import DayCell from './DayCell';
import useDayGrid from './useDayGrid';
import { Day } from './DayGrid.controller';

const DayGrid = () => {
	const { getDayEntries } = useDayGrid();

	const {
		day: selectedDay,
		month: selectedMonth,
		year: selectedYear,
	} = useSelector(selectDate);

	const entries = React.useMemo(() => getDayEntries(
		new Date(
			selectedYear, selectedMonth, selectedDay
		)
	), [ selectedYear, selectedMonth, selectedDay ]);


	const [ topBoxes, allBoxes ] = React.useMemo(() => {
		const boxes = new Day(entries.day, entries.allDay);
		return [ boxes.getBoxesTop(), boxes.getBoxes() ];
	}, [ entries ]);

	const dayCellRefs = React.useMemo(() => allBoxes.map(() => (
		React.createRef()
	)), [ allBoxes ]);

	return (
		<div className="dayview--main-grid">
			{allBoxes.map(({ id, ...rest}, cellIdx) => (
				<DayCell 
					id={id} 
					key={id} title={id}
					ref={dayCellRefs[cellIdx]}
					{...rest}
				/>
			))}
		</div>
	);
}

export default DayGrid;
