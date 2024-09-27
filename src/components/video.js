import React, { Component } from 'react';
import YTPlayer from 'yt-player';

import '../css/components.css';


export default class Video extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.player = null;
  }

  componentDidMount () {
    let videoId = this.props.src
      .match(/v=.*/gm)
      .toString()
      .replace('v=', '');

    this.player = new YTPlayer(`#player${this.props.id}`, {
      width: '100%',
      height: '100%'
    });

    this.player.load(videoId);
    this.player.on('unstarted', () => this.props.parent.loadElement());
  }

  componentWillUnmount () {
    this.player.destroy();
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
    document.getElementById(this.props.id).classList.add('fullscreen');
  }

  onClose () {
    this.setState({ isOpen: false });
    document.getElementById(this.props.id).classList.remove('fullscreen');
  }

  render () {
    return (
      <div id={`container${this.props.id}`} className='video' onClick={() => this.toggleOpen()}>
        <div id={this.props.id}>
          <div id={`player${this.props.id}`} />
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
