import React from 'react';

export const Context = React.createContext();

export const useContext = () => (
	React.useContext(Context)
);

export const Provider = ({ children }) => {
	const [ data, setData ] = React.useState({
		wrapperOffsetTop: 0,
		wrapperScrollTop: 0
	});

	const updateData = (newData) => {
		setData(newData);
	};

	return (
		<Context.Provider value={{ data, updateData }}>
			{children}
		</Context.Provider>
	);
};

export const withProvider = (Component) => {
	const WithProvider = (props) => (
		<Provider>
			<Component {...props} />
		</Provider>
	);

	WithProvider.defaultName = 'WithProvider';
	
	return WithProvider;
};
