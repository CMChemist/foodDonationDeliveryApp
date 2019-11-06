import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import User from '../components/User';
import About from '../components/About';
import DonationsContainer from './DonationsContainer';
import Contact from '../components/Contact';
import UserEditContainer from './UserEditContainer';
import MatchContainer from './MatchContainer';
import NavBar from './NavBar';

class UserContainer extends Component {

    constructor() {
        super();
        this.state = {
            users: [],
            currentUser: {},
            newDonation: '',
            testDriver: {},
            testDonor: {},
            testFoodBank: {},
            testItem: {}
        }
    }

    getUsers = () => {
        fetch("http://localhost:3000/api/v1/users")
        .then(resp => resp.json())
        .then(data => {
            this.setState({
                users: data,
            }, () => this.setCurrentUser());
        })
        .catch(err=>console.log(err))
    }

    componentDidMount() {
        this.getUsers()
    }

    setCurrentUser() {
        console.log('IN setCurrentUser')
        this.setState({currentUser: this.state.users[0]}, () => console.log(this.state))
    }

    handleFormChange = (event) => {
        event.preventDefault();
        event.persist();
        // console.log(event.target.value)
        // console.log(event.target.name)
        this.setState({
            currentUser: {
                ...this.state.currentUser,
                [event.target.name]: event.target.value
            }
        })
        // , () => console.log(this.state.currentUser[event.target.name])
    }

    handleDonationChange = (event) => {
        event.preventDefault();
        event.persist();
        this.setState({
            newDonation: event.target.value
        }, () => console.log("newDonation = ", this.state.newDonation))
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
        .then(this.clearForm())
        .catch(err => alert(err.message));
        // .then(response => response.json())
        // .then(json => console.log('join post = ', json))

    }

    clearForm = () => {
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
        })
        this.getUsers();
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

    render() {
        console.log("%crender fires", "color:red;")
        console.log(this.state.currentUser)
        return (
            <Router>
                <NavBar />
                <Route
                exact path="/profile"
                render={() => {
                    return (
                        <div>
                            <User user={this.state.currentUser}/>
                            <About user={this.state.currentUser}/>
                            <DonationsContainer 
                                user={this.state.currentUser} 
                                handleDonationChange={this.handleDonationChange} 
                                newDonation={this.state.newDonation} 
                                handleDonationSubmit={this.handleDonationSubmit}
                            />
                            <Contact user={this.state.currentUser}/>
                            <MatchContainer 
                                driver={this.state.testDriver}
                                donor={this.state.testDonor}
                                food_bank={this.state.testFoodBank} 
                                items={this.state.testItem}
                            />
                        </div>
                    )
                }}
                />
                <Route
                    exact path="/profile/edit"
                    render={() => <UserEditContainer user={this.state.currentUser} handleFormChange={this.handleFormChange} handleSubmit={this.handleSubmit}/>}
                    />
            </Router>
        );
    };

}

export default UserContainer;