const michelin = require("./michelin.js");
const lafourchette = require("./lafourchette.js");

restaurants = michelin.get_JSON();


restaurants.forEach(function(restaurant){
	lafourchette.get_restaurant(restaurant,function(maybe_restaurant){
		if(maybe_restaurant != null)
		{
			maybe_restaurant.forEach(function(maybe_restaurant){
				//console.log(maybe_restaurant);
				if(maybe_restaurant.title.includes(restaurant.title) && maybe_restaurant.address.postal_code == restaurant.address.postal_code)
				{
					//console.log("LE BON RESTO");
					//console.log(maybe_restaurant);

					//GET OFFERS FOR THIS RESTAURANT
					lafourchette.get_offers(maybe_restaurant,function(is_offer){
						//console.log(is_offer);
						if(is_offer == true)
							{
								lafourchette.return_offers(maybe_restaurant,function(promo){
									//console.log(maybe_restaurant.title);
									console.log(promo);
								})
							}
					})
				}
			})
		}
	});
})
