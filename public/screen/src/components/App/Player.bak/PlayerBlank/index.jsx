import React, { Component, PropTypes } from 'react';

class PlayerBlank extends Component {
  componentDidMount() {
    const { done } = this.props;
    this.doneTimeout = window.setTimeout(done, 0);
  }
  componentWillUnmount() {
    window.clearTimeout(this.doneTimeout);
  }
  render() {
    return (
      <div />
    );
  }
}
PlayerBlank.propTypes = {
  done: PropTypes.func.isRequired,
};
export default PlayerBlank;
