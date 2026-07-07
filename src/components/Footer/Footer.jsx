import React from 'react';

const Footer = () => {
	return (
		<aside className="sb__info-popup hide-sb-info-popup">
			<div className="sb__info-popup-header">
				<select name="popup-info" className="select-popup-info">
					<option value="notes">Project Notes</option>
					<option value="privacy">Privacy</option>
					<option value="terms">Terms</option>
				</select>
				<div className="close-sb-info">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height={24}
						width={24}
						fill="var(--white2)"
					>
						<path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
					</svg>
				</div>
			</div>
			<div className="sb__info-popup-body">
				<div className="sb__info-popup-body__content">
					<div className="sbip-title" />
					<div className="sbip-content" />
				</div>
			</div>
		</aside>
	);
}

export default Footer;
