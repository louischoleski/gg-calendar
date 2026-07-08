export const hasObjectKey = (data = {}) => Boolean(
	Object.keys(data || {}).length
);

export const toggleStringArray = (currentActive = '', stringArray = []) => {
	// Find the index of the current active string in the array
	const currentIndex = stringArray.indexOf(currentActive);

	// Check if the current active string is present in the array
	if (currentIndex !== -1) {
		// Calculate the index of the next string in the array
		const nextIndex = (currentIndex + 1) % stringArray.length;

		// Return the next string in the array
		return stringArray[nextIndex];
	} else {
		// If the current active string is not in the array, return the first string
		return stringArray[0];
	}
}

export default {
	hasObjectKey,
	toggleStringArray,
}
