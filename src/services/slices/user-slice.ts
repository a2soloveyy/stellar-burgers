import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TUpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
};

type TAuthPayload = {
  email: string;
  password: string;
};

type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  authRequest: boolean;
  authError: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
  authRequest: false,
  authError: null,
  updateUserError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (payload: TRegisterPayload) => {
    const response = await registerUserApi(payload);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (payload: TAuthPayload) => {
    const response = await loginUserApi(payload);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (payload: TUpdateUserPayload) => {
    const response = await updateUserApi(payload);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(registerUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.error.message || 'Failed to register';
      })
      .addCase(loginUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.error.message || 'Failed to login';
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError = action.error.message || 'Failed to update user';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const userReducer = userSlice.reducer;
