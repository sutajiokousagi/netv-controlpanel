// -------------------------------------------------------------------------------------------------
//	cModuleLocalWidgets class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleLocalWidgets(
	vDivObj
)
{
	this.mDiv = $("#" + vDivObj);

	// ------------------------- main control
	this.mEnabled = false;
	this.mState = null;
	this.mVisibleOnScreen = false;

	// ------------------------- css / style related
	this.mViewPortSize = [];



	fDbg("++++++++++++++++++++++++++++++++++++");
	fDbg("++++++++++++++++++++++++++++++++++++");
	fDbg("++++++++++++++++++++++++++++++++++++");




	//~ this.fInit();



	return;

	this.mStyle = {
		mTickerWidth: 80,
		mTickerHeight: 50,
		mCrawlerHeight: 50,
		mCrawlerWidth: 1160,

		mMessageDefaultDisplayN: 2,
		mSMSDefaultDisplayN: 2,

		mViewPortSize: [0, 0],
		mRightOffset: 60,
		mBottomOffset: 40
	}
	this.mTimeIntervalFrequency = 20;


	// ------------------------- DIVs
	this.mDivTickerMini = null;


	// ------------------------- timer
	this.mTimer = null;
	this.mCounterTimer = 0;
	this.mCounterTimerSec = 0;
	this.mCounterStampClock = 0;
	this.mCounterStampClockOrigin = null;
	this.mTimeSpanStamp = 0;
	this.mTimeSpanConfigModeOn = 0;


	// main ticker event
	this.mEventList = [];					// [[ID, [message, title, image], displaycount], [...], [...], ...]
	this.mPrevEventList = [];				// [[widget_ID, [event1, event2, event3, etc...]], [], ...]
	this.mPlayStatus = null;				// null | stopped | paused
	this.mEnableCrawlMessages = false;

	// stamp ticker event
	this.mStampEventList = [];				// [[ID, [message, title, image], displaycount], [...], [...], ...]
	this.mStampPlayStatus = null;


	this.mStopAfterLastEvent = false;
	this.mStopNow = false;


	// ------------------------- states
	cModuleLocalWidgets.STATE_STANDBY = "state_standby";
	cModuleLocalWidgets.STATE_CRAWLINGIN = "state_crawlingin";
	cModuleLocalWidgets.STATE_CRAWLING = "state_crawling";
	cModuleLocalWidgets.STATE_CRAWLINGOUT = "state_crawlingout";


	this.mConfigMode = "default"; 			// default | configmode1 | configmode2
	//~ this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cModuleLocalWidgets.instance = null;
cModuleLocalWidgets.fGetInstance = function(
	vDivObj
)
{
	return cModuleLocalWidgets.instance ? cModuleLocalWidgets.instance : (cModuleLocalWidgets.instance = new cModuleLocalWidgets(vDivObj));
}

/** -------------------------------------------------------------------------------------------------
	fInit
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fInit = function(
)
{
/*
fDbg("*** cModuleLocalWidgets, fInit(), ");
	var vThis;
	vThis = this;




	// 0002, get current stored widgets
	cProxy.xmlhttpPost("", "post", {cmd : "NECOMMAND", value: "/bin/ls /media/storage/temproot/widgets/local", xmlescape: true}, function(vData) {
		var o, p, i;
		//~ fDbg(vData)
		vData = vData.split("</value>")[0].split("<value>")[1];
		//~ fDbg(vData);

		//~ vData = vData.split("\n")[0];
		p = vData.split("\n");
		//~ cModel.fGetInstance().LOCAL_WIDGETS_LIST = p;



		for (i = 0; i < p.length; i++)
		{
			p[i] = {
				mUrl : "./widgets/local/" + p[i] + "/index.html",
				mWidth : null,
				mHeight : null,
				mTop : null,
				mLeft : null
			};

		}
		for (i = 0; i < p.length; i++)
		{

			cProxy.xmlhttpPost("", "post", {cmd : "NECOMMAND", value: "/bin/cat /media/storage/temproot/widgets/local/" + p[i]["mUrl"].split("/index.html")[0].split("./widgets/local/")[1] + "/config", xmlescape: true}, function(vData) {
				//~ fDbg(vData);
				//~ "<xml><status>1</status><cmd>NECOMMAND</cmd><data><value>{top: 100px, left: 50px, width: 300px, height: 200px}</value></data></xml>"
				vData = vData.split("</value>")[0].split("<value>")[1];
				//~ fDbg(vData);
				vData = vData.replace(/&quot;/g, "\"");
				try {
					vData = JSON.parse(vData);
				}
				catch(e) {
					debugger;
				}



				for (i = 0; i < p.length; i++)
				{
					if (p[i]["mWidth"] == null)
					{
						fDbg(i);
						p[i]["mWidth"] = vData["width"];
						p[i]["mHeight"] = vData["height"];
						p[i]["mTop"] = vData["top"];
						p[i]["mLeft"] = vData["left"];

						if (i == p.length - 1)
						{

		o = "";
		for (i = 0; i < p.length; i++)
		{
			o += '<iframe src="' + p[i]["mUrl"] + '" width="' + p[i]["mWidth"] + '" height="' + p[i]["mHeight"] + '" style="position: absolute; top: ' + p[i]["mTop"] + '; left: ' + p[i]["mLeft"] + ';" frameborder="0"></iframe>';
		}
		vThis.mDiv.html(o);

						}
						break;
					}
				}

			});

		}

	});





	return;


	cProxy.fGetParams("eventtickerstyledata", function(vData) {
		//~ fDbg("data : "+ vData);
		if (!vData || vData == "")
			return;
		vData = JSON.parse(vData);
		vThis.mStyle = vData;
	});

	this.mDivTickerMini = this.mDiv.children("#div_eventWidgetPlayer_mini");
	this.mDiv.css("top", "400px");


	this.mTimer = setInterval(function() {
		mCounterStampClockOrigin = 0;
		vThis.fOnSignal("timerinterval", null, null);

	}, vThis.mTimeIntervalFrequency);
	this.fReset();

	vThis.pEnabled(true);
	vThis.fAnimateIn();
	vThis.fAnimateIn();
	vThis.mEnabled = true;
	*/
}

