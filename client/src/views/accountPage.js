import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';

import AccountForm from '../components/accountForm';

class AccountPage extends Component {

  render() {
    return (
				<Row type="flex" justify="space-around" align="middle" style={{height: '100vh', minWidth: '240px', minHeight: '700px'}}>
					<Col span={8} style={{minWidth: '240px'}}>
						<div className='resetPassFormWrapper'>
							<AccountForm />
						</div>
					</Col>
				</Row>
		)
  }
}

export default connect()(AccountPage);