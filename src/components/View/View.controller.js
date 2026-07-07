export const setViewClassName = (isActive = false) => ([
	'container__calendars',
	'cc-tran',
	(isActive ? 'container__calendars-sb-active' : ''),
].join(' '));
