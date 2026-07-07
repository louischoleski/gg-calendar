import React from 'react';

const Settings = () => {
	return (
		<aside className="sidebar-sub-menu hide-sidebar-sub-menu">
			<div className="sub-menu__header">
				<div className="sub-menu--title">Settings &amp; Data</div>
				<div className="sub-menu--icons">
					<div
						className="toggle-animations-icon__sm"
						data-tooltip="Animations Enabled"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							enableBackground="new 0 0 24 24"
							height="24px"
							viewBox="0 0 24 24"
							width="24px"
							fill="var(--primary2)"
							className="tai-on"
						>
							<rect fill="none" height={24} width={24} />
							<path d="M2.88,7.88l1.54,1.54C4.15,10.23,4,11.1,4,12c0,4.41,3.59,8,8,8s8-3.59,8-8s-3.59-8-8-8c-0.9,0-1.77,0.15-2.58,0.42 L7.89,2.89C9.15,2.32,10.54,2,12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12C2,10.53,2.32,9.14,2.88,7.88z M7,5.5 C7,6.33,6.33,7,5.5,7S4,6.33,4,5.5S4.67,4,5.5,4S7,4.67,7,5.5z" />
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							enableBackground="new 0 0 24 24"
							height="24px"
							viewBox="0 0 24 24"
							width="24px"
							fill="var(--red1)"
							className="tai-off hide-tai"
						>
							<g>
								<rect fill="none" height={24} width={24} />
								<path d="M22,12c0,5.52-4.48,10-10,10S2,17.52,2,12c0-1.19,0.22-2.32,0.6-3.38L4.48,9.3C4.17,10.14,4,11.05,4,12c0,4.41,3.59,8,8,8 s8-3.59,8-8s-3.59-8-8-8c-0.95,0-1.85,0.17-2.69,0.48L8.63,2.59C9.69,2.22,10.82,2,12,2C17.52,2,22,6.48,22,12z M5.5,4 C4.67,4,4,4.67,4,5.5S4.67,7,5.5,7S7,6.33,7,5.5S6.33,4,5.5,4z M11,16V8H9v8H11z M15,16V8h-2v8H15z" />
							</g>
						</svg>
					</div>
					<div
						className="keyboard-disabled-sm"
						data-tooltip="Keyboard Shortcuts Disabled"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height={24}
							width={24}
							fill="var(--red1)"
						>
							<path d="M4 19q-.825 0-1.412-.587Q2 17.825 2 17V7q0-.825.588-1.412Q3.175 5 4 5h16q.825 0 1.413.588Q22 6.175 22 7v10q0 .825-.587 1.413Q20.825 19 20 19Zm0-2h16V7H4v10Zm4-1h8v-2H8Zm-3-3h2v-2H5Zm3 0h2v-2H8Zm3 0h2v-2h-2Zm3 0h2v-2h-2Zm3 0h2v-2h-2ZM5 10h2V8H5Zm3 0h2V8H8Zm3 0h2V8h-2Zm3 0h2V8h-2Zm3 0h2V8h-2ZM4 17V7v10Z" />
						</svg>
					</div>
					<div className="close-sub-menu">
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
			</div>
			<div className="sub-menu__body">
				<div className="sub-menu-content">
					{/* row one */}
					<div className="sub-menu--item">
						<div className="sub-menu--item__title">
							Calendar Data (JSON)
							<hr />
							<strong>(Download &amp; Upload)</strong>
						</div>
						{/* .sub-menu--item__description >strong */}
						<div className="sub-menu--item__description sbmid-row-one">
							Uploading data will overwrite existing data!
							<br />
							Please ensure you have a backup of your data before uploading.
							<br />
							Uploading unsupported data will not cause any overwrites.
						</div>
						<div className="sub-menu--item__actions">
							<div className="sm-download-json">
								<div className="sm-json-btn down-json">
									<div className="sm-download-json-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height={24}
											width={24}
											fill="var(--white3)"
										>
											<path d="M6 20q-.825 0-1.412-.587Q4 18.825 4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413Q18.825 20 18 20Zm6-4-5-5 1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11Z" />
										</svg>
									</div>
									<div className="sm-download-json-title">download.json</div>
								</div>
								<div className="sm-json-btn upload-json">
									<div className="sm-upload-json-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height={24}
											width={24}
											fill="var(--white3)"
										>
											<path d="M6 20q-.825 0-1.412-.587Q4 18.825 4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413Q18.825 20 18 20Zm5-4V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16Z" />
										</svg>
									</div>
									<div className="sm-upload-json-title">upload.json</div>
								</div>
							</div>
						</div>
					</div>
					{/* row two */}
					<div className="sub-menu--item smi-theme-actions">
						<div className="sub-menu--item__title">
							Configure Application Theme
						</div>
						<div className="sub-menu--item__description">
							light, dark, and high contrast themes.
						</div>
						<div className="sub-menu--item__actions theme-actions">
							<div className="theme-option theme-option-dark">
								<input
									className="theme-radio__input"
									name="themeoption"
									type="radio"
									defaultValue="dark"
									defaultChecked
								/>
								<span>Dark</span>
							</div>
							<div className="theme-option theme-option-light">
								<input
									className="theme-radio__input"
									name="themeoption"
									type="radio"
									defaultValue="light"
								/>
								<span>Light</span>
							</div>
							<div className="theme-option theme-option-contrast">
								<input
									className="theme-radio__input"
									name="themeoption"
									type="radio"
									defaultValue="contrast"
								/>
								<span>High Contrast</span>
							</div>
						</div>
					</div>
					{/* row three */}
					<div className="sub-menu--item smias">
						<div className="sub-menu--item__title">Keyboard Shortcuts</div>
						<div className="sub-menu--item__description">
							<span>30 individual keys in use for 23 different actions.</span>
							<br />
							<span>("Escape" key actions will always be enabled.)</span>
						</div>
						<div className="smia-shortcuts">
							<div className="toggle-kb-shortcuts-btn__smia">
								<span>Open Shortcuts Menu</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height={24}
									width={24}
									fill="var(--white2)"
								>
									<path d="M4 19q-.825 0-1.412-.587Q2 17.825 2 17V7q0-.825.588-1.412Q3.175 5 4 5h16q.825 0 1.413.588Q22 6.175 22 7v10q0 .825-.587 1.413Q20.825 19 20 19Zm0-2h16V7H4v10Zm4-1h8v-2H8Zm-3-3h2v-2H5Zm3 0h2v-2H8Zm3 0h2v-2h-2Zm3 0h2v-2h-2Zm3 0h2v-2h-2ZM5 10h2V8H5Zm3 0h2V8H8Zm3 0h2V8h-2Zm3 0h2V8h-2Zm3 0h2V8h-2ZM4 17V7v10Z" />
								</svg>
							</div>
							<div className="smia-set-shortcut-status">
								<span className="smia-set-status-title">toggle on/off</span>
								<div className="smia-disable-shortcuts__btn">
									<label>
										<input
											type="checkbox"
											className="smia-toggle-shortcuts-checkbox"
											defaultChecked
										/>
										<span className="smia-slider" />
									</label>
								</div>
							</div>
						</div>
					</div>
					{/* row four */}
					<div className="sub-menu--item">
						<div className="sub-menu--item__title smias">
							Transitions/Animations
						</div>
						<div className="sub-menu--item__description smi-last">
							<span>
								All transitions and animations can be toggled on/off.
							</span>
							<br />
							<span></span>
						</div>
						<div className="smia-ani">
							<span className="smdt-title">toggle on/off</span>
							<div className="smdt-toggle">
								<label>
									<input
										type="checkbox"
										className="smdt-toggle-checkbox"
										defaultChecked
									/>
									<span className="smdt-slider" />
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default Settings;
