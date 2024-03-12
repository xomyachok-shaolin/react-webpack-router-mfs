import React, { FC } from 'react';
import { RouteProps } from 'react-router';
import PrivateRoute from './privateRoute';

    // @ts-ignore
export interface WrapperRouteProps extends RouteProps {
  /** authorization？ */
  auth?: boolean;
}

    // @ts-ignore
const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, children }) => {

  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return <>{children}</>;
};

export default WrapperRouteComponent;
