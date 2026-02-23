import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';
import { selectUser } from '@selectors';

export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} pathname={location.pathname} />;
};
