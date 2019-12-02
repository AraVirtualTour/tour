import React from 'react';
import YTPlayer from 'yt-player';

import RequiredPoint from './requiredPoint';


export default class Link extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      url: ''
    };
  }

  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then((response) => this.setState({ url: response.match(/http.*/gm) }));
  }

  renderContent () {
    let url = JSON.parse(JSON.stringify(this.state.url.toString()));

    if (url.includes('youtube') || url.includes('youtu.be')) {
      let videoId = url.match(/v=.*/gm).toString().replace('v=', '');
      let player = new YTPlayer(`#player${this.props.id}`, {width: '100%', height: '100%'});

      player.load(videoId);
    } else {
      return <a href={this.state.url} target='_blank' rel='noopener noreferrer'>{this.props.title}</a>;
    }
  }

  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint />;
    }
  }

  render () {
    return (
      <div id={this.props.id} className='link requiredPointFlex'>
        <div id={`player${this.props.id}`} />
        {this.renderContent()}
        {this.renderRequired()}
      </div>
    );
  }
}
