// -------------------------------------------------------------------------------------------------
//	cSPActivation class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPActivation(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;

	this.mEnableBackButton = true;
	this.mCurrSelection = null;			// 

	// div elements
	this.mDivUsername = null;			// input group
	this.mDivUsernameContent = null;
	this.mDivPassword = null;
	this.mDivPasswordContent = null;
	this.mDivDevicename = null;
	this.mDivDevicenameContent = null;
	this.mDivBack = null;				// action group
	this.mDivNotNow = null;
	this.mDivActivate = null;
	this.mDivDeActivate = null;

	// view modes
	this.mViewMode = null;
	cSPActivation.VIEWMODE_ACTIVATE_NOTNOW = "viewmode_activate_notnow";
	cSPActivation.VIEWMODE_ACTIVATE_BACK = "viewmode_activate_back";
	cSPActivation.VIEWMODE_DEACTIVATE = "viewmode_deactivate";
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPActivation.instance = null;
cSPActivation.fGetInstance = function(vDiv) {return cSPActivation.instance ? cSPActivation.instance : cSPActivation.instance = new cSPActivation(vDiv);}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fInit = function(
)
{
fDbg("*** cSPActivation, fInit(), ");
	var vThis;
	vThis = this;

	vThis.mDivUsername = $($("#div_activationMain #div_activationMain_activatestep1").children()[0]);
	vThis.mDivUsername.pIndicatorStyle = { width: "510px", height: "50px", top: "154px", left: "140px" };
	vThis.mDivUsernameContent = $(vThis.mDivUsername.children()[1]);
	vThis.mDivPassword = $($("#div_activationMain #div_activationMain_activatestep1").children()[1]);
	vThis.mDivPassword.pIndicatorStyle = { width: "510px", height: "50px", top: "214px", left: "140px" };
	vThis.mDivPasswordContent = $(vThis.mDivPassword.children()[1]);
	vThis.mDivDevicename = $($("#div_activationMain #div_activationMain_activatestep1").children()[2]);
	vThis.mDivDevicename.pIndicatorStyle = { width: "510px", height: "50px", top: "274px", left: "140px" };
	vThis.mDivDevicenameContent = $(vThis.mDivDevicename.children()[1]);

	vThis.mDivBack = $(vThis.mDiv.children("#subnavi_action").children()[0]);
	vThis.mDivBack.pIndicatorStyle = { width: "95px", height: "36px", top: "551px", left: "260px" };
	vThis.mDivNotNow = $(vThis.mDiv.children("#subnavi_action").children()[1]);
	vThis.mDivNotNow.pIndicatorStyle = { width: "145px", height: "36px", top: "551px", left: "239px" };
	vThis.mDivActivate = $(vThis.mDiv.children("#subnavi_action").children()[2]);
	vThis.mDivActivate.pIndicatorStyle = { width: "150px", height: "36px", top: "551px", left: "425px" };
	vThis.mDivDeActivate = $(vThis.mDiv.children("#subnavi_action").children()[3]);
	vThis.mDivDeActivate.pIndicatorStyle = { width: "170px", height: "36px", top: "551px", left: "425px" };
	
	vThis.pViewMode(cSPActivation.VIEWMODE_ACTIVATE_NOTNOW);
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPActivation.prototype.pViewMode = function(
	vViewMode
)
{
fDbg("*** cSPActivation, pViewMode(), " + vViewMode);
	var vThis;
	vThis = this;

	if (!vViewMode) return vThis.mViewMode;
	
	switch (vViewMode)
	{
	case cSPActivation.VIEWMODE_ACTIVATE_NOTNOW:
		vThis.mDiv.children("#div_activationMain_deactivatestep1").hide();
		vThis.mDiv.children("#div_activationMain_activatestep1").show();
		vThis.mDivUsername.css("opacity", "0.2");
		vThis.mDivPassword.css("opacity", "0.2");
		vThis.mDivDevicename.css("opacity", "0.2");
		vThis.mDivBack.css("opacity", "0.2");
		vThis.mDivBack.hide();
		vThis.mDivNotNow.css("opacity", "0.2");
		vThis.mDivNotNow.show();
		vThis.mDivActivate.css("opacity", "0.2");
		vThis.mDivActivate.show();
		vThis.mDivDeActivate.css("opacity", "0.2");
		vThis.mDivDeActivate.hide();
		
		vThis.mCurrSelection = vThis.mDivUsername;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;

	case cSPActivation.VIEWMODE_ACTIVATE_BACK:
		if (cModel.fGetInstance().CHUMBY_AUTHORIZED == true)
			return;
		
		vThis.mDiv.children("#div_activationMain_deactivatestep1").hide();
		vThis.mDiv.children("#div_activationMain_activatestep1").show();
		
		vThis.mDivUsername.css("opacity", "0.2");
		vThis.mDivPassword.css("opacity", "0.2");
		vThis.mDivDevicename.css("opacity", "0.2");
		vThis.mDivBack.css("opacity", "0.2");
		vThis.mDivBack.show();
		vThis.mDivNotNow.css("opacity", "0.2");
		vThis.mDivNotNow.hide();
		vThis.mDivActivate.css("opacity", "0.2");
		vThis.mDivActivate.show();
		vThis.mDivDeActivate.css("opacity", "0.2");
		vThis.mDivDeActivate.hide();
		
		vThis.mCurrSelection = vThis.mDivUsername;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;

	case cSPActivation.VIEWMODE_DEACTIVATE:
		vThis.mDiv.children("#div_activationMain_activatestep1").hide();
		vThis.mDiv.children("#div_activationMain_deactivatestep1").show();
		vThis.mDivUsername.css("opacity", "0.2");
		vThis.mDivPassword.css("opacity", "0.2");
		vThis.mDivDevicename.css("opacity", "0.2");
		vThis.mDivBack.css("opacity", "0.2");
		vThis.mDivBack.show();
		vThis.mDivNotNow.css("opacity", "0.2");
		vThis.mDivNotNow.hide();
		vThis.mDivActivate.css("opacity", "0.2");
		vThis.mDivActivate.hide();
		vThis.mDivDeActivate.css("opacity", "0.2");
		vThis.mDivDeActivate.show();
		
		vThis.mCurrSelection = vThis.mDivBack;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;
	}
	vThis.mViewMode = vViewMode;
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cSPActivation, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, o, p;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				keyboard_onRemoteControl("left", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				keyboard_onRemoteControl("left", "input_password");
			else if ($(o.children()[2]).css("opacity") == "1")
				keyboard_onRemoteControl("left", "input_devicename");
			return;
		}
		
		switch (vThis.pViewMode())
		{
		case cSPActivation.VIEWMODE_ACTIVATE_NOTNOW:
			if (vThis.mCurrSelection != vThis.mDivActivate)
				return;
			o = vThis.mDivNotNow;
			break;
		case cSPActivation.VIEWMODE_ACTIVATE_BACK:
			if (vThis.mCurrSelection != vThis.mDivActivate)
				return;
			o = vThis.mDivBack;
			break;
		case cSPActivation.VIEWMODE_DEACTIVATE:
			if (vThis.mCurrSelection != vThis.mDivDeActivate)
				return;
			o = vThis.mDivBack;
			break;
		}
		vThis.mCurrSelection.css("opacity", "0.2");
		vThis.mCurrSelection = o;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				keyboard_onRemoteControl("right", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				keyboard_onRemoteControl("right", "input_password");
			else if ($(o.children()[2]).css("opacity") == "1")
				keyboard_onRemoteControl("right", "input_devicename");
			return;
		}

		switch (vThis.pViewMode())
		{
		case cSPActivation.VIEWMODE_ACTIVATE_NOTNOW:
			if (vThis.mCurrSelection != vThis.mDivNotNow)
				return;
			o = vThis.mDivActivate;
			break;
		case cSPActivation.VIEWMODE_ACTIVATE_BACK:
			if (vThis.mCurrSelection != vThis.mDivBack)
				return;
			o = vThis.mDivActivate;
			break;
		case cSPActivation.VIEWMODE_DEACTIVATE:
			if (vThis.mCurrSelection != vThis.mDivBack)
				return;
			o = vThis.mDivDeActivate;
			break;
		default:
			return;
		}
		vThis.mCurrSelection.css("opacity", "0.2");
		vThis.mCurrSelection = o;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				o = keyboard_onRemoteControl("center", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				o = keyboard_onRemoteControl("center", "input_password");
			else if ($(o.children()[2]).css("opacity") == "1")
				keyboard_onRemoteControl("center", "input_devicename");
			return;
		}
		
		switch (vThis.mCurrSelection)
		{
		case vThis.mDivBack:
			cCPanel.fGetInstance().fBack();
			break;
		case vThis.mDivNotNow:
			cCPanel.fGetInstance().fBack("all");
			break;
		case vThis.mDivActivate:
			fDbg(">>> " + "start activating...");
			cJSCore.fGetInstance().fOnSignal(cConst.SIGNAL_ACTIVATE, [vThis.mDivUsernameContent.html(), vThis.mDivPasswordContent.html(), vThis.mDivDevicenameContent.html()], function(vData) {
				if (vData == "true" || vData == true)
				{
					cModuleToast.fGetInstance().fToast("Activation Successful!", "message", {color: "#00FF00"});
					vThis.pViewMode(cSPActivation.VIEWMODE_DEACTIVATE);
					cProxy.fClearDeviceData("unauthorized");
				}
				else
				{
					if (vData.indexOf("Account not verified") > -1)
						cModuleToast.fGetInstance().fToast("Activation Failed! <br/> Username and password mismatch.", "message", {color: "#FF0000"});
					else if (vData.indexOf("Missing user") > -1)
						cModuleToast.fGetInstance().fToast("Activation Failed! <br/> Username and password mismatch.", "message", {color: "#FF0000"});
				}
			});
			break;
		case vThis.mDivDeActivate:
			fDbg(">>> " + "start de-activating...");
			cJSCore.fGetInstance().fOnSignal(cConst.SIGNAL_DEACTIVATE, null, function(vData) {
				fDbg("*** cSPActivation, deactivation-return : " + vData);
				if (vData == "true" || vData == true)
				{
					cModuleToast.fGetInstance().fToast("Deactivation Successful!", "message", {color: "#00FF00"});
					vThis.pViewMode(cSPActivation.VIEWMODE_ACTIVATE_BACK);
					cProxy.fClearDeviceData("unauthorized");
				}
			});
			break;
		case vThis.mDivUsername:
			if (cModuleInput.fGetInstance().mIsActive)
				return;
			cModuleInput.fGetInstance().fShow();
			cModuleInput.fGetInstance().fAssociate(vThis.mDivUsernameContent, vThis.mDivUsernameContent.html());
			break;
		case vThis.mDivPassword:
			if (cModuleInput.fGetInstance().mIsActive)
				return;
			cModuleInput.fGetInstance().fShow();
			cModuleInput.fGetInstance().fAssociate(vThis.mDivPasswordContent, vThis.mDivPasswordContent.html());
			break;
		case vThis.mDivDevicename:
			if (cModuleInput.fGetInstance().mIsActive)
				return;
			cModuleInput.fGetInstance().fShow();
			cModuleInput.fGetInstance().fAssociate(vThis.mDivDevicenameContent, vThis.mDivDevicenameContent.html());
			break;
		default:
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
			{
				$("#div_activationMain #div_keyboard").css("opacity", "1");
				$("#div_activationMain #item_indicator").css("opacity", "0.2");
				keyboard_onRemoteControl("down", "input_username");
				return;
			}
			else if ($(o.children()[1]).css("opacity") == "1")
			{
				$("#div_activationMain #div_keyboard").css("opacity", "1");
				$("#div_activationMain #item_indicator").css("opacity", "0.2");
				keyboard_onRemoteControl("down", "input_password");
				return;
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")		// within keyboard
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				o = keyboard_onRemoteControl("up", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				o = keyboard_onRemoteControl("up", "input_password");
			else if ($(o.children()[2]).css("opacity") == "1")
				o = keyboard_onRemoteControl("up", "input_devicename");
			if (o)
			{
				$("#div_activationMain #item_indicator").css("opacity", "1");
				$("#div_activationMain #div_keyboard").css("opacity", "0.2");
			}
			return;
		}
		
		switch (vThis.mCurrSelection)
		{
		case vThis.mDivPassword: 	o = vThis.mDivUsername; break;
		case vThis.mDivDevicename: 	o = vThis.mDivPassword; break;
		case vThis.mDivBack:
		case vThis.mDivNotNow:
		case vThis.mDivActivate:
		case vThis.mDivDeActivate:	o = vThis.mDivDevicename;	break;
		default: return;
		}
		vThis.mCurrSelection.css("opacity", "0.2");
		vThis.mCurrSelection = o;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")		// within keyboard
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				o = keyboard_onRemoteControl("down", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				o = keyboard_onRemoteControl("down", "input_password");
			else if ($(o.children()[2]).css("opacity") == "1")
				o = keyboard_onRemoteControl("down", "input_devicename");
			if (o)
			{
				$("#div_activationMain #item_indicator").css("opacity", "1");
				$("#div_activationMain #div_keyboard").css("opacity", "0.2");
			}
			return;
		}
		
		switch (vThis.mCurrSelection)
		{
		case vThis.mDivUsername: 	o = vThis.mDivPassword; break;
		case vThis.mDivPassword: 	o = vThis.mDivDevicename; break;
		case vThis.mDivDevicename:
			switch (vThis.pViewMode())
			{
			case cSPActivation.VIEWMODE_ACTIVATE_NOTNOW: 	o = vThis.mDivNotNow; break;
			case cSPActivation.VIEWMODE_ACTIVATE_BACK:
			case cSPActivation.VIEWMODE_DEACTIVATE: 		o = vThis.mDivBack; break;
			default: return;
			}
			break;
		default: return;
		}
		vThis.mCurrSelection.css("opacity", "0.2");
		vThis.mCurrSelection = o;
		vThis.mCurrSelection.css("opacity", "1");
		$("#div_activationMain #item_indicator").css(vThis.mCurrSelection.pIndicatorStyle);
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fShow = function(
)
{
	var vThis;
	vThis = this;
	
	if (cModel.fGetInstance().CHUMBY_AUTHORIZED == true)
	{
		vThis.pViewMode(cSPActivation.VIEWMODE_DEACTIVATE);
	}
	else
	{
		vThis.pViewMode(cSPActivation.VIEWMODE_ACTIVATE_NOTNOW);
	}
	
	this.mDiv.show();
}
cSPActivation.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.fShow();
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPActivation.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fUpdate = function(
)
{
fDbg("*** cSPActivation, fUpdate(), ");
	var vThis;
	vThis = this;
	
	$(vThis.mDiv.children("#subnavi_action").children()[0]).html("BACK");

	if ($($("#subnavi_action").children()[0]).css("opacity") == "1")
		$("#div_activationMain #item_indicator").css("width", "100px");
}

// -------------------------------------------------------------------------------------------------
//	pEnableBack
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.pEnableBack = function(
	vData	// true | false
)
{
fDbg2("*** cSPActivation, pEnableBack(), ");
	var vThis, o;
	vThis = this;
	
	if (vData == false)
	{
		vThis.mEnableBackButton = vData;
		vThis.mDiv.children("#subnavi_action").hide();
	}
	else
	{
		vThis.mEnableBackButton = vData;
		vThis.mDiv.children("#subnavi_action").show();
	}
}
