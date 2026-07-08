export const setWeekCellStyle = (coord = {}, color = '') => ({
	backgroundColor: color,
	top: `${+coord.y * 12.5}px`,
	height: `${+coord.h * 12.5}px`,
	width: 'calc((100% - 4px) * 1)',
	left: 'calc((100% - 0px) * 0 + 0px)',
});
