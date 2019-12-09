import React, { Component } from 'react';
import YTPlayer from 'yt-player';

import '../css/components.css';


export default class Video extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  renderContent () {
    let videoId = this.props.src
      .match(/v=.*/gm)
      .toString()
      .replace('v=', '');

    setTimeout(() => {
      let player = new YTPlayer(`#player${this.props.id}`, {
        width: '100%',
        height: '100%'
      });

      player.load(videoId);
      player.on('unstarted', () => { this.props.parent.loadElement() })
    }, 5000);
  }

  toggleOpen () {
    if (this.state.isOpen) {
      this.onClose();
    } else {
      this.onOpen();
    }
  }

  onOpen () {
    this.setState({ isOpen: true });
  }

  onClose () {
    this.setState({ isOpen: false });
  }

  render () {
    return (
      <div id={`container${this.props.id}`} className='video'>
        <div id={this.props.id}>
          <div id={`player${this.props.id}`} />
          {this.renderContent()}
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
