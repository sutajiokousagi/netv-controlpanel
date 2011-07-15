// -------------------------------------------------------------------------------------------------
//	cWEEvent class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cWEEvent(
	vDivObj
)
{
	this.mDiv = vDivObj;

	this.mMessageList = [

	];
	this.mPrevMessage = "";
	this.mEventEngineInterval = null;

		
	this.mUpdateTimeInterval = setInterval(function() {
		cWEEvent.instance.fUpdateTime();
	}, 5000);
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cWEEvent.instance = null;
cWEEvent.fGetInstance = function(
	vDivObj
)
{
	return cWEEvent.instance ? cWEEvent.instance : cWEEvent.instance = new cWEEvent(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fInit = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cWEEvent, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fShow = function(
)
{
	this.mDiv.show();
}

cWEEvent.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fSlideUp / fSlideDown
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fSlideUp = function(
	vReturnFun
)
{
	var vSize;
	vSize = [this.mDiv.css("width"), this.mDiv.css("height")];

	this.mDiv.css("top", "719px");
	this.mDiv.animate({
		top: "-=" + vSize[1]
	}, 300, function() {
		if (vReturnFun)
			vReturnFun();
	});
}

cWEEvent.prototype.fSlideDown = function(
	vReturnFun
)
{
	var vSize;
	vSize = [this.mDiv.css("width"), this.mDiv.css("height")];
	
	this.mDiv.css("top", (719 - parseInt(vSize[1].split("px")[0])) + "px");
	this.mDiv.animate({
		top: "+=" + vSize[1]
	}, 300, function() {
		if (vReturnFun)
			vReturnFun();
	});
}

// -------------------------------------------------------------------------------------------------
//	fReset
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fReset = function(
	vReturnFun
)
{
	if (this.mEventEngineInterval != null)
          clearInterval(this.mEventEngineInterval);
	$("#div_eventWidgetPlayer").children("#div_eventWidgetPlayer_crawling").css("left", "1179px");
}

// -------------------------------------------------------------------------------------------------
//	fUpdateTime
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fUpdateTime = function(
	vReturnFun
)
{
	var runTime = new Date();
	var hours = runTime.getHours();
	var minutes = runTime.getMinutes();
	$("#div_eventWidgetPlayer_mini").children("#time_top").html(hours + ":" + minutes);
}

// -------------------------------------------------------------------------------------------------
//	fActivate
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fActivate = function(
	vReturnFun
)
{
	this.fCrawlMessage("aaaaaaaaaaaaaaaaaaaaa");
	this.mEventEngineInterval = setInterval(function() {
		cWEEvent.instance.fCrawlMessage("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
	}, 20000);
}

// -------------------------------------------------------------------------------------------------
//	fCrawlMessage
// -------------------------------------------------------------------------------------------------
cWEEvent.prototype.fCrawlMessage = function(
	vData,
	vReturnFun
)
{
	$("#div_eventWidgetPlayer_crawling_text").html(vData);
	$("#div_eventWidgetPlayer_crawling").animate({
		left: "-=1179px"
	}, 5000, function() {
		
	}).delay(4000).animate({
		top: "+=68px"
	}, 800, function() {
		$("#div_eventWidgetPlayer_crawling").css("top", "0px");
		$("#div_eventWidgetPlayer_crawling").css("left", "1179px");
	});
}
