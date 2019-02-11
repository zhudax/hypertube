import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Footer from './footer';

export const PublicRoute = ({ component: Component, isAuth, isVerified, ...rest }) => (
  <Route
    {...rest}
    render={props =>
			isAuth === true ? (
				isVerified === 1 ? (
					<Redirect to='/home' />
				) : (
					<div>
						<Layout style={{height: '100vh', overflow: 'auto'}}>
							<Layout.Content style={{minHeight: '700px', display: 'flex', alignContent: 'middle', justifyContent: 'center'}}>
								<Component {...props}/>
							</Layout.Content>
							<Layout.Footer>
								<Footer />
							</Layout.Footer>
						</Layout>
        	</div>
				)
			) : (
				<div>
					<Layout style={{height: '100vh', overflow: 'auto'}}>
						<Layout.Content style={{minHeight: '700px', display: 'flex', alignContent: 'middle', justifyContent: 'center'}}>
							<Component {...props}/>
						</Layout.Content>
						<Layout.Footer>
							<Footer />
						</Layout.Footer>
					</Layout>
				</div>
			)
		}
	/>
);
export default PublicRoute;