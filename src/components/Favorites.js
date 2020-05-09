import React, { useState, Component } from "react";
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faImdb  } from '@fortawesome/free-brands-svg-icons';
import '../../node_modules/@fortawesome/fontawesome-free/css/brands.css'
import contentData from "../utils/contentData";
import axios from 'axios';
import { v3, v4 } from "@leonardocabeza/the-movie-db";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Auth0Context } from "../react-auth0-spa";

// make filter by  setting state only of what  matches filter. then continue until >= 20 results.

import '../style.css'
import IMDBlogo from "../assets/IMDBlogo.png";
import tomato from "../assets/tomato.png";
import badTomato from "../assets/badTomato.png";
import goodTomato from "../assets/goodTomato.png";


import debounce from "lodash.debounce";


class Favorites extends Component {
  static contextType = Auth0Context


  constructor(props) {
    super(props);

    this.state = { 
      loaded: "fa fa-cog fa-spin fa-lg",
      loadedfin :"d-none",
      movieData: [],
      ratingData: [],
      ratingData2: [],
      userFavorites: [],
      pageNumber: 1,
      error: false,
      hasMore: true,
      isLoading: false,
      scrollHeight: 9999
    };

    this.handleClick = this.handleClick.bind(this);
    this.codeNode = React.createRef();
  // Binds our scroll event handler
    window.onscroll = debounce(() => {
      const {
        loadUsers,
        state: {
          error,
          isLoading,
          hasMore,
          scrollHeight,
          pageNumber
        },
      } = this;
      

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        > (scrollHeight - (220 + (pageNumber * (window.innerHeight / 100))))
      ) {
        this.setState({pageNumber: pageNumber + 1});
        this.getMovies(0)
      }
    }, 100);
  }

  

  handleClick (movID, e) {
    var compareState2 = this.state.movieData
    compareState2[e].fav = "fa fa-spinner fa-spin setGray";
    this.setState({movieData: compareState2});

    // e.target.className = ("fa fa-spinner fa-spin setGray")
    if (this.context.user !== undefined){

      var rawFavorites = JSON.stringify(this.state.movieData)

      if (rawFavorites.includes(movID)) {
        setTimeout(() => { 
          for (const [i, v] of this.state.movieData.entries()) {
            
            if (movID == this.state.movieData[i].id) {
              var compareState2 = this.state.movieData
              // compareState2[i].fav = "far fa-heart fa-2x favStyleNotActive";
              compareState2.splice(i, 1)
              setTimeout(() => { 
              // compareState2[i].fav = "fa fa-heart fa-2x favStyleActive";
              this.setState({movieData: compareState2});
              this.getMovies(0)
              }, 600)
                console.log("FOUND MATCH 2", movID)
                this.setState({movieData: compareState2});
    
                axios.get(`${process.env.REACT_APP_API_URL}/favorites/removefavorites/` + this.context.user.email + '&' + movID)
                .then(response => {
                  console.log(response)
                  this.setState({userFavorites: response.data});
                  console.log(this.state)
        
              })
                break
              } 
            }
          }, 400)

      return
    }
    return

        setTimeout(() => { 
        for (const [i, v] of this.state.movieData.entries()) {
          
          if (movID == this.state.movieData[i].id) {
            var compareState2 = this.state.movieData
            compareState2[i].fav = "fa fa-heart fa-2x favStyleActive";
              console.log("FOUND MATCH", movID)
              this.setState({movieData: compareState2});
  
              axios.post(`${process.env.REACT_APP_API_URL}favorites/addfavorites/` + this.context.user.email, compareState2[i])
              .then(response => {
                var compareState = this.state.userFavorites
                compareState.push(movID)
                this.setState({userFavorites: compareState});
                console.log(response)
                console.log(this.state)
              })
  
              break
          }
          
          }
        }, 500)
    } else {
      window.location.href = "/login"
    }
    }


  getMovies(numFound) {
    // this.setState({user: this.context.user.email});
    this.setState({isLoading: true})
    console.log(this.state)

    axios.get(`${process.env.REACT_APP_API_URL}/favorites/getfavorites/` + this.context.user.email)
    .then(data => {
      
      this.setState({movieData: data.data});

      
    })
    .catch((error) => {
      console.log('error: ', error);
    });
  }

  componentDidMount () {
    this.getMovies(0)
  }

  
  render() {

    const cardStyle = {
      margin: '3px',
      padding: '3px',
      width: '16%',
      // backgroundColor: 'rgba(230, 230, 255, 0.2)',
      border: '0',
    };

    
    const ratingStyle = {
      width: '20px',
      height: '20px'

      // border: '1px',
      // borderStyle: 'solid'
      // backgroundColor: 'black'
    };

    const titleStyle = {
      marginTop: '10px',
      whiteSpace: 'nowrap', 
      width: '150px', 
      height: '20px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '18px',
    };

    const favStyle = {
      // position: 'absolute', 
      // right: '42px',
      marginLeft: '38px',
      fontSize: '1.6rem',
      // width: '100%', 
      // textAlign: 'right',
      zIndex: '99',
      // position: 'absolute'
    };


    
    // const { loaded } = this.state;

    // if (!loaded) {
    //   return null;
    // }

    const {
      error,
      hasMore,
      isLoading,
      pageNumber
    } = this.state;

    const theHTML = this.state.movieData.map((mov, i) => (
      <div className="card hvr-float" style={cardStyle}>
       {mov.title &&
      <RouterNavLink to={`/movie/${mov.id}`} exact className="nav-link-movie">
      <img className="card-img-top hideme" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px'}}></img>
      </RouterNavLink>
       }
       {mov.name &&
      <RouterNavLink to={`/tv/${mov.id}`} exact className="nav-link-movie">
      <img className="card-img-top hideme" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px'}}></img>
      </RouterNavLink>
       }       
      <div className="card-body hideme" style={{marginLeft: '-10px'}}>
      {/* <i className={mov.loaded} style={{color: 'gray'}}/> */}
        <div className="d-flex">
          {/* <FontAwesomeIcon icon={faImdb} className="fa-lg"/>  */}
        <a target="_blank" href={`https://www.imdb.com/title/${mov.imdbID}`} className="rate-float">
        
        <img src={IMDBlogo} alt="IMDB" style={ratingStyle}></img>
        {mov.RTimg && 
        <span style={{marginRight: '10px'}}><b>{mov.IMDB}</b></span>
        }
        {!mov.RTimg && 
        <span style={{marginRight: '10px'}}><b>N/A</b></span>
        }
        <img src={tomato} alt="Rotten Tomatoes" style={ratingStyle}></img>
        {mov.RTimg && 
        <span style={{textDecoration: 'none !important'}}><b>{mov.RT}</b></span>
        }
        {!mov.RTimg && 
        <span style={{textDecoration: 'none !important'}}><b>N/A</b></span>
        }
        </a>
        </div>
        {mov.title &&
        <RouterNavLink to={`/movie/${mov.id}`} exact className="nav-link-movie">
        <h5 className="card-title" style={titleStyle}>{mov.title}{mov.name}</h5>
        <span>{mov.release_date} {mov.first_air_date}</span>
        </RouterNavLink>
        }
         {mov.name &&
        <RouterNavLink to={`/tv/${mov.id}`} exact className="nav-link-movie">
        <h5 className="card-title" style={titleStyle}>{mov.title}{mov.name}</h5>
        <span>{mov.release_date} {mov.first_air_date}</span>
        </RouterNavLink>
        }       
        {/* <RouterNavLink to={`http://localhost:9000/favroites/addfavorites/${this.state.user}&${mov.id}`} exact className="hvr-float">
        <i className="fa fa-heart fa-3x" style={{color: 'yellow'}}/>
        </RouterNavLink> */}
        {/* {mov.IMDB !== undefined && mov.IMDB.substr(0, 3) >= 6.9 &&  */}
        <i className="rate-float" className={mov.fav} style={favStyle} onClick={(e) => this.handleClick(mov.id, i)}/>
      </div >
      
      
      {/* <button className='button' onClick={() => this.handleClick(mov.id)}> */}
      {/* <i className={mov.fav} style={{marginTop: '0'}} onClick={() => this.handleClick(mov.id)}/> */}
    {/* Favorite
  </button> */}
      </div>
      
      ))
    
// console.log(this.state.ratingData)


    return (
      
      <div className="next-steps">
        <h5 className="pb-3 text-left font-weight-bold flex-row">Favorites List</h5>
        <Row className="d-flex">
          {/* {console.log("wow", this.state.movieData[1])} */}
          {theHTML}
          
        {!this.state.movieData[0] &&
        <h5 style={{marginLeft: '15px'}}>No favorites yet! Add favorites by clicking the heart icons.</h5>
        }

          {/* {isLoading &&
          <span style={{marginTop: '10px'}}>Loading...<i className="fa fa-spinner fa-spin fa-3x"/></span>
        }
        {!isLoading &&
        <span>Page {pageNumber} </span>
        }
        {!hasMore &&
          <div>You did it! You reached the end!</div>
        } */}
        </Row>
      </div>
    );
  }
}

export default Favorites;
