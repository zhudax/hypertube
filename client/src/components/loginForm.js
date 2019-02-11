import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';

import { userActions } from '../redux/actions/user';
import { authActions } from '../redux/actions/auth';

class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			resendmailButton: false,
			email: ''
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
				let res = await this.props.dispatch(authActions.login(values.email, values.password))
				if (res.status === 403) {
					message.error(res.data.msg)
					if (res.data.msg === 'Account not verified')
						this.setState({ resendmailButton: true, email: values.email })
				}
      }
    });
	}
	
	resendmailForm = async () => {
		let res = await this.props.dispatch(userActions.resendMail(this.state.email))
		if (res.status === 200)
			message.success(res.data)
		else
			message.error(res.data.error)
	}

  render() {
		const { getFieldDecorator } = this.props.form
		const { resendmailButton } = this.state
    return (
			<div className='indexLoginFormWrapper'>
				<Form onSubmit={this.handleSubmit} className="indexLoginForm">
					<div>
						<Form.Item>
							{getFieldDecorator('email', {
								rules: [{
									type: 'email', message: 'The input is not valid E-mail!',
								}, {
									required: true, message: 'Please input your E-mail!',
								}],
							})(
								<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: 'Please input your Password!' }],
							})(
								<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
							)}
						</Form.Item>
						<Form.Item>
							<Button block type="primary" htmlType="submit" className="loginFormButton">
								Log In
							</Button>
						</Form.Item>
					</div>
					{resendmailButton &&
					<Form.Item>
						<Button block type="primary" className="resendmailButton" onClick={this.resendmailForm} >
							Re-send e-mail verification	
						</Button>
					</Form.Item>}
				</Form>
			</div>
		)
  }
}

export default connect()(Form.create()(LoginForm));