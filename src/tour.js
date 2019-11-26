import React from 'react';
import contentLoader from './content'

class Text extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return <p>{}</p>
  }
}

class Tour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: []
    }
  }

  componentDidMount() {
    const content = contentLoader();
    this.setState({content});
  }
  
  render () {
    console.log(this.state.content);
    return (
      <div className="Tour">
        <Text />
      </div>
    );
  }
}
export default Tour;
