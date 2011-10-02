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
cChannelModule.prototype.fFetchChannelInfo2 = function(
	vChannelID,
	vReturnFun
)
{
	cProfile.fGetInstance().fFetchInfo(vChannelID, function(vData) {
		cChannelModule.instance.fParseChannelInfo2(vData, vReturnFun);
	});
	return;
}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fParseChannelInfo2 = function(
	vData,
	vReturnFun
)
{
//~ fDbg2("*** cChannelModule, fParseChannelInfo()");
	
	var o, p, i, j, k;
	o = new cChannelObj(vData);
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	
	if (vReturnFun)
		vReturnFun();
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
	
	var o, p, i, j, k;
	o = new cChannelObj(vData);
	
	// -----------------------------------------------------
	// parse the fetched channel
	// -----------------------------------------------------
	//~ cModel.fGetInstance().CHANNEL_LIST.splice(0, 1);
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	cChannelModule.instance.fPreloadChannelThumbnails(o, 4);
	
	fDbg("=================================");
	fDbg(cModel.fGetInstance().CHANNEL_LIST.length);
	
	for (i = 0; i < o.mWidgetList.length; i++)
	{
		p = null;
		for (j = 0; j < cConst.DEFAULT_WIDGETPEERLIST.length; j++)
			if (cConst.DEFAULT_WIDGETPEERLIST[j].mID == o.mWidgetList[i].mWidget.mID)
			{
				p = cConst.DEFAULT_WIDGETPEERLIST[j];
				break;
			}
		if (p && p.mNeTVCompatiable)
		{
			o.mWidgetList[i].mNeTVCompatiable = true;
			o.mWidgetList[i].mPeerWidget.mID = p.mPeerWidget.mID;
			o.mWidgetList[i].mPeerWidget.mHref = p.mPeerWidget.mHref;
			
			if (i == 1)
			{
				for (var vTempObj in p.mPeerParameters)
				{
					//~ fDbg(vTempObj + " : " + p.mPeerParameters[vTempObj]);
					//~ fDbg("widget param : " + o.mWidgetList[i].mParameterList[vTempObj]);
					if (o.mWidgetList[i].mParameterList[vTempObj] == undefined)
					{
						// save to o.mWidgetList[i], data {vTempObj : ""}
						cWidgetInstance.fGetInstance().fConfigure(o.mWidgetList[i].mID, null, null, null, {"vTempObj" : ""}, function(vData) {
							fDbg(vData);
						});
					}
				}
			}
		}
	}
	
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
			o.mWidgetList[o.mWidgetList.length - 1].mNeTVCompatiable = true;
			
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
		cModel.fGetInstance().CHANNEL_CURRENT = o;
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
	vN,
	vReturnFun
)
{
//~ fDbg("cChannelModule, fPreloadChannelThumbnails(), ");
	var o, i;

	o = [];
	for (i = 0; i < vChannelObj.mWidgetList.length; i++)
	{
		o.push(vChannelObj.mWidgetList[i].mWidget.mThumbnail.mHref);
		if (i + 1 == vN)
			break;
	}
	i = 0;
	var fLoadTN = function() {
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + o[0] + "</value>"}, function(vData) {
			vChannelObj.mWidgetList[i].mLocalThumbnailPath = vData.split("<data><value>")[1].split("</value></data>")[0];
			fDbg(vChannelObj.mWidgetList[i].mLocalThumbnailPath);
			i++;
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





























// -------------------------------------------------------------------------------------------------
//	fFetchChannelListByUserID
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fFetchChannelListByUserID = function(
	vReturnFun
)
{
fDbg("*** cChannelModule, fFetchChannelListByUserID(), ");
	cProfile.fGetProfileListByAccountID(cModel.fGetInstance().USER_ID, function(vData) {
		cChannelModule.fGetInstance().fParseChannelList(vData, vReturnFun);
	});
}

// -------------------------------------------------------------------------------------------------
//	fParseChannelList
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fParseChannelList = function(
	vData,
	vReturnFun
)
{
fDbg("*** cChannelModule, fParseChannelList()");
	
	var vThis, o, p, i, j, k;
	vThis = this;
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(vData, "text/xml");
	
	o = xmlDoc.getElementsByTagName("profiles")[0].getElementsByTagName("profile");
	for (i = 0; i < o.length; i++)
	{
		cChannelModule.fGetInstance().fFetchChannelInfo2(o[i].getAttribute("id"), function(vData) {
			o = cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CHANNEL_LIST.length - 1];
			vThis.pScanWidgetList(o);
			vThis.fPreloadChannelThumbnails(cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CHANNEL_LIST.length - 1], 4, function() {
				
			});
		});
	}
}

// -------------------------------------------------------------------------------------------------
//	pScanWidgetList
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.pScanWidgetList = function(
	vChannelObj,
	vReturnFun
)
{
//~ fDbg("*** cChannelModule, pScanWidgetList()");
	var vThis, o, p, i;
	
	if (vChannelObj.mID == cModel.fGetInstance().CHANNEL_LIST[1].mID)
	{
		cModel.fGetInstance().CHANNEL_LIST.splice(cModel.fGetInstance().CHANNEL_LIST.indexOf(vChannelObj), 1);
		return;
	}

	// update mHref according to mNeTVCompatiable & mPeerWidget
	for (i = 0; i < vChannelObj.mWidgetList.length; i++)
	{
		p = null;
		for (j = 0; j < cConst.DEFAULT_WIDGETPEERLIST.length; j++)
			if (cConst.DEFAULT_WIDGETPEERLIST[j].mID == vChannelObj.mWidgetList[i].mWidget.mID)
			{
				p = cConst.DEFAULT_WIDGETPEERLIST[j];
				break;
			}
		
		if (p && p.mNeTVCompatiable)
		{
			//~ fDbg("match ----------------> " + i);
			vChannelObj.mWidgetList[i].mNeTVCompatiable = true;
			vChannelObj.mWidgetList[i].mPeerWidget.mID = p.mPeerWidget.mID;
			vChannelObj.mWidgetList[i].mPeerWidget.mHref = p.mPeerWidget.mHref;
			/*
			if (i == 1)
				for (var vTempObj in p.mPeerParameters)
					if (o.mWidgetList[i].mParameterList[vTempObj] == undefined)
					{
						// save to o.mWidgetList[i], data {vTempObj : ""}
						cWidgetInstance.fGetInstance().fConfigure(o.mWidgetList[i].mID, null, null, null, {"vTempObj" : ""}, function(vData) {
							fDbg(vData);
						});
					}
			*/
		}
	}
}
