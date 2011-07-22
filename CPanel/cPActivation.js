// -------------------------------------------------------------------------------------------------
//	cPActivation class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cPActivation(
	vDivObj
)
{
fDbg2("*** cPActivation, ");
	this.mDiv = vDivObj ? vDivObj : {};


	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cPActivation.instance = null;
cPActivation.fGetInstance = function(
	vDivObj
)
{
	return cPActivation.instance ? cPActivation.instance : cPActivation.instance = new cPActivation(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cPActivation.prototype.fInit = function(
)
{
fDbg2("*** cPActivation, fInit(), ");
	fDbg2(this.mDiv);
	fDbg2(this.mDiv.length);
	fDbg2(this.mDiv.attr("id"));
	$("#" + this.mDiv.attr("id")).hide();
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cPActivation.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cPActivation.prototype.fHide = function(
)
{
	this.mDiv.hide();
}
