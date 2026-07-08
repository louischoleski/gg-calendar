export const setSidebarClassName = (isActive = false) => ([
	'sidebar',
	'sidebar-transition',
	(isActive ? '' : 'hide-sidebar')
].join(' '));
