import { FC } from 'react';
import { ConstructorPageUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { selectIngredientsLoading } from '@selectors';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
