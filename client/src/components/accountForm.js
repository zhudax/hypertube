import React, { Component } from 'react';
import { Form, Icon, Input, Button, Avatar, Select, message } from 'antd';
import { connect } from 'react-redux';

import PhotoUploader from './photoUploader';
import { userActions } from '../redux/actions/user';
import { authActions } from '../redux/actions/auth';

class AccountForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			err: {},
			user: {
				username: this.props.user.username ? this.props.user.username : '',
				email: this.props.user.email ? this.props.user.email : '',
				firstname: this.props.user.firstname ? this.props.user.firstname : '',
				lastname: this.props.user.lastname ? this.props.user.lastname : '',
				npassword: '',
				cpassword: '',
				language: this.props.user.language ? this.props.user.language : '',
				password: ''
			}
		}
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		if (!this.props.photo) {
			let res = await this.props.dispatch(userActions.update(this.state.user, this.props.user.profile))
			if (res.status !== 200) {
				if (res.status === 401) {
					message.error('Please log in, your session may have expired')
					this.props.dispatch(authActions.logout())
				}
				else if (res.status === 403) {
					this.setState({ err: res.data})
				}
			}
			else {
				this.setState({ err: {}, user: {...this.state.user, npassword: '', cpassword: '', password: ''}})
				message.success('Account successfully updated')
			}
		} else {
			let res = await this.props.dispatch(userActions.update(this.state.user, this.props.photo))
			if (res.status !== 200) {
				if (res.status === 401) {
					message.error('Please log in, your session may have expired')
					this.props.dispatch(authActions.logout())
				}
				else if (res.status === 403) {
					this.setState({ err: res.data})
				}
			}
			else {
				this.setState({ err: {}, user: {...this.state.user, npassword: '', cpassword: '', password: ''}})
				message.success('Account successfully updated')
			}
		}
	}
	
	handleChange = (e) => { this.setState({ user: {...this.state.user, [e.target.name] : e.target.value }}) }
	handleLanguage = (e) => { this.setState({ user: {...this.state.user, language: e }}) }

  render() {
		const { err } = this.state;
		const { user } = this.state;
    return (
			<Form onSubmit={this.handleSubmit} className="indexSignupForm">
				<div style={{display: 'flex', justifyContent: 'space-around'}}>
					<Avatar shape="square" size={105} src={this.props.user.profile} />
					<PhotoUploader dispatch={this.props.dispatch}/>
				</div>
				<Form.Item
					validateStatus={err.username ? 'error' : 'success'}
					help={err.username}
				>
					<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} name='username' value={user.username} onChange={this.handleChange.bind(this)}/>
				</Form.Item>
				{!this.props.user.oauth &&
				<Form.Item
					validateStatus={err.email ? 'error' : 'success'}
					help={err.email}
				>
					<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} name='email' type="email" value={user.email} onChange={this.handleChange.bind(this)}/>
				</Form.Item>}
				<Form.Item
					validateStatus={err.firstname ? 'error' : 'success'}
					help={err.firstname}
				>
					<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} name='firstname' value={user.firstname} onChange={this.handleChange.bind(this)}/>
				</Form.Item>

				<Form.Item
					validateStatus={err.lastname ? 'error' : 'success'}
					help={err.lastname}
				>
					<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} name='lastname' value={user.lastname} onChange={this.handleChange.bind(this)}/>
				</Form.Item>
				{!this.props.user.oauth &&
				<Form.Item
					validateStatus={err.npassword ? 'error' : 'success'}
					help={err.npassword}
				>
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} name='npassword' value={user.npassword} type="password" placeholder="New Password" onChange={this.handleChange.bind(this)}/>
				</Form.Item>}
				{!this.props.user.oauth &&
				<Form.Item
					validateStatus={err.cpassword ? 'error' : 'success'}
					help={err.cpassword}
				>
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} name='cpassword'value={user.cpassword}  type="password" placeholder="Confirm Password" onChange={this.handleChange.bind(this)}/>
				</Form.Item>}
				<Form.Item
					validateStatus={err.language ? 'error' : 'success'}
					help={err.language}
				>
					<Select defaultValue={user.language} onChange={this.handleLanguage}>
							<Select.Option value="english">english</Select.Option>
							<Select.Option value="french">french</Select.Option>
          </Select>
				</Form.Item>
				{!this.props.user.oauth &&
				<Form.Item
					validateStatus={err.password ? 'error' : 'success'}
					help={err.password}
				>
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} name='password' type="password" value={user.password} placeholder="Password" onChange={this.handleChange.bind(this)}/>
				</Form.Item>}
				<Form.Item>
					<Button block type="primary" htmlType="submit" className="signFormButton">
						Submit
					</Button>
				</Form.Item>
			</Form>
		)
  }
}

const mapStateToProps = state => ({
	user: state.userReducer.user,
	photo: state.userReducer.photo
});

export default connect(mapStateToProps)(Form.create()(AccountForm));