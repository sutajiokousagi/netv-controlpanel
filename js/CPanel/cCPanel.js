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
		"./js/CPanel/cModuleToast.js",
		"./js/CPanel/cModuleInput.js",
		"./js/CPanel/cModuleWE.js",
		"./js/CPanel/cModuleEventTicker.js",
		"./js/CPanel/cModuleChromaBg.js",

		"./js/CPanel/widgetengine/cWEFlash.js",
		"./js/CPanel/widgetengine/cWEHtml.js",
		
		"./js/CPanel/panels/cPMain.js",
		"./js/CPanel/panels/cSPChannels.js",
		"./js/CPanel/panels/cSPSettings.js",
		"./js/CPanel/panels/cSPInfo.js",
		"./js/CPanel/panels/cSPActivation.js",
		"./js/CPanel/panels/cSPHelp.js"
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
	this.mEnableIFrameResize = false;
	this.mIFrameSizeToSet = [];


	this.mUserFirstButtonPress = false;
	this.mEnableResize = false;
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
	var vThis;
	vThis = this;
//~ fDbg("========================================");
fDbg("*** window resize : " + $(window).width() + ", " + $(window).height() + ", " + vThis.mEnableResize);
//~ fDbg("this.mEnableResize : " + vThis.mEnableResize);
//~ fDbg("this.mEnableResize == false : " + (vThis.mEnableResize == false));
//~ fDbg("this.mEnableResize == true  : " + (vThis.mEnableResize == true));
//~ fDbg("========================================");
if (vThis.mEnableResize == false)
{
	fDbg("it's true! return!!!");
	return;
}
	fDbg("ok... resizing......");


	if (vThis.mViewPortSize[0] == window.innerWidth && vThis.mViewPortSize[1] == window.innerHeight)
		return;

	vThis.mViewPortSize[0] = window.innerWidth;
	vThis.mViewPortSize[1] = window.innerHeight;
	if (cModel)
		cModel.fGetInstance().VIEWPORTSIZE = [vThis.mViewPortSize[0], vThis.mViewPortSize[1]];

	// resize individual panels
	if (vThis.mViewPortSize[0] > 800)
		$("#div_CPanel").css("left", (vThis.mViewPortSize[0] - 800) / 2 + "px");
	if (vThis.mViewPortSize[1] > 600)
		$("#div_CPanel").css("top", (vThis.mViewPortSize[1] - 600) / 2 + "px");
		
	cModuleToast.fGetInstance().fResize(vThis.mViewPortSize);
	cModuleEventTicker.fGetInstance().fResize(vThis.mViewPortSize);
	cModuleWE.fGetInstance().fResize(vThis.mViewPortSize);
	cModuleInput.fGetInstance().fResize(vThis.mViewPortSize);

	
	//Resize iFrame if smaller than viewport
	var width = vThis.mViewPortSize[0];
	var height = vThis.mViewPortSize[1];
	$("#div_externalUrlPlayer").css("width", width + "px");
	$("#div_externalUrlPlayer").css("height", height + "px");
	//~ $("#iframe_externalUrlPlayer").attr("width", width + "px");
	$("#iframe_externalUrlPlayer").css("width", width + "px");
	//~ if ($("#iframe_externalUrlPlayer").height() < height)
	$("#iframe_externalUrlPlayer").css("height", height + "px");
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
	cModuleToast.fGetInstance("div_toast");
	cModuleInput.fGetInstance("div_inputpanel");
	cModuleEventTicker.fGetInstance($("#div_eventWidgetPlayer"));
	cModuleChromaBg.fGetInstance("div_tempBg");
	cModuleWE.fGetInstance(null);
	cWEFlash.fGetInstance(null);
	cWEHtml.fGetInstance($("#div_htmlWidgetPlayer"));

	cPMain.fGetInstance("div_cpanelMain");
	cSPChannels.fGetInstance("div_channelMain");
	cSPSettings.fGetInstance("div_settingMain");
	cSPInfo.fGetInstance("div_infoMain");
	cSPActivation.fGetInstance("div_activationMain");
	cSPHelp.fGetInstance("div_helpMain");

	
	vThis.mFullyLoaded = true;
	//~ fDbg("--- cJSCore fully loaded : " + cJSCore.fGetInstance().mFullyLoaded);
	//~ fDbg("--- cPanel fully loaded : " + cCPanel.fGetInstance().mFullyLoaded);

	if (!cJSCore.fGetInstance().mFullyLoaded)
	{
		var o = setTimeout(function() {
			//~ fDbg("--- --- cJSCore fully loaded : " + cJSCore.fGetInstance().mFullyLoaded);
			//~ fDbg("--- --- cPanel fully loaded : " + cCPanel.fGetInstance().mFullyLoaded);
			if (cJSCore.fGetInstance().mFullyLoaded)
			{
				vThis.mEnableResize = true;
				vThis.fResize();
				// signal CPanel
				vThis.fOnSignal(cConst.SIGNAL_STARTUP_INIT);
			}
		}, 500);
	}
	else
	{
		vThis.mEnableResize = true;
		vThis.fResize();
		// signal CPanel
		vThis.fOnSignal(cConst.SIGNAL_STARTUP_INIT);
	}
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

	//Prevent error when this is called too early by browser
	if (!cConst)
		return;

	// =========================================================================
	// JavaScript Injection Signals
	// ==========================================================================
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		cModuleChromaBg.fGetInstance().fRefreshScreen();
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fHide();
		}
		vThis.mUserFirstButtonPress = true;
		switch (vThis.mState)
		{
		case "controlpanel":
			vThis.fAnimateOutControlPanel(function() {
				cModuleEventTicker.fGetInstance().pEnabled(true);
				
				cModuleEventTicker.fGetInstance().fEndStampEvent();
				cModuleWE.fGetInstance().pCurrChannel(cModel.fGetInstance().CHANNEL_LIST[0]);
				cModuleWE.fGetInstance().fPlay();
				
				cModuleEventTicker.fGetInstance().fReset();
				cModuleEventTicker.fGetInstance().fAnimateIn();
			});
			vThis.pState("event");
			break;
			
		case "event":
			vThis.fOnSignal(cConst.SIGNAL_GOTO_CONTROLPANEL, null, null);
			break;
		}
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fHide();
		}
		vThis.mUserFirstButtonPress = true;
		if (cCPanel.instance.mLocked == true)									// release lock
			return;
		cCPanel.instance.mLocked = true;
		switch (vThis.mState)
		{
		case "controlpanel":
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
		}
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fOnSignal(vSignal, null, null);
			return;
		}
		vThis.mUserFirstButtonPress = true;
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_main":			cPMain.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_settings":		cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_info":		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_activation":	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			case "cpanel_help":		cSPHelp.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fOnSignal(vSignal, null, null);
			return;
		}
		vThis.mUserFirstButtonPress = true;
		if (vThis.mState == "controlpanel")
		{
			switch (vThis.mSubState)
			{
			case "flashchannelwidgetsmain": cSCPWidgets.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_main": 		cPMain.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_settings":		cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_info":		cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); break;
			case "cpanel_activation":	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			case "cpanel_help":		cSPHelp.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fOnSignal(vSignal, null, null);
			return;
		}
		vThis.mUserFirstButtonPress = true;
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
				else if (o == "help")
				{
					cPMain.fGetInstance().fAnimateOut(function() {
						cSPHelp.fGetInstance().fAnimateIn();
						vThis.mSubState = "cpanel_help";
					});
				}
				break;
			case "cpanel_info":			cSPInfo.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);		return;
			case "cpanel_channels":		cSPChannels.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);	return;
			case "cpanel_settings": 	cSPSettings.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 	return;
			case "cpanel_activation": 	cSPActivation.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); return;
			case "cpanel_help": 		cSPHelp.fGetInstance().fOnSignal(vSignal, vData, vReturnFun); 		return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fOnSignal(vSignal, null, null);
			return;
		}
		vThis.mUserFirstButtonPress = true;
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
			case "cpanel_help":			cSPHelp.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);		return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		if ( parseInt($("#div_externalUrlPlayer").css("top")) < 100 )
		{
			var height = vThis.mViewPortSize[1];
			$("#div_externalUrlPlayer").scrollTop( $("#div_externalUrlPlayer").scrollTop() - height/7 );
			//~ $("#iframe_externalUrlPlayer").css("top", "+=" + height / 7 + "px");
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (cModuleInput.fGetInstance().mIsActive)
		{
			cModuleInput.fGetInstance().fOnSignal(vSignal, null, null);
			return;
		}
		vThis.mUserFirstButtonPress = true;
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
			case "cpanel_help":			cSPHelp.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);		return;
			}
		}
		else if (vThis.mState == "event")
		{
			cModuleEventTicker.fGetInstance().fOnSignal(vSignal, vData, vReturnFun);
		}
		
		if ( parseInt($("#div_externalUrlPlayer").css("top")) < 100 )
		{
			var height = vThis.mViewPortSize[1];
			$("#div_externalUrlPlayer").scrollTop( $("#div_externalUrlPlayer").scrollTop() + height/7 );
			//~ $("#iframe_externalUrlPlayer").css("top", "-=" + height / 7 + "px");
			//~ fDbg($("#div_externalUrlPlayer").html());
		}
		break;
		
	case cConst.SIGNAL_BUTTON_SETUP:
		//Show Help page
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
			o = setTimeout(function() {
				if (vThis.mUserFirstButtonPress)
					return;
				cCPanel.fGetInstance().fBack("all");
			}, 10000);
		});
		break;
	
	case cConst.SIGNAL_STARTUP_COMPLETE:
		cModuleEventTicker.fGetInstance().fEndStampEvent();
		cModuleWE.fGetInstance().pCurrChannel(cModel.fGetInstance().CHANNEL_LIST[0]);
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

	case cConst.SIGNAL_PLAYNEXTWIDGET:
		cModuleEventTicker.fGetInstance().fOnSignal(vSignal, null, null);
		break;
		
	case cConst.SIGNAL_GOTO_CONTROLPANEL:
		switch (vThis.mState)
		{
		case "controlpanel":
			if (vData[0] == "help")
			{
				$("#div_CPanel").children().hide();
				$("#div_helpMain").show();
				vThis.mSubState = "cpanel_help";
			}
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
			default:
				if (vData[0] == "help")
				{
					cModuleEventTicker.fGetInstance().pEnabled(false);
					cModuleEventTicker.fGetInstance().fStopAll();
					if (vData && vData.length > 0)
						vThis.fShowControlPanel(vData[0]);
					else
						vThis.fShowControlPanel();
				}
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
		
	case "multitab":
		var options = vData[0];
		var param = vData[1];
		var tab = vData[2];		//0 is the control panel, usually 1
			
		if (options == null || options == "" || options == "load")
		{	
			//param is URI encoded URL
		}
		else if (options == "html")
		{
			//param is the URI encoded HTML string, already handled by browser
		}
		else if (options == "back" || options == "hide")
		{
			//Do something about this
		}
		break;
	}
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
//~ fDbg("*** cCPanel, fShowControlPanel(), ");
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
			cSPActivation.fGetInstance().fShow();
		else if (vData == "help")
			$("#div_helpMain").show();
		
		$("#div_startup").fadeOut(function() {
			if (!vData)
				vThis.mSubState = "cpanel_main";
			else if (vData == "nointernet")
				vThis.mSubState = "cpanel_info";
			else if (vData == "notactivated")
				vThis.mSubState = "cpanel_activation";
			else if (vData == "help")
				vThis.mSubState = "cpanel_help";
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
	$("#div_startup").fadeIn(200, function() {
		$("#div_CPanel").animate({
			left: "-1300px"
		}, 1200, function() {
			if (vReturnFun)
				vReturnFun();
		});
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
				cSPActivation.fGetInstance().fHide();
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
				cSPActivation.fGetInstance().fHide();
				cPMain.fGetInstance().fAnimateIn(function() {
					vThis.mSubState = "cpanel_main";
				});
			});
		break;
	case "cpanel_help":
		cSPHelp.fGetInstance().fAnimateOut(function() {
			cPMain.fGetInstance().fAnimateIn(function() {
				vThis.mSubState = "cpanel_main";
			});
		});
		break;
	}
}
