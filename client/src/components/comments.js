import React, { Component } from 'react';
import { List, Avatar } from 'antd';

import { history } from '../assets/helpers/history'

class Comments extends Component {

	handleVisit(id) {
		history.push(`/user/${id}`)
	}

  render() {
		const Comments = ({comments}) => (
			<>
				{comments.map((comment, key) => (
					<List.Item
						key={key}
					>
						<List.Item.Meta
							avatar={<Avatar src={comment.profile} />}
							title={`${comment.username}`}
							description={comment.date}
							style={{cursor: 'pointer'}}
							onClick={() => {this.handleVisit(comment.uid)}}
						/>
						<div style={{wordBreak: 'break-all'}}>
							{comment.comment}
						</div>
					</List.Item>
				))}
			</>
		);
    return (
			<List className='comments' itemLayout="vertical">
				<Comments comments={this.props.comments}/>
			</List>
		)
  }
}

export default Comments;