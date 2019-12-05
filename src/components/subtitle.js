import React from 'react';


export default class Subtitle extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: [],
      audioElement: null
    };
  }

  componentDidMount () {
    fetch(this.props.src)
    .then(response => response.text())
    .then(text => this.setState({data: text.split('\n')}, () => {
      for (let line of this.state.data) {
        if (line.includes('Audio File:')) {
          console.log(line);
        }

        if (line.includes('Dialogue:')) {
          console.log(line);
        }
      }
    }));
  }

  render () {
    return (
      <div id={this.props.id} className='subtitle'>
        <p>{this.props.src}</p>
      </div>
    );
  }
}
