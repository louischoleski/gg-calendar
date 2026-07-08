import React from 'react';

const Search = ({
	onClose = () => null,
}) => {
	return (
		<>
			<aside className="go-to-date">
				<div className="go-to__header">
					<span className="go-to-title">
						Go to date
					</span>
					<div className="go-to-subtitle">
						<span className="gts-format">
							month day year
						</span>
						{" "}
						<span className="gts-mid">
							or
						</span>
						{" "}
						<span className="gts-format">
							MM/DD/YYYY
						</span>
					</div>
				</div>
				<div className="go-to__body">
					<input type="text" className="go-to-input" spellCheck="false" required />
					<div className="go-to-err" style={{ display: "none" }}>
						Invalid Date
					</div>
				</div>
				<div className="go-to__footer">
					<div className="cancel-go-to" onClick={onClose}>
						Cancel
					</div>
					<div className="submit-go-to">
						Go
					</div>
				</div>
			</aside>
			<aside 
				className="go-to-date-overlay"
				onClick={onClose}
			/>
		</>
	);
}

export default Search;
