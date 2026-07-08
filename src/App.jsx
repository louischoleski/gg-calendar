import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setDate } from '@store/actions/app';
import { setFaviconDate } from '@utils/favicon';
import { withShortcutsListener } from '@utils/hocs';
import { THEMES, THEME_CLASSNAMES } from '@constants/themes';
import { selectTheme, selectAnimation, selectDate } from '@store/selectors/app';

import View from './components/View';
import Modal from './components/Modals';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreateCTA from './components/CreateCTA';
import CollapseView from './components/CollapseView';
import Notifications from './components/Notifications';

const todayDate = new Date();

const App = () => {
	const dispatch = useDispatch();

	const prevFnRef = React.useRef();
	const nextFnRef = React.useRef();

	const theme = useSelector(selectTheme);
	const animation = useSelector(selectAnimation);
	const { day, month, year } = useSelector(selectDate);

	const [headerTitle, setHeaderTitle] = React.useState('');

	// Start on today's date.
	React.useEffect(() => {
		dispatch(setDate(
			todayDate.getFullYear(),
			todayDate.getMonth(),
			todayDate.getDate(),
		));

		// Render today's date into the favicon.
		setFaviconDate(todayDate.getDate());
	}, []);

	const themeClassName = React.useMemo(() => ([
		THEME_CLASSNAMES[theme || THEMES.DARK],
		(animation ? '' : 'disable-transitions'),
	].join(' ').trim()), [theme, animation]);

	// Each view registers its own navigation handler(s) on the refs
	// (setPrevDay/setPrevWeek/setPrevMonth/...). Call whichever is set.
	const handlePrevClick = () => {
		Object.values(prevFnRef.current || {}).forEach((fn) => (
			typeof fn === 'function' && fn(day, month, year)
		));
	};

	const handleNextClick = () => {
		Object.values(nextFnRef.current || {}).forEach((fn) => (
			typeof fn === 'function' && fn(day, month, year)
		));
	};

	return (
		<div className={themeClassName} style={{ cursor: 'default' }}>
			<Header
				title={headerTitle}
				prevFn={handlePrevClick}
				nextFn={handleNextClick}
			/>

			<main className="main">
				{/* hide-sidebar */}
				<Sidebar />
				{/* calendar views */}
				<View
					prevFnRef={prevFnRef}
					nextFnRef={nextFnRef}
					setHeaderTitle={setHeaderTitle}
				/>
			</main>

			{/* modals: create/edit event, category, settings, search,
			    shortcuts, entry details popup (see @Modals) */}
			<Modal />

			{/* floating toggle form button visible when sidebar is closed */}
			<CreateCTA />

			{/* "eye" icon that appears in day/week view */}
			<CollapseView />

			{/* privacy, terms, about sections */}
			<Footer />

			{/* popup that appears after event edit/creation */}
			<Notifications />
		</div>
	);
};

export default withShortcutsListener(App);
