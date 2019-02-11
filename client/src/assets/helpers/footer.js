import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';

class Footer extends Component {

  render() {
    return (
					<Row type="flex" justify="space-around" align="middle">
						<Col>
							Created by bsiguret & zxu & nrandria & lezhang with <Icon type="heart" style={{color: 'red'}} theme="filled" />
						</Col>
					</Row>
		)
  }
}

export default Footer;