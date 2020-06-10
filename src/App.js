import React, {Component}from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'


const app = new Clarifai.App({
 apiKey: '94decefdcd534219948526bda86d7b5d'
});

const particlesOptions = {
  particles: {
    number: {
      value:80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}



class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imgURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
  
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState({isSignedIn: false})
    }
    else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});

  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }


  onButtonSubmit = () => {
   this.setState({imgURL: this.state.input});
    
    app.models
    .predict(
           Clarifai.FACE_DETECT_MODEL, 
           this.state.imgURL)
    .then(response => {
      if(response){
        fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json',
            "Access-Control-Origin": "*"},
            body: JSON.stringify({
              id: this.state.user.id
            })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })

      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  render(){
    const {isSignedIn, imgURL, route, box} = this.state;
    return (
      <div className="App">
        <Particles  className='particles'
                  params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange}
                    isSignedIn={isSignedIn}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imgURL={imgURL} box={box}/>
            </div>

          : (
            route === 'signin' 
            ? <Signin 
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
              />
            : <Register 
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
              />
              
            )
        } 
      </div>
    );
  }

}
export default App;
