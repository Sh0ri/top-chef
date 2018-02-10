var fs = require('fs');
var express = require('express');
var app = express();
let cheerio = require('cheerio');
let request = require('request');

var restaurants = [];

function get_restaurant(michelin_restaurant,callback)
{
	restaurants = [];
	var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=' + michelin_restaurant.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	//console.log(url);
		//var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=Atmosphères';
		request({url:url,json:true}, function(error, response, html){
			if(html != null)
			{
				var new_url = url;
				restaurants = [];

				var $ = cheerio.load(html);
				var body = html;	
				if(body != null)
				{
					try{
						
						html.forEach(function(element){
							var restaurant = {id:"", title : "", address : { address_locality : "", postal_code : ""}, restaurant_url : "" };

							restaurant.id = element.id;
							restaurant.title = element.name;
							restaurant.address.address_locality = element.address.address_locality;
							restaurant.address.postal_code = element.address.postal_code;

							restaurant.restaurant_url = 'https://www.lafourchette.com/restaurant/'+restaurant.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'/'+restaurant.id+'#info';

						//console.log(restaurant);
						restaurants.push(restaurant);

					})

						callback(restaurants);
					}
					catch (e){
						//console.log("cannot do foreach");
						try{
							
							
							var restaurant = {id:"", title : "", address : { address_locality : "", postal_code : ""}, restaurant_url : "" };

							restaurant.id = html[0].id;
							restaurant.title = html[0].name;
							restaurant.address.address_locality = html[0].address.address_locality;
							restaurant.address.postal_code = html[0].address.postal_code;

							restaurant.restaurant_url = 'https://www.lafourchette.com/restaurant/'+restaurant.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'/'+restaurant.id+'#info';

							restaurants.push(restaurant);

							callback(restaurant);
						}
						catch(e){
							callback(null);
						}

					}

				}
			}
		})
	}
	function get_offers(restaurant,callback)
	{
		var url = 'https://m.lafourchette.com/api/restaurant/' + restaurant.id + '/sale-type';
		//console.log(url);

		request({url:url,json:true}, function(error, response, html)
		{
			//console.log(html);
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
				callback(is_special_offer);
			}
			catch(e){
				//console.log("error at get offers");
				callback(false);
			}
			
		})
	}

	String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

	function return_offers(restaurant,callback)
	{
		var promos = [];
		
		var url = 'https://www.lafourchette.com/restaurant/'+restaurant.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'/'+restaurant.id+'#info';
		//var url = 'https://www.lafourchette.com/restaurant/le-saint-laurent/310489#info';
		//console.log(url);
		request({url:url,json:true}, function(error, response, html)
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
			callback(promos);
			
		})
	}

	function storeJSON(restaurants_with_promos,callback)
	{
		//console.log(restaurant_with_promos);


		fs.writeFile('restaurants_with_promos.json', JSON.stringify(restaurants_with_promos, null, 4), function(err){
			//console.log('File successfully written! - Check your project directory for the output.json file');
		})
		callback("end");
	}
	module.exports = {
		get_restaurant : get_restaurant,
		get_offers : get_offers,
		return_offers : return_offers,
		storeJSON : storeJSON
	};
