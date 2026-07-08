import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setCategories } from '@store/actions/app';
import { THEMES, THEME_CLASSNAMES } from '@constants/themes';
import { selectTheme, selectCategories } from '@store/selectors/app';

const MENU_WIDTH = 192;
const MENU_HEIGHT = 128;

// Keep the popup inside the viewport, next to the clicked button.
const setMenuPosition = (x = 0, y = 0) => ({
	position: 'fixed',
	left: `${Math.max(Math.min(x, window.innerWidth - MENU_WIDTH - 8), 8)}px`,
	top: `${Math.max(Math.min(y, window.innerHeight - MENU_HEIGHT - 8), 8)}px`,
});

/**
 * CategoryActionMenu
 * Kebab menu for a sidebar category (port of the original
 * popup-ctg-options): edit it, show only it, or show all but it.
 * Rendered through a portal on document.body — the sidebar is a
 * transformed, overflow-hidden container that would otherwise
 * hijack fixed positioning and clip the popup (the original
 * likewise appends it to the body). The wrapper carries the theme
 * class so CSS variables resolve outside the themed app div.
 */
const CategoryActionMenu = ({
	categoryId = null,
	position = { x: 0, y: 0 },
	onEdit = () => null,
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const theme = useSelector(selectTheme);
	const categories = useSelector(selectCategories);

	React.useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [ onClose ]);

	// "Display this only": target on, every other category off.
	const onDisplayOnlyClick = () => {
		dispatch(setCategories(categories.map((category) => ({
			...category, checked: category.id === categoryId,
		}))));

		onClose();
	};

	// "Display all but this": target off, every other category on.
	const onDisplayAllButClick = () => {
		dispatch(setCategories(categories.map((category) => ({
			...category, checked: category.id !== categoryId,
		}))));

		onClose();
	};

	const onEditClick = () => {
		onEdit(categoryId);
		onClose();
	};

	return ReactDOM.createPortal(
		<div className={THEME_CLASSNAMES[theme || THEMES.DARK]}>
			<div
				className="popup-ctg-options"
				style={setMenuPosition(position.x, position.y)}
			>
				<div className="option__open-ctg-edit" onClick={onEditClick}>
					Edit category (name, color)
				</div>
				<div className="option__close-other-ctg" onClick={onDisplayOnlyClick}>
					Display this only
				</div>
				<div className="option__open-other-ctg" onClick={onDisplayAllButClick}>
					Display all but this
				</div>
			</div>
			<div
				className="popup-ctg-options__overlay"
				onClick={onClose}
				style={{ position: 'fixed', inset: 0 }}
			/>
		</div>,
		document.body
	);
}

export default CategoryActionMenu;
