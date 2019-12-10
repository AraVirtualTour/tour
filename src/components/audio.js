import React, { Component } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'wavesurfer.js';

import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import 'videojs-wavesurfer/dist/videojs.wavesurfer.js';

import '../css/components.css';


export default class Audio extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentDidMount () {
    let textTracks = [{
      kind: 'subtitles',
      srclang: 'en',
      label: 'English',
      src: this.props.subtitleSrc,
      mode: 'showing',
      default: true
    }];

    let options = {
      controls: true,
      autoplay: false,
      fluid: false,
      loop: false,
      plugins: {
        wavesurfer: {
          src: this.props.src,
          msDisplayMax: 10,
          debug: false,
          waveColor: "red",
          progressColor: "black",
          cursorColor: "black",
          hideScrollbar: true,
        }
      },
      controlBar: {
        fullscreenToggle: false
      }
    };
    if (this.props.subtitleSrc) options.tracks = textTracks;
    this.props.parent.loadElement();

    this.player = videojs(`audio${this.props.id}`, options);
    
    this.player.on('waveReady', () => this.props.parent.loadElement());
  }

  componentWillUnmount () {
    if (this.player) {
      this.player.dispose();
    }
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
    this.player.wavesurfer().play();
  }

  onClose () {
    this.setState({ isOpen: false });
    document.getElementById(this.props.id).classList.remove('fullscreen');
    this.player.wavesurfer().pause();
  }

  render () {
    return (
      <div id={`container${this.props.id}`} className='audio' onClick={() => this.toggleOpen()}>
        <div id={this.props.id}>
          {this.props.title
            ? <h1>{this.props.title}</h1>
            : null
          }
          <div data-vjs-player>
            <audio id={`audio${this.props.id}`} ref={node => this.audioNode = node} src={this.props.src} type={this.props.type} className='audio video-js vjs-default-skin' />
          </div>
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
