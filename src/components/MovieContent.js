import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faImdb  } from '@fortawesome/free-brands-svg-icons';
import '../../node_modules/@fortawesome/fontawesome-free/css/brands.css'
import contentData from "../utils/contentData";
import axios from 'axios';
import { v3, v4 } from "@leonardocabeza/the-movie-db";

import '../style.css'
import IMDBlogo from "../assets/IMDBlogo.png";
import tomato from "../assets/tomato.png";
import badTomato from "../assets/badTomato.png";
import goodTomato from "../assets/goodTomato.png";



export class MovieContent extends Component {

  
  constructor(props) {
    super(props);

    this.state = { 
      loaded: "fa fa-cog fa-spin fa-lg",
      loadedfin :"d-none",
      movieData: [],
      ratingData: [],
      ratingData2: []
    };

    this.codeNode = React.createRef();
  }

  
  componentDidMount() {
    console.log(this.props)
    const v3ApiKey = 'a1714ea534415d9c121d381219e6129d';    
    const v3Client = v3(v3ApiKey);
    v3Client.movie.details(this.props.match.params.id)
    .then((data) => {
     
      this.setState({movieData: data});

        var d = new Date(data.release_date);
        d = d.toLocaleString('default', { month: 'short' })
        data.release_date = d + ", " + data.release_date.substr(0, 4);
        data.loaded = "fa fa-spinner fa-spin fa-lg";
        data.loadedfin = "d-none";
        this.setState({movieData: data});
        console.log(this.state)
        axios({
          "method":"GET",
          "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
          "headers":{
          "content-type":"application/octet-stream",
          "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key": "1mAVi8jSwlmsh07ghuCUnNKdyw9ip15YyMJjsng8L9nsfQVPyn"
          },"params":{
          "page":"1",
          "y":data.release_date.substr(0, 3),
          "r":"json",
          "type":"movie",
          "s":data.title
          }
          })
          .then((response)=>{
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
                  if (response2.data.Title == this.state.movieData.title) {
                    var compareState = this.state.movieData
                    compareState.IMDB = response2.data.Ratings[0].Value
                    compareState.RT = response2.data.Ratings[1].Value
                    compareState.RT.substr(0, 2) >= 60 ? compareState.RTimg = tomato : compareState.RTimg = badTomato;
                    compareState.loaded = ""
                    compareState.loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                  } else if (response2.data.Title.substr(0, 3)== this.state.movieData.title.substr(0, 3)) {
                    var compareState = this.state.movieData
                    compareState.IMDB = response2.data.Ratings[0].Value
                    compareState.RT = response2.data.Ratings[1].Value
                    compareState.RT.substr(0, 2) >= 60 ? compareState.RTimg = tomato : compareState.RTimg = badTomato;
                    compareState.loaded = ""
                    compareState.loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                  }
                console.log(this.state)
              })
              .catch((error)=>{
                console.log(error)
              })
          })
          .catch((error)=>{
            console.log(error)
          })


    // console.log("FINISHED")
    // If loading takes too long we stop the loading spinner
    setTimeout(() => { 
        var compareState2 = this.state.movieData
        if (this.state.movieData.IMDB == undefined) compareState2.IMDB = "~";
        if (this.state.movieData.RT == undefined) {
          compareState2.RT = "~"
          compareState2.RTimg = tomato;
        }
        compareState2.loaded = ""
        compareState2.loadedfin = "d-flex"
        this.setState({movieData: compareState2});
    }, 4200);
      // console.log(data.results[2])
      // this.setState({ loaded: true });
      // res.render('./weekly/allContacts',{ popularMovies: data.results })
    })
    .catch((error) => {
      console.log('error: ', error);
    });
  }

  

  
  render() {

    const cardStyle = {
      marginTop: '4vh',
      padding: '0px',
      width: '19%',
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
    };

    
    // const { loaded } = this.state;

    // if (!loaded) {
    //   return null;
    // }
    
// console.log(this.state.ratingData)
const mov = this.state.movieData
return (
  <div className="">
            <h2 className="">{mov.title}</h2>
    <Row className="d-flex justify-content-between">
      {/* {console.log("wow", this.state.movieData[1])} */}
      
      <div className="card" style={cardStyle}>
      <img className="card-img-top" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px'}}></img> 
      <div className="card-body" style={{marginLeft: '-10px'}}>
      <i className={mov.loaded} style={{color: 'gray'}}/>
        <div className={mov.loadedfin}>
          {/* <FontAwesomeIcon icon={faImdb} className="fa-lg"/>  */}
        <img src={IMDBlogo} alt="IMDB" style={ratingStyle}></img>
        <span style={{marginRight: '10px'}}><b>{mov.IMDB}</b></span>
        <img src={mov.RTimg} alt="Rotten Tomatoes" style={ratingStyle}></img>
        <span><b>{mov.RT}</b></span>
        </div>
        <h5 className="card-title" style={titleStyle}><b>{mov.title}</b></h5>
        <span>{mov.release_date}</span>
      </div >
       
      </div>
    </Row>
  </div>
);
  }
}

export default MovieContent;
