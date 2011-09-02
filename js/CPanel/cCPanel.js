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
		"./js/CPanel/cModuleWE.js",
		"./js/CPanel/cModuleEventTicker.js",
		"./js/CPanel/cModuleChromaBg.js",

		"./js/CPanel/widgetengine/cWEFlash.js",
		"./js/CPanel/widgetengine/cWEHtml.js",
		
		"./js/CPanel/panels/cPMain.js",
		"./js/CPanel/panels/cSPChannels.js",
		"./js/CPanel/panels/cSPSettings.js",
		"./js/CPanel/panels/cSPInfo.js",
		"./js/CPanel/panels/cSPActivation.js"
	]
};

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cCPanel(
)
{
	this.JSCORE = null;

	this.mLocked = false;

	// widget playing
	this.mCurrWidget = null;
	this.mCurrWidgetPeriod = 30;
	this.mCurrWidgetTimeSpend = 0;
	
	// states
	this.mPrevState = "";
	this.mState = "";			//	"controlpanel" | "htmlwidgetengine" | "flashwidgetengine" | "event"
	this.mSubState = "";		// "cpanel_main" | "cpanel_channels" | "cpanel_settings" | "cpanel_info"


	this.mViewPortSize = [];
	this.mWidgetEdgeOffset = [50, 50];
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
	var vThis;
	vThis = this;
	
	// hide all
	vThis.fHideAll();
	
	// show div(s) for initialization
	$("#div_startup").show();
	$("#div_cpanel_corner_container").show();
	vThis.pState("controlpanel");
	
	
	// -------------- resize --------------
	$(window).resize(function() { vThis.fResize(); });
	
	
	// load other js classes
	fLoadExtJSScript(kCPanelStatic.mPluginClassList, vReturnFun);
}

// -------------------------------------------------------------------------------------------------
//	fResize
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fResize = function(
)
{
fDbg("*** window resize : " + $(window).width() + ", " + $(window).height());
	var vThis;
	
	vThis = this;
	if (typeof window.innerWidth != 'undefined')
	{
		vThis.mViewPortSize[0] = window.innerWidth,
		vThis.mViewPortSize[1] = window.innerHeight
	}
	if (vThis.mViewPortSize[0] > 800)
		$("#div_CPanel").css("left", (vThis.mViewPortSize[0] - 800) / 2 + "px");
	if (vThis.mViewPortSize[1] > 600)
		$("#div_CPanel").css("top", (vThis.mViewPortSize[1] - 600) / 2 + "px");
	
	
	
	cModel.fGetInstance().VIEWPORTSIZE = [vThis.mViewPortSize[0], vThis.mViewPortSize[1]];
	cModuleEventTicker.fGetInstance().fResize(vThis.mViewPortSize);


	
			$("#iframe_externalUrlPlayer").attr("width", vThis.mViewPortSize[0] + 18 + "px");
			$("#iframe_externalUrlPlayer").attr("height", vThis.mViewPortSize[1] + 18 + "px");
			$("#div_externalUrlPlayer").css("width", vThis.mViewPortSize[0] + "px");
			$("#div_externalUrlPlayer").css("height", vThis.mViewPortSize[1] + "px");
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
	$("#div_eventWIdgetPlayer_visualaids").children().hide();
	
	// hide all widget players
	$("#div_htmlWidgetPlayer").hide();
	$("#div_eventWidgetPlayer").hide();
}