/** -------------------------------------------------------------------------------------------------
	fResize
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fResize = function(
	vViewPortSize
)
{
fDbg("*** cModuleLocalWidgets, fResize(), " + this.mViewPortSize + " -> " + vViewPortSize);
	var vThis, o, p, q, i;
	vThis = this;

	// before
	if (vThis.mViewPortSize && vThis.mViewPortSize[1])
	{
		p = parseInt($("#div_eventWidgetPlayer_crawling").css("left"));		// x-coordinate of crawler
		p = p / vThis.mViewPortSize[0];

		//~ fDbg(vThis.mViewPortSize[1] + " vs " + parseInt(vThis.mDiv.css("top")));

		if (parseInt(vThis.mDiv.css("top")) >= vThis.mViewPortSize[1])		// ok, it's in hidden mode
			o = vViewPortSize[1] + (parseInt(vThis.mDiv.css("top")) - vThis.mViewPortSize[1]);
		else if (vThis.mViewPortSize[1] - parseInt(vThis.mDiv.css("top")) > vThis.mViewPortSize[1] / 2)		// ok, it's at the upper part/region of the page
			o = parseInt(vThis.mDiv.css("top"));
		else  				// it's at the bottom part/region of the page
			o = vViewPortSize[1] - (vThis.mViewPortSize[1] - parseInt(vThis.mDiv.css("top")));
	}

	// check if upper or lower region
	q = (parseInt(vThis.mDiv.css("top")) < (vThis.mViewPortSize[1] - parseInt(vThis.mDiv.css("height"))) / 2) ? false : true;
	//~ fDbg("right : " + vThis.mStyle.mRightOffset);
	//~ fDbg("bottom : " + vThis.mStyle.mBottomOffset + " at lower region? - " + 1);
	q = parseInt(vThis.mDiv.css("top")) / vThis.mViewPortSize[1];
	//~ fDbg("pos percentage : " + q);


	// update
	vThis.mViewPortSize = [vViewPortSize[0], vViewPortSize[1]];
	vThis.mStyle.mViewPortSize = vThis.mViewPortSize;

	// after
	//~ fDbg("===============+>>> " + o);
	vThis.mDiv.css("top", o);

	q = parseInt(q * vThis.mViewPortSize[1] / 10);
	//~ fDbg("+++++++++++++++=>>> " + q);


	vThis.mDiv.css("width", vViewPortSize[0] - 120);
	$("#div_eventWidgetPlayer_mini").css("left", vViewPortSize[0] - 200);
	$("#div_eventWidgetPlayer_crawling").css("left", vViewPortSize[0] * p);
	$("#div_eventWidgetPlayer_crawling").css("width", vViewPortSize[0] - 201);
	$($("#div_eventWidgetPlayer_crawling #corner_container").children()[0]).css("left", parseInt($("#div_eventWidgetPlayer_crawling").css("width").split("px")[0]) - 8 + "px");
	$($("#div_eventWidgetPlayer_crawling #corner_container").children()[1]).css("left", parseInt($("#div_eventWidgetPlayer_crawling").css("width").split("px")[0]) - 8 + "px");

	//~ fDbg("+++++++++++++++++>>>>>>>>>>>>>. " + vThis.mStyle.mBottomOffset);
	//~ vThis.mStyle.mBottomOffset = vThis.mViewPortSize[1] - (parseInt($("#div_eventWidgetPlayer_crawling").css("top")) + 50);


	// TODO : save parameter to local storage
	if (vThis.mStyle.mBottomOffset < 510)
	{

	}
}

// -------------------------------------------------------------------------------------------------
//	pState
// -------------------------------------------------------------------------------------------------
cModuleLocalWidgets.prototype.pState = function(
	vState
)
{
	var vThis, o;
	vThis = this;
if (!vState) return vThis.mState;

	switch (vState)
	{

	}
	vThis.mState = vState;
}

// -------------------------------------------------------------------------------------------------
//	pConfigMode
// -------------------------------------------------------------------------------------------------
cModuleLocalWidgets.prototype.pConfigMode = function(
	vMode
)
{
	var vThis;
	vThis = this;

if (!vMode)
	return vThis.mConfigMode;
if (vMode == vThis.mConfigMode)
	return;

	switch (vMode)
	{
	case "default":
		vThis.mDiv.css("border", "none");
		o = vThis.mStyle;
		o = JSON.stringify(o);
		fDbg("save data : " + o);
		cProxy.fSaveParams("eventtickerstyledata", o);
		break;

	case "configmode1":
		vThis.mDiv.css("border", "solid white 1px");
		break;

	case "configmode2":
		vThis.mDiv.css("border", "solid white 1px");
		vThis.mDiv.css("border-left", "solid #22EE22 5px");
		break;
	}
	vThis.mConfigMode = vMode;
}

// -------------------------------------------------------------------------------------------------
//	pPos
// -------------------------------------------------------------------------------------------------
cModuleLocalWidgets.prototype.pPos = function(
	vPos		// {top: ...px; height: ...px}
)
{
	var vThis, o;
	vThis = this;
if (!vPos) return vThis.mPos;

	// update positions
	if (vPos.top)
	{
		vThis.mDiv.css("top", vPos.top);
	}

	if (vPos.left)
	{
		vThis.mDiv.css("left", vPos.left);
	}

	if (vPos.width)
	{
		vThis.mDiv.css("width", vPos.width);
	}

	if (vPos.height)
	{
		vThis.mDiv.css("height", vPos.height);
	}

	if (vPos.mBottomOffSet)
	{
		vThis.mDiv.css("top", vThis.mViewPortSize[1] - vPos.mBottomOffSet - parseInt(vThis.mDiv.css("height")));
	}

	// update mStyle
	if (vThis.mViewPortSize[0] && vThis.mViewPortSize[1])
	{
		vThis.mStyle.mRightOffset = vThis.mViewPortSize[0] - (parseInt(vThis.mDiv.css("left")) + parseInt(vThis.mDiv.css("width")));
		vThis.mStyle.mBottomOffset = vThis.mViewPortSize[1] - (parseInt(vThis.mDiv.css("top")) + parseInt(vThis.mDiv.css("height")));
	}


}

/** -------------------------------------------------------------------------------------------------
	fOnSignal
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cModuleLocalWidgets, fOnSignal(), " + vSignal + ", " + vData);
	var i, o, vThis;
	vThis = this;

	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;

	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;

	case cConst.SIGNAL_BUTTON_LEFT:
		if (vThis.mConfigMode && vThis.mConfigMode == "configmode1")
		{
			vThis.mDiv.css("left", "-=5px");
			this.mTimeSpanConfigModeOn = 0;

			$("#div_configmode1 #arrow_left_white").show();
			$("#div_configmode1 #arrow_left_white").fadeOut();
		}
		else if (vThis.mConfigMode && vThis.mConfigMode == "configmode2")
		{
			vThis.mDiv.css("left", "-=5px");
			vThis.mDiv.css("width", "+=5px");
			$(vThis.mDiv.children("#div_eventWidgetPlayer_mini")[0]).css("left", "+=5px");
			$(vThis.mDiv.children("#div_eventWidgetPlayer_crawling")[0]).css("width", "+=5px");

			o = $($("#div_eventWidgetPlayer_crawling").children()[1]);
			$(o.children()[0]).css("left", "+=5px");
			$(o.children()[1]).css("left", "+=5px");
			this.mTimeSpanConfigModeOn = 0;
		}
		break;

	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mConfigMode && vThis.mConfigMode == "configmode1")
		{
			vThis.mDiv.css("left", "+=5px");
			this.mTimeSpanConfigModeOn = 0;

			$("#div_configmode1 #arrow_right_white").show();
			$("#div_configmode1 #arrow_right_white").fadeOut();
		}
		else if (vThis.mConfigMode && vThis.mConfigMode == "configmode2")
		{
			vThis.mDiv.css("left", "+=5px");
			vThis.mDiv.css("width", "-=5px");
			$(vThis.mDiv.children("#div_eventWidgetPlayer_mini")[0]).css("left", "-=5px");
			$(vThis.mDiv.children("#div_eventWidgetPlayer_crawling")[0]).css("width", "-=5px");

			o = $($("#div_eventWidgetPlayer_crawling").children()[1]);
			$(o.children()[0]).css("left", "-=5px");
			$(o.children()[1]).css("left", "-=5px");
			this.mTimeSpanConfigModeOn = 0;
		}
		break;

	case cConst.SIGNAL_BUTTON_CENTER:
		if (vThis.mConfigMode == "default")
			vThis.pConfigMode("configmode1");
		else if (vThis.mConfigMode == "configmode1")
		{
			vThis.pConfigMode("configmode2");
			this.mTimeSpanConfigModeOn = 0;
		}
		else if (vThis.mConfigMode == "configmode2")
		{
			vThis.pConfigMode("default");
			this.mTimeSpanConfigModeOn = 0;
		}
		break;

	case cConst.SIGNAL_BUTTON_UP:
		if (vThis.mConfigMode && vThis.mConfigMode != "default")
		{
			this.mTimeSpanConfigModeOn = 0;
			vThis.pPos({top: "-=10px"});
		}
		break;

	case cConst.SIGNAL_BUTTON_DOWN:
		if (vThis.mConfigMode && vThis.mConfigMode != "default")
		{
			this.mTimeSpanConfigModeOn = 0;
			vThis.pPos({top: "+=10px"});
		}
		break;
	}

	switch (vSignal)
	{
	case "timerinterval":
		vThis.mCounterTimer++;
		o = Math.floor((vThis.mCounterTimer - vThis.mCounterStampClockOrigin) / vThis.mTimeIntervalFrequency);

		// second counter
		if ((vThis.mCounterTimer - vThis.mCounterStampClockOrigin) % (1000 / vThis.mTimeIntervalFrequency) == 0)
		{
			vThis.mCounterTimerSec++
			vThis.fCheckConfigMode();
		}

		if (o != vThis.mCounterStampClock)
		{
			vThis.mCounterStampClock = o;
			vThis.fUpdateClock();
		}

		//~ fDbg($("#div_eventWidgetPlayer_crawling").css("left") + " - " + $("#div_eventWidgetPlayer_crawling").css("top"));

		if (vThis.mPlayStatus == "crawlingin" && vThis.mEnabled)
		{
			vThis.fCrawlingIn();
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

	case cConst.SIGNAL_PLAYNEXTWIDGET:
		if (vThis.pState() != cModuleLocalWidgets.STATE_STANDBY)
			return;
		o = $("#stamp_bottom_iconset_container").children();
		$($(o[1]).children()[0]).attr("src", "./images/tx_ico_active.png");
		if (o.length > 1)
			$(o[1]).fadeOut(300, function() {
				$(o[1]).fadeIn(300, function() {
					$(o[1]).fadeOut(300, function() {
						$(o[1]).fadeIn(300, function() {
							$(o[1]).fadeOut(300, function() {
								$(o[1]).fadeIn(300, function() {
									$($(o[1]).children()[0]).attr("src", "./images/tx_ico_inactive.png");
								});
							});
						});
					});
				});
			});
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
cModuleLocalWidgets.prototype.fShow = function(
)
{
	this.mDiv.show();
}

cModuleLocalWidgets.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

/** -------------------------------------------------------------------------------------------------
	fAnimateIn / fAnimateOut
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fAnimateIn = function(
	vReturnFun
)
{
if (this.mEnabled == false)
	return;
	var vThis, vTopStart, vTopFinal
	vThis = this;

if (cModel.fGetInstance().CHUMBY_AUTHORIZED == true)
	$("#stamp_demo_container").hide();
else
	$("#stamp_demo_container").show();

vThis.pState(cModuleLocalWidgets.STATE_STANDBY);

	vTopFinal = cModel.fGetInstance().VIEWPORTSIZE[1] - (vThis.mStyle.mBottomOffset + vThis.mStyle.mTickerHeight);
	if (vTopFinal < (cModel.fGetInstance().VIEWPORTSIZE[1] - 80) / 2)
		vTopStart = -80;
	else
		vTopStart = cModel.fGetInstance().VIEWPORTSIZE[1];


	this.mDiv.show();
	this.mDiv.css("top", vTopStart + "px");
	this.mDiv.animate({
		top: vTopFinal + "px"
	}, 500, function() {
		//~ fDbg("==========================>>> " + vThis.mStyle.mBottomOffset);
		if (vThis.mDiv.css("top") != vThis.mStyle.mBottomOffset + "px")
		{
			vThis.mDiv.animate({
				top: cModel.fGetInstance().VIEWPORTSIZE[1] - (vThis.mStyle.mBottomOffset + vThis.mStyle.mTickerHeight) + "px"
			}, 500, function() {

			});
		}

		vThis.mVisibleOnScreen = true;
		if (vReturnFun)
			vReturnFun();
	});
}

cModuleLocalWidgets.prototype.fAnimateOut = function(
	vReturnFun
)
{
fDbg("*** cModuleLocalWidgets, fAnimateOut(), ");
	var vThis, vTopStart, vTopFinal;
	vThis = this;

	// clear config mode
	vThis.pConfigMode("default");

	// calculate the OUT position
	vTopFinal = cModel.fGetInstance().VIEWPORTSIZE[1] - (vThis.mStyle.mBottomOffset + vThis.mStyle.mTickerHeight);
	if (vTopFinal < (vThis.mViewPortSize[1] - vThis.mStyle.mTickerHeight) / 2)
		vTopStart = -80;
	else
		vTopStart = cModel.fGetInstance().VIEWPORTSIZE[1];

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
cModuleLocalWidgets.prototype.fUpdateClock = function(
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
 * ---------------------------------------------------------------------------------------------- */
