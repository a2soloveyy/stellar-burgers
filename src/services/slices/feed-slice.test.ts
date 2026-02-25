import { feedReducer, fetchFeed } from './feed-slice';
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

describe('feed slice', () => {
  it('returns initial state', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  it('handles fetchFeed pending/fulfilled/rejected', () => {
    const pending = feedReducer(undefined, fetchFeed.pending('request-1'));
    expect(pending.isLoading).toBe(true);
    expect(pending.error).toBeNull();

    const fulfilled = feedReducer(
      pending,
      fetchFeed.fulfilled(
        { success: true, orders, total: 100, totalToday: 10 },
        'request-1',
        undefined
      )
    );
    expect(fulfilled.isLoading).toBe(false);
    expect(fulfilled.orders).toEqual(orders);
    expect(fulfilled.total).toBe(100);
    expect(fulfilled.totalToday).toBe(10);

    const rejected = feedReducer(
      pending,
      fetchFeed.rejected(new Error('failed'), 'request-1', undefined)
    );
    expect(rejected.isLoading).toBe(false);
    expect(rejected.error).toBe('failed');
  });
});
