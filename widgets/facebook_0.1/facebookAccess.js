function getAccessToken()
{
    fXMLHttpRequest(vBridgePath,
		    "post",
		    {cmd : "GetParam",
		     data : "<value>facebook_access_token</value>"},
		    function(vData) {
			console.log(vData);
			var jsonDoc = $.xml2json(vData);
			var access_token = jsonDoc["data"]["value"];
			console.log("Access Token: " + access_token);
			if ("" != access_token)
			{
			    $('#result').append("<b>Get Saved Access Token: </b>" + access_token + "<br />");
			    accessFacebook(access_token);
			} else
			{
			    $('#result').append("<b>No Access Token, Starting OAuth!</b>" +  "<br />");
			    startOAuth();
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
	    processNewsFeed(data);
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

	sendMsgToBridge(msgTitle, msgBody, msgPic);
    }
}

function sendMsgToBridge(msgTitle, msgBody, msgPic)
{
    fXMLHttpRequest(vBridgePath,
		    "post",
		    {
			cmd : "TickerEvent",
			data : "<message>" + msgBody +  "</message>" +
			    "<title>" + msgTitle + "</title>" +
			    "<image>"+msgPic+"</image>"
		    },
		    function(vData) {console.log(vData)}
		   );
}

