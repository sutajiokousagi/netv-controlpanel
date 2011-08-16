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




	this.mStyle = {
		mHeight : 50,
		mBottomOffset : 40
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
		
		if (vThis.mPlayStatus == "playing")
		{	
			vThis.fCrawlMessages();
			vThis.fCheckNewMessage();
			vThis.fCheckLeadingMessage();
		}
		if (vThis.mStampPlayStatus == "playing")
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
fDbg("*** cModuleEventTicker, fAnimateIn(), ");
	var vThis = this;
	
	this.mDiv.show();
	this.mDiv.css("top", "719px");
	this.mDiv.animate({
		top: "-=" + (vThis.mStyle.mBottomOffset + vThis.mStyle.mHeight) + "px"
		//~ top: "-=" + 5 + "px"
		//~ top: "0px"
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
fDbg("*** cModuleEventTicker, fAnimateOut(), ");
	var vThis = this;
	
	this.mDiv.css("top", (719 - (vThis.mStyle.mBottomOffset + vThis.mStyle.mHeight)) + "px");
	this.mDiv.animate({
		top: "719px"
	}, 500, function() {
		vThis.mVisibleOnScreen = false;
		if (vReturnFun)
			vReturnFun();
	});
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
if (this.mEnabled == false)
	return;

	var o = String(new Date().getTime());
	this.mEventList.push([vEventData, o, 3]);
	
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



















































































































































/** -------------------------------------------------------------------------------------------------
	fActivate
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fStartStampMessage = function(
)
{
	var i, vThis, vStampWidth, o, p, vID, vLeft, vWidth;
	vThis = this;
	vStampWidth = 80;
	
	vID = vThis.fGenerateGUID();
	vThis.mStampEventList.push([vID, ["booting up...", null, null], 3]);
	vThis.mStampCurrNewEventN = 0;
	p = vThis.mStampEventList[vThis.mStampCurrNewEventN];
	$("#stamp_bottom_message_container").append("<div id='stamp_" + vID + "' style='position: absolute; top: 0px; left: 0px;'>" + p[1][0] + "</div>");
	
	vThis.mStampCurrMessageDivQueue.push($("#stamp_bottom_message_container #stamp_" + vID));
	vThis.mStampCurrMessageDiv = $("#stamp_bottom_message_container #stamp_" + vID);
	vThis.mStampCurrMessageDiv.css("left", vStampWidth + "px");
return;
	this.mStampEventInterval = setInterval(function() {
		if (vThis.mStopNow)
		{
			vThis.mStopNow = false;
			$("#stamp_bottom_message_container").fadeOut(function() {
				clearInterval(vThis.mStampEventInterval);
				$("#stamp_bottom_message_container").html("");
				vThis.fRenderIconPanel();
			});
			return;
		}

		
		//~ fDbg("===================");
		for (i = 0; i < vThis.mStampCurrMessageDivQueue.length; i++)
		{
			o = vThis.mStampCurrMessageDivQueue[i];
			vLeft = parseInt(o.css("left").split("px")[0]) - 1;
			vWidth = o.width();
			o.css("left", vLeft + "px");
		}
		
		o = vThis.mStampCurrMessageDiv;
		vLeft = parseInt(o.css("left").split("px")[0]) - 1;
		vWidth = o.width();
		
		
		if (vLeft + vWidth < vStampWidth - 20)
		{
			// 1, get next event
			if (vThis.mStampEventList.length == 0)			// 1.1 do nothing
			{
				
			}
			else 											// 1.2 get next event
			{
				fDbg("111");
				vThis.mStampCurrNewEventN++;
				if (vThis.mStampCurrNewEventN >= vThis.mStampEventList.length)
				{
					vThis.mStampCurrNewEventN = 0;
					if (vThis.mStopAfterLastEvent)
					{
						$("#stamp_bottom_message_container").fadeOut(function() {
							clearInterval(vThis.mStampEventInterval);
							$("#stamp_bottom_message_container").html("");
							vThis.fRenderIconPanel();
						});
						return;
					}
				}
				p = vThis.mStampEventList[vThis.mStampCurrNewEventN];
				
				fDbg("-----> add event from index" + vThis.mStampCurrNewEventN);
				// add div with message
				vID = vThis.fGenerateGUID();
				$("#stamp_bottom_message_container").append("<div id='stamp_" + vID + "' style='position: absolute; top: 0px; left: 0px;'>" + p[1][0] + "</div>");
				vThis.mStampCurrMessageDivQueue.push($("#stamp_bottom_message_container #stamp_" + vID));
				vThis.mStampCurrMessageDiv = $("#stamp_bottom_message_container #stamp_" + vID);
				vThis.mStampCurrMessageDiv.css("left", vStampWidth + "px");
			}
		}
		if (vLeft < (-vWidth))
		{
			// get a new message from eventqueue
			if (vThis.mStampEventList.length == 0)
			{
				// all empty!!! clear all!!! reset all!!!
			}
			vThis.mStampCurrMessageDivQueue.splice(0, 1);
			if (vThis.mStampCurrMessageDivQueue.length == 0)
			{
				clearInterval(vThis.mStampEventInterval);
				vThis.fRenderIconPanel();
			}
		}
	}, 50);
}
cModuleEventTicker.prototype.fEndStampMessage = function(
	vNow	// null | true
)
{
	

	if (vNow)		// end NOW!!
	{

	}
	else			// end after current 
	{
		this.mStampEventList = [];
		this.mStampEventInterval = null;
		this.mStampEventList = [];			// [[ID, [message, title, image], displaycount], [...], [...], ...]
		this.mStampCurrNewEventN = null;
		
		this.mStampCurrMessageQueue = [];
		this.mStampCurrMessageDivQueue = [];
		this.mStampCurrMessageDiv = null;
		
	}
}
































































/** -------------------------------------------------------------------------------------------------
	fExit
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fExit = function(
	vReturnFun
)
{
fDbg("*** cModuleEventTicker, fExit(), ");
	var vThis;
	vThis = this;

	vThis.fAnimateOut(function() {
		this.mPlayStatus = null;
	});
}

/** -------------------------------------------------------------------------------------------------
	fReset
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fReset = function(
	vReturnFun
)
{
	//~ $("#div_eventWidgetPlayer").children("#div_eventWidgetPlayer_crawling").css("left", "1199px");

	/*
	$("#div_eventWidgetPlayer_crawling_text_0").html("");
	$("#div_eventWidgetPlayer_crawling_text_1").html("");

	$("#div_eventWidgetPlayer_crawling_text_0").show();
	$("#div_eventWidgetPlayer_crawling_text_1").show();
	
	$("#div_eventWidgetPlayer_crawling_text_1").css("left", "1200px");
	*/
}

/** -------------------------------------------------------------------------------------------------
	fPlayNext
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fPlayNext = function(
	vReturnFun
)
{
	var o;

	if (this.mEventList.length > 0)
	{
		o = this.mEventList.pop();
		this.fCrawlMessage(o);
	}
	else
	{
		this.mPlayStatus = "stopped";
	}
}

/** -------------------------------------------------------------------------------------------------
	fCrawlMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fCrawlMessage = function(
	vData,
	vReturnFun
)
{
fDbg("*** cModuleEventTicker, fCrawlMessage(), ");
	var vThis, vTO;
	vThis = this;

	$("#div_eventWidgetPlayer_crawling_text_0").css("background-color", "");
	$("#div_eventWidgetPlayer_crawling_text_1").css("background-color", "");
	
	vThis.fSetMessage(vData, $("#div_eventWidgetPlayer_crawling_text_0"));
	$("#div_eventWidgetPlayer_crawling").animate({
		left: "-=1179px"
	}, 1000, function() {
		this.mPlayStatus = "paused";
		vTO = setTimeout(function() {
			vThis.fTransitToNext();
		}, 6000);
	});
}

/** -------------------------------------------------------------------------------------------------
	fCrawlMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fTransitToNext = function(
)
{
fDbg("*** cModuleEventTicker, fTransitToNext(), ");
	var vThis, o, p, vTD, vHtml;
	vThis = this;
	
	if (this.mEventList.length == 0)
	{
		$("#div_eventWidgetPlayer_crawling").animate({
			top: "+=68px"
		}, 500, function() {
			$("#div_eventWidgetPlayer_crawling").css("top", "0px");
			$("#div_eventWidgetPlayer_crawling").css("left", "1179px");
			this.mPlayStatus = "stopped";
			vThis.fPlayNext();
		});
	}
	else
	{
		// transit to next event message
		o = this.mEventList.pop();
		p = [parseInt($("#div_eventWidgetPlayer_crawling_text_0").css("left").split("px")[0]), parseInt($("#div_eventWidgetPlayer_crawling_text_1").css("left").split("px")[0])];
		if (p[0] > p[1])
			p = [$("#div_eventWidgetPlayer_crawling_text_1"), $("#div_eventWidgetPlayer_crawling_text_0")];
		else
			p = [$("#div_eventWidgetPlayer_crawling_text_0"), $("#div_eventWidgetPlayer_crawling_text_1")];

		vThis.fSetMessage(o, p[1]);
		
		p[0].animate({left : "-=" + p[0].css("width")}, 1000, function() {
			p[0].css("left", p[1].css("width"));
		});
		p[1].animate({left : "0px"}, 1000, function() {

		});

		// static for N seconds before proceed to next message
		vTO = setTimeout(function() {
			vThis.fTransitToNext();
		}, vThis.mStaticPeriod);
	}
}


/** -------------------------------------------------------------------------------------------------
	fSetMessage
-------------------------------------------------------------------------------------------------- */
cModuleEventTicker.prototype.fSetMessage = function(
	vEvent,		// item from mEventList
	vDiv		// div
)
{
	var vHtml;
	var vLeft;

	vLeft = 12;
	vHtml = "";
	vHtml += "<div style='position: absolute; top: 0px; left: 0px; font-size: 18px;'>";
		if (vEvent[2] && vEvent[2].length > 0)
		{
			vHtml += "<div style='position: absolute; top: 5px; left: " + vLeft + "px; height: 50px; width: 50px;'>";
			vHtml += "<img src='" + vEvent[2] + "' width='40px' height='40px'>";
			vHtml += "</div>";
			vLeft += 60;
		}
		vHtml += "<div style='position: absolute; top: 0px; left: " + vLeft + "px; height: 50px; width: 1100px; border: solid black 0px; line-height: 140%'>";
			vHtml += "<span style='top: 5px; left: 10px; font-weight: bold; text-shadow: #666666 2px 2px 15px;'>";
			vHtml += vEvent[1] + " : ";
			vHtml += "</span>";
			vHtml += "<span style='top: 5px;'>";
			vHtml += vEvent[0];
			vHtml += "</span>";
		vHtml += "</div>";
	vHtml += "</div>";
	
	vDiv.html(vHtml);
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
