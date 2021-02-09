<template>
  <keep-alive>
    <scroll ref="pullrefresh" :pullup="isShow" @scrollToEnd="loadBottom" :data="orderList" :nullDataAll="nullDataAllLeft" :isDone="isLoading">
      <ul class="orderList">
        <li v-for="item in myOrderList" :key="item.orderId" @click="orderDetail($event)" :id="item.orderId">
          <!-- 订单号/状态 -->
          <div class="orderNumberLine">
            <span class="orderNum">订单号：{{ item.orderNum }}</span><span class="orderStatus">{{ item.orderType }}</span>
          </div>
          <!-- 商品详情 -->
          <div class="order_goods" v-for="itemChild in item.orderMxes" :key="itemChild.orderMxId">
            <img :src="itemChild.goodsSkuPicture ? imgURL + itemChild.goodsSkuPicture : imgCom" alt="" />
            <div class="order_goods_info">
              <div>
                <img class="order_goods_info_img" v-if="item.distributionType == '1'" src="../../../../static/image/logistics.png" alt="" />
                <img class="order_goods_info_img" v-if="item.distributionType == '2'" src="../../../../static/image/logistics_store.png" alt="" />
                <img class="order_goods_info_img" v-if="item.distributionType == '3'" src="../../../../static/image/logistics_city.png" alt="" />
                <p class="order_goods_tit">{{ itemChild.goodsName }}</p>
              </div>
              <p class="order_goods_sku">
                <span class="title" v-if="itemChild.specificationOneName">{{ itemChild.specificationOneName }}：</span>
                <span class="value" v-if="itemChild.specificationOneCode">{{ itemChild.specificationOneCode ? itemChild.specificationOneCode : "" }}</span>
                &nbsp;&nbsp;
                <span class="title" v-if="itemChild.specificationTwoName">{{ itemChild.specificationTwoName }}：</span>
                <span class="value" v-if="itemChild.specificationTwoCode">{{ itemChild.specificationTwoCode }}</span>
                &nbsp;&nbsp;
                <span class="title" v-if="itemChild.specificationThreeName">{{ itemChild.specificationThreeName }}：</span>
                <span class="value" v-if="itemChild.specificationThreeeCode">{{ itemChild.specificationThreeeCode }}</span>
              </p>
              <p class="price">
                ￥{{ itemChild.price }} <span>x{{ itemChild.count }}</span>
              </p>
            </div>
          </div>
          <!-- 总计 -->
          <div class="aggregate">
            <p>
              合计：<span>￥{{ item.discountPrice }}</span>&nbsp;（含运费￥{{ item.postage }}）
            </p>
          </div>
          <!-- 佣金 -->
          <div class="commission">
            <p>
              佣金：￥{{ item.commissionPrice }}&nbsp;&nbsp;<span>{{ item.createTime }}</span>
            </p>
          </div>
        </li>
      </ul>
    </scroll>
  </keep-alive>
</template>

<script>
import scroll from "../../../../components/scroll";

export default {
  name: "myAllOrder",
  props: {
    searchTxtFar: {
      type: String,
      default: false,
    },
    isBack: {
      type: Boolean,
      default: false,
    },
    OrderTypeN: {
      type: Number,
      default: 1,
    },
  },
  components: { scroll },
  data() {
    return {
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      // 图片地址
      imgURL: this.GLOBAL.imgURL,
      imgCom: require("../../../../static/image/zhanwei.png"),
      page: 1,
      // 全部数据
      myOrderList: [],
      // 每次获取的数据
      orderList: [],
      // 是否上拉
      isShow: true,
      // 重复加载
      isData: false,
      // 提示语
      isLoading: true,
      nullDataAllLeft: false,
    };
  },
  created() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");
  },
  mounted() {
    //初次访问查询列表
    this.allOrderMoreData();
  },

  watch: {
    searchTxtFar(val) {
      this.page = 1;
      this.myOrderList = [];
      this.allOrderMoreData();
    },

    isBack(val) {
      this.page = 1;
      this.myOrderList = [];
      this.allOrderMoreData();
    },

    OrderTypeN(val) {
      this.page = 1;
      this.myOrderList = [];
      this.allOrderMoreData();
    },
  },
  methods: {
    // 订单数据
    allOrderMoreData() {
      const that = this
      let listData = []
      that.$api.get(
        "Myorder",
        {
          guideId: that.MEMBERID,
          orderState: "",
          keywords: that.searchTxtFar,
          size: 10,
          page: that.page,
          type: that.OrderTypeN,
        },
        (res) => {
          // console.log(res.data)
          const list = res.data
          this.orderList = list
          listData = listData.concat(list)
          if (list.length < 10 && list.length != 0) {
            that.isLoading = false;
            that.myOrderList = that.myOrderList.concat(listData);
            this.page = 0;
            this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
          } else {
            that.isLoading = true;
            that.myOrderList = that.myOrderList.concat(listData);
            this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
          }
          if (that.myOrderList.length == 0) {
            that.nullDataAllLeft = true;
          } else {
            that.nullDataAllLeft = false;
          }
          that.isData = false;
        },
        (err) => {
          console.log(err)
        }
      );
    },
    // 全部
    loadBottom() {
      const that = this;
      if (!that.isData) {
        if (that.page == 0) {
          return;
        } else {
          that.isData = true;
          that.nullDataLight = false;
          that.page++;
          this.$refs.pullrefresh.$emit("infinitescroll.reInit");
          setTimeout(function () {
            that.allOrderMoreData();
          }, 500);
        }
      }
    },
    /**
     * 点击进入详情
     */
    orderDetail($event) {
      const that = this
      let id = $event.currentTarget.id
      that.$router.push({
        path: "/orderDetails",
        name: "orderDetails",
        query: {
          id: id,
        },
      });
    },
  }
};
</script>

<style lang="scss">
@import "../../../../style/scss/orderManagement";
</style>
