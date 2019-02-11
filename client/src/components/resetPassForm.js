import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';

import { authActions } from '../redux/actions/auth';

class ResetPassForm extends Component {

	handleSubmit = (e) => {
		e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
				let res = await this.props.dispatch(authActions.resetPassEmail(values.email))
				if (res.status !== 200) {
					message.error(res.data)
				}
				else {
					message.success(res.data)
				}
      }
    });
  }

  render() {
		const { getFieldDecorator } = this.props.form;
    return (
			<div className='resetPassFormWrapper'>
				<Form onSubmit={this.handleSubmit} className="resetPassForm">
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
						<Button block type="primary" htmlType="submit" className="resetPassFormButton">
							Send me an e-mail
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
  }
}

export default connect()(Form.create()(ResetPassForm));