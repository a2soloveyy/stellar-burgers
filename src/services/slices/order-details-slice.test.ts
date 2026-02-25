import {
  clearOrderDetails,
  fetchOrderByNumber,
  orderDetailsReducer
} from './order-details-slice';
import { TOrder } from '@utils-types';

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2026-02-23T10:00:00.000Z',
  updatedAt: '2026-02-23T10:05:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

describe('order-details slice', () => {
  it('returns initial state', () => {
    expect(orderDetailsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });

  it('clears order details', () => {
    const stateWithOrder = {
      order,
      isLoading: false,
      error: 'error'
    };
    const state = orderDetailsReducer(stateWithOrder, clearOrderDetails());

    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });

  it('handles fetchOrderByNumber pending/fulfilled/rejected', () => {
    const pending = orderDetailsReducer(
      undefined,
      fetchOrderByNumber.pending('request-1', 12345)
    );
    expect(pending.isLoading).toBe(true);
    expect(pending.error).toBeNull();

    const fulfilled = orderDetailsReducer(
      pending,
      fetchOrderByNumber.fulfilled(order, 'request-1', 12345)
    );
    expect(fulfilled.isLoading).toBe(false);
    expect(fulfilled.order).toEqual(order);

    const rejected = orderDetailsReducer(
      pending,
      fetchOrderByNumber.rejected(new Error('failed'), 'request-1', 12345)
    );
    expect(rejected.isLoading).toBe(false);
    expect(rejected.error).toBe('failed');
  });
});
