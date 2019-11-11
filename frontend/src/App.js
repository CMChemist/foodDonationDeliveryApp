import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import UserView from './views/UserView';
import NavBar from './containers/NavBar';
import LoginView from './views/LoginView';
import UserEditView from './views/UserEditView';
import CreateProfileView from './views/CreateProfileView';
import AddressView from './views/AddressView';
require("dotenv").config()

const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;

// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import NavBar from './containers/NavBar';

class App extends Component {
  constructor() {
    super();
    this.state = {
        users: [],
        currentUser: {},
        newDonation: '',
        loggedIn: false,
        loginError: false,
        testDriver: {},
        testDonor: {},
        testFoodBank: {},
        testItem: {},
    }
  }
  componentDidMount() {
      // this.getUsers();
      // console.log('About to fetch')
      // fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1411+4th+Avenue,
      // +Seattle,+WA+98101&key=${REACT_APP_API_KEY}`)
      // .then(response => response.json())
      // .then(data => console.log('Geocode API response = ', data))
      // console.log("currentUser = ", this.state.currentUser)
      this.distanceAPITest();
  }

  distanceAPITest = () => {
    this.getUsers(this.callDistanceAPI)
  }

  callDistanceAPI = () => {
    console.log('ABOUT TO CALL DISTANCE API')
    const origin1 = this.state.users[0].location.address;
    const destinationA = this.state.users[12].location.address;
    const destinationB = this.state.users[18].location.address;
    const destinationC = this.state.users[20].location.address;
    const destinationD = this.state.users[21].location.address;
    const destinationE = this.state.users[23].location.address;

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationA, destinationB, destinationC, destinationD, destinationE],
        travelMode: 'DRIVING',
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
      }, this.handleAPIResponse);
  }
  handleAPIResponse = (response, status) => {
    console.log('Distance API response = ', response)
  }

  getUsers = (callback = ()=>console.log('')) => {
      fetch("http://localhost:3000/api/v1/users")
      .then(resp => resp.json())
      .then(data => {
          this.setState({
              users: data
          });
      })
      .then(() => {
        if (this.state.currentUser !== {}) {
          this.setCurrentUser(this.state.currentUser.username, this.state.currentUser.password)
        }
      })
      .then(callback)
      .catch(err=>console.log(err))
  }
  resetUsersAndDonation = () => {
    // console.log('IN resetUsers(), currentUser = ', this.state.currentUser)
    // console.log('In resetUsers() and about to reset users')
      this.getUsers();
      this.setState({newDonation: ''})
  }
  setCurrentUser = (username, password) => {
    // console.log('IN setCurrentUser(), username = ', username)
    // console.log('IN setCurrentUser(), password = ', password)
    const loginUser = this.state.users.filter ( user => {
        // console.log('***********************************')
        // console.log('username = ', username)
        // console.log('password = ', password)
        // console.log('user.username = ', user.username)
        // console.log('user.password = ', user.password)
        // console.log("user.username === username && user.password === password is ", user.username === username && user.password === password)
        // console.log('***********************************')
        if (user.username === username && user.password === password) {
            // console.log('returned true')
            return true;
        } else {
            // console.log('returned false')
            return false;
        }
    })
    //  console.log('ABOUT TO SET CURRENTUSER IN STATE')
  if (loginUser.length === 1) {
    this.setState({currentUser: loginUser[0], loggedIn: true}, () => console.log('currentUser = ', this.state.currentUser))
  } else {
    this.setState({loginError: true, loggedIn: false, currentUser: {}}, () => console.log('LOGIN ERROR = ', this.state.loginError))
    
  }
    //  , () => console.log('After setCurrentUser, currentUser = ', this.state.currentUser)
  }
  joinItemAndCurrentUser = (item) => {
      // console.log('item = ', item)
      // console.log('item.id = ', item.id)
      fetch('http://localhost:3000/api/v1/user_items', {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify({
              user_item: {
                  user_id: this.state.currentUser.id,
                  item_id: item.id
              }
          })
      })
      .then(() => this.clearForm())
      .catch(err => alert(err.message));
      // .then(response => response.json())
      // .then(json => console.log('join post = ', json))

  }
  joinLocationAndCurrentUser = (location) => {
    // console.log('currentUser.id = ', this.state.currentUser.id)
    // console.log('location.id = ', location.id)
    fetch('http://localhost:3000/api/v1/user_locations', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            user_location: {
                user_id: this.state.currentUser.id,
                location_id: location.id
            }
        })
    })
    .then(() => this.getUsers())
    .catch(err => alert(err.message));
    // .then(response => response.json())

}
  clearForm = () => {
      // console.log('In ClearForm user_item = ', user_item)
      // console.log('clearForm users = ', this.state.users);
      this.setState({
          testDriver: {
          name: 'John Doe',
          phoneNum: '(206) 555-5555'
          },
          testDonor: {
          name: 'Icicle Seafoods',
          address: "4019 21st Ave W, Seattle, WA 98199"
          },
          testFoodBank: {
          name: 'Ballard Food Bank',
          address: '5130 Leary Ave NW, Seattle, WA 98107'
          },
          testItem: {
          name: this.state.newDonation
          }
      }, () => this.resetUsersAndDonation())
      
  }

  // handleFormChange = (event) => {
  //   event.preventDefault();
  //   event.persist();
  //   // console.log(event.target.value)
  //   // console.log(event.target.name)
  //   this.setState({
  //       currentUser: {
  //           ...this.state.currentUser,
  //           [event.target.name]: event.target.value
  //       }
  //   })
  //   // , () => console.log(this.state.currentUser[event.target.name])
  // }
  handleDonationChange = (event) => {
    event.preventDefault();
    event.persist();
    this.setState({
        newDonation: event.target.value
    })
  }
  // , () => console.log("newDonation = ", this.state.newDonation)

  handleLoginSubmit = (loginData) => {
      // console.log("IN handleLoginSubmit")
      // console.log('Username/Password = ', loginData)
      this.setCurrentUser(loginData.username, loginData.password)
  }
  handleCreateAccountSubmit = (event, newUser) => {
      event.preventDefault();
      // console.log('newUser = ', newUser)
      fetch('http://localhost:3000/api/v1/users/', {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
          },
          body: JSON.stringify({
              name: newUser.name,
              username: newUser.username,
              password: newUser.password,
              role: 'driver',
              phoneNum: newUser.phoneNum,
              about: newUser.about
          })
      })
      .then(response => response.json())
      .then(data => this.setState({currentUser: data}, () => this.getUsers()))
      .catch(err => alert(err.message));
  }
  handleAddressSubmit = (locationName, newAddress, milesFrom) => {
    // console.log('IN App handler newAddress = ', newAddress)
    // console.log("LocationName = ", locationName)
    // console.log("mileFrom = ", milesFrom)
    fetch('http://localhost:3000/api/v1/locations/', {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
          },
          body: JSON.stringify({
              name: locationName,
              address: newAddress,
              milesFrom: milesFrom
          })
      })
      .then(response => response.json())
      .then(data => this.joinLocationAndCurrentUser(data))
      .catch(err => alert(err.message));

