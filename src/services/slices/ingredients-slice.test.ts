import { fetchIngredients, ingredientsReducer } from './ingredients-slice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
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
  }
];

describe('ingredients slice', () => {
  it('returns initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('handles fetchIngredients pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-1', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchIngredients fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(ingredients, 'request-1', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(ingredients);
  });

  it('handles fetchIngredients rejected', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('failed'), 'request-1', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('failed');
  });
});
