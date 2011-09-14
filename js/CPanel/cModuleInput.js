// -------------------------------------------------------------------------------------------------
//	cModuleInput class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleInput(
	vDiv
)
{
fDbg("*** cModuleInput, ");
	// base elements
	this.mDiv = vDiv ? $("#" + vDiv) : {};
	this.mID = vDiv ? vDiv : null;

	// selection
	this.mPrevSelection = null;
	this.mSelection = null;		

	// div
	this.mDivInputContent = $(this.mDiv.children("#div_inputcontent").children()[0]);
	this.mDivKeyboard = this.mDiv.children("#div_keyboard");
	this.mDivCancel = $(this.mDiv.children("#div_inputaction").children()[0]);
	this.mDivCancel.pIndicatorStyle = {top: "350px", left: "180px", width: "150px", height: "40px"};
	this.mDivOK = $(this.mDiv.children("#div_inputaction").children()[1]);
	this.mDivOK.pIndicatorStyle = {top: "350px", left: "420px", width: "100px", height: "40px"};
	this.mDivIndicator = $(this.mDiv.children("#item_indicators").children()[0]);

	this.mDivAssociatedInput = null;
	this.mIsActive = false;
	this.mCallbackFun = null;
	
	// style elements
	this.mViewPortSize = [];


	// view modes
	this.mViewMode = null;
	cModuleInput.VIEWMODE_DEFAULT = "viewmode_default";
	
	// function calls
	this.fInit();
}

/** ------------------------------------------------------------------------------------------------
 *	singleton
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.instance = null;
cModuleInput.fGetInstance = function(
	vDiv
)
{
	return cModuleInput.instance ? cModuleInput.instance : cModuleInput.instance = new cModuleInput(vDiv);
}

/** ------------------------------------------------------------------------------------------------
 *	fInit
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.fInit = function(
)
{
fDbg("*** cModuleInput, fInit(), ");
	
	this.pViewMode(cModuleInput.VIEWMODE_DEFAULT);
}

/** ------------------------------------------------------------------------------------------------
 *	fResize
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.fResize = function(
	vViewPortSize
)
{	
	var vThis;
	vThis = this;
	
	vThis.mViewPortSize = vViewPortSize;
	vThis.mDiv.css("left", (vViewPortSize[0] - 800) / 2 + 50 + "px");
	vThis.mDiv.css("top", (vViewPortSize[1] - 600) / 2 + 145 + "px");
}

/** ------------------------------------------------------------------------------------------------
 *	fReset
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.fReset = function(
	vReturnFun
)
{
	
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.pViewMode = function(
	vViewMode
)
{
	var vThis;
	vThis = this;

	if (!vViewMode) return vThis.mViewMode;
	
	switch (vViewMode)
	{
	case cModuleInput.VIEWMODE_DEFAULT:
		vThis.mDivCancel.css("opacity", "0.2");
		vThis.mDivOK.css("opacity", "0.2");
		vThis.mDivIndicator.hide();
		
		vThis.pSelection(vThis.mDivKeyboard);
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	pSelection
// -------------------------------------------------------------------------------------------------
cModuleInput.prototype.pSelection = function(
	vSelection,
	vDimPrevSelection,		// false | true
	vLightNewSelection		// false | true
)
{
	var vThis, o;
	vThis = this;
	
if (!vSelection) return vThis.mSelection;
	vThis.mPrevSelection = vThis.mSelection;
	if (vThis.mPrevSelection && vDimPrevSelection)
		vThis.mPrevSelection.css("opacity", "0.2");
	vThis.mSelection = vSelection;
	if (vThis.mSelection && vLightNewSelection)
		vThis.mSelection.css("opacity", "1");

	if (vThis.mSelection == vThis.mDivKeyboard)
		vThis.mDivIndicator.hide();
	else
	{
		vThis.mDivIndicator.show();
		vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
	}
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cModuleInput.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cModuleInput, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, o, p;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if (vThis.mSelection == vThis.mDivKeyboard)
			o = keyboard_onRemoteControl("left", "div_inputcontent_text");
		else if (vThis.mSelection == vThis.mDivOK)
			vThis.pSelection(vThis.mDivCancel, true, true);
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mSelection == vThis.mDivKeyboard)
			o = keyboard_onRemoteControl("right", "div_inputcontent_text");
		else if (vThis.mSelection == vThis.mDivCancel)
			vThis.pSelection(vThis.mDivOK, true, true);
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (vThis.mSelection == vThis.mDivKeyboard)
			o = keyboard_onRemoteControl("center", "div_inputcontent_text");
		else if (vThis.mSelection == vThis.mDivCancel)
		{
			vThis.mDivAssociatedInput = null;
			vThis.fHide();
		}
		else if (vThis.mSelection == vThis.mDivOK)
		{
			vThis.mDivAssociatedInput.html(vThis.mDivInputContent.html());
			if (vThis.mCallbackFun)
				vThis.mCallbackFun();
			vThis.mDivAssociatedInput = null;
			vThis.fHide();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (vThis.mSelection == vThis.mDivKeyboard)
		{
			o = keyboard_onRemoteControl("up", "div_inputcontent_text");
			if (o)
				keyboard_onRemoteControl("down", "div_inputcontent_text");
		}
		else
		{
			vThis.pSelection(vThis.mDivKeyboard, true, false);
			keyboard_onRemoteControl("up", "div_inputcontent_text")
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (vThis.mSelection == vThis.mDivKeyboard)
		{
			o = keyboard_onRemoteControl("down", "div_inputcontent_text");
			if (o)
				vThis.pSelection(vThis.mDivCancel, false, true);
		}
		break;
	}
}

/** ------------------------------------------------------------------------------------------------
 *	fShow / fHide
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.fShow = function(
)
{
	this.mDiv.show();
	this.mIsActive = true;
	this.pViewMode(cModuleInput.VIEWMODE_DEFAULT);
}
cModuleInput.prototype.fHide = function(
)
{
	this.mDiv.hide();
	this.mIsActive = false;
	this.mCallbackFun = null;
}

/** ------------------------------------------------------------------------------------------------
 *	fAnimateIn / fAnimateOut
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.fAnimateIn = function(
	vReturnFun
)
{
fDbg("*** cModuleInput, fAnimateIn(), ");
	this.fShow();
	//~ this.mDiv.fadeIn(200, function() {
		//~ if (vReturnFun)
			//~ vReturnFun();
	//~ });
}
cModuleInput.prototype.fAnimateOut = function(
	vReturnFun
)
{
	var vThis;
	vThis = this;
	
	this.mDiv.fadeOut(200, function() {
		vThis.mIsActive = false;
		vThis.mCallbackFun = null;
		if (vReturnFun)
			vReturnFun();
	});
}

/** ------------------------------------------------------------------------------------------------
 *	fAssociate
 * -----------------------------------------------------------------------------------------------*/
cModuleInput.prototype.fAssociate = function(
	vDiv,		// jquery $
	vContent,	// input text
	vTitle,		// input title
	vSaveCallbackFun
)
{
	var vThis;
	vThis = this;
	
	vThis.mDivAssociatedInput = vDiv;
	vThis.mDivInputContent.html(vContent);
	if (keyboard_currentY > 4)
		keyboard_onRemoteControl("up", "div_inputcontent_text");
	else if (keyboard_currentY < 0)
		keyboard_onRemoteControl("down", "div_inputcontent_text");

	vThis.mCallbackFun = vSaveCallbackFun;
}
