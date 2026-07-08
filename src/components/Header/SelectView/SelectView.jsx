import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setView } from '@store/actions/app';
import { selectView } from '@store/selectors/app';
import { CALENDAR_VIEW_OPTIONS } from '@constants/calendar';

import { setClassName } from './SelectView.controller';

const SelectView = () => {
	const dispatch = useDispatch();

	const calendarView = useSelector(selectView);

	const [ showDropdown, setShowDropdown ] = React.useState(false);

	const viewText = React.useMemo(() => {
		// Close if changed with shortcuts.
		if (showDropdown) {
			setShowDropdown(false);
		}

		const [ currentViewObj ] = CALENDAR_VIEW_OPTIONS.filter(({ slug }) => (
			slug === calendarView
		));

		return currentViewObj?.text || '';
	}, [ calendarView ]);

	const onViewOptionClick = (e, viewSlug) => {
		if (calendarView !== viewSlug) {
			dispatch(setView(viewSlug));
			setShowDropdown(false); 	// Close after selection
		}
	}

	const onViewBtnClick = (e) => {
		setShowDropdown(!showDropdown);
	}

	return (
		<>
			<div className="select-wrapper">
				<button
					className="select__modal"
					onClick={onViewBtnClick}
					name="select__modal"
					aria-label="button"
					role="button"
					id="s-modals"
				>
					{viewText}
				</button>
			</div>

			{showDropdown ? (
				<aside className="change-view--wrapper toggle-animate">
					<div className="change-view--options">
						<div className="change-view--option">
							{CALENDAR_VIEW_OPTIONS.map(({ id, slug, text }) => (
								<div 
									className={setClassName(slug === calendarView)} 
									onClick={(e) => onViewOptionClick(e, slug)}
									data-view-option={slug} 
									data-view-key={id}
									key={id}
								>
									{text}
								</div>
							))}
						</div>
					</div>
				</aside>
			) : null}
		</>
	);
}

export default SelectView;
