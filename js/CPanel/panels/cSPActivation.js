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
	this.mCurrSelection = 0;		//	0 | 1

	// div elements
	this.mDivUsername = null;
	this.mDivPassword = null;
	this.mDivCancel = null;
	this.mDivActivate = null;
	
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
//~ fDbg("*** cSPActivation, fInit(), ");
	var vThis, o;
	vThis = this;

	vThis.mDivUsername = $($("#div_activationMain #div_activationMain_activatestep1").children()[0]);
	vThis.mDivPassword = $($("#div_activationMain #div_activationMain_activatestep1").children()[1]);

	//~ vThis.mDiv.children("item_indicator").css("top", vThis.mDiv.children("input_username").css("top"));
	//~ vThis.mDiv.children("#item_indicator").css("top", "200px");
	o = $("#div_activationMain #input_username").css("top");
	o = parseInt(o.split("px")[0]);
	o = o + 160 - 9;
	$("#div_activationMain #item_indicator").css("top", o + "px");
	
	o = $("#div_activationMain #input_username").css("width");
	o = parseInt(o.split("px")[0]);
	o = o + 210;
	$("#div_activationMain #item_indicator").css("width", o + "px");
	
	o = $("#div_activationMain #input_username").css("height");
	o = parseInt(o.split("px")[0]);
	o = 56;
	$("#div_activationMain #item_indicator").css("height", o + "px");
	
	o = $("#div_activationMain #input_username").css("left");
	o = parseInt(o.split("px")[0]);
	o = o + 0;
	$("#div_activationMain #item_indicator").css("left", o + "px");

	
	$(vThis.mDiv.children("#subnavi_action").children()[0]).html("NOT NOW");
	$(vThis.mDiv.children("#subnavi_action").children()[0]).css("width", "100px");
	$(vThis.mDiv.children("#subnavi_action").children()[0]).css("left", "-=40px");
	$(vThis.mDiv.children("#subnavi_action").children()[1]).css("left", "+=40px");
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
//~ fDbg2("*** cSPActivation, fOnSignal(), " + vSignal + ", " + vData);
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
			return;
		}
		
		if ($($("#subnavi_action").children()[1]).css("opacity") == "1")
		{
			$($("#subnavi_action").children()[0]).css("opacity", "1");
			$($("#subnavi_action").children()[1]).css("opacity", "0.2");


			
			if ($(vThis.mDiv.children("#subnavi_action").children()[0]).html() == "BACK")
				$("#div_activationMain #item_indicator").animate({
					"top": "551px",
					"left": "239px",
					"height": "36px",
					"width": "100px"
				}, 10, function() {
					
				});
			else
				$("#div_activationMain #item_indicator").animate({
					"top": "551px",
					"left": "239px",
					"height": "36px",
					"width": "140px"
				}, 10, function() {
					
				});
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				keyboard_onRemoteControl("right", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				keyboard_onRemoteControl("right", "input_password");
			return;
		}

		
		if ($($("#subnavi_action").children()[0]).css("opacity") == "1")
		{
			$($("#subnavi_action").children()[0]).css("opacity", "0.2");
			$($("#subnavi_action").children()[1]).css("opacity", "1");
			$("#div_activationMain #item_indicator").animate({
				"top": "551px",
				"left": "418px",
				"height": "36px",
				"width": "140px"
			}, 10, function() {
				
			});
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				o = keyboard_onRemoteControl("center", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				o = keyboard_onRemoteControl("center", "input_password");
			return;
		}
		
		o = vThis.mDiv.children("#div_activationMain_activatestep1");
		if ($(o.children()[0]).css("opacity") == "1")
		{
			$("#div_activationMain #div_keyboard").css("opacity", "1");
			$("#div_activationMain #item_indicator").css("opacity", "0.2");
			keyboard_onRemoteControl("down", "input_username");
		}
		else if ($(o.children()[1]).css("opacity") == "1")
		{
			$("#div_activationMain #div_keyboard").css("opacity", "1");
			$("#div_activationMain #item_indicator").css("opacity", "0.2");
			keyboard_onRemoteControl("down", "input_password");
		}
		else if ($($("#subnavi_action").children()[0]).css("opacity") == "1")
		{
			if ($(vThis.mDiv.children("#subnavi_action").children()[0]).html() == "BACK")	
				cCPanel.fGetInstance().fBack();
			else
				cCPanel.fGetInstance().fBack("all");
		}
		else if ($($("#subnavi_action").children()[1]).css("opacity") == "1")
		{
			cJSCore.fGetInstance().fOnSignal(cConst.SIGNAL_ACTIVATE, null, null);
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				o = keyboard_onRemoteControl("up", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				o = keyboard_onRemoteControl("up", "input_password");
				
			if (o)
			{
				
				$("#div_activationMain #item_indicator").css("opacity", "1");
				$("#div_activationMain #div_keyboard").css("opacity", "0.2");
			}
			return;
		}
		
		o = vThis.mDiv.children("#div_activationMain_activatestep1");
		if ($(o.children()[1]).css("opacity") == "1")
		{
			$(o.children()[0]).css("opacity", "1");
			$(o.children()[1]).css("opacity", "0.2");
			//~ $("#div_activationMain #item_indicator").css("top", "-=60px");
			$("#div_activationMain #item_indicator").animate({
				"top": "-=60px"
			}, 10, function() {

			});
		}
		else if ($($("#subnavi_action").children()[0]).css("opacity") == "1")
		{
			$(o.children()[1]).css("opacity", "1");
			$($("#subnavi_action").children()[0]).css("opacity", "0.2");
			$("#div_activationMain #item_indicator").animate({
				"top": "211px",
				"left": "140px",
				"height": "56px",
				"width": "510px"
			}, 10, function() {
				
			});
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if ($("#div_activationMain #div_keyboard").css("opacity") == "1")
		{
			o = vThis.mDiv.children("#div_activationMain_activatestep1");
			if ($(o.children()[0]).css("opacity") == "1")
				keyboard_onRemoteControl("down", "input_username");
			else if ($(o.children()[1]).css("opacity") == "1")
				keyboard_onRemoteControl("down", "input_password");
			return;
		}
		
		o = vThis.mDiv.children("#div_activationMain_activatestep1");
		if ($(o.children()[0]).css("opacity") == "1")
		{
			$(o.children()[0]).css("opacity", "0.2");
			$(o.children()[1]).css("opacity", "1");
			//~ $("#div_activationMain #item_indicator").css("top", "+=60px");
			o = $("#div_activationMain #item_indicator");
			
			$("#div_activationMain #item_indicator").animate({
				"top": "+=60px"
			}, 10, function() {
				
			});
		}
		else if ($(o.children()[1]).css("opacity") == "1")
		{
			$(o.children()[1]).css("opacity", "0.2");
			$($("#subnavi_action").children()[0]).css("opacity", "1");

			if ($(vThis.mDiv.children("#subnavi_action").children()[0]).html() == "BACK")
				$("#div_activationMain #item_indicator").animate({
					"top": "551px",
					"left": "239px",
					"height": "36px",
					"width": "100px"
				}, 10, function() {
					
				});
			else
				$("#div_activationMain #item_indicator").animate({
					"top": "551px",
					"left": "239px",
					"height": "36px",
					"width": "140px"
				}, 10, function() {
					
				});
		}
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fShow = function() { this.mDiv.show(); }
cSPActivation.prototype.fHide = function() { this.mDiv.hide(); }

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPActivation.prototype.fAnimateIn = function(vReturnFun) { this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); }); }
cSPActivation.prototype.fAnimateOut = function(vReturnFun) { this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); }); }

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
