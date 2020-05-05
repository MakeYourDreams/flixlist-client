import React, { useState, Component } from "react";
import { Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
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
      ratingFilter: 0,
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
        this.getMovies(0, this.state.pageNumber)
      }
    }, 100);
  }

  
  
  setRatingFilter (filterRating, e) {
    document.getElementById("dropdownMenuButton1").innerText = "IMDB Rating " + e.target.innerText
    this.setState({ratingFilter: filterRating});
    this.setState({pageNumber: 1});
    this.setState({isLoading: false})
    this.setState({movieData: []});
    this.setState({scrollHeight: 9999});

    this.getMovies(0, 1)
  }

  handleClick (movID, e) {

    e.target.classList = ("fa fa-spinner fa-spin setGray")
    if (this.context.user !== undefined){

      var rawFavorites = JSON.stringify(this.state.userFavorites)

      if (rawFavorites.includes(movID)) {
        setTimeout(() => { 
          for (const [i, v] of this.state.movieData.entries()) {
            
            if (movID == this.state.movieData[i].id) {
              var compareState2 = this.state.movieData
              compareState2[i].fav = "far fa-heart fa-2x favStyleNotActive";
                console.log("FOUND MATCH 2", movID)
                this.setState({movieData: compareState2});
    
                axios.get('http://localhost:9000/favorites/removefavorites/' + this.context.user.email + '&' + movID)
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

        setTimeout(() => { 
        for (const [i, v] of this.state.movieData.entries()) {
          
          if (movID == this.state.movieData[i].id) {
            var compareState2 = this.state.movieData
            compareState2[i].fav = "fa fa-heart fa-2x favStyleActive";
              console.log("FOUND MATCH", movID)
              this.setState({movieData: compareState2});
  
              axios.post('http://localhost:9000/favorites/addfavorites/' + this.context.user.email, compareState2[i])
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


  getMovies(numFound, pageNumber) {

    if (this.state.isLoading == true && numFound >= 20) {
      // setTimeout(() => {  
      //   this.getMovies(numFound) 
      //   this.setState({isLoading: false})
      // }, 500);
  return
}
    // this.setState({user: this.context.user.email});
    this.setState({isLoading: true})
    console.log(this.state)
    if (this.context.user !== undefined){
    axios.get('http://localhost:9000/favorites/getfavorites/' + this.context.user.email)
    .then(userFavorities => {
      // console.log("favvs", userFavorities.data);
      this.setState({userFavorites: userFavorities.data});
    })
  }
    // console.log("favvs2", this.state.userFavorites)
    const v3ApiKey = 'a1714ea534415d9c121d381219e6129d';    
    const v3Client = v3(v3ApiKey);
    v3Client.movie.popular({
      page: pageNumber
    })
    .then((data) => {


      //FILTER RESULTS
      var newData = data.results //if no filter
      // var newData = data.results.filter(data => {
      //   if (data.release_date !== undefined) return data.release_date.substr(0, 4) >= 2010;
      //   }
      //   );
      data.results = newData
console.log(this.state.pageNumber, newData)


      if (this.state.movieData == null) {
      this.setState({movieData: data.results});
      } else {
        var savePageMovies = this.state.movieData
        console.log("PREV PAGE", savePageMovies)
        data.results = savePageMovies.concat(data.results) 
        this.setState({movieData: data.results});
        console.log("NEXT PAGE", data.results)
      }

      
      
      if (this.state.pageNumber >= 200) this.setState({hasMore: false});
      numFound = numFound + newData.length
      if ((numFound < 20) && (this.state.pageNumber < 200)){

        
      for (const [i, v] of data.results.entries()) {
        // console.log("PAGE", this.state.pageNumber, v)
        if (i < ((data.results.length) - numFound)) continue
        if (v.release_date === undefined) continue
        if (!isNaN(v.release_date.substr(0, 4))) {
        var d = new Date(v.release_date);
        d = d.toLocaleString('default', { month: 'short' })
        data.results[i].release_date = d + ", " + v.release_date.substr(0, 4);
        }
        if (!data.results[i].IMDB) {
        data.results[i].loaded = "fa fa-spinner fa-spin fa-lg";
        data.results[i].loadedfin = "d-none";
        data.results[i].fav = "far fa-heart fa-2x favStyleNotActive";
        }

        this.setState({movieData: data.results});
      }

      this.setState({pageNumber: this.state.pageNumber + 1});
      this.getMovies(numFound, this.state.pageNumber)
      return
      }
      console.log("NEWDATA", numFound)

      for (const [i, v] of data.results.entries()) {
        // console.log("PAGE", this.state.pageNumber, v)
        if (i < ((data.results.length) - numFound)) continue
        if (v.release_date === undefined) continue
        if (!isNaN(v.release_date.substr(0, 4))) {
        var d = new Date(v.release_date);
        d = d.toLocaleString('default', { month: 'short' })
        data.results[i].release_date = d + ", " + v.release_date.substr(0, 4);
        }
        if (!data.results[i].IMDB) {
        data.results[i].loaded = "fa fa-spinner fa-spin fa-lg";
        data.results[i].loadedfin = "d-none";
        data.results[i].fav = "far fa-heart fa-2x favStyleNotActive";
        }

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
                  if (i < ((data.results.length) - numFound)) continue
                  if (v.release_date === undefined) continue
                  if (response2.data.Title == this.state.movieData[i].title) {
                    var compareState = this.state.movieData
                    compareState[i].IMDB = response2.data.Ratings[0].Value
                    compareState[i].RT = response2.data.Ratings[1].Value
                    compareState[i].RT.substr(0, 2) >= 60 ? compareState[i].RTimg = tomato : compareState[i].RTimg = badTomato;
                    if (!compareState[i].RT.includes("%")) compareState[i].RT = (compareState[i].RT.substr(0, 2) + "%")
                    compareState[i].loaded = ""
                    compareState[i].loadedfin = "d-flex"
                    if (compareState[i].IMDB !== undefined && compareState[i].IMDB.substr(0, 3) < this.state.ratingFilter){
                    compareState[i].loadedfin = "d-none"
                    compareState[i].blurryCard = true
                    }
                    this.setState({movieData: compareState});
                    break
                  } 
                  else if (response2.data.Title.substr(0, 9) == this.state.movieData[i].title.substr(0, 9)) {
                    var compareState = this.state.movieData
                    compareState[i].IMDB = response2.data.Ratings[0].Value
                    compareState[i].RT = response2.data.Ratings[1].Value
                    compareState[i].RT.substr(0, 2) >= 60 ? compareState[i].RTimg = tomato : compareState[i].RTimg = badTomato;
                    if (!compareState[i].RT.includes("%")) compareState[i].RT = (compareState[i].RT.substr(0, 2) + "%")
                    compareState[i].loaded = ""
                    compareState[i].loadedfin = "d-flex"
                    if (compareState[i].IMDB !== undefined && compareState[i].IMDB.substr(0, 3) < this.state.ratingFilter){
                    compareState[i].loadedfin = "d-none"
                    compareState[i].blurryCard = true
                    }
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
    // If can't find reviews we stop the loading spinner.
    setTimeout(() => { 
      var scrollHeight = document.getElementsByTagName("body")[0].scrollHeight
      this.setState({scrollHeight: scrollHeight});
      for (const [i, v] of this.state.movieData.entries()) {
        if (i < ((data.results.length) - numFound)) continue
        var compareState2 = this.state.movieData
        compareState2[i].loaded = ""
        compareState2[i].loadedfin = "d-flex"
        if (this.state.movieData[i].IMDB == undefined) {
          compareState2[i].IMDB = "N/A";
          compareState2[i].loadedfin = "d-flex ratingTransparent"
        }
        if (this.state.movieData[i].RT == undefined) {
          compareState2[i].RT = "N/A"
          compareState2[i].RTimg = tomato;
        }
        if ((this.state.movieData[i].IMDB !== undefined) && (this.state.movieData[i].RT == undefined)){
          compareState2[i].loadedfin = "d-flex"
        }
        // if (compareState2[i].IMDB !== "5.7/10") {
        //   compareState2.splice(i, 1)
        //   i = -1
        // }
        this.setState({movieData: compareState2});
        }

        if (this.state.ratingFilter !== 0) {
        compareState2 = this.state.movieData.filter(data => {
          if (data.IMDB !== undefined) return data.IMDB.substr(0, 3) >= this.state.ratingFilter
          }
          )
        

          if (this.state.pageNumber >= 200) this.setState({hasMore: false});
          numFound = compareState2.length
          console.log("FOUND", numFound)
          if ((compareState2.length < 20) && (this.state.pageNumber < 200)){
            this.setState({movieData: compareState2});
            this.setState({pageNumber: this.state.pageNumber + 1});
            this.getMovies(numFound, this.state.pageNumber)
            return
          }
        }
          
          this.setState({movieData: compareState2});
        this.setState({isLoading: false});
        var scrollHeight = document.getElementsByTagName("body")[0].scrollHeight
        this.setState({scrollHeight: scrollHeight});
        console.log("TIMEOUT FINISHED", this.state)
    }, 2000);

    //Set favorites
    setTimeout(() => { 
        for (const [i, v] of this.state.movieData.entries()) {
          if (i < ((data.results.length) - numFound)) continue
          var rawFavorites = JSON.stringify(this.state.userFavorites)
          if (rawFavorites.includes(`${this.state.movieData[i].id}`)) {
            var compareState2 = this.state.movieData
            compareState2[i].fav = "fa fa-heart fa-2x favStyleActive";
            this.setState({movieData: compareState2});
          }

          }
          console.log(this.state)
    }, 400);


      
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
      <RouterNavLink to={`/movie/${mov.id}`} exact className="nav-link-movie">
      {mov.blurryCard &&
      <img className="card-img-top blurryCard" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px'}}></img>
        }
        {!mov.blurryCard &&
      <img className="card-img-top hideme" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px'}}></img>
        }
      </RouterNavLink>
      <div className="card-body" style={{marginLeft: '-10px'}}>
      <i className={mov.loaded} style={{color: 'gray'}}/>
        <div className={mov.loadedfin}>
          {/* <FontAwesomeIcon icon={faImdb} className="fa-lg"/>  */}
        <a target="_blank" href={`https://www.imdb.com/title/${mov.imdbID}`} className="rate-float">
        {mov.RTimg && 
        
        <img src={IMDBlogo} alt="IMDB" style={ratingStyle}></img>
        }
        {mov.RTimg && 
        <span style={{marginRight: '10px'}}><b>{mov.IMDB}</b></span>
        }
        {mov.RTimg && 
        <img src={mov.RTimg} alt="Rotten Tomatoes" style={ratingStyle}></img>
        }
        {mov.RTimg && 
        <span style={{textDecoration: 'none !important'}}><b>{mov.RT}</b></span>
        }
        </a>
        </div> 
        <RouterNavLink to={`/movie/${mov.id}`} exact className="nav-link-movie">
        <h5 className="card-title" style={titleStyle}>{mov.title}</h5>
        <span>{mov.release_date} </span>
        </RouterNavLink>
        <i className="rate-float" className={mov.fav} style={favStyle} onClick={(e) => this.handleClick(mov.id, e)}/>
      </div >
      
      </div>
      
      ))
    
// console.log(this.state.ratingData)


    return (
      
      <div className="next-steps">
        <h5 className="pb-3 text-left font-weight-bold flex-row">Trending Movies
        <button class="btn btn-light btn-sm dropdown-toggle ml-5 rounded" type="button" id="dropdownMenuButton1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Filter IMDB Rating
  </button>
  <div  class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#" onClick={(e) => this.setRatingFilter(8, e)}>8+</a>
    <a class="dropdown-item" href="#" onClick={(e) => this.setRatingFilter(7, e)}>7+</a>
    <a class="dropdown-item" href="#" onClick={(e) => this.setRatingFilter(6.5, e)}>6½+</a>
    <a class="dropdown-item" href="#" onClick={(e) => this.setRatingFilter(6, e)}>6+</a>
    <a class="dropdown-item" href="#" onClick={(e) => this.setRatingFilter(5.5, e)}>5½+</a>
    <a class="dropdown-item" href="#" onClick={(e) => this.setRatingFilter(5, e)}>5+</a>
  </div>
        </h5>  
        

        <Row className="d-flex">
          {/* {console.log("wow", this.state.movieData[1])} */}
          {theHTML}
          
          {isLoading &&
          <span style={{marginTop: '10px'}}>Loading...<i className="fa fa-spinner fa-spin fa-3x"/></span>
        }
        {!isLoading &&
        <span>Page {pageNumber} </span>
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
