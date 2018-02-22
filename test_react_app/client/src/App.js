import React, { Component } from 'react';

const API = '/api/';
const DEFAULT_QUERY = 'get_stored_offers';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants_with_promos: [],
    };
  }

  componentDidMount() {
    fetch(API + DEFAULT_QUERY)
    .then(response => response.json())
    .then(data => this.setState({ restaurants_with_promos: data }));
  }
  render() {
    const { restaurants_with_promos } = this.state;

    return (
      <div class="list-group" id="root" className= "App">
      {restaurants_with_promos.map(restaurant_with_promos =>
        <div key={restaurant_with_promos.restaurant.id}>
        <a href={restaurant_with_promos.restaurant.restaurant_url}>{restaurant_with_promos.restaurant.title}</a>
        </div>

        /*<!-- div with one restaurant -->*/
        <a  key={restaurant_with_promos.restaurant.id} id="resto" class="list-group-item list-group-item-action col-sm-10" style="margin-bottom: 100px" href={restaurant_with_promos.restaurant.restaurant_url}>
        <h1>{restaurant_with_promos.restaurant.title}</h1>
        <div id="liste de promos">
        {restaurant_with_promos.promos.map(promo =>
          <div id="promo">
          <h2>{promo.title}</h2>
          <label id="promo_text">
          {promo.text}
          </label>
          </div>

          )}
        </div>
        </a>
        )}
      </div>
      );
  }
}

export default App;