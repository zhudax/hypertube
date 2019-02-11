import React, { Component } from 'react';
import { Row, Col, Spin, message, Form, Icon, Input, Button } from 'antd';
import { connect } from 'react-redux';

import { authActions } from '../redux/actions/auth';
import { history } from '../assets/helpers/history';

class EmailValidationPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			err: {
				npassword: null
			}
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
				if (values.cpassword !== values.npassword)
					message.error('Passwords did not match')
				else {
					let res = await this.props.dispatch(authActions.resetPassToken2(this.props.match.params.username, this.props.match.params.token, values.npassword, values.cpassword))
					if (res.status !== 200 && !res.data.npassword)
						message.error(res.data)
					else if (res.status !== 200 && res.data.npassword)
						this.setState({err: res.data})
					else {
						message.success(res.data)
						history.push('/')
					}
				}
      }
    });
  }

	async componentDidMount() {
		let res = await this.props.dispatch(authActions.resetPassToken(this.props.match.params.username, this.props.match.params.token))
		if (res.status === 200) {
			message.success(res.data)
			this.setState({
				loading: false
			})
		}
		else {
			message.error(res.data)
			history.push('/')
		}
	}

  render() {
		const { loading, err } = this.state
		const { getFieldDecorator } = this.props.form;
    return (
				<Row type="flex" justify="space-around" align="middle" style={{height: '100vh', width:'100%'}}>
					{loading &&
					<Spin size='large' />}
					{!loading &&
					<Col span={8} style={{minWidth: '250px'}}>
						<div className='resetPassFormWrapper'>
							<Form onSubmit={this.handleSubmit} className="resetPassForm">
								<Form.Item
									validateStatus={err.npassword ? 'error' : 'success'}
									help={err.npassword}
								>
									{getFieldDecorator('npassword', {
										rules: [{
											required: true, message: 'Please input your new password!',
										}],
									})(
										<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="New Password" />
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('cpassword', {
										rules: [{
											required: true, message: 'Please confirm your password!',
										}],
									})(
										<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm your password" />
									)}
								</Form.Item>
								<Form.Item>
									<Button block type="primary" htmlType="submit" className="resetPassFormButton">
										Reset my password
									</Button>
								</Form.Item>
							</Form>
						</div>
					</Col>}
				</Row>
		)
  }
}

export default connect()(Form.create()(EmailValidationPage));