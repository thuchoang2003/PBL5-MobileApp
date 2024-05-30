import {configureStore} from '@reduxjs/toolkit';
import accountSlice from './counter/accountSlice';

export const store = configureStore({
  reducer: {
    account: accountSlice,
  },
});
export default store;
