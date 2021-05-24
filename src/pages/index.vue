<template>
  <div id="index_home_Main">
    <div class="index_Main">
      <!-- banner -->
      <div id="banner" class="backgroundCom" style="background: #facd4e;">
        <!-- <div class="bannerText">
          <marquee>您好！7月1-5日系统维护升级，此期间“会员积分/电子券”暂时无法使用，很抱歉给您带来不便，预计7月6日恢复使用！</marquee>
        </div>-->
        <div class="bannerImg">
          <img src="../static/image/index_banner.png" alt />
        </div>
        <div class="bannerModule">
          <ul>
            <li>
              <p>昨日销售</p>
              <p>{{ bannerData.yesterdaySale ? bannerData.yesterdaySale : '0'}}</p>
            </li>
            <li>|</li>
            <li>
              <p>本月销售</p>
              <p>{{ bannerData.monthSale ? bannerData.monthSale : '0'}}</p>
            </li>
            <!-- <li style="opacity: 0;">|</li>
            <li style="opacity: 0;">
              <p>昨日佣金</p>
              <p>{{ bannerData.yesterdayCommission == null ? '0' : bannerData.yesterdayCommission }}</p>
              <p>\</p>
            </li> -->
            <!-- <li>|</li>
            <li>
              <p>累计佣金</p>
              <p>{{ bannerData.allCommission == null ? '0' : bannerData.allCommission }}</p>
              <p>\</p>
            </li> -->
          </ul>
        </div>
        <div class="bannerModule-footer">
          <ul>
            <li>
              <p>昨日预估佣金
                <van-icon name="question" @click="goMoneyDetail('D')" />
              </p>
              <p>{{ bannerData.commission_D ? bannerData.commission_D : '0' }}</p>
            </li>
            <li>|</li>
            <li>
              <p>本月预估佣金
                <van-icon name="question" @click="goMoneyDetail('M')" />
              </p>
              <p>{{ bannerData.commission_M ? bannerData.commission_M : '0'}}</p>
            </li>
            <li>|</li>
            <li>
              <p>上月佣金
                <van-icon name="question" @click="goMoneyDetail('LM')" />
              </p>
              <p>{{ bannerData.commission_LM ? bannerData.commission_LM : '0' }}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- workbench -->
      <div id="workbench" class="backgroundCom" v-if="workbenchList.length > 0">
        <div class="leftLine">
          <div class="workbench_title">工作台</div>
          <ul class="workbench_ul">
            <li class="workbench_ul_li" v-for="item in workbenchList" :name="item.applicationName" :key="item.id"
              :id="item.appId" @click.stop="workbenchEvent($event, item.code)">
              <img v-lazy="imgURL + item.applicationLogo" alt class="_ulImg" />
              <div class="workbench_ul_name">{{ item.applicationName }}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- dataCenter -->
      <div id="dataCenter" class="backgroundCom" v-if="dataCenterList.length > 0">
        <div class="leftLine">
          <div class="workbench_title dataCenter_title">数据中心</div>
          <ul class="dataCenter_ul">
            <li v-for="item in dataCenterList" :name="item.applicationName" :key="item.id" :id="item.appId"
              @click.stop="dataCenter($event, item.code)">
              <img v-lazy="imgURL + item.applicationLogo" alt class="_ulImg" />
              <div class="workbench_ul_name">{{ item.applicationName }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer_btn">
      <Footer :index_leftV="tab_left" :mine_LeftV="mine_Left"></Footer>
    </div>
  </div>
</template>

<script>
  import {
    Button
  } from "vant";
  import {
    Toast
  } from "mint-ui";
  import Footer from "./minePages/setup/index_home";
  export default {
    name: "index",
    components: {
      Footer,
    },
    data() {
      return {
        // 导购id
        MEMBERID: this.$route.query.id ?
          this.$route.query.id : this.GLOBAL.MEMBERID,
        imgURL: this.GLOBAL.imgURL,
        baseFormalURL: this.GLOBAL.baseFormalURL,
        // 工作台
        workbenchList: [],
        // 数据中心
        dataCenterList: [],
        tab_left: true,
        mine_Left: false,
        isFirstEnter: false,
        //首页销售数据
        bannerData: {},
      };
    },

    beforeRouteEnter(to, from, next) {
      if (from.name != "mine" && from.name != "login" && from.name != null) {
        //非第一次进入index进入该判断
        to.meta.isBack = true;
        window.sessionStorage.removeItem('dateType')
      }
      next();
    },

    created() {
      this.isFirstEnter = true;
    },
    activated() {
      if (localStorage.getItem("user")) {
        if (!this.$route.meta.isBack || this.isFirstEnter) {
          let user = localStorage.getItem("user");
          this.MEMBERID = user.replace(/\"/g, "");
          this.getSales();
          this.workbench(this.MEMBERID);
        }
        this.$route.meta.isBack = false;
        this.isFirstEnter = false;
      } else {
        this.$router.replace({
          path: "/login",
        });
      }
    },

    methods: {
      /*
       * 获得首页销售,佣金数据
       */
      getSales() {
        const that = this;
        that.$api.post(
          "/my/getSales", {
            guideId: that.MEMBERID,
          },
          function(res) {
            // console.log('获取首页的销售数据', res.data);
            that.bannerData = res.data;
          },
          function(err) {
            console.log(err);
          }
        );
      },
      /**
       * 去佣金数据详情
       */
      goMoneyDetail(dateType) {
        window.sessionStorage.setItem('dateType',dateType)
        this.$router.push({
          name: 'moneyDetail'
        })
      },

      /**
       * 获取首页数据
       */
      workbench(id) {
        const that = this;
        that.workbenchList.length = 0;
        that.dataCenterList.length = 0;
        that.$api.post(
          "my/permissions", {
            requestName: id,
            guideId: id,
          },
          function(res) {
            // console.table(res.data);
            const dataList = res.data;
            dataList.forEach(function(item) {
              // 区分工作台/数据中心
              if (item.status == 0) {
                that.workbenchList.push(item);
              } else {
                that.dataCenterList.push(item);
              }
            });
          },
          function(err) {
            console.log(err);
          }
        );
      },

      /**
       * 访问次数
       */
      visitTimes(code) {
        const that = this;
        that.$api.post(
          "my/accesslog", {
            guideId: that.MEMBERID,
            code: code,
          },
          function(res) {
            // console.log(res);
          },
          function(err) {
            // console.log(err);
          }
        );
      },

      /**
       * 工作台数据
       */
      workbenchEvent($event, code) {
        const that = this;
        let id = code.replace(/(^\s*)|(\s*$)/g, "");
        that.visitTimes(id);
        switch (id) {
          case "001":
            that.$router.push({
              path: "memberListScreening",
              query: {
                state: "0",
              },
            });
            break;
          case "002":
            // window.location.href = that.baseFormalURL + "invite.html?user=" + that.MEMBERID;
            // that.$router.push({
            // 	path: 'classification_index',
            // 	query: {
            // 		user: that.MEMBERID
            // 	}
            // });
            that.$router.push({
              path: "classInvite",
              query: {
                user: that.MEMBERID,
              },
            });
            break;
          case "003":
            //window.location.href = that.baseFormalURL + 'OnlineCash.html?user=' + that.MEMBERID;
            that.$router.push({
              path: "onlineWithdrawal"
            });
            break;
          case "004":
            window.location.href =
              that.baseFormalURL + "grabOneOrder_wait.html?user=" + that.MEMBERID;
            break;
          case "005":
            //window.location.href = that.baseFormalURL + 'cardLogout.html?user=' + that.MEMBERID;
            that.$router.push({
              path: "cardLogout"
            });
            break;
          case "006":
            //window.location.href = that.baseFormalURL + 'cardIssue.html?user=' + that.MEMBERID + '&from=0';
            that.$router.push({
              path: "cardIssue"
            });
            break;
          case "015":
            that.$router.push({
              path: "memberListScreening",
              query: {
                state: "1",
              },
            });
            break;
          case "018":
            that.$router.push({
              path: "pendingMember",
            });
            break;
        }
      },

      /**
       * 数据中心数据
       */
      dataCenter($event, code) {
        const that = this;
        let id = code.replace(/(^\s*)|(\s*$)/g, "");
        that.visitTimes(id);
        switch (id) {
          case "007":
            window.location.href =
              that.baseFormalURL + "OnlineCommission.html?user=" + that.MEMBERID;
            //that.$router.push({path: 'onlineCommission'})
            break;
          case "008":
            that.$router.push({
              name: "orderManagement",
              query: {
                index: "0",
              },
            });
            break;
          case "009":
            // window.location.href =
            //   that.baseFormalURL + "myPerformance.html?user=" + that.MEMBERID;
            that.$router.push({
              path: 'performance'
            })
            break;
          case "010":
            window.location.href =
              that.baseFormalURL +
              "ShoppingGuideRanking.html?user=" +
              that.MEMBERID;
            //that.$router.push({path: 'ShoppersRanking'})
            break;
          case "011":
            window.location.href =
              that.baseFormalURL + "productAnalysis.html?user=" + that.MEMBERID;
            //that.$router.push({path: 'commodityAnalysis'})
            break;
          case "012":
            window.location.href =
              that.baseFormalURL + "memberAnalysis.html?user=" + that.MEMBERID;
            //that.$router.push({path: 'memberAnalysis'})
            break;
          case "013":
            window.location.href =
              that.baseFormalURL + "StoreManagement.html?user=" + that.MEMBERID;
            //that.$router.push({path: 'storeManagement'})
            break;
          case "014":
            //待确定
            break;
          case "016":
            that.$router.push({
              name: "allMembers",
              params: {
                compMember: "016",
              },
            });
            break;
          case "017":
            that.$router.push({
              name: "allMembers",
              params: {
                compMember: "017",
              },
            });
            break;
          case "019":
            that.$router.push({
              name: 'areaManage',
              params: {
                compMember: "019",
              },
            })
            break;
        }
      },
    },
  };
</script>

<style lang="scss">
  @import "../style/scss/index_home";
</style>
