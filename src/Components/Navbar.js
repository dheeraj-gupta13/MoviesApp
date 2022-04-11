import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Navbar extends Component {
    render() {
        return (
            <div  style={{display:'flex', padding:'0.5rem', alignItems:'center', gap:'2rem'}} >
                <Link to="/" style={{textDecoration:"none"}}><h1>Movies App</h1></Link>
                <Link to="/favourites" style={{textDecoration:"none"}}><h2>Favourites</h2></Link>
            </div>
        )
    }
}
