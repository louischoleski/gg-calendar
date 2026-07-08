import React from 'react';

const isValidJson = (jsonString) => {
	// Check empty input
	if (jsonString.trim() === '') {
		return false;
	}

	try {
		const object = JSON.parse(jsonString);
		return object && typeof object === 'object';
	} catch (e) {
		return false;
	}
}

const setValueToString = (value) => typeof value === 'string' ? value : JSON.stringify(value);

const useLocalStorage = (key, initValue) => {

	const initialize = (key) => {
		try {
			const item = localStorage.getItem(key);
			if (item && item !== 'undefined') {
				return isValidJson(item) ? JSON.parse(item) : item;
			}

			const initStoreStringValue = setValueToString(initValue);
			localStorage.setItem(key, 
				isValidJson(initStoreStringValue) ? 
				JSON.stringify(initStoreStringValue) : 
				initStoreStringValue
			);
			return initValue;
		} catch {
			return initValue;
		}
	};

	const [state, setState] = React.useState(initialize(key)); // problem is here

	// solution is here....
	React.useEffect(() => {
		setState(initialize(key));
	},[]);

	const setValue = (value) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			const valueToStoreString = setValueToString(valueToStore);
			setState(valueToStoreString);
			localStorage.setItem(key, valueToStore);
		} catch (error) {
			console.error(error);
		}
	};

	const remove = () => {
		try {
			localStorage.removeItem(key);
		} catch {
			console.error(error);
		}
	};

	return [state, setValue, remove];
};

export default useLocalStorage;
