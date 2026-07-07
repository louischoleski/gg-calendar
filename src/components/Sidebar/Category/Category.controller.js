export const setCategoryCaret = (isActive = false) => ([
	'sbch-caret',
	(isActive ? '' : 'sbch-caret--open'),
].join(' ').trim());

export const setCategoryOptionFill = (isChecked = false) => (
	isChecked ? 'var(--taskcolor0)' : 'none'
);

export const setCategoryOptionChecked = (isChecked) => String(isChecked);

export const setCategoryOptionBtnStyle = (color = '', isChecked = false) => (
	isChecked ? ({
		backgroundColor: color,
		border: `2px solid ${color}`,
	}) : ({
		backgroundColor: 'var(--black1)',
		border: `2px solid ${color}`,
	})
);
