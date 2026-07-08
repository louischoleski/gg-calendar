import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toggleShortcut } from '@store/actions/app';
import { selectShortcut } from '@store/selectors/app';

import {
	setShortcutFill, 
	setShortcutDataTooltip,
} from './Shortcuts.controller';

const Shortcuts = ({
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const hasShortcut = useSelector(selectShortcut);

	const onKeyboardToggle = () => {
		dispatch(toggleShortcut());
	}

	return (
		<>
			<aside className="shortcuts__modal">
				<div className="shortcuts-modal-header">
					<div className="shortcuts-modal-title">
						<span>Keyboard shortcuts</span>
						<div
							onClick={onKeyboardToggle}
							className="keyboard-disabled-sm"
							data-tooltip={setShortcutDataTooltip(hasShortcut)}
						>
							<svg
								fill={setShortcutFill(hasShortcut)}
								xmlns="http://www.w3.org/2000/svg"
								height={24}
								width={24}
							>
								<path d="M4 19q-.825 0-1.412-.587Q2 17.825 2 17V7q0-.825.588-1.412Q3.175 5 4 5h16q.825 0 1.413.588Q22 6.175 22 7v10q0 .825-.587 1.413Q20.825 19 20 19Zm0-2h16V7H4v10Zm4-1h8v-2H8Zm-3-3h2v-2H5Zm3 0h2v-2H8Zm3 0h2v-2h-2Zm3 0h2v-2h-2Zm3 0h2v-2h-2ZM5 10h2V8H5Zm3 0h2V8H8Zm3 0h2V8h-2Zm3 0h2V8h-2Zm3 0h2V8h-2ZM4 17V7v10Z" />
							</svg>
						</div>
					</div>
					<div className="close-shortcuts-modal" onClick={onClose}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="var(--white2)"
							height={24}
							width={24}
						>
							<path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
						</svg>
					</div>
				</div>
				<div className="shortcuts-modal__body">
					<div className="shortcuts-modal-content">
						<div className="sm-item">
							<div className="sm-key">
								<span>0</span>
							</div>
							<div className="sm-description">change app theme</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>1</span>
								<span> or </span>
								<span>D</span>
							</div>
							<div className="sm-description">open day view</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>2</span>
								<span> or </span>
								<span>W</span>
							</div>
							<div className="sm-description">open week view</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>3</span>
								<span> or </span>
								<span>M</span>
							</div>
							<div className="sm-description">open month view</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>4</span>
								<span> or </span>
								<span>Y</span>
							</div>
							<div className="sm-description">open year view</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>5</span>
								<span> or </span>
								<span>L</span>
							</div>
							<div className="sm-description">open list view</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>V</span>
							</div>
							<div className="sm-description">toggle view options</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>T</span>
							</div>
							<div className="sm-description">set date to today</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>G</span>
							</div>
							<div className="sm-description">enter date manually</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>N</span>
							</div>
							<div className="sm-description">next period</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>P</span>
							</div>
							<div className="sm-description">previous period</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>S</span>
							</div>
							<div className="sm-description">toggle sidebar</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>F</span>
							</div>
							<div className="sm-description">open form</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>+</span>
							</div>
							<div className="sm-description">open new category form</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>A</span>
							</div>
							<div className="sm-description">open settings</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>/</span>
								<span> or </span>
								<span>?</span>
							</div>
							<div className="sm-description">open keyboard shortcuts</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span>E</span>
							</div>
							<div className="sm-description">
								(entry options) opens form with entry details
							</div>
						</div>
						<div className="sm-item sm-item--full">
							<div className="sm-key">
								<span>↑</span>
							</div>
							<div className="sm-description sm-description--full">
								<span>(datepicker) set date to next month/week</span>
								<span>(yearpicker) set year to next year</span>
							</div>
						</div>
						<div className="sm-item sm-item--full">
							<div className="sm-key">
								<span>↓</span>
							</div>
							<div className="sm-description sm-description--full">
								<span>(datepicker) set date to prev month/week</span>
								<span>(yearpicker) set year to prev year</span>
							</div>
						</div>
						<div className="sm-item sm-item--full">
							<div className="sm-key">
								<span>←</span>
							</div>
							<div className="sm-description sm-description--full">
								<span>(datepicker) set date to prev day</span>
								<span>(monthpicker) set month to prev month</span>
							</div>
						</div>
						<div className="sm-item sm-item--full">
							<div className="sm-key">
								<span>→</span>
							</div>
							<div className="sm-description sm-description--full">
								<span>(datepicker) set date to next day</span>
								<span>(monthpicker) set month to next month</span>
							</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span className="key-full">DELETE</span>
							</div>
							<div className="sm-description">(entry options) delete entry</div>
						</div>
						<div className="sm-item sm-item--full">
							<div className="sm-key">
								<span className="key-full">ENTER</span>
							</div>
							<div className="sm-description sm-description--full">
								<span>(datepicker) set date to selected date</span>
								<span>(form) submit form</span>
							</div>
						</div>
						<div className="sm-item">
							<div className="sm-key">
								<span className="key-full">ESCAPE</span>
							</div>
							<div className="sm-description">
								close any active modal/popup/form
							</div>
						</div>
					</div>
				</div>
			</aside>
			<aside 
				className="shortcuts-modal-overlay" 
				onClick={onClose}
			/>
		</>
	);
}

export default Shortcuts;
