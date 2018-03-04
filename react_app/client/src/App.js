import React, { Component } from 'react';
import loading_pizza from './loading_pizza.gif';

const aStyle = {
  margin: '40px',
  border: '5px solid'
};

const loadingStyle = {
  margin:'0 auto',
  width:'40%'
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
    if(window.sessionStorage.getItem("current_orderer")!==null){
      console.log( window.sessionStorage.getItem("current_orderer"));
      fetch(API + 'get_stored_offers/orderby/' + window.sessionStorage.getItem("current_orderer"))
      .then(response => response.json())
      .then(data => this.setState({ restaurants_with_promos: data }));
    }
    else
    {
      console.log('orderer null');
      window.sessionStorage.setItem("current_orderer", "title");
      fetch(API + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ restaurants_with_promos: data }));
    }

  }

  Update(orderer){
    fetch(API + 'get_stored_offers/orderby/' + orderer)
    .then(response => response.json())
    .then(data => this.setState({ restaurants_with_promos: data }));
  }

  OrderByTitle(){
    window.sessionStorage.setItem("current_orderer", "title");
    const { restaurants_with_promos } = this.state;
    restaurants_with_promos.sort((a,b) => a.restaurant.title.localeCompare(b.restaurant.title))
    this.setState({ restaurants_with_promos: restaurants_with_promos });
  }

  OrderByID(){
    window.sessionStorage.setItem("current_orderer", "id");
    const { restaurants_with_promos } = this.state;
    restaurants_with_promos.sort((a,b) => a.restaurant.id - b.restaurant.id)
    this.setState({ restaurants_with_promos: restaurants_with_promos });
  }

  OrderByStarASC(){
    window.sessionStorage.setItem("current_orderer", "starsasc");
    const { restaurants_with_promos } = this.state;
    restaurants_with_promos.sort((a,b) => a.restaurant.stars - b.restaurant.stars  ||  a.restaurant.title.localeCompare(b.restaurant.title))
    this.setState({ restaurants_with_promos: restaurants_with_promos });
  }

  OrderByStarDSC(){
    window.sessionStorage.setItem("current_orderer", "starsdsc");
    const { restaurants_with_promos } = this.state;
    restaurants_with_promos.sort((a,b) => b.restaurant.stars - a.restaurant.stars  ||  a.restaurant.title.localeCompare(b.restaurant.title))
    this.setState({ restaurants_with_promos: restaurants_with_promos });
  }

  UpdateData(element){
    this.setState({restaurants_with_promos : []});
    window.sessionStorage.setItem("current_orderer", "title");
    if(element === 'offers' || element ==='offers_only_with_offers'){
      fetch(API + 'update/' + element)
      .then(response => response.json())
      .then(data => this.setState({ restaurants_with_promos:  data }));
    }
    else{
      fetch(API + 'update/' + element)
      .then(test => this.UpdateData('offers'));
    }
  }

  UpdateAll(){
    this.setState({restaurants_with_promos : []});
    fetch(API + 'update/michelin')
    .then(test => fetch(API + 'update/michelin_restaurants_in_lafourchette'))
    .then(test2 => fetch(API + 'update/restaurants_with_promos'))
    .then(test3 => fetch(API + 'update/offers'))
    .then(response => response.json())
    .then(data => this.setState({ restaurants_with_promos: data }));
  }

  render() {
    const { restaurants_with_promos } = this.state;
    if(restaurants_with_promos.length !== 0){
      return (
        <div id='root' class="row">


        <div class="sidenav">
        <button type="button" class="btn btn-warning" onClick={()=>{this.UpdateData('offers_only_with_offers')}}>Get restaurants with offers only</button>
        <button type="button" class="btn btn-warning" onClick={()=>{this.UpdateData('offers')}}>Get all restaurants on lafourchette</button>

        <button type="button" class={window.sessionStorage.getItem("current_orderer") === 'title' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={()=>{this.OrderByTitle()}}>Order By Title</button>
        <button type="button" class={window.sessionStorage.getItem("current_orderer") === 'id' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={()=>{this.OrderByID()}}>Order By ID</button>
        <button type="button" class={window.sessionStorage.getItem("current_orderer") === 'starsasc' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={()=>{this.OrderByStarASC()}}>Order By Stars
        <span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
        </button>
        <button type="button" class={window.sessionStorage.getItem("current_orderer") === 'starsdsc' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={()=>{this.OrderByStarDSC()}}>Order By Stars
        <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
        </button>
        <br/>
        <button type="button" class="btn btn-info" onClick={()=>{this.UpdateData('michelin')}}>Update Michelin</button>
        <button type="button" class="btn btn-info" onClick={()=>{this.UpdateData('offers')}}>Update Offers</button>
        <button type="button" class="btn btn-info" onClick={()=>{this.UpdateData('michelin_restaurants_in_lafourchette')}}>Update Restaurants in Lafourchette</button>
        <button type="button" class="btn btn-info" onClick={()=>{this.UpdateData('restaurants_with_promos')}}>Update Restaurants with Offers</button>
        <br/>
        <button type="button" class="btn btn-success" onClick={()=>{this.UpdateAll()}}>Update All</button>
        </div>

        <div class="list-group" id="root" className= "App">
        {restaurants_with_promos.map(restaurant_with_promos =>

          /*<!-- div with one restaurant -->*/
          <a  key={restaurant_with_promos.restaurant.id} id="resto" style={aStyle} class="list-group-item list-group-item-action" href={restaurant_with_promos.restaurant.restaurant_url}>
          <span class="badge badge-primary badge-pill">{restaurant_with_promos.restaurant.stars} stars</span>
          <h1>{restaurant_with_promos.restaurant.title}</h1>
          <h3>{restaurant_with_promos.restaurant.chef}</h3>
          <label>{restaurant_with_promos.restaurant.description}</label>
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
    else{
      return (
        <div className="image-container">
        <img src={loading_pizza} alt="loading" style={loadingStyle}/>
        </div>
        );
    }
    
  }

}

export default App;