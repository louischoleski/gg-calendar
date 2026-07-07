import React from 'react';

import { TOTAL_DAY_HOURS } from '@constants/calendar';

const WeekSidebar = () => {
	// Dynamically set sidebar time interval.
	const sidebarValueElts = React.useMemo(() => (
		new Array(TOTAL_DAY_HOURS).fill(null).map((_, i) => {
			let hour;
			let md;

			if (i === 0) {
				hour = "";
				md = "";
			} else {
				hour = i;
				md = "AM";
			}

			if (hour > 12) {
				hour -= 12;
			}

			if (i >= 12) {
				md = "PM";
			}

			return `${hour} ${md}`;
		})
	), []);

	return (
		<div className="weekview--sidebar">
			{sidebarValueElts.map((cellValue) => (
				<span key={cellValue} className="sidegrid-cell">
					{cellValue}
				</span>
			))}
		</div>
	);
}

export default WeekSidebar;
