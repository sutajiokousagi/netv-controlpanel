// -------------------------------------------------------------------------------------------------
//	cTimerModule class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cTimerModule(
)
{
	this.mHeartBeat = null;
	
	
	this.mPrevTime = null;

	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cTimerModule.instance = null;
cTimerModule.fGetInstance = function(
)
{
	return cTimerModule.instance ? cTimerModule.instance : (cTimerModule.instance = new cTimerModule());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cTimerModule.prototype.fInit = function(
)
{
fDbg("*** cTimerModule, fInit(), ");
	this.mHeartBeat = setInterval(this.fHeartBeat, 1000);
}


// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cTimerModule.prototype.fHeartBeat = function(
)
{
	var vDate = new Date();
	//~ fDbg2("*** HEARTBEAT ***");
	
	//~ fDbg2((new Date().getHours()) + ":" + (new Date().getMinutes()) + ":" + (new Date().getSeconds()) + "." + (new Date().getMilliseconds()) + " --- " + (new Date().getSeconds() * 1000 + new Date().getMilliseconds() - this.mPrevTime));
	this.mPrevTime = vDate.getHours()*3600000 + vDate.getMinutes()*60000 + vDate.getSeconds() * 1000 + vDate.getMilliseconds();

	cJSCore.fGetInstance().fOnSignal(cConst.SIGNAL_HEARTBEAT, null, null);
}
