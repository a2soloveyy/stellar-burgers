import {
  addIngredient,
  clearConstructor,
  closeOrderModal,
  constructorReducer,
  createOrder,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './constructor-slice';
import { TIngredient, TOrder } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 200,
  image: 'img',
  image_large: 'img-large',
  image_mobile: 'img-mobile'
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'img',
  image_large: 'img-large',
  image_mobile: 'img-mobile'
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2026-02-23T10:00:00.000Z',
  updatedAt: '2026-02-23T10:05:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

describe('constructor slice', () => {
  it('returns initial state', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  it('adds bun and main ingredient', () => {
    const withBun = constructorReducer(undefined, addIngredient(bun));
    const withMain = constructorReducer(withBun, addIngredient(main));

    expect(withBun.bun?._id).toBe('bun-1');
    expect(withMain.ingredients).toHaveLength(1);
    expect(withMain.ingredients[0]).toMatchObject({
      _id: 'main-1',
      type: 'main'
    });
    expect(withMain.ingredients[0].id).toEqual(expect.any(String));
  });

  it('removes ingredient by id', () => {
    const initial = constructorReducer(undefined, addIngredient(main));
    const ingredientId = initial.ingredients[0].id;
    const state = constructorReducer(initial, removeIngredient(ingredientId));

    expect(state.ingredients).toHaveLength(0);
  });

  it('moves ingredients up and down', () => {
    const stateWithItems = constructorReducer(
      constructorReducer(undefined, addIngredient(main)),
      addIngredient({ ...main, _id: 'main-2', name: 'Начинка 2' })
    );

    const movedUp = constructorReducer(stateWithItems, moveIngredientUp(1));
    expect(movedUp.ingredients[0]._id).toBe('main-2');

    const movedDown = constructorReducer(movedUp, moveIngredientDown(0));
    expect(movedDown.ingredients[0]._id).toBe('main-1');
  });

  it('clears constructor and closes order modal', () => {
    const stateWithData = {
      ...constructorReducer(
        constructorReducer(undefined, addIngredient(bun)),
        addIngredient(main)
      ),
      orderModalData: order
    };

    const cleared = constructorReducer(stateWithData, clearConstructor());
    const closed = constructorReducer(stateWithData, closeOrderModal());

    expect(cleared.bun).toBeNull();
    expect(cleared.ingredients).toEqual([]);
    expect(closed.orderModalData).toBeNull();
  });

  it('handles createOrder pending/fulfilled/rejected', () => {
    const withPending = constructorReducer(
      undefined,
      createOrder.pending('request-1', ['bun-1', 'main-1', 'bun-1'])
    );
    expect(withPending.orderRequest).toBe(true);
    expect(withPending.error).toBeNull();

    const withFulfilled = constructorReducer(
      {
        ...withPending,
        bun: { ...bun, id: 'bun-id' },
        ingredients: [{ ...main, id: 'main-id' }]
      },
      createOrder.fulfilled(order, 'request-1', ['bun-1', 'main-1', 'bun-1'])
    );
    expect(withFulfilled.orderRequest).toBe(false);
    expect(withFulfilled.orderModalData).toEqual(order);
    expect(withFulfilled.bun).toBeNull();
    expect(withFulfilled.ingredients).toEqual([]);

    const withRejected = constructorReducer(
      withPending,
      createOrder.rejected(new Error('order failed'), 'request-1', [
        'bun-1',
        'main-1',
        'bun-1'
      ])
    );
    expect(withRejected.orderRequest).toBe(false);
    expect(withRejected.error).toBe('order failed');
  });
});
