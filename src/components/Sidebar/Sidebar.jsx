import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectCollapsed } from '@store/selectors/app';

import Category from './Category';
import { setSidebarClassName } from './Sidebar.controller';

const Sidebar = () => {
	const dispatch = useDispatch();

	const { sidebar: isSidebarCollapsed } = useSelector(selectCollapsed);

	const onSettingClick = () => {
		dispatch(setModal(MODAL_SECTIONS.SETTINGS));
	}

	const onCreateClick = () => {
		dispatch(setModal(MODAL_SECTIONS.CREATE_EVENT));
	}

	return (
		<aside className={setSidebarClassName(isSidebarCollapsed)}>
			{/* sidebar header */}
			<div className="sidebar-content--header">
				<button
					role="button"
					aria-label="button"
					onClick={onCreateClick}
					className="sb-toggle-form-btn"
				>
					<span className="stfb">
						<svg width={36} height={36} viewBox="0 0 36 36">
							<path fill="#34A853" d="M16 16v14h4V20z" />
							<path fill="#4285F4" d="M30 16H20l-4 4h14z" />
							<path fill="#FBBC05" d="M6 16v4h10l4-4z" />
							<path fill="#EA4335" d="M20 16V6h-4v14z" />
							<path fill="none" d="M0 0h36v36H0z" />
						</svg>
					</span>
					<span className="sb-toggle-form-btn__content">
						Create
					</span>
				</button>
				{/* <div class="sb-icon-toggles"></div> */}
				<button 
					role="button"
					aria-label="button" 
					className="sb-data-btn" 
					onClick={onSettingClick}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height={24}
						width={24}
						fill="var(--white2)"
					>
						<path d="M6 14q-.825 0-1.412-.588Q4 12.825 4 12t.588-1.413Q5.175 10 6 10t1.412.587Q8 11.175 8 12q0 .825-.588 1.412Q6.825 14 6 14Zm6 0q-.825 0-1.412-.588Q10 12.825 10 12t.588-1.413Q11.175 10 12 10t1.413.587Q14 11.175 14 12q0 .825-.587 1.412Q12.825 14 12 14Zm6 0q-.825 0-1.413-.588Q16 12.825 16 12t.587-1.413Q17.175 10 18 10q.825 0 1.413.587Q20 11.175 20 12q0 .825-.587 1.412Q18.825 14 18 14Z" />
					</svg>
				</button>
			</div>
			{/* sidebar content (datepicker/categories) */}
			<div className="sidebar-content__wrapper">
				{/* datepicker */}
				<div className="datepicker-sidebar">
					<div className="sb-datepicker__content">
						<div className="sbdatepicker__header">
							<button
								className="sbdatepicker-title"
								aria-label="button"
								role="button"
							>
								October 2022
							</button>
							<div className="sbdatepicker-nav">
								<button
									className="sbdatepicker-nav--prev"
									aria-label="button"
									role="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="var(--white3)"
										style={{ userSelect: "none", pointerEvents: "none" }}
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
									</svg>
								</button>
								<button
									className="sbdatepicker-nav--next"
									aria-label="button"
									role="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="var(--white3)"
										style={{ userSelect: "none", pointerEvents: "none" }}
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z" />
									</svg>
								</button>
							</div>
						</div>
						<div className="sbdatepicker__body">
							{/* create a 7x7 table */}
							<div className="sbdatepicker__body--header">
								<div className="sbdatepicker__body--header-cell">M</div>
								<div className="sbdatepicker__body--header-cell">T</div>
								<div className="sbdatepicker__body--header-cell">W</div>
								<div className="sbdatepicker__body--header-cell">T</div>
								<div className="sbdatepicker__body--header-cell">F</div>
								<div className="sbdatepicker__body--header-cell">S</div>
								<div className="sbdatepicker__body--header-cell">S</div>
							</div>
							<div className="sbdatepicker__body--dates" />
						</div>
						<aside className="sb-datepicker-change-date hide-sbdpcd">
							<aside className="sb-close-change-date">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="18px"
									viewBox="0 0 24 24"
									width="18px"
									fill="var(--white3)"
								>
									<path d="M0 0h24v24H0z" fill="none" />
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
								</svg>
							</aside>
							<div className="sb-yearpicker">
								<div className="sb-yearpicker-prev">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="18px"
										viewBox="0 0 24 24"
										width="18px"
										fill="var(--white4)"
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
									</svg>
								</div>
								<div className="sb-yearpicker-title">2023</div>
								<div className="sb-yearpicker-next">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="18px"
										viewBox="0 0 24 24"
										width="18px"
										fill="var(--white4)"
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
									</svg>
								</div>
							</div>
							<div className="sb-monthpicker">
								<div className="sb-monthpicker__month" data-sbdp-month={0}>
									January
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={1}>
									February
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={2}>
									March
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={3}>
									April
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={4}>
									May
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={5}>
									June
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={6}>
									July
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={7}>
									August
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={8}>
									September
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={9}>
									October
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={10}>
									November
								</div>
								<div className="sb-monthpicker__month" data-sbdp-month={11}>
									December
								</div>
							</div>
						</aside>
					</div>
				</div>

				{/* category modal */}
				<Category />

				{/* sidebar footer (github/personal links) 
				<div className="sb__info">
					<div className="sb__info-links">
						<a
							href="https://github.com/chaseottofy"
							rel="noreferrer"
							target="_blank"
							title="github.com/chaseottofy"
							name="github.com/chaseottofy"
							className="sb-link sbl-github"
							role="link"
							aria-label="vist github.com/chaseottofy"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="var(--white2)"
								viewBox="0 0 24 24"
								height={24}
								width={24}
							>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</a>
						<button
							role="button"
							className="sb-link sbl-email"
							data-tooltip="ottofy@zohomail.com"
							aria-label="email me at ottofy@zohomail.com"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="var(--white2)"
								height={24}
								width={24}
							>
								<path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7L4 8v10h16V8Zm0-2 8-5H4ZM4 8V6v12Z" />
							</svg>
						</button>
						<button
							className="sb-link sbl-portfolio"
							data-tooltip="portfolio in progress"
							role="button"
							aria-label="portfolio in progress"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height={24}
								width={24}
								fill="var(--white2)"
							>
								<path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm0-2h10.5v-3.5H4V18Zm12.5 0H20V9h-3.5ZM4 12.5h10.5V9H4Z" />
							</svg>
						</button>
					</div>
					<div className="sb__terms-privacy-project">
						<div className="sb__project-notes">
							<span>Notes</span>
						</div>
						<div className="sbt-divide"></div>
						<div className="sb__privacy">
							<span>Privacy</span>
						</div>
						<div className="sbt-divide"></div>
						<div className="sb__terms">
							<span>Terms</span>
						</div>
					</div>
				</div>
				*/}
			</div>
		</aside>	
	);
}

export default Sidebar;
