import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from '../actions/UserActions';
import App from '../components/App';

@connect(state => ({
  menuOpen: state.ui.menuOpen,
  search: state.search,
  auth: state.auth,
  events: state.events.items,
  loggedIn: state.auth.token !== null
}))
export default class AppContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.dispatch(loginAutomaticallyIfPossible());
  }

  render() {
    return <App {...this.props} />;
  }
}