// Vertical position/size are driven by Draggable.Element (transform
// snapped to 15-minute rows); this only paints color and column layout.
export const setWeekCellStyle = (color = '', layout = null) => {
	const { left = 0, width = 1, z = 1 } = layout || {};

	return {
		zIndex: z,
		cursor: 'pointer',
		backgroundColor: color,
		left: `calc((100% - 4px) * ${left})`,
		width: `calc((100% - 4px) * ${width})`,
	};
};
