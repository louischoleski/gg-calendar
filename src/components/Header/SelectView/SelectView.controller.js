export const setClassName = (isActive = false) => ([
	'view-option',
	(isActive ? 'change-view--option__active' : ''),
].join(' '))
