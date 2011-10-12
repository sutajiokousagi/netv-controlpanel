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

