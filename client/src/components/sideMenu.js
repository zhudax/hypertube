import React, { Component } from 'react';
import { Icon, Input, Menu, Layout, Slider, Select, message } from 'antd';
import { connect } from 'react-redux';
import { movieActions } from '../redux/actions/movie';
import { history } from '../assets/helpers/history';
import { authActions } from '../redux/actions/auth';

class SideMenu extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collapsed: false,
			searchInput: '',
			loading: false
		};
	}

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	}

	handleSearch = async (name) => {
		this.props.dispatch(
			movieActions.addFilter(
				name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				this.props.filter.order,
				0
			)
		)
		let resp = await this.props.dispatch(
			movieActions.getMovies(
				name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				this.props.filter.order,
				0
			)
		)
		if (resp.status !== 200) {
			this.handleLogout()
			message.error('Please log in, your session may have expired')
		}
	}

	handleSort = async (order) => {
		this.props.dispatch(
			movieActions.addFilter(
				this.props.filter.name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				order,
				0
			)
		)
		let resp = await this.props.dispatch(
			movieActions.getMovies(
				this.props.filter.name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				order,
				0
			)
		)
		if (resp.status !== 200) {
			this.handleLogout()
			message.error('Please log in, your session may have expired')
		}
	}

	handleYear = async (year) => {
		this.s1.blur()
		this.props.dispatch(
			movieActions.addFilter(
				this.props.filter.name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				year[0],
				year[1],
				this.props.filter.genres,
				this.props.filter.order,
				0
			)
		)
		let resp = await this.props.dispatch(
			movieActions.getMovies(
				this.props.filter.name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				year[0],
				year[1],
				this.props.filter.genres,
				this.props.filter.order,
				0
			)
		)
		if (resp.status !== 200) {
			this.handleLogout()
			message.error('Please log in, your session may have expired')
		}
	}

	handleRating = async (rating) => {
		this.s2.blur()
		this.props.dispatch(
			movieActions.addFilter(
				this.props.filter.name,
				rating[0],
				rating[1],
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				this.props.filter.order,
				0
			)
		)
		let resp = await this.props.dispatch(
			movieActions.getMovies(
				this.props.filter.name,
				rating[0],
				rating[1],
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				this.props.filter.order,
				0
			)
		)
		if (resp.status !== 200) {
			this.handleLogout()
			message.error('Please log in, your session may have expired')
		}
	}

	handleHome() {
		history.push('/home')
	}

	handleSettings() {
		history.push('/account')
	}

	handleLogout() {
		this.props.dispatch(authActions.logout())
	}

  render() {
		const { name, min_rating, max_rating, min_year, max_year, order } = this.props.filter
		const handleMenuMovies = async (genre) => {
			this.props.dispatch(movieActions.addFilter(name, min_rating, max_rating, min_year, max_year, genre, order))
			let resp = await this.props.dispatch(
				movieActions.getMovies(name, min_rating, max_rating, min_year, max_year, genre, order, 0)
			)
			if (resp.status !== 200) {
				this.handleLogout()
				message.error('Please log in, your session may have expired')
			}
		}
    return (
			<Layout.Sider
				className='side-menu'
				id='style-1'
				collapsible
				collapsed={this.state.collapsed}
				onCollapse={this.onCollapse}
			>
				
				{!this.state.collapsed &&
				<h1 style={{color: 'white', textAlign: 'center', cursor: 'pointer'}} onClick={this.handleHome}>HyperTube</h1>}
				{this.state.collapsed &&
				<h1 style={{color: 'white', textAlign: 'center', cursor: 'pointer'}} onClick={this.handleHome}>HT</h1>}
				{this.props.sideMenuFilter &&
				<Input.Search
					placeholder="search"
					onSearch={value => this.handleSearch(value)}
					autosize='true'
				/>}
				{this.props.sideMenuFilter &&
				<Select className='sort-button' defaultValue="rating" style={{ width: 120 }} onChange={this.handleSort}>
					<Select.Option value="title">Name</Select.Option>
					<Select.Option value="rating">Rating</Select.Option>
					<Select.Option value="year">Year</Select.Option>
				</Select>}
				{this.props.sideMenuFilter &&
				<div>
					<h4 style={{color: 'white', textAlign: 'center'}}>Year</h4>
					<Slider autoFocus={false} className='slider' range step={1} min ={1895} max={2019} defaultValue={[1895, 2019]} ref={(s1) => this.s1 = s1} onAfterChange={this.handleYear} />
					<h4 style={{color: 'white', textAlign: 'center'}}>Rating</h4>
					<Slider autoFocus={false} classname='slider' range step={0.1} max={10} defaultValue={[0, 10]} ref={(s2) => this.s2 = s2} onAfterChange={this.handleRating} />
				</div>}
				<Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
					{this.props.sideMenuFilter &&
					<Menu.SubMenu
						key="sub1"
						title={<span><Icon type="desktop" /><span>Movies</span></span>}
					>
						<Menu.Item key='0' onClick={() => handleMenuMovies('')}>
							<span>All</span>
						</Menu.Item>
						{this.props.genres &&
						this.props.genres.map(function(genre, i){
							return(
								<Menu.Item key={i+1} onClick={() => handleMenuMovies(genre.genre)}>
									<span>{genre.genre}</span>
								</Menu.Item>)
							})}
					</Menu.SubMenu>}
					<Menu.SubMenu
						key="sub2"
						title={<span><Icon type="user" /><span>Account</span></span>}
					>
						<Menu.Item key="16" onClick={this.handleSettings}>
							<Icon type="setting" />
							<span>Settings</span>
						</Menu.Item>
						<Menu.Item key="17" onClick={this.handleLogout.bind(this)}>
							<Icon type="logout" />
							<span>Logout</span>
						</Menu.Item>
					</Menu.SubMenu>
				</Menu>
			</Layout.Sider>
		)
  }
}

const mapStateToProps = state => ({
	genres: state.movieReducer.genres,
	filter: state.movieReducer.filter
});

export default  connect(mapStateToProps)(SideMenu);