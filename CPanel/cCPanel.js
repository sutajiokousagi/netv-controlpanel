// -------------------------------------------------------------------------------------------------
//	cCPanel class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------
var mGCPanelStatic = {
	mShowDbg : false,
	mPluginClassList : [
		"./CPanel/cSCPMessage.js",
		"./CPanel/cSCPChannels.js",
		"./CPanel/cSCPWidgets.js",
		"./CPanel/cSCPInfo.js",
		"./CPanel/cWEEvent.js",
		"./CPanel/cWEFlash.js",
		"./CPanel/cWEHtml.js",
		"./CPanel/cPIChromaBg.js"
	]
};

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cCPanel(
)
{
	this.JSCORE = null;
	this.mModel = null;
	
	this.mLocked = false;

	
	this.mSubCPanelList = [
		{
			mSubStateName : "flashchannelwidgetsmain",
			mDivID : "div_flashWidgetMain",
			mSubCPanel : null
		},
		{
			mSubStateName : "channelMain",
			mDivID : "div_channelMain",
			mSubCPanel : null
		},
		{
			mSubStateName : "infomain",
			mDivID : "div_infoMain",
			mSubCPanel : null
		},
		{
			mSubStateName : "settingmain",
			mDivID : "div_settingMain",
			mSubCPanel : null
		}
	];

	// widget playing
	this.mCurrWidget = null;
	this.mCurrWidgetPeriod = 10;
	this.mCurrWidgetTimeSpend = 0;
	
	// components
	this.mPIChromaBg = null;
	this.mSCPMessage = null;
	this.mSCPChannelsMain = null;
	this.mSCPWidgetsMain = null;
	this.mSCPInfoMain = null;
	this.mSCPSettingMain = null;
	
	this.mWEEvent = null;
	this.mWEHtml = null;
	this.mWEFlash = null;

	// states
	this.mPrevState = "";
	this.mState = "";
	this.mSubState = "";
	
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cCPanel.instance = null;
cCPanel.fGetInstance = function(
)
{
	return cCPanel.instance ? cCPanel.instance : (cCPanel.instance = new cCPanel());
}

// -------------------------------------------------------------------------------------------------
//	pState
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.pState = function(
	vState
)
{
	if (! vState)
		return cCPanel.instance.mState;
		
	if (cCPanel.instance.mState != vState)
	{
		cCPanel.instance.mPrevState = cCPanel.instance.mState;
		cCPanel.instance.mState = vState;
	}
	return [cCPanel.instance.mPrevState, cCPanel.instance.mState];
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fInit = function(
	vReturnFun
)
{
	// hide all
	this.fHideAll();

	//~ $("#div_qrcodeMain").show();
	//~ $("#div_toast").show();
	
	// show div(s) for initialization
	$("#div_startup").show();
	$("#div_startup_logo").animate({}, 3000, function() { });
	
	$("#div_loader").show();
	$("#div_messageBoard").show();
	
	var vViewPortSize = [];
	var vWidgetEdgeOffset = [50, 50];
	if (typeof window.innerWidth != 'undefined')
	{
		vViewPortSize[0] = window.innerWidth,
		vViewPortSize[1] = window.innerHeight
	}
	if (vViewPortSize[0] > 800)
		$("#div_CPanel").css("left", (vViewPortSize[0] - 800) / 2 + "px");
	if (vViewPortSize[1] > 600)
		$("#div_CPanel").css("top", (vViewPortSize[1] - 600) / 2 + "px");
	
	if ($("#div_widgetPlayer").length)
	{	
		$("#div_widgetPlayer").css("left", (vViewPortSize[0] - parseFloat($("#div_widgetPlayer").css("width").split("px")[0]) - vWidgetEdgeOffset[0]) + "px")
		$("#div_widgetPlayer").css("top", (vViewPortSize[1] - parseFloat($("#div_widgetPlayer").css("height").split("px")[0]) - vWidgetEdgeOffset[1]) + "px")
	}
	
	$(window).resize(function() {
		fDbg2("*** window resize : " + $(window).width() + ", " + $(window).height());
	});

	mCurrDivVisible = "div_messageBoard";
	this.pState("controlpanel");
	
	
	// load other js classes
	fLoadExtJSScript(mGCPanelStatic.mPluginClassList, vReturnFun);
}

// -------------------------------------------------------------------------------------------------
//	fHideAll
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideAll = function(
)
{
	$("#div_tempBg").hide();
	$("#div_CPanel").children().hide();
	
	// hide activation div
	$("#div_activation").hide();
	
	// hide all debug div
	if (!mGCPanelStatic["mShowDbg"])
		$("#div_dbg_container").hide();
	
	// hide all widget players
	$("#div_htmlWidgetPlayer").hide();
	$("#div_eventWidgetPlayer").hide();
}

// -------------------------------------------------------------------------------------------------
//	fHideAll
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fStartUp = function(
)
{
	fDbg("*** cCPanel, fStartUp()");
	
	// register all classes
	this.mPIChromaBg = cPIChromaBg.fGetInstance("div_tempBg");
	
	this.mSCPMessage = cSCPMessage.fGetInstance("div_messageBoard");
	this.mSCPChannelsMain = cSCPChannels.fGetInstance("div_channelMain");
	this.mSCPWidgetsMain = cSCPWidgets.fGetInstance("div_flashWidgetMain");
	this.mSCPInfo = cSCPInfo.fGetInstance("div_infoMain");
	
	this.mWEEvent = cWEEvent.fGetInstance($("#div_eventWidgetPlayer"));
	this.mWEFlash = cWEFlash.fGetInstance(null);
	this.mWEHtml = cWEHtml.fGetInstance($("#div_htmlWidgetPlayer"));
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cCPanel, fOnSignal(), " + vSignal + ", " + vData);
	var mCPanel = cCPanel.fGetInstance();
	var i, o;
	
	// handle the lock state;
	//~ if (cCPanel.instance.mLocked == true)
		//~ return;
	//~ cCPanel.instance.mLocked = true;

	//~ fDbg2(">>>>>>>> " + cModel.fGetInstance().CHUMBY_INTERNET);
	//~ fDbg2(">>>>>>>> " + cModel.fGetInstance().CHUMBY_INTERNET == "");
	// =========================
	// JavaScript Injection Signals
	// =========================
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (mCPanel.mState != "controlpanel")
			mCPanel.fOnSignal(cConst.SIGNAL_GOTO_CONTROLPANEL);
		else
		{
			if (mCPanel.mPrevState == "htmlwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
			else if (mCPanel.mPrevState == "flashwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_FLASHWIDGETENGINE);
			else if (mCPanel.mPrevState == "eventwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_EVENTWIDGETENGINE);
		}
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (cCPanel.instance.mLocked == true)
			return;
		cCPanel.instance.mLocked = true;
		switch (mCPanel.mState)
		{
		case "htmlwidgetengine":
			cWEHtml.fGetInstance().fSlideOut(function() {
				cCPanel.instance.pState("empty");
				cCPanel.instance.mLocked = false;
			});
			break;
		case "flashwidgetengine":
			cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1 1</value>"}, null);
			cCPanel.instance.pState("empty");
			cCPanel.instance.mLocked = false;
			break;
		case "eventwidgetengine":
			cCPanel.instance.mWEEvent.fSlideDown(function() {
				cCPanel.instance.pState("empty");
				cCPanel.instance.mLocked = false;
			});
			break;
		case "empty":
			fDbg2("prev state : " + mCPanel.mPrevState);
			switch (mCPanel.mPrevState)
			{
			case "htmlwidgetengine":
				cWEHtml.fGetInstance().fSlideIn(function() {
					cCPanel.instance.pState("htmlwidgetengine");
					cCPanel.instance.mLocked = false;
				});
				break;
			case "flashwidgetengine":
				cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>959 464 320 240</value>"}, null);
				cCPanel.instance.pState("flashwidgetengine");
				cCPanel.instance.mLocked = false;
				break;
			case "eventwidgetengine":
				cCPanel.instance.mWEEvent.fSlideUp(function() {
					cCPanel.instance.pState("eventwidgetengine");
					cCPanel.instance.mLocked = false;
				});
				break;
			}
			break;
		case "controlpanel":
			mCPanel.fOnSignal(cConst.SIGNAL_BUTTON_CENTER);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (mCPanel.mState != "controlpanel")
			return;
			
		switch (mCPanel.mSubState)
		{
		case "channelMain": cSCPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "infomain": cSCPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (mCPanel.mState != "controlpanel")
			return;
			
		switch (mCPanel.mSubState)
		{
		case "channelMain": cSCPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "infomain": cSCPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (mCPanel.mState == "controlpanel" && mCPanel.mSubState == "channelMain")
		{
			o = cSCPChannels.fGetInstance().fGetSelected();
			
			if (o[0] == 0)
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_FLASHWIDGETENGINE);
			else if (o[0] == 1)
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
			else if (o[0] == 2)
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_EVENTWIDGETENGINE);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (cModel.fGetInstance().CHUMBY_NETWORK_UP != "true")
			return;
		if (mCPanel.mState == "controlpanel")
		{
			if (mCPanel.mSubState == "flashchannelwidgetsmain")
			{
				if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "485px")
				{
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top", "75px");
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("height", "410px");
					return;
				}
			}
			
			for (i = 0; i < mCPanel.mSubCPanelList.length; i++)
				if (mCPanel.mSubCPanelList[i].mSubStateName == mCPanel.mSubState)
				{
					if (i == 0)
						o = [i, mCPanel.mSubCPanelList.length - 1];
					else
						o = [i, i - 1];
					break;
				}
			
			cSCPMessage.fGetInstance().fHide();
						
			$("#" + mCPanel.mSubCPanelList[o[0]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).fadeIn();
			
			mCPanel.mSubState = mCPanel.mSubCPanelList[o[1]].mSubStateName;
			if (mCPanel.mSubState == "flashchannelwidgetsmain")
				cSCPWidgets.fGetInstance().fRefreshChannelDiv();
				//~ cCPanel.instance.fRefreshChannelDiv();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "html_config.html";
			return;
		}
		if (cModel.fGetInstance().CHUMBY_NETWORK_UP != "true")
			return;
		if (mCPanel.mState == "controlpanel")
		{
			if (mCPanel.mSubState == "flashchannelwidgetsmain")
			{
				if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "75px")
				{
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top", "485px");
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("height", "50px");
					return;
				}
			}
			
			for (i = 0; i < mCPanel.mSubCPanelList.length; i++)
				if (mCPanel.mSubCPanelList[i].mSubStateName == mCPanel.mSubState)
				{
					if (i == mCPanel.mSubCPanelList.length - 1)
						o = [i, 0];
					else
						o = [i, i + 1];
					break;
				}
			cSCPMessage.fGetInstance().fHide();
			
			$("#" + mCPanel.mSubCPanelList[o[0]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).fadeIn();
			mCPanel.mSubState = mCPanel.mSubCPanelList[o[1]].mSubStateName;
			if (mCPanel.mSubState == "flashchannelwidgetsmain")
				cSCPWidgets.fGetInstance().fRefreshChannelDiv();
				//~ cCPanel.instance.fRefreshChannelDiv();
		}
		break;
	}




	
	// =========================
	// internal signals
	// =========================
	switch(vSignal)
	{
	case cConst.SIGNAL_STARTUP_INIT:
		cPIChromaBg.fGetInstance().fRefreshScreen();
		break;

	case cConst.SIGNAL_STARTUP_COMPLETE:
		this.fOnSignal(cConst.SIGNAL_WIDGETENGINE_SHOW);
		break;
		
	case cConst.SIGNAL_HEARTBEAT:
		switch (mCPanel.mState)
		{
		case "htmlwidgetengine":
			mCPanel.mCurrWidgetTimeSpend++;
			if (mCPanel.mCurrWidgetTimeSpend > mCPanel.mCurrWidgetPeriod)
			{
				// play next widget
				cWEHtml.fGetInstance().fPlayWidget("next");
				
				// reset curre widget timer
				mCPanel.mCurrWidgetTimeSpend = 0;
			}
			break;
		}
		//~ fDbg2(mCPanel.mCurrWidgetTimeSpend);
		break;
		
	case cConst.SIGNAL_MESSAGE:
		cSCPMessage.fGetInstance().fDisplay(vData[0]);
		break;
		
	case cConst.SIGNAL_NETWORKEVENT_DISCONNECTED:
		mCPanel.fToast("Network Disconnected! Please check your wireless connection.");
		break;
		
	case cConst.SIGNAL_CHANNELDIV_SHOW:
		switch (mCurrDivVisible)
		{
		case "div_messageBoard":
			//~ mCPanel.fRefreshChannelDiv();
			
			cSCPWidgets.fGetInstance().fRefreshChannelDiv(function() {
				cCPanel.fGetInstance().fShowChannelDiv();
			});
			break;
		}
		break;

	case cConst.SIGNAL_SCPINFO_SHOW:
		if ($("#div_startup").is(":visible"))
		{
			$("#div_loader").hide();
			cSCPMessage.fGetInstance().fHide();
			$("#div_startup").fadeOut(function() {
				cSCPInfo.fGetInstance().fFadeIn();
				mCPanel.mSubState = "infomain";
			});
		}
		else
		{
			$("#div_loader").hide(function() {
				cSCPMessage.fFadeOut(function() {
					cSCPInfo.fGetInstance().fFadeIn();
					cCPanel.fGetInstance().mSubState = "infomain";
				});
			});
		}
		break;

	case cConst.SIGNAL_SCPINFO_UPDATE:
		cSCPInfo.fGetInstance().fUpdate();
		break;
		
	case cConst.SIGNAL_WIDGETENGINE_SHOW:
		mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
		break;
		
	case cConst.SIGNAL_GOTO_CONTROLPANEL:
		switch (mCPanel.mState)
		{
		case "controlpanel":
			break;
		case "htmlwidgetengine":
			cWEHtml.fGetInstance().fSlideOut(function() {
				mCPanel.fShowControlPanel();
			});
			break;
		case "flashwidgetengine":
			cWEFlash.fGetInstance().fAnimateOut();
			var to1 = setTimeout(function() {
				cWEFlash.fGetInstance().fHide();
			}, 1000);

			var to2 = setTimeout(function() {
				cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 703</value>"}, function() {});
				cCPanel.instance.fShowControlPanel();
			}, 1500);
			break;
		case "eventwidgetengine":
			cCPanel.instance.mWEEvent.fSlideDown(function() {
				cCPanel.instance.mWEEvent.fReset();
				mCPanel.fShowControlPanel();
			});
			break;
		case "empty":
			switch (mCPanel.mPrevState)
			{
			case "flashwidgetengine":
				cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>hide</value>"}, function() {});
				cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 703</value>"}, function() {});
				mCPanel.fShowControlPanel();
				break;
			case "htmlwidgetengine":
				mCPanel.fShowControlPanel();
				break;
		case "eventwidgetengine":
				cCPanel.instance.mWEEvent.fReset();
				mCPanel.fShowControlPanel();
				break;
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_GOTO_HTMLWIDGETENGINE:
		if ($("#div_loader").is(":visible"))
			$("#div_loader").fadeOut(200, function() { });
			
		$("#div_CPanel").animate({
			left: "-=1200"
		}, 800, function() {
			cCPanel.instance.mCurrWidgetTimeSpend = 0;
			cWEHtml.fGetInstance().fPlayWidget();
			cCPanel.instance.pState("htmlwidgetengine");
		});
		break;
		
	case cConst.SIGNAL_GOTO_FLASHWIDGETENGINE:
		$("#div_flashWidgetMain").show();
		$("#div_CPanel").animate({
			left: "-=1200"
		}, 800, function() {
			cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>959 464 320 240</value>"}, null);
			cWEFlash.fGetInstance().fShow();

			var to1 = setTimeout(function() {
				cWEFlash.fGetInstance().fAnimateIn();
			}, 100);
			
			var to2 = setTimeout(function() {
				cWEFlash.fGetInstance().fPlayWidget("./first_widget.swf", function() {
					cCPanel.instance.pState("flashwidgetengine");
				});
			}, 200);
		});
		break;

	case cConst.SIGNAL_GOTO_EVENTWIDGETENGINE:
		$("#div_CPanel").animate({
			left: "-=1200"
		}, 800, function() {
			cCPanel.instance.mWEEvent.fReset();
			cCPanel.instance.mWEEvent.fShow();
			cCPanel.instance.mWEEvent.fSlideUp(function() {
				cCPanel.instance.pState("eventwidgetengine");
				cCPanel.instance.mWEEvent.fActivate();
			});
		});
		break;
	}
}















cCPanel.prototype.fToast = function(
	vMsg
)
{
//~ fDbg2(vMsg);
	$("#div_toast_content").html(vMsg);
	
	//~ fDbg2($("#div_toast_content").outerWidth());
	//~ fDbg2($("#div_toast_content").width());
	
	$("#div_toast_content").css("top", "-50px");
	$("#div_toast_content").animate({
		top : "10px"
	}, 200, function() {
		var vTO = setTimeout(function() {
			$("#div_toast_content").animate({
				top : "-50px"
			}, 200, function() {
			});
		}, 5000);

	});
	
	//~ fDbg2($("#div_toast_content").outerWidth());
}










// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	control panel div functions
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShowControlPanel
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowControlPanel = function(
)
{
fDbg2("*** cCPanel, fShowControlPanel(), ");
	var o;
	
	$("#div_tempBg").hide();
	$("#div_tempBg").show();
	$("#div_tempBg").css("top", "-720px");
	$("#div_tempBg").animate({
		top: "+=720px"
	}, 1000, function() {
		$("#div_tempBg").hide();
	});

	$("#div_CPanel").css("left", "-960px");
	$("#div_CPanel").animate({
		left: "+=1200"
	}, 800, function() {
		
		switch (cCPanel.instance.mState)
		{
		case "htmlwidgetengine": o = 1; break;
		case "flashwidgetengine": o = 0; break;
		case "eventwidgetengine": o = 2; break;
		case "empty":
			switch (cCPanel.instance.mPrevState)
			{
				case "htmlwidgetengine": o = 1; break;
				case "flashwidgetengine": o = 0; break;
				case "eventwidgetengine": o = 2; break;
			}
			break;
		}
		
		cSCPChannels.fGetInstance().fFadeIn();
		cSCPChannels.fGetInstance().fSetSelected([o], function() {
			cCPanel.instance.mSubState = "channelMain";
		});
		
		cCPanel.instance.pState("controlpanel");
	});
}













// -------------------------------------------------------------------------------------------------
//	fShowChannelDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowChannelDiv = function(
)
{
	$("#div_flashWidgetMain").show();
	$("#div_flashWidgetMain").css("left", "-800px");
	$("#div_flashWidgetMain").animate({
		left: "+=800"
	}, 200, function() {
		// Animation complete
	});
}




/*
cCPanel.prototype.fRefreshScreen = function() {
	var vInterval = setInterval(function() {
		$("#div_tempBg").show();
		if ($("#div_tempBg").css("left") == "-50px")
			$("#div_tempBg").css("left", "-40px");
		else
		{
			$("#div_tempBg").hide();
			$("#div_tempBg").css("left", "-50px");
		}
	}, 2000);
}
*/
