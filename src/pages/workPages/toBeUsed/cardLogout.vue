<template>
  <div id="cardLogout">
    <div id="cardSubmit">
      <div class="cardIpt">
        <input type="text" name id placeholder="请输入优惠券码" class="cardNum" v-model="code" />
        <div class="wechartS">
          <img src="../../static/image/sao.png" @click="qrcode" />
        </div>
      </div>
      <input type="submit" value="确认核销" class="cardSub" @click="WriteOff()" />
    </div>
    <div class="logoutMain">
      <p class="logoutTit">核销记录({{totalSize}})</p>
      <div class="ScrollBox" ref="homePage">
        <scroll
          ref="pullrefresh"
          :pullup="isShowScroll"
          @scrollToEnd="loadBottom"
          :data="couponList"
        >
          <ul class="couponsList">
            <li v-for="(item,idx) in page" @click="details(idx)" :key="idx">
              <p class="cardInfo">
                <span>
                  <b>{{item.memberName}}</b>
                  （{{item.memberCard}}）
                </span>
                <span>
                  <b>核销日期：</b>
                  {{item.cancelDate}}
                </span>
              </p>
              <div class="card" :style="{backgroundImage: 'url(' + bgImg  + ')'}">
                <img src="../../static/image/used.png" alt class="icon" v-if="item.status =='4'" />
                <img src="../../static/image/Expired.png" alt class="icon" v-if="item.status =='7'" />
                <div class="memberCard-item-left">
                  <span class="cardType" :class="item.name.length>15?'autoWidth':''">{{item.name}}</span>
                  <p class="cardCode">卡券券码：{{item.code}}</p>
                  <p class="cardDate">使用期限：{{item.startTime}}~{{item.endTime}}</p>
                </div>
                <div class="memberCard-item-right">
                  <!--<h1 class="cardEffect">满1000元使用</h1>-->
                  <p class="cardDiscount" v-if="item.typeCode =='000'">¥{{item.value}}</p>
                  <p class="cardDiscount" v-if="item.typeCode =='001'">{{item.value}}折</p>
                  <p class="cardDiscount paddingtop" v-if="item.typeCode =='002'">{{item.typename}}</p>
                  <p
                    class="cardFeature"
                    v-if="item.payOver!=null&&item.typeCode =='000'"
                  >满{{item.payOver}}元使用</p>
                  <p
                    class="cardFeature"
                    v-if="item.payOver!=null&&item.typeCode =='001'"
                  >满{{item.payOver}}使用</p>
                  <p
                    class="cardFeature"
                    v-if="item.payOver==null&&item.typeCode =='000'||item.payOver==null&&item.typeCode =='001'"
                  >无门槛</p>
                  <!--<p class="cardFeature" v-if='item.payOver!=null||item.payOver!=""'>{{item.payOver}}</p>-->
                  <p class="cardFeature" v-if="item.useRange==0">通用</p>
                  <p class="cardFeature" v-if="item.useRange==1">线上</p>
                  <p class="cardFeature" v-if="item.useRange==2">线下</p>
                </div>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
//	import {
//		Toast
//	} from 'mint-ui';
import Scroll from "../../components/scroll";
import { wechat } from "../../static/js/wechat.js"; //注意路径
import { wxwechat } from "../../static/js/wxwechat.js"; //注意路径
import { MessageBox } from "mint-ui";

