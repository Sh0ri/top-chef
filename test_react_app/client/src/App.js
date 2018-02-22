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
      <div>
        {restaurants_with_promos.map(restaurant_with_promos =>
          <div key={restaurant_with_promos.restaurant.id}>
            <a href={restaurant_with_promos.restaurant.restaurant_url}>{restaurant_with_promos.restaurant.title}</a>
            {restaurant_with_promos.promos.map(promo =>
              <div class="promo">
              <p>{promo.title}</p>
              <p>{promo.number}</p>
              <p>{promo.text}</p>
              </div>
              )}
            <p></p>
            <p></p>
            <p></p>
          </div>
        )}
      </div>
    );
  }
}

export default App;