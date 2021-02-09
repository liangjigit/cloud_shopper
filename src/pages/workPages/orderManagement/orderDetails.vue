<template>
  <div class="ordeDetails">
    <scroll ref="pullrefresh">
      <div class="ordeDetailsMain">
        <div class="orderInformation">
          <div class="orderInforTitle">
            <div class="line"></div>
            <div class="orderTitleName">订单信息</div>
          </div>
          <div class="orderInformationList">
            <div class="orderStatus orderCommon">
              <div class="orderStatusTit orderTit">订单状态 :</div>
              <div class="orderStatusName orderName">
                {{ orderDetailList.orderType }}
              </div>
            </div>
            <div class="orderNumber orderCommon">
              <div class="orderNumberTit orderTit">订单编号 :</div>
              <div class="orderNumberName orderName">
                {{ orderDetailList.orderNum }}
              </div>
            </div>
            <div class="orderTime orderBottom orderCommon">
              <div class="orderTimeTit orderTit">下单时间 :</div>
              <div class="orderTimeName orderName">
                {{ orderDetailList.createTime }}
              </div>
            </div>
            <div :style="customerCss" @click="toCustomer">
              <div style="color: #666">会员卡号 :</div>
              <div :style="cardCss">
                {{ orderDetailList.vipCode }}
              </div>
            </div>
          </div>
        </div>
        <div class="orderInformation">
          <div class="orderInforTitle">
            <div class="line"></div>
            <div class="orderTitleName" v-if="orderDetailList.distributionType == 2">
              配送方式：门店自提
            </div>
            <div class="orderTitleName" v-else>配送</div>
          </div>
          <div class="orderInformationListS">
            <div class="consignee">
              <div class="consignee_" :class="orderDetailList.distributionType == 1 ? 'height_' : ''">
                <div class="storeTit" v-if="orderDetailList.distributionType == 2">
                  自提地址 :
                </div>
                <div class="consigneeStatusTit" v-else>收货人信息 :</div>
                <div class="consigneeInformation order_Bottom">
                  <div v-if="orderDetailList.distributionType == 2">
                    <div class="storeName">{{ orderDetailList.shopName }}</div>
                    <div class="detailedAdress">
                      {{
                        orderDetailList.shopAddress + orderDetailList.shopPhone
                      }}
                    </div>
                    <div class="markedWords">
                      门店确认商品信息之后我们将给您短信通知
                    </div>
                  </div>
                  <template v-else>
                    <div class="consigneeName">
                      {{ orderDetailList.receiptionName }}
                      {{ orderDetailList.receiptionPhone }}
                    </div>
                    <div class="consigneeAddress">
                      {{ orderDetailList.receiptionAddress }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="consignee_view" v-if="orderDetailList.distributionType == 3">
                <div class="consignee_dis">配送时间 :</div>
                <div class="consigneeName">
                  {{ orderDetailList.intraCityDate }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="orderDetailList.distributionType == 2">
            <div class="storesNamePhone">
              <div class="storesNamePhoneTit">联系人信息：</div>
              <div class="consigneeName personNamePhone">
                {{ orderDetailList.receiptionName }}
                {{ orderDetailList.receiptionPhone }}
              </div>
            </div>
          </div>
        </div>
        <div class="orderInformation">
          <div class="orderInforTitle">
            <div class="line"></div>
            <div class="orderTitleName">货品清单</div>
          </div>
          <div class="orderItemsList">
            <div class="itemsList">
              <div class="itemsLi" v-for="item in orderDetailList.orderMxes" :key="item.orderMxId">
                <div class="itemsImg">
                  <img :src="item.goodsSkuPicture ? imgURL + item.goodsSkuPicture : imgCom" class="itemsLiImg" />
                </div>
                <div class="itemsInfo">
                  <div class="itemsTitle">{{ item.goodsName }}</div>
                  <div class="itemSpecifications">
                    <div class="itemsNum itemSpecifi">
                      数量 : x{{ item.count }}
                    </div>
                  </div>
                  <div class="itemsPrice orderTitleName">
                    ￥{{ item.price }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="itemsListPrice">
          <div class="itemsAddPrice itemsPriceCommon">
            <div class="itemsNamePrice">商品金额</div>
            <div class="itemsListNum itemslistPrice">
              ￥{{ orderDetailList.productPrice }}
            </div>
          </div>
          <div v-if="orderDetailList.orderPayDetails != [] && orderDetailList.orderPayDetails != null">
            <div class="itemsCouponPrice itemsPriceCommon itemsSecond" v-for="(detail, indexD) in orderDetailList.orderPayDetails" :key="indexD">
              <div class="itemsCoupon">{{ detail.name }}</div>
              <div class="itemsCouponNum itemslistPrice" v-if="detail.price">
                -￥{{ detail.price }}
              </div>
            </div>
          </div>
          <div class="itemsFreight itemsPriceCommon itemsSecond">
            <div class="itemsNameFreight">
              {{ orderDetailList.distributionType == 3 ? "配送费" : "运费" }}
            </div>
            <div class="itemsFreightPrice itemslistPrice">
              +￥{{ orderDetailList.postage }}
            </div>
          </div>
        </div>
        <div class="pricePayable">
          <div class="pricePayableName orderTitleName">应付金额</div>
          <div class="pricePayablePrice itemslistPrice orderTitleName">
            ￥{{ orderDetailList.discountPrice }}
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "orderDetails",
  components: { scroll },
  data() {
    return {
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      // 图片地址
      imgURL: this.GLOBAL.imgURL,
      imgCom: require("../../../static/image/zhanwei.png"),
      orderDetailList: {},
      customerCss: 'display: flex; margin-top: -0.2rem; margin-bottom: 0.5rem',
      cardCss: 'margin-left: 0.2rem;color: #222;color: blue;text-decoration-line: underline;'
    };
  },
  created() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");
  },
  mounted() {
    this.orderDetails();
  },
  methods: {
    orderDetails() {
      const that = this;
      that.$api.get(
        "orderInfo",
        {
          orderId: that.$route.query.id,
          requestName: that.$route.query.id,
        },
        (res) => {
          // console.log(res);
          that.orderDetailList = res.data;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    toCustomer() {
      this.$router.push({
        name: "customerInformation",
        query: {
          memberId: this.orderDetailList.memberId,
          guideId: this.MEMBERID,
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/orderDetails.scss";
</style>
