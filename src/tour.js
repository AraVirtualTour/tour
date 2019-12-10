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
      percentLoaded: 0,
      locationContent: [],
      loadedContent: [],
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

    fetch(`${this.props.backendHost}:${this.props.backendPort}/content/${this.currentLocation}/${this.currentLocation}.json`)
      .then(response => response.text())
      .then(text => this.setState({ locationContent: JSON.parse(text).content }, () => this.generateContent())
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
          file['src'].includes('_pano') || file['src'].includes('_panorama') 
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

    this.setState({ percentLoaded: `${Math.ceil((this.loadedItemsCount / this.state.loadedContent.length) * 100)}%` }, () => {
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
            .addTo(this.scrollController)
            .on('enter', () => this.handleOpenElement(file))
            .on('leave', () => this.handleCloseElement(file))
        );
      }
      
      this.scrollPoints.push({ y: elementContainer.getBoundingClientRect().bottom, time: file.time * 1000 });
    }
    this.start();
  }

  start () {
    this.currentScrollPoint = 0;
    this.setState({ reachedBottom: false });
    this.isAutoScrolling = true;
    window.scrollBy(0, document.getElementById('root').getBoundingClientRect().top);
    this.startScroll();
  }

  handleOpenElement (element) {
    if (this.isAutoScrolling) {
      this.childReferences[parseInt(element.id)].onOpen()    
      console.log(element.id, 'opened');
    }
  }

  handleCloseElement (element) {
    if (this.isAutoScrolling) {
      this.childReferences[parseInt(element.id)].onClose()
      console.log(element.id, 'closed');
    }
  }

  handleScroll () {
    for (let scene of this.fullscreenScrollScenes) {
      if (this.isAutoScrolling) {
        scene.enabled(true);
      } else {
        for (let element of document.getElementsByClassName('fullscreen')) {
          element.classList.remove('fullscreen');
        }

        for (let element of document.getElementsByClassName('rotate')) {
          element.classList.remove('rotate');
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
        duration: time !== 0 ? time : 10000,
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
      this.isAutoScrolling = false;

      for (let scene of this.fullscreenScrollScenes) {
        scene.enabled(false);
      }

      for (let element of document.getElementsByClassName('fullscreen')) {
        element.classList.remove('fullscreen');
      }

      for (let element of document.getElementsByClassName('rotate')) {
        element.classList.remove('rotate');
      }

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
          ? <LoadingScreen percentLoaded={this.state.percentLoaded
            ? this.state.percentLoaded
            : null} />
          : null
        }
        <div id='contentContainer'>
          <h1 key='locationHeader'>{this.currentLocation}</h1>
          {this.state.loadedContent}
        </div>
        <TourFooter parent={this} currentLocation={this.currentLocation} />
      </div>
    );
  }
}
