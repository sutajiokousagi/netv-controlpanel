function sendMsgToBridge(msgTitle, msgBody, msgPic)
{
	
	//~ fDbg("************** send from FB widget ****************");
	//~ fDbg(msgTitle);
	//~ fDbg(msgBody);
	//~ fDbg(msgPic);
	
	fXMLHttpRequest(vBridgePath, "post", {cmd : "TickerEvent", message : msgBody, title: msgTitle, image: msgPic}, function(vData) {
		
	});
	
	/*
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
	*/
}
