// -------------------------------------------------------------------------------------------------
//	cChannelModule class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cChannelModule(
)
{

	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cChannelModule.instance = null;
cChannelModule.fGetInstance = function()
{
	return cChannelModule.instance ? cChannelModule.instance : cChannelModule.instance = new cChannelModule();
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fInit = function(
)
{
fDbg("*** cChannelModule, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fFetchChannelInfo = function(
	vReturnFun
)
{
//~ fDbg("*** cChannelModule, fFetchAccountInfo()");
	// reset channels
	cModel.fGetInstance().CHANNEL_LIST = [];
	
	// ---------- simulate a new channel, with some html widgets ----------
	this.fSimulateDefaultChannels(function() {});
	
	cProfile.fGetInstance().fFetchInfo(cModel.fGetInstance().PROFILE_ID, function(vData) {
		cChannelModule.instance.fParseChannelInfo(vData, vReturnFun);
	});
	return;
}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fParseChannelInfo = function(
	vData,
	vReturnFun
)
{
//~ fDbg2("*** cChannelModule, fParseChannelInfo()");
	
	var o;
	o = new cChannelObj(vData);

	// -----------------------------------------------------
	// parse the fetched channel
	// -----------------------------------------------------
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	cChannelModule.instance.fPreloadChannelThumbnails(o);
	
	/*
	fDbg("=================================");
	fDbg("=================================");
	fDbg("=================================");
	fDbg("=================================");
	//~ fDbg(o.mWidgetList[0].mParameterList);
	for (var vTempObj in o.mWidgetList[0].mParameterList)
		fDbg(vTempObj + " : " + o.mWidgetList[0].mParameterList[vTempObj]);

	fDbg("=================================");
	//~ fDbg(o.mWidgetList[1].mParameterList);
	for (var vTempObj in o.mWidgetList[1].mParameterList)
		fDbg(vTempObj + " : " + o.mWidgetList[1].mParameterList[vTempObj]);
	fDbg("=================================");
	fDbg("=================================");
	*/
	
	if (vReturnFun)
		vReturnFun();
}

cChannelModule.prototype.fSimulateDefaultChannels = function(
	vReturnFun
)
{
//~ fDbg("*** cChannelModule, fSimulateDefaultChannels(), ");
	var vThis, o, p, q, i, j, vLen, parser, xmlDoc;
	vThis = this;
	parser = new DOMParser();


	
	cProxy.xmlhttpPost("", "post", {cmd : "GetFileContents", data: "<value>/usr/share/netvserver/docroot/widgets/channelinfo.xml</value>"}, function(vData) {
		
		vData = vData.split("</cmd><data><value>")[1].split("</value></data></xml>")[0];
		
		o = new cChannelObj();
		xmlDoc = parser.parseFromString(vData, "text/xml");
		
		o.mName = xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("name")[0].textContent;
		o.mPlayMode = xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("playmode")[0].textContent;
		//~ o.mPlayMode = "event";
		p = xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("widgets")[0].getElementsByTagName("widget");
		vLen = p.length;
		for (i = 0; i < vLen; i++)
		{
			o.mWidgetList.push(new cWidgetObj());
			o.mWidgetList[o.mWidgetList.length - 1].mName = p[i].getElementsByTagName("name")[0].textContent;
			o.mWidgetList[o.mWidgetList.length - 1].mWidget.mMovie.mHref = p[i].getElementsByTagName("href")[0].textContent;
			o.mWidgetList[o.mWidgetList.length - 1].mWidget.mThumbnail.mHref = p[i].getElementsByTagName("thumbnail")[0].textContent;
			o.mWidgetList[o.mWidgetList.length - 1].mLocalThumbnailPath = p[i].getElementsByTagName("thumbnail")[0].textContent;
			o.mWidgetList[o.mWidgetList.length - 1].mWidget.mMovie.mContentType = p[i].getElementsByTagName("contenttype")[0].textContent;

			q = p[i].getElementsByTagName("parameters");
			if (q.length > 0)
			{
				q = p[i].getElementsByTagName("parameters")[0].getElementsByTagName("parameter");
				o.mWidgetList[o.mWidgetList.length - 1].mParameterList = {};
				for (j = 0; j < q.length; j++)
				{
					o.mWidgetList[o.mWidgetList.length - 1].mParameterList[q[j].getAttribute("name")] = q[j].getAttribute("value");
				}
			}
		}
		cModel.fGetInstance().CHANNEL_LIST.push(o);
		if (vReturnFun)
			vReturnFun();


		vThis.fLoadChannelData();
	});
}

// -------------------------------------------------------------------------------------------------
//	fPreloadChannelThumbnails
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fPreloadChannelThumbnails = function(
	vChannelObj,
	vReturnFun
)
{
	var o, i;

	o = [];
	for (i = 0; i < vChannelObj.mWidgetList.length; i++)
		o.push(vChannelObj.mWidgetList[i].mWidget.mThumbnail.mHref);
		
	var fLoadTN = function() {
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + o[0] + "</value>"}, function(vData) {
			vChannelObj.mWidgetList[vChannelObj.mWidgetList.length - o.length].mLocalThumbnailPath = vData.split("<data><value>")[1].split("</value></data>")[0];
			o.splice(0, 1);
			if (o.length == 0)
			{
				if (vReturnFun)
					vReturnFun();
				return;
			}
			fLoadTN();
		});
	};
	
	fLoadTN();
}

// -------------------------------------------------------------------------------------------------
//	fSaveChannelData
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fLoadChannelData = function(
	vChannelN
)
{
//~ fDbg("*** cChannelModel, fSaveChannelData(), ");
	var o, i;

	cProxy.fGetParams("defaultchanneldata", function(vData) {
		if (!vData || vData == "")
			return;
		vData = JSON.parse(vData);
		for (i = 0; i < cModel.fGetInstance().CHANNEL_LIST[0].mWidgetList.length; i++)
			cModel.fGetInstance().CHANNEL_LIST[0].mWidgetList[i].mParameterList = vData[i];
	});
}

// -------------------------------------------------------------------------------------------------
//	fSaveChannelData
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fSaveChannelData = function(
	vChannelN
)
{
//~ fDbg("*** cChannelModel, fSaveChannelData(), ");
	var o, i;

	o = [];
	for (i = 0; i < cModel.fGetInstance().CHANNEL_LIST[0].mWidgetList.length; i++)
		o.push(cModel.fGetInstance().CHANNEL_LIST[0].mWidgetList[i].mParameterList);
	o = JSON.stringify(o);
	cProxy.fSaveParams("defaultchanneldata", o);
}
