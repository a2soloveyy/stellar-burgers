import { RootState } from '../store';

export const selectConstructorItems = (state: RootState) => ({
  bun: state.burgerConstructor.bun,
  ingredients: state.burgerConstructor.ingredients
});
export const selectConstructorOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectConstructorOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedMeta = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectAuthRequest = (state: RootState) => state.user.authRequest;
export const selectAuthError = (state: RootState) => state.user.authError;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.order;