export default {
  name: "cardLogout",
  components: {
    Scroll,
  },
  data() {
    return {
      param: {
        guideId: "",
        page: "1",
        size: "10",
      },
      code: "",
      page: [],
      bgImg: require("../../static/image/yhj.png"),
      // 上拉加载参数
      isShowScroll: true,
      isData: false,
      couponList: [],
      totalSize: "",
      clientHeight: "",
    };
  },
  created: function () {
    let user = localStorage.getItem("user");
    this.param.guideId = user.replace(/\"/g, "");
  },
  mounted() {
    wxwechat();
    wechat();
    this.getPage();
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    //console.log(self.clientHeight);
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight);
    },
  },
  methods: {
    loadBottom() {
      let that = this;

      if (!that.isData) {
        if (that.param.page < 0 || that.param.page == false) {
          return;
        } else {
          that.isData = true;
          that.param.page++;
          that.param.requestName = that.param.page;
          //上拉加载重新初始化
          this.$refs.pullrefresh.$emit("infinitescroll.reInit");

          that.getPage();
        }
      }
    },
    getPage() {
      this.param.requestName = this.param.page;
      this.$api.post(
        "/my/guideCancelCoupon",
        this.param,
        (res) => {
          if (res.errcode == 0) {
            let coupons = res.data.list;
            this.totalSize = res.data.totalSize;
            this.couponList = coupons;
            if (coupons.length < 10) {
              if (this.page.length < 10) {
                this.page = coupons;
              } else {
                this.page = this.page.concat(coupons);
              }
              //把page设置成false 数据已经加载完毕了 不用在加载了
              this.param.page = false;
              //所有数据加载完毕后
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.page = this.page.concat(coupons);
              //单次请求数据加载完毕后
              this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
            }
            this.isData = false;
            console.log(this.page);
          }
        },
        (err) => {
          console.log(err);
          let code = err.code;
        }
      );
    },
    details(idx) {
      var htmls = ``;
      if (this.page[idx].getLimit == null) {
        htmls += `<p><b>每人限领:</b>不限制</p>`;
      } else {
        htmls += `<p><b>每人限领:</b>` + this.page[idx].getLimit + `张</p>`;
      }
      if (this.page[idx].vipGrade == null) {
        htmls += `<p><b>会员等级:</b>全部</p>`;
      } else {
        htmls += `<p><b>会员等级:</b>` + this.page[idx].vipGrade + `</p>`;
      }
      if (
        this.page[idx].couponRemark == null ||
        this.page[idx].couponRemark == ""
      ) {
        htmls += `<p><b>使用说明:</b>无</p>`;
      } else {
        htmls += `<p><b>使用说明:</b></p>`;
        var remark = this.page[idx].couponRemark.split("\n");
        for (var r = 0; r < remark.length; r++) {
          htmls += `<p>` + remark[r] + `</p>`;
        }
      }
      this.$messagebox
        .alert("", {
          message: htmls,
          title: "提示",
          confirmButtonText: "确定",
        })
        .then((action) => {
          //确认的回调
          if (action == "confirm") {
            console.log("提示完成");
          }
        });
    },
    qrcode() {
      var that = this;
      var ua = window.navigator.userAgent.toLowerCase();
      // alert(ua);
      if (
        ua.match(/MicroMessenger/i) == "micromessenger" &&
        ua.match(/wxwork/i) == "wxwork"
      ) {
        // alert('企业微信扫一扫');
        // 企业微信扫一扫
        wx.scanQRCode({
          desc: "scanQRCode desc",
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            that.code = res.resultStr;
            //					        $(".cardNum").val(res.resultStr)
          },
          error: function (res) {
            console.log(res);
            if (res.errMsg.indexOf("function_not_exist") > 0) {
              alert("版本过低请升级");
            }
          },
        });
      } else if (ua.match(/micromessenger/i) == "micromessenger") {
        // alert('微信扫一扫');
        // 微信扫一扫
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var obj = res.resultStr;
            var index = obj.lastIndexOf(",");
            obj = obj.substring(index + 1, obj.length);
            //  console.log(obj);
            that.code = obj;
          },
          error: function (res) {
            console.log(res);
            if (res.errMsg.indexOf("function_not_exist") > 0) {
              alert("版本过低请升级");
            }
          },
        });
      }
    },
    WriteOff() {
      var code = $(".cardNum").val();
      this.$api.get(
        "/my/cancelCoupon",
        {
          //						guideId: this.param.guideId,
          guideId: this.param.guideId,
          couponCode: code,
        },
        (res) => {
          if (res.errcode == 0) {
            this.toast("核销成功");
          }
        },
        (err) => {
          console.log(err);
          if (err.errcode == 0) {
            this.toast("核销成功");
          } else if (err.errcode == "002") {
            this.toast("组织不存在", 2000);
          } else if (err.errcode == "003") {
            this.toast("券码为空", 2000);
          } else if (err.errcode == "004") {
            this.toast("券码不存在", 2000);
          } else if (err.errcode == "005") {
            this.toast("会员信息为空", 2000);
          } else if (err.errcode == "006") {
            this.toast("该券已使用", 2000);
          } else if (err.errcode == "007") {
            this.toast("该券未领取", 2000);
          } else if (err.errcode == "008") {
            this.toast("该券已过期", 2000);
          } else if (err.errcode == "009") {
            this.toast("该券已停用", 2000);
          }
        }
      );
    },
    // 提示
    toast(message, duration) {
      const that = this;

      that.$toast({
        message: message,
        position: "middle",
        iconClass: "icon icon-success",
        duration: duration,
      });
    },
    changeFixed(clientHeight) {
      //动态修改样式
      console.log(clientHeight);
      this.$refs.homePage.style.height =
        clientHeight -
        $("#cardSubmit").outerHeight(true) -
        $(".logoutTit").outerHeight(true) +
        "px";
    },
  },
};
</script>

<style lang="scss">
@import "../../style/scss/cardLogout";
</style>
