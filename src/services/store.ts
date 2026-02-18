import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  constructorReducer,
  ingredientsReducer,
  feedReducer,
  profileOrdersReducer,
  userReducer,
  orderDetailsReducer
} from '@slices';

const store = configureStore({
  reducer: {
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    feed: feedReducer,
    profileOrders: profileOrdersReducer,
    user: userReducer,
    orderDetails: orderDetailsReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
