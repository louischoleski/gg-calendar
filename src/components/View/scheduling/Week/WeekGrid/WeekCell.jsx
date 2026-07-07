import React from 'react';
import { useDispatch } from 'react-redux';

import { calcTime } from '@utils/time';
import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { quarterToDate, QUARTER_HEIGHT, QUARTERS_PER_DAY } from '@utils/entries';

import { setWeekCellStyle } from './WeekCell.controller';

const WeekCell = ({
	data = [],
	layout = {},
	colIdx = 0,
	date = null,
	categoryColors = {},
}) => {
	const dispatch = useDispatch();

	const onBoxClick = (e, id) => {
		e.stopPropagation();

		dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
			id,
			x: e.clientX,
			y: e.clientY,
		}));
	};

	// Click an empty slot to create an entry at that time.
	const onColumnClick = (e) => {
		if (e.target !== e.currentTarget || !date) return;

		const offsetY = e.clientY - e.currentTarget.getBoundingClientRect().top;

		const quarter = Math.min(
			Math.max(Math.floor(offsetY / QUARTER_HEIGHT), 0),
			QUARTERS_PER_DAY - 4
		);

		dispatch(setModal(MODAL_SECTIONS.CREATE_EVENT, {
			start: quarterToDate(date, quarter).toISOString(),
			end: quarterToDate(date, quarter + 4).toISOString(),
		}));
	};

	return (
		<div
			data-wv-top="false"
			className="week--col"
			data-column-index={colIdx}
			onClick={onColumnClick}
		>
			{data.map(({ id, category, title, coordinates }, rowIdx) => (
				<div
					key={id}
					className="box"
					box-idx={rowIdx}
					data-box-id={id}
					data-box-col={colIdx}
					data-box-category={category}
					data-end-time={coordinates.e}
					data-start-time={coordinates.y}
					data-time-intervals={coordinates.h}
					onClick={(e) => onBoxClick(e, id)}
					style={setWeekCellStyle(
						coordinates,
						categoryColors[category] || 'rgb(44, 82, 186)',
						layout[id]
					)}
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
