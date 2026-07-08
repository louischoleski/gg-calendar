import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectModal } from '@store/selectors/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { CALENDAR_VIEWS, CALENDAR_SHORTCUTS } from '@constants/calendar';
import { setView, setModal, toggleView, toggleTheme, toggleCollapsed } from '@store/actions/app';

const withShortcutsListener = (Component) => {
	const WithShortcutsListener = ({ ...rest }) => {
		const dispatch = useDispatch();

		const modalSection = useSelector(selectModal);

		const handleKeyPress = React.useCallback((event) => {
			// Verify modals are closed.
			if (modalSection !== MODAL_SECTIONS.CLOSED) {
				return null;
			}

			// Get keyboard key pressed.
			const actionKey = (event.key || '').toUpperCase();

			switch (actionKey) {
				// Theme shortcuts.
				case '0':
					dispatch(toggleTheme());
					break;
				//  Views shortcuts.
				case '1':
				case CALENDAR_SHORTCUTS.D:
					dispatch(setView(CALENDAR_VIEWS.DAY));
					break;
				case '2':
				case CALENDAR_SHORTCUTS.W:
					dispatch(setView(CALENDAR_VIEWS.WEEK));
					break;
				case '3':
				case CALENDAR_SHORTCUTS.M:
					dispatch(setView(CALENDAR_VIEWS.MONTH));
					break;
				case '4':
				case CALENDAR_SHORTCUTS.Y:
					dispatch(setView(CALENDAR_VIEWS.YEAR));
					break;
				case '5':
				case CALENDAR_SHORTCUTS.L:
					dispatch(setView(CALENDAR_VIEWS.LIST));
					break;
				// View shortcut.
				case 'V':
					dispatch(toggleView());
					break;
				// Sidebar shortcut.
				case 'S':
					dispatch(toggleCollapsed.sidebar());
					break;
				// Settings shortcut.
				case 'A':
					dispatch(setModal(MODAL_SECTIONS.SETTINGS));
					break;
				// Shortcuts shortcut.
				case '?':
				case '/':
					dispatch(setModal(MODAL_SECTIONS.SHORTCUTS));
					break;
				case CALENDAR_SHORTCUTS.ESCAPE:
					break;
			}
		}, [ modalSection ]);

		React.useEffect(() => {
			document.addEventListener('keydown', handleKeyPress);

			return () => {
				document.removeEventListener('keydown', handleKeyPress);
			};
		}, [ handleKeyPress ]);

		return (
			<Component {...rest} />
		);
	};

	WithShortcutsListener.defaultName = 'WithShortcutsListener';

	return WithShortcutsListener;
};

export default withShortcutsListener;
