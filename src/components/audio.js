import React from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'wavesurfer.js';

import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import 'videojs-wavesurfer/dist/videojs.wavesurfer.js';


export default class Audio extends React.Component {
  constructor (props) {
    super(props);

    this.textTracks = [{
      kind: 'subtitles',
      srclang: 'en',
      label: 'English',
      src: this.props.subtitleSrc,
      mode: 'showing',
      default: true
    }];

    this.options = {
      controls: true,
      fluid: true,
      loop: false,
      plugins: {
        wavesurfer: {
          src: this.props.src,
          msDisplayMax: 10,
          debug: false,
          waveColor: '#086280',
          progressColor: 'black',
          cursorColor: 'black',
          hideScrollbar: true
        }
      },
      controlBar: {
        fullscreenToggle: false
      }
    };

    if (this.props.subtitleSrc) this.options.tracks = this.textTracks;
  }

  componentDidMount () {
    this.player = videojs(`audio${this.props.id}`, this.options);

    this.player.on('waveReady', () => {this.props.parent.onLoad()});
  }

  componentWillUnmount () {
    if (this.player) {
      this.player.dispose();
    }
  }

  render () {
    return (
      <div id={this.props.id} className='audio content'>
        {this.props.title ? <h1>{this.props.title}</h1> : null}
        <div data-vjs-player>
          <audio id={`audio${this.props.id}`} ref={node => this.audioNode = node} src={this.props.src} type={this.props.type} className='audio video-js vjs-default-skin' />
        </div>
      </div>
    );
  }
}
