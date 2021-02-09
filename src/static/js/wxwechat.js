export let wxwechat = function () {
	const href = "https://www.microv2v.com";
	let MEMBERINFO_URL = href + "/doublev2v-crm-v2-web-shopping-guide/api/v1/assistant/memberInfo";
	let WECHAT_LOG_URL = href + "/doublev2v-crm-v2-wechat/wxcp/self/getExternalContact";
	let loca = location.href.split('#')[0];
	let storage = window.localStorage;
	let organizationId = storage.organizationId;
	// let HOST_URL = href + "/doublev2v-crm-v2-web-shopping-guide"; //测试服务器
	let HOST_URL = href + "/doublev2v-crm-v2-web-shopping-guide"; //正式服务器（本地测试）
	// 微信扫一扫
	$.ajax({
		type: "post",
		url: HOST_URL + "/api/v1/assistant/my/getWxMpParameter",
		data: {
			"url": loca
		},
		dataType: "json",
		success: function (data) {
			var info = data.data;
			var nonce = info.random;
			var corpId = info.appId;
			var timestamp = info.timestamp;
			var signature = info.signature;
			var jslist = ['scanQRCode'];
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: corpId, // 必填，公众号的唯一标识
				timestamp: timestamp, // 必填，生成签名的时间戳
				nonceStr: nonce, // 必填，生成签名的随机串
				signature: signature, // 必填，签名
				jsApiList: jslist // 必填，需要使用的JS接口列表
			});
		},
		error: function (data) {
			console.log(data);
		}
	});
	wx.checkJsApi({
		jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
		success: function (res) {
			// 以键值对的形式返回，可用的api值true，不可用为false
			// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
			// alert(res.errMsg);
			// alert(res.checkResult.scanQRCode);
			console.log(res.errMsg);
		}
	});

}
