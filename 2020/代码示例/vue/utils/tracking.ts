import {
	IJcq_pushPageInfo,
	IJcq_pushPageName,
	IJcq_push,
} from "@/types/tracking";

export function _jcqInfo(obj: IJcq_pushPageInfo) {
	window._jcq.push([
		"_profile",
		{
			openid: obj.openid, //微信用户id
			unionid: obj.unionid, //微信unionid
			nickname: obj.nickname, //昵称
			wxgender: obj.wxgender, //性别
			wxcity: obj.wxcity, //微信设置城市
			wxprovince: obj.wxprovince, //微信设置省份
			wxcountry: obj.wxcountry, //微信设置国家
			avatarurl: obj.avatarurl, //头像url
		},
	]);
}

export function _jcqPage(pageName: IJcq_pushPageName) {
	window._jcq.push(["_track", "Page", { title: pageName }]);
}

export function _jcq(eventName: IJcq_push) {
	window._jcq.push(["_track", eventName]);
}
