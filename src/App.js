import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const apiKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjN2FiM2JlMC0yNGMyLTAxMzYtMzE4My0wMTEzMjEwZDMxMWQiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI0MDA2NzczLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImJob2wiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.IbR9YkX02e-61nPX5vmorv_bXtAJZE6P6XwJjDfi_BA";

class App extends Component {
  componentDidMount() {
    const response = fetch(
      "https://api.playbattlegrounds.com/shards/pc-na/players?filter[playerNames]=breezypanda180",
      {
        headers: new Headers({
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`
        })
      }
    );
    response.then(res => res.text()).then(body => {
      const parsedBody = JSON.parse(body);
      const playerObject = parsedBody.data[0];
      const myId = playerObject.id;
      const myMatches = playerObject.relationships.matches.data;
      const myMatchIDs = myMatches.map(match => match.id);
      const firstMatchID = myMatchIDs[0];
      const res = fetch(
        `https://api.playbattlegrounds.com/shards/pc-na/matches/${firstMatchID}`,
        {
          headers: new Headers({
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${apiKey}`
          })
        }
      );
      res.then(res => res.text()).then(body => {
        const parsedMatch = JSON.parse(body);
        const telemetryID = parsedMatch.data.relationships.assets.data[0].id;
        let telemetryURL;
        parsedMatch.included.forEach(includedObj => {
          if (includedObj.id === telemetryID) {
            telemetryURL = includedObj.attributes.URL;
          }
        });
        const telemetryRes = fetch(telemetryURL);
        telemetryRes.then(res => res.text()).then(body => {
          const parsedTelem = JSON.parse(body);
          console.log(parsedTelem);
        });
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