//


  }
  handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/api/v1/users/${this.state.currentUser.id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
        },
        body: JSON.stringify({
            name: this.state.currentUser.name,
            role: this.state.currentUser.role,
            phoneNum: this.state.currentUser.phoneNum,
            about: this.state.currentUser.about
        })
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => alert(err.message));
}
  handleDonationSubmit = (event) => {
    event.preventDefault();
    console.log('About to POST newDonation')
    fetch(`http://localhost:3000/api/v1/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            item: {name: this.state.newDonation}
        })
    })
    .then(response => response.json())
    .then(json => this.joinItemAndCurrentUser(json))
    .catch(err => alert(err.message));
  }

  render() {
    return (
      <Fragment>
        <Router>
          <NavBar />
          <Route
            exact path='/login'
            render={() => 
              <LoginView 
                handleLoginSubmit={this.handleLoginSubmit}
                loggedIn={this.state.loggedIn}
              />
            }
          />
          <Route 
            exact path='/profile/create'
            render={() =>
              <CreateProfileView handleCreateAccountSubmit={this.handleCreateAccountSubmit}/>
            }
          />
          <Route 
            exact path='/profile/address'
            render={() =>
              <AddressView handleAddressSubmit={this.handleAddressSubmit}/>
            }
          />
          <Route
            exact path='/profile'
            render={() => 
              <UserView 
                currentUser={this.state.currentUser}
                newDonation={this.state.newDonation}
                handleDonationChange={this.handleDonationChange}
                handleDonationSubmit={this.handleDonationSubmit}
                testDriver={this.state.testDriver}
                testDonor={this.state.testDonor}
                testFoodBank={this.state.testFoodBank} 
                testItem={this.state.testItem}
              />
            }
          />
          <Route
            exact path="/profile/edit"
            render={() => 
              <UserEditView 
                currentUser={this.state.currentUser} 
                handleFormChange={this.handleFormChange} 
                handleSubmit={this.handleSubmit}
              />
            }
          />
        </Router>
      </Fragment>
    );
  }
}

export default App;
