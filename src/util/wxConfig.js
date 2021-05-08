//微信注册
export async function WxRegistered(info) {
  const jsApiList = [
    "selectExternalContact",
    "openEnterpriseChat",
    "setClipboardData",
    "getCurExternalContact",
    "launchMiniprogram"
  ]
  return new Promise((resolve, reject) => {
    // wx.config({
    //   beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    //   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   appId: info.corpId, // 必填，企业微信的corpID
    //   timestamp: info.timestamp, // 必填，生成签名的时间戳
    //   nonceStr: info.random, // 必填，生成签名的随机串
    //   signature: info.signature, // 必填，签名，见附录1
    //   jsApiList, // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // })
    // wx.ready(function() {
    //   wx.agentConfig({
    //     corpid: info.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
    //     agentid: info.agentId, // 必填，企业微信的应用id （e.g. 1000247）
    //     timestamp: info.timestamp, // 必填，生成签名的时间戳
    //     nonceStr: info.random, // 必填，生成签名的随机串
    //     signature: info.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
    //     jsApiList, //必填,需要使用的JS接口列表,所有JS接口列表见附录2
    //     success: function(res) {
    //       resolve(res)
    //     },
    //     fail: function(res) {
    //       console.log(res)
    //       if (res.errMsg.indexOf('function not exist') > -1) {
    //         alert('版本过低请升级')
    //       }
    //       reject(res)
    //     }
    //   })
    // });
    // wx.error(function(res) {
    //   console.log(res)
    //   reject(res)
    // });
    wx.agentConfig({
      corpid: info.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: info.agentId, // 必填，企业微信的应用id （e.g. 1000247）
      timestamp: info.timestamp, // 必填，生成签名的时间戳
      nonceStr: info.random, // 必填，生成签名的随机串
      signature: info.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList, //必填,需要使用的JS接口列表,所有JS接口列表见附录2
      success: function(res) {
        resolve(res)
      },
      fail: function(res) {
        // console.log(res)
        if (res.errMsg.indexOf('function not exist') > -1) {
          alert('版本过低请升级')
        }
        reject(res)
      }
    })
  })
}
