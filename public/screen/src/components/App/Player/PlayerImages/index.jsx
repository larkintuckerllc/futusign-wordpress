import React, { Component, PropTypes } from 'react';

// TODO: WORK IN DURATION
class PlayerImages extends Component {
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
PlayerImages.propTypes = {
  done: PropTypes.func.isRequired,
};
export default PlayerImages;
