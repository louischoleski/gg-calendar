import React from 'react';

import { QUARTER_HEIGHT, QUARTERS_PER_DAY } from '@utils/entries';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Draggable.Element
 * Snap-drags (move) and resizes its child vertically on a 15-minute
 * (12.5px) grid. Less than 4px of movement is treated as a click.
 *
 * @param {number} y - starting row (15 min intervals from midnight)
 * @param {number} h - height in 15 min intervals
 * @param {func} onClick - fired when the interaction was a plain click
 * @param {func} onCommit - fired with ({ y, h }) after a drag/resize
 */
const Element = ({
	children = null,
	y = 0, h = 1,
	onClick = () => null,
	onCommit = () => null,
}) => {
	const [ pos, setPos ] = React.useState({ y, h });
	const [ mode, setMode ] = React.useState(null); // null | 'move' | 'resize'

	React.useEffect(() => {
		setPos({ y, h });
	}, [ y, h ]);

	const beginSession = (e, sessionMode) => {
		if (e.button !== 0) return;

		e.preventDefault();
		e.stopPropagation();

		const session = {
			mode: sessionMode,
			pageY: e.pageY,
			y: pos.y,
			h: pos.h,
			moved: false,
			last: { y: pos.y, h: pos.h },
		};

		const handleMove = (ev) => {
			if (!session.moved && Math.abs(ev.pageY - session.pageY) > 3) {
				session.moved = true;
				setMode(session.mode);
			}

			if (!session.moved) return;

			const deltaQuarters = Math.round(
				(ev.pageY - session.pageY) / QUARTER_HEIGHT
			);

			if (session.mode === 'move') {
				session.last = {
					y: clamp(session.y + deltaQuarters, 0, QUARTERS_PER_DAY - session.h),
					h: session.h,
				};
			} else {
				session.last = {
					y: session.y,
					h: clamp(session.h + deltaQuarters, 1, QUARTERS_PER_DAY - session.y),
				};
			}

			setPos(session.last);
		};

		const handleUp = (ev) => {
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleUp);

			setMode(null);

			if (!session.moved) {
				onClick(ev);
				return;
			}

			// Swallow the synthetic click that follows a drag so it
			// doesn't reach the grid's click-to-create handler.
			document.addEventListener('click', (ce) => {
				ce.stopPropagation();
			}, { capture: true, once: true });

			if (session.last.y !== y || session.last.h !== h) {
				onCommit(session.last);
			}
		};

		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleUp);
	};

	return React.cloneElement(children, {
		onMouseDown: (e) => beginSession(e, 'move'),
		className: [
			children.props.className, 'dv-box',
			mode === 'move' ? 'dv-box-dragging' : null,
			mode === 'resize' ? 'dv-box-resizing' : null,
		].filter(Boolean).join(' '),
		style: {
			top: '0px',
			left: '0px',
			position: 'absolute',
			width: 'calc((100% - 4px) * 1)',
			...children.props.style,
			minHeight: `${QUARTER_HEIGHT}px`,
			height: `${pos.h * QUARTER_HEIGHT}px`,
			transform: `translateY(${pos.y * QUARTER_HEIGHT}px)`,
			cursor: mode === 'resize' ? 'row-resize' : 'pointer',
			zIndex: mode ? 100 : (children.props.style?.zIndex ?? 1),
		},
		children: [
			<React.Fragment key="content">
				{children.props.children}
			</React.Fragment>,
			<div
				key="resize"
				className="dv-box-resize-s"
				onMouseDown={(e) => beginSession(e, 'resize')}
				style={{
					left: 0,
					right: 0,
					bottom: 0,
					height: '7px',
					cursor: 'row-resize',
					position: 'absolute',
				}}
			/>
		],
	});
};

export default Element;
