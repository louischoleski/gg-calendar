import React from 'react';

import { useContext, withProvider } from './Core';

const Wrapper = ({ children }) => {
	const parentRef = React.useRef(null);

	const { updateData } = useContext();

	const [ offsetTop, setOffsetTop ] = React.useState(0);
	const [ scrollTop, setScrollTop ] = React.useState(0);

	React.useEffect(() => {
		const handleScroll = () => {
			if (parentRef.current) {
				// Get the offsetTop of the parent element
				const newOffsetTop = parentRef.current.offsetTop;
				const newScrollTop = parentRef.current.scrollTop;
				const newBoundingClientRect = parentRef.current.getBoundingClientRect();

				setOffsetTop(newOffsetTop);
				setScrollTop(newScrollTop);

				updateData({
					parentOffsetTop: newOffsetTop,
					parentScrollTop: newScrollTop,
					parentBoundingClientRect: newBoundingClientRect,
				});
			}
		};

		// Attach the event listener to handle scroll
		window.addEventListener('scroll', handleScroll);

		// Initial calculation when component mounts
		handleScroll();

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return React.cloneElement(children, {
		ref: parentRef
	});
};

export default withProvider(Wrapper);
