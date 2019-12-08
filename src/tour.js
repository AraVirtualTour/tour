import React from 'react';
//import { gsap, Draggable, MotionPathPlugin } from "gsap/all";
import { Events, animateScroll as scroll } from 'react-scroll';
import ScrollMagic from 'scrollmagic';

import {
  LoadingScreen,
  Text,
  Image,
  Panorama,
  Link,
  Audio,
  FinishedWindow
} from './components';

import './css/tour.css';
import './css/components.css';


export default class Tour extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      locationContent: [],
      loadedContent: [],
      wayfindingEnabled: false,
      reachedBottom: false
    };

    this.currentLocation = window.location.pathname.substring(1);
    this.currentScrollPoint = 0;
    this.scrollPoints = [];

    this.scrollController = new ScrollMagic.Controller();
  }

  componentDidMount () {
    if (JSON.parse(window.sessionStorage.getItem('wayfindingEnabled'))) {
      this.setState({ wayfindingEnabled: JSON.parse(window.sessionStorage.getItem('wayfindingEnabled')) });
      console.log('Wayfinding on');
    }

    document.getElementById('contentContainer').style.display = 'none';

    fetch(`${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${this.currentLocation}.json`)
      .then(response => response.text())
      .then(text => this.setState({ locationContent: JSON.parse(text).content }, () => {
        this.generateContent();
      })
    );
    
    Events.scrollEvent.register('end', () => this.stopScroll());
  }

  componentWillUnmount () {
    Events.scrollEvent.remove('end');
  }

  generateContent () {
    let generatedContent = [];

    generatedContent.push(<h1 key='locationHeader'>{this.currentLocation}</h1>);

    for (let file of this.state.locationContent) {
      let id = file['id'];
      let source = `${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${file['src']}`;
      let title = file['title'];
      let isRequired = file['required'];        

      if (file['src'].includes('jpg')) {
        generatedContent.push(
          file['src'].includes('_pano') ? (
            <Panorama key={id} id={id} required={isRequired} src={source} title={title} alt={title} />
          ) : (
            <Image key={id} id={id} required={isRequired} src={source} title={title} alt={title} />
          )
        );
      }

      if (file['src'].includes('txt')) {
        generatedContent.push(
          <Text key={id} id={id} required={isRequired} title={title} src={source} />
        );
      }

      if (file['src'].includes('url')) {
        generatedContent.push(
          <Link key={id} id={id} required={isRequired} title={title} src={source} />
        );
      }

      if (file['src'].includes('wav')) {
        if (file['subtitleid']) {
          let subtitleData = this.state.locationContent[parseInt(file['subtitleid']) - 1];
          let subtitleSrc = `${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${subtitleData.src}`;

          generatedContent.push(
            <Audio parent={this} key={`audio${id}`} id={id} required={isRequired} title={title} src={source} subtitleData={subtitleData} subtitleSrc={subtitleSrc} type='audio/wav' />
          );
        } else {
          generatedContent.push(
            <Audio parent={this} key={id} id={id} required={isRequired} title={title} src={source} type='audio/wav' />
          );
        }
      }
    }

    this.setState({ loadedContent: generatedContent });
  }

  onLoad () {
    if (!this.state.loaded) {
      document.getElementById('contentContainer').style.display = 'block';
      this.setState({ loaded: true });

      for (let file of this.state.locationContent) {
        if (file.src.includes('vtt')) continue;

        let element = document.getElementById(file.id);
        let scrollY = window.scrollY;

        if (file.required) {
          new ScrollMagic.Scene({ triggerElement: element, triggerHook: 0, duration: element.getBoundingClientRect().height })
            .setClassToggle(element, 'fullscreen')
            .addTo(this.scrollController)
            .on('enter', () => { this.handleEnterAction('enter') })
            .on('leave', () => { this.handleExitAction('exit') });
        }

        this.scrollPoints.push({ y: element.getBoundingClientRect().bottom + scrollY, time: file.time * 1000 });
      }

      let paddingHeight = document.getElementById('padding').style.height + window.innerHeight;
      document.getElementById('padding').style.height = `${paddingHeight}px`;      
      
      window.scrollBy(0, document.getElementById('root').getBoundingClientRect().top);
      this.startScroll();
    }
  }

  handleEnterAction (element) {
    console.log(element);
  }

  handleExitAction (element) {
    console.log(element);
  }

  startScroll () {
    let y = this.scrollPoints[this.currentScrollPoint].y;
    let time = this.scrollPoints[this.currentScrollPoint].time;
    
    scroll.scrollTo(y, {
      duration: 1000,//time !== 0 ? time : 10000,
      delay: 1000,
      smooth: 'linear',
      isDynamic: true
    });
  }

  stopScroll () {
    if (this.currentScrollPoint === this.scrollPoints.length - 1) {
      this.setState({ reachedBottom: true });    
      document.getElementById('padding').remove();
      this.scrollController = this.scrollController.destroy(true);
      return;
    }

    if (this.currentScrollPoint < this.scrollPoints.length) {
      this.currentScrollPoint += 1;
      
      if (window.scrollY === Math.round(this.scrollPoints[this.currentScrollPoint - 1].y)) {
        this.startScroll();
      } else {
        setTimeout(() => {
          let nextPointIndex = 0;
          let scrollPointLocations = [];

          for (let scrollPoint in this.scrollPoints) {
            scrollPointLocations.push(this.scrollPoints[scrollPoint].y);
          }

          let i = scrollPointLocations.length;
          while (scrollPointLocations[--i] > window.scrollY);
          nextPointIndex = ++i;

          this.currentScrollPoint = nextPointIndex;
          this.startScroll();
        }, 3000);
      }
    }
  }

  render () {
    return (
      <div id='tour'>
        {!this.state.loaded ? <LoadingScreen /> : null}
        <div key='contentContainer' id='contentContainer' className='content'>
          {!this.state.reachedBottom ? this.state.loadedContent : <FinishedWindow locationsData={this.props.locations} reachedBottom={this.state.reachedBottom} />}
        </div>
        <div id='padding' />
      </div>
    );
  }
}
