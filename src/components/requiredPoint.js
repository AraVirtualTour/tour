import React from 'react';


export default class RequiredPoint extends React.Component {
  render () {
    return (
      <div className='pointContainer'>
        <p id={`scrollPoint${this.props.id}`} name={`scrollPoint${this.props.id}`}>{'⯇'}</p>
      </div>
    );
  }
}
