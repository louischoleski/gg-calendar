'use strict';

import * as screenElements from '../screens';

export const guestRoutes = [
	{
		slug: 'home',
		path: '/',
		element: screenElements.Home,
	},
	{
		slug: 'cart',
		path: '/cart',
		element: screenElements.Cart,
	},
	{
		slug: 'sign-in',
		path: '/signin',
		element: screenElements.SignIn,
	},
	{
		slug: 'sign-up',
		path: '/signup',
		element: screenElements.SignUp,
	},
	{
		slug: 'browse',
		path: '/browse',
		element: screenElements.Browse,
	},
	{
		slug: 'account',
		path: '/account',
		element: screenElements.Account,
	},
	{
		slug: 'account-order',
		path: '/account/orders',
		element: screenElements.AccountOrders,
	},
	{
		slug: 'account-address',
		path: '/account/address',
		element: screenElements.AccountAddress,
	},
	{
		slug: 'account-address-add',
		path: '/account/address/add',
		element: screenElements.AccountAddressAdd,
	},
	// {
	// 	slug: 'activate',
	// 	path: '/activate',
	// 	element: screenElements.Activate,
	// },
	// {
	// 	slug: 'forgot-password',
	// 	path: '/forgot_password',
	// 	element: screenElements.ForgotPassword,
	// },
];

export const accountRoutes = [
	// {
	// 	slug: 'account-profile',
	// 	path: '/account/profile',
	// 	element: screenElements.AccountProfile,
	// },
	// {
	// 	slug: 'account-member',
	// 	path: '/account/:id?',
	// 	element: screenElements.AccountMember,
	// },
 	// {
 	// 	slug: 'account-settings',
 	// 	path: '/account/settings',
 	// 	element: screenElements.AccountSettings,
 	// },
	// {
	// 	slug: 'account-access-logs',
	// 	path: '/account/access-logs',
	// 	element: screenElements.AccountAccessLogs,
	// },
];

const routes = [
	guestRoutes,
	accountRoutes,
].flat();

export default routes;

