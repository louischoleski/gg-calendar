export const THEMES = {
	DARK: 'DARK',
	LIGHT: 'LIGHT',
	CONTRAST: 'CONTRAST',
}

export const THEME_KEYS = Object.keys(THEMES || {});

export const THEME_CLASSNAMES = {
	DARK: 'body',
	LIGHT: 'body light-mode',
	CONTRAST: 'body contrast-mode',
}

export default {
	THEMES,
	THEME_KEYS,
	THEME_CLASSNAMES,
}
