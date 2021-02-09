<template>
  <div class="container_coupon">
    <!-- <div class="dialog" v-show="isAllType" @click="hide">
      <ol class="coupons_select">
        <li class="coupons_type">
          <div
            class="typ"
            :value="item.code"
            v-for="(item,index) in couponType"
            @click="typ"
            :key="index"
          >{{item.name}}</div>
        </li>
      </ol>
    </div>
    <div class="dialog_status" v-show="isAllStatus" @click="hide">
      <ol class="coupons_select">
        <li class="coupons_status">
          <div
            class="sta"
            :value="item.status"
            v-for="(item,index) in couponStatus"
            @click="sta"
            :key="index"
          >{{item.name}}</div>
        </li>
      </ol>
    </div>
    <ul class="coupons">
      <li class="allType" @click="allType">{{type}}</li>
      <li class="allStatus" @click="allStatus">{{status}}</li>
    </ul>-->
    <ul class="toggle">
      <li>
        <mt-button :type="pageButton" @click.native="initData();getPage()">优惠券</mt-button>
      </li>
      <li>
        <mt-button :type="membercardButton" @click.native="getMemberCard">爱慕礼卡</mt-button>
      </li>
    </ul>
    <!-- 优惠券的列表 -->
    <div class="ScrollBox" ref="homePage" v-if="isCoupon">
      <scroll ref="pullrefresh" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="couponList" :isDone="isDataNotFinish">
        <ul class="couponsList">
          <li :style="{backgroundImage: 'url(' + bgImg  + ')'}" v-for="(item,idx) in page" :key="idx" :class="item.status==4||item.status==7?ban_li:''" @click="details(idx)">
            <img src="../../../../static/image/used.png" alt class="icon" v-if="item.status =='4'" />
            <img src="../../../../static/image/Expired.png" alt class="icon" v-if="item.status =='7'" />
            <div class="memberCard-item-left">
              <span class="cardType" :class="item.name.length>15?'autoWidth':''">{{item.name}}</span>
              <p class="cardCode">卡券券码：{{item.code}}</p>
              <p class="cardDate">使用期限：{{item.startTime | modTime}}~{{item.endTime | modTime}}</p>
            </div>
            <div class="memberCard-item-right">
              <!--<h1 class="cardEffect">满1000元使用</h1>-->
              <p class="cardDiscount" v-if="item.typeCode =='000'">¥{{item.value}}</p>
              <p class="cardDiscount" v-if="item.typeCode =='001'">{{item.value}}折</p>
              <p class="cardDiscount paddingtop" v-if="item.typeCode =='002'">{{item.typename}}</p>
              <p class="cardFeature" v-if="item.payOver!=null&&item.typeCode =='000'">满{{item.payOver}}元使用</p>
              <p class="cardFeature" v-if="item.payOver!=null&&item.typeCode =='001'">满{{item.payOver}}使用</p>
              <p class="cardFeature" v-if="item.payOver==null&&item.typeCode =='000'||item.payOver==null&&item.typeCode =='001'">无门槛</p>
              <!--<p class="cardFeature" v-if='item.payOver!=null||item.payOver!=""'>{{item.payOver}}</p>-->
              <p class="cardFeature" v-if="item.useRange==0">通用</p>
              <p class="cardFeature" v-if="item.useRange==1">线上</p>
              <p class="cardFeature" v-if="item.useRange==2">线下</p>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <!-- 礼卡列表 -->
    <div class="ScrollBox" ref="homePage" v-if="!isCoupon">
      <scroll ref="pullrefresh" :pullup="isShowScroll" @scrollToEnd="loadCardBottom" :data="noOverMemberCardList">
        <ul class="memberCard-List">
          <li v-for="(item,idx) in cardPage" :key="idx" :class="nowTime > expireTime[idx] || item.surplus_price == '0' ?bancard_li:''">
            <div class="memberCard-box">
              <div class="member-card">
                <div class="card-image">
                  <img src="../../../../static/image/test.png" />
                </div>
                <div class="member-content">
                  <p>爱慕礼卡</p>
                  <p>
                    <span>余额：￥</span>
                    <span>{{item.surplus_price}}</span>
                    <span>/￥{{item.amount}}</span>
                  </p>
                </div>
              </div>
              <div class="memberCard-time">
                <span>已绑定</span>
                <span>&nbsp;|&nbsp;有效期至{{item.expire_time}}</span>
              </div>
            </div>
            <img src="../../../../static/image/used.png" alt class="card_icon" v-if="nowTime < expireTime[idx] && item.surplus_price == '0'" />
            <img src="../../../../static/image/Expired.png" alt class="card_icon" v-if="nowTime > expireTime[idx]" />
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from "../../../../components/scroll";
import { MessageBox, Button, Toast } from "mint-ui";
export default {
  name: "seeMoreCoupon",
  components: {
    scroll,
  },
  data() {
    return {
      pageButton: "default",
      membercardButton: "default",
      param: {
        memberId: "",
        page: "1",
        size: "10",
      },
      membercard_param: {
        //当前会员手机号
        phone: "",
        //页数
        page: 1,
        //条数
        size: 10,
      },
      ban_li: "ban_li",
      bancard_li: "bancard_li",
      bgImg: require("../../../../static/image/yhj.png"),
      couponType: [
        { name: "全部类型", code: "" },
        { name: "现金券", code: "000" },
        { name: "折扣券", code: "001" },
        { name: "礼品券", code: "002" },
      ],
      couponStatus: [
        { status: "", name: "全部状态" },
        { status: "2", name: "未使用" },
        { status: "4", name: "已使用" },
        { status: "7", name: "已过期" },
      ],
      //储存当前显示的优惠券
      page: [],
      //储存当前显示的爱慕礼卡
      cardPage: [],
      //				全部类型显示
      isAllType: false,
      isAllStatus: false,
      status: "全部状态",
      type: "全部类型",
      //				上拉加载参数
      isShowScroll: true,
      isData: false,
      isCardData: false,
      couponList: [],
      clientHeight: "",
      autoWidth: "autoWidth",
      //判断是否为优惠券
      isCoupon: true,
      //未过期爱慕礼卡数组（后将接口中所有礼卡存入此数组）
      noOverMemberCardList: [],
      //当前时间戳
      nowTime: "",
      //过期时间时间戳
      expireTime: [],
      isDataNotFinish:true
    };
  },
  mounted() {
    //获取上个页面参数
    this.getParams();
    //获取优惠券
    this.getPage();
    this.clientHeight = `${document.documentElement.clientHeight}`;
    window.onresize = function () {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  methods: {
    /**
     * 获取参数
     */
    getParams() {
      this.param.memberId = this.$route.query.memberId;
      this.membercard_param.phone = this.$route.query.phone.toString();
    },
    /**
     * 切换优惠券与礼卡时初始化数据
     */
    initData(){
      this.page = []
      this.$set(this.param,'page','1')
    },
    /**
     * 获取优惠券
     */
    getPage() {
      this.pageButton = "primary";
      this.membercardButton = "default";
      this.isCoupon = true;
      this.$api.post(
        "/CardVoucher/findCouponByVip",
        this.param,
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            let coupons = res.data;
            this.couponList = coupons;
            //如果获取数据的值小于10代表请求到最后一页
            if (coupons.length < 10) {
              //this.page小于10意味着当前数据为0
              if (this.page.length < 10) {
                this.page = coupons;
              } else {
                this.page = this.page.concat(coupons);
              }
              //所有数据请求完成终止请求
              this.isDataNotFinish = false
              this.param.page = 0;
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.isDataNotFinish = true
              this.page = this.page.concat(coupons);
              this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
            }
            this.isData = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 到底加载
     */
    loadBottom() {
      const that = this;
      if (!that.isData) {
        if (that.param.page <= 0) {
          return;
        } else {
          that.isData = true;
          that.param.page++;
          this.$refs.pullrefresh.$emit("infinitescroll.reInit");
          that.getPage();
        }
      }
    },
    //上滑加载会员优惠卡
    loadCardBottom() {
      const that = this;
      if (!that.isCardData) {
        if (
          that.membercard_param.page < 0 ||
          that.membercard_param.page == 9999
        ) {
          return;
        } else {
          that.isCardData = true;
          that.membercard_param.page++;
          //上拉加载重新初始化
          this.$refs.pullrefresh.$emit("infinitescroll.reInit");
          that.getMemberCard();
        }
      }
    },
    //获取会员优惠卡
    getMemberCard() {
      this.membercardButton = "primary"
      this.pageButton = "default"
      this.isCoupon = false
      // Toast('该功能维护中');
      //获得当前时间戳
      this.nowTime = Date.now();
      this.$api.post(
        "/CardVoucher/findMemberCard",
        this.membercard_param,
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            this.noOverMemberCardList = res.data;
            //判断礼卡是否过期
            for (let i in res.data) {
              // console.log(res.data[i].expire_time)
              let date = res.data[i].expire_time;
              date = date.substring(0, 19);
              date = date.replace(/-/g, "/");
              let expireGetTime = new Date(date).getTime().toString();
              // this.getTimeAll(expireGetTime)
              this.expireTime.push(expireGetTime);
              // console.log(this.expireTime)
            }
            // console.log(this.expireTime[1])
            // this.overMemberCardList = res.data.over
            // console.log(this.noOverMemberCardList);
            // console.log(this.overMemberCardList)
            if (this.noOverMemberCardList.length < this.membercard_param.size) {
              if (this.cardPage.length < this.membercard_param.size) {
                this.cardPage = this.noOverMemberCardList;
              } else {
                this.cardPage.concat(this.noOverMemberCardList);
              }
              this.membercard_param.page = 0
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.cardPage = this.cardPage.concat(this.noOverMemberCardList);
              this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
            }
            this.isCardData = false
          }
        }
      );
    },
    details(idx) {
      let htmls = ``;
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
        let remark = this.page[idx].couponRemark.split("\n");
        for (let r = 0; r < remark.length; r++) {
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
          }
        });
    },


    // hide() {
    //   this.isAllType = false;
    //   this.isAllStatus = false;
    // },
    // allType(e) {
    //   e.stopPropagation();
    //   this.isAllType = !this.isAllType;
    //   this.isAllStatus = false;
    // },
    // allStatus(e) {
    //   e.stopPropagation();
    //   this.isAllType = false;
    //   this.isAllStatus = !this.isAllStatus;
    // },
    // typ(e) {
    //   this.page.length = "";
    //   this.type = e.target.innerHTML;
    //   this.param.type = e.target.getAttribute("value");
    //   this.param.page = "1";
    //   this.getPage();
    // },
    // sta(e) {
    //   this.page.length = "";
    //   this.status = e.target.innerHTML;
    //   this.param.status = e.target.getAttribute("value");
    //   this.param.page = "1";
    //   this.getPage();
    // },
    /**
     * 旧获取优惠券接口
     */
    // getPage() {
    //   this.pageButton = "primary";
    //   this.membercardButton = "default";
    //   this.param.page = "1";
    //   this.isCoupon = true;
    //   this.param.requestName = this.param.page;
    //   this.$api.post(
    //     "/page",
    //     this.param,
    //     (res) => {
    //       // console.log(res)
    //       if (res.errcode == 0) {
    //         let coupons = res.data;
    //         this.couponList = coupons;
    //         if (coupons.length < 10) {
    //           if (this.page.length < 10) {
    //             this.page = coupons;
    //           } else {
    //             this.page = this.page.concat(coupons);
    //           }
    //           //把page设置成9999 测试数据已经加载完毕了 不用在加载了
    //           this.param.page = "0";
    //           //所有数据加载完毕后
    //           this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
    //         } else {
    //           this.page = this.page.concat(coupons);
    //           //单次请求数据加载完毕后
    //           this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
    //         }
    //         this.isData = false;
    //         console.log(this.page);
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //       let code = err.code;
    //     }
    //   );
    // }
  },
  filters: {
    modTime(data) {
      return data.substr(0, 10);
    },
  },
};
</script>

<style lang="scss">
@import "../../../../style/scss/seeMoreCoupon";
</style>