/** ------------------------------------------------------------------------------------------------
	fAddEvent
------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fAddEvent = function(
	vEventData,
	vTop	// true | false
)
{
//~ fDbg("*** cModuleLocalWidgets, fAddEvent(), ");
	var vThis, o, i, j, vFlag;
	vThis = this;
	o = String(new Date().getTime());


	// for type-"sms" 2 times only
	if (vEventData[3] == "sms")
	{
		vEventData.push('color: #FFFF00; text-shadow: #FFFF00 2px 2px 2px; font-size: 24px; margin-top: 5px;');
		if (this.mEventList.length == 0)
		{
			this.mEventList.push([vEventData, o, vThis.mStyle.mSMSDefaultDisplayN]);
		}
		else
		{
			// TODO filter sms type message, if same message exist in the first N, ignore it.
			//~ for (i = 0; i < 3; i++)
			//~ {
				this.mEventList.splice(1, 0, [vEventData, o, vThis.mStyle.mSMSDefaultDisplayN]);
			//~ }
		}
	}
	else
	{
		vFlag = false;
		for (i = 0; i < vThis.mPrevEventList.length; i++)
			if (vThis.mPrevEventList[i][0] == cModuleWE.fGetInstance().pCurrWidget().mID)
			{
				vFlag = true;
				break;
			}
		if (!vFlag)
		{
			vThis.mPrevEventList.push([cModuleWE.fGetInstance().pCurrWidget().mID, [vEventData[0].substr(0, 20)]]);
			//~ this.mEventList.push([vEventData, o, cModuleWE.fGetInstance().pCurrWidget().pEventDisplayCount()]);
			this.mEventList.push([vEventData, o, cModel.fGetInstance().EVENTTICKER_REPEATCOUNT]);
		}
		else
		{
			vFlag = false;
			// scan through "i"
			fDbg("================================================== " + cModuleWE.fGetInstance().pCurrWidget().mID);
			fDbg("old msg : " + vThis.mPrevEventList[i][1]);
			fDbg("new msg : " + vEventData[0].substr(0, 20));
			/*
			fDbg(cModuleWE.fGetInstance().pCurrWidget().mOnlyShowNewEvent);
			fDbg(cModuleWE.fGetInstance().pCurrWidget().mOnlyShowNewEvent);
			fDbg(cModuleWE.fGetInstance().pCurrWidget().mOnlyShowNewEvent);
			fDbg(cModuleWE.fGetInstance().pCurrWidget().mOnlyShowNewEvent);
			fDbg(cModuleWE.fGetInstance().pCurrWidget().mOnlyShowNewEvent);
			*/
			if (cModuleWE.fGetInstance().pCurrWidget().mOnlyShowNewEvent)
				for (j = 0; j < vThis.mPrevEventList[i][1].length; j++)
					if (vEventData[0].substr(0, 20) == vThis.mPrevEventList[i][1][j])
					{
						fDbg("new msg : " + vEventData[0].substr(0, 20) + "     is the same as prev msg " + j + " ---> ignore!");
						vFlag = true;
						break;
					}

			if (!vFlag)
			{
				vThis.mPrevEventList[i][1].push(vEventData[0].substr(0, 20));
				//~ this.mEventList.push([vEventData, o, cModuleWE.fGetInstance().pCurrWidget().pEventDisplayCount()]);
				this.mEventList.push([vEventData, o, cModel.fGetInstance().EVENTTICKER_REPEATCOUNT]);
			}
			fDbg("==================================================");
		}
	}

