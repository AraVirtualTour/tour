import React from 'react';
import locationContentLoader from './content';
import Button from 'react-bootstrap/Button';
import { animateScroll as scroll } from 'react-scroll';
 

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
    };
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
      result.push(<a key='0' href='/tour?location=dummylocation'>dummylocation</a>);
      return result;
    }

    for (let index in this.state.locationContent) {
      let file = this.state.locationContent[index];
      let id = file['id'];
      let source = `./${this.state.location}/${file['src']}`;
      let title = file['title'];

      if (file['src'].includes('jpg')) {
        result.push(file['src'].includes('_pano') ? <Panorama key={id} id={id} src={content(source)} alt={title} /> :
                                                    <Image key={id} id={id} src={content(source)} alt={title} />);
      }

      if (file['src'].includes('txt')) {
        result.push(<Text key={id} id={id} text={title} />);
      }
      
      if (file['src'].includes('url')) {
        result.push(<Link key={id} id={id} src={source} text={title} />);
      }

      if (file['src'].includes('wav')) {
        result.push(<Audio key={id} id={id} src={source} type='audio/wav' />);
      }
    }

    return result;
  }
  
  render () {
    return (
      <div className='Tour'>
        {this.renderContent()}
        <Button name='bottom' variant='outline-secondary' className='button' onClick={() => window.scrollTo(0, 0)}>Back to Top</Button>
      </div>
    );
  }
}

export default Tour;
