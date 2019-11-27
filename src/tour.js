import React from 'react';
import locationContentLoader from './content';

import './css/tour.css';

const content = require.context('./content/', true);


class Text extends React.Component {
  render () {
    return <p>{this.props.text}</p>;
  }
}

class Image extends React.Component {
  render () {
    return <img src={this.props.src} alt={this.props.alt} />;
  }
}

class Panorama extends React.Component {
  render () {
    return <img src={this.props.src} alt={this.props.alt} />;
  }
}

class Link extends React.Component {
  render () {
    return <a href={this.props.destination}>{this.props.text}</a>;
  }
}

class Audio extends React.Component {
  render () {
    return <audio src={this.props.src} type={this.props.type} controls />;
  }
}

function getQueryVariable(variable)
{
  let query = window.location.search.substring(1);
  let vars = query.split("&");

  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if(pair[0] === variable) {
      return pair[1];
    }
  }
  
  return(false);
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
    let location = getQueryVariable('location');
    let locationContent = locationContentLoader();

    this.setState({location, locationContent});
  }

  renderContent() {
    let result = [];

    for (let index in this.state.locationContent) {
      let file = this.state.locationContent[index];
      let source = `./${this.state.location}/${file['src']}`;

      if (file['src'].includes('jpg')) {
        result.push(file['src'].includes('_pano') ? <Panorama key={file['id']} src={content(source)} alt={file['title']} /> :
                                                    <Image key={file['id']} src={content(source)} alt={file['title']} />);
      }

      if (file['src'].includes('txt')) {
        result.push(<Text key={file['id']} text={file['title']} />);
      }

      if (file['src'].includes('link')) {
        result.push(<Link key={file['id']} destination='#' text={file['title']} />);
      }

      if (file['src'].includes('wav')) {
        result.push(<Audio key={file['id']} src={content(source)} type='audio/wav' />);
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
