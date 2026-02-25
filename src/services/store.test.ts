import { rootReducer } from './store';

describe('rootReducer', () => {
  it('returns correct initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isLoading: false,
        isAuthChecked: false,
        error: null,
        authRequest: false,
        authError: null,
        updateUserError: null
      },
      orderDetails: {
        order: null,
        isLoading: false,
        error: null
      }
    });
  });
});
