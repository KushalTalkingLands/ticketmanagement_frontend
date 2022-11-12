import React from 'react'
import './header.css';

function Title(props) {
  return (
    <>
    <div className='Title-head'>
    <div className="Title">
      <h1>K-Car Services</h1>
        <div className="Title-Subtitle">one destination for servicing of all cars</div>
    </div>
    <div className='navbar'>
      <p className='navbar-text' hidden={props.state}>My Tickets</p>
      <p className='navbar-text'>Sign-out</p>
    </div>
    </div>
    </>
  )
}

export default Title