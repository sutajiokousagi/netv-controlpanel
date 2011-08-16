// -------------------------------------------------------------------------------------------------
//	cCPanel class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------
var kCPanelStatic = {
	mShowDbg : false,
	mPluginClassList : [
		"./CPanel/cModuleWE.js",
		"./CPanel/cModuleEventTicker.js",
		"./CPanel/cModuleChromaBg.js",
		"./CPanel/cWEFlash.js",
		"./CPanel/cWEHtml.js",
		
		"./CPanel/cPMain.js",
		"./CPanel/cSPChannels.js",
		"./CPanel/cSCPWidgets.js",
		"./CPanel/cSPInfo.js"
		
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
	this.mCurrWidgetPeriod = 30;
	this.mCurrWidgetTimeSpend = 0;
	
	// states
	this.mPrevState = "";
	this.mState = "";			//	"controlpanel" | "htmlwidgetengine" | "flashwidgetengine" | "event"
	this.mSubState = "";		// "cpanel_main" | "cpanel_channels" | "cpanel_configurations" | "cpanel_info"
	
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
	
	// show div(s) for initialization
	$("#div_startup").show();

	this.pState("controlpanel");

	
	// -------------- resize --------------
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
	$(window).resize(function() {
		fDbg2("*** window resize : " + $(window).width() + ", " + $(window).height());
	});
	// -------------- ====== --------------

	
	// load other js classes
	fLoadExtJSScript(kCPanelStatic.mPluginClassList, vReturnFun);
}

// -------------------------------------------------------------------------------------------------
//	fHideAll
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideAll = function(
)
{
	$("#div_tempBg").hide();
	$("#div_CPanel").children().hide();
	$("#div_CPanel").hide();
	
	// hide activation div
	$("#div_activation").hide();
	
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
	cModuleChromaBg.fGetInstance("div_tempBg");

	cPMain.fGetInstance("div_cpanelMain");
	cSPChannels.fGetInstance("div_channelMain");
	cSCPWidgets.fGetInstance("div_flashWidgetMain");
	cSPInfo.fGetInstance("div_infoMain");
	
	cModuleEventTicker.fGetInstance($("#div_eventWidgetPlayer"));
	cModuleWE.fGetInstance(null);
	cWEFlash.fGetInstance(null);
	cWEHtml.fGetInstance($("#div_htmlWidgetPlayer"));
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
//~ fDbg("*** cCPanel, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, o, p;
	vThis = this;
	
	//~ if (cCPanel.instance.mLocked == true)
		//~ return;
	//~ cCPanel.instance.mLocked = true;
	// =========================================================================
	// JavaScript Injection Signals
	// =========================================================================
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		switch (vThis.mState)
		{
		case "controlpanel":
			//~ vThis.fOnSignal(cConst.SIGNAL_GOTO_EVENTTICKER);
			vThis.fAnimateOutControlPanel(function() {
				cModuleEventTicker.fGetInstance().fAnimateIn();
				cModuleEventTicker.fGetInstance().pEnabled(true);
			});
			vThis.pState("event");
			break;
			
		case "event":
			vThis.fOnSignal(cConst.SIGNAL_GOTO_CONTROLPANEL, null, null);
			break;
		}
		
/*
		if (mCPanel.mState != "controlpanel")
			mCPanel.fOnSignal(cConst.SIGNAL_GOTO_CONTROLPANEL);
		else
		{
			switch (mCPanel.mPrevState)
			{
			case "htmlwidgetengine":
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
				break;
			case "flashwidgetengine":
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_FLASHWIDGETENGINE);
				break;
			case "eventwidgetengine":
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_EVENTWIDGETENGINE);
				break;
			}
			if (mCPanel.mPrevState == "htmlwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
			else if (mCPanel.mPrevState == "flashwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_FLASHWIDGETENGINE);
			else if (mCPanel.mPrevState == "eventwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_EVENTWIDGETENGINE);
		}
*/
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		if (cCPanel.instance.mLocked == true)									// release lock
			return;
		cCPanel.instance.mLocked = true;
		switch (vThis.mState)
		{
		case "controlpanel":
			//~ vThis.fOnSignal(cConst.SIGNAL_BUTTON_CENTER);
			cCPanel.instance.mLocked = false;
			break;

		case "event":
			cModuleEventTicker.fGetInstance().fAnimateOut(function() {
				vThis.pState("empty");
			});
			cCPanel.instance.mLocked = false;
			break;
			
		case "empty":
			fDbg("==================>>>>> prev : " + vThis.mPrevState);
			switch (vThis.mPrevState)
			{
			case "event":
				cModuleEventTicker.fGetInstance().fAnimateIn(function() {
					vThis.pState("event");
				});
				break;
			}
			cCPanel.instance.mLocked = false;
			break;
			
			
		case "widgetengine":
			cModuleWE.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
			cCPanel.instance.mLocked = false;
			break;

			/*
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
			*/
		}
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if (vThis.mState != "controlpanel")
			return;
			
		switch (vThis.mSubState)
		{
		case "channelMain": cSCPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "infomain": cSCPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		
		case "cpanel_main":			cPMain.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		//~ case "cpanel_settings":		cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "cpanel_info":		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mState != "controlpanel")
			return;
			
		switch (vThis.mSubState)
		{
		case "channelMain": cSCPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "infomain": cSCPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		
		case "cpanel_main": 		cPMain.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		//~ case "cpanel_settings":		cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		case "cpanel_info":		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		/*
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
		*/
		if (vThis.mState == "controlpanel")
		{
			if (vThis.mSubState == "cpanel_main")
			{
				o = cPMain.fGetInstance().pCurrSelection();
				if (o == "channels")
				{
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPChannels.fGetInstance().fAnimateIn();
						cSPChannels.fGetInstance().fRenderChannelList();
						vThis.mSubState = "cpanel_channels";
					});
					
				}
				else if (o == "configurations")
				{
					/*
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPConfigurations.fGetInstance().fAnimateIn();
						vThis.mSubState = "cpanel_configurations";
					});
					*/
				}
				else if (o == "info")
				{
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPInfo.fGetInstance().fAnimateIn();
						vThis.mSubState = "cpanel_info";
					});
				}
			}
			else if (vThis.mSubState == "cpanel_info")
			{
				cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
			}
			else if (vThis.mSubState == "cpanel_channels")
			{
				cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (cModel.fGetInstance().CHUMBY_NETWORK_UP != "true")
			return;
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "cpanel_info": cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); return;
			case "cpanel_channels": cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); return;
			}







			
			if (vThis.mSubState == "flashchannelwidgetsmain")
			{
				if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "485px")
				{
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top", "75px");
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("height", "410px");
					return;
				}
			}
			
			for (i = 0; i < vThis.mSubCPanelList.length; i++)
				if (vThis.mSubCPanelList[i].mSubStateName == vThis.mSubState)
				{
					if (i == 0)
						o = [i, vThis.mSubCPanelList.length - 1];
					else
						o = [i, i - 1];
					break;
				}
			
			cSCPMessage.fGetInstance().fHide();
			
			$("#" + vThis.mSubCPanelList[o[0]].mDivID).hide();
			$("#" + vThis.mSubCPanelList[o[1]].mDivID).hide();
			$("#" + vThis.mSubCPanelList[o[1]].mDivID).fadeIn();
			
			vThis.mSubState = vThis.mSubCPanelList[o[1]].mSubStateName;
			if (vThis.mSubState == "flashchannelwidgetsmain")
				cSCPWidgets.fGetInstance().fRefreshChannelDiv();
				//~ cCPanel.instance.fRefreshChannelDiv();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (cModel.fGetInstance().CHUMBY_NETWORK_UP != "true")
			return;
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "cpanel_info": cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); return;
			case "cpanel_channels": cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); return;
			}






			
			
			if (vThis.mSubState == "flashchannelwidgetsmain")
			{
				if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "75px")
				{
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top", "485px");
					$("#div_flashWidgetMain").children(".bg_focusborder_outer").css("height", "50px");
					return;
				}
			}
			
			for (i = 0; i < vThis.mSubCPanelList.length; i++)
				if (vThis.mSubCPanelList[i].mSubStateName == vThis.mSubState)
				{
					if (i == vThis.mSubCPanelList.length - 1)
						o = [i, 0];
					else
						o = [i, i + 1];
					break;
				}
			cSCPMessage.fGetInstance().fHide();
			
			$("#" + vThis.mSubCPanelList[o[0]].mDivID).hide();
			$("#" + vThis.mSubCPanelList[o[1]].mDivID).hide();
			$("#" + vThis.mSubCPanelList[o[1]].mDivID).fadeIn();
			vThis.mSubState = vThis.mSubCPanelList[o[1]].mSubStateName;
			if (vThis.mSubState == "flashchannelwidgetsmain")
				cSCPWidgets.fGetInstance().fRefreshChannelDiv();
				//~ cCPanel.instance.fRefreshChannelDiv();
		}
		break;
		
	case cConst.SIGNAL_ANDROID_START_CONFIGURING:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "./html_config/index_android.html";
			return;
		}
		break;
		
	case cConst.SIGNAL_IOS_START_CONFIGURING:
		if (cModel.fGetInstance().CHUMBY_INTERNET == "false")
		{
			location.href = "./html_config/index_ios.html";
			return;
		}
		break;
	}



	




	// =========================================================================
	// internal signals
	// =========================================================================
	switch(vSignal)
	{
	case cConst.SIGNAL_STARTUP_INIT:
		cModuleChromaBg.fGetInstance().fRefreshScreen();
		cModuleEventTicker.fGetInstance().fInit();
		cModuleEventTicker.fGetInstance().fAddStampEvent(["booting up...", null, null]);

		vThis.pState("event");
		//~ vThis.pState("widgetplaying");
		//~ vThis.pState("controlpanel");
		break;

	case cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_COMPLETE:
		vThis.fOnSignal(cConst.SIGNAL_SCPINFO_UPDATE, null, null);
		break;

	case cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_FAILED:
		vThis.fOnSignal(cConst.SIGNAL_SCPINFO_UPDATE, null, null);
		vThis.fOnSignal(cConst.SIGNAL_SCPINFO_SHOW, null, null);
		break;

	case cConst.SIGNAL_STARTUP_COMPLETE:
		cModuleEventTicker.fGetInstance().fEndStampEvent();
		cModuleWE.fGetInstance().pCurrChannel(cModel.fGetInstance().CHANNEL_LIST[1]);
		cModuleWE.fGetInstance().fNext();

		
		
		/*
		var tempTimeout = setTimeout(function() {
			//~ cModuleEventTicker.fGetInstance().fEndStampMessage();
			cModuleEventTicker.fGetInstance().mStampEventList = [];
			fDbg("time to die!!!!!!!!!!!!!!!");
		}, 1000);
		*/
		/*
		// hide loader
		if ($("#div_loader").is(":visible"))
			$("#div_loader").fadeOut(200, function() { });

		// hide / slide-out controlpanel
		vThis.fAnimateOutControlPanel(function() {
			cModuleWE.fGetInstance().pCurrChannel(cModel.fGetInstance().CHANNEL_LIST[1]);
			cModuleWE.fGetInstance().fNext();
			vThis.pState("widgetengine");
			return;
		});
		*/
		break;
		
	case cConst.SIGNAL_HEARTBEAT:
		switch (vThis.mState)
		{
		case "event":
			cModuleWE.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
			break;
		}
		break;
		
	case cConst.SIGNAL_MESSAGE_WIDGETMSG:
		//~ if (vThis.mState == "widgetengine")
		cModuleWE.fGetInstance().fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, vData, vReturnFun);
		break;
		
		
		
		
		
	case cConst.SIGNAL_MESSAGE:				// original startup system message, deprecated
		//~ cSCPMessage.fGetInstance().fDisplay(vData[0]);
		//~ vThis.fToast(vData[0], "message");
		break;
		
	case cConst.SIGNAL_NETWORKEVENT_DISCONNECTED:
		vThis.fToast("Network Disconnected! Please check your wireless connection.");
		break;
		
	case cConst.SIGNAL_CHANNELDIV_SHOW:
		switch (mCurrDivVisible)
		{
		case "div_messageBoard":
			//~ vThis.fRefreshChannelDiv();
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
				vThis.mSubState = "infomain";
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
		cSPInfo.fGetInstance().fUpdate();
		break;
		
	case cConst.SIGNAL_GOTO_CONTROLPANEL:
		switch (vThis.mState)
		{
		case "controlpanel":
			break;

		case "event":
			$("#div_cpanelMain").hide();
			$("#div_infoMain").hide();
			$("#div_settingMain").hide();
			cModuleEventTicker.fGetInstance().fAnimateOut(function() {
				cModuleEventTicker.fGetInstance().fStopAll();
				vThis.fShowControlPanel();
			});
			break;

		case "widgetengine":
			//~ cModuleWE.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
			cModuleWE.fGetInstance().fStop();
			vThis.fShowControlPanel();
			break;




			
		case "htmlwidgetengine":
			cWEHtml.fGetInstance().fSlideOut(function() {
				vThis.fShowControlPanel();
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
				vThis.fShowControlPanel();
			});
			break;
		case "empty":
			switch (vThis.mPrevState)
			{
			case "flashwidgetengine":
				cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>hide</value>"}, function() {});
				cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 703</value>"}, function() {});
				vThis.fShowControlPanel();
				break;
			case "htmlwidgetengine":
				vThis.fShowControlPanel();
				break;
		case "eventwidgetengine":
				cCPanel.instance.mWEEvent.fReset();
				vThis.fShowControlPanel();
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
	vMsg,
	vType,
	vCssObj
)
{
//~ fDbg2(vMsg);
	
	$("#div_toast_content").html(vMsg);

	if (!vType || vType == "warning")
	{
		$("#div_toast_content").css("background-color", "#FF4444");
		$("#div_toast_content").css("color", "#FFFFFF");
		$("#div_toast_content").css("font-size", "18px");
	}
	else if (vType = "message")
	{
		$("#div_toast_content").css("background-color", "#333");
		$("#div_toast_content").css("color", "#FFFFFF");
		$("#div_toast_content").css("font-size", "18px");
	}
	
	
	$("#div_toast").show();
	$("#div_toast").css("top", "-60px");
	$("#div_toast").animate({
		top : "10px"
	}, 200, function() {
		var vTO = setTimeout(function() {
			$("#div_toast").animate({
				top : "-60px"
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
	vReturnFun
)
{
fDbg2("*** cCPanel, fShowControlPanel(), ");
	var o, vThis;
	vThis = this;

	$("#div_CPanel").show();
	$("#div_CPanel").children().hide();
	$("#div_startup").show();

	/*
	$("#div_tempBg").hide();
	$("#div_tempBg").show();
	$("#div_tempBg").css("top", "-720px");
	$("#div_tempBg").animate({
		top: "+=720px"
	}, 1000, function() {
		$("#div_tempBg").hide();
	});
	*/
	$("#div_CPanel").css("left", "-960px");
	$("#div_CPanel").animate({
		left: "+=1200"
	}, 800, function() {
		$("#div_cpanelMain").show();
		
		cCPanel.instance.pState("controlpanel");
		$("#div_startup").fadeOut(function() {
			vThis.mSubState = "cpanel_main";
		});
		
		if (vReturnFun)
			vReturnFun();
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

// -------------------------------------------------------------------------------------------------
//	fAnimateInControlPanel
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fAnimateInControlPanel = function(
	vReturnFun
)
{
	$("#div_CPanel").animate({
		left: "+=1200"
	}, 800, function() {
		if (vReturnFun)
			vReturnFun();
	});
}

// -------------------------------------------------------------------------------------------------
//	fAnimateOutControlPanel
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fAnimateOutControlPanel = function(
	vReturnFun
)
{
	$("#div_CPanel").animate({
		left: "-=1200"
	}, 800, function() {
		if (vReturnFun)
			vReturnFun();
	});
}





cCPanel.prototype.fBack = function(
)
{
	var vThis;
	vThis = this;

	if (vThis.mState != "controlpanel")
		return;
	
	switch (vThis.mSubState)
	{
	case "cpanel_info":
		cSPInfo.fGetInstance().fAnimateOut(function() {
			cPMain.fGetInstance().fAnimateIn(function() {
				vThis.mSubState = "cpanel_main";
			});
		});
		break;
	case "cpanel_channels":
		cSPChannels.fGetInstance().fAnimateOut(function() {
			cPMain.fGetInstance().fAnimateIn(function() {
				vThis.mSubState = "cpanel_main";
			});
		});
		break;
	}
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
