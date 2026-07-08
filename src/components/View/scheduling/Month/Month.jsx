import React from 'react';

const MonthScheduling = () => {
	return (
		<div className="monthview">
			<div className="monthview__top">
				<div className="monthview__top-weekname">SUN</div>
				<div className="monthview__top-weekname">MON</div>
				<div className="monthview__top-weekname">TUE</div>
				<div className="monthview__top-weekname">WED</div>
				<div className="monthview__top-weekname">THU</div>
				<div className="monthview__top-weekname">FRI</div>
				<div className="monthview__top-weekname">SAT</div>
			</div>
			<div className="monthview--calendar" />
		</div>
	);
}

export default MonthScheduling;
