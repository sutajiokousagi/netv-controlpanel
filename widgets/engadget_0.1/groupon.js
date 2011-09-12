var Groupon = function(){
    var ns = 'Groupon.';
    var API_BASE = 'http://groupon.com/api/v1/';
    var callbacks = {
        getCities: [],
        getDeals: []
    };
    
    function getCities(callback) {
	var query = ['select * from json where url ="', API_BASE, 'divisions.json"'].join('');
	callbacks.getCities.push(callback);
	loadFromYQL(query, ns + 'getCitiesRetrieved');
    };
    
    function getCitiesRetrieved(response) {
	var callback = callbacks.getCities.shift();
	if(callback)
	    callback.call(this, response.query.results.json.divisions);
    };
    
    function getDeals(city, callback) {
	if(typeof arguments[0] === "function") 
	    callbacks.getDeals.push(arguments[0]);
	if(callback)
	    callbacks.getDeals.push(callback);
	var params = parameterizeCity(city);
	if(params){
	    var query = ['select * from json where url ="', API_BASE, 'deals.json', params, '"'].join('');
	    loadFromYQL(query, ns + 'getDealsRetrieved');
	}
    };
    
    function getDealsRetrieved(response) {
	var callback = callbacks.getDeals.shift();
	if (response.query.results == null)
	    callback.call(this, null);
	else 
	    callback.call(this, response.query.results.json.deals);
    };
    
    function parameterizeCity(city) {
	//if city set we will load that,
	//otherwise we'll geolocate user
	if(city){
	    if(typeof city === 'string')
		return '?division=' + city;
	    if(typeof city === 'object'){
		if(city.id)
		    return '?division=' + city.id;
		if(city.latitude && city.longitude) {
		    return ['?lat=', city.latitude, '&lng=', city.longitude].join('');
		}
	    }
	    else {
		getUserIp();
		return false;
	    }
	}
	else{
	    getUserIp();
	    return false;
	}
    };
    
    function getUserIp() {
	jsonP('http://jsonip.appspot.com/?callback=Groupon.userIpRetrieved');
    };
    
    function userIpRetrieved(response) {
	getGeoFromIp(response.ip);
    };
    
    function getGeoFromIp(ip) {
	var yql = 'select Latitude,Longitude from ip.location'+
	    ' where ip="'+ip+'"';
	loadFromYQL(yql,'Groupon.geoFromIpRetrieved', "http://datatables.org/alltables.env");
    };
    
    function geoFromIpRetrieved(response) {
	var geo = response.query.results.Response;
	getDeals({latitude: geo.Latitude, longitude: geo.Longitude});
    };
    
    function loadFromYQL(query, callback, table) {
	var src = 'http://query.yahooapis.com/v1/public/yql?q='+
	    encodeURIComponent(query) + '&format=json&callback=' + callback; 
	if(table)
	    src += '&env=' + table
	jsonP(src);
    };
    
    function jsonP(src) {
	var head = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	s.setAttribute('src',src);
	s.setAttribute('type', 'text/javascript');
	head.appendChild(s);
    };
    
    return {
	getCities: getCities,
	getCitiesRetrieved: getCitiesRetrieved,
	getDeals: getDeals,
	getDealsRetrieved: getDealsRetrieved,
	userIpRetrieved: userIpRetrieved,
	geoFromIpRetrieved: geoFromIpRetrieved
    };
    
}();
