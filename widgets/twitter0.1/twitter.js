//////////////////////////////////////////////////////////////////////
//
// Twitter Javascript API
// version:	beta 1
// release:	September 30, 2007
// license: This api is free to use and distribute as long as
//			this copyright notice remains attached
//
// (c) 2007 Justin Bezanson <justinbezanson@gmail.com>
//
//////////////////////////////////////////////////////////////////////

/**
 * Features for next version(s)
 * -------------------------
 * 1) FriendTimeline
 *		a) add since parameter
 *		b) add paging
 * 2) UserTimeline
 *		a) add since parameter
 *		b) add paging
 * 3) Replies
 *		a) Replies
 *		b) add paging
 * 4) Authenticate
 *		a) update
 *		b) destroy (delete)
 * 5) User Methods
 *		a) friends
 *		b) followers
 *		c) featured
 *		d) show - user profile for authenticated user with more detail
 * 6) Favorites
 *		a) create
 *		b) destroy
 *
 */
 
/**
 * Known bugs to be fixed
 * ----------------------
 *
 */ 

//Twitter namespace
var Twitter = {};

//location of ajax processing page
Twitter.AjaxPage = "twitter.php";

//ajax loading image
Twitter.AjaxLoadImage = "images/loading.gif";

//user profile
Twitter.UserProfile = {};

/**
 * updates the specified element with the specific status of the given id
 * @params :
 *		- update : string of the element to update
 *		- id : the status id to get
 *		- limit : if true leave out user image and link
 */
Twitter.SingleStatus = function(params) {
	if(typeof params.update == "string") {
		params.update = document.getElementById(params.update);
	}
	var update = params.update;
	var id = params.id;
	var limit = params.limit;
	var currentContents = update.innerHTML;
	update.innerHTML = '<div style="width:100%;text-align:center"><img src="' + Twitter.AjaxLoadImage + '" alt=""/></div>';
	var url = Twitter.AjaxPage + "?status_show=" + id;
	var parameters = {
		onComplete:function(response) {
			update.innerHTML = currentContents;
			var json = eval("[" + response.text + "]");
			for(var i=0;i<json.length;i++) {
				var twitter = json[i];
				var image = '<img src="' + twitter.user.profile_image_url + '" alt="" style="float:left"/>';
				var userlink = '<span class="TwitterUser"><a href="http://www.twitter.com/' + 
					twitter.user.screen_name + '">' + twitter.user.screen_name + '</a></span> ';
				var time = Twitter.TimePhrase((new Date().getTime() - Twitter.CreatedOn(twitter.created_at)));
				time = 	' <span class="TwitterTime">' +
						'<a href="http://www.twitter.com/' + twitter.user.screen_name + '/statuses/' + twitter.id + '">' + time + '</a></span>';
				var from = ' <span class="TwitterSource">from ' + twitter.source + '</span>';
						
				var html = '<div class="Twitter">';
				if(limit) {
					html += twitter.text + time + from;
				}
				else {
					html += image + userlink + twitter.text + time + from;
				}
				html += '<div style="clear:left"></div></div>';
				update.innerHTML += html;
			}
		}
	};
	new Twitter.Ajax(url,parameters).request();
}

/**
 * updates the specified element with the latest statuses from the public timeline
 * @params : 
 * 		- update : string of the element to update
 *		- since : show public statuses since the specified status id number
 */
Twitter.PublicTimeline = function(params) {
	if(typeof params.update == "string") {
		params.update = document.getElementById(params.update);
	}
	var update = params.update;
	var since = params.since;
	var currentContents = update.innerHTML;
	update.innerHTML = '<div style="width:100%;text-align:center"><img src="' + Twitter.AjaxLoadImage + '" alt=""/></div>';
	var url = Twitter.AjaxPage + "?public_timeline";
	if(since){url += "&since=" + since;}
	var parameters = {
		onComplete:function(response) {
			update.innerHTML = currentContents;
			var json = eval(response.text);
			for(var i=0;i<json.length;i++) {
				var twitter = json[i];
				var image = '<img src="' + twitter.user.profile_image_url + '" alt="" style="float:left"/>';
				var userlink = '<span class="TwitterUser"><a href="http://www.twitter.com/' + 
					twitter.user.screen_name + '">' + twitter.user.screen_name + '</a></span> ';
				var time = Twitter.TimePhrase((new Date().getTime() - Twitter.CreatedOn(twitter.created_at)));
				time = 	' <span class="TwitterTime">' +
						'<a href="http://www.twitter.com/' + twitter.user.screen_name + '/statuses/' + twitter.id + '">' + time + '</a></span>';
				var from = ' <span class="TwitterSource">from ' + twitter.source + '</span>';
						
				var html = '<div class="Twitter">';
				html += image + userlink + twitter.text + time + from;
				html += '<div style="clear:left"></div></div>';
				update.innerHTML += html;
			}
		}
	};
	new Twitter.Ajax(url,parameters).request();
}

