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



import '../style.css'
import IMDBlogo from "../assets/IMDBlogo.png";
import tomato from "../assets/tomato.png";
import badTomato from "../assets/badTomato.png";
import goodTomato from "../assets/goodTomato.png";


import debounce from "lodash.debounce";


class Content extends Component {
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
      message: "",
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
        > (scrollHeight - (50 + (pageNumber * (window.innerHeight / 100))))
      ) {
        this.setState({pageNumber: pageNumber + 1});
        this.getMovies()
      }
    }, 100);
  }

  

 handleClick (movID, e) {

  console.log("grr", e.target)
  e.target.classList = ("fa fa-spinner fa-pulse setGray")
  if (this.context.user !== undefined){
  axios.get('http://localhost:9000/users/favorites/' + this.context.user.email + '&' + movID)
    .then(response => {
      var compareState = this.state.userFavorites
      compareState.push(movID)
      this.setState({userFavorites: compareState});
      for (const [i, v] of this.state.movieData.entries()) {
        
        if (movID == this.state.movieData[i].id) {
          var compareState2 = this.state.movieData
          compareState2[i].fav = "fa fa-heart fa-2x favStyleActive";
            console.log("FOUND MATCH", movID)
            this.setState({movieData: compareState2});
            break
        }
        
        }
        console.log(response)
        console.log(this.state)
    })
  } else {
    window.location.href = "/login"
  }
  }


  getMovies() {
    // this.setState({user: this.context.user.email});
    this.setState({isLoading: true})
    console.log(this.state)
    if (this.context.user !== undefined){
    axios.get('http://localhost:9000/users/getfavorites/' + this.context.user.email)
    .then(userFavorities => {
      // console.log("favvs", userFavorities.data);
      this.setState({userFavorites: userFavorities.data});
    })
  }

    // console.log("favvs2", this.state.userFavorites)
    const v3ApiKey = 'a1714ea534415d9c121d381219e6129d';    
    const v3Client = v3(v3ApiKey);
    v3Client.movie.popular({
      page: this.state.pageNumber
    })
    .then((data) => {
      if (this.state.movieData == null) {
      this.setState({movieData: data.results});
      } else {
        var savePageMovies = this.state.movieData
        console.log("PREV PAGE", savePageMovies)
        data.results = savePageMovies.concat(data.results) 
        this.setState({movieData: data.results});
        console.log("NEXT PAGE", data.results)
      }



      for (const [i, v] of data.results.entries()) {
        // console.log("PAGE", this.state.pageNumber, v)
        if (i < ((this.state.pageNumber * 20) - 20)) continue
        if (v.release_date === undefined) continue
        var d = new Date(v.release_date);
        d = d.toLocaleString('default', { month: 'short' })
        data.results[i].release_date = d + ", " + v.release_date.substr(0, 4);
        data.results[i].loaded = "fa fa-spinner fa-spin fa-lg";
        data.results[i].loadedfin = "d-none";
        data.results[i].fav = "far fa-heart fa-2x favStyleNotActive";
        this.setState({movieData: data.results});
      // console.log(props)
        axios({
          "method":"GET",
          "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
          "headers":{
          "content-type":"application/octet-stream",
          "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key": "1mAVi8jSwlmsh07ghuCUnNKdyw9ip15YyMJjsng8L9nsfQVPyn"
          },"params":{
          "page":"1",
          "y":v.release_date.substr(5, 8),
          "r":"json",
          "type":"movie",
          "s":data.results[i].title
          }
          })
          .then((response)=>{
            var compareState = this.state.movieData
            compareState[i].imdbID = response.data.Search[0].imdbID
            this.setState({movieData: compareState});
              axios({
                "method":"GET",
                "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
                "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
                "x-rapidapi-key": "1mAVi8jSwlmsh07ghuCUnNKdyw9ip15YyMJjsng8L9nsfQVPyn"
                },"params":{
                "i":response.data.Search[0].imdbID,
                "r":"json"
                }
              })
              .then((response2) =>{
                // console.log(response2.data)
                this.setState({loaded: ""});
                this.setState({loadedfin: "d-flex"});
                // if (response2.data.Ratings.length == 0){
                // console.log("grr", response2)
                // this.setState({ ratingData: this.state.ratingData.concat('-') });
                // }
                for (const [i, v] of this.state.movieData.entries()) {
                  if (i < ((this.state.pageNumber * 20) - 20)) continue
                  if (v.release_date === undefined) continue
                  if (response2.data.Title == this.state.movieData[i].title) {
                    var compareState = this.state.movieData
                    compareState[i].IMDB = response2.data.Ratings[0].Value
                    compareState[i].RT = response2.data.Ratings[1].Value
                    compareState[i].RT.substr(0, 2) >= 60 ? compareState[i].RTimg = tomato : compareState[i].RTimg = badTomato;
                    if (!compareState[i].RT.includes("%")) compareState[i].RT = (compareState[i].RT.substr(0, 2) + "%")
                    compareState[i].loaded = ""
                    compareState[i].loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                    break
                  } else if (response2.data.Title.substr(0, 3)== this.state.movieData[i].title.substr(0, 3)) {
                    var compareState = this.state.movieData
                    compareState[i].IMDB = response2.data.Ratings[0].Value
                    compareState[i].RT = response2.data.Ratings[1].Value
                    compareState[i].RT.substr(0, 2) >= 60 ? compareState[i].RTimg = tomato : compareState[i].RTimg = badTomato;
                    if (!compareState[i].RT.includes("%")) compareState[i].RT = (compareState[i].RT.substr(0, 2) + "%")
                    compareState[i].loaded = ""
                    compareState[i].loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                    break
                  }
              //  this.setState({ ratingData: this.state.ratingData.concat(response2.data.Ratings[0].Value) });
              //  this.setState({ ratingData2: this.state.ratingData2.concat(response2.data.Ratings[1].Value) });
                }
                // console.log(this.state)
              })
              .catch((error)=>{
                console.log(error)
              })
          })
          .catch((error)=>{
            console.log(error)
          })
    }

    // console.log("FINISHED")
    // If loading takes too long we stop the loading spinner.
    setTimeout(() => { 
      var scrollHeight = document.getElementsByTagName("body")[0].scrollHeight
      this.setState({scrollHeight: scrollHeight});
      for (const [i, v] of this.state.movieData.entries()) {
        if (i < ((this.state.pageNumber * 20) - 20)) continue
        var compareState2 = this.state.movieData
        if (this.state.movieData[i].IMDB == undefined) compareState2[i].IMDB = "N/A";
        if (this.state.movieData[i].RT == undefined) {
          compareState2[i].RT = "N/A"
          compareState2[i].RTimg = tomato;
        }
        compareState2[i].loaded = ""
        compareState2[i].loadedfin = "d-flex"
        this.setState({movieData: compareState2});
        }
        this.setState({isLoading: false});
        console.log("TIMEOUT FINISHED", this.state)
    }, 4200);

    //Set favorites
    setTimeout(() => { 
        for (const [i, v] of this.state.movieData.entries()) {
          if (i < ((this.state.pageNumber * 20) - 20)) continue
          
          if (this.state.userFavorites.includes(`${this.state.movieData[i].id}`)) {
            var compareState2 = this.state.movieData
            compareState2[i].fav = "fa fa-heart fa-2x favStyleActive";
            this.setState({movieData: compareState2});
          }

          }
          console.log(this.state)
    }, 1000);
      // console.log(data.results[2])
      // this.setState({ loaded: true });
      // res.render('./weekly/allContacts',{ popularMovies: data.results })
    })
    .catch((error) => {
      console.log('error: ', error);
    });
  }

  componentDidMount () {
    this.getMovies()
  }

  
  render() {

    const cardStyle = {
      margin: '3px',
      // padding: '4px',
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

    const theHTML = this.state.movieData.map((mov, i) => (
      <div className="card hvr-float" style={cardStyle}>
       
      <RouterNavLink to={`/movie/${mov.id}`} exact className="nav-link-movie">
      <img className="card-img-top" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px'}}></img>
      </RouterNavLink>
      <div className="card-body" style={{marginLeft: '-10px'}}>
      <RouterNavLink to={`/movie/${mov.id}`} exact className="nav-link-movie">
      <i className={mov.loaded} style={{color: 'gray'}}/>
        <div className={mov.loadedfin}>
          {/* <FontAwesomeIcon icon={faImdb} className="fa-lg"/>  */}
        <img src={IMDBlogo} alt="IMDB" style={ratingStyle}></img>
        <span style={{marginRight: '10px'}}><b>{mov.IMDB}</b></span>
        <img src={mov.RTimg} alt="Rotten Tomatoes" style={ratingStyle}></img>
        <span><b>{mov.RT}</b></span>
        </div>
        <h5 className="card-title" style={titleStyle}>{mov.title}</h5>
        <span>{mov.release_date} </span>
        </RouterNavLink>
        {/* <RouterNavLink to={`http://localhost:9000/users/favorites/${this.state.user}&${mov.id}`} exact className="hvr-float">
        <i className="fa fa-heart fa-3x" style={{color: 'yellow'}}/>
        </RouterNavLink> */}
        <i className={mov.fav} style={favStyle} onClick={(e) => this.handleClick(mov.id, e)}/>
      </div >
      
      
      {/* <button className='button' onClick={() => this.handleClick(mov.id)}> */}
      {/* <i className={mov.fav} style={{marginTop: '0'}} onClick={() => this.handleClick(mov.id)}/> */}
    {/* Favorite
  </button> */}
      </div>
      
      ))
    
// console.log(this.state.ratingData)

const {
  error,
  hasMore,
  isLoading,
} = this.state;

    return (
      
      <div className="next-steps my-5">
                <h2 className="my-5 text-center">Top movies of the week</h2>
        <Row className="d-flex">
          {/* {console.log("wow", this.state.movieData[1])} */}
          {theHTML}
          {isLoading &&
          <div>Loading...<i className="fa fa-spinner fa-spin fa-4x"/></div>
        }
        {!hasMore &&
          <div>You did it! You reached the end!</div>
        }
        </Row>
      </div>
    );
  }
}

export default Content;
