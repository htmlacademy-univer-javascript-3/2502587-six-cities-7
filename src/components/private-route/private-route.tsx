import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import Spinner from '../spinner/spinner';
import { AppRoute } from '../../const';

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);

  if (authorizationStatus === 'UNKNOWN') {
    return <Spinner />;
  }

  return authorizationStatus === 'AUTH' ? children : <Navigate to={AppRoute.Login} />;
}

export default PrivateRoute;
