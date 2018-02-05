// LEARN YOU NODE 

// EXERCICE 1
//console.log("HELLO WORLD");

// EXERCICE 2
/*
var result = 0;

process.argv.forEach((val, index) => {
	if(index > 1)
  		result += Number(val);
}); 

console.log(result);
*/

// EXERCICE 3
/*
var fs = require('fs');
var str = (fs.readFileSync(process.argv[2])).toString();

var end_str = str.split('\n');

console.log(end_str.length -1);

*/

// EXERCICE 4
/*
var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, fileContents){ 

	var str = fileContents.toString();
	var end_str = str.split('\n');
	console.log(end_str.length -1);
});
*/

// CORRECTION 

/* var fs = require('fs')
 var file = process.argv[2]

 fs.readFile(file, function (err, contents) {
   if (err) {
     return console.log(err)
   }
   // fs.readFile(file, 'utf8', callback) can also be used
   var lines = contents.toString().split('\n').length - 1
   console.log(lines)
 })*/

// EXERCICE 5

/*
var fs = require('fs');
var file = process.argv[2];
var ext = process.argv[3];

fs.readdir(file, function callback(err, list){

	if(err)
	{
		return console.log(err);
	}

	for(i = 0; i < list.length; i++)
	{
		if(list[i].split('.')[1] == ext)
			console.log(list[i]);
	}
})
*/

// EXERCICE 6
/*

var dir_name = process.argv[2];
var ext = process.argv[3];

var mymodule = require('./module_exo6');

mymodule(dir_name, ext, printResult);

function printResult(err, data)
{
	if(err)
		return console.log(err);

	else
		for(i = 0; i < data.length; i++)
		{
			console.log(data[i]);
		}
		
}
*/

// EXERCICE 7

/*var https = require('https');

 https.get(process.argv[2], function (response){
	response.setEncoding('utf8')
	response.on('error', function (err)
	{
		return console.log(err);
	})

	response.on('data', function(data)
	{

		console.log(data);
	})

})*/

var fs = require('fs');
var express = require('express');
var app = express();
let cheerio = require('cheerio');
let request = require('request');
//let $ = cheerio.load('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin');

var test = false;
var allRestaurants = [];
var compteur = 0;

for(i = 1; i < 10; i++)
{
    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    url += "/page-" + i;

    scrape_this_page(url,add_to_compteur);

/*
    request(url, function(error, response, html){
        if(!error){

            var $ = cheerio.load(html);
            console.log("===================== PAGE " + url);
            

            var title, release, rating;

            var json = { title : ""};

            $('.poi_card-display-title').filter(function(){

                var data = $(this);
                title = data.text();

                console.log(title);
                // We will repeat the same process as above.  This time we notice that the release is located within the last element.
                // Writing this code will move us to the exact location of the release year.

                //release = data.children().last().children().text();

                json.title = title;

                allRestaurants.push(json);

                console.log();

                
                //if(i == 10)
                //fin();

                // Once again, once we have the data extract it we'll save it to our json object

                //json.release = release;
            })
        }

	})*/
}

function add_to_compteur()
{
	compteur++;
	if(compteur>=10)
	{
		console.log("FIN DU PROCESS");
		fin();
	}
}
function scrape_this_page(url,add_to_compteur)
{
    request(url, function(error, response, html){
        if(!error){

            var $ = cheerio.load(html);
            console.log("===================== PAGE " + url);
            

            var title, release, rating;

            var json = { title : ""};

            $('.poi_card-display-title').filter(function(){

                var data = $(this);
                title = data.text();

                console.log(title);
                // We will repeat the same process as above.  This time we notice that the release is located within the last element.
                // Writing this code will move us to the exact location of the release year.

                //release = data.children().last().children().text();

                json.title = title;

                allRestaurants.push(json);

                console.log();
                add_to_compteur();
                
                //if(i == 10)
                //fin();

                // Once again, once we have the data extract it we'll save it to our json object

                //json.release = release;
            })
        }

	})
	
}
function fin()
{
	fs.writeFile('output.json', JSON.stringify(allRestaurants, null, 4), function(err){
		console.log('File successfully written! - Check your project directory for the output.json file');
	})
}
   


/*var restaurantList = [];

// For each .item, we add all the structure of a company to the companiesList array
// Don't try to understand what follows because we will do it differently.
$('.poi-search-result').find("li:not(.icon-mr)").each(function(index, element){
	console.log("JJJJ");
	restaurantList[index] = {};

	var details = $(element).find('.poi_card-description');
	restaurantList[index]['restaurants'] = {};
	restaurantList[index]['restaurants']['title'] = $(details).find('[class=poi_card-display-title]').text();
});


console.log(restaurantList); // Output the data in the terminal*/


 // EXERCICE 8
/*
var http = require('http');

 http.get(process.argv[2], function (response){
	response.setEncoding('utf8')
	response.on('error', function (err)
	{
		return console.log(err);
	})

	var final_str;
	var str1 ="";
	var str2 ="";


	response.on('data', function(data)
	{
		var splitted = data.split('.');
		str1 = splitted[0] + splitted[1];
	})

	response.on('data', function(data)
	{
		var splitted = data.split('.');
		str1 = splitted[0] + splitted[1];
	})


	response.on('end', function(end)
	{	
		final_str = str1 + str2;

		console.log(final_str.length);
		console.log(final_str);
	})

})

*/