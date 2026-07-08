/**
 * setFaviconDate
 * Draw a Google-Calendar-style favicon with the given day number and
 * swap it into the document (no pre-generated assets). Called with
 * today's date; re-render when the day changes.
 */
export const setFaviconDate = (day = new Date().getDate()) => {
	const size = 64;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const radius = 10;

	// White rounded tile.
	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.moveTo(radius, 2);
	ctx.arcTo(size - 2, 2, size - 2, size - 2, radius);
	ctx.arcTo(size - 2, size - 2, 2, size - 2, radius);
	ctx.arcTo(2, size - 2, 2, 2, radius);
	ctx.arcTo(2, 2, size - 2, 2, radius);
	ctx.closePath();
	ctx.fill();

	// Blue frame.
	ctx.strokeStyle = '#4285f4';
	ctx.lineWidth = 5;
	ctx.stroke();

	// Day number.
	ctx.fillStyle = '#4285f4';
	ctx.font = 'bold 34px Arial, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(String(day), size / 2, size / 2 + 4);

	let link = document.querySelector("link[rel~='icon']");
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.head.appendChild(link);
	}
	link.type = 'image/png';
	link.href = canvas.toDataURL('image/png');
};

export default setFaviconDate;
