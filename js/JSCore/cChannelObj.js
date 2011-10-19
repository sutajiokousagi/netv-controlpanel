// -------------------------------------------------------------------------------------------------
//	cChannelObj class (cProfile)
//
//
//
/*
<?xml version="1.0" encoding="UTF-8"?>
	<profile id="98E703D4-81FD-11E0-927E-0021288EC192">
		<name>chumby picks</name>
		<description>Default mix for your Chumby</description>
		<user id="920ED424-81FD-11E0-96B7-001B24F07EF4">qinchuan</user>
		<info type="Profile" created="Thu May 19 02:51:41 -0700 2011" pending="0" unaccepted="0" updated="Tue Apr 05 14:17:34 -0700 2011" origin="" master="true" published="Wed Jun 11 13:19:41 -0700 2008"/>
		<widget_instances count="35">
			<widget_instance id="98E8057C-81FD-11E0-927E-0021288EC192">
				<name>Local Info</name>
				<info created="Thu May 19 02:51:41 -0700 2011" secure="" updated="Thu May 19 02:51:41 -0700 2011" origin="default" access="private"/>
				<play mode="default" time="15"/>
				<rating value="0"/>
				<widget id="8664F0CE-C50E-11DF-91A6-001B24E044BE">
					<name>Local Info</name>
					<description>Local news, sports, weather, and traffic, all at a glance.</description>
					<play mode="default" time="30"/>
					<user username="chumby" type="chumby" id="00000000-0000-0000-0000-000000000001"/>
					<security previewable="true" virtualable="true" approval="approved" deletable="true" access="public" overlay="true" sendable="true"/>
					<rating count="169" value="4.1479"/>
					<thumbnail href="http://s3movies.chumby.com/cdn/xmlthumbnail/86976CD4-C50E-11DF-91A6-001B24E044BE"/>
					<template href="http://s3movies.chumby.com/cdn/xmltemplate/86A733EE-C50E-11DF-91A6-001B24E044BE"/>
					<movie contenttype="application/x-shockwave-flash" href="http://s3movies.chumby.com/cdn/xmlmovie/86A81E9E-C50E-11DF-91A6-001B24E044BE"/>
					<swfs>
						<swf bgcolor="000000" camera="false" previewable="true" supports_browser="false" content-type="application/x-shockwave-flash" height="240" width="320" microphone="false" resolution="" scalable="false" href="http://s3movies.chumby.com/cdn/xmlmovie/86A81E9E-C50E-11DF-91A6-001B24E044BE" accelerometer="false" pointing="false" as_version="2" requires_sound="false" swf_version="8" kb="false"/>
					</swfs>
				</widget>
				<parameters>
				</parameters>
			</widget_instance>
			*
			*
			*
		</widget_instances>
	</profile>
*/
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
	this.mID = "";
	this.mName = "";
	this.mDescription = "";
	this.mUser = {
		mUser : "",
		mID : ""
	};
	this.mInfo = {
		mType : "",
		mCreated : "",
		mPending : "",
		mUnaccepted : "",
		mUpdated : "",
		mOrigin : "",
		mMaster : "",
		mPublished : ""
	};
	this.mWidgetList = [];
	
	if (!vData)
		return;
		
	// parse
	var i, o;
	vData = vData.substring(vData.indexOf("<?xml"));
	var vParser = new DOMParser();
	var vXmlDoc = vParser.parseFromString(vData, "text/xml");
	
	this.mID = vXmlDoc.getElementsByTagName("profile")[0].getAttribute("id");
	this.mName = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("name")[0].textContent;
	this.mDescription = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("description")[0].textContent;
	this.mUser = {
		mUserName : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].textContent,
		mID : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("id")
	};
	this.mInfo = {
		mType : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("id"),
		mCreated : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("created"),
		mPending : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("pending"),
		mUnaccepted : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("unaccepted"),
		mUpdated : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("updated"),
		mOrigin : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("origin"),
		mMaster : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("master"),
		mPublished : vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("user")[0].getAttribute("published")
	};
	this.mWidgetList = [];
	
	
	o = vXmlDoc.getElementsByTagName("profile")[0].getElementsByTagName("widget_instances")[0].getElementsByTagName("widget_instance");
	
	for (i = 0; i < o.length; i++)
		this.mWidgetList.push(new cWidgetObj(o[i]));


	// -----------------------------------------------------
	// members
	// -----------------------------------------------------
	this.mPlayMode = "default";		// default | event
}



cChannelObj.prototype.pData = function(
	v
)
{
	var vThis, o, i, j;
	vThis = this;
	
	// 1, format mData
	vThis.mData = {};
	o = [];
	for (i = 0; i < vThis.mWidgetList.length; i++)
		o.push(vThis.mWidgetList[i].pData());
	vThis.mData["ID"] = vThis.mID;
	vThis.mData["WIDGETLIST_DATA"] = o;
	
	// 2, return mData
	if (v == undefined) return vThis.mData;
	
	// 3, apply/cast mData from v
	if (v["WIDGETLIST_DATA"])
	{
		for (i = 0; i < vThis.mWidgetList.length; i++)
			for (j = 0; j < v["WIDGETLIST_DATA"].length; j++)
				if (vThis.mWidgetList[i].mID == v["WIDGETLIST_DATA"][j]["ID"])
				{
					vThis.mWidgetList[i].pData(v["WIDGETLIST_DATA"][j]);
					break;
				}
	}
}














// -------------------------------------------------------------------------------------------------
//	parse to XML
// -------------------------------------------------------------------------------------------------
cChannelObj.prototype.pNextWidget = function(
	v
)
{
	
	if (typeof(v) == "object" && v != null)
		v = this.mWidgetList.indexOf(v);

	if (v + 1 >= this.mWidgetList.length)
		v = 0;
	else
		v++;
	
	return this.mWidgetList[v];
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
