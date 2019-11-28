import React from 'react';
import Button from 'react-bootstrap/Button';
import locationContentLoader from './content';

import './css/tour.css';

const content = require.context('./content/', true);


class Text extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <h1>{this.props.title}</h1>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

class Image extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <img src={this.props.src} alt={this.props.alt} />
      </div>
    );
  }
}

class Panorama extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <img src={this.props.src} alt={this.props.alt} />
      </div>
    );
  }
}

class Link extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <a href={this.props.src} target='_blank' rel="noopener noreferrer">{this.props.text}</a>
      </div>
    );
  }
}

class Audio extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <audio src={this.props.src} type={this.props.type} controls />
      </div>
    );
  }
}


class Tour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: '',
      locationContent: []
    }
  }

  componentDidMount() {
    let location = this.getQueryVariable('location');
    let locationContent = locationContentLoader();

    this.setState({location, locationContent});
  }

  getQueryVariable(variableName) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");

    for (let index = 0; index < vars.length; index++) {
      let pair = vars[index].split("=");

      if (pair[0] === variableName) {
        return pair[1];
      }
    }

    return(false);
  }

  renderContent() {
    let result = [];

    if (!this.state.location) {
      return result;
    }

    for (let index in this.state.locationContent) {
      let file = this.state.locationContent[index];
      let source = `./${this.state.location}/${file['src']}`;

      if (file['src'].includes('jpg')) {
        result.push(file['src'].includes('_pano') ? <Panorama key={file['id']} id={file['id']} src={content(source)} alt={file['title']} /> :
                                                    <Image key={file['id']} id={file['id']} src={content(source)} alt={file['title']} />);
      }

      if (file['src'].includes('txt')) {
        result.push(<Text key={file['id']} id={file['id']} text={file['title']} />);
      }
      
      if (file['src'].includes('url')) {
        result.push(<Link key={file['id']} id={file['id']} src={source} text={file['title']} />);
      }

      if (file['src'].includes('wav')) {
        result.push(<Audio key={file['id']} id={file['id']} src={source} type='audio/wav' />);
      }
    }

    return result;
  }
  
  render () {
    console.log(this.state.locationContent);
    return (
      <div className='Tour'>
        {this.renderContent()}
      </div>
    );
  }
}
export default Tour;
