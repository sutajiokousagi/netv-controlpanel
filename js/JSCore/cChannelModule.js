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
//~ fDbg("*** cChannelModule, fInit()");

}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fFetchChannelInfo = function(
	vReturnFun
)
{
//~ fDbg("*** cChannelModule, fFetchAccountInfo()");
	var vThis;
	vThis = this;

	// reset channels
	cModel.fGetInstance().CHANNEL_LIST = [];

	vThis.fSimulateDefaultChannels(function() {
		cProfile.fGetInstance().fFetchInfo(cModel.fGetInstance().PROFILE_ID, function(vData) {
			cChannelModule.instance.fParseChannelInfo(vData, vReturnFun);
		});
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
//~ fDbg("*** cChannelModule, fParseChannelInfo2()");

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
//~ fDbg("*** cChannelModule, fParseChannelInfo()");

	var vThis, o, p, i, j, k;
	vThis = this;
	o = new cChannelObj(vData);

	// -----------------------------------------------------
	// parse the fetched channel
	// -----------------------------------------------------
	//~ cModel.fGetInstance().CHANNEL_LIST.splice(0, 1);
	cModel.fGetInstance().CHANNEL_LIST.push(o);

	//~ fDbg("************* channel " + (cModel.fGetInstance().CHANNEL_LIST.length - 1) + "*********************" + " total : " + cModel.fGetInstance().CHANNEL_LIST.length);
	vThis.pScanWidgetList(o);
	//~ cChannelModule.instance.fPreloadChannelThumbnails(o, [0, 4]);

	for (i = 0; i < o.mWidgetList.length; i++)
	{
		p = null;
		for (j = 0; j < cConst.DEFAULT_WIDGETPEERLIST.length; j++)
			if (cConst.DEFAULT_WIDGETPEERLIST[j].mID == o.mWidgetList[i].mWidget.mID)
			{
				p = cConst.DEFAULT_WIDGETPEERLIST[j];
				break;
			}


		if (i < 10)
		{
			//~ fDbg("----- " + i);
			//~ fDbg(JSON.stringify(o.mWidgetList[i].mParameterList));
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
							//~ fDbg(vData);
						});
					}
				}
			}
		}
	}


	if (vReturnFun)
		vReturnFun();
}

