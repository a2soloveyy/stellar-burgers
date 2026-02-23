import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '@slices';
import {
  selectFeedOrders,
  selectIngredients,
  selectOrderDetails,
  selectProfileOrders
} from '@selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const orderNumber = Number(number);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const orderDetails = useSelector(selectOrderDetails);
  const ingredients = useSelector(selectIngredients);

  const orderData = useMemo(() => {
    const orderFromFeed = feedOrders.find(
      (item) => item.number === orderNumber
    );
    const orderFromProfile = profileOrders.find(
      (item) => item.number === orderNumber
    );
    return orderFromFeed || orderFromProfile || orderDetails;
  }, [feedOrders, profileOrders, orderDetails, orderNumber]);

  useEffect(() => {
    if (!orderData && Number.isFinite(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
