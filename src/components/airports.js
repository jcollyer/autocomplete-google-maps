import React, { Component } from 'react'
import Select from 'react-select'
import request from 'superagent'
const codes = require('../airCodes').default
let jsonp = require('superagent-jsonp');

var Airports = React.createClass({
  getInitialState() {
    return {  airCode1: {}, airCode2: {}, distance: 0, lat: 39.8282, lng: -98.5795 };
  },
  valChange1(val) {
    this.setState({airCode1: val}, () => {
      this.getTravelData()
    })
  },
  valChange2(val) {
    this.setState({airCode2: val}, () => {
      this.getTravelData()
    })
  },
  getDistance() {
    var that = this
    request
      .get('https://airport.api.aero/airport/distance/'+this.state.airCode1.value+'/'+this.state.airCode2.value+'?user_key=9654ae185ac8b831325f2fcfb3eec22a')
      .use(jsonp)
      .end(function(err, res){
        if(res && Object.keys(res).length > 0){
          var nm = (parseFloat(res.body.distance.replace(",","")) * 0.539957).toFixed(3) // calculate nautical miles
          that.setState({distance: nm})
        }
      })
  },
  getTravelData() {
    if (Object.keys(this.state.airCode1).length > 0 && Object.keys(this.state.airCode2).length > 0) { // must have two un-empty objects to proceed
      this.initMap()
      this.getDistance()
    }
  },
  initMap() {
    var that = this
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {lat: that.state.lat, lng: that.state.lng},
      mapTypeId: 'terrain'
    })

    var flightPlanCoordinates = [
      {lat: that.state.airCode1.lat, lng: that.state.airCode1.lng},
      {lat: that.state.airCode2.lat, lng: that.state.airCode2.lng}
    ]

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    })

    flightPath.setMap(map);
  },
  render() {
    return (
      <div>
        <div className="section">
          <h2 className="center">To</h2>
          <Select name="apirportOne" matchPos="any" matchProp="any" options={codes} value={this.state.airCode1} onChange={this.valChange1} />
        </div>
        <div className="section">
          <h2 className="center">From</h2>
          <Select name="apirportTwo" matchPos="any" matchProp="any" options={codes} value={this.state.airCode2} onChange={this.valChange2} />
        </div>
        <h1 className="center">Distance - {this.state.distance} Nautical Miles</h1>
        <hr />
        <div id="map"></div>
      </div>
    )
  }
})

module.exports = Airports;