/**
 * updates the specified element with the latest statuses of the user and their friends
 * @params : 
 *		- user : accepts twitter username or id
 * 		- update : string of the element to update
 *		- count : optional, number of statuses to return, default is 20 which is also the maximum
 */
Twitter.FriendsTimeline = function(params) {
	if(typeof params.update == "string") {
		params.update = document.getElementById(params.update);
	}
	var user = params.user;
	var update = params.update;
	var currentContents = update.innerHTML;
	update.innerHTML = '<div style="width:100%;text-align:center"><img src="' + Twitter.AjaxLoadImage + '" alt=""/></div>';
	var url = Twitter.AjaxPage + "?friend_timeline=" + user;
	var parameters = {
		onComplete:function(response) {
			update.innerHTML = currentContents;
			var json = eval(response.text);
			for(var i=0;i<json.length;i++) {
				var twitter = json[i];
				var image = '<img src="' + twitter.user.profile_image_url + '" alt="" style="float:left"/>';
				var userlink = '<span class="TwitterUser"><a href="http://www.twitter.com/' + 
					twitter.user.screen_name + '">' + twitter.user.screen_name + '</a></span> ';
				var time = Twitter.TimePhrase((new Date().getTime() - Twitter.CreatedOn(twitter.created_at)));
				time = 	' <span class="TwitterTime">' +
						'<a href="http://www.twitter.com/' + twitter.user.screen_name + '/statuses/' + twitter.id + '">' + time + '</a></span>';
				var from = ' <span class="TwitterSource">from ' + twitter.source + '</span>';
						
				var html = '<div class="Twitter">';
				html += image + userlink + twitter.text + time + from;
				html += '<div style="clear:left"></div></div>';
				update.innerHTML += html;
			}
		}
	};
	new Twitter.Ajax(url,parameters).request();
}

/**
 * this function gets the user's profile and sets Twitter.UserProfile with the results
 * @params : 
 * 		- user : the user screen name to get
 *		- onload : 	this parameter is optional and accepts a function that will be executed 
 *					when the api is finished retreiving the user's profile.
 */
Twitter.GetUserProfile = function(params) {
	var user = params.user;
	var fn = params.onload;
	var url = Twitter.AjaxPage + "?user_timeline=" + user + "&count=1";
	var parameters = {
		onComplete:function(response) {
			var json = eval(response.text);
			var profile = {};
			profile.ImageUrl = json[0].user.profile_image_url;
			profile.Url = json[0].user.url;
			profile.Name = json[0].user.name;
			profile.Description = json[0].user.description;
			profile.Location = json[0].user.location;
			profile.ScreenName = json[0].user.screen_name;
			profile.ID = json[0].user.id;
			profile.Protected = (json[0].user.protected == "true") ? true : false;
			Twitter.UserProfile = profile;
			if(fn){fn();}
		}
	};
	new Twitter.Ajax(url,parameters).request();
};

/**
 * updates the specified element with the latest statuses
 * @params : 
 *		- user : accepts twitter username or id
 * 		- update : string of the element to update
 *		- count : optional, number of statuses to return, default is 20 which is also the maximum
 *		- limit : true || false, false by default, if true leaves out the user image and screen name links
 */
Twitter.UserTimeline = function(params) {
	if(typeof params.update == "string") {
		params.update = document.getElementById(params.update);
	}
	var user = params.user;
	var update = params.update;
	var limit = params.limit;
	var currentContents = update.innerHTML;
	update.innerHTML = '<div style="width:100%;text-align:center"><img src="' + Twitter.AjaxLoadImage + '" alt=""/></div>';
	var url = Twitter.AjaxPage + "?user_timeline=" + user;
	if(params.count){url += "&count=" + params.count;}else{url += "&count=20";}
	var parameters = {
		onComplete:function(response) {
			update.innerHTML = currentContents;
			var json = eval(response.text);
			for(var i=0;i<json.length;i++) {
				var twitter = json[i];
				var image = '<img src="' + twitter.user.profile_image_url + '" alt="" style="float:left"/>';
				var userlink = '<span class="TwitterUser"><a href="http://www.twitter.com/' + user + '">' + user + '</a></span> ';
				var time = Twitter.TimePhrase((new Date().getTime() - Twitter.CreatedOn(twitter.created_at)));
				time = 	' <span class="TwitterTime">' +
						'<a href="http://www.twitter.com/' + twitter.user.screen_name + '/statuses/' + twitter.id + '">' + time + '</a></span>';
				var from = ' <span class="TwitterSource">from ' + twitter.source + '</span>';
						
				var html = '<div class="Twitter">';
				if(limit) {
					html += twitter.text + time + from;
				}
				else {
					html += image + userlink + twitter.text + time + from;
				}
				html += '<div style="clear:left"></div></div>';
				update.innerHTML += html;
			}
		}
	};
	new Twitter.Ajax(url,parameters).request();
};

