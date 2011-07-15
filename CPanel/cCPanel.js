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
	mShowDbg : false
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
	this.mEventEngineInterval = null;

	this.mJSClassList = [
		"./CPanel/cSubCPanelChannelMain.js",
		"./CPanel/cSCPChannelWidgetsMain.js",
		"./CPanel/cWEEvent.js"
	];
	
	this.mMessageDisplayInProgress = false;
	this.mMessageList = [];
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
	// components
	this.mSCPChannelMain = null;
	this.mSCPChannelWidgetsMain = null;
	this.mSCPInfoMain = null;
	this.mSCPSettingMain = null;
	this.mWEEvent = null;
	this.mWEHtml = null;
	this.mWEFlash = null;

	// states
	this.mPrevState = "";
	this.mState = "";
	this.mSubState = "";
	
	console.log("hello console");
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
	
	mCurrDivVisible = "div_messageBoard";
	this.pState("controlpanel");
	
	// load other js classes
	fLoadExtJSScript(this.mJSClassList, vReturnFun);
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
	//~ $("#div_flashWidgetPlayer").hide();
	$("#div_htmlWidgetPlayer").hide();
	$("#div_eventWidgetPlayer").hide();
	
	$("#div_infoMain_content_advanced").hide();
}

// -------------------------------------------------------------------------------------------------
//	fHideAll
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fStartUp = function(
)
{
	fDbg("*** cCPanel, fStartUp()");
	
	// register all classes
	this.mSubCPanelList[1].mSubCPanel = cSubCPanelChannelMain.fGetInstance($("#div_channelMain"));
	this.mSCPChannelWidgetsMain = cSCPChannelWidgetsMain.fGetInstance($("#div_flashWidgetMain"));
	this.mWEEvent = cWEEvent.fGetInstance($("#div_eventWidgetPlayer"));
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
	
	// =========================
	// JavaScript Injection Signals
	// =========================
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
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
		if (cCPanel.instance.mLocked == true)
			return;
		cCPanel.instance.mLocked = true;
		switch (mCPanel.mState)
		{
		case "htmlwidgetengine":
			mCPanel.fHideHTMLWidgetEngine(function() {
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
				mCPanel.fShowHTMLWidgetEngine2(function() {
					cCPanel.instance.pState("htmlwidgetengine");
					cCPanel.instance.mLocked = false;
				});
				break;
			case "flashwidgetengine":
				cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>959 469 320 240</value>"}, null);
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
		if (mCPanel.mState == "controlpanel")
		{
			switch (mCPanel.mSubState)
			{
			case "channelMain":
				this.mSubCPanelList[1].mSubCPanel.fOnSignal(vSignal, vData, vReturnFun);
				break;
			case "flashchannelwidgetsmain":
				if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "485px")
				{
					$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("left", "150px");
					$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("width", "70px");
				}
				else if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "75px")
				{
					cModel.fGetInstance().PREV_WIDGET_INDEX = cModel.fGetInstance().CURR_WIDGET_INDEX;
					cModel.fGetInstance().CURR_WIDGET_INDEX--;
					if (cModel.fGetInstance().CURR_WIDGET_INDEX < 0)
						cModel.fGetInstance().CURR_WIDGET_INDEX = cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CURR_CHANNEL_INDEX].mWidgetList.length - 1;
					cCPanel.fGetInstance().fRefreshChannelDiv();
				}
				break;
			case "infomain":
				if ($("#div_infoMain_content_basic").is(":visible"))
					o = [$("#div_infoMain_content_basic"), $("#div_infoMain_content_advanced")];
				else
					o = [$("#div_infoMain_content_advanced"), $("#div_infoMain_content_basic")];
				o[0].fadeOut(200, function() {
					o[1].fadeIn(200);
				});
				break;
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (mCPanel.mState == "controlpanel")
		{
			switch (mCPanel.mSubState)
			{
			case "channelMain":
				this.mSubCPanelList[1].mSubCPanel.fOnSignal(vSignal, vData, vReturnFun);
				break;
			case "flashchannelwidgetsmain":
				if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "485px")
				{
					$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("left", "238px");
					$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("width", "58px");
				}
				else if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "75px")
				{
					cModel.fGetInstance().PREV_WIDGET_INDEX = cModel.fGetInstance().CURR_WIDGET_INDEX;
					cModel.fGetInstance().CURR_WIDGET_INDEX++;
					if (cModel.fGetInstance().CURR_WIDGET_INDEX > cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CURR_CHANNEL_INDEX].mWidgetList.length - 1)
						cModel.fGetInstance().CURR_WIDGET_INDEX = 0;
					cCPanel.fGetInstance().fRefreshChannelDiv();
				}
				break;
			case "infomain":
				if ($("#div_infoMain_content_basic").is(":visible"))
					o = [$("#div_infoMain_content_basic"), $("#div_infoMain_content_advanced")];
				else
					o = [$("#div_infoMain_content_advanced"), $("#div_infoMain_content_basic")];

				o[0].fadeOut(200, function() {
					o[1].fadeIn(200);
				});
				break;
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (mCPanel.mState == "controlpanel" && mCPanel.mSubState == "channelMain")
		{
			o = this.mSubCPanelList[1].mSubCPanel.fGetSelected();
			
			if (o[0] == 0)
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_FLASHWIDGETENGINE);
			else if (o[0] == 1)
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
			else if (o[0] == 2)
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_EVENTWIDGETENGINE);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
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
			
			$("#div_messageBoard").hide();
						
			$("#" + mCPanel.mSubCPanelList[o[0]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).fadeIn();
			
			mCPanel.mSubState = mCPanel.mSubCPanelList[o[1]].mSubStateName;
			if (mCPanel.mSubState == "flashchannelwidgetsmain")
			{
				cCPanel.instance.fRefreshChannelDiv();
				//~ mSCPChannelWidgetsMain.fHide();
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
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
			$("#div_messageBoard").hide();
			$("#" + mCPanel.mSubCPanelList[o[0]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).hide();
			$("#" + mCPanel.mSubCPanelList[o[1]].mDivID).fadeIn();
			mCPanel.mSubState = mCPanel.mSubCPanelList[o[1]].mSubStateName;
			if (mCPanel.mSubState == "flashchannelwidgetsmain")
				cCPanel.instance.fRefreshChannelDiv();
		}
		break;
	}




	
	// =========================
	// internal signals
	// =========================
	switch(vSignal)
	{
	case cConst.SIGNAL_MESSAGE:
		mCPanel.fDisplayMessageBoard(vData[0]);
		break;
		
	case cConst.SIGNAL_CHANNELDIV_SHOW:
		switch (mCurrDivVisible)
		{
		case "div_messageBoard":
			mCPanel.fRefreshChannelDiv(mCPanel.fShowChannelDiv);	
			break;
		}
		break;

	case cConst.SIGNAL_SCPINFO_SHOW:
		fDbg("to show info page...");
		if ($("#div_startup").is(":visible"))
		{
			$("#div_loader").hide();
			$("#div_messageBoard").hide();
			$("#div_startup").fadeOut(function() {
				$("#div_infoMain").fadeIn();
				mCPanel.mSubState = "infomain";
			});
		}
		else
		{
			$("#div_loader").hide(function() {
				$("#div_messageBoard").fadeOut(function() {
					$("#div_infoMain").fadeIn();
					mCPanel.mSubState = "infomain";
				});
			});
		}
		break;
		
	case cConst.SIGNAL_WIDGETENGINE_SHOW:
		//mCPanel.fShowWidgetEngine();
		mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
		break;
		
	case cConst.SIGNAL_GOTO_CONTROLPANEL:
		switch (mCPanel.mState)
		{
		case "controlpanel":
			break;
		case "htmlwidgetengine":
			mCPanel.fHideHTMLWidgetEngine(function() {
				mCPanel.fShowControlPanel();
			});
			break;
		case "flashwidgetengine":
			cProxy.xmlhttpPost("", "post", {cmd : "SetChromaKey", data : "<value>On</value>"}, function() {});
			cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>hide</value>"}, function() {});
			//~ cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Minimize</value>"}, function() {});
			cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 705</value>"}, function() {});
			mCPanel.fShowControlPanel();
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
				cProxy.xmlhttpPost("", "post", {cmd : "SetChromaKey", data : "<value>On</value>"}, function() {});
				cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>hide</value>"}, function() {});
				//~ cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Minimize</value>"}, function() {});
				cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 705</value>"}, function() {});
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
		mCPanel.fShowHTMLWidgetEngine();
		break;
		
	case cConst.SIGNAL_GOTO_FLASHWIDGETENGINE:
		$("#div_flashWidgetMain").show();
		$("#div_CPanel").animate({
			left: "-=1200"
		}, 800, function() {
			mCPanel.fShowFLASHWidgetEngine();
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
































// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	message board div functions
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShow
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fDisplayMessageBoard = function(
	v
)
{
	var o;
	
	if (v)
	{
		if ($("#div_messageBoard_text").html() !== v)
		{
			mCPanel.mMessageList.push(v);
			if (mCPanel.mMessageDisplayInProgress === false)
			{
				mCPanel.mMessageDisplayInProgress = true;
				$("#div_messageBoard_text").fadeOut("fast", function() {
					$("#div_messageBoard_text").html(v);
					mCPanel.mMessageList.splice(0, 1);
					$("#div_messageBoard_text").fadeIn("fast", function() {
						if (mCPanel.mMessageList.length > 0)
							mCPanel.instance.fDisplayMessageBoard();
						else
							mCPanel.mMessageDisplayInProgress = false;
					});
				});
			}
		}
		else
		{
			if (mCPanel.mMessageList.length > 0)
				mCPanel.mMessageList.splice(0, 1);
			fDisplayMessageBoard();
		}
	}
	else
	{
		if (mCPanel.mMessageList.length == 0)
			return;
		o = mCPanel.mMessageList[0];
		mCPanel.mMessageList.splice(0, 1);
		if (mCPanel.mMessageDisplayInProgress === false)
		{
			mCPanel.mMessageDisplayInProgress = true;
		}
			$("#div_messageBoard_text").fadeOut("fast", function() {
				$("#div_messageBoard_text").html(o);
fDbg("new curr : " + $("#div_messageBoard_text").html());
				$("#div_messageBoard_text").fadeIn("fast", function() {
					if (mCPanel.mMessageList.length > 0)
					{
						fDisplayMessageBoard();
					}
					else
						mCPanel.mMessageDisplayInProgress = false;
				});
			});
	}
	cCPanel.instance.mSubState = "messageBoard";
}


// -------------------------------------------------------------------------------------------------
//	fShowMessageDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowMessageDiv = function(
)
{
	
}

cCPanel.prototype.fHideMessageDiv = function(
)
{
	
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
fDbg("*** cCPanel, fShowControlPanel(), ");
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
		
		cCPanel.instance.mSubCPanelList[1].mSubCPanel.fFadeIn();
		cCPanel.instance.mSubCPanelList[1].mSubCPanel.fSetSelected([o], function() {
			cCPanel.instance.mSubState = "channelMain";
		});
		cCPanel.instance.fShowControlPanelReturn();
	});
}

cCPanel.prototype.fShowControlPanelReturn = function(
	vData
)
{
fDbg("*** cCPanel, fShowControlPanelReturn(), " + vData);
	this.pState("controlpanel");
}

























// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	widget engine div functions   (HTML widgets)
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShowHTMLWidgetEngine
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowHTMLWidgetEngine2 = function(
	vReturnFun
)
{
	if (vReturnFun)
	{
		$("#div_htmlWidgetPlayer").show();
		$("#div_htmlWidgetPlayer").css("top", "720px");
		$("#div_htmlWidgetPlayer").animate({
			top: "-=80"
		}, 200, function() {
			vReturnFun();
		});
	}
}


cCPanel.prototype.fShowHTMLWidgetEngine = function(
	vReturnFun
)
{
fDbg("*** cCPanel, fShowHTMLWidgetEngine(), ");
	//cProxy.xmlhttpPost("", "post", {cmd : "ShowWidgetEngine", data : "<value>true</value>"}, cCPanel.instance.fShowHTMLWidgetEngineReturn);
	cCPanel.instance.fShowHTMLWidgetEngineReturn(null, vReturnFun);
	
}

cCPanel.prototype.fShowHTMLWidgetEngineReturn = function(
	vData,
	vReturnFun
)
{
fDbg("*** cCPanel, fShowHTMLWidgetEngineReturn(), " + vData);
	if (!vReturnFun)
		cCPanel.instance.fSetHTMLWidgetEngineSize();
	else
	{
		vReturnFun();

	}
}

// -------------------------------------------------------------------------------------------------
//	fSetWidgetEngineSize
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fSetHTMLWidgetEngineSize = function(
)
{
fDbg("*** cCPanel, fSetHTMLWidgetEngineSize(), ");
	
	$("#div_loader").fadeOut(200, function() {
	});
	$("#div_CPanel").animate({
		left: "-=1200"
	}, 800, function() {
		cCPanel.instance.fSetHTMLWidgetEngineSizeReturn();
	});
}

cCPanel.prototype.fSetHTMLWidgetEngineSizeReturn = function(
	vData
)
{
fDbg("*** cCPanel, fSetHTMLWidgetEngineSizeReturn(), " + vData);
	var o, p;
	o = 'http://localhost/widgets/twitter0.2/index.html';
	
		$("#div_htmlWidgetPlayer").show();
		$("#div_htmlWidgetPlayer").css("top", "720px");
	p = setTimeout(function() {
		$("#div_htmlWidgetPlayer").animate({
			top: "-=80"
		}, 200, function() {
		
		});
	}, 1000);
	
	$("#div_htmlWidgetPlayer").html('<iframe id="iframe_htmlWidgetPlayer" src="' + o + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="width: 1279px; height: 70px;"></iframe>');
	this.pState("htmlwidgetengine");

}

// -------------------------------------------------------------------------------------------------
//	fHideHTMLWidgetEngine
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideHTMLWidgetEngine = function(
	vReturnFun
)
{
fDbg("*** cCPanel, fHideHTMLWidgetEngine(), ");
	$("#div_htmlWidgetPlayer").animate({
		top: "+=80"
	}, 200, function() {
		cCPanel.instance.fHideHTMLWidgetEngineReturn(null, vReturnFun);
	});
}

cCPanel.prototype.fHideHTMLWidgetEngineReturn = function(
	vData,
	vReturnFun
)
{
fDbg("*** cCPanel, fHideHTMLWidgetEngineReturn(), " + vData);
	if (vReturnFun)
		vReturnFun();
}






































// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	widget engine div functions		(flash widgets)
// 
// 
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	fShowFLASHWidgetEngine
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowFLASHWidgetEngine = function(
)
{
fDbg("*** cCPanel, fShowFLASHWidgetEngine(), ");
	cProxy.xmlhttpPost("", "post", {cmd : "SetChromaKey", data : "<value>On</value>"}, function(vData) {
		fDbg2("===> " + vData.split("<status>")[1].split("</status>")[0]);
		fDbg2("===> " + vData.split("<value>")[1].split("</value>")[0]);
	});
	
	cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>show</value>"}, cCPanel.instance.fShowFLASHWidgetEngineReturn);
	cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>959 465 320 240</value>"}, null);
	//~ cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Maximize</value>"}, cCPanel.instance.fShowFLASHWidgetEngineReturn);
}

cCPanel.prototype.fShowFLASHWidgetEngineReturn = function(
	vData
)
{
fDbg("*** cCPanel, fShowFLASHWidgetEngineReturn(), " + vData);
	cCPanel.instance.pState("flashwidgetengine");
	fDbg2("-----> " + vData.split("<status>")[1].split("</status>")[0]);
	fDbg2("-----> " + vData.split("<value>")[1].split("</value>")[0]);

}

// -------------------------------------------------------------------------------------------------
//	fSetWidgetEngineSize
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fSetWidgetEngineSize = function(
)
{
fDbg("*** cCPanel, fSetWidgetEngineSize(), ");

	$("#div_CPanel").animate({
		left: "-=1200"
	}, 800, function() {
		cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>1000 520 240 180</value>"}, cCPanel.instance.fSetWidgetEngineSizeReturn);
		
		/*
		var vStepCount = 50;
		var vCurrBox = [240, 60, 800, 600];
		var vFinalBox = [800, 450, 320, 240];
		var vStep = [
			(vFinalBox[0] - vCurrBox[0]) / vStepCount,
			(vFinalBox[1] - vCurrBox[1]) / vStepCount,
			(vFinalBox[2] - vCurrBox[2]) / vStepCount,
			(vFinalBox[3] - vCurrBox[3]) / vStepCount
		];
		var i = 0;
		//cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>" + vFinalBox.join(" ") + "</value>"}, cCPanel.instance.fSetWidgetEngineSizeReturn);
		//return;
		var o = setInterval(function() {
			i++;
			vCurrBox = [vCurrBox[0] + vStep[0], vCurrBox[1] + vStep[1], vCurrBox[2] + vStep[2], vCurrBox[3] + vStep[3]];
			var str = vCurrBox[0] + " " + vCurrBox[1] + " " + vCurrBox[2] + " " + vCurrBox[3];
			cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>" + str + "</value>"}, cCPanel.instance.fSetWidgetEngineSizeReturn);
			if (i == vStepCount)
				clearInterval(o);
		}, 20);
		*/
	});
	
}

cCPanel.prototype.fSetWidgetEngineSizeReturn = function(
	vData
)
{
fDbg("*** cCPanel, fSetWidgetEngineSizeReturn(), " + vData);
	//~ $("#div_flashWidgetPlayer").show();
	//~ $("#div_flashWidgetPlayer").css("left", "1000px");
	//~ $("#div_flashWidgetPlayer").css("top", "520px");
	cCPanel.instance.fPlayWidget();
}


// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fPlayWidget = function(
)
{
fDbg("*** cCPanel, fPlayWidget(), ");
	cProxy.xmlhttpPost("", "post", {cmd : "PlayWidget", data : "<value>./widget1.swf</value>"}, cCPanel.instance.fPlayWidgetReturn);
}

cCPanel.prototype.fPlayWidgetReturn = function(
	vData
)
{
fDbg("*** cCPanel, fPlayWidgetReturn(), " + vData);
	
}




















































































// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	channel div functions
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShowChannelDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fRefreshChannelDiv = function(
	vReturnFun
)
{
fDbg2("*** cCPanel, ");
	var o, p, vWidgetList, vTransitionTime;
	var i;
	var vDefaultImg = "chumby_logo_48x48";
	
	vTransitionTime = 500;
	
	if (!this.mModel)
		this.mModel = cModel.fGetInstance();
	if (!this.mModel.CURR_CHANNEL_INDEX)
		this.mModel.CURR_CHANNEL_INDEX = 0;
	if (!this.mModel.CURR_WIDGET_INDEX)
		this.mModel.CURR_WIDGET_INDEX = 0;

	vWidgetList = this.mModel.CHANNEL_LIST[this.mModel.CURR_CHANNEL_INDEX].mWidgetList;
	if ($("#img_flashWidgetMain_thumbnailPrev").attr("src").indexOf(vDefaultImg) > -1)
	{
		$("#img_flashWidgetMain_thumbnailPrev").hide();
		$("#img_flashWidgetMain_thumbnailCurr").hide();
		$("#img_flashWidgetMain_thumbnailNext").hide();
	
		
		// show control panel MAIN div
		if (this.mModel.CURR_WIDGET_INDEX == 0)
			p = vWidgetList.length - 1;
		else
			p = this.mModel.CURR_WIDGET_INDEX - 1;
		
		$("#img_flashWidgetMain_thumbnailPrev").attr("src", "");
		$("#img_flashWidgetMain_thumbnailPrev").attr("src", vWidgetList[p].mLocalThumbnailPath);
		$("#img_flashWidgetMain_thumbnailPrev").fadeIn();

		$("#img_flashWidgetMain_thumbnailCurr").attr("src", "");
		$("#img_flashWidgetMain_thumbnailCurr").attr("src", vWidgetList[this.mModel.CURR_WIDGET_INDEX].mLocalThumbnailPath);
		$("#img_flashWidgetMain_thumbnailCurr").fadeIn();
		
		/*
		fDbg2(">>>" + vWidgetList[p].mWidget.mThumbnail.mHref);
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[p].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
			vData = vData.split("<data><value>")[1].split("</value></data>")[0];
			fDbg2("=====" + vData);
			$("#img_flashWidgetMain_thumbnailPrev").attr("src", "");
			$("#img_flashWidgetMain_thumbnailPrev").attr("src", vData);
			$("#img_flashWidgetMain_thumbnailPrev").fadeIn();
		});
		
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
			vData = vData.split("<data><value>")[1].split("</value></data>")[0];
			$("#img_flashWidgetMain_thumbnailCurr").attr("src", "");
			$("#img_flashWidgetMain_thumbnailCurr").attr("src", vData);
			$("#img_flashWidgetMain_thumbnailCurr").fadeIn();
		});
		*/
		if (this.mModel.CURR_WIDGET_INDEX == vWidgetList.length - 1)
			p = 0;
		else
			p = this.mModel.CURR_WIDGET_INDEX + 1;
		
		$("#img_flashWidgetMain_thumbnailNext").attr("src", "");
		$("#img_flashWidgetMain_thumbnailNext").attr("src", vWidgetList[p].mLocalThumbnailPath);
		$("#img_flashWidgetMain_thumbnailNext").fadeIn();
		/*
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[p].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
			vData = vData.split("<data><value>")[1].split("</value></data>")[0];
			$("#img_flashWidgetMain_thumbnailNext").attr("src", "");
			$("#img_flashWidgetMain_thumbnailNext").attr("src", vData);
			$("#img_flashWidgetMain_thumbnailNext").fadeIn();
		});
		*/
		
		$("#div_flashWidgetMain_title_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mName);
		$("#div_flashWidgetMain_description_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mDescription);
		
		if (vReturnFun)
			vReturnFun();
	}
	else
	{
		o = ["Prev", "Curr", "Next"];
		p = [
			parseFloat($("#div_flashWidgetMain_thumbnail" + o[0] + "_container").css("left").split("px")[0]),
			parseFloat($("#div_flashWidgetMain_thumbnail" + o[1] + "_container").css("left").split("px")[0]),
			parseFloat($("#div_flashWidgetMain_thumbnail" + o[2] + "_container").css("left").split("px")[0])
		];
		if (p[0] < p[1] && p[1] < p[2])
			o = ["Prev", "Curr", "Next"];
		else if (p[1] < p[2] && p[2] < p[0])
			o = ["Curr", "Next", "Prev"];
		else if (p[2] < p[0] && p[0] < p[1])
			o = ["Next", "Prev", "Curr"];
		
		if ((cModel.fGetInstance().CURR_WIDGET_INDEX < cModel.fGetInstance().PREV_WIDGET_INDEX && cModel.fGetInstance().PREV_WIDGET_INDEX - cModel.fGetInstance().CURR_WIDGET_INDEX == 1) ||
			(cModel.fGetInstance().CURR_WIDGET_INDEX == vWidgetList.length - 1 && cModel.fGetInstance().PREV_WIDGET_INDEX == 0))
		{
			if (this.mModel.CURR_WIDGET_INDEX == 0)
				i = vWidgetList.length - 1;
			else
				i = this.mModel.CURR_WIDGET_INDEX - 1;
			/*
			cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[i].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
				vData = vData.split("<data><value>")[1].split("</value></data>")[0];
				$("#img_flashWidgetMain_thumbnail" + o[2]).attr("src", vData);
			});
			*/
			
			$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").animate({
				left: "+=300"
			}, vTransitionTime / 2, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[2]).animate({
				width: "-=100",
				height: "-=100"
			}, vTransitionTime / 2, function() {
					$("#img_flashWidgetMain_thumbnail" + o[2]).attr("src", "");
					//~ $("#img_flashWidgetMain_thumbnail" + o[2]).attr("src", "./images/chumby_logo_48x48.png");
					$("#img_flashWidgetMain_thumbnail" + o[2]).attr("src", vWidgetList[i].mLocalThumbnailPath);
					$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").css("left", "-100px");
					$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").animate({
						left: "+=200"
					}, vTransitionTime, function() {
						// Animation complete
					});
					$("#img_flashWidgetMain_thumbnail" + o[2]).animate({
						width: "+=100",
						height: "+=100"
					}, vTransitionTime, function() {
						// Animation complete
					});
			});
			
			$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").animate({
				left: "+=200",
				top: "-=15"
			}, vTransitionTime, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[0]).animate({
				width: "+=40",
				height: "+=30"
			}, vTransitionTime, function() {
				// Animation complete
			});

			
			$("#div_flashWidgetMain_thumbnail" + o[1] + "_container").animate({
				left: "+=240",
				top: "+=15"
			}, vTransitionTime, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[1]).animate({
				width: "-=40",
				height: "-=30"
			}, vTransitionTime, function() {
				// Animation complete
			});
		}
		else if ((cModel.fGetInstance().CURR_WIDGET_INDEX > cModel.fGetInstance().PREV_WIDGET_INDEX && cModel.fGetInstance().CURR_WIDGET_INDEX - cModel.fGetInstance().PREV_WIDGET_INDEX == 1) ||
			(cModel.fGetInstance().CURR_WIDGET_INDEX == 0 && cModel.fGetInstance().PREV_WIDGET_INDEX == vWidgetList.length - 1))
		{
			if (this.mModel.CURR_WIDGET_INDEX == vWidgetList.length - 1)
				i = 0;
			else
				i = this.mModel.CURR_WIDGET_INDEX + 1;
			/*
			cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[i].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
				vData = vData.split("<data><value>")[1].split("</value></data>")[0];
				$("#img_flashWidgetMain_thumbnail" + o[0]).attr("src", vData);
			});
			*/
			
			$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").animate({
				left: "-=300"
			}, vTransitionTime / 2, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[0]).animate({
				width: "-=100",
				height: "-=100"
			}, vTransitionTime / 2, function() {
					$("#img_flashWidgetMain_thumbnail" + o[0]).attr("src", "");
					//~ $("#img_flashWidgetMain_thumbnail" + o[0]).attr("src", "./images/chumby_logo_48x48.png");
					$("#img_flashWidgetMain_thumbnail" + o[0]).attr("src", vWidgetList[i].mLocalThumbnailPath);
					$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").css("left", "840px");
					$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").animate({
						left: "-=300"
					}, vTransitionTime, function() {
						// Animation complete
					});
					$("#img_flashWidgetMain_thumbnail" + o[0]).animate({
						width: "+=100",
						height: "+=100"
					}, vTransitionTime, function() {
						// Animation complete
					});
			});
			
			$("#div_flashWidgetMain_thumbnail" + o[1] + "_container").animate({
				left: "-=200",
				top: "+=15"
			}, vTransitionTime, function() {
				// Animation complete
			});

			$("#img_flashWidgetMain_thumbnail" + o[1]).animate({
				width: "-=40",
				height: "-=30"
			}, vTransitionTime, function() {
				
			});

			
			$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").animate({
				left: "-=240",
				top: "-=15"
			}, vTransitionTime, function() {
				// Animation complete
				
			});

			$("#img_flashWidgetMain_thumbnail" + o[2]).animate({
				width: "+=40",
				height: "+=30"
			}, vTransitionTime, function() {
				
			});
		}
		
		$("#div_flashWidgetMain_title_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mName);
		$("#div_flashWidgetMain_description_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mDescription);
		
		if (vReturnFun)
			vReturnFun();
	}

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
//	fHideChannelDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideChannelDiv = function(
)
{
	
}
