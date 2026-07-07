import React from 'react';

const useClickOutside = (callback) => {
	const ref = React.useRef(null);

	const handler = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			callback(event);
		}
	};

	React.useEffect(() => {
		document.addEventListener('mousedown', handler, true);
		document.addEventListener('touchstart', handler, true);
		document.addEventListener('click', handler, true);

		return () => {
			document.removeEventListener('mousedown', handler, true);
			document.removeEventListener('touchstart', handler, true);
			document.removeEventListener('click', handler, true);
		};
	}, [ callback ]);

	return ref;
};

export default useClickOutside;
