import React from "react";
import Button from "react-bootstrap/Button";
import { Events, animateScroll as scroll } from "react-scroll";

import {
  LoadingScreen,
  Text,
  Image,
  Panorama,
  Link,
  Audio
} from "./components";

import "./css/tour.css";
import "./css/components.css";

const backendHost = `http://${window.location.hostname}`;
const backendPort = "8080";

export default class Tour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      currentLocation: "",
      locationContent: [],
      locations: [],
      loadedContent: [],
      currentScrollPoint: 0
    };

    this.scrollPoints = [];
  }

  componentDidMount() {
    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text =>
        this.setState({ locations: JSON.parse(text).locations }, () => {
          let currentLocation = window.location.search.substring(1);

          for (let location of this.state.locations) {
            if (location.name === currentLocation) {
              break;
            } else if (location.default) {
              currentLocation = location.name;
              window.location.search = `${currentLocation}`;
              break;
            }
          }

          this.setState({ currentLocation: currentLocation }, () => {
            document.getElementById("contentContainer").style.display = "none";

            fetch(
              `${backendHost}:${backendPort}/content/${this.state.currentLocation}/${this.state.currentLocation}.json`
            )
              .then(response => response.text())
              .then(text =>
                this.setState(
                  { locationContent: JSON.parse(text).content },
                  () => {
                    this.generateContent();
                  }
                )
              );
          });
        })
      );

    Events.scrollEvent.register("end", () => this.stopScroll());
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("end");
  }

  generateContent() {
    let generatedContent = [];

    for (let file of this.state.locationContent) {
      let id = file["id"];
      let source = `${backendHost}:${backendPort}/content/${this.state.currentLocation}/${file["src"]}`;
      let title = file["title"];
      let isRequired = file["required"];

      if (file["src"].includes("jpg")) {
        generatedContent.push(
          file["src"].includes("_pano") ? (
            <Panorama
              key={id}
              id={id}
              required={isRequired}
              src={source}
              title={title}
              alt={title}
            />
          ) : (
            <Image
              key={id}
              id={id}
              required={isRequired}
              src={source}
              title={title}
              alt={title}
            />
          )
        );
      }

      if (file["src"].includes("txt")) {
        generatedContent.push(
          <Text
            key={id}
            id={id}
            required={isRequired}
            title={title}
            src={source}
          />
        );
      }

      if (file["src"].includes("url")) {
        generatedContent.push(
          <Link
            parent={this}
            key={id}
            id={id}
            required={isRequired}
            title={title}
            src={source}
          />
        );
      }

      if (file["src"].includes("wav")) {
        if (file["subtitleid"]) {
          let subtitleData = this.state.locationContent[
            parseInt(file["subtitleid"]) - 1
          ];

          generatedContent.push(
            <Audio
              key={`audio${id}`}
              id={id}
              required={isRequired}
              title={title}
              src={source}
              subtitleData={subtitleData}
              type="audio/wav"
            />
          );
        } else {
          generatedContent.push(
            <Audio
              key={id}
              id={id}
              required={isRequired}
              title={title}
              src={source}
              type="audio/wav"
            />
          );
        }
      }
    }

    this.setState({ loadedContent: generatedContent });
  }

  onLoad() {
    if (!this.state.loaded) {
      document.getElementById("contentContainer").style.display = "block";
      this.setState({ loaded: true });

      for (let file of this.state.locationContent) {
        if (file.src.includes("ass")) {
          continue;
        }

        let element = document.getElementById(file.id);
        let scrollY = window.scrollY;

        this.scrollPoints.push({
          y: element.getBoundingClientRect().bottom + scrollY,
          time: file.time * 1000
        });
      }

      let paddingHeight =
        document.getElementById("padding").style.height + window.innerHeight;
      document.getElementById("padding").style.height = `${paddingHeight}px`;

      window.scrollTo(0, 0);
      this.startScroll();
    }
  }

  fullScreenContent() {
    document.getElementById("001").requestFullscreen();
  }

  startScroll() {
    let y = this.scrollPoints[this.state.currentScrollPoint].y;
    let time = this.scrollPoints[this.state.currentScrollPoint].time;

    if (
      this.state.loadedContent[this.state.currentScrollPoint].props.required
    ) {
      document
        .getElementById(
          this.state.loadedContent[this.state.currentScrollPoint].props.id
        )
        .classList.add("fullscreen");

      setTimeout(
        () => {
          scroll.scrollTo(y, {
            duration: 0,
            smooth: "linear",
            isDynamic: true
          });
          this.stopScroll(true);
        },
        time !== 0 ? time : 10000
      );
    } else {
      scroll.scrollTo(y, {
        duration: time !== 0 ? time : 10000,
        delay: 1000,
        smooth: "linear",
        isDynamic: true
      });
    }
  }

  stopScroll(ignore = false) {
    if (
      this.state.loadedContent[this.state.currentScrollPoint].props.required
    ) {
      document
        .getElementById(
          this.state.loadedContent[this.state.currentScrollPoint].props.id
        )
        .classList.remove("fullscreen");
    }

    if (
      this.state.currentScrollPoint === this.scrollPoints.length - 1 ||
      ignore
    ) {
      return;
    }

    if (this.state.currentScrollPoint < this.scrollPoints.length) {
      this.setState(
        { currentScrollPoint: this.state.currentScrollPoint + 1 },
        () => {
          if (
            window.scrollY ===
            Math.round(this.scrollPoints[this.state.currentScrollPoint - 1].y)
          ) {
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

              this.setState({ currentScrollPoint: nextPointIndex }, () => {
                this.startScroll();
              });
            }, 3000);
          }
        }
      );
    }
  }

  render() {
    return (
      <div className="Tour">
        {!this.state.loaded ? <LoadingScreen /> : null}
        <div id="contentContainer" className="content">
          {this.state.loadedContent}
        </div>
        {this.state.loaded ? (
          <Button
            id="backToTop"
            variant="outline-secondary"
            className="button"
            onClick={() => scroll.scrollToTop({ duration: 100 })}
          >
            Back to Top
          </Button>
        ) : null}
        <div id="padding" />
      </div>
    );
  }
}
