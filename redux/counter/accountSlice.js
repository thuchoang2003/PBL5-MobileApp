import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: {
    email: '',
    fullname: '',
    uid: '',
  },
  isAuthenticated: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    doLogin: (state, action) => {
      const {email, fullname, uid} = action.payload;
      state.user.email = email;
      state.user.fullname = fullname;
      state.user.uid = uid;
      state.isAuthenticated = true;
    },
    doLogout: state => {
      state.user = {
        email: '',
        fullname: '',
        uid: '',
      };
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {},
});

// export const { doLogin, doGetAccount, doLogout, doUpdateInfomation } =
//   accountSlice.actions;
export const {doLogin, doLogout} = accountSlice.actions;

export default accountSlice.reducer;
