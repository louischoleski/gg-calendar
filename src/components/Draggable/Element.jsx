import React from 'react';

import { QUARTER_HEIGHT, QUARTERS_PER_DAY } from '@utils/entries';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Draggable.Element
 * Snap-drags (move) and resizes its child vertically on a 15-minute
 * (12.5px) grid; when `maxX` > 0 it also snap-drags horizontally
 * across day columns. Less than 4px of movement is treated as a click.
 *
 * @param {number} y - starting row (15 min intervals from midnight)
 * @param {number} h - height in 15 min intervals
 * @param {number} x - starting column (day of week)
 * @param {number} maxX - last column index; 0 locks horizontal drag
 * @param {func} onClick - fired when the interaction was a plain click
 * @param {func} onCommit - fired with ({ x, y, h }) after a drag/resize
 */
const Element = ({
	children = null,
	y = 0, h = 1,
	x = 0, maxX = 0,
	onClick = () => null,
	onCommit = () => null,
}) => {
	// xPx: horizontal offset in px (whole columns) while dragging.
	const [ pos, setPos ] = React.useState({ y, h, xPx: 0 });
	const [ mode, setMode ] = React.useState(null); // null | 'move' | 'resize'

	React.useEffect(() => {
		setPos({ y, h, xPx: 0 });
	}, [ y, h, x ]);

	const beginSession = (e, sessionMode) => {
		if (e.button !== 0) return;

		e.preventDefault();
		e.stopPropagation();

		// Column width measured from the containing column element.
		const colWidth = e.currentTarget.parentElement?.getBoundingClientRect().width || 0;

		const session = {
			mode: sessionMode,
			pageX: e.pageX,
			pageY: e.pageY,
			y: pos.y,
			h: pos.h,
			moved: false,
			last: { y: pos.y, h: pos.h, dx: 0 },
		};

		const handleMove = (ev) => {
			if (!session.moved && (
				Math.abs(ev.pageY - session.pageY) > 3 ||
				Math.abs(ev.pageX - session.pageX) > 3
			)) {
				session.moved = true;
				setMode(session.mode);
				document.body.style.cursor = session.mode === 'move' ? 'move' : 'row-resize';
			}

			if (!session.moved) return;

			const deltaQuarters = Math.round(
				(ev.pageY - session.pageY) / QUARTER_HEIGHT
			);

			if (session.mode === 'move') {
				// Snap horizontal movement to whole day columns.
				const deltaCols = (maxX > 0 && colWidth > 0) ?
					clamp(
						Math.round((ev.pageX - session.pageX) / colWidth),
						-x, maxX - x
					) : 0;

				session.last = {
					y: clamp(session.y + deltaQuarters, 0, QUARTERS_PER_DAY - session.h),
					h: session.h,
					dx: deltaCols,
				};
			} else {
				session.last = {
					y: session.y,
					h: clamp(session.h + deltaQuarters, 1, QUARTERS_PER_DAY - session.y),
					dx: 0,
				};
			}

			setPos({
				y: session.last.y,
				h: session.last.h,
				xPx: session.last.dx * colWidth,
			});
		};

		const handleUp = (ev) => {
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleUp);

			document.body.style.cursor = '';
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

			// Snap back; a commit re-renders the box at its new slot.
			setPos({ y: session.last.y, h: session.last.h, xPx: 0 });

			if (
				session.last.y !== y ||
				session.last.h !== h ||
				session.last.dx !== 0
			) {
				onCommit({
					y: session.last.y,
					h: session.last.h,
					x: x + session.last.dx,
				});
			}
		};

		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleUp);
	};

	// Children may be a render function receiving the live { y, h }
	// so labels (e.g. the time text) update while dragging/resizing.
	const resolveChild = (livePos) => (
		typeof children === 'function' ? children(livePos) : children
	);

	// Faded placeholder left at the original slot while dragging
	// (like the original's temporary box / Google's lane placeholder).
	const ghostChild = resolveChild({ y, h });

	const ghostElement = React.cloneElement(ghostChild, {
		className: [ ghostChild.props.className, 'dv-box' ].join(' '),
		style: {
			top: '0px',
			left: '0px',
			position: 'absolute',
			width: 'calc((100% - 4px) * 1)',
			...ghostChild.props.style,
			opacity: 0.5,
			pointerEvents: 'none',
			minHeight: `${QUARTER_HEIGHT}px`,
			height: `${h * QUARTER_HEIGHT}px`,
			transform: `translateY(${y * QUARTER_HEIGHT}px)`,
		},
	});

	const mainChild = resolveChild({ y: pos.y, h: pos.h });

	const mainElement = React.cloneElement(mainChild, {
		onMouseDown: (e) => beginSession(e, 'move'),
		className: [
			mainChild.props.className, 'dv-box',
			mode === 'move' ? 'dv-box-dragging' : null,
			mode === 'resize' ? 'dv-box-resizing' : null,
		].filter(Boolean).join(' '),
		style: {
			top: '0px',
			left: '0px',
			position: 'absolute',
			width: 'calc((100% - 4px) * 1)',
			...mainChild.props.style,
			// While moving, the box expands to the full column width
			// (like Google Calendar) even if it lives in a narrow lane.
			...(mode === 'move' ? {
				left: '0px',
				width: 'calc((100% - 4px) * 1)',
			} : {}),
			minHeight: `${QUARTER_HEIGHT}px`,
			height: `${pos.h * QUARTER_HEIGHT}px`,
			transform: `translate(${pos.xPx}px, ${pos.y * QUARTER_HEIGHT}px)`,
			cursor: mode === 'move' ? 'move' : (mode === 'resize' ? 'row-resize' : 'pointer'),
			zIndex: mode ? 100 : (mainChild.props.style?.zIndex ?? 1),
		},
		children: [
			<React.Fragment key="content">
				{mainChild.props.children}
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

	return (
		<>
			{mode === 'move' ? ghostElement : null}
			{mainElement}
		</>
	);
};

export default Element;
