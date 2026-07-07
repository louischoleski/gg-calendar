import React from 'react';

const withScrollToTop = (WrappedComponent) => {
	class WithScrollToTop extends React.Component {
		componentDidUpdate(prevProps) {
			if (this.props.location !== prevProps.location) {
				window.scrollTo(0, 0);
			}
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	}

	WithScrollToTop.defaultName = 'WithScrollToTop';

	return WithScrollToTop;
};

export default withScrollToTop;
