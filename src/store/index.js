import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';
import storePersist, { localStorageHealthCheck } from './storePersist';

localStorageHealthCheck();
