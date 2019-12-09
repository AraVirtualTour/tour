import React, { Component } from 'react';
//import { gsap, Draggable, MotionPathPlugin } from "gsap/all";
import { Events, animateScroll as scroll } from 'react-scroll';
import ScrollMagic from 'scrollmagic';

import {
  LoadingScreen, FinishedDialog,
  Text, Image, Panorama, Link, Audio
} from './components';

import './css/tour.css';
import './css/components.css';


export default class Tour extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      loadText: 0,
      locationContent: [],
      loadedContent: [],
      wayfindingEnabled: false,
      reachedBottom: false
    };

    this.loadedItemsCount = 0;
    this.currentLocation = window.location.pathname.substring(1);
    this.currentScrollPoint = 0;
    this.scrollPoints = [];
    this.isAutoScrolling = false;
    this.timeOutReference = null;
    this.fullscreenScrollScenes = [];

    this.scrollController = new ScrollMagic.Controller();

    this.childReferences = [];
  }

  componentDidMount () {
    if (JSON.parse(window.sessionStorage.getItem('wayfindingEnabled'))) {
      this.setState({ wayfindingEnabled: JSON.parse(window.sessionStorage.getItem('wayfindingEnabled')) });
      console.log('DEBUG: Wayfinding on');
    }

    document.getElementById('contentContainer').style.display = 'none';

    fetch(`${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${this.currentLocation}.json`)
      .then(response => response.text())
      .then(text => this.setState({ locationContent: JSON.parse(text).content }, () => {
        this.generateContent();
      })
    );
    
    Events.scrollEvent.register('end', () => this.stopScroll());
    window.addEventListener('scroll', () => this.handleScroll());
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
          file['src'].includes('_pano')
            ? <Panorama ref={(ref) => { this.childReferences[parseInt(id)] = ref; return true; }} parent={this} key={id}
              id={id} required={isRequired} src={source} title={title} alt={title} />
            : <Image ref={(ref) => { this.childReferences[parseInt(id)] = ref; return true; }} parent={this} key={id}
              id={id} required={isRequired} src={source} title={title} alt={title} />
        );
      }

      if (file['src'].includes('txt')) {
        generatedContent.push(
          <Text ref={(ref) => { this.childReferences[parseInt(id)] = ref; return true; }} parent={this} key={id}
          id={id} required={isRequired} title={title} src={source} />
        );
      }

      if (file['src'].includes('url')) {
        generatedContent.push(
          <Link ref={(ref) => { this.childReferences[parseInt(id)] = ref; return true; }} parent={this} key={id}
          id={id} required={isRequired} title={title} src={source} />
        );
      }

      if (file['src'].includes('wav')) {
        let subtitleData = this.state.locationContent[parseInt(file['subtitleid']) - 1];
        let subtitleSrc = subtitleData
          ? `${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${subtitleData.src}`
          : null;

        generatedContent.push(
          <Audio ref={(ref) => { this.childReferences[parseInt(id)] = ref; return true; }} parent={this} key={`audio${id}`}
          id={id} required={isRequired} title={title} src={source} subtitleData={subtitleData} subtitleSrc={subtitleSrc} type='audio/wav' />
        );
      }
    }

    this.setState({ loadedContent: generatedContent });
  }

  loadElement () {
    this.loadedItemsCount += 1;

    this.setState({ loadText: `${(this.loadedItemsCount / this.state.loadedContent.length) * 100}%` }, () => {
      if (this.loadedItemsCount === this.state.loadedContent.length) {
        this.load();
      }
    });
  }

  load () {
    document.getElementById('contentContainer').style.display = 'block';
    this.setState({ loaded: true });

    for (let file of this.state.locationContent) {
      if (file.src.includes('vtt')) continue;

      let element = document.getElementById(`${file.id}`);
      let elementContainer = document.getElementById(`container${file.id}`);
      let scrollY = window.scrollY;

      if (file.required) {
        this.fullscreenScrollScenes.push(
          new ScrollMagic.Scene({ triggerElement: elementContainer, triggerHook: 0,
                                  duration: elementContainer.getBoundingClientRect().height })
            .setClassToggle(element, 'fullscreen')
            .addTo(this.scrollController)
            .on('enter', () => { this.childReferences[parseInt(file.id)].enter() })
            .on('leave', () => { this.childReferences[parseInt(file.id)].exit() })
        );
      }

      this.scrollPoints.push({ y: elementContainer.getBoundingClientRect().bottom + scrollY, time: file.time * 1000 });
    }

    let paddingHeight = document.getElementById('padding').style.height + window.innerHeight;
    document.getElementById('padding').style.height = `${paddingHeight}px`;      
    
    window.scrollBy(0, document.getElementById('root').getBoundingClientRect().top);
    this.startScroll();
  }

  handleScroll () {
    if (window.scrollY === document.getElementById('contentContainer').clientHeight &&
        this.state.loaded && !this.state.reachedBottom) {
      this.endLocationTour();
    }

    for (let scene of this.fullscreenScrollScenes) {
      if (this.isAutoScrolling) {
        scene.enabled(true);
      } else {
        var elements = document.getElementsByClassName('fullscreen');

        for (let element of elements) {
          element.classList.remove('fullscreen');
        }
        scene.enabled(false);
      }
    }

    if (!this.isAutoScrolling) {
      clearTimeout(this.timeOutReference);
      this.resumeScroll();
    }
  }

  startScroll () {
    let y = this.scrollPoints[this.currentScrollPoint].y;
    let time = this.scrollPoints[this.currentScrollPoint].time;
    
    this.isAutoScrolling = true;
    scroll.scrollTo(y, {
      duration: time !== 0 ? time : 10000,
      delay: 1000,
      smooth: 'linear',
      isDynamic: true
    });
  }

  stopScroll () {
    this.currentScrollPoint += 1;

    if (window.scrollY === document.getElementById('contentContainer').clientHeight) {
      this.endLocationTour();
    }
    
    if (window.scrollY === Math.ceil(this.scrollPoints[this.currentScrollPoint - 1].y)) {
      this.startScroll();
    } else {
      this.isAutoScrolling = false;
      this.resumeScroll();      
    }
  }

  resumeScroll () {
    this.timeOutReference = setTimeout(() => {
      let nextPointIndex = 0;
      let scrollPointLocations = [];

      for (let scrollPoint in this.scrollPoints) {
        scrollPointLocations.push(this.scrollPoints[scrollPoint].y);
      }

      let index = scrollPointLocations.length;
      while (scrollPointLocations[--index] > window.scrollY);
      nextPointIndex = ++index;

      this.currentScrollPoint = nextPointIndex;
      this.startScroll();
    }, 3000);
  }

  endLocationTour () {
    this.setState({ reachedBottom: true });    
    document.getElementById('padding').remove();
    this.scrollController = this.scrollController.destroy(true);
  }

  render () {
    return (
      <div id='tour'>
        {!this.state.loaded
          ? <LoadingScreen text={this.state.loadText
            ? this.state.loadText
            : null} />
          : null
        }
        <div key='contentContainer' id='contentContainer' className='content'>
          {!this.state.reachedBottom ? this.state.loadedContent
            : <FinishedDialog currentLocation={this.currentLocation} locationsData={this.props.locations} />
          }
        </div>
        <div id='padding' />
      </div>
    );
  }
}
