import React from 'react';
import { useDispatch } from 'react-redux';

import { calcTime } from '@utils/time';
import { Draggable } from '@components';
import { setModal } from '@store/actions/app';
import { quarterToDate } from '@utils/entries';
import { MODAL_SECTIONS } from '@constants/modals';
import { updateEntry } from '@store/actions/entries';

const DayCell = ({
	id,
	title,
	category,
	coordinates,
	date = null,
	layout = null,
	categoryColors = {},
}) => {
	const dispatch = useDispatch();

	const { left = 0, width = 1, z = 1, ontop = false } = layout || {};

	// Persist new start/end times after a drag or resize.
	const onCommit = ({ y, h }) => {
		dispatch(updateEntry(id, {
			start: quarterToDate(date, y).toISOString(),
			end: quarterToDate(date, y + h).toISOString(),
		}));
	};

	const onClick = (e) => {
		dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
			id,
			x: e.clientX,
			y: e.clientY,
		}));
	};

	return (
		<Draggable.Element
			y={coordinates.y}
			h={coordinates.h}
			onClick={onClick}
			onCommit={onCommit}
		>
			{({ y, h }) => (
				<div
					className={ontop ? 'dv-box-ontop' : undefined}
					data-dv-box-id={id}
					data-dv-box-category={category}
					data-dv-end-time={coordinates.e}
					data-dv-start-time={coordinates.y}
					data-dv-time-intervals={coordinates.h}
					style={{
						zIndex: z,
						left: `calc((100% - 4px) * ${left})`,
						width: `calc((100% - 4px) * ${width})`,
						backgroundColor: categoryColors[category] || 'rgb(44, 82, 186)',
					}}
				>
					<div className="dv-box__header">
						<div className="dv-box-title">
							{title}
						</div>
					</div>
					<div className="dv-box__content">
						<span className="dv-box-time">
							{calcTime(y, +h)}
						</span>
					</div>
				</div>
			)}
		</Draggable.Element>
	);
}

export default DayCell;
