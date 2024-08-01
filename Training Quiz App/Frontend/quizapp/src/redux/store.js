// store.js or configureStore.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

export { store };
