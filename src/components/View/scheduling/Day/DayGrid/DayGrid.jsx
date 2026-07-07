import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectCategoryColors } from '@store/selectors/entries';
import { getColumnLayout, quarterToDate, QUARTER_HEIGHT, QUARTERS_PER_DAY } from '@utils/entries';

import DayCell from './DayCell';

const DayGrid = ({ date = null, boxes = [] }) => {
	const dispatch = useDispatch();

	const categoryColors = useSelector(selectCategoryColors);

	const layout = React.useMemo(() => (
		getColumnLayout(boxes, 'day')
	), [ boxes ]);

	// Click an empty slot to create an entry at that time.
	const onGridClick = (e) => {
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
		<div className="dayview--main-grid" onClick={onGridClick}>
			{boxes.map(({ id, ...rest }) => (
				<DayCell
					id={id}
					key={id}
					date={date}
					layout={layout[id]}
					categoryColors={categoryColors}
					{...rest}
				/>
			))}
		</div>
	);
}

export default DayGrid;
