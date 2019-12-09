import React, { Component } from 'react';
import YTPlayer from 'yt-player';


export default class Link extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      url: ''
    };
  }

  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then(text => this.setState({ url: text.match(/http.*/gm) }));
  }

  renderContent () {
    let url = JSON.parse(JSON.stringify(this.state.url.toString()));

    if (url.includes('youtube') || url.includes('youtu.be')) {
      let videoId = url
        .match(/v=.*/gm)
        .toString()
        .replace('v=', '');
      let player = new YTPlayer(`#player${this.props.id}`, {
        width: '100%',
        height: '100%'
      });

      player.load(videoId);
      player.on('unstarted', () => { this.props.parent.loadElement() })
    } else {
      return (
        <a href={this.state.url} target='_blank' rel='noopener noreferrer'>
          {this.props.title}
        </a>
      );
    }
  }

  enter () {}

  exit () {}

  render () {
    return (
      <div id={`container${this.props.id}`} className='link'>
        <div id={this.props.id}>
          <div id={`player${this.props.id}`} />
          {this.renderContent()}
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
