

function getAccessTokenOAuthFalse()
{
//~ fDbg("*** getAccessTokenOAuthFalse()");
    fXMLHttpRequest(vBridgePath,
		    "post",
		    {cmd : "GetParam",
		     data : "<value>facebook_access_token</value>"},
		    function(vData) {
			//~ fDbg(vData);
			var jsonDoc = $.xml2json(vData);
			var access_token = jsonDoc["data"]["value"];
			//~ fDbg("Access Token: " + access_token);
			
			if ("" != access_token)
			{
			    $('#result').append("<b>Get Saved Access Token: </b>" + access_token + "<br />");
			    accessFacebook(access_token);
			}
			else{
			    $('#result').append("<b>No Access Token, Starting OAuth!</b>" +  "<br />");
			    //startOAuth();
			    fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", data : "<message>" + "Please configure your Facebook settings from the control panel!" +  "</message>"+ "<image>"+picUrl+"</image>"}, function(vData) {
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
		     data : "<value>facebook_access_token</value>"},
		    function(vData) {
			//~ fDbg(vData);
			var jsonDoc = $.xml2json(vData);
			var access_token = jsonDoc["data"]["value"];
			//~ fDbg("Access Token: " + access_token);
			
			//~ access_token = "";
			if ("" != access_token)
			{
			    $('#result').append("<b>Get Saved Access Token: </b>" + access_token + "<br />");
			    $('#result').append("<b>You have already configured your Facebook account, please go back. ^_^ </b>" + "<br />");
			    
			    var vMsg = "<div style='margin-top: 50px; line-height: 200%; text-align: center; font-size: 36px; color: 33FF33;'>Your facebook account is already authenticated.</div>";
				//~ vMsg = encodeURIComponent(vMsg);
				
			    fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", message: vMsg, type: "foroauth"}, function(vData) {
			
				});

			}
			else{
			    $('#result').append("<b>No Access Token, Starting OAuth!</b>" +  "<br />");
			    
			    startOAuth();
			    
			    // fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", data : "<message>" + "Plese go to ControlPanel to config your facebook account!" +  "</message>"+ "<image>"+picUrl+"</image>"}, function(vData) {
	      		    // 	// console.log(vData)
			    // });
			}
		    });

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



function processNewsFeed(data)
{
    var news = data["data"];

    for (var i=0; i<2; i++)
    {
	var msgTitle = news[i]["from"]["name"];
	var msgBody = news[i]["message"];
	var msgPic = news[i]["picture"];
	if (!msgPic)
	    msgPic = picUrl;

	$('#result').append("<b>Data</b>" + msgTitle + "    " + msgBody + "    " + msgPic +  "<br />");

	if ('undefined' != msgBody)
	    sendMsgToBridge(msgTitle, msgBody, msgPic);
    }
}

