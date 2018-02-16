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

							console.log("plusieurs elements");
						console.log(restaurant);
						restaurants.push(restaurant);

					})
						console.log("fin des plusieurs restaurants");

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