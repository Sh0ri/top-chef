import React, { Component } from 'react';

const aStyle = {
  margin: '40px',
  border: '5px solid'
};

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

  Update(orderer){
    fetch(API + 'get_stored_offers/orderby/' + orderer)
    .then(response => response.json())
    .then(data => this.setState({ restaurants_with_promos: data }));
  }

  OrderByTitle(){
    const { restaurants_with_promos } = this.state;
    restaurants_with_promos.sort((a,b) => a.restaurant.title - b.restaurant.title)
    this.setState({ restaurants_with_promos: restaurants_with_promos });
  }

  UpdateData(element){
    fetch(API + 'update/' + element)
    .then(response => response.json())
    .then(data => this.setState({ restaurants_with_promos: data }));
  }
  render() {
    const { restaurants_with_promos } = this.state;

    return (
      <div id='root'>


      <div class="sidenav">
      <button type="button" class="btn btn-outline-primary" onClick={()=>{this.Update('title')}}>Order By Title</button>
      <button type="button" class="btn btn-outline-primary" onClick={()=>{this.Update('id')}}>Order By ID</button>
      <button type="button" class="btn btn-outline-primary" onClick={()=>{this.Update('starsasc')}}>Order By Stars
      <span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-outline-primary" onClick={()=>{this.Update('starsdsc')}}>Order By Stars
      <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
      </button>

      <button type="button" class="btn btn-outline-primary" onClick={()=>{this.OrderByTitle()}}>Update the offers</button>
      </div>

      <div class="list-group" id="root" className= "App">
      {restaurants_with_promos.map(restaurant_with_promos =>

        /*<!-- div with one restaurant -->*/
        <a  key={restaurant_with_promos.restaurant.id} id="resto" style={aStyle} class="list-group-item list-group-item-action col-sm-10" href={restaurant_with_promos.restaurant.restaurant_url}>
        <span class="badge badge-primary badge-pill">{restaurant_with_promos.restaurant.stars} stars</span>
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
      </div>
      );
  }
}

function orderbytitle(obj){
  return obj.sort(function(a, b){
    if(a.restaurant.title < b.restaurant.title) return -1;
    if(a.restaurant.title > b.restaurant.title) return 1;
    return 0;
  });
}

export default App;