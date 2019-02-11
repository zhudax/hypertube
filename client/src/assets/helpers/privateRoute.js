import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Layout} from 'antd';
import { connect } from 'react-redux';
import SideMenu from '../../components/sideMenu';

export const PrivateRoute = ({ component: Component, isAuth, isVerified, sideMenuFilter, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuth === true && isVerified === 1 ? (
        <div>
					<Layout style={{height: '100vh', overflow: 'auto'}}>
						<SideMenu sideMenuFilter={sideMenuFilter}/>
						<Layout.Content>
							<Component {...props}/>
						</Layout.Content>
					</Layout>
        </div>
      ) : (
        <Redirect to='/' />
      )
    }
  />
);
export default connect()(PrivateRoute);