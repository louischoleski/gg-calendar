'use strict';

export const ACCOUNT = [
	{
		slug: 'nav.account.access-logs.text',
		link: '/account/access-logs',
	},
	{
		slug: 'nav.account.settings.text',
		link: '/account/settings',
	},
];

export const CATEGORY_DEFAULT = [
	{
		id: 'a',
		text: 'Nozama miniTV',
		subMenu: [],
	},
	{
		id: 'b',
		text: 'Best Sellers',
		subMenu: [],
	},
	{
		id: 'c',
		text: 'Mobiles',
		subMenu: [],
	},
	{
		id: 'd',
		text: 'Customer Services',
		subMenu: [],
	},
	{
		id: 'e',
		text: 'Today\'s Deals',
		subMenu: [],
	},
	{
		id: 'f',
		text: 'Electronics',
		subMenu: [],
	},
	{
		id: 'g',
		text: 'Prime',
		subMenu: [],
	},
	{
		id: 'h',
		text: 'Fashion',
		subMenu: [],
	},
	{
		id: 'i',
		text: 'Nozama Pay',
		subMenu: [],
	},
	{
		id: 'j',
		text: 'Home & Kitchen',
		subMenu: [],
	},
];

export const MENUS = {
	ACCOUNT,
	CATEGORY: {
		PRIME: CATEGORY_DEFAULT,
		DEFAULT: CATEGORY_DEFAULT,
	},
};

export default MENUS;
