import React from 'react';
import Button from 'react-bootstrap/Button';
import './landingPage.css';

class LandingPage extends React.Component {
  render () {
    return (
      <div className="LandingPage">
        <div className="tour">
          <Button variant="outline-primary" className="button" href="/tour">Tour</Button>
          <Button variant="outline-primary" className="button" href="/wayfinding">Wayfinding</Button>
        </div>
        <Button variant="outline-primary" className="button">Game</Button>
      </div>
    );
  }
}
export default LandingPage;
