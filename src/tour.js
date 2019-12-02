import React from 'react';
import Button from 'react-bootstrap/Button';
import { animateScroll as scroll } from 'react-scroll';

import './css/tour.css';
import './css/components.css';

import { Text, Image, Panorama, Link, Audio } from './components';

const backendHost = `http://${window.location.hostname}`;
const backendPort = '8080';


export default class Tour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: '',
      locationContent: [],
      locations: [],
      scrollDuration: 0,
      loaded: false
    };
  }

  componentDidMount () {
    this.setState({loaded: true});

    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text => this.setState({locations: JSON.parse(text).locations}));

    this.setState({currentLocation: window.location.search.substring(1)}, function () {
      if (this.state.currentLocation) {
        fetch(`${backendHost}:${backendPort}/content/${this.state.currentLocation}/${this.state.currentLocation}.json`)
          .then(response => response.text())
          .then(text => this.setState({locationContent: JSON.parse(text).content}, function () {
            let time = 0;

            for (let file of this.state.locationContent) {
              time += file.time;
            }

            this.setState({scrollDuration: time * 1000});
          })
        );
      }
    });

    window.addEventListener('scroll', () => console.log('scrolled'));
  }

  renderContent() {
    let renderedContent = [];

    if (!this.state.currentLocation) {
      for (let location of this.state.locations) {
        renderedContent.push(<a key='0' href={`/tour?${location.name}`}>{location.name}</a>);
      }

      return renderedContent;
    }

    for (let file of this.state.locationContent) {
      let id = file['id'];
      let source = `${backendHost}:${backendPort}/content/${this.state.currentLocation}/${file['src']}`;
      let title = file['title'];
      let isRequired = file['required'];

      if (file['src'].includes('jpg')) {
        renderedContent.push(file['src'].includes('_pano') ? <Panorama key={id} id={id} required={isRequired} src={source} title={title} alt={title} /> :
                                                             <Image key={id} id={id} required={isRequired} src={source} title={title} alt={title} />);
      }

      if (file['src'].includes('txt')) {
        renderedContent.push(<Text key={id} id={id} required={isRequired} title={title} src={source} />);
      }
      
      if (file['src'].includes('url')) {
        renderedContent.push(<Link key={id} id={id} required={isRequired} title={title} src={source} />);
      }

      if (file['src'].includes('wav')) {
        renderedContent.push(<Audio key={id} id={id} required={isRequired} title={title} src={source} type='audio/wav' />);
      }
    }
    
    return renderedContent;
  }

  getScrollPosition () {

  }
  
  render () {
    return (
      <div className='Tour'>
        <div className='content'>
          {this.state.loaded ? this.renderContent() : <p>Loading...</p>}
          {scroll.scrollToBottom({duration: this.state.scrollDuration, smooth: 'linear', isDynamic: true})}
        </div>
        {window.location.search.substring(1) ? <Button key='backToTop' variant='outline-secondary' className='button' onClick={() => scroll.scrollToTop({duration: 100})}>Back to Top</Button> : <div />}
      </div>
    );
  }
}
