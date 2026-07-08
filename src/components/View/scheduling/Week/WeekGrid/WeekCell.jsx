import React from 'react';

import { calcTime } from '@utils/time';

import { setWeekCellStyle } from './WeekCell.controller';

const WeekCell = ({ data = [], colIdx = 0 }) => {
	return (
		<div
			data-wv-top="false"
			className="week--col"
			data-column-index={colIdx}
		>
			{data.map(({ id, category, title, coordinates }, rowIdx) => (
				<div
					className="box"
					box-idx={rowIdx}
					data-box-id={id}
					data-box-col={colIdx}
					data-box-category={category}
					data-end-time={coordinates.e}
					data-start-time={coordinates.y}
					data-time-intervals={coordinates.h}
					style={setWeekCellStyle(coordinates, "rgb(44, 82, 186)")}
				>
					<div className="box__header">
						<div className="box-title">
							{title}
						</div>
					</div>
					<div className="box__content">
						<span className="box-time">
							{calcTime(coordinates.y, +coordinates.h)}
						</span>
					</div>
					<div className="box-resize-s" />
				</div>
			))}
		</div>
	);
}

export default WeekCell;
