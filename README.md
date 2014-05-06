# mongo-rest-query-helper

## Simply convert a query string to a mongo criteria/filter object

/uri?filter=filter=[{"property":"firstName","value":"sajib","operator":"=","anyMatch":true,"condition":"OR"},{"property":"lastName","value":"sarkar","operator":"=","anyMatch":true,"condition":"OR"},{"property":"salary","value":10000,"operator":"gte","anyMatch":true,"condition":"AND"},{"property":"salary","value":1000000,"operator":"lte","anyMatch":true,"condition":"AND"}]

turns it into
 
{"$and":[{"salary":{"$gte":10000}},{"salary":{"$lte":1000000}}],"$or":[{"firstName":{ /sajib/}},{"lastName":{ /sarkar/}}],"memberOrgs.products.ets.isSubscriber":true}

## Installation

    $ npm install mongo-rest-query-helper

## Usage
/

for example the uri query is
  /uri?filter=filter=[{"property":"firstName","value":"sajib","operator":"=","anyMatch":true,"condition":"OR"},{"property":"lastName","value":"sarkar","operator":"=","anyMatch":true,"condition":"OR"},{"property":"salary","value":10000,"operator":"gte","anyMatch":true,"condition":"AND"},{"property":"salary","value":1000000,"operator":"lte","anyMatch":true,"condition":"AND"}]


FROM A EXPRESSJS ROUTER WE CAN DEFINE A FILTER PARAMETER FROM URI values,
app.use(app.get(res,req,){
  
 var mongoRestQueryHelper = require("mongo-rest-query-helper");
 var parameters = url.parse(req.url, true).query, key;
 url = require('url'),
 var filter=  mongoRestQueryHelper.processFilters(parameters);

 UserModel.find(filter, function (er, user){
    console.log(user);
 })
 
 
});





## Credits

  - [Sajib Sarkar](http://github.com/thebapi)

## License

The MIT License (MIT)

Copyright (c) 2013 Sajib Sarkar

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

