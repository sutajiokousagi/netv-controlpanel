// -------------------------------------------------------------------------------------------------
//	cModuleEventTicker class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleEventTicker(
	vDivObj
)
{
	this.mDiv = vDivObj;

	this.mTheme = {
		mStampSize : [80, 50]
	};

	// timer
	this.mTimer = null;
	this.mCounterTimer = 0;
	this.mCounterStampClock = 0;
	this.mCounterStampClockOrigin = null;
	this.mTimeSpanStamp = 0;


	//~ this.mStaticPeriod = 5000;
	this.mVisibleOnScreen = false;
	
	
	// main control
	this.mEnabled = false;

	// main ticker event 
	this.mEventList = [];				// [[ID, [message, title, image], displaycount], [...], [...], ...]
	this.mPlayStatus = null;			//	null | stopped | paused
	this.mEnableCrawlMessages = false;
	
	// stamp ticker event
	this.mStampEventList = [];			// [[ID, [message, title, image], displaycount], [...], [...], ...]
	this.mStampPlayStatus = null;
	
	
	this.mStopAfterLastEvent = false;
	this.mStopNow = false;



	this.mConfigMode = null; 				// null | configmode1 | configmode2
	this.mStyle = {
		mTickerWidth: 80,
		mTickerHeight: 50,
		mBottomOffset: 40,
		mCrawlerHeight: 50,
		mCrawlerWidth: 1160
	}
	
	//~ this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cModuleEventTicker.instance = null;
cModuleEventTicker.fGetInstance = function(
	vDivObj
)
{
	return cModuleEventTicker.instance ? cModuleEventTicker.instance : (cModuleEventTicker.instance = new cModuleEventTicker(vDivObj));
}

/** -------------------------------------------------------------------------------------------------
	fInit
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fInit = function(
)
{
	var vThis;
	vThis = this;
	
	this.mTimer = setInterval(function() {
		mCounterStampClockOrigin = 0;
		vThis.fOnSignal("timerinterval", null, null);
	}, 20);
	this.fReset();

	vThis.pEnabled(true);
	vThis.fAnimateIn();
	vThis.mEnabled = true;
}

/** -------------------------------------------------------------------------------------------------
	fOnSignal
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cModuleEventTicker, fOnSignal(), " + vSignal + ", " + vData);
	var i, o, vThis;
	vThis = this;
	
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
		if (!vThis.mConfigMode)
			vThis.pConfigMode("configmode1");
		else if (vThis.mConfigMode == "configmode1")
			vThis.pConfigMode("configmode2");
		else if (vThis.mConfigMode == "configmode2")
			vThis.pConfigMode(null);
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (vThis.mConfigMode)
		{
			if (vThis.mStyle.mBottomOffset + vThis.mStyle.mTickerHeight + 10 < 710)
			{
				vThis.mDiv.css("top", "-=10px");
				vThis.mStyle.mBottomOffset += 10;
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (vThis.mConfigMode)
		{
			if (vThis.mStyle.mBottomOffset - 10 > 10)
			{
				vThis.mDiv.css("top", "+=10px");
				vThis.mStyle.mBottomOffset -= 10;
			}
		}
		break;
	}
	
	switch (vSignal)
	{
	case "timerinterval":
		vThis.mCounterTimer++;

		o = Math.floor((vThis.mCounterTimer - vThis.mCounterStampClockOrigin) / 20);
		if (o != vThis.mCounterStampClock)
		{
			vThis.mCounterStampClock = o;
			vThis.fUpdateClock();
		}
		
		if (vThis.mPlayStatus == "playing" && vThis.mEnabled)
		{	
			vThis.fCrawlMessages();
			vThis.fCheckNewMessage();
			vThis.fCheckLeadingMessage();
		}
		if (vThis.mStampPlayStatus == "playing" && vThis.mEnabled)
		{
			vThis.fCrawlStampMessages();
			vThis.fCheckStampNewMessage();
			vThis.fCheckStampLeadingMessage();
		}
		break;
	}
}





/**
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	visual / animation funcitons
 * ------------------------------------------------------------------------------------------------- */
/** -------------------------------------------------------------------------------------------------
	fShow / fHide
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fShow = function(
)
{
	this.mDiv.show();
}

cModuleEventTicker.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

/** -------------------------------------------------------------------------------------------------
	fAnimateIn / fAnimateOut
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fAnimateIn = function(
	vReturnFun
)
{
//~ fDbg("*** cModuleEventTicker, fAnimateIn(), ");
fDbg("----> event list length : " + this.mEventList.length);
if (this.mEnabled == false)
	return;
	var vThis, vTopStart, vTopFinal
	vThis = this;

	vTopFinal = 719 - (vThis.mStyle.mBottomOffset + vThis.mStyle.mTickerHeight);
	if (vTopFinal < 340)
		vTopStart = -80;
	else
		vTopStart = 719;
	
	
	this.mDiv.show();
	this.mDiv.css("top", vTopStart + "px");
	this.mDiv.animate({
		top: vTopFinal + "px"
	}, 500, function() {
		vThis.mVisibleOnScreen = true;
		if (vReturnFun)
			vReturnFun();
	});
}

cModuleEventTicker.prototype.fAnimateOut = function(
	vReturnFun
)
{
//~ fDbg("*** cModuleEventTicker, fAnimateOut(), ");
	var vThis, vTopStart, vTopFinal;
	vThis = this;
	vTopFinal = 719 - (vThis.mStyle.mBottomOffset + vThis.mStyle.mTickerHeight);
	if (vTopFinal < 340)
		vTopStart = -80;
	else
		vTopStart = 719;
	
	this.mDiv.css("top", vTopFinal + "px");
	this.mDiv.animate({
		top: vTopStart + "px"
	}, 500, function() {
		vThis.mVisibleOnScreen = false;
		if (vReturnFun)
			vReturnFun();
	});

	this.pConfigMode(null);
}





/**-------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	main event ticker functions
 * ------------------------------------------------------------------------------------------------- */
/** -------------------------------------------------------------------------------------------------
	fUpdateClock
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fUpdateClock = function(
	vReturnFun
)
{
	this.mTimeSpanStamp++;
	var runTime = new Date();
	var hours = runTime.getHours();
	var minutes = runTime.getMinutes();
	
	if (hours < 10)
		hours = "0" + hours;
	if (minutes < 10)
		minutes = "0" + minutes;
	$("#stamp_text_container").html(hours + ":" + minutes);
	
	if (this.mTimeSpanStamp > 20)
	{
		if ($("#stamp_text_container").is(":visible"))
			$("#stamp_text_container").fadeOut(function() {
				$("#stamp_logo").fadeIn();
			});
		else
			$("#stamp_logo").fadeOut(function() {
				$("#stamp_text_container").fadeIn();
			});
		this.mTimeSpanStamp = 0;
	}
}





/**
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	
 * ------------------------------------------------------------------------------------------------- */
/** -------------------------------------------------------------------------------------------------
	fAddEvent
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fAddEvent = function(
	vEventData,
	vTop	// true | false
)
{
fDbg("*** cModuleEventTicker, fAddEvent(), ");

	var o = String(new Date().getTime());
	this.mEventList.push([vEventData, o, 3]);
if (this.mEnabled == false)
	return;
	
	if (!this.mPlayStatus || this.mPlayStatus == "paused" || this.mPlayStatus == "stopped")
	{
		this.fActivateMainTicker();
		this.mPlayStatus = "paused";
	}
}

/** -------------------------------------------------------------------------------------------------
	fActivateMainTicker
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fActivateMainTicker = function(
)
{
	var vThis, i, o, p, vLeft, vWidth, vRight, vContainerWidth, vID, vTraceInterval;
	vThis = this;
	vContainerWidth = 1279 - 80;
	
	if (vThis.mEventList.length == 0 || $("#crawling_container").children().length > 0)
		return;
		
	fDbg("==================================== ACTIVATE =========================================");
	vThis.fAddNextEventToContainer(0, true);
	$("#div_eventWidgetPlayer_crawling").css("left", vContainerWidth + "px");
	$("#div_eventWidgetPlayer_crawling").animate({
		left : "0px"
	}, 5000, function() {
		//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		//~ fDbg("DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE");
		//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		vThis.mPlayStatus = "playing";
	});
}

cModuleEventTicker.prototype.fAddNextEventToContainer = function(
	vIndex,
	vIsFirstMessage
)
{
	var vThis, vID;
	vThis = this;
	
	if (vIsFirstMessage)
		vThis.fAppendMessageDivFromEvent(vIndex, 1190, null);
	else
		vThis.fAppendMessageDivFromEvent(vIndex, null, 1200);
	
	vThis.mEventList[0][2]--;
	if (vThis.mEventList[0][2] == 0)
		vThis.mEventList.splice(0, 1);
}

cModuleEventTicker.prototype.fAppendMessageDivFromEvent = function(
	vIndex,
	vForceWidth,
	vForceLeft
)
{
	var vThis, vID, vHtml, vLeft, vWidth, vInnerLeft;
	vThis = this;
	
	vID = vThis.fGenerateGUID();
	
	vWidth = vThis.fGetTextWidth("<span style='font-weight: bold;'>" + vThis.mEventList[vIndex][0][1] +  "</span>&nbsp; : &nbsp;" + vThis.mEventList[vIndex][0][0]);
	vWidth = parseInt(vWidth / 2) + 400;
	if (vWidth > 1100)
		vWidth = 1100;
	if (vForceWidth)
		vWidth = vForceWidth;
	if (vForceLeft)
		vLeft = vForceLeft;
	else
		vLeft = 0;
	
	vInnerLeft = 0;
	vHtml = "";
	vHtml += "<div id='message_" + vThis.mEventList[vIndex][1] + "_" + vID + "' style='position: absolute; top: 0px; left: " + vLeft + "px; height: 50px; width: " + vWidth + "px;'>";
	if (vThis.mEventList[vIndex][0][2] && vThis.mEventList[vIndex][0][2].length > 0)
	{
		vHtml += "<div style='position: absolute; top: 4px; left: " + 10 + "px; height: 40px; width: 40px; border: solid white 2px;'>";
		vHtml += "<img src='" + vThis.mEventList[vIndex][0][2] + "' width='40px' height='40px'>";
		vHtml += "</div>";
		vInnerLeft += 70;
	}
	vHtml += "<div id='message_txt' style=' position: absolute; top: 0px; left: " + vInnerLeft + "px; height: 50px; width: " + (vWidth - vInnerLeft) + "px; margin: 4px 0 0 0; color: #EEEEEE; font-size: 17px; line-height: 130%;'>";	
		vHtml += "<span style='font-weight: bold; text-shadow: #AAAAAA 1px 1px 2px;'>" + vThis.mEventList[vIndex][0][1] +  "</span>&nbsp; : &nbsp;" + unescape(vThis.mEventList[vIndex][0][0]);
	vHtml += "</div>";
	vHtml += "</div>";
	
	$("#crawling_container").append(vHtml);
}

/** -------------------------------------------------------------------------------------------------
	fCrawlMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCrawlMessages = function(
)
{
	var vThis, i, o, vList, vLen, vLeft, vWidth, vRight, vStep;
	vThis = this;
	vStep = 2;
	
	vList = $("#crawling_container").children();
	vLen = vList.length;
	if (vLen == 0)
		return;
	for (i = 0; i < vLen; i++)
	{
		o = $(vList[i]);
		vLeft = parseInt(o.css("left").split("px")[0]);
		o.css("left", (vLeft - vStep) + "px");
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;
	}
}

/** -------------------------------------------------------------------------------------------------
	fCheckNewMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCheckNewMessage = function(
)
{
//~ fDbg("*** cModuleEventTicker, fCheckNewMessage(), ");
	var o, vThis, vlist, vLeft, vWidth, vRight, vContainerWidth;
	vThis = this;
	vContainerWidth = 1279 - 80;

	vList = $("#crawling_container").children();
	o = $(vList[vList.length - 1]);
	if (o.length > 0)
	{
		vLeft = parseInt(o.css("left").split("px")[0]);
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;
		
		if (vRight < vContainerWidth - 100)
		{
			if (vThis.mEventList.length > 0)
			{
				//~ fDbg("========== add next event ==========");
				vThis.fAddNextEventToContainer(0);
			}
			else
			{
				vThis.mPlayStatus = null;
				$("#div_eventWidgetPlayer_crawling").animate({
					top: "+=70px"
				}, 1000, function() {
					$("#crawling_container").html("");
					$("#div_eventWidgetPlayer_crawling").css("top", "0px");
					$("#div_eventWidgetPlayer_crawling").css("left", vContainerWidth + "px");
					vThis.mPlayStatus = null;
				});
			}
		}
	}
}

/** -------------------------------------------------------------------------------------------------
	fCheckLeadingMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCheckLeadingMessage = function(
)
{
	var o, vThis, vLeft, vWidth, vRight;
	vThis = this;

	o = $($("#crawling_container").children()[0]);
	if (o.length > 0)
	{
		vLeft = parseInt(o.css("left").split("px")[0]);
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;
		
		if (vRight < 0)
			o.remove();
	}
}





/**-------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	stamp event ticker functions
 * ------------------------------------------------------------------------------------------------- */
/**-------------------------------------------------------------------------------------------------
 *	fAddStampEvent
 * ------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fAddStampEvent = function(
	vEventData,
	vTop	// true | false
)
{
fDbg("*** cModuleEventTicker, fAddEvent(), ");

	var o = String(new Date().getTime());
	this.mStampEventList.push([vEventData, o, 100]);
	
	if (!this.mStampPlayStatus || this.mStampPlayStatus == "paused" || this.mStampPlayStatus == "stopped")
	{
		this.fActivateStampTicker();
		this.mStampPlayStatus = "playing";
	}
}

cModuleEventTicker.prototype.fActivateStampTicker = function(
)
{
	var vThis, i, o, p, vLeft, vWidth, vRight, vContainerWidth, vID, vTraceInterval;
	vThis = this;
	vContainerWidth = 80;
	
	if (vThis.mStampEventList.length == 0 || $("#stamp_bottom_message_container").children().length > 0)
		return;
		
	fDbg("==================================== ACTIVATE STAMP ===================================");
	vThis.fAddNextStampEventToContainer(0, true);
	$("#stamp_bottom_message_container").show();
	$("#stamp_bottom_message_container").css("left", "0px");
	$("#stamp_bottom_message_container").css("top", "0px");
	//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	//~ fDbg("STAMP STAMP STAMP STAMP STAMP STAMP STAMP STAMP STAMP STAMP");
	//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	vThis.mStampPlayStatus = "playing";
}

cModuleEventTicker.prototype.fAddNextStampEventToContainer = function(
	vIndex,
	vIsFirstMessage
)
{
	var vThis;
	vThis = this;
	
	if (vIsFirstMessage)
		vThis.fAppendStampMessageDivFromEvent(vIndex, 1190, null);
	else
		vThis.fAppendStampMessageDivFromEvent(vIndex, null, 1200);
	
	vThis.mStampEventList[0][2]--;
	if (vThis.mStampEventList[0][2] == 0)
		vThis.mStampEventList.splice(0, 1);
}

cModuleEventTicker.prototype.fAppendStampMessageDivFromEvent = function(
	vIndex
)
{
fDbg("*** cModuelEventTicker, fAppendStampMessageDivFromEvent(), ");
	
	var vThis, vID, vHtml, vLeft, vWidth, vInnerLeft;
	vThis = this;
	
	vID = vThis.fGenerateGUID();
	vWidth = vThis.fGetTextWidth(vThis.mStampEventList[vIndex][0][0]);

	vLeft = 80;
	vInnerLeft = 0;
	vHtml = "";
	vHtml += "<div id='message_" + vThis.mStampEventList[vIndex][1] + "_" + vID + "' style='position: absolute; top: 0px; left: " + vLeft + "px; height: 50px; width: " + vWidth + "px;'>";
	vHtml += "<div id='message_txt' style=' position: absolute; top: 0px; left: " + vInnerLeft + "px; height: 25px; width: " + (vWidth - vInnerLeft) + "px; margin: 4px 0 0 0; color: #EEEEEE; font-size: 12px; line-height: 100%;'>";	
		vHtml += unescape(vThis.mStampEventList[vIndex][0][0]);
	vHtml += "</div>";
	vHtml += "</div>";
	
	$("#stamp_bottom_message_container").append(vHtml);
}

/** -------------------------------------------------------------------------------------------------
	fCrawlStampMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCrawlStampMessages = function(
)
{
//~ fDbg("*** cModuleEventTicker, fCrawlStampMessage(), ");
	var vThis, i, o, vList, vLen, vLeft, vWidth, vRight, vStep;
	vThis = this;
	vStep = 1;
	
	vList = $("#stamp_bottom_message_container").children();
	vLen = vList.length;
	if (vLen == 0)
		return;
	for (i = 0; i < vLen; i++)
	{
		o = $(vList[i]);
		vLeft = parseInt(o.css("left").split("px")[0]);
		o.css("left", (vLeft - vStep) + "px");
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;
	}
}

/** -------------------------------------------------------------------------------------------------
	fCheckStampNewMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCheckStampNewMessage = function(
)
{
//~ fDbg("*** cModuleEventTicker, fCheckNewMessage(), ");
	var o, vThis, vlist, vLeft, vWidth, vRight, vContainerWidth;
	vThis = this;
	vContainerWidth = 80;

	vList = $("#stamp_bottom_message_container").children();
	o = $(vList[vList.length - 1]);
	if (o.length > 0)
	{
		vLeft = parseInt(o.css("left").split("px")[0]);
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;
		
		if (vRight < vContainerWidth - 50)
		{
			if (vThis.mStampEventList.length > 0)
			{
				fDbg("========== add next stamp event ==========");
				vThis.fAddNextStampEventToContainer(0);
			}
			else
			{
				fDbg("********** HIDE HIDE HIDE!!! ************");
				vThis.mStampPlayStatus = null;
				$("#stamp_bottom_message_container").fadeOut(300, function() {
					vThis.mStampPlayStatus = null;
					$("#stamp_bottom_message_container").html("");
					$("#stamp_bottom_message_container").show();
				});
				return;
			}
		}
	}
}

/** -------------------------------------------------------------------------------------------------
	fCheckStampLeadingMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCheckStampLeadingMessage = function(
)
{
	var o, vThis, vLeft, vWidth, vRight;
	vThis = this;
	
	o = $($("#stamp_bottom_message_container").children()[0]);
	if (o.length > 0)
	{
		vLeft = parseInt(o.css("left").split("px")[0]);
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;
		
		if (vRight < 0)
			o.remove();
	}
}

/** -------------------------------------------------------------------------------------------------
	fEndStampEvent
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fEndStampEvent = function(
)
{
	var vThis;
	vThis = this;

	vThis.mStampEventList = [];

	fDbg("********** HIDE HIDE HIDE!!! ************");
	vThis.mStampPlayStatus = null;
	$("#stamp_bottom_message_container").fadeOut(300, function() {
		vThis.mStampPlayStatus = null;
		$("#stamp_bottom_message_container").html("");
		$("#stamp_bottom_message_container").show();
		vThis.fRenderIconPanel();
	});
}



cModuleEventTicker.prototype.fRenderIconPanel = function(
)
{
	o = "";
	o += "<div style='position: absolute; top: 2px; left: 55px; width:10px; height:10px;'><img src='./images/wifi3.png' width='20px' height='20px' /></div>";
	
	$("#stamp_bottom_iconset_container").html(o);
	$("#stamp_bottom_iconset_container").fadeIn();

	return;
}






cModuleEventTicker.prototype.fStopAll = function(
)
{
	var vThis;
	vThis = this;

	vThis.mStampPlayStatus = null;
	vThis.mStampEventList = [];
	
	vThis.mPlayStatus = null;
	vThis.mEventList = [];
	vThis.mEnabled = false;
}


cModuleEventTicker.prototype.pEnabled = function(
	vData
)
{
	if (vData != null)
		this.mEnabled = vData;
	else
		return this.mEnabled;
}








cModuleEventTicker.prototype.pConfigMode = function(
	vMode
)
{
	var vThis;
	vThis = this;
	
	if (vMode == vThis.mConfigMode)
		return;
	
	switch (vMode)
	{
	case null:
		vThis.mDiv.css("border", "none");
		break;

	case "configmode1":
		vThis.mDiv.css("border", "solid white 1px");
		break;

	case "configmode2":
		vThis.mDiv.css("border", "solid red 1px");
		vThis.mDiv.css("border", "solid white 1px");
		vThis.mDiv.css("border-left", "solid #FFFF22 1px");
		vThis.mDiv.css("border-right", "solid #FFFF22 1px");
		break;
	}
	vThis.mConfigMode = vMode;
}

/** -------------------------------------------------------------------------------------------------
	fReset
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fReset = function(
	vReturnFun
)
{
	$("#div_eventWidgetPlayer_crawling").css("left", "1199px");
	$("#crawling_container").html("");
}























































































































































































































cModuleEventTicker.prototype.fGetTextWidth = function(
	vStr
)
{
	var vFixHeight = 50;
	
	$("#div_testing").append("<div id='div_testing_A' style='float: left; width: auto; height: 50px'>" + vStr + "</div>");

	var o = $("#div_testing_A");
	var vWidth = 0;
	
	//~ fDbg("++++++++++++>>>>>>>" + o);
	//~ fDbg("++++++++++++>>>>>>>" + o.length);
	//~ fDbg("++++++++++++>>>>>>>" + o.width());
	vWidth = o.width() + 10;
	$("#div_testing").html("");
	return vWidth;
}


cModuleEventTicker.prototype.fGenerateGUID = function(
)
{
    var S4 = function() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
