// -------------------------------------------------------------------------------------------------
//	cModuleToast class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleToast(
	vDiv
)
{
	// base elements
	this.mDiv = vDiv ? $("#" + vDiv) : {};
	this.mID = vDiv ? vDiv : null;
	this.mDivToastContent = this.mDiv.children("#div_toast_content");
	
	// style elements
	this.mViewPortSize = [];


	
	// function calls
	this.fInit();
}

/** ------------------------------------------------------------------------------------------------
 *	singleton
 * -----------------------------------------------------------------------------------------------*/
cModuleToast.instance = null;
cModuleToast.fGetInstance = function(
	vDiv
)
{
	return cModuleToast.instance ? cModuleToast.instance : cModuleToast.instance = new cModuleToast(vDiv);
}

/** ------------------------------------------------------------------------------------------------
 *	fInit
 * -----------------------------------------------------------------------------------------------*/
cModuleToast.prototype.fInit = function(
)
{
//~ fDbg("*** cModuleToast, fInit(), ");
	
}

/** ------------------------------------------------------------------------------------------------
 *	fResize
 * -----------------------------------------------------------------------------------------------*/
cModuleToast.prototype.fResize = function(
	vViewPortSize
)
{	
	var vThis = this;
	vThis.mViewPortSize = vViewPortSize;

	vThis.mDiv.css("width", vViewPortSize[0] + "px");
}

/** ------------------------------------------------------------------------------------------------
 *	fReset
 * -----------------------------------------------------------------------------------------------*/
cModuleToast.prototype.fReset = function(
	vReturnFun
)
{
	
}

/** ------------------------------------------------------------------------------------------------
 *	fShow / fHide
 * -----------------------------------------------------------------------------------------------*/
cModuleToast.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cModuleToast.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

/** ------------------------------------------------------------------------------------------------
 *	fToast
 * -----------------------------------------------------------------------------------------------*/
cModuleToast.prototype.fToast = function(
	vMsg,
	vType,
	vCSSObj,
	vReturnFun
)
{
fDbg("*** cModuleToast, fToast(), " + vMsg + ", " + vType);
	var vThis, vT;
	vThis = this;
	vT = 3000;
	
	$("#div_toast_content").html(vMsg);
	if (!vType || vType == "warning")
	{
		$("#div_toast_content").css("background-color", "#FF4444");
		$("#div_toast_content").css("color", "#FFFFFF");
		$("#div_toast_content").css("font-size", "24px");
		vT = 5000;
	}
	else if (vType = "message")
	{
		$("#div_toast_content").css("background-color", "#333333");
		$("#div_toast_content").css("color", "#FFFFFF");
		$("#div_toast_content").css("font-size", "24px");
		vT = 3000;
	}
	
	if (vCSSObj)
		$("#div_toast_content").css(vCSSObj);

	
	
	$("#div_toast").show();
	$("#div_toast").css("top", "-100px");
	$("#div_toast").animate({
		top : vThis.mViewPortSize[1] / 20 + "px"
	}, 200, function() {
		var vTO = setTimeout(function() {
			$("#div_toast").animate({
				top : "-100px"
			}, 200, function() {
			});
		}, vT);

	});
	
	//~ fDbg2($("#div_toast_content").outerWidth());
}
