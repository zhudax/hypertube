import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { Spin, message } from 'antd';
import '../assets/css/home.scss'

import { movieActions } from '../redux/actions/movie';
import { authActions } from '../redux/actions/auth';

import Movies from '../components/movies'

class HomePage extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			page: 1,
		}
	}
	
	handleInfiniteOnLoad = async () => {
    this.setState({
      loading: true,
    });
		await this.props.dispatch(
			movieActions.getMoreMovies(
				this.props.filter.name,
				this.props.filter.min_rating,
				this.props.filter.max_rating,
				this.props.filter.min_year,
				this.props.filter.max_year,
				this.props.filter.genres,
				this.props.filter.order,
				this.state.page
			)
		)
		this.setState({
			loading: false,
			page: this.state.page + 1
    });
	}

	getAllGenre = async () => {
		let res = await this.props.dispatch(movieActions.getAllGenre())
		if (res.status !== 200) {
			this.props.dispatch(authActions.logout())
			message.error('Please log in, your session may have expired')
		}
    return;
  }

  initMovies = async () => {
		let res = await this.props.dispatch(movieActions.initMovies())
		if (res.status !== 200) {
			this.props.dispatch(authActions.logout())
			message.error('Please log in, your session may have expired')
		}
    return;
	}
	
	resetFilter = () => {
		this.props.dispatch(
			movieActions.addFilter(
				"",
				0,
				10,
				0,
				9999,
				this.props.filter.genres,
				"rating",
				0
			)
		)
  }

	componentWillMount = () => {
		this.getAllGenre();
		this.initMovies();
		this.resetFilter();
	}

  render() {
    return (
			<InfiniteScroll
				initialLoad={false}
				loadMore={this.handleInfiniteOnLoad}
				hasMore={!this.state.loading}
				useWindow={false}
				style={{height: '100%'}}
			>
				<div className='home-movies-container'>
					{this.props.movies &&
					<Movies movies={this.props.movies}/>}
					{this.state.loading && 
					<div className="loading-container">
						<Spin />
					</div>}
				</div>
			</InfiniteScroll>
		)
  }
}

const mapStateToProps = state => ({
	movies: state.movieReducer.movies,
	filter: state.movieReducer.filter
});

export default connect(mapStateToProps)(HomePage);