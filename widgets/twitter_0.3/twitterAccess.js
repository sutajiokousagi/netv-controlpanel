
function getAccessTokenOAuthFalse()
{
    //~ fDbg("*** getAccessTokenOAuthFalse()");
    fXMLHttpRequest(vBridgePath,
		    "post",
		    {cmd : "GetParam",
		     data : "<value>twitter_oauth</value>"},
		    function(vData) {
			//~ fDbg(vData);
			var jsonDoc = $.xml2json(vData);
			var twitter_oauth = jsonDoc["data"]["value"];
			//~ fDbg("Access Token: " + access_token);
			
			if ("" != twitter_oauth)
			{
			    $('#result').append("<b>Get Saved Access Token: </b>" + twitter_oauth + "<br />");
			    oauth_token = twitter_oauth.split("|~|")[0];
			    oauth_token_secret = twitter_oauth.split("|~|")[1];
			    
			    twitterAccess(oauth_token, oauth_token_secret);
			}
			else{
			    $('#result').append("<b>No Access Token, Starting OAuth!</b>" +  "<br />");
			    //startOAuth();
			    fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", data : "<message>" + "Please configure your Twitter settings from the control panel!" +  "</message>"+ "<image>"+picUrl+"</image>"}, function(vData) {
	      			// console.log(vData)
			    });
			}
		    });
}

function getAccessTokenOAuthTrue()
{
    //~ fDbg("*** getAccessTokenOAuthTrue()");    
    fXMLHttpRequest(vBridgePath,
		    "post",
		    {cmd : "GetParam",
		     data : "<value>twitter_oauth</value>"},
		    function(vData) {
			//~ fDbg(vData);
			var jsonDoc = $.xml2json(vData);
			var twitter_oauth = jsonDoc["data"]["value"];
			//~ fDbg("Access Token: " + access_token);
			
			//~ access_token = "";
			if ("" != access_token)
			{
			    $('#result').append("<b>Get Saved Access Token: </b>" + twitter_oauth + "<br />");
			    $('#result').append("<b>You have already configured your Twitter account, please go back. ^_^ </b>" + "<br />");
			    
			    var vMsg = "<div style='margin-top: 50px; line-height: 200%; text-align: center; font-size: 36px; color: 33FF33;'>Your Twitter account is already authenticated.</div>";
			    //~ vMsg = encodeURIComponent(vMsg);
			    
			    fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", message: vMsg, type: "foroauth"}, function(vData) {
				
			    });
			}
			else{
			    if ("" != username)
			    {
			    	$('#result').append("<b>No Access Token, Waitng xAuth!</b>" +  "<br />");
				twitterXAuth(username, password);
			    } else {
				fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", message: "false", type: "foroauth"}, function(vData) {});

			    }
			}
		    });
}


function twitterXAuth(username, password)
{
    $('#result').append("<h3>Start xAuth Using YQL</h3>");

    // Prepare the YQL Query 
    var query_xAuth = "select * from twitter.xauth.token where oauth_consumer_secret='" + consumer_secret +
	"' AND oauth_consumer_key='" + consumer_key +
	"' AND username='" + username +
	"' AND password='" + password + "'";

    // The YQL url for xAuth
    var yql_xAuth = "https://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query_xAuth)+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"; 

    // Show the YQL url, for debugging
    $('#result').append("<b>YQL Query: </b>" + yql_xAuth + "<br >");

    // Get the access_token & access_token_secret
    // Store them in in the /psp/parameter.ini
    $.getJSON(yql_xAuth, function(data) {
	$('#result').append("<b>xAuth Results: </b>" + JSON.stringify(data) + "<br >");
	var result = data['query']['results']['result'];

	var xAuth = result.split("&");

	var oauth_token = xAuth[0].split("=")[1];
	var oauth_token_secret = xAuth[1].split("=")[1];

	var twitter_oauth = oauth_token + "|~|" + oauth_token_secret;

	saveAccessToken(twitter_oauth, callBackFunc);

    });

}

function saveAccessToken(twitter_oauth, callBackFunc)
{
    fXMLHttpRequest(vBridgePath,
		    "post",
		    {cmd : "SetParam",
		     data : "<twitter_oauth>"+twitter_oauth+"</twitter_oauth>"},
		    function(vData) {
			var jsonDoc = $.xml2json(vData);
			//~ fDbg(JSON.stringify(jsonDoc));
			$('#result').append("<b>Access Token Saved: </b>" + JSON.stringify(jsonDoc) + "<br />");

			var vMsg = "<div style='margin-top: 50px; line-height: 200%; text-align: center; font-size: 36px; color: 33FF33;'>Your Twitter account is already authenticated.</div>";
			//~ vMsg = encodeURIComponent(vMsg);
			
			fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", message: vMsg, type: "foroauth"}, function(vData) {
			    
			});
		    }




		    function twitterAccess(access_token, access_token_secret)
		    {
			var query_timeline = "select * from twitter.status.timeline.friends where oauth_consumer_secret='" + consumer_secret +
			    "' AND oauth_consumer_key='" + consumer_key +
			    "' AND oauth_token='" + oauth_token +
			    "' AND oauth_token_secret='" + oauth_token_secret+ "'";

			var yql_timeline = "https://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query_timeline)+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"; 

			
			// Get users' timeline using yql;
			$.getJSON(yql_timeline, function(data) {
			    processNewsFeed(data);
			});

		    }


		    function processNewsFeed(data)
		    {
			var news = data["query"]["results"]["statuses"]["status"];

			for (var i=0; i<2; i++)
			{
    			    var msgTitle = news[i]["user"]["screen_name"];
    			    var msgBody = news[i]["text"];
    			    var msgPic = news[i]["user"]["profile_image_url"];
    			    if (!msgPic)
    				msgPic = picUrl;

    			    $('#result').append("<b>Data: </b>" + msgTitle + "    " + msgBody + "    " + msgPic +  "<br />");


    			    sendMsgToBridge(msgTitle, msgBody, msgPic);
			}
		    }



		    function accessFacebook(access_token)
		    {
			$('#result').append("<h3>Access Facebook</h3>");

			$.getJSON(
    			    'https://graph.facebook.com/me/home?access_token='+access_token+'&callback=?',
    			    function(data)
    			    {
				//~ fDbg(JSON.stringify(data));
				if (!data["data"])
				{
				    startOAuth();
				} else {
				    processNewsFeed(data);
				}
    			    }
			);
		    }




