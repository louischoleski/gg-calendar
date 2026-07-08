import { useIntl } from 'react-intl'

import enUS from '../locales/lang/en/US.json'

const formatMessage = (id = '', values = {}) => {
	const intl = useIntl();
	return intl.formatMessage({ id, defaultMessage: enUS[id] }, values);
}

export default formatMessage
