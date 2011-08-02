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
fDbg2("*** cChannelModule, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cChannelModule.prototype.fFetchChannelInfo = function(
	vReturnFun
)
{
fDbg2("*** cChannelModule, fFetchAccountInfo()");

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
fDbg2("*** cChannelModule, fParseChannelInfo()");
	
	var o;
	o = new cChannelObj(vData);
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	cChannelModule.instance.fPreloadChannelThumbnails(o);
	
	// simulate a new channel, with some html widgets
	o = new cChannelObj();
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	o.mWidgetList = [new cWidgetObj(), new cWidgetObj(), new cWidgetObj()];
	o.mWidgetList[0].mWidget.mMovie.mHref = "http://localhost/widgets/twitter0.1/index.html";
	o.mWidgetList[1].mWidget.mMovie.mHref = "http://localhost/widgets/twitter0.2/index.html";
	o.mWidgetList[2].mWidget.mMovie.mHref = "http://localhost/widgets/google_news_0.1/index.html";
	
	if (vReturnFun)
		vReturnFun();
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