// -------------------------------------------------------------------------------------------------
//	fStartUp - initialize all elements
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fStartUp = function(
)
{
fDbg("*** cCPanel, fStartUp()");
	var vThis;
	vThis = this;
	
	// register all classes
	cModuleChromaBg.fGetInstance("div_tempBg");

	cPMain.fGetInstance("div_cpanelMain");
	cSPChannels.fGetInstance("div_channelMain");
	cSPSettings.fGetInstance("div_settingMain");
	cSPInfo.fGetInstance("div_infoMain");
	cSPActivation.fGetInstance("div_activationMain");
	
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
			vThis.fAnimateOutControlPanel(function() {
				cModuleEventTicker.fGetInstance().pEnabled(true);
				cModuleEventTicker.fGetInstance().fReset();
				cModuleEventTicker.fGetInstance().fAnimateIn();
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
//~ vThis.fOnSignal("setiframe", ["http://www.google.com", "fullscreen"]);
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
				cModuleEventTicker.fGetInstance().pEnabled(false);
			});
			cCPanel.instance.mLocked = false;
			break;
			
		case "empty":
			switch (vThis.mPrevState)
			{
			case "event":
				cModuleEventTicker.fGetInstance().pEnabled(true);
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
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			//~ case "channelMain": cSCPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			
			case "cpanel_main":			cPMain.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_settings":		cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_info":		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_activation":	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			//~ case "channelMain": cSCPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			
			case "cpanel_main": 		cPMain.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_settings":		cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_info":		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_activation":	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "cpanel_main":
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
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPSettings.fGetInstance().fAnimateIn();
						vThis.mSubState = "cpanel_settings";
					});
				}
				else if (o == "info")
				{
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPInfo.fGetInstance().fAnimateIn();
						vThis.mSubState = "cpanel_info";
					});
				}
				else if (o == "activation")
				{
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPActivation.fGetInstance().fUpdate();
						cSPActivation.fGetInstance().fAnimateIn();
						vThis.mSubState = "cpanel_activation";
					});
				}
				break;
			case "cpanel_info":			cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);		break;
			case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	break;
			case "cpanel_settings": 	cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 	break;
			case "cpanel_activation": 	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (cModel.fGetInstance().CHUMBY_NETWORK_UP != "true")
			return;
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "cpanel_info": 		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 		return;
			case "cpanel_channels": 	cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 	return;
			case "cpanel_settings": 	cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 	return;
			case "cpanel_activation":	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (cModel.fGetInstance().CHUMBY_NETWORK_UP != "true")
			return;
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "cpanel_info": 		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 		return;
			case "cpanel_channels": 	cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 	return;
			case "cpanel_settings": 	cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 	return;
			case "cpanel_activation":	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
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
	case "checkalive":
		return true;
		break;
		
	case cConst.SIGNAL_STARTUP_INIT:
		vThis.fResize();
		cModuleChromaBg.fGetInstance().fRefreshScreen();
		cModuleEventTicker.fGetInstance().fInit();
		cModuleEventTicker.fGetInstance().fAddStampEvent(["connecting...", null, null]);
		vThis.pState("event");
		fCheckAlive();
		break;

	case cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_COMPLETE:
		vThis.fOnSignal(cConst.SIGNAL_SCPINFO_UPDATE, null, null);
		break;

	case cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_FAILED:
		vThis.fOnSignal(cConst.SIGNAL_SCPINFO_UPDATE, null, null);
		vThis.fOnSignal(cConst.SIGNAL_SCPINFO_SHOW, null, null);
		break;

	case cConst.SIGNAL_STARTUP_AUTHORIZATION_FAIL:
		cModuleEventTicker.fGetInstance().pEnabled(false);
		cModuleEventTicker.fGetInstance().fAnimateOut(function() {
			cModuleEventTicker.fGetInstance().fStopAll();
			vThis.fShowControlPanel("notactivated");
		});
		break;
	
	case cConst.SIGNAL_STARTUP_COMPLETE:
		cModuleEventTicker.fGetInstance().fEndStampEvent();
		cModuleWE.fGetInstance().pCurrChannel(cModel.fGetInstance().CHANNEL_LIST[1]);
		cModuleWE.fGetInstance().fNext();
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









		
		
	case cConst.SIGNAL_NETWORKEVENT_DISCONNECTED:
		vThis.fToast("Network Disconnected! Please check your wireless connection.");
		break;
		
	case cConst.SIGNAL_SCPINFO_SHOW:
		vThis.fOnSignal(cConst.SIGNAL_GOTO_CONTROLPANEL, ["nointernet"], null);
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
			cModuleEventTicker.fGetInstance().pEnabled(false);
			cModuleEventTicker.fGetInstance().fAnimateOut(function() {
				cModuleEventTicker.fGetInstance().fStopAll();
				if (vData && vData.length > 0)
					vThis.fShowControlPanel(vData[0]);
				else
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

	case "setiframe":
		fDbg("---> set url : " + vData[0] + ", @option : " + vData[1]);
		$("#iframe_externalUrlPlayer").attr("src", vData[0]);
		$("#div_externalUrlPlayer").show();

		var vIntervalSetIFrame = setInterval(function() {
			$("#iframe_externalUrlPlayer").attr("src", "");
			$("#div_externalUrlPlayer").hide();
		}, 10000);
		break;
	}
}















