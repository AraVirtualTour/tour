import React from 'react';
import Button from 'react-bootstrap/Button';
import { Events, animateScroll as scroll } from 'react-scroll';

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
      loadedContent: [],
      scrollPoints: [],
      requiredContent: []   
    };
  }

  componentDidMount () {
    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text => this.setState({locations: JSON.parse(text).locations}));

    this.setState({currentLocation: window.location.search.substring(1)}, function () {
      if (this.state.currentLocation) {
        fetch(`${backendHost}:${backendPort}/content/${this.state.currentLocation}/${this.state.currentLocation}.json`)
          .then(response => response.text())
          .then(text => this.setState({locationContent: JSON.parse(text).content}, function () {
            let requiredContent = [];
            let scrollPoints = [];
            
            for (let file of this.state.locationContent) {
              if (file.required) {
                requiredContent.push(file);
              }
            }

            this.setState({requiredContent: requiredContent}, function () {
              for (let file of this.state.requiredContent) {
                console.log()
                console.log(document.getElementById(file.id).clientHeight)
              }
            });

            this.renderContent();
          })
        );
      }
    });

    Events.scrollEvent.register('begin',  function (to, element) {
      console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function (to, element) {
      console.log('end', arguments);
    });

    window.addEventListener('scroll', () => this.scrollUpdate());
  }

  componentWillUnmount () {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
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

      if (file['src'.includes('')])
    }
    
    this.setState({loadedContent: renderedContent});
  }

  scrollUpdate () {
    console.log('scrolled');
  }

  getOffset (element) {
    let rect = element.getBoundingClientRect();

    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }
  
  render () {
    return (
      <div className='Tour'>
        <div id='contentContainer' className='content'>
          {this.state.loadedContent.length > 0 ? this.state.loadedContent : <p>Loading..</p>}      
        </div>
        {window.location.search.substring(1) ? <Button key='backToTop' variant='outline-secondary' className='button' onClick={() => scroll.scrollToTop({duration: 100})}>Back to Top</Button> : <div />}
      </div>
    );
  }
}
