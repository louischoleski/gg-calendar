export const setDayTitleStyle = (isToday = false) => (
	isToday ? ({
		'color': 'var(--primary1)'
	}) : ({})
);

export const setDayTitleClassName = (isToday = false) => ([
	'dayview--header-day__number',
	(isToday ? 'dayview--header-day__number--today' : ''),
].join(' ').trim());
