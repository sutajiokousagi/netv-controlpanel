
/*
	Send a TickerEvent command to the hardware bridge
 */
function sendMsgToBridge(msgTitle, msgBody, msgPic)
{	
	fXMLHttpRequest(vBridgePath,
			"post",
			{
				cmd : "TickerEvent",
				message : msgBody,
				title: msgTitle,
				image: msgPic
			},
			function(vData) { }
			);
}


function fDbg(v)
{
	console.log("|~|" + v);
}
