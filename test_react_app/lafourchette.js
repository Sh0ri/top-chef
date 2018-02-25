var fs = require('fs');
var express = require('express');
var app = express();
let cheerio = require('cheerio');
let request = require('request');

var restaurants = [];

function get_restaurant(michelin_restaurant)
{
	return new Promise((resolve, reject) => {
		michelin_restaurant.title = michelin_restaurant.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=' + michelin_restaurant.title;

		request({url:url,json:true}, function(error, response, html){
			try{
				var found_restaurants = [];
				var true_restaurant = null;
				html.forEach(function(element){
					var restaurant = {id:"", title : "", address : { address_locality : "", postal_code : ""}, restaurant_url : "", stars : "" };

					restaurant.id = element.id;
					restaurant.title = element.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
					restaurant.address.address_locality = element.address.address_locality;
					restaurant.address.postal_code = element.address.postal_code;

					restaurant.restaurant_url = 'https://www.lafourchette.com/restaurant/'+restaurant.title+'/'+restaurant.id+ '#ocSaleTypeList';
					restaurant.stars = michelin_restaurant.stars;
					found_restaurants.push(restaurant);
					//restaurants.push(restaurant);

					if(restaurant.address.postal_code == michelin_restaurant.address.postal_code && restaurant.title.includes(michelin_restaurant.title))
					{
						if(true_restaurant == null)
						{
							true_restaurant = restaurant;
						}
						else
						{
							//verif plus pointue pour déterminer le bon restaurant
							true_restaurant = compare_strings(michelin_restaurant.title,true_restaurant,restaurant);
						}
					}
				})

				if(true_restaurant !== null)
					resolve(true_restaurant);
				else
				{
					reject(url);
				}

				//resolve(found_restaurants);
			}
			catch(e){
				reject(e);
			}
			//callback(found_restaurants);

		})
	});
}

function compare_strings(michelin_restaurant_title,previous_restaurant,new_restaurant)
{
	var score_previous_restaurant = 0;
	var score_new_restaurant = 0;

	for (var i = 0; i < michelin_restaurant_title.length; i++) {
		if(michelin_restaurant_title.charAt(i) == previous_restaurant.title.charAt(i))
			score_previous_restaurant++;
		if(michelin_restaurant_title.charAt(i) == new_restaurant.title.charAt(i))
			score_new_restaurant++;
	}
	if(score_previous_restaurant > score_new_restaurant)
		return previous_restaurant;
	if(score_new_restaurant > score_previous_restaurant)
		return new_restaurant;
	if(score_new_restaurant == score_previous_restaurant)
		return null;
}

function check_if_offers(restaurant){
	return new Promise((resolve, reject) => {
				var headers = { 
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
			'Content-Type' : 'application/x-www-form-urlencoded' 
		};

		var url = 'https://m.lafourchette.com/api/restaurant/' + restaurant.id + '/sale-type';

		request({url:url,json:true,headers:headers}, function(error, response, html)
		{
			var is_special_offer = false;
			try
			{
				html.forEach(function(line){
					if(line.is_special_offer)
					{
						is_special_offer = true;
							//console.log("there is a special offer");
						}
					});
				//console.log(is_offer);
				if(is_special_offer)
					resolve(restaurant);
				else
					reject(false);
			}
			catch(e){
				//console.log("error at get offers");
				reject(false);
			}
			
		})
	});
}

String.prototype.isEmpty = function() {
	return (this.length === 0 || !this.trim());
};

function get_offers(restaurant)
{
	return new Promise((resolve, reject) => {
		var headers = { 
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
			'Content-Type' : 'application/x-www-form-urlencoded' 
		};



		var promos = [];
		var url = restaurant.restaurant_url;
		var restaurant_with_promos = { restaurant : { id:"", title : "", address : { address_locality : "", postal_code : ""} , restaurant_url : "", stars : "" } , promos : [{title : "", number : "", text : ""}]}

		request({url:url,json:true,headers : headers}, function(error, response, html)
		{
			var $ = cheerio.load(html);

			$('.saleType.saleType--specialOffer').each(function(element){

				var promo = {title : "", number : "", text : ""};

				var title = $(this).children('h3').text();
				var promo_text = $(this).children('p').text();

				promo.title = title;
				promo.number = title.replace(/[^0-9\.\€\%\-]/g,'');
				promo.text = promo_text;
				//promo.restaurant_url = url;

				promos.push(promo);

			})

			restaurant_with_promos.restaurant = restaurant;
			restaurant_with_promos.promos = promos;

			resolve(restaurant_with_promos);
			
		})
	});
}

function store_offers(offers){
	return new Promise((resolve,reject)=> {
		fs.writeFile('offers.json', JSON.stringify(offers, null, 4), function(err){
			console.log('File successfully written! - Check your project directory for the output.json file');
		})
		resolve("done");
	});
}

function store_restaurants_on_lafourchette(restaurants_lafourchette)
{
	return new Promise((resolve, reject) => {
		fs.writeFile('restaurants_on_lafourchette.json', JSON.stringify(restaurants_lafourchette, null, 4), function(err){
			console.log('File successfully written! - Check your project directory for the output.json file');
		})
		resolve("done");
	});
}

function store_restaurants_with_offers(restaurants_with_offers)
{
	return new Promise((resolve, reject) => {
		fs.writeFile('restaurants_with_offers.json', JSON.stringify(restaurants_with_offers, null, 4), function(err){
			console.log('File successfully written! - Check your project directory for the output.json file');
		})
		resolve("done");
	});
}

function get_stored_restaurants_on_lafourchette(){
	var obj = JSON.parse(fs.readFileSync('restaurants_on_lafourchette.json'));
	return obj;
}

function get_stored_restaurants_with_offers(){
	var obj = JSON.parse(fs.readFileSync('restaurants_with_offers.json'));
	return obj;
}

function get_stored_offers(){
	var obj = JSON.parse(fs.readFileSync('offers.json'));
	return obj;
}

module.exports = {
	get_restaurant : get_restaurant,
	check_if_offers : check_if_offers,
	get_offers : get_offers,
	store_offers : store_offers,
	store_restaurants_on_lafourchette : store_restaurants_on_lafourchette,
	get_stored_restaurants_on_lafourchette : get_stored_restaurants_on_lafourchette,
	store_restaurants_with_offers : store_restaurants_with_offers,
	get_stored_restaurants_with_offers : get_stored_restaurants_with_offers,
	get_stored_offers : get_stored_offers
};