/**
 * formats the twitter date into a js date object'
 * @createdOn: the date returned from twitter
 */
Twitter.CreatedOn = function(createdOn) {
	var parts = createdOn.split(" ");
	parts[4] = "UTC" + parts[4];
	return (new Date(parts.join(" "))).getTime();
};

/**
 *
 */
Twitter.TimePhrase = function(ms) {
	var seconds = ms/1000;
	//correct seconds if less than 1
	//for pc clocks slower than twitter server
	if(seconds < 1) {
		seconds = 1;
	}
	//less than 1 minute
	if(seconds < 60) {
		return "less than " + seconds + " seconds ago";
	}
	//less than 1 hour
	else if(seconds < 3600) {
		var minutes = Math.round(seconds/60);
		if(minutes == 1) {
			return minutes + " minute ago";
		}
		else {
			return minutes + " minutes ago";
		}
	}
	//less than 1 day ago
	else if(seconds < 86400) {
		var hours = Math.round(seconds/3600);
		if(hours == 1) {
			return "about " + hours + " hour ago";
		}
		else {
			return "about " + hours + " hours ago";
		}
	}
	//more than 1 day ago
	else {
		var days = Math.round(seconds/86400);
		if(days == 1) {
			return days + " day ago";
		}
		else {
			return days + " days ago";
		}
	}
};

/**
 *	Twitter ajax object
 *	@sender : either a url for get, form element for post, or javascript object {key:"value"} for post
 *	NOTE: 	if you set sender as a javascript object you must set the action key of parameters {action:"someurl.php"}
 *			also if you set the sender as a form element you must set the action of the form <form action="someurl.php">
 *	@parameters : all the settings for the request
 *		method - sets the method of the request either get or post {method:"get"}, set to get by default
 *		action - the url to send the request to if sender is a javascript object
 *		update - the id of the element to be updated with the response text {update:"elementToUpdate"}
 *		async - sets the request as asyncronous {async:true} or not {async:false}, set to true by default
 *		onComplete - 	accepts a function as an argument that will be executed when the request is completed 
 *						{onComplete:function(response){alert("done!");}}
 *			- the function returns an object (response) that has 1 property
 *				1.) text - holds the responseText.
 *		onFailure - function that will execute if the request fails {onFailure:function(response){alert("failed!");}}
 *			- the function returns an object (response) that has 2 properties
 *				1.) text - holds the responseText
 *				2.) status - holds the status number of the request
 */
Twitter.Ajax = function(sender,parameters) {
	this.request = function() {
		var http = null;
		var method = (parameters.method == null) ? "get" : parameters.method;
		var async = (parameters.async == null) ? true : parameters.async;
		//Firefox,Opera 8.0+,Safari
		try{http = new XMLHttpRequest();}
		catch(e) {
			//Internet Explorer
			try{http = new ActiveXObject("Msxml2.XMLHTTP");}
			catch(e) {
				try{http = new ActiveXObject("Microsoft.XMLHTTP");}
				catch(e) {
					alert("Your browser does not support Ajax!");
					return false;
				}
			}
		}
		http.onreadystatechange = function(){_OnComplete(parameters.onComplete,parameters.onFailure,parameters.update,http)};
		if(typeof sender == "string") {
			http.open(method,sender,async);
			http.send(null);
		}
		else {
			var action = (sender.action == null) ? parameters.action : sender.action;
			var args = this.toQueryString(sender);
			http.open(method,action,async);
			http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length",parameters.length);
			if(!document.all){http.setRequestHeader("Connection","close");}
			http.send(args);
		}
	}
	
	this.toQueryString = function(object) {
		var str = "";
		var count = 0;
		if(object.length) {
			for(var i=0;i<object.length;i++) {
				//filter out ASP.Net system elements
				var sysElem = (	object[i].name == null ||
								object[i].name == "__EVENTTARGET" ||
								object[i].name == "__EVENTARGUMENT" ||
								object[i].name == "__VIEWSTATE");
				if(!sysElem) {
					if(count == 0) {
						str += object[i].name + "=" + encodeURIComponent(object[i].value);
					}
					else {
						str += "&" + object[i].name + "=" + encodeURIComponent(object[i].value);
					}
					count++;
				}
			}
		}
		else {
			for(key in object) {
				if(count == 0) {
					str += key + "=" + encodeURIComponent(object[key]);
				}
				else {
					str += "&" + key + "=" + encodeURIComponent(object[key]);
				}
				count++;
			}
		}
		return str;
	}
}

function _OnComplete(fnComplete,fnFailure,update,http) {
	if(http.readyState == 4) {
		if(http.status == 200) {
			if(fnComplete){fnComplete({text:http.responseText});}
			if(update) {
				if(typeof update == "string")
					update = document.getElementById(update);
				update.innerHTML = http.responseText;
			}
		}
		else {
			if(fnFailure){fnFailure({text:http.responseText,status:http.status});}
		}
	}
}