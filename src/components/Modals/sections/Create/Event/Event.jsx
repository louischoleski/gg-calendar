import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectEntries } from '@store/selectors/entries';
import { addEntry, updateEntry } from '@store/actions/entries';
import { selectDate, selectModalData, selectCategories } from '@store/selectors/app';

import { TimePicker, FormDatepicker, formatDateTitle, formatTimeTitle } from './FormPickers';

const pad = (n) => String(n).padStart(2, '0');

const toDateInputValue = (d) => (
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
);

const toTimeInputValue = (d) => (
	`${pad(d.getHours())}:${pad(d.getMinutes())}`
);

const fromInputValues = (dateValue, timeValue) => {
	const [ y, m, d ] = dateValue.split('-').map(Number);
	const [ hh, mm ] = timeValue.split(':').map(Number);
	return new Date(y, m - 1, d, hh, mm, 0, 0);
};

const fieldStyle = {
	width: '100%',
	border: 'none',
	outline: 'none',
	fontSize: '0.875rem',
	color: 'var(--white2)',
	colorScheme: 'inherit',
	backgroundColor: 'transparent',
	borderBottom: '1px solid var(--mediumgrey1)',
};

const CreateEvent = ({
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const entries = useSelector(selectEntries);
	const modalData = useSelector(selectModalData);
	const categories = useSelector(selectCategories);
	const { day, month, year } = useSelector(selectDate);

	// Edit mode when the modal payload carries an entry id.
	const editEntry = React.useMemo(() => (
		modalData?.id ? entries.find(({ id }) => id === modalData.id) : null
	), [ modalData, entries ]);

	const initialData = React.useMemo(() => {
		let [ start, end ] = [ null, null ];

		if (editEntry) {
			[ start, end ] = [ new Date(editEntry.start), new Date(editEntry.end) ];
		} else if (modalData?.start && modalData?.end) {
			// Prefilled by clicking an empty calendar slot.
			[ start, end ] = [ new Date(modalData.start), new Date(modalData.end) ];
		} else {
			// Default: next full hour on the selected day.
			const now = new Date();
			start = new Date(year, month, day, now.getHours() + 1, 0, 0, 0);
			end = new Date(year, month, day, now.getHours() + 2, 0, 0, 0);
		}

		return {
			title: editEntry?.title || '',
			description: editEntry?.description || '',
			category: editEntry?.category || categories[0]?.name || 'default',
			startDate: toDateInputValue(start),
			startTime: toTimeInputValue(start),
			endDate: toDateInputValue(end),
			endTime: toTimeInputValue(end),
		};
	}, []);

	const [ error, setError ] = React.useState(null);
	const [ data, setData ] = React.useState(initialData);

	const formRef = React.useRef(null);
	const [ isDragging, setIsDragging ] = React.useState(false);
	const [ position, setPosition ] = React.useState(null); // null = default (centered)

	// Which date/time picker popup is open, and where.
	// { kind: 'date'|'time', field: 'start'|'end', x, y } | null
	const [ picker, setPicker ] = React.useState(null);

	const openPicker = (e, kind, field) => {
		const rect = e.currentTarget.getBoundingClientRect();

		setPicker({
			kind, field,
			x: rect.left,
			y: rect.bottom + 4,
		});
	};

	const closePicker = () => setPicker(null);

	// Picking a date syncs the other field so start never trails end
	// (like the vanilla form datepicker).
	const onPickDate = (day) => {
		const value = [
			day.getFullYear(),
			String(day.getMonth() + 1).padStart(2, '0'),
			String(day.getDate()).padStart(2, '0'),
		].join('-');

		const next = { ...data, [`${picker.field}Date`]: value };

		if (picker.field === 'start' && value > next.endDate) {
			next.endDate = value;
		}

		if (picker.field === 'end' && value < next.startDate) {
			next.startDate = value;
		}

		setError(null);
		setData(next);
	};

	// Picking a start time at/after the end time bumps the end ahead
	// (next hour, or 12:30am next day from 23:45 — like vanilla).
	const onPickTime = (time) => {
		const next = { ...data, [`${picker.field}Time`]: time };

		if (picker.field === 'start' && next.startDate === next.endDate && time >= next.endTime) {
			const [ h, m ] = time.split(':').map(Number);

			if (h === 23 && m === 45) {
				const [ y, mo, d ] = next.startDate.split('-').map(Number);
				const nextDay = new Date(y, mo - 1, d + 1);

				next.endDate = [
					nextDay.getFullYear(),
					String(nextDay.getMonth() + 1).padStart(2, '0'),
					String(nextDay.getDate()).padStart(2, '0'),
				].join('-');
				next.endTime = '00:30';
			} else {
				next.endTime = `${String(h < 23 ? h + 1 : 23).padStart(2, '0')}:${String(h < 23 ? m : 45).padStart(2, '0')}`;
			}
		}

		setError(null);
		setData(next);
	};

	// Grab the form header to drag the form anywhere; while dragging
	// the form turns translucent so the calendar stays visible.
	const onDragStart = (e) => {
		if (e.button !== 0 || !formRef.current) return;

		e.preventDefault();

		const rect = formRef.current.getBoundingClientRect();

		let [ prevX, prevY ] = [ e.clientX, e.clientY ];
		let [ left, top ] = [ rect.left, rect.top ];

		// Lock the current width: with only `left` set, the absolutely
		// positioned form would otherwise collapse to shrink-to-fit.
		const width = rect.width;

		setIsDragging(true);
		setPosition({ top, left, width });

		const handleMove = (ev) => {
			left = Math.min(
				Math.max(left + ev.clientX - prevX, 0),
				window.innerWidth - rect.width
			);
			top = Math.min(
				Math.max(top + ev.clientY - prevY, 0),
				window.innerHeight - rect.height
			);

			[ prevX, prevY ] = [ ev.clientX, ev.clientY ];

			setPosition({ top, left, width });
		};

		const handleUp = () => {
			setIsDragging(false);

			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleUp);
		};

		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleUp);
	};

	const handleChange = (e) => {
		setError(null);

		setData({
			...data, [e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const start = fromInputValues(data.startDate, data.startTime);
		const end = fromInputValues(data.endDate, data.endTime);

		if (!data.title.trim().length) {
			setError('Please add a title');
			return;
		}

		if (end <= start) {
			setError('End must be after start');
			return;
		}

		const payload = {
			title: data.title.trim(),
			description: data.description,
			category: data.category,
			start: start.toISOString(),
			end: end.toISOString(),
		};

		if (editEntry) {
			dispatch(updateEntry(editEntry.id, payload));
		} else {
			dispatch(addEntry(payload));
		}

		onClose();
	};

	const activeColor = React.useMemo(() => (
		categories.find(({ name }) => name === data.category)?.color || '#2C52BA'
	), [ categories, data.category ]);

	return (
		<>
			<aside
				ref={formRef}
				className="entries__form"
				style={{
					...(position ?
						{
							margin: 0,
							top: `${position.top}px`,
							left: `${position.left}px`,
							width: `${position.width}px`,
						} :
						{ top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }),
					opacity: isDragging ? 0.8 : 1,
					userSelect: isDragging ? 'none' : 'auto',
				}}
			>
				<div className="entries__form--header">
					<div
						className="form-header--dragarea"
						onMouseDown={onDragStart}
					/>
					<div
						onClick={onClose}
						data-tooltip="close form"
						className="form--header__icon-close"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height={20}
							width={20}
							fill="var(--white2)"
						>
							<path d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
						</svg>
					</div>
				</div>
				<form
					className="entry-form"
					onSubmit={handleSubmit}
					style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
				>
					<div className="entries__form--body">
						<div className="form--body__title form-body-single">
							<input
								type="text"
								name="title"
								value={data.title}
								placeholder="Add title"
								onChange={handleChange}
								className="form--body__title-input"
								maxLength={50}
								spellCheck="false"
								autoFocus
							/>
						</div>
						<div className="form--body__description form-body-single">
							<textarea
								name="description"
								value={data.description}
								onChange={handleChange}
								placeholder="Add description"
								className="form--body__description-input"
								maxLength={200}
								spellCheck="false"
							/>
						</div>
						<div className="form--body__start form-body-double">
							<div className="form--body__start-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height={24}
									width={24}
									fill="var(--white3)"
									className="form--body-svg__start"
								>
									<path d="m15.3 16.7 1.4-1.4-3.7-3.7V7h-2v5.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z" />
								</svg>
							</div>
							<div className="form--body__start-inputs">
								<span
									data-form-date-type="start"
									data-form-date={data.startDate}
									onClick={(e) => openPicker(e, 'date', 'start')}
									className={[
										'form--body-start__date',
										(picker?.kind === 'date' && picker?.field === 'start') ? 'active-form-date' : null,
									].filter(Boolean).join(' ')}
								>
									{formatDateTitle(data.startDate)}
								</span>
								<div className="form-br" />
								<span
									data-form-time-type="start"
									data-form-time={data.startTime}
									onClick={(e) => openPicker(e, 'time', 'start')}
									className={[
										'form--body-start__time',
										(picker?.kind === 'time' && picker?.field === 'start') ? 'active-form-time' : null,
									].filter(Boolean).join(' ')}
								>
									{formatTimeTitle(data.startTime)}
								</span>
							</div>
						</div>
						<div className="form--body__end form-body-double">
							<div className="form--body__end-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height={24}
									width={24}
									fill="var(--white3)"
									className="form--body-svg__end"
								>
									<path d="m15.3 16.7 1.4-1.4-3.7-3.7V7h-2v5.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z" />
								</svg>
							</div>
							<div className="form--body__end-inputs">
								<span
									data-form-date-type="end"
									data-form-date={data.endDate}
									onClick={(e) => openPicker(e, 'date', 'end')}
									className={[
										'form--body-end__date',
										(picker?.kind === 'date' && picker?.field === 'end') ? 'active-form-date' : null,
									].filter(Boolean).join(' ')}
								>
									{formatDateTitle(data.endDate)}
								</span>
								<div className="form-br" />
								<span
									data-form-time-type="end"
									data-form-time={data.endTime}
									onClick={(e) => openPicker(e, 'time', 'end')}
									className={[
										'form--body-end__time',
										(picker?.kind === 'time' && picker?.field === 'end') ? 'active-form-time' : null,
									].filter(Boolean).join(' ')}
								>
									{formatTimeTitle(data.endTime)}
								</span>
							</div>
						</div>
						<div className="form--body__category form-body-double">
							<div className="form--body__category-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 0 24 24"
									width="24px"
									fill={activeColor}
								>
									<path d="M0 0h24v24H0z" fill="none" />
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
								</svg>
							</div>
							<div className="form--body__category-inputs" style={{ width: '100%' }}>
								<select
									name="category"
									style={fieldStyle}
									value={data.category}
									onChange={handleChange}
								>
									{categories.map(({ id, name }) => (
										<option key={id} value={name}>
											{name}
										</option>
									))}
								</select>
							</div>
						</div>
						{error ? (
							<div
								className="form-input-error"
								style={{ color: '#EE756A', padding: '4px 12px', fontSize: '0.8rem' }}
							>
								{error}
							</div>
						) : null}
					</div>
					<div
						className="entries__form--footer"
						style={{
							gap: '8px',
							display: 'flex',
							padding: '12px 16px',
							justifyContent: 'flex-end',
						}}
					>
						<button
							type="button"
							role="button"
							aria-label="button"
							onClick={onClose}
							className="btn-root form--footer__button-cancel"
						>
							Cancel
						</button>
						<button
							type="submit"
							role="button"
							aria-label="button"
							className="btn-root form--footer__button-save"
						>
							{editEntry ? 'Update' : 'Save'}
						</button>
					</div>
				</form>
			</aside>
			{picker?.kind === 'date' ? (
				<FormDatepicker
					onPick={onPickDate}
					onClose={closePicker}
					value={data[`${picker.field}Date`]}
					position={{ x: picker.x, y: picker.y }}
				/>
			) : null}
			{picker?.kind === 'time' ? (
				<TimePicker
					onPick={onPickTime}
					onClose={closePicker}
					value={data[`${picker.field}Time`]}
					position={{ x: picker.x, y: picker.y }}
					minTime={(
						picker.field === 'end' &&
						data.startDate === data.endDate
					) ? data.startTime : null}
				/>
			) : null}
			<aside
				className="form-overlay"
				onClick={onClose}
				style={{ position: 'fixed', inset: 0 }}
			/>
		</>
	);
}

export default CreateEvent;
