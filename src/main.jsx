import { throttle } from 'lodash';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';

import App from '@app';
// import { Loader } from '@components';
import { MODAL_SECTIONS } from '@constants/modals';
import rootReducer, { preloadedState } from '@store/rootReducer';
import storePersist, { localStorageHealthCheck } from '@store/storePersist';

/*!*************************************!*\
// (CSS) 
/*!*************************************!*/

// <html>
import "./static/css/root.css";
// </html>

// <header>
import "./static/css/header.css";
// </header>

// <main>
import "./static/css/containers.css";
import "./static/css/yearview.css";
import "./static/css/monthview.css";
import "./static/css/weekview.css";
import "./static/css/dayview.css";
import "./static/css/listview.css";
import "./static/css/sidebar.css";
import "./static/css/sbdatepicker.css";
// </main>

// <aside>
import "./static/css/aside/datepicker.css";
import "./static/css/aside/toast.css";
import "./static/css/aside/goto.css";
import "./static/css/aside/toggleForm.css";
import "./static/css/aside/sidebarSubMenu.css";
import "./static/css/aside/changeViewModule.css";
import "./static/css/aside/editCategoryForm.css";
import "./static/css/aside/form.css";
import "./static/css/aside/timepicker.css";
import "./static/css/aside/deleteCategoryPopup.css";
import "./static/css/aside/entryOptions.css";
import "./static/css/aside/info.css";
import "./static/css/aside/shortcuts.css";
// </aside>

const PERSIST_KEY = 'gg-calendar-state';

localStorageHealthCheck();

// Rehydrate persisted state (entries, categories, preferences).
const persisted = storePersist.get(PERSIST_KEY);

const store = configureStore({
	preloadedState: {
		...preloadedState,
		...(persisted ? {
			app: {
				...preloadedState.app,
				...persisted.app,
				loading: false,
				modalData: null,
				modal: MODAL_SECTIONS.CLOSED,
			},
			entries: {
				...preloadedState.entries,
				...persisted.entries,
			},
		} : {}),
	},
	reducer: rootReducer,
	devTools: import.meta.env.PROD === false, // Enable Redux DevTools in development mode
});

// Persist durable state on every change (throttled).
const persistState = throttle(() => {
	const { app, entries } = store.getState();

	storePersist.set(PERSIST_KEY, {
		app: {
			view: app.view,
			theme: app.theme,
			shortcut: app.shortcut,
			animation: app.animation,
			collapsed: app.collapsed,
			categories: app.categories,
		},
		entries,
	});
}, 500);

store.subscribe(persistState);

// Don't lose the trailing (throttled) write when the tab closes.
window.addEventListener('beforeunload', () => persistState.flush());

const root = document.getElementById('root');

if (root) {
	ReactDOM.createRoot(root).render(
		<Provider store={store}>
			<Suspense fallback={() => <h1>Loader</h1>}>
				<App />
			</Suspense>
		</Provider>
	);
}
