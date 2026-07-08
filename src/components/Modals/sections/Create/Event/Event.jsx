import React from 'react';

const CreateEvent = ({
	onClose = () => null,
}) => {
	return (
		<>
			<aside
				className="entries__form"
				style={{ top: "5%", left: "5%", right: "5%", bottom: "5%", margin: "auto" }}
			>
				<aside className="form-modal-overlay hide-form-overlay" />
				<div className="entries__form--header">
					<div className="form-header--dragarea" />
					<div 
						onClick={onClose}
						data-tooltip="close form"
						className="form--header__icon-close" 
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height={20}
							width={20}
							fill="var(--white2)"
						>
							<path d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
						</svg>
					</div>
				</div>
				<form className="entry-form">
					<div className="entries__form--body">
						<div className="form--body__title form-body-single">
							<input
								type="text"
								placeholder="Add title"
								className="form--body__title-input"
								maxLength={50}
								spellCheck="false"
								required
							/>
						</div>
						<div className="form--body__description form-body-single">
							<textarea
								placeholder="Add description"
								className="form--body__description-input"
								maxLength={200}
								spellCheck="false"
								defaultValue={""}
							/>
						</div>
						<div className="form--body__start form-body-double">
							<div className="form--body__start-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height={24}
									width={24}
									fill="var(--white3)"
									className="form--body-svg__start"
								>
									<path d="m15.3 16.7 1.4-1.4-3.7-3.7V7h-2v5.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z" />
								</svg>
							</div>
							<div className="form--body__start-inputs">
								<span
									className="form--body-start__date"
									data-form-date-type="start"
									data-form-date="2024-1-6"
								>
									Feb 6, 2024
								</span>
								<div className="form-br" />
								<span
									className="form--body-start__time"
									data-form-time-type="start"
									data-form-time="22:00"
								>
									10:00pm
								</span>
							</div>
						</div>
						<div className="form--body__end form-body-double">
							<div className="form--body__end-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height={24}
									width={24}
									fill="var(--white3)"
									className="form--body-svg__end"
								>
									<path d="m15.3 16.7 1.4-1.4-3.7-3.7V7h-2v5.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z" />
								</svg>
							</div>
							<div className="form--body__end-inputs">
								<span
									className="form--body-end__date"
									data-form-date-type="end"
									data-form-date="2024-1-6"
								>
									Feb 6, 2024
								</span>
								<div className="form-br" />
								<span
									className="form--body-end__time"
									data-form-time-type="end"
									data-form-time="22:30"
								>
									10:30pm
								</span>
							</div>
						</div>
						<div className="form--body__category form-body-double">
							<div className="form--body__category-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 0 24 24"
									width="24px"
									fill="#2C52BA"
								>
									<path d="M0 0h24v24H0z" fill="none" />
									<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
								</svg>
							</div>
							<div className="form--body__category-inputs">
								<aside
									className="close-options-floating__btn"
									style={{
										zIndex: -1,
										userSelect: "none",
										pointerEvents: "none",
										opacity: 0,
										boxShadow: "none",
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height={20}
										width={20}
										fill="var(--white3)"
									>
										<path d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
									</svg>
								</aside>
								<div
									className="form--body__category-modal--wrapper"
									data-form-category="default"
								>
									<div
										className="form--body__category-modal--wrapper-selection"
										style={{ backgroundColor: "rgb(44, 82, 186)" }}
									>
										<span
											className="form--body__category-modal--wrapper__color"
											style={{ backgroundColor: "rgb(44, 82, 186)" }}
										/>{" "}
										<span className="form--body__category-modal--wrapper__title">
											default
										</span>
									</div>
									<span className="form--body__category-modal hide-form-category-modal" />
								</div>
							</div>
						</div>
					</div>
					<div className="entries__form--footer">
						<button
							className="form--footer__button-cancel"
							type="reset"
							role="button"
							aria-label="button"
						>
							reset
						</button>{" "}
						<button
							className="form--footer__button-save"
							type="submit"
							role="button"
							aria-label="button"
							data-form-action="create"
							data-form-id
						>
							save
						</button>
					</div>
				</form>
			</aside>
			<aside 
				className="form-overlay"
				onClick={onClose}
			/>
		</>
	);
}

export default CreateEvent;
