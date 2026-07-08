import axios from 'axios';

const user = {
	fetchUser: (userId) => (
		axios.get('/read/' + userId).then((res) => res.data.result)
	),
}

export default user;
