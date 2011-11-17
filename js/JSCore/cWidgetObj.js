// -------------------------------------------------------------------------------------------------
//	cWidgetObj class
//
/*
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
					<parameter value="eb0c0eee71fe36b295917c65.0-512911933" name="session_key"/>
					<parameter value="_chumby_all" name="albumID"/>
					<parameter value="true" name="showDesc"/>
					<parameter value="false" name="showFriends"/>
					<parameter value="false" name="showTags"/>
					<parameter value="512911933" name="uid"/>
					<parameter value="" name="tags"/>
					<parameter value="recent" name="order"/>
					<parameter value="false" name="shuffle"/>
					<parameter value="true" name="showMine"/>
					<parameter value="2dd7a60371b6dd2831ef7f3b337d34fb" name="secret"/>
					<parameter value="2" name="api_key_version"/>
				</parameters>
			</widget_instance>
			*
			*
			*
		</widget_instances>
*/
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cWidgetObj(
	vDataNode		// xml node
)
{
	var o;
	
	this.mID = "";
	this.mName = "";
	this.mInfo = {
		mCreated : "",
		mSecure : "",
		mUpdated : "",
		mOrigin : "",
		mAccess : ""
	};
	this.mPlay = {
		mMode : "",
		mTime : ""
	};
	this.mRating = {
		mValue : ""
	};
	this.mWidget = {
		mID : "",
		mName : "",
		mDescription : "",
		mPlay : {
			mMode : "",
			mTime : ""
		},
		mUser : {
			mUsername : "",
			mType : "",
			mID : ""
		},
		mSecurity : {
			mPreviewable : "",
			mVirtualable : "",
			mApproval : "",
			mDeletable : "",
			mAccess : "",
			mOverlay : ""
		},
		mRating : {
			mCount : "",
			mValue : ""
		},
		mThumbnail : {
			mHref : ""
		},
		mTemplate : {
			mHref : ""
		},
		mMovie : {
			mContentType : "",
			mHref : ""
		},
		mSwfList : [
			{
				mBgcolor : "",
				mCamera : "",
				mPreviewable : "",
				mSupportsBrowser : "",
				mContentType : "",
				mWidth : null,
				mHeight : null,
				mMicrophone : "",
				mResolution : "",
				mScalable : "",
				mHref : "",
				mAccelerometer : "",
				mPointing : "",
				mASVersion : "",
				mRequiresSound : "",
				mSWFVersion : "",
				mKB : ""	// keyboard
			}
		]
	};
	this.mParameterList = null;
	
	
	
	
	
	
	
	
	
	// -------------------------------------------------------------------------	
	// local/temp variables
	// -------------------------------------------------------------------------
	this.mLocalThumbnailPath = "";
	this.mPeerWidget = {
		mID : null,
		mHref : null
	};
	this.mNeTVCompatiable = false;
	this.mEventLock = false;
	this.mNeedAuth = false;
	
	this.mEnabled = true;
	this.mUpdateInterval = 0;
	this.mUpdateIntervalList = [15, 60, 300, 600, 1800, 3600];
	this.mUpdateIntervalDisplayList = ["15s", "1m", "5m", "10m", "30m", "1h"];
	this.mOnlyShowNewEvent = true;
	
	this.mEventDisplayCount = 2;
	
	
	
	
	
	
	
	
	
	// -------------------------------------------------------------------------	
	// cast values from vDataNode
	// -------------------------------------------------------------------------
	if (!vDataNode)
		return;
	// parse vDataNode
	this.mID = vDataNode.getAttribute("id");
	this.mName = vDataNode.getElementsByTagName("name")[0].textContent;
	this.mInfo = {
		mCreated : vDataNode.getElementsByTagName("info")[0].getAttribute("created"),
		mSecure : vDataNode.getElementsByTagName("info")[0].getAttribute("secure"),
		mUpdated : vDataNode.getElementsByTagName("info")[0].getAttribute("updated"),
		mOrigin : vDataNode.getElementsByTagName("info")[0].getAttribute("origin"),
		mAccess : vDataNode.getElementsByTagName("info")[0].getAttribute("private")
	};
	this.mPlay = {
		mMode : vDataNode.getElementsByTagName("play")[0].getAttribute("mode"),
		mTime : vDataNode.getElementsByTagName("play")[0].getAttribute("time")
	};
	this.mRating = {
		mValue : vDataNode.getElementsByTagName("rating")[0].getAttribute("value")
	};
	this.mWidget = {
		mID : vDataNode.getElementsByTagName("widget")[0].getAttribute("id"),
		mName : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("name")[0].textContent,
		mDescription : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("description")[0].textContent,
		mPlay : {
			mMode : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("play")[0].getAttribute("mode"),
			mTime : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("play")[0].getAttribute("time")
		},
		mUser : {
			mUsername : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("user")[0].getAttribute("username"),
			mType : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("user")[0].getAttribute("type"),
			mID : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("user")[0].getAttribute("id")
		},
		mSecurity : {
			mPreviewable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("previewable"),
			mVirtualable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("virtualable"),
			mApproval : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("approval"),
			mDeletable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("deletable"),
			mAccess : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("access"),
			mOverlay : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("overlay"),
			mSendable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("security")[0].getAttribute("sendable")
		},
		mRating : {
			mCount : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("rating")[0].getAttribute("count"),
			mValue : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("rating")[0].getAttribute("value")
		},
		mThumbnail : {
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("thumbnail")[0].getAttribute("href")
		},
		mTemplate : {
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("template")[0].getAttribute("href")
		},
		mMovie : {
			mContentType : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("movie")[0].getAttribute("contenttype"),
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("movie")[0].getAttribute("href")
		},
		mSwfList : [
			{
				mBgcolor : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("bgcolor"),
				mCamera : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("camera"),
				mPreviewable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("previewable"),
				mSupportsBrowser : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("supports_browser"),
				mContentType : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("content-type"),
				mWidth : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("width"),
				mHeight : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("height"),
				mMicrophone : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("microphone"),
				mResolution : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("resolution"),
				mScalable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("scalable"),
				mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("href"),
				mAccelerometer : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("accelerometer"),
				mPointing : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("pointing"),
				mASVersion : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("as_version"),
				mRequiresSound : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("requires_sound"),
				mSWFVersion : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("swf_version"),
				mKB : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("swfs")[0].getElementsByTagName("swf")[0].getAttribute("kb")	// keyboard
			}
		]
	};
	o = vDataNode.getElementsByTagName("parameters")[0].getElementsByTagName("parameter");
	this.mParameterList = {};
	for (i = 0; i < o.length; i++)
		this.mParameterList[o[i].getAttribute("name")] = o[i].getAttribute("value");
	
	
	
}

