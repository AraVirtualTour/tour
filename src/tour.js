import React from 'react';
import Button from 'react-bootstrap/Button';
import { Events, animateScroll as scroll } from 'react-scroll';

import { LoadingScreen, Text, Image,
  Panorama, Link, Audio, Subtitle
} from './components';

import './css/tour.css';
import './css/components.css';


const backendHost = `http://${window.location.hostname}`;
const backendPort = '8080';


export default class Tour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      currentLocation: '',
      locationContent: [],
      locations: [],
      loadedContent: [],
      currentScrollPoint: 0 
    };

    this.scrollPoints = [];
  }

  componentDidMount () {
    fetch(`${backendHost}:${backendPort}/content/locations.json`)
    .then(response => response.text())
    .then(text => this.setState({locations: JSON.parse(text).locations}, () => {
      this.setState({currentLocation: window.location.search.substring(1)}, () => {
        if (this.state.currentLocation) {
          document.getElementById('contentContainer').style.display = 'none';

          fetch(`${backendHost}:${backendPort}/content/${this.state.currentLocation}/${this.state.currentLocation}.json`)
          .then(response => response.text())
          .then(text => this.setState({locationContent: JSON.parse(text).content}, () => {
            this.generateContent();
          }));
        } else {
          this.generateContent();

          document.getElementById('contentContainer').style.display = 'block';
          this.setState({loaded: true});
        }
      });
    }));

    Events.scrollEvent.register('end', () => this.stopScroll());
  }

  componentWillUnmount () {
    Events.scrollEvent.remove('end');
  }

  generateContent() {
    let generatedContent = [];

    if (this.state.currentLocation) {
      for (let file of this.state.locationContent) {
        let id = file['id'];
        let source = `${backendHost}:${backendPort}/content/${this.state.currentLocation}/${file['src']}`;
        let title = file['title'];
        let isRequired = file['required'];
  
        if (file['src'].includes('jpg')) {
          generatedContent.push(file['src'].includes('_pano') ? <Panorama key={id} id={id} required={isRequired} src={source} title={title} alt={title} /> :
                                                               <Image key={id} id={id} required={isRequired} src={source} title={title} alt={title} />);
        }
  
        if (file['src'].includes('txt')) {
          generatedContent.push(<Text key={id} id={id} required={isRequired} title={title} src={source} />);
        }
        
        if (file['src'].includes('url')) {
          generatedContent.push(<Link parent={this} key={id} id={id} required={isRequired} title={title} src={source} />);
        }
  
        if (file['src'].includes('wav')) {
          generatedContent.push(<Audio key={id} id={id} required={isRequired} title={title} src={source} type='audio/wav' />);
        }
  
        if (file['src'].includes('ass')) {
          generatedContent.push(<Subtitle key={id} id={id} required={isRequired} title={title} src={source} />);
        }
      }
    } else {
      for (let location of this.state.locations) {
        generatedContent.push(<a key='0' href={`/tour?${location.name}`}>{location.name}</a>);
      }
    }

    this.setState({loadedContent: generatedContent});
  }

  onLoad () {
    if (!this.state.loaded) {
      document.getElementById('contentContainer').style.display = 'block';
      this.setState({loaded: true});

      for (let file of this.state.locationContent) {
        let element = document.getElementById(file.id);
        let scrollY = window.scrollY;
            
        this.scrollPoints.push({y: (element.getBoundingClientRect().bottom + scrollY), time: file.time * 1000});
      }

      window.scrollTo(0, 0);
      this.startScroll();
    }
  }

  startScroll (pointIndex = 0) {
    if (pointIndex) {
      this.setState({currentScrollPoint: pointIndex}, () => {

      });
    } else {
      let y = this.scrollPoints[this.state.currentScrollPoint].y;
      let time = this.scrollPoints[this.state.currentScrollPoint].time;
      
      scroll.scrollTo(y, {duration: time !== 0 ? time : 5000,
                          delay: 1000, smooth: 'linear', isDynamic: true})
      this.setState({currentScrollPoint: this.state.currentScrollPoint + 1})
    }
  }

  stopScroll () {
    if (this.state.currentScrollPoint < this.scrollPoints.length) {
      console.log('ended scroll');

      for (let scrollPoint of this.scrollPoints) {
        if (window.scrollY === Math.round(scrollPoint.y) || window.scrollY === Math.round(scrollPoint.y) + 1) {
          this.startScroll()
          break;
        } else {
          setTimeout(() => console.log('resume scrolling'), 3000);
          break;
        }
      }
    }
  }
  
  render () {
    return (
      <div className='Tour'>
        {!this.state.loaded ? <LoadingScreen /> : null}
        <div id='contentContainer' className='content'>
          {this.state.loadedContent}
        </div>
        {this.state.loaded ? <Button id='backToTop' variant='outline-secondary' className='button'
                              onClick={() => scroll.scrollToTop({duration: 100})}>Back to Top</Button> : null}
      </div>
    );
  }
}
