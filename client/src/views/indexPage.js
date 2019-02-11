import React, { Component } from 'react';
import { Row, Col, Icon, Divider, Button, Avatar, message } from 'antd';

import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import SignForm from '../components/signForm';
import LoginForm from '../components/loginForm';

import '../assets/css/index.scss'

class IndexPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			login: true,
		}
	}

	handleChange = () => this.setState({ login: !this.state.login })

	componentWillMount = () => {
		if (Cookies.get('err')) {
      message.error(Cookies.get('err'))
    }
	}

  render() {
		const { login } = this.state
    return (
			<Row style={{height: '100vh', margintop: '15px', display: 'flex', alignItems: 'center'}}>
				{!login &&
				<Col span={8} style={{minWidth: '250px'}}>
					<SignForm/>
					<Divider>Or</Divider>
					<Button block type="primary" onClick={this.handleChange.bind(this)}>Log in</Button>
				</Col>}
				{login &&
				<Col span={8} style={{minWidth: '250px'}}>
					<LoginForm />
					<a href='/loginHelp' style={{position: 'relative', top: '-25px'}}>Need help?</a>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<Button shape="circle" type="primary" icon="google" href='http://localhost:3000/api/auth/google' style={{backgroundColor: 'red', borderColor: 'red'}}/>
						<Button shape="circle" type="primary" href='http://localhost:3000/api/auth/github' style={{backgroundColor: 'black', borderColor: 'black'}}>
							<Icon type="github" theme="filled" />
						</Button>
						<Button shape="circle" href='http://localhost:3000/api/auth/42' type="primary" style={{backgroundColor: 'black', borderColor: 'black'}}>
							<Avatar src="/img/42.png" />
						</Button>
					</div>
					<Divider>Or</Divider>
					<Button block type="primary" onClick={this.handleChange.bind(this)}>Sign Up</Button>
				</Col>}
			</Row>
		)
  }
}

export default connect()(IndexPage);