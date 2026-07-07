import React from 'react';
import { useDispatch } from 'react-redux';

import { calcTime } from '@utils/time';
import { Draggable } from '@components';
import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { updateEntry } from '@store/actions/entries';
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
		dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
			id,
			x: e.clientX,
			y: e.clientY,
		}));
	};

	// Persist new start/end times after a vertical drag or resize.
	const onBoxCommit = (id, { y, h }) => {
		dispatch(updateEntry(id, {
			start: quarterToDate(date, y).toISOString(),
			end: quarterToDate(date, y + h).toISOString(),
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
				<Draggable.Element
					key={id}
					y={coordinates.y}
					h={coordinates.h}
					onClick={(e) => onBoxClick(e, id)}
					onCommit={(pos) => onBoxCommit(id, pos)}
				>
					<div
						className="box"
						box-idx={rowIdx}
						data-box-id={id}
						data-box-col={colIdx}
						data-box-category={category}
						data-end-time={coordinates.e}
						data-start-time={coordinates.y}
						data-time-intervals={coordinates.h}
						style={setWeekCellStyle(
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
					</div>
				</Draggable.Element>
			))}
		</div>
	);
}

export default WeekCell;