// -------------------------------------------------------------------------------------------------
//	pData
// -------------------------------------------------------------------------------------------------
cWidgetObj.prototype.pData = function(
	v
)
{
	var vThis, o, i;
	vThis = this;
	
	// 1, format mData
	vThis.mData = {};
	vThis.mData["ID"] = vThis.mID;
	vThis.mData["USER_ENABLED"] = vThis.mEnabled;
	vThis.mData["USER_UPDATEINTERVAL"] = vThis.mUpdateInterval;
	vThis.mData["USER_ONLYSHOWNEWEVENT"] = vThis.mOnlyShowNewEvent;
	
	// 2, return mData
	if (v == undefined) return vThis.mData;
	
	// 3, apply/cast mData from v
	if (v["USER_ENABLED"] != undefined)
		vThis.mEnabled = v["USER_ENABLED"];
	if (v["USER_UPDATEINTERVAL"])
		vThis.mUpdateInterval = v["USER_UPDATEINTERVAL"];
	if (v["USER_ONLYSHOWNEWEVENT"] != null)
		vThis.mOnlyShowNewEvent = v["USER_ONLYSHOWNEWEVENT"];
}







// -------------------------------------------------------------------------------------------------
//	properties
// -------------------------------------------------------------------------------------------------
cWidgetObj.prototype.pIsFLASH = function(
)
{
	return this.mWidget.mMovie.mContentType.toLowerCase().indexOf("flash") > -1;
}

cWidgetObj.prototype.pIsHTML = function(
)
{
	if (this.mPeerWidget && this.mPeerWidget.mHref)
		return true;
	return this.mWidget.mMovie.mContentType.toLowerCase().indexOf("html") > -1;
}

cWidgetObj.prototype.pPeerWidgetHref = function(
)
{
	if (this.mPeerWidget && this.mPeerWidget.mHref)
		return this.mPeerWidget.mHref;
	return this.mWidget.mMovie.mHref;
}

cWidgetObj.prototype.pNeTVCompatiable = function(
	v
)
{
	if (!v)
		return this.mNeTVCompatiable ? true : false;
	
	if (v == true || v == false)
		this.mNeTVCompatiable = v;
}

cWidgetObj.prototype.pEnabled = function(
	v
)
{
	if (v == undefined)
		return this.mEnabled ? true : false;
	
	if (v == true || v == false)
		this.mEnabled = v;
}

cWidgetObj.prototype.pOnlyShowNewEvent = function(
	v
)
{
	if (v == undefined)
		return this.mOnlyShowNewEvent ? true : false;
	
	if (v == true || v == false)
		this.mOnlyShowNewEvent = v;
}


cWidgetObj.prototype.pEventDisplayCount = function(
	v
)
{
	if (v == undefined)
		return this.mEventDisplayCount ? true : false;
	
	if (v == true || v == false)
		this.mEventDisplayCount = v;
}
