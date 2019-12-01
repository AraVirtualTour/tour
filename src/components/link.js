import React from 'react'
import ReactPlayer from 'react-player'

import RequiredPoint from './requiredPoint'

export default class Link extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      url: ''
    }
  }

  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then((response) => this.setState({ url: response.match(/http.*/gm) }))
  }

  renderContent () {
    let url = this.state.url.toString()

    if (url.includes('youtube') || url.includes('youtu.be')) {
      let videoId = url.match(/v=.*/gm).toString()
      return <ReactPlayer url={`https://www.youtube.com/watch?${videoId}`} config={{ preload: true }} />
    } else {
      return <a href={this.state.url} target='_blank' rel='noopener noreferrer'>{this.props.text}</a>
    }
  }

  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint />
    }
  }

  render () {
    return (
      <div id={this.props.id} className='link requiredPointFlex'>
        {this.renderContent()}
        {this.renderRequired()}
      </div>
    )
  }
}
