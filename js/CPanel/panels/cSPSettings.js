// -------------------------------------------------------------------------------------------------
//	cSPSettings class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPSettings(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;

	this.mCurrSelection = null;

	// div elements
	this.mDivIndicator = null;
	this.mDivResetToAP = null;
	this.mDivReconnectToWIFI = null;
	this.mDivReloadControlPanel = null;
	this.mDivReboot = null;
	
	// view modes
	this.mViewMode = null;
	cSPSettings.VIEWMODE_DEFAULT = "viewmode_default";

	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPSettings.instance = null;
cSPSettings.fGetInstance = function(
	vDiv
)
{
	return cSPSettings.instance ? cSPSettings.instance : cSPSettings.instance = new cSPSettings(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fInit = function(
)
{
//~ fDbg2("*** cSPSettings, fInit(), ");
	var vThis;
	vThis = this;

	vThis.mDivIndicator = $(this.mDiv.children("#item_indicators").children()[0]);
	
	vThis.mDivResetToAP =  $(this.mDiv.children("#setting_group").children()[0]);
	vThis.mDivResetToAP.pIndicatorStyle = { width: "400px", height: "40px", top: "120px", left: "200px" };
	vThis.mDivReconnectToWIFI = $(this.mDiv.children("#setting_group").children()[1]);
	vThis.mDivReconnectToWIFI.pIndicatorStyle = { width: "400px", height: "40px", top: "180px", left: "200px" };
	vThis.mDivReloadControlPanel = $(this.mDiv.children("#setting_group").children()[2]);
	vThis.mDivReloadControlPanel.pIndicatorStyle = { width: "400px", height: "40px", top: "230px", left: "200px" };
	vThis.mDivReboot = $(this.mDiv.children("#setting_group").children()[3]);
	vThis.mDivReboot.pIndicatorStyle = { width: "400px", height: "40px", top: "280px", left: "200px" };
	
	vThis.mDivBack = $(vThis.mDiv.children("#subnavi_action").children()[0]);
	vThis.mDivBack.pIndicatorStyle = { width: "96px", height: "36px", top: "551px", left: "350px" };

	vThis.pViewMode(cSPSettings.VIEWMODE_DEFAULT);
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPSettings.prototype.pViewMode = function(
	vViewMode
)
{
	var vThis;
	vThis = this;

	if (!vViewMode) return vThis.mViewMode;
	
	switch (vViewMode)
	{
	case cSPSettings.VIEWMODE_DEFAULT:
		vThis.mDivResetToAP.css("opacity", "0.2");
		vThis.mDivReconnectToWIFI.css("opacity", "0.2");
		vThis.mDivReloadControlPanel.css("opacity", "0.2");
		vThis.mDivReboot.css("opacity", "0.2");
		vThis.mDivBack.css("opacity", "0.2");
		
		vThis.mCurrSelection = vThis.mDivReconnectToWIFI;
		vThis.mCurrSelection.css("opacity", "1");
		vThis.mDivIndicator.css(vThis.mCurrSelection.pIndicatorStyle);
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cSPSettings, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, o, i;
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
		switch (vThis.mCurrSelection)
		{
		case vThis.mDivResetToAP:
			break;
		case vThis.mDivReconnectToWIFI:
			window.location = "./html_config/";
			break;
		case vThis.mDivReloadControlPanel:
			window.location = "http://localhost/";
			break;
		case vThis.mDivReboot:
			break;
		case vThis.mDivBack:
			cCPanel.fGetInstance().fBack();
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		switch (vThis.mCurrSelection)
		{
		//~ case vThis.mDivReconnectToWIFI:	o = vThis.mDivResetToAP; break;
		case vThis.mDivReloadControlPanel:	o = vThis.mDivReconnectToWIFI; break;
		case vThis.mDivReboot:	o = vThis.mDivReloadControlPanel; break;
		case vThis.mDivBack:	o = vThis.mDivReboot; break;
		default: return;
		}
		vThis.mCurrSelection.css("opacity", "0.2");
		vThis.mCurrSelection = o;
		vThis.mCurrSelection.css("opacity", "1");
		vThis.mDivIndicator.css(vThis.mCurrSelection.pIndicatorStyle);
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		switch (vThis.mCurrSelection)
		{
		case vThis.mDivResetToAP: 	o = vThis.mDivReconnectToWIFI; break;
		case vThis.mDivReconnectToWIFI:	o = vThis.mDivReloadControlPanel; break;
		case vThis.mDivReloadControlPanel:	o = vThis.mDivReboot; break;
		case vThis.mDivReboot:	o = vThis.mDivBack; break;
		default: return;
		}
		vThis.mCurrSelection.css("opacity", "0.2");
		vThis.mCurrSelection = o;
		vThis.mCurrSelection.css("opacity", "1");
		vThis.mDivIndicator.css(vThis.mCurrSelection.pIndicatorStyle);
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSPSettings.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPSettings.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fDisplay = function(
	vData
)
{
	var o, mCPanel, vThis;
	mCPanel = cCPanel.fGetInstance();
	vThis = cSPSettings.instance;

	if (vData)
	{
		if ($("#div_messageBoard_text").html() !== vData)
		{
			vThis.mMessageList.push(vData);
			if (vThis.mMessageDisplayInProgress === false)
			{
				vThis.mMessageDisplayInProgress = true;
				$("#div_messageBoard_text").fadeOut("fast", function() {
					$("#div_messageBoard_text").html(vData);
					vThis.mMessageList.splice(0, 1);
					$("#div_messageBoard_text").fadeIn("fast", function() {
						if (vThis.mMessageList.length > 0)
							vThis.fDisplay();
						else
							vThis.mMessageDisplayInProgress = false;
					});
				});
			}
		}
		else
		{
			if (vThis.mMessageList.length > 0)
				vThis.mMessageList.splice(0, 1);
			vThis.fDisplay();
		}
	}
	else
	{
		if (vThis.mMessageList.length == 0)
			return;
		o = vThis.mMessageList[0];
		vThis.mMessageList.splice(0, 1);
		if (vThis.mMessageDisplayInProgress === false)
			vThis.mMessageDisplayInProgress = true;
			
		$("#div_messageBoard_text").fadeOut("fast", function() {
			$("#div_messageBoard_text").html(o);
			$("#div_messageBoard_text").fadeIn("fast", function() {
				if (vThis.mMessageList.length > 0)
					vThis.fDisplay();
				else
					vThis.mMessageDisplayInProgress = false;
			});
		});
	}
	cCPanel.instance.mSubState = "messageBoard";
}
