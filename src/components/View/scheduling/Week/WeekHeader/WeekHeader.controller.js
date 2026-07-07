export const setWeekViewHeaderClassName = (isSelected = false, isToday = false) => ([
	'weekview--header-day__number',
	(isSelected ? 'wvh--selected' : ''),
	(isToday ? 'wvh--today' : ''),
].join(' ').trim());
