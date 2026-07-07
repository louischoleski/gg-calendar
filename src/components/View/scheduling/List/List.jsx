import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { compareDates } from '@utils/dates';
import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { formatStartEndTimes } from '@utils/time';
import { getEntriesByDateKey } from '@utils/entries';
import { selectDate, selectView } from '@store/selectors/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS } from '@constants/calendar';
import { selectActiveEntries, selectCategoryColors } from '@store/selectors/entries';

const ListScheduling = ({
	prevFnRef = null,
	nextFnRef = null,
	setHeaderTitle = () => null,
}) => {
	const dispatch = useDispatch();

	const {
		year: selectedYear,
		month: selectedMonth,
	} = useSelector(selectDate);

	const calendarView = useSelector(selectView);

	const activeEntries = useSelector(selectActiveEntries);

	const categoryColors = useSelector(selectCategoryColors);

	// List view has no prev/next navigation.
	React.useEffect(() => {
		prevFnRef.current = {};
		nextFnRef.current = {};
	}, [ prevFnRef, nextFnRef ]);

	// Set header view title.
	React.useEffect(() => {
		if (calendarView !== BASE_CALENDAR_VIEWS.LIST) return null;

		setHeaderTitle(
			`${CALENDAR_LABELS.MONTH.LONG[selectedMonth]} ${selectedYear}`
		);
	}, [ selectedYear, selectedMonth ]);

	// Entries grouped per day, chronologically.
	const rowGroups = React.useMemo(() => {
		const map = getEntriesByDateKey(activeEntries);

		return Object.entries(map)
			.map(([ key, groupEntries ]) => {
				const [ y, m, d ] = key.split('-').map(Number);

				return {
					key,
					date: new Date(y, m, d),
					entries: [ ...groupEntries ].sort((a, b) => (
						new Date(a.end) - new Date(b.end)
					)),
				};
			})
			.sort((a, b) => a.date - b.date);
	}, [ activeEntries ]);

	const onCellClick = (e, id) => {
		dispatch(setModal(MODAL_SECTIONS.ENTRY_OPTIONS, {
			id,
			x: e.clientX,
			y: e.clientY,
		}));
	};

	const setCellTime = (entry) => {
		const [ start, end ] = [ new Date(entry.start), new Date(entry.end) ];

		if (!compareDates(start, end)) {
			return `until ${CALENDAR_LABELS.MONTH.SHORT[end.getMonth()]} ${end.getDate()}`;
		}

		return formatStartEndTimes(
			[ start.getHours(), end.getHours() ],
			[ start.getMinutes(), end.getMinutes() ]
		);
	};

	return (
		<div className="listview">
			<div className="listview__body">
				{!rowGroups.length ? (
					<div style={{ padding: '24px', color: 'var(--white3)' }}>
						No events scheduled. Click "Create" to add one.
					</div>
				) : null}
				{rowGroups.map(({ key, date, entries }, groupIdx) => (
					<div key={key} className="listview__rowgroup">
						<div className="rowgroup-header">
							<div
								data-rgheader-date={key}
								className={[
									'rowgroup--header__datenumber',
									groupIdx === 0 ? 'top-datenumber' : null,
								].filter(Boolean).join(' ')}
							>
								{date.getDate()}
							</div>
							<div className={[
								'rowgroup--header__monthdow',
								groupIdx === 0 ? 'top-monthdow' : null,
							].filter(Boolean).join(' ')}>
								{CALENDAR_LABELS.MONTH.SHORT[date.getMonth()]}, {CALENDAR_LABELS.WEEK.LONG[(date.getDay() + 6) % 7].substring(0, 3)} {date.getFullYear()}
							</div>
						</div>
						<div className="rowgroup-content">
							{entries.map((entry) => (
								<div
									key={entry.id}
									className="rowgroup--cell"
									data-rgcell-id={entry.id}
									style={{ cursor: 'pointer' }}
									onClick={(e) => onCellClick(e, entry.id)}
								>
									<div
										className="rowgroup--cell__color"
										style={{ backgroundColor: categoryColors[entry.category] || 'rgb(44, 82, 186)' }}
									/>
									<div className="rowgroup--cell__time">
										{setCellTime(entry)}
									</div>
									<div className="rowgroup--cell__title">
										{entry.title}
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ListScheduling;
