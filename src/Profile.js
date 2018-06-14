import React, { Component } from 'react';
import AvailabiltyTable from './Profile/AvailabiltyTable';
import axios from 'axios';
import UserProfile from './Profile/UserProfile';
import PreviousFixtureCard from './Profile/PreviousFixtureCard';
import UpcomingFixtureCard from './Profile/UpcomingFixtureCard';
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";

import './Stylesheets/master.css';
import './Stylesheets/profile.css';
import './Stylesheets/Searchbox.css'

const refs = {}

class Profile extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: "",
      location: "",
      position:{
        lat: 0.0,
        lng: 0.0,
      },
      places: [],
      fixtures: [],
      upcoming: [],
      isEditing: false
    };

    this.onPlacesChanged = this.onPlacesChanged.bind(this)
  }


  // Searchbox init
  onSearchBoxMounted(ref) {
      refs.searchBox = ref;
  }

  // On searchbox edited
  onPlacesChanged(){
      const places = refs.searchBox.getPlaces();
      this.setState({ places,});
      var lastvisited = places[places.length - 1];
      var newlat = lastvisited.geometry.location.lat()
      var newlng = lastvisited.geometry.location.lng()
      console.log(lastvisited.formatted_address)
      var object = {
          position: {
              lat: newlat,
              lng: newlng,
          },
          location: lastvisited.formatted_address
      };
      this.setState(object);
      console.log(this.state)
      axios.get(
        '/updateuserloc?username=' + UserProfile.getName()
        + '&lat=' + newlat
        + '&lng=' + newlng).then(function(response) {
          if (response.data == "fail\n") {
            alert("Failed to update availability, please try again.")
          } else {
            var tick = document.getElementById('searchtick');
            tick.innerHTML = "✓";
            setTimeout(function() {
              tick.innerHTML = "";
            }, 2500);
          }
        });
  }

  loadUserInformation() {
    // Query DB
    var _this = this;
    var username = UserProfile.getName();
    axios.get('/getuserinfo?username='+username)
         .then(function(response) {
           var venue_latlng = response.data.LocLat + "," + response.data.LocLng;
           var request_url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="
                             + venue_latlng

           axios.get(request_url)
                 .then(function(result) {
                   console.log(result);
                   _this.setState({location: result.data.results[0].formatted_address});
                 })
         });
  }

  loadUserFixtures() {
    var _this = this;
    var username = UserProfile.getName();
    // axios.get('/prevfix.json')
    axios.get('/getuserfixtures?username=' + username)
         .then(function(response) {
           _this.setState({
             fixtures: response.data
           });
         });
  }

  loadUpcoming() {
    var _this = this;
    var username = UserProfile.getName();
    // axios.get('/upfix.json')
    axios.get('/getuserupcoming?username=' + username)
        .then(function (response) {
            _this.setState({
                upcoming: response.data
            });
        });
  }

  componentDidMount() {
    this.loadUserInformation();
    this.loadUserFixtures();
    this.loadUpcoming();
  }

  showEditBox(e) {
    e.preventDefault();

    var _this = this;
    _this.setState({
      isEditing: true
    })
  }

  render() {
    return (
      <div id='contentpanel'>
        <div id='contentcontainer'>
          <p class='thintext centertext'>Welcome back</p>
          <h1 id='username' class='centertext'>{UserProfile.getName()}</h1>
          <h3 class='centertext'>Location: <span class='thintext'>{this.state.location} <a id='locChangeLink' onClick={e => this.showEditBox(e)}>(change)</a></span></h3>
          <div id="changelocbox">
            {this.state.isEditing ?
              <div><span id='searchtick'></span><StandaloneSearchBox
                ref={this.onSearchBoxMounted}
                bounds={this.bounds}
                onPlacesChanged={this.onPlacesChanged}
              >
              <input
                type='text'
                placeholder="Search for your location"
                id = "searchBox"
                />
              </StandaloneSearchBox></div>
              : ""}
          </div>
          <div class="AvTable">
            <AvailabiltyTable />
          </div>

          <div id='fixturesbox'>
            <table>
              <thead>
                <td>
                  Previous
                </td>
                <td>
                  Upcoming
                </td>
              </thead>
              <tr>
                <td>
                {
                  this.state.fixtures.length == 0 ? <b>(empty)</b> :
                  this.state.fixtures.map(item => (<PreviousFixtureCard data={item} />))
                }
                </td>
                <td>
                {
                  this.state.upcoming.length == 0 ? <b>(empty)</b> :
                  this.state.upcoming.map(item => (<UpcomingFixtureCard data={item} />))
                }
                </td>
              </tr>
            </table>
          </div>

        </div>
      </div>
    );
  }
}


export default Profile;
