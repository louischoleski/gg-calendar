import React from 'react';
import { useSelector } from 'react-redux';

import { getColumnLayout } from '@utils/entries';
import { TOTAL_DAY_WEEK } from '@constants/calendar';
import { selectCategoryColors } from '@store/selectors/entries';

import WeekCell from './WeekCell';

const filterCoordinate = (data = [], colIdx) => (
	data.filter(({ coordinates }) => coordinates?.x === colIdx)
);

const WeekGrid = ({ weekArray = [], boxes = [] }) => {
	const categoryColors = useSelector(selectCategoryColors);

	const columns = React.useMemo(() => (
		new Array(TOTAL_DAY_WEEK).fill(null).map((_, colIdx) => {
			const colData = filterCoordinate(boxes, colIdx);

			return {
				data: colData,
				layout: getColumnLayout(colData),
			};
		})
	), [ boxes ]);

	return (
		<div className="weekview--calendar">
			{columns.map(({ data, layout }, colIdx) => (
				<WeekCell
					data={data}
					colIdx={colIdx}
					layout={layout}
					date={weekArray[colIdx]}
					key={`week--col-${colIdx}`}
					categoryColors={categoryColors}
				/>
			))}
		</div>
	);
}

export default WeekGrid;
