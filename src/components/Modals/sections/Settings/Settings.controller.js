export const setShortcutFill = (isActive = false) => (
	isActive ? 'var(--primary1)' : 'var(--red1)'
);

export const setAnimationDataTooltip = (isActive = false) => ([
	'Animations',
	(isActive ? 'Enabled' : 'Disabled'),
].join(' '));

export const setShortcutDataTooltip = (isActive = false) => ([
	'Keyboard',
	'shortcuts',
	(isActive ? 'enabled' : 'disabled'),
].join(' '));
