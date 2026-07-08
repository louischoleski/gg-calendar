import React from 'react';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { setDate } from '@store/actions/app';
import { withShortcutsListener } from '@utils/hocs';
import { getLocale, constructLocale } from '@locales';
import { THEMES, THEME_CLASSNAMES } from '@constants/themes';
import { selectTheme, selectAnimation, selectDate } from '@store/selectors/app';

import View from './components/View';
import Modal from './components/Modals';
import Footer from './components/Footer';
import Search from './components/Search';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Category from './components/Category';
import CreateCTA from './components/CreateCTA';
import Datepicker from './components/Datepicker';
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

	const [today, setToday] = React.useState(new Date());
	const [headerTitle, setHeaderTitle] = React.useState('');

	React.useMemo(() => {
		dispatch(setDate(
			todayDate.getFullYear(),
			todayDate.getMonth(),
			todayDate.getDate(),
		));
	}, []);

	const themeClassName = React.useMemo(() => ([
		THEME_CLASSNAMES[theme || THEMES.DARK],
		(animation ? '' : 'disable-transitions'),
	].join(' ').trim()), [theme, animation]);

	const handlePrevClick = () => {
		if (!prevFnRef.current) return;

		if (prevFnRef?.current?.setPrevDay) {
			prevFnRef?.current?.setPrevDay(day, month, year);
		}

		if (prevFnRef?.current?.setPrevWeek) {
			prevFnRef?.current?.setPrevWeek(day, month, year);
		}
	};

	const handleNextClick = () => {
		if (!nextFnRef.current) return;

		if (nextFnRef?.current?.setNextDay) {
			nextFnRef.current.setNextDay(day, month, year);
		}

		if (nextFnRef?.current?.setNextWeek) {
			nextFnRef.current.setNextWeek(day, month, year);
		}
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

			{/* overlays / used for popup content */}
			{/* see readme @overlays */}
			{/* end overlays */}

			<Modal />

			{/* datepicker for header & form */}
			<Datepicker />

			{/* MAIN APP FORM */}

			{/* options for header select element (pick view) */}

			{/* floating toggle form button visible when sidebar is closed */}
			<CreateCTA />

			{/* create new category form */}
			<Category />

			{/* "eye" icon that appears in day/week view */}
			<CollapseView />

			{/* search for date popup */}
			<Search />

			{/* SETTINGS */}
			<Settings />

			{/* click calendar entry to view details */}
			<aside className="entry__options entry__options--hidden">
				<div className="entry__options--content">
					<div className="entry__options--header">
						<div className="entry__options-datetime">
							<div className="entry__options-date" />
							<div className="entry__options-time" />
						</div>
						<div className="entry__options--header-icons">
							<button
								className="entry__options-icon eoi__edit"
								data-tooltip="edit event (e)"
								aria-label="button"
								role="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="var(--white2)"
									viewBox="0 0 24 24"
									height="20px"
									width="20px"
								>
									<path d="M0 0h24v24H0z" fill="none" />
									<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
								</svg>
							</button>
							<button
								className="entry__options-icon eoi__delete"
								data-tooltip="delete event"
								aria-label="button"
								role="button"
							>
								<svg
									width={20}
									height={20}
									focusable="false"
									viewBox="0 0 24 24"
									fill="var(--white2)"
								>
									<path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
									<path d="M9 8h2v9H9zm4 0h2v9h-2z" />
								</svg>
							</button>
							<button
								className="entry__options-icon eoi__close"
								data-tooltip="close (esc)"
								role="button"
								aria-label="button"
							>
								<svg
									focusable="false"
									width={20}
									height={20}
									viewBox="0 0 24 24"
									fill="var(--white2)"
								>
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
								</svg>
							</button>
						</div>
					</div>
					{/* end header */}
					<div className="entry__options--body">
						<div className="entry-option-desc">
							<div className="eob-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="var(--white2)"
									height={20}
									width={20}
								>
									<path d="M6 12v-1.5h8V12Zm0 3v-1.5h6V15Zm-1.5 3q-.625 0-1.062-.448Q3 17.104 3 16.5v-11q0-.604.438-1.052Q3.875 4 4.5 4H6V2h1.5v2h5V2H14v2h1.5q.625 0 1.062.448Q17 4.896 17 5.5v11q0 .604-.438 1.052Q16.125 18 15.5 18Zm0-1.5h11V9h-11v7.5Z" />
								</svg>
							</div>
							<div className="eob-title" />
						</div>
						<div className="entry-option-desc">
							<div className="eob-icon" />
							<div className="eob-description" />
						</div>
						<div className="entry-option-desc">
							<div className="eob-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="eob-category--icon"
									fill="var(--primarylight1)"
									height={20}
									width={20}
								>
									<path d="M10 18q-1.646 0-3.104-.625-1.458-.625-2.552-1.719t-1.719-2.552Q2 11.646 2 10q0-1.667.625-3.115.625-1.447 1.719-2.541Q5.438 3.25 6.896 2.625T10 2q1.667 0 3.115.625 1.447.625 2.541 1.719 1.094 1.094 1.719 2.541Q18 8.333 18 10q0 1.646-.625 3.104-.625 1.458-1.719 2.552t-2.541 1.719Q11.667 18 10 18Z" />
								</svg>
							</div>
							<div className="eob-category" />
						</div>
					</div>
				</div>
			</aside>

			{/* privacy, terms, about sections */}
			<Footer />

			{/* popup that appears after event edit/creation */}
			<Notifications />
		</div>
	);
};

export default withShortcutsListener(App);
