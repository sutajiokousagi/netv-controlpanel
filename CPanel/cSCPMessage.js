// -------------------------------------------------------------------------------------------------
//	cSCPMessage class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSCPMessage(
	vDivObj
)
{
	this.mDiv = vDivObj;
	this.mMessageList = [];
	this.mMessageDisplayInProgress = false;


	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSCPMessage.instance = null;
cSCPMessage.fGetInstance = function(
	vDivObj
)
{
	return cSCPMessage.instance ? cSCPMessage.instance : cSCPMessage.instance = new cSCPMessage(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSCPMessage.prototype.fInit = function(
)
{
//~ fDbg2("*** cSCPMessage, fInit(), ");

}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSCPMessage.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg2("*** cSCPMessage, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
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
cSCPMessage.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSCPMessage.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fFadeIn / fFadeOut
// -------------------------------------------------------------------------------------------------
cSCPMessage.prototype.fFadeIn = function(
	vReturnFun
)
{
	this.mDiv.fadeIn(500, function() {
		if (vReturnFun)
			vReturnFun();
	});
}
cSCPMessage.prototype.fFadeOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(500, function() {
		if (vReturnFun)
			vReturnFun();
	});
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSCPMessage.prototype.fDisplay = function(
	vData
)
{
	var o, mCPanel, vThis;
	mCPanel = cCPanel.fGetInstance();
	vThis = cSCPMessage.instance;

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
							vThis.fDisplayMessageBoard();
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
			vThis.fDisplayMessageBoard();
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
					vThis.fDisplayMessageBoard();
				else
					vThis.mMessageDisplayInProgress = false;
			});
		});
	}
	cCPanel.instance.mSubState = "messageBoard";
}
