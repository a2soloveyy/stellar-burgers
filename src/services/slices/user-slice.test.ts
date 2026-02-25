import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userReducer
} from './user-slice';
import { TUser } from '@utils-types';

const user: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('user slice', () => {
  it('returns initial state', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      user: null,
      isLoading: false,
      isAuthChecked: false,
      error: null,
      authRequest: false,
      authError: null,
      updateUserError: null
    });
  });

  it('handles fetchUser pending/fulfilled/rejected', () => {
    const pending = userReducer(undefined, fetchUser.pending('request-1'));
    expect(pending.isLoading).toBe(true);
    expect(pending.error).toBeNull();

    const fulfilled = userReducer(
      pending,
      fetchUser.fulfilled(user, 'request-1', undefined)
    );
    expect(fulfilled.isLoading).toBe(false);
    expect(fulfilled.isAuthChecked).toBe(true);
    expect(fulfilled.user).toEqual(user);

    const rejected = userReducer(
      pending,
      fetchUser.rejected(new Error('failed'), 'request-1', undefined)
    );
    expect(rejected.isLoading).toBe(false);
    expect(rejected.isAuthChecked).toBe(true);
    expect(rejected.user).toBeNull();
    expect(rejected.error).toBe('failed');
  });

  it('handles registerUser and loginUser states', () => {
    const registerPending = userReducer(
      undefined,
      registerUser.pending('request-1', {
        name: 'User',
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(registerPending.authRequest).toBe(true);
    expect(registerPending.authError).toBeNull();

    const registerFulfilled = userReducer(
      registerPending,
      registerUser.fulfilled(user, 'request-1', {
        name: 'User',
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(registerFulfilled.authRequest).toBe(false);
    expect(registerFulfilled.user).toEqual(user);
    expect(registerFulfilled.isAuthChecked).toBe(true);

    const loginRejected = userReducer(
      registerPending,
      loginUser.rejected(
        new Error('login failed'),
        'request-2',
        { email: 'test@example.com', password: 'password' },
        undefined
      )
    );
    expect(loginRejected.authRequest).toBe(false);
    expect(loginRejected.authError).toBe('login failed');
  });

  it('handles updateUser and logoutUser', () => {
    const withUser = userReducer(
      undefined,
      loginUser.fulfilled(user, 'request-1', {
        email: 'test@example.com',
        password: 'password'
      })
    );

    const updatedUser: TUser = { ...user, name: 'Updated User' };
    const updated = userReducer(
      withUser,
      updateUser.fulfilled(updatedUser, 'request-2', { name: 'Updated User' })
    );
    expect(updated.user).toEqual(updatedUser);

    const updateRejected = userReducer(
      withUser,
      updateUser.rejected(
        new Error('update failed'),
        'request-2',
        { name: 'Updated User' },
        undefined
      )
    );
    expect(updateRejected.updateUserError).toBe('update failed');

    const loggedOut = userReducer(
      withUser,
      logoutUser.fulfilled(undefined, 'request-3', undefined)
    );
    expect(loggedOut.user).toBeNull();
  });
});
