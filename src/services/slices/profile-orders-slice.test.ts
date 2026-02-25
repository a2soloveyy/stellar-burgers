import {
  fetchProfileOrders,
  profileOrdersReducer
} from './profile-orders-slice';
import { TOrder } from '@utils-types';

const orders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Тестовый заказ',
    createdAt: '2026-02-23T10:00:00.000Z',
    updatedAt: '2026-02-23T10:05:00.000Z',
    number: 12345,
    ingredients: ['bun-1', 'main-1', 'bun-1']
  }
];

describe('profile-orders slice', () => {
  it('returns initial state', () => {
    expect(profileOrdersReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });

  it('handles fetchProfileOrders pending/fulfilled/rejected', () => {
    const pending = profileOrdersReducer(
      undefined,
      fetchProfileOrders.pending('request-1', undefined)
    );
    expect(pending.isLoading).toBe(true);
    expect(pending.error).toBeNull();

    const fulfilled = profileOrdersReducer(
      pending,
      fetchProfileOrders.fulfilled(orders, 'request-1', undefined)
    );
    expect(fulfilled.isLoading).toBe(false);
    expect(fulfilled.orders).toEqual(orders);

    const rejected = profileOrdersReducer(
      pending,
      fetchProfileOrders.rejected(new Error('failed'), 'request-1', undefined)
    );
    expect(rejected.isLoading).toBe(false);
    expect(rejected.error).toBe('failed');
  });
});
