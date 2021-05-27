<template>
  <div id="orderManagement">
    <!-- <div class="bannerText">
      <marquee>
        6-8号云客服通知提示：三八大促期间，会员订单改为次日统一推送
      </marquee>
    </div>-->
    <div class="search">
      <input type="text" placeholder="请输入订单编号/会员手机号码/会员卡号搜索" v-model="searchTxt_no" />
      <img src="../../../static/image/close.png" alt="" :style="searchCss" @click="clearText" />
      <span @click="searchOrderBtn">搜索</span>
    </div>
    <div class="button-top">
      <mt-button type="default" :style="topButCss" :class="{ isSelected: selectButton == 1 }" @click="chooseOrder(1)">
        绑定订单</mt-button>
      <mt-button type="default" :style="topButCss" :class="{ isSelected: selectButton == 4 }" @click="chooseOrder(4)">
        推广订单</mt-button>
      <mt-button type="default" :style="topButCss" :class="{ isSelected: selectButton == 3 }" @click="chooseOrder(3)">
        代客订单</mt-button>
    </div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1" :class="searchBtn && status == '' ? 'is-selected' : ''">
        <div @click.stop="allOrder()">全部</div>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click.stop="payment()">待付款</div>
      </mt-tab-item>
      <mt-tab-item id="3">
        <div @click.stop="deliver()">待发货</div>
      </mt-tab-item>
      <mt-tab-item id="4">
        <div @click.stop="putGood()">待收货</div>
      </mt-tab-item>
      <mt-tab-item id="5">
        <div @click.stop="waitEvaluate()">待评价</div>
      </mt-tab-item>
    </mt-navbar>
    <div class="mint-tab-container" ref="homePage">
      <myAllOrder ref="myAllOrder" :searchTxtFar="searchTxt" :isBack="isBack" :OrderTypeN="orderType"
        v-if="selected == '1'"></myAllOrder>
      <pendingOrder :searchTxtFar="searchTxt" :OrderTypeN="orderType" v-if="selected == '2'"></pendingOrder>
      <pendingShipments :searchTxtFar="searchTxt" :OrderTypeN="orderType" v-if="selected == '3'"></pendingShipments>
      <pendingReceiving :searchTxtFar="searchTxt" :OrderTypeN="orderType" v-if="selected == '4'"></pendingReceiving>
      <pendingEvaluate :searchTxtFar="searchTxt" :OrderTypeN="orderType" v-if="selected == '5'"></pendingEvaluate>
      <searchOrder :searchTxtFar="searchTxt" @getOrderType="getOrderType" v-if="searchBtn && selected == '6'">
      </searchOrder>
    </div>
  </div>
</template>

<script>
  import myAllOrder from "./orderComponent/myAllOrder";
  import pendingOrder from "./orderComponent/pendingOrder";
  import pendingShipments from "./orderComponent/pendingShipments";
  import pendingReceiving from "./orderComponent/pendingReceiving";
  import pendingEvaluate from "./orderComponent/pendingEvaluate";
  import searchOrder from "./orderComponent/searchOrder";

  export default {
    name: "orderManagement",
    components: {
      myAllOrder,
      pendingOrder,
      pendingShipments,
      pendingReceiving,
      pendingEvaluate,
      searchOrder,
    },
    props: ["searchTxtFar"],
    data() {
      return {
        selected: "1",
        page: 1,
        //  搜索内容
        searchTxt: "",
        // 搜索按钮
        searchBtn: "",
        // 状态
        status: "",
        //  输入框内容
        searchTxt_no: "",
        // 可视窗口高度
        clientHeight: "",
        // 是否第一次进入，默认false
        isFirstEnter: false,
        isBack: false,
        selectButton: 1,
        orderType: 1,
        topButCss: 'width: 3rem; height: 0.8rem; font-size: 0.4rem',
        searchCss: 'width: 0.25rem; position: relative; right: 0.5rem; opacity: 0.5'
      };
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == "index") {
        to.meta.isBack = false;
      } else {
        to.meta.isBack = true;
      }
      next();
    },
    created() {
      this.isFirstEnter = true;
    },
    activated() {
      if (this.$route.meta.isBack || this.isFirstEnter) {
        this.$refs.myAllOrder.myOrderList = [];
        this.$refs.myAllOrder.page = 1;
        // this.$refs.myAllOrder.allOrderMoreData();
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    mounted() {
      const that = this;
      // 获取浏览器可视区域高度
      that.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
      window.onresize = function() {
        that.clientHeight = `${document.documentElement.clientHeight}`;
      };
    },
    watch: {
      clientHeight() {
        this.changeFixed(this.clientHeight);
      },
    },
    methods: {
      //获取查询数据的类型
      getOrderType(type) {
        this.selectButton = type;
        this.status = "";
        this.orderType = type
      },
      /**
       * 选择普通订单还是代客订单
       */
      chooseOrder(type) {
        // console.log(type);
        this.selectButton = type;
        this.selected = "1";
        this.status = "";
        this.orderType = type
      },
      // 全部
      allOrder() {
        this.selected = "1";
        this.status = "";
      },
      //  待付款
      payment() {
        this.selected = "2";
        this.status = "001";
      },
      //  待发货
      deliver() {
        this.selected = "3";
        this.status = "002";
      },
      //  待收货
      putGood() {
        this.selected = "4";
        this.status = "003";
      },
      //  待评价
      waitEvaluate() {
        this.selected = "5";
        this.status = "004";
      },
      /**
       * 清除用户搜索输入
       */
      clearText() {
        this.searchTxt_no = "";
        this.searchTxt = ''
      },
      /**
       * 搜索
       */
      searchOrderBtn() {
        if (this.searchTxt_no.length == 0) return false
        this.searchBtn = true;
        this.selected = "6";
        this.status = "";
        this.searchTxt = this.searchTxt_no;
      },

      //动态修改样式
      changeFixed(clientHeight) {
        if (document.querySelector('.mint-navbar') && document.querySelector('.search') && document.querySelector(
            '.button-top')) {
          let height_ =
            document.querySelector('.mint-navbar').offsetHeight +
            document.querySelector('.search').offsetHeight +
            document.querySelector('.button-top').offsetHeight +
            60;
          this.$refs.homePage.style.height = clientHeight - height_ + "px";
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../../../style/scss/orderManagement";
</style>
