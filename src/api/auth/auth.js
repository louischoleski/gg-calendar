import axios from 'axios';

const getTimestamp = () => new Date().getTime();

const auth = {
	signin: (credentials) => (
		axios.post(`/login?timestamp=${getTimestamp()}`, credentials).then((res) => res.data.result)
	),
	// TODO
	activate: (credentials) => (
		axios.post(`/login?timestamp=${getTimestamp()}`, credentials).then((res) => res.data.result)
	),
	signup: (credentials) => (
		axios.post(`/register?timestamp=${getTimestamp()}`, credentials).then((res) => res.data.result)
	),
	logout: () => (
		axios.post(`/logout?timestamp=${getTimestamp()}`)
	),
}

export default auth;
