import React, { Component } from 'react';
import { Row, Spin, message } from 'antd';
import { connect } from 'react-redux';

import { userActions } from '../redux/actions/user';
import { history } from '../assets/helpers/history';

class EmailValidationPage extends Component {

	async componentDidMount() {
		let res = await this.props.dispatch(userActions.verifEmail(this.props.match.params.username, this.props.match.params.token))
		if (res.status === 200)
			message.success(res.data)
		else
			message.error(res.data)
		history.push('/')
	}

  render() {
    return (
				<Row type="flex" justify="space-around" align="middle" style={{height: '100vh'}}>
					<Spin size='large' />
				</Row>
		)
  }
}

export default connect()(EmailValidationPage);