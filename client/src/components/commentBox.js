import React, { Component } from 'react';
import { Input, Button, message } from 'antd';
import { connect } from 'react-redux';

import { movieActions } from '../redux/actions/movie';
import { authActions } from '../redux/actions/auth';

class Comment extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comment: '',
		}
	}

	handleComment = async () => {
		if (this.state.comment.length >= 5 && this.state.comment.length < 1000) {
			this.setState({ comment: '' })
			let res = await this.props.dispatch(movieActions.postComment(this.props.id, this.state.comment));
			if (res.status !== 200) {
				this.props.dispatch(authActions.logout())
				message.error('Please log in, your session may have expired')
			}
		}
		else
			message.error('Comment must be between 5 and 1000 chars')
	}

	onEnterPress = (e) => {
		if(e.keyCode === 13 && e.shiftKey === false) {
			e.preventDefault();
			this.handleComment();
		}
	}

	handleChange = (e) => {
		if (e.target.value.length > 1000)
			message.error('max chars authorized is 1000')
		else
			this.setState({ [e.target.name]: e.target.value})
	}

  render() {
		const { comment } = this.state
    return (
			<div className='movie-comment'>
				<Input.TextArea
					name='comment'
					autosize={{minRows: 2, maxRows: 6}}
					value={comment}
					onChange={this.handleChange}
					onPressEnter={this.onEnterPress}
				/>
				<div className='comment-bts'>
					<Button type="primary" onClick={this.handleComment.bind(this)}>Send</Button>
				</div>
			</div>
		)
  }
}

export default connect()(Comment);