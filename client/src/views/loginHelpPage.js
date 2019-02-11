import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import ResetPassForm from '../components/resetPassForm';

class LoginHelp extends Component {

  render() {
    return (
			<div style={{width: '100%'}}>
				<Row type="flex" justify="end" align="top" >
					<Col style={{margin: '3%'}}>
						<Button block type="primary" href='/'>Log In</Button>
					</Col>
				</Row>
				<Row type="flex" justify="space-around" align="middle" style={{height: '70vh'}} >
					<Col span={8} style={{minWidth: '240px'}}>
						<h1>Forgot your password ?</h1>
						<p>We will send you an email with instructions on how to reset your password.</p>
						<ResetPassForm />
					</Col>
				</Row>
			</div>
		)
  }
}

export default LoginHelp;