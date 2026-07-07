export const setWeekCellStyle = (coord = {}, color = '', layout = null) => {
	const { left = 0, width = 1, z = 1 } = layout || {};

	return {
		zIndex: z,
		cursor: 'pointer',
		backgroundColor: color,
		top: `${+coord.y * 12.5}px`,
		height: `${+coord.h * 12.5}px`,
		left: `calc((100% - 4px) * ${left})`,
		width: `calc((100% - 4px) * ${width})`,
	};
};
