import { Base64 } from "js-base64";
let sha1 = require("sha1");
import Store from "@/store";

interface ISignatureObj {
	[propName: string]: any;
}

export const createSignature = {
	init(params: ISignatureObj) {
		let s = "xxx";
		var accessToken = Store.getters.getToken || "";

		const new_json = this.toStringSort(params);
		const jsonResult = this.toJoinKAndVal(new_json);
		const jwt = `${Base64.encode(jsonResult)}`;

		const sha1String = accessToken ? accessToken + jwt + s : jwt + s;
		const signature = sha1(sha1String);
		return signature;
	},
	//字符串排序
	toStringSort(obj: ISignatureObj) {
		let arr = new Array();
		let num = 0;
		for (let i in obj) {
			arr[num] = i;
			num++;
		}
		let sortArr = arr.sort();
		var sortObj: ISignatureObj = {};
		for (let i in sortArr) {
			sortObj[sortArr[i]] = obj[sortArr[i]];
		}
		return sortObj;
	},
	// json拼接键值对
	toJoinKAndVal(obj: ISignatureObj) {
		let str = "";
		for (let i in obj) {
			str += i + "=" + obj[i] + "&";
		}
		str = str.replace(/(&*$)/g, "");
		return str;
	},
};
