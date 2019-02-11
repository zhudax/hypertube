import React, { Component } from 'react';
import { Card } from 'antd';

class VisitCard extends Component {

  render() {
		const { user } = this.props
    return (
			<Card
				hoverable
				style={{ width: '100%' }}
				cover={<img alt="example" src={user.profile} />}
			>
				<Card.Meta
					title={`${user.firstname.charAt(0).toUpperCase()+ user.firstname.slice(1)} "${user.username}" ${user.lastname.toUpperCase()}`}
					description={`language: ${user.language}`}
				/>
			</Card>
		)
  }
}

export default VisitCard;