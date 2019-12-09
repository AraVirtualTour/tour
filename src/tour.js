import React, { Component } from 'react';
//import { gsap, Draggable, MotionPathPlugin } from "gsap/all";
import { Events, animateScroll as scroll } from 'react-scroll';
import ScrollMagic from 'scrollmagic';

import {
  LoadingScreen, TourFooter,
  Text, Image, Panorama, Video, Audio
} from './components';

import './css/tour.css';


export default class Tour extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      loadText: 0,
      locationContent: [],
      loadedContent: [],
      isWayfindingEnabled: false,
      reachedBottom: false
    };

    this.loadedItemsCount = 0;
    this.currentLocation = window.location.pathname.substring(1);
    this.currentScrollPoint = 0;
    this.scrollPoints = [];
    this.isAutoScrolling = true;
    this.timeOutReference = null;
    this.fullscreenScrollScenes = [];

    this.scrollController = new ScrollMagic.Controller();

    this.childReferences = [];
  }

  componentDidMount () {
    window.sessionStorage.setItem('visited', 'false');
    document.getElementById('contentContainer').style.display = 'none';

    if (JSON.parse(window.sessionStorage.getItem('wayfindingEnabled'))) {
      this.setState({ isWayfindingEnabled: true });
      console.log('DEBUG: Wayfinding on');
    } else {
      this.setState({ isWayfindingEnabled: false });
    }

    fetch(`${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${this.currentLocation}.json`)
      .then(response => response.text())
      .then(text => this.setState({ locationContent: JSON.parse(text).content }, () => {
        this.generateContent();
      })
    );
    
    Events.scrollEvent.register('end', () => this.stopScroll());
    window.addEventListener('scroll', () => this.handleScroll(), false);
  }

  componentWillUnmount () {
    this.scrollController = this.scrollController.destroy(true);
    Events.scrollEvent.remove('end');
    window.removeEventListener('scroll', () => this.handleScroll(), false);
  }

  generateContent () {
    let generatedContent = [];

    for (let file of this.state.locationContent) {
      let id = file['id'];
      let source = file['src'].includes('http')
        ? file['src']
        : `${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${file['src']}`;
      let title = file['title'];
      let isRequired = file['required'];        

      if (file['src'].includes('jpg') || file['src'].includes('png')) {
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

      if (file['src'].includes('youtube') || file['src'].includes('youtu.be')) {
        generatedContent.push(
          <Video ref={(ref) => { this.childReferences[parseInt(id)] = ref; return true; }} parent={this} key={id}
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

    this.setState({ loadText: `${Math.ceil((this.loadedItemsCount / this.state.loadedContent.length) * 100)}%` }, () => {
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

      let elementContainer = document.getElementById(`container${file.id}`);
      if (file.required) {
        this.fullscreenScrollScenes.push(
          
          new ScrollMagic.Scene({ triggerElement: elementContainer, triggerHook: 0,
                                  duration: elementContainer.getBoundingClientRect().height })
            // .setClassToggle(element, 'fullscreen')
            .addTo(this.scrollController)
            .on('enter', () => { this.handleOpenElement(file) })
            .on('leave', () => {  this.handleCloseElement(file)})
        );
      }
      
      this.scrollPoints.push({ y: elementContainer.getBoundingClientRect().bottom, time: file.time * 1000 });
    }
    
    window.scrollBy(0, document.getElementById('root').getBoundingClientRect().top);
    this.startScroll();
  }

  handleOpenElement (element) {
    console.log(element.id)
    // if (element.required) {

    // }
    // this.childReferences[parseInt(element.id)].onOpen()
    console.log('opened');
  }

  handleCloseElement (element) {
    // this.childReferences[parseInt(elementId)].onClose()
    console.log('closed');
  }

  handleScroll () {
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

    if (!this.isAutoScrolling && !this.state.reachedBottom) {
      clearTimeout(this.timeOutReference);
      this.resumeScroll();
    }
  }

  startScroll () {
    if (!this.state.reachedBottom) {
      let y = this.scrollPoints[this.currentScrollPoint].y;
      let time = this.scrollPoints[this.currentScrollPoint].time;
      
      this.isAutoScrolling = true;
      scroll.scrollTo(y, {
        duration: 1000,//time !== 0 ? time : 10000,
        delay: 1000,
        smooth: 'linear',
        isDynamic: true
      });
    }
  }

  stopScroll () {
    this.currentScrollPoint += 1;

    if (window.scrollY + window.innerHeight === document.getElementById('tour').getBoundingClientRect().height) {
      this.setState({ reachedBottom: true });
      return;
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

  render () {
    return (
      <div id='tour'>
        {!this.state.loaded
          ? <LoadingScreen text={this.state.loadText
            ? this.state.loadText
            : null} />
          : null
        }
        <div id='contentContainer' className='content'>
          <h1 key='locationHeader'>{this.currentLocation}</h1>
          {this.state.loadedContent}
        </div>
        <TourFooter parent={this} currentLocation={this.currentLocation} />
      </div>
    );
  }
}
