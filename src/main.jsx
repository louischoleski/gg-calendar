import { Suspense } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';

import App from '@app';
// import { Loader } from '@components';
import rootReducer, { preloadedState } from '@store/rootReducer';

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

const store = configureStore({
	preloadedState,
	reducer: rootReducer,
	devTools: import.meta.env.PROD === false, // Enable Redux DevTools in development mode
});

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
