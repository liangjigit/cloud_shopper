import Vue from 'vue'
export let wechat = function () {
	// const href = "https://www.microv2v.com"; //正式服务器（本地测试）
	const href = "http://ykftest.aimergroup.com:8081";
	let MEMBERINFO_URL = href + "/doublev2v-crm-v2-web-shopping-guide/api/v1/assistant/memberInfo";
	let WECHAT_LOG_URL = href + "/doublev2v-crm-v2-wechat/wxcp/self/getExternalContact";
	let loca = location.href.split('#')[0];
	let memberids = location.href.split('=')[2];
	if (memberids != undefined) {
		var guideid = location.href.split('=')[3];
		var memberid = memberids.split('&')[0];
	}
	let storage = window.localStorage;
	let organizationId = storage.organizationId;
	let HOST_URL = href + "/doublev2v-crm-v2-web-shopping-guide"; //测试服务器
	//	const HOST_URL = "https://www.doublev2v.com/doublev2v-crm-v2-web-shopping-guide"; //正式服务器（本地测试）
	// 企业微信扫一扫
	$.ajax({
		type: "post",
		url: HOST_URL + "/api/v1/assistant/my/getCpParameter",
		dataType: "json",
		data: {
			"organizationId": organizationId,
			"url": loca
		},
		success: function (data) {
			const info = data.data;
			//获取签名
			const jsList = ['selectExternalContact', 'openEnterpriseChat', 'setClipboardData'];
			wx.config({
				beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: info.corpId, // 必填，企业微信的corpID
				timestamp: info.timestamp, // 必填，生成签名的时间戳
				nonceStr: info.random, // 必填，生成签名的随机串
				signature: info.signature, // 必填，签名，见附录1
				jsApiList: jsList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			if (memberids != undefined) {
				rea();
			}

		},
		error: function (data) { }
	});
	// SHA1
	function rea() {
		//外部联系人接口
		$(".memberContact").on('click', '.testButton1', function () {
			wx.invoke('selectExternalContact', {
				"filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
			}, function (res) {
				if (res.err_msg == "selectExternalContact:ok") {
					var userIds = res.userIds; //返回此次选择的外部联系人userId列表，数组类型
					if (userIds.length != 1) {
						alert("只能选取一个联系人");
						return;
					}
					var userId = userIds + "";
					$.ajax({
						type: "get",
						url: WECHAT_LOG_URL,
						dataType: "json",
						data: {
							"memberUserId": userId,
							"memberId": memberid
						},
						success: function (data) {
							if (data.errcode == "0") {
								if ($(".memberContact .testButton2").length == 0) {
									$(".testButton1").remove();
									$(".memberContact .sms").before('<a href="javascript:;" class="wx testButton2">' +
										'<img src="../images/qywx_live.png" alt="" class="sms" />' +
										'<p>企业微信</p></a>');
									$(".memberContact .wx").css("color", "#000");
								}
								conversation(userIds);
							} else if (data.errcode == "100") {
								Vue.prototype.$toast({
									message: "系统异常",
									duration: 3000,
									// confirmButtonText: '确定',
								})
							} else if (data.errcode == "502") {
								Vue.prototype.$toast({
									message: "会员与外部联系人信息不一致，请重新选择",
									duration: 3000,
									// confirmButtonText: '确定',
								})
							}
						},
						error: function () {
							alert('数据请求失败！');
						}
					});
				} else if (res.err_msg == "selectExternalContact:fail") {
					//错误处理
					//alert(res.err_msg)
				}
			});
		})
		//创建会话接口
		function conversation(userIds) {
			var userId = userIds + "";
			wx.openEnterpriseChat({
				externalUserIds: userId,
				groupName: "123",
				success: function (res) {
				},
				fail: function (res) {
					if (res.errMsg.indexOf('function not exist') > -1) {
						alert('版本过低请升级')
					}
				}
			});

		}
		$(".memberContact").on('click', '.testButton2', function () {
			$.ajax({
				type: "get",
				url: MEMBERINFO_URL,
				data: {
					"memberId": memberid
				},
				dataType: "json",
				success: function (data) {
					var info = data.data;
					var cpUserId = info.cpUserId;
					wx.openEnterpriseChat({
						externalUserIds: cpUserId,
						groupName: "123",
						success: function (res) {
							// 回调
							//alert(res.err_msg);
						},
						fail: function (res) {
							if (res.errMsg.indexOf('function not exist') > -1) {
								alert('版本过低请升级')
							}
						}
					});
				}
			})
		})
	}
}
