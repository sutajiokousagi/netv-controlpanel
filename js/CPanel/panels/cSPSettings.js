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
	
	this.mMessageList = [];
	this.mMessageDisplayInProgress = false;


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
fDbg2("*** cSPSettings, fOnSignal(), " + vSignal + ", " + vData);
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
		if (vThis.mCurrSelection == null)
		{
			cCPanel.fGetInstance().fBack();
		}
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
