export const setPrevNextStyle = (isActive = false) => (
	isActive ? ({}) : ({ 'pointerEvents': 'none' })
);

export const setDatetimeWrapper = (isActive = false) => ([
	'datetime-wrapper',
	(isActive ? 'datetime-inactive' : '')
].join(' '));
