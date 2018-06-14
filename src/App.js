import React, { Component } from 'react';
import logo from './icon.png';
import './App.css';
import Request from 'superagent';
var url = 'http://localhost:8080/rssfeedwebsite/get.php';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Velkommen til Bibelsøk!</h1>
        </header>
        <p className="App-intro">
          Søk etter hva bibelvers, trykk <a href="">her</a> for referansestil
        </p>
      </div>
    );
  }
}

class Clock extends Component{
  constructor(props){
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount(){
    this.timerID = setInterval(()=>this.tick(), 1000);
  }

  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  tick(){
    this.setState({date: new Date()});
  }

  render() {
    return(
      <div><p>This is the clock: {this.state.date.toLocaleTimeString()}</p></div>
    );
  }
}

class GetDatabaseInfo extends Component {
   constructor(props){
     super(props);
     this.state = {text: "Getting database information.."};
   }

   // get text from REST
   getText(){
     Request.get(url)
      .withCredentials()
      .query({ id: '1'})
      .then((response) => {
       this.setState({
         text: response.text
       });
     });
   }

   componentDidMount() {
      this.timerID = setInterval(() => this.getText(), 1000);
   }

   componentWillUnmount() {
     clearInterval();
   }

   render() {
     return (
       <div>
          <p>This is the current message {this.state.text}</p>
       </div>

     );
   }

}


// the bible stuff
class GetVerse extends Component {
  constructor(props){
    super(props);
    this.state = { title: 'Search and ye shall find! BibleVerser', verse_text: '', verse_end: '', verse_start: '', chapter: '', book_id: '' };
  }

  handleChange_(e){
     var key = e.which || e.keyCode;

     var reference = e.target.value;

     if(key == 13){

       this.setState
       ({
         book_id: reference.split(' ')[0],
         chapter: reference.split(' ')[1].split(':')[0],
         verse_start: reference.split(' ')[1].split(':')[1].split('-')[0],
         verse_end: reference.split(' ')[1].split(':')[1].split('-')[1]
       }, ()=> {
          //getting the verse

         if(this.state.verse_end=='undefined'){
            this.setState({verse_end:''})
         }

         console.log(this.state.chapter);
         this.getVerse()
        });

      }
  }


  getVerse(){
    Request.get('http://dbt.io/text/verse')
    .query({key: '2f2b4145678cd6f22962568a237f89b2'})
    .query({dam_id: 'NORNBVN2ET'})
    .query({book_id: this.state.book_id})
    .query({chapter_id: this.state.chapter})
    .query({verse_start: this.state.verse_start})
    .query({verse_end: this.state.verse_end})
    .query({reply: 'json'})
    .query({v: '2'})
    .then((response)=>{

      var json = JSON.parse(response['text']);
      console.log(json);
      var text = json[0].book_name + " " + json[0].chapter_id + ":";
      for(var i in json){
          text += json[i].verse_id + " " + json[i].verse_text;
      }

      this.setState({ verse_text: text });

    });
  }

  render() {
    return (
      <div class="topMargin"><div class="container-fluid col-md-3">
      <input placeholder="Search any bible verse!" class="form-control" onKeyDown={this.handleChange_.bind(this)} />
      </div>

      <div class="container-fluid col-md-5">
        <blockquote class="lead verse">{this.state.verse_text}</blockquote >
      </div></div>
    );
  }
}

export {
  App,
  GetDatabaseInfo,
  Clock,
  GetVerse
}