cCPanel.prototype.fToast = function(
	vMsg,
	vType,
	vCssObj
)
{
fDbg("*** cCPanel, fToast(), ");
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
	vData,
	vReturnFun
)
{
fDbg("*** cCPanel, fShowControlPanel(), ");
	var o, vThis;
	vThis = this;


	vThis.fAnimateInControlPanel(function() {
		cCPanel.instance.pState("controlpanel");

		if (!vData)
			$("#div_cpanelMain").show();
		else if (vData == "nointernet")
		{
			$("#div_infoMain").show();
			cSPInfo.fGetInstance().pEnableBack(false);
		}
		else if (vData == "notactivated")
		{
			cSPActivation.fGetInstance().fShow();
			//~ cSPActivation.fGetInstance().pEnableBack(false);
		}
		
		$("#div_startup").fadeOut(function() {
			if (!vData)
				vThis.mSubState = "cpanel_main";
			else if (vData == "nointernet")
				vThis.mSubState = "cpanel_info";
			else if (vData == "notactivated")
				vThis.mSubState = "cpanel_activation";
		});
		
		if (vReturnFun)
			vReturnFun();
	});
}










// -------------------------------------------------------------------------------------------------
//	fAnimateInControlPanel
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fAnimateInControlPanel = function(
	vReturnFun
)
{
	var vThis;

	vThis = this;
	
	$("#div_CPanel").show();
	$("#div_CPanel").children().hide();
	$("#div_cpanel_corner_container").show();
	
	$("#div_startup").show();
	$("#div_CPanel").css("left", "-1300px");
	$("#div_CPanel").animate({
		left: (vThis.mViewPortSize[0] - 800) / 2 + "px"
	}, 1200, function() {
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
	var vThis;

	vThis = this;
	$("#div_CPanel").css("left", (vThis.mViewPortSize[0] - 800) / 2 + "px");
	$("#div_CPanel").animate({
		left: "-1300px"
	}, 1200, function() {
		if (vReturnFun)
			vReturnFun();
	});
}





cCPanel.prototype.fBack = function(
	vData
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
	case "cpanel_settings":
		cSPSettings.fGetInstance().fAnimateOut(function() {
			cPMain.fGetInstance().fAnimateIn(function() {
				vThis.mSubState = "cpanel_main";
			});
		});
		break;
	case "cpanel_activation":
		if (vData && vData == "all")
			vThis.fAnimateOutControlPanel(function() {
				cModuleEventTicker.fGetInstance().pEnabled(true);
				cModuleEventTicker.fGetInstance().fEndStampEvent();
				cModuleEventTicker.fGetInstance().fAnimateIn();
				cModuleWE.fGetInstance().pCurrChannel(cModel.fGetInstance().CHANNEL_LIST[0]);
				cModuleWE.fGetInstance().fNext();
				vThis.pState("event");
				return;
			});
		else
			cSPActivation.fGetInstance().fAnimateOut(function() {
				cPMain.fGetInstance().fAnimateIn(function() {
					vThis.mSubState = "cpanel_main";
				});
			});
		break;
	}
}
