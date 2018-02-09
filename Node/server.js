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
					console.log("LE BON RESTO");
					console.log(maybe_restaurant);

					//GET OFFERS FOR THIS RESTAURANT
					get_offers(maybe_restaurant,function(offers){
						offers.forEach(function(offer){
							console.log(offer);
						})
					})
				}
			})
		}
		else
		{
			console.log("NULL");
		}
	});
})

function get_offers(restaurant)
{
	lafourchette.get_offers(restaurant,function(offers){
		console.log(offers);
	});
}

/*
	TEST_resto =     {
        "title": "Le Gambetta",
        "address": {
            "address_locality": "12 r. Gambetta",
            "postal_code": "49400"
        }
    };
	lafourchette.get_restaurant(TEST_resto,function(test){
		if(test != null)
		{
			test.forEach(function(maybe_restaurant){
				//console.log(maybe_restaurant);
				if(maybe_restaurant.title.includes(TEST_resto.title) && maybe_restaurant.address.postal_code == TEST_resto.address.postal_code)
				{
					console.log("LE BON RESTO");
					console.log(maybe_restaurant);
				}
			})
		}
		//console.log(test);
	});*/