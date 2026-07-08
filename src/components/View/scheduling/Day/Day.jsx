import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Draggable } from '@components';
import { setDate } from '@store/actions/app';
import { selectDate, selectView } from '@store/selectors/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS } from '@constants/calendar';

import DayGrid from './DayGrid';
import DayHeader from './DayHeader';
import DaySidebar from './DaySidebar';

const DayScheduling = ({
	prevFnRef = null,
	nextFnRef = null,
	setHeaderTitle = () => null,
}) => {
	const dispatch = useDispatch();

	const {
		day: selectedDay, 
		month: selectedMonth, 
		year: selectedYear,
	} = useSelector(selectDate);

	const calendarView = useSelector(selectView);

	const setPrevDay = (d, m, y) => {
		const prevDay = new Date(
			y, m, d - 1
		);

		dispatch(setDate(
			prevDay.getFullYear(), 
			prevDay.getMonth(), 
			prevDay.getDate(),
		));
	};

	const setNextDay = (d, m, y) => {
		const nextDay = new Date(
			y, m, d + 1
		);

		dispatch(setDate(
			nextDay.getFullYear(), 
			nextDay.getMonth(), 
			nextDay.getDate(),
		));
	};

	React.useEffect(() => {
		prevFnRef.current = { setPrevDay };
	}, [ prevFnRef ]);

	React.useEffect(() => {
		nextFnRef.current = { setNextDay };
	}, [ nextFnRef ]);

	// Set header view title.
	React.useEffect(() => {
		if (calendarView !== BASE_CALENDAR_VIEWS.DAY) return null;

		setHeaderTitle(
			`${CALENDAR_LABELS.MONTH.LONG[selectedMonth]} ${selectedDay}, ${selectedYear}`
		);
	}, [ selectedYear, selectedMonth, selectedDay ]);

	return (
		<div className="dayview">
			<div className="calendar__dayview">
				<DayHeader />
				<Draggable.Wrapper>
					<div className="dayview__grid">
						<div className="dayview__grid--wrapper">
							<DaySidebar />
							<DayGrid />
						</div>
						<div className="dayview--footer" />
					</div>
				</Draggable.Wrapper>
			</div>
		</div>
	);
}

export default DayScheduling;
