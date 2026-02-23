import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '@slices';
import { selectAuthError, selectAuthRequest, selectUser } from '@selectors';

export const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const authRequest = useSelector(selectAuthRequest);
  const authError = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: { pathname?: string } })?.from
    ?.pathname;

  useEffect(() => {
    if (user) {
      navigate(from || '/', { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (authRequest) return;

    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={authError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