if (this.mEnabled == false)
	return;

	if (!this.mPlayStatus || this.mPlayStatus == "paused" || this.mPlayStatus == "stopped")
	{
		//~ this.mPlayStatus = "paused";
		//~ fDbg("+++++++++>>> " + vThis.mPlayStatus);
		this.fActivateMainTicker();
	}
}

/** -------------------------------------------------------------------------------------------------
	fActivateMainTicker
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fActivateMainTicker = function(
)
{
	var vThis, i, o, p, vLeft, vWidth, vRight, vContainerWidth, vID, vTraceInterval;
	vThis = this;

	vContainerWidth = cModel.fGetInstance().VIEWPORTSIZE[0] - 80;


	if (vThis.mEventList.length == 0 || $("#crawling_container").children().length > 0)
		return;

	//~ fDbg("==================================== ACTIVATE =========================================");
	vThis.pState(cModuleLocalWidgets.STATE_CRAWLINGIN);
	vThis.fAddNextEventToContainer(0, true);
	$("#div_eventWidgetPlayer_crawling").css("left", vContainerWidth + "px");

	vThis.mPlayStatus = "crawlingin";
}

/** -------------------------------------------------------------------------------------------------
	fCrawlMessage
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fCrawlingIn = function(
)
{
//~ fDbg("*** cModuleLocalWidgets, fCrawlingIn(), ");
	var vThis, i, o, vList, vLen, vLeft, vWidth, vRight, vStep;
	vThis = this;
	vStep = cModel.fGetInstance().pTickerStep();

	$("#div_eventWidgetPlayer_crawling").css("left", "-=" + vStep + "px");
	vLeft = parseInt($("#div_eventWidgetPlayer_crawling").css("left").split("px")[0]);
	if (vLeft <= 0)
	{
		$("#div_eventWidgetPlayer_crawling").css("left", "opx");
		//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		//~ fDbg("DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE");
		//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		vThis.pState(cModuleLocalWidgets.STATE_CRAWLING);
		vThis.mPlayStatus = "playing";
	}
}

cModuleLocalWidgets.prototype.fAddNextEventToContainer = function(
	vIndex,
	vIsFirstMessage
)
{
	var vThis, vID;
	vThis = this;

	if (vIsFirstMessage)
		vThis.fAppendMessageDivFromEvent(vIndex, vThis.mViewPortSize[0] - 80 - 200, null);
	else
		vThis.fAppendMessageDivFromEvent(vIndex, null, vThis.mViewPortSize[0] - 80);

	vThis.mEventList[0][2]--;
	if (vThis.mEventList[0][2] == 0)
		vThis.mEventList.splice(0, 1);
}

cModuleLocalWidgets.prototype.fAppendMessageDivFromEvent = function(
	vIndex,
	vForceWidth,
	vForceLeft
)
{
	var vThis, vID, vHtml, vLeft, vWidth, vInnerLeft, o, vCSS, vFontSize;
	vThis = this;

	vID = vThis.fGenerateGUID();

	//~ vThis.mEventList[vIndex][0][0] = "希望这里有140个字符。希望这里有140个字符。希望这里有140个字符。希望这里有140个字符。人民群众的力量!人民群众的力量!人民群众的力量!人民群众的力量!人民群众的力量!费德勒年终大师赛冠军!费德勒年终大师赛冠军!费德勒年终大师赛冠军!费德勒年终大师赛冠军!费德勒年终大师赛冠军!";
	//~ vThis.mEventList[vIndex][0][0] = "希望这里有140个字符。希望这里有140个字符。希望这里有140个字符。希望这里有140个字符。人民群众的力量!人民群众的力量!人民群众的力量!人民群众的力量!人民群众的力量!费德勒年终大师赛冠军!";
	//~ vThis.mEventList[vIndex][0][0] = "希望这里有140个字符。希望这里有140个字符。希望这里有140个字符";
	//~ vThis.mEventList[vIndex][0][0] = "qwuery qweuty wqetuy qwety qweuty";
	//~ fDbg(vThis.mEventList[vIndex][0][0]);
	vWidth = vThis.fGetTextWidth(vThis.mEventList[vIndex][0][1] + vThis.mEventList[vIndex][0][0]);

	if (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 1)
		vWidth = parseInt(vWidth) + 400;
	else if (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 2)
	{
		vWidth = parseInt(vWidth / 2) + 400;
		if (vWidth > 1100)
			vWidth = 1100;
	}
	fDbg("++++++++++++++++++++===============+++++++++++++++++++++++++>>>>>>>> " + vWidth);
	//~ if (vForceWidth)
		//~ vWidth = vForceWidth;
	if (vForceLeft)
		vLeft = vForceLeft;
	else
		vLeft = 20;

	vInnerLeft = 0;

	//~ vThis.mEventList[vIndex][0][0] = "符号测试， 和验证。！";

	vHtml = "";
	vHtml += "<div id='message_" + vThis.mEventList[vIndex][1] + "_" + vID + "' style='position: absolute; top: 0px; left: " + vLeft + "px; height: 50px; width: " + vWidth + "px;'>";
	if (vThis.mEventList[vIndex][0][2] && vThis.mEventList[vIndex][0][2].length > 0)		// if image exist
	{
		vHtml += "<div style='position: absolute; top: 4px; left: " + 10 + "px; height: 40px; width: 40px; border: solid white 2px;'>";
		vHtml += "<img src='" + vThis.mEventList[vIndex][0][2] + "' width='40px' height='40px'>";
		vHtml += "</div>";
		vInnerLeft += 70;
	}
	if (vThis.mEventList[vIndex][0][6])
		vCSS = vThis.mEventList[vIndex][0][6];
	else
		vCSS = "color: #EEEEEE; ";

	// set single line or double line
	if (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 1)
		vFontSize = 32;
	else if (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 2)
		vFontSize = 17;

	vHtml += "<div id='message_txt' style='border: solid yellow 0px; position: absolute; top: 0px; left: " + vInnerLeft + "px; height: 50px; width: " + (vWidth - vInnerLeft) + "px; margin: 4px 0 0 0; font-size: " + vFontSize + "px; line-height: 130%;" + vCSS + "'>";
		if (vThis.mEventList[vIndex][0][1] && vThis.mEventList[vIndex][0][1] != "")
			vHtml += "<span style='font-weight: bold; text-shadow: #AAAAAA 1px 1px 2px;'>" + vThis.mEventList[vIndex][0][1] +  "</span>&nbsp; : &nbsp;" + vThis.mEventList[vIndex][0][0];
		else
			vHtml += vThis.mEventList[vIndex][0][0];
	vHtml += "</div>";
	vHtml += "</div>";

	$("#crawling_container").append(vHtml);
	//~ fDbg($("#crawling_container").html());
}

/** -------------------------------------------------------------------------------------------------
	fCrawlMessage
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fCrawlMessages = function(
)
{
	var vThis, i, o, vList, vLen, vLeft, vWidth, vRight, vStep;
	vThis = this;
	vStep = 4;
	vStep = cModel.fGetInstance().pTickerStep();

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
cModuleLocalWidgets.prototype.fCheckNewMessage = function(
)
{
//~ fDbg("*** cModuleLocalWidgets, fCheckNewMessage(), ");
	var o, vThis, vlist, vLeft, vWidth, vRight, vContainerWidth;
	vThis = this;
	vContainerWidth = cModel.fGetInstance().VIEWPORTSIZE[0] - 80;

	vList = $("#crawling_container").children();
	o = $(vList[vList.length - 1]);
	if (o.length > 0)
	{
		vLeft = parseInt(o.css("left").split("px")[0]);
		vWidth = parseInt(o.css("width").split("px")[0]);
		vRight = vLeft + vWidth;

		if (vRight < vContainerWidth - 400)
		{
			if (vThis.mEventList.length > 0)
			{
				//~ fDbg("========== add next event ==========");
				vThis.fAddNextEventToContainer(0);
			}
			else
			{
				vThis.mPlayStatus = null;
				vThis.pState(cModuleLocalWidgets.STATE_CRAWLINGOUT);
				$("#div_eventWidgetPlayer_crawling").animate({
					top: "+=70px"
				}, 1500, function() {
					$("#crawling_container").html("");
					$("#div_eventWidgetPlayer_crawling").css("top", "0px");
					$("#div_eventWidgetPlayer_crawling").css("left", vContainerWidth + "px");
					vThis.mPlayStatus = null;
					vThis.pState(cModuleLocalWidgets.STATE_STANDBY);
				});
			}
		}
	}
}

/** -------------------------------------------------------------------------------------------------
	fCheckLeadingMessage
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fCheckLeadingMessage = function(
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
cModuleLocalWidgets.prototype.fAddStampEvent = function(
	vEventData,
	vTop	// true | false
)
{
//~ fDbg("*** cModuleLocalWidgets, fAddStampEvent(), ");

	var o = String(new Date().getTime());
	this.mStampEventList.push([vEventData, o, 100]);

	if (!this.mStampPlayStatus || this.mStampPlayStatus == "paused" || this.mStampPlayStatus == "stopped")
	{
		this.fActivateStampTicker();
		this.mStampPlayStatus = "playing";
	}
}

cModuleLocalWidgets.prototype.fActivateStampTicker = function(
)
{
	var vThis, i, o, p, vLeft, vWidth, vRight, vContainerWidth, vID, vTraceInterval;
	vThis = this;
	vContainerWidth = 80;

	if (vThis.mStampEventList.length == 0 || $("#stamp_bottom_message_container").children().length > 0)
		return;

	//~ fDbg("==================================== ACTIVATE STAMP ===================================");
	vThis.fAddNextStampEventToContainer(0, true);
	$("#stamp_bottom_message_container").show();
	$("#stamp_bottom_message_container").css("left", "0px");
	$("#stamp_bottom_message_container").css("top", "0px");
	//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	//~ fDbg("STAMP STAMP STAMP STAMP STAMP STAMP STAMP STAMP STAMP STAMP");
	//~ fDbg("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	vThis.mStampPlayStatus = "playing";
}

cModuleLocalWidgets.prototype.fAddNextStampEventToContainer = function(
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

cModuleLocalWidgets.prototype.fAppendStampMessageDivFromEvent = function(
	vIndex
)
{
//~ fDbg("*** cModuelEventTicker, fAppendStampMessageDivFromEvent(), ");

	var vThis, vID, vHtml, vLeft, vWidth, vInnerLeft;
	vThis = this;

	vID = vThis.fGenerateGUID();
	vWidth = vThis.fGetTextWidth(vThis.mStampEventList[vIndex][0][0]);

	vLeft = 80;
	vInnerLeft = 0;
	vHtml = "";
	vHtml += "<div id='message_" + vThis.mStampEventList[vIndex][1] + "_" + vID + "' style='position: absolute; top: 0px; left: " + vLeft + "px; height: 50px; width: " + vWidth + "px;'>";
	vHtml += "<div id='message_txt' style=' position: absolute; top: 0px; left: " + vInnerLeft + "px; height: 25px; width: " + (vWidth - vInnerLeft) + "px; margin: 4px 0 0 0; color: #EEEEEE; font-size: 12px; line-height: 100%;'>";
		vHtml += vThis.mStampEventList[vIndex][0][0];
	vHtml += "</div>";
	vHtml += "</div>";

	$("#stamp_bottom_message_container").append(vHtml);
}

/** -------------------------------------------------------------------------------------------------
	fCrawlStampMessage
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fCrawlStampMessages = function(
)
{
//~ fDbg("*** cModuleLocalWidgets, fCrawlStampMessage(), ");
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
cModuleLocalWidgets.prototype.fCheckStampNewMessage = function(
)
{
//~ fDbg("*** cModuleLocalWidgets, fCheckNewMessage(), ");
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
				//~ fDbg("========== add next stamp event ==========");
				vThis.fAddNextStampEventToContainer(0);
			}
			else
			{
				//~ fDbg("********** HIDE HIDE HIDE!!! ************");
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
cModuleLocalWidgets.prototype.fCheckStampLeadingMessage = function(
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
cModuleLocalWidgets.prototype.fEndStampEvent = function(
)
{
	var vThis;
	vThis = this;

	vThis.mStampEventList = [];

	//~ fDbg("********** HIDE HIDE HIDE!!! ************");
	vThis.mStampPlayStatus = null;
	$("#stamp_bottom_message_container").fadeOut(300, function() {
		vThis.mStampPlayStatus = null;
		$("#stamp_bottom_message_container").html("");
		$("#stamp_bottom_message_container").show();
		vThis.fRenderIconPanel();
	});
}



cModuleLocalWidgets.prototype.fRenderIconPanel = function(
)
{
	o = "";
	if (cModel.fGetInstance().CHUMBY_INTERNET == "true")
	{
		o += "<div style='position: absolute; top: 2px; left: 55px; width:10px; height:10px; opacity: 1;'><img src='./images/wifi3.png' width='20px' height='20px' /></div>";
		o += "<div style='position: absolute; top: 7px; left: 40px; width:10px; height:10px; opacity: 1;'>";
			o += "<img src='./images/tx_ico_inactive.png' width='11px' height='11px'/>";
		o += "</div>";
	}
	else
	{
		o += "<div style='position: absolute; top: 2px; left: 55px; width:10px; height:10px; opacity: 0.2;'><img src='./images/wifi3.png' width='20px' height='20px' /></div>";
		o += "<div style='position: absolute; top: 7px; left: 2px; width:10px; height:10px; opacity: 1;'>";
			o += "<img src='./images/tx_ico_inactive.png' width='11px' height='11px'/>";
		o += "</div>";
	}

	$("#stamp_bottom_iconset_container").html(o);
	$("#stamp_bottom_iconset_container").fadeIn();

if (cModel.fGetInstance().CHUMBY_AUTHORIZED == true)
	$("#stamp_demo_container").hide();
else
	$("#stamp_demo_container").show();

	return;
}






cModuleLocalWidgets.prototype.fStopAll = function(
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


cModuleLocalWidgets.prototype.pEnabled = function(
	vData
)
{
	if (vData != null)
		this.mEnabled = vData;
	else
		return this.mEnabled;
}









/** -------------------------------------------------------------------------------------------------
	fReset
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fReset = function(
	vReturnFun
)
{
//~ fDbg("*** cModuleLocalWidgets, fReset(), ");
	var vThis, vContainerWidth;
	vThis = this;

	vContainerWidth = vThis.mViewPortSize[0] - 80;

	$("#div_eventWidgetPlayer_crawling").css("left", vContainerWidth + "px");
	$("#crawling_container").html("");
}

/** -------------------------------------------------------------------------------------------------
	fCheckConfigMode
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fCheckConfigMode = function(
)
{
	var vThis;
	vThis = this;

	if (vThis.pConfigMode() == "default")
		return;

	vThis.mTimeSpanConfigModeOn++;
	if (this.mTimeSpanConfigModeOn >= 5)
	{
		vThis.pConfigMode("default");
		vThis.mTimeSpanConfigModeOn = 0;
	}
}

/** -------------------------------------------------------------------------------------------------
	fClearEventList
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fClearEventList = function(
	vReturnFun
)
{
//~ fDbg("*** cModuleLocalWidgets, fClearEventList(), ");
	var vThis;
	vThis = this;

	vThis.mEventList = [];
}


/** -------------------------------------------------------------------------------------------------
	fClearPrevEventList
-------------------------------------------------------------------------------------------------- */
cModuleLocalWidgets.prototype.fClearPrevEventList = function(
	vWidgetID,
	vReturnFun
)
{
//~ fDbg("*** cModuleLocalWidgets, fClearPrevEventList(), ");
	var vThis, i;
	vThis = this;

	for (i = 0; i < vThis.mPrevEventList.length; i++)
	{
		if (vThis.mPrevEventList[i][0] == vWidgetID)
			vThis.mPrevEventList[i][1] = [];
	}
	if (vReturnFun)
		vReturnFun();
}



















































































































































































































/*
 * Use a dummy div in main HTML to obtain dynamic width of text strings
 */
cModuleLocalWidgets.prototype.fGetTextWidth = function(
	vStr
)
{
	var vFixHeight = 50;
	var vPadding = 40;
	var vFontSize = (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 2) ? 17: 32;

	var htmlString = "<div id='div_dynamic_text_length_inner' style='float:left; width:auto; height:50px; font-size:" + vFontSize + "px;' >";
	htmlString +=  "" + vStr.substr(0, parseInt(vStr.length / 3));
	htmlString +=  "</div>";

	$("#div_dynamic_text_length").html(htmlString);
	var o = $("#div_dynamic_text_length_inner");
	var vWidth = (o.width() + vPadding) * 3;

	return vWidth;
}


cModuleLocalWidgets.prototype.fGenerateGUID = function(
)
{
    var S4 = function() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
