import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setDate, setView } from '@store/actions/app';
import { selectDate, selectView } from '@store/selectors/app';
import { CALENDAR_LABELS, BASE_CALENDAR_VIEWS } from '@constants/calendar';

const MONTHS_SHORT = CALENDAR_LABELS.MONTH.SHORT.map((m) => m.toLowerCase());
const MONTHS_LONG = CALENDAR_LABELS.MONTH.LONG.map((m) => m.toLowerCase());

/**
 * parseGotoDate
 * Accepts 'MM/DD/YYYY' or 'month day year' (short or long month
 * names). Years under 100 mean the 2000s; valid range 1901-2100.
 * Returns a Date or null (port of the vanilla goto validator).
 */
export const parseGotoDate = (raw = '') => {
	const text = raw.trim();

	const parts = text.includes('/') ? text.split('/') : text.split(/\s+/);

	if (parts.length !== 3) return null;

	let month;

	const monthInt = parseInt(parts[0], 10);

	if (isNaN(monthInt)) {
		const names = parts[0].length > 3 ? MONTHS_LONG : MONTHS_SHORT;
		month = names.indexOf(parts[0].toLowerCase());
		if (month === -1) return null;
	} else {
		month = Math.max(monthInt - 1, 0);
	}

	const day = parseInt(parts[1], 10);
	let year = parseInt(parts[2], 10);

	if (isNaN(day) || isNaN(year)) return null;

	if (year < 100) {
		year += 2000;
	} else if (year > 2100 || year < 1901) {
		return null;
	}

	const date = new Date(year, month, day);

	return isNaN(date.getTime()) ? null : date;
};

const Search = ({
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const inputRef = React.useRef(null);

	const calendarView = useSelector(selectView);

	const { day, month, year } = useSelector(selectDate);

	const [ hasError, setHasError ] = React.useState(false);

	// Prefill with the currently selected date, e.g. 'Jul 7 2026'.
	const [ value, setValue ] = React.useState(
		`${CALENDAR_LABELS.MONTH.SHORT[month]} ${day} ${year}`
	);

	// Focus slightly delayed so the opening keypress never lands
	// in the input (like the original).
	React.useEffect(() => {
		const timer = setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		}, 10);

		return () => clearTimeout(timer);
	}, []);

	const handleChange = (e) => {
		setHasError(false);
		setValue(e.target.value);
	};

	const handleGo = () => {
		const date = parseGotoDate(value);

		if (!date) {
			setHasError(true);
			return;
		}

		dispatch(setDate(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		));

		// List view has no date focus; jump to the day instead.
		if (calendarView === BASE_CALENDAR_VIEWS.LIST) {
			dispatch(setView(BASE_CALENDAR_VIEWS.DAY));
		}

		onClose();
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleGo();
		}
	};

	return (
		<>
			<aside className="go-to-date">
				<div className="go-to__header">
					<span className="go-to-title">
						Go to date
					</span>
					<div className="go-to-subtitle">
						<span className="gts-format">
							month day year
						</span>
						{" "}
						<span className="gts-mid">
							or
						</span>
						{" "}
						<span className="gts-format">
							MM/DD/YYYY
						</span>
					</div>
				</div>
				<div className="go-to__body">
					<input
						type="text"
						ref={inputRef}
						value={value}
						spellCheck="false"
						className="go-to-input"
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						required
					/>
					<div
						className="go-to-err"
						onMouseDown={() => setHasError(false)}
						style={{ display: hasError ? 'block' : 'none' }}
					>
						Invalid Date
					</div>
				</div>
				<div className="go-to__footer">
					<div className="cancel-go-to" onClick={onClose}>
						Cancel
					</div>
					<div className="submit-go-to" onClick={handleGo}>
						Go
					</div>
				</div>
			</aside>
			<aside
				className="go-to-date-overlay"
				onClick={onClose}
			/>
		</>
	);
}

export default Search;
