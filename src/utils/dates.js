export const getYear = () => {
	const d = new Date();
	return d.getFullYear();
}

export const testDate = (date) => (
	date instanceof Date && !isNaN(date) ? date : new Date(date)
)

export const compareDates = (date1, date2) => {
	[ date1, date2 ] = [ testDate(date1), testDate(date2) ];
	return (
		date1.getFullYear() === date2.getFullYear() && 
		date1.getMonth() === date2.getMonth() && 
		date1.getDate() === date2.getDate()
	);
};


export const isToday = (testDate) => (
	compareDates(testDate, new Date())
)

export default {
	isToday,
	getYear,
	testDate,
	compareDates,
}
