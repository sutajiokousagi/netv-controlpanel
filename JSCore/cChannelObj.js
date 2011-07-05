// -------------------------------------------------------------------------------------------------
//	cChannelObj class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cChannelObj(
	vData		// xml String
)
{
	this.mInterval = "";
	this.mToken = "";
	this.mId = "";
	this.mName = "";
	this.mDescription = "";

	this.mSkin = new Object();
	this.mSkin.mHref = "";
	this.mSkin.mName = "";
	this.mSkin.mId = "";

	this.mAccess = new Object();
	this.mAccess.mAccess = "";
	this.mAccess.mId = "";

	this.mWidgetList = [];
	
	// parse
	var i, o;
	vData = vData.substring(vData.indexOf("<?xml"));
	var vParser = new DOMParser();
	var vXmlDoc = vParser.parseFromString(vData, "text/xml");
	//fDbg(vXmlDoc);

	this.mInterval = vXmlDoc.getElementsByTagName("profile")[0].getAttribute("interval");
	this.mToken = vXmlDoc.getElementsByTagName("profile")[0].getAttribute("token");
	this.mId = vXmlDoc.getElementsByTagName("profile")[0].getAttribute("id");
	this.mName = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("name")[0].textContent;
	this.mDescription = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("description")[0].textContent;
	this.mSkin.mHref = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("skin")[0].getAttribute("href");
	this.mSkin.mName = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("skin")[0].getAttribute("name");
	this.mSkin.mId = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("skin")[0].getAttribute("id");
	this.mAccess.mAccess = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("access")[0].getAttribute("access");
	this.mAccess.mId = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("access")[0].getAttribute("id");

	o = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("widget_instances")[0].getElementsByTagName("widget_instance");
	for (i = 0; i < o.length; i++)
		this.mWidgetList.push(new cWidgetObj(o[i]));
}

// -------------------------------------------------------------------------------------------------
//	parse to XML
// -------------------------------------------------------------------------------------------------
cChannelObj.prototype.toXML = function(
)
{
	var vXML;

	return vXML;
}






// -------------------------------------------------------------------------------------------------
//	parse to XML
// -------------------------------------------------------------------------------------------------
cChannelObj.prototype.fPreloadThumbnails = function(
)
{
	var o, i;

	
	fDbg2("asdg");
	fDbg2("asdg");
	fDbg2("asdg");
	
}


