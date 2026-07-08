import React from 'react';

import { useContext } from './Core';

export const setElementStyle = (coord = {}, height = 0, isDragging = false, isResizing = false) => ({
	top: '0px',
	left: '0px',
	minHeight: '12.5px',
	height: `${+height * 12.5}px`,
	width: 'calc((100% - 4px) * 1)',
	zIndex: (isDragging || isResizing) ? '100' : '0',
	cursor: isResizing ? 'row-resize' : 'move', // Adjust cursor for resizing
	transform: `translate(calc((100% - 0px) * 0 + 0px), ${+coord.y * 12.5}px)`,
});

const Element = ({
	id = null, 
	lockX = false,
	lockY = false,
	children = null, 
	x = 0,  y = 0, h = 0, 
}) => {
	const isResizingRef = React.useRef(false);
	const positionRef = React.useRef({ x: 0, y: 0 }); // Use a ref to store the position

	const [ height, setHeight ] = React.useState(0);
	const [ isDragging, setIsDragging ] = React.useState(false);
	const [ position, setPosition ] = React.useState({ x: 0, y: 0 });
	const [ prevPosition, setPrevPosition ] = React.useState({ x: 0, y: 0 });

	const { data: { parentOffsetTop, parentScrollTop, parentBoundingClientRect }, updateData } = useContext();

	const headerOffset = parseInt(parentOffsetTop);
	const amountScrolled = parseInt(parentScrollTop);

	// Initialize.
	React.useEffect(() => {
		setHeight(h);
		setPosition({ x, y });
		setPrevPosition({ x, y });
		positionRef.current = { x, y };
	}, [ h, x, y ]);

	const isResizing = React.useMemo(() => (
		isResizingRef.current
	), [ isResizingRef.current ]);

	const setIsResizing = (flag = false) => {
		isResizingRef.current = flag;
	}

	const updatePosition = ({ x, y }) => {
		setPosition({ x, y });
		positionRef.current = { x, y };
	}

	const handleMouseUp = (e) => {
		e.preventDefault();
		setIsDragging(false);
	}

	const handleMouseDown = (e) => {
		e.preventDefault();

		setIsDragging(true);

		const boxHeight = height * 12.5;
		const startTop = position.y * 12.5;
		const [ tempX, tempY ] = [ e.pageX, e.pageY ];
		const startCursorY = e.pageY - parseInt(parentOffsetTop);

		const headerOffset = +parentBoundingClientRect.top.toFixed(2);

		let [ sX, sY ] = [ 0, 0 ];

		/** DRAG NORTH SOUTH */
		const _handleMouseMove = (e) => {
			if (isResizingRef?.current) {
				console.log('Resizing......................');

				setIsResizing(true);

				// Set new height.
				const box = e.target.parentElement;
				const boxTop = box.offsetTop;

				const newHeight = Math.round((
					e.pageY + 
					amountScrolled - 
					boxTop - 
					headerOffset
				) / 12.5);

				setHeight(newHeight);
			} else {
				sX = Math.abs(e.clientX - tempX);
				sY = Math.abs(e.clientY - tempY);

				const currentCursorY = e.pageY - headerOffset;
				const newOffsetY = currentCursorY - startCursorY;

				let newTop = Math.round((newOffsetY + startTop) / 12.5);

				if (newTop < 0 || currentCursorY < 0) {
					newTop = 0;
					// } else if (newTop + boxHeight > 1188) {
					// return;
				}

				updatePosition({
					x: lockX ? position.x : position.x + deltaX,
					y: newTop,
				});
			}
		};

		const _handleMouseUp = () => {
			setIsResizing(false);
			setIsDragging(false);

			setPrevPosition(positionRef.current);

			document.removeEventListener('mousemove', _handleMouseMove);
			document.removeEventListener('mouseup', _handleMouseUp);
		};

		document.addEventListener('mousemove', _handleMouseMove);
		document.addEventListener('mouseup', _handleMouseUp);
	};

	const handleResizeMouseDown = (e) => {
		console.log('Handle resize mouse down....');
		setIsResizing(true);
	};

	// Clone element.
	const ghostElement = React.cloneElement(children, {
		className: [
			children.props.className, 'dv-box',
			isDragging ? 'dv-box-dragging' : null,
			// isResizing ? 'dv-box-resizing' : null,
			'dv-temporary-box'
		].join(' ').trim(),
		style: {
			...children.props.style,
			...setElementStyle(prevPosition, height, isDragging, isResizing),
		},
		onMouseDown: (e) => e.stopPropagation(),
	});

	// Set main element.
	const mainElement = React.cloneElement(children, {
		onMouseUp: handleMouseUp,
		onMouseDown: handleMouseDown,
		className: [
			children.props.className, 'dv-box',
			isDragging ? 'dv-box-dragging' : null,
			isResizing ? 'dv-box-resizing' : null,
		].join(' ').trim(),
		style: {
			...children.props.style, 
			...setElementStyle(position, height, isDragging, isResizing),
		},
		children: [
			children.props.children,
			<div 
				key="resize" 
				className="dv-box-resize-s" 
				onMouseDown={handleResizeMouseDown}
			/>
		]
	});

	React.useEffect(() => {
		console.log('T DATA::', isResizing, isResizing);
	}, [ isResizing, isResizing ]);

	return (
		<>
			{(isDragging || isResizing) ? (
				ghostElement
			) : null}
			{mainElement}
			{isDragging ? (
				<aside 
					className="resize-overlay hide-resize-overlay" 
					style={{ backgroundColor: 'transparent' }} 
				/>
			) : null}
		</>
	);
};

export default Element;

