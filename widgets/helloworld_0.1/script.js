/*
	Refer to NeTV API documentation for more information
	[http://wiki.chumby.com/index.php/NeTV_developer_info]
*/

//------------------------------------------------------------------------
// This function is called when widget is loaded
//------------------------------------------------------------------------

function onLoad()
{
	fDebug("Hello World HTML Widget loaded!");
	Hello();
}


//------------------------------------------------------------------------
// Example: obtain parameters from Chumby server
// Parameters from Chumby server (config widget) are passed as GET parameters
// This widget will be loaded as ./widgets/helloworld_0.1/index.html?param1=value1&param2=value2&param3=value3
// To get 'username' variable being passed from Chumby server (config widget), simply use:
//		var my_username = getParameterByName('username');
//------------------------------------------------------------------------

function doSomething()
{
	//Example: get 'secret' variable being passed from Chumby server (config widget)
	//see utils.js
	var my_secret = getGETParameterByName("secret");
	if (my_secret != "")
		fDebug("My secret: " + my_secret);

	//doSomethingElse();
}


//------------------------------------------------------------------------
// Example: Use web services on /bridge to interact with NeTV hardware
// Refer to NeTV API documentation for web services available on /bridge
// [http://wiki.chumby.com/index.php/NeTV_web_services]
// This example use jQuery library
//------------------------------------------------------------------------

function Hello()
{
	//see utils.js
	xmlhttpPost("", "post", { 'cmd' : 'Hello' }, helloCallback );
}

function helloCallback(vData)
{
	if (vData.split("</status>")[0].split("<status>")[1] != "1")
	{
		fDebug("Error while receiving Hello command");
		return;
	}

	var helloData = new Array();
	var helloParamNamesArray = new Array('guid', 'hwver', 'fwver', 'internet', 'mac', 'ip', 'flashplugin', 'flashver');

	for (var idx in helloParamNamesArray)
	{
		var paramName = helloParamNamesArray[idx];
		helloData[paramName] = vData.split("</"+paramName+">")[0].split("<"+paramName+">")[1];
	}

	//Print out the device info to console
	fDebug("Firmware version: " + helloData['fwver']);
	fDebug("Hardware version: " + helloData['hwver']);
	fDebug("MAC Address: " + helloData['mac']);
	fDebug("IP Address: " + helloData['ip']);

	//Show this info in the widget UI (jQuery)
	var content_string = "Firmware version: " + helloData['fwver'] + " - " + "IP Address: " + helloData['ip'];
	$("#div_info").html(content_string);
}