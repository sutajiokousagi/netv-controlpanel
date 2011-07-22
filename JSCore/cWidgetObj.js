// -------------------------------------------------------------------------------------------------
//	cWidgetObj class
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
function cWidgetObj(
	vDataNode		// xml node
)
{
	this.mHref = "";
	this.mId = "";
	this.mName = "";
	this.mWidget = {
		mId : "",
		mName : "",
		mDescription : "",
		mVersion : "",
		mMode : {
			mMode : "",
			mTime : 30
		},
		mAccess : {
			mAccess : "",
			mDeleteable : "",
			mSendable : "",
			mVirtualable : ""
		},
		mUser : {
			mUserName : ""
		},
		mCategory : {
			mId : "",
			mName : "",
			mHref : ""
		},
		mThumbnail : {
			mContentType : "",
			mHref : ""
		},
		mTemplate : {
			mContentType : "",
			mHref : ""
		},
		mMovie : {
			mContentType : "",
			mHref : ""
		},
		mRating : {
			mRating : "",
			mCount : ""
		}
	};
	this.mAccess = {
		mAccess : ""
	};
	this.mMode = {
		mMode : "",
		mTime : null
	};
	this.mWidgetParameters = {
	};
	this.mRating = {
		mRating : null
	}


	if (!vDataNode)
		return;


	// parse vDataNode
	this.mHref = vDataNode.getAttribute("href");
	this.mId = vDataNode.getAttribute("id");
	this.mName = vDataNode.getElementsByTagName("name")[0].textContent;
	this.mWidget = {
		mId : vDataNode.getElementsByTagName("widget")[0].getAttribute("id"),
		mName : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("name")[0].textContent,
		mDescription : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("description")[0].textContent,
		mVersion : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("version")[0].textContent,
		mMode : {
			mMode : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("mode")[0].getAttribute("name"),
			mTime : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("mode")[0].getAttribute("time")
		},
		mAccess : {
			mAccess : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("access")[0].getAttribute("access"),
			mDeleteable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("access")[0].getAttribute("deleteable"),
			mSendable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("access")[0].getAttribute("sendable"),
			mVirtualable : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("access")[0].getAttribute("virtualable")
		},
		mUser : {
			mUserName : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("user")[0].getAttribute("username")
		},
		mCategory : {
			mId : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("category")[0].getAttribute("id"),
			mName : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("category")[0].getAttribute("name"),
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("category")[0].getAttribute("href")
		},
		mThumbnail : {
			mContentType : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("thumbnail")[0].getAttribute("contenttype"),
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("thumbnail")[0].getAttribute("href")
		},
		mTemplate : {
			mContentType : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("template")[0].getAttribute("contenttype"),
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("template")[0].getAttribute("href")
		},
		mMovie : {
			mContentType : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("movie")[0].getAttribute("contenttype"),
			mHref : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("movie")[0].getAttribute("href")
		},
		mRating : {
			mRating : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("rating")[0].getAttribute("rating"),
			mCount : vDataNode.getElementsByTagName("widget")[0].getElementsByTagName("rating")[0].getAttribute("count")
		}
	};
	this.mAccess = {
		mAccess : vDataNode.getElementsByTagName("access")[0].getAttribute("access")
	};
	this.mMode = {
		mMode : vDataNode.getElementsByTagName("mode")[0].getAttribute("mode"),
		mTime : vDataNode.getElementsByTagName("mode")[0].getAttribute("time")
	};
	this.mWidgetParameters = {
	};
	this.mRating = {
		mRating : vDataNode.getElementsByTagName("rating")[0].getAttribute("rating")
	}


	// local/temp variables
	this.mLocalThumbnailPath = "";
	
}