// -------------------------------------------------------------------------------------------------
//	fSaveChannelData
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fLoadChannelData = function(
	vChannelN
)
{
//~ fDbg("*** cChannelModel, fSaveChannelData(), ");
	var o, p, q, i;

	cProxy.fGetParams("defaultchanneldata", function(vData) {
		if (!vData || vData == "")
			return;
		vData = JSON.parse(vData);
		for (i = 0; i < cModel.fGetInstance().CHANNEL_LIST[0].mWidgetList.length; i++)
		{
			o = cModel.fGetInstance().CHANNEL_LIST[0].mWidgetList[i];
			for (p in o.mParameterList)
			{
				for (q in vData[i])
					if (p.toLowerCase() == q.toLowerCase())
						o.mParameterList[p] = vData[i][q];
			}
		}
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
//~ fDbg("*** cChannelModule, fFetchChannelListByUserID(), ");
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

	var vThis, o, p, q, i, j, vCount, parser, xmlDoc;
	vThis = this;
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(vData, "text/xml");

	o = xmlDoc.getElementsByTagName("profiles")[0].getElementsByTagName("profile");
	vCount = cModel.fGetInstance().CHANNEL_LIST.length + o.length;

	for (i = 0; i < o.length; i++)
	{
		cChannelModule.fGetInstance().fFetchChannelInfo2(o[i].getAttribute("id"), function(vData) {
			o = cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CHANNEL_LIST.length - 1];


			//~ fDbg("************* channel " + (cModel.fGetInstance().CHANNEL_LIST.length - 1) + "*********************" + " total : " + cModel.fGetInstance().CHANNEL_LIST.length);
			vThis.pScanWidgetList(o);
			//~ vThis.fPreloadChannelThumbnails(cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CHANNEL_LIST.length - 1], [0, 4], function() { });

			if (cModel.fGetInstance().CHANNEL_LIST.length == vCount)
			{
				// load cModel data from local-copy
				cProxy.fLoadModelData(function() {
					fDbg("load model data complete!");
				});

				if (vReturnFun)
					vReturnFun();
				p = cModel.fGetInstance().CHANNEL_LIST;
				for (j = p.length - 1; j > 1; j--)
					if (p[j].mID == p[1].mID)
					{
						q = cModel.fGetInstance().CHANNEL_LIST.splice(j, 1);
						break;
					}
			}
		});
	}

	cProxy.fLoadModelData(function() {
		fDbg("load model data once............");
	});
}

// -------------------------------------------------------------------------------------------------
//	pScanWidgetList - update mHref according to mNeTVCompatiable & mPeerWidget
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.pScanWidgetList = function(
	vChannelObj,
	vReturnFun
)
{
//~ fDbg("*** cChannelModule, pScanWidgetList()");
	var vThis, o, p, i;

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
			//~ fDbg("match ----------------> " + cModel.fGetInstance().CHANNEL_LIST.indexOf(vChannelObj) + " - " + i);
			vChannelObj.mWidgetList[i].mNeTVCompatiable = true;
			vChannelObj.mWidgetList[i].mPeerWidget.mID = p.mPeerWidget.mID;
			vChannelObj.mWidgetList[i].mPeerWidget.mHref = p.mPeerWidget.mHref;
			vChannelObj.mWidgetList[i].mNeedAuth = p.mNeedAuth;
			//~ fDbg("need auth : " + vChannelObj.mWidgetList[i].mNeedAuth);
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

cChannelModule.prototype.fProcessChannelInfoXML = function(
	vData,
	vReturnFun
)
{
	var vThis, o, p, q, i, j, vLen, parser, xmlDoc;
	vThis = this;
	parser = new DOMParser();

	o = new cChannelObj();
	xmlDoc = parser.parseFromString("<xml>" + vData + "</xml>", "text/xml");
	o.mName = xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("name")[0].textContent;
	o.mPlayMode = xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("playmode")[0].textContent;
	p = xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("widgets")[0].getElementsByTagName("widget");
	vLen = p.length;
	for (i = 0; i < vLen; i++)
	{
		o.mWidgetList.push(new cWidgetObj());
		o.mWidgetList[o.mWidgetList.length - 1].mID = "xxxx_0000_" + i;
		o.mWidgetList[o.mWidgetList.length - 1].mName = p[i].getElementsByTagName("name")[0].textContent;
		o.mWidgetList[o.mWidgetList.length - 1].mWidget.mMovie.mHref = p[i].getElementsByTagName("href")[0].textContent;
		o.mWidgetList[o.mWidgetList.length - 1].mWidget.mThumbnail.mHref = p[i].getElementsByTagName("thumbnail")[0].textContent;
		o.mWidgetList[o.mWidgetList.length - 1].mLocalThumbnailPath = p[i].getElementsByTagName("thumbnail")[0].textContent;
		o.mWidgetList[o.mWidgetList.length - 1].mWidget.mMovie.mContentType = p[i].getElementsByTagName("contenttype")[0].textContent;
		o.mWidgetList[o.mWidgetList.length - 1].mNeTVCompatiable = true;
		o.mWidgetList[o.mWidgetList.length - 1].mEnabled = true;
		if (p[i].getElementsByTagName("needauth")[0])
			o.mWidgetList[o.mWidgetList.length - 1].mNeedAuth = p[i].getElementsByTagName("needauth")[0].textContent;

		q = p[i].getElementsByTagName("parameters");
		if (q.length > 0)
		{
			q = p[i].getElementsByTagName("parameters")[0].getElementsByTagName("parameter");
			o.mWidgetList[o.mWidgetList.length - 1].mParameterList = {};
			for (j = 0; j < q.length; j++)
				o.mWidgetList[o.mWidgetList.length - 1].mParameterList[q[j].getAttribute("name")] = q[j].getAttribute("value");
		}
	}
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	cModel.fGetInstance().CHANNEL_CURRENT = o;

	if (vReturnFun)
		vReturnFun();

	vThis.fLoadChannelData();
}

cChannelModule.prototype.fSimulateDefaultChannels = function(
	vReturnFun
)
{
//~ fDbg("*** cChannelModule, fSimulateDefaultChannels(), ");
	var vThis = this;

	//try reading from new docroot location
	cProxy.xmlhttpPost("", "post", {cmd : "GetChannelInfo"}, function(vData) {

		if (vData)
			vData = vData.split("</cmd><data><value>")[1].split("</value></data></xml>")[0];
		var notFound = (!vData || vData.length <= 0 || vData == "file not found");

		//ok, perform callback with data
		if (!notFound) {
			vThis.fProcessChannelInfoXML(vData, vReturnFun);
			return;
		}

		//fallback to life support location
		cProxy.xmlhttpPost("", "post", {cmd : "GetChannelInfo", data: "<value>default</value>"}, function(vData) {
			if (vData)
				vData = vData.split("</cmd><data><value>")[1].split("</value></data></xml>")[0];

			vThis.fProcessChannelInfoXML(vData, vReturnFun);
		});
	});
}

// -------------------------------------------------------------------------------------------------
//	fPreloadChannelThumbnails
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fPreloadChannelThumbnails = function(
	vChannelObj,
	vRange,			// [start, count]
	vReturnFun
)
{
//~ fDbg("cChannelModule, fPreloadChannelThumbnails(), ");
	var o, i, p;

	o = [];
	for (i = vRange[0]; i < vChannelObj.mWidgetList.length; i++)
	{
		o.push(vChannelObj.mWidgetList[i].mWidget.mThumbnail.mHref);
		if (o.length >= vRange[1])
			break;
	}
	p = cModel.fGetInstance().CHANNEL_LIST.indexOf(vChannelObj);

	i = vRange[0];
	var fLoadTN = function() {
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + o[0] + "</value>"}, function(vData) {
			vChannelObj.mWidgetList[i].mLocalThumbnailPath = vData.split("<data><value>")[1].split("</value></data>")[0];
//~ fDbg(p + "-" + i + " : " + vChannelObj.mWidgetList[i].mLocalThumbnailPath.substr(64));
			i++;
			o.splice(0, 1);
			if (o.length == 0)
			{
				if (vReturnFun)
					vReturnFun([p, i - 1]);
//~ fDbg("preloading images complete...");
				return;
			}
			fLoadTN();
		});
	};

	fLoadTN();
}
