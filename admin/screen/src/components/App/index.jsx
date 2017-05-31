import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import * as fromScreen from '../../ducks/screen';

class App extends Component {
  componentDidMount() {
    const { fetchScreen } = this.props;
    fetchScreen()
    .catch((error) => {
      if (process.env.NODE_ENV !== 'production'
        && error.name !== 'ServerException') {
        window.console.log(error);
      }
    });
  }
  render() {
    return (
      <div>Wow</div>
    );
  }
}
App.propTypes = {
  fetchScreen: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    fetchScreen: fromScreen.fetchScreen,
  },
)(App);
