import React from 'react';


export default class Audio extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      audioElement: <audio key='audio' id={`audio${this.props.id}`} src={this.props.src} type={this.props.type} />
    };
  }

  start () {

  }

  stop () {

  }

  render () {
    return (
      <div id={this.props.id} className='audio'>
        {this.props.title ? [<h1 key='title'>{this.props.title}</h1>,
                            this.state.audioElement] :
                            this.state.audioElement}
      </div>
    );
  }
}
