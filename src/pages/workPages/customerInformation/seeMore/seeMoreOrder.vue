<template>
  <div class="container_order">
    <ol class="orderControl" id="orderControl" v-if="isShow">
      <li v-for="(item,index) in control" :key="index">
        <span :type=item.type class="controlBtn" :class="{active:index==current}" @click="curt(index)">{{item.name}}</span>
      </li>
    </ol>
    <div class="ScrollBox" ref="homePage">
      <scroll ref="pullrefresh" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="OderList" :isDone="isLoadingLeft" :nullDataAll="nullDataAllLeft">
        <div class="orderMain">
          <template v-if="result!=null">
            <div class="Consumption" v-for="item in result" :key="item.id">
              <p class="orderNo">
                <span class="orderNum">订单号：{{item.orderNum}}</span>
                <span class="orderDate">{{item.createTime}}</span>
              </p>
              <ul class="order-list">
                <li class="order-item" v-for="(projact,index) in item.orderMx" :key="index">
                  <img :src=path+projact.goodsSkuPicture alt class="order-img" />
                  <div class="order-info">
                    <span class="order-name">{{projact.goodsName}}</span>
                    <span class="order-specification">{{projact.specificationOneName}}:{{projact.specificationOneCode}} {{projact.specificationTwoName}}:{{projact.specificationTwoCode}} {{projact.specificationThreeName}}:{{projact.specificationThreeCode}}</span>
                    <span class="order-sku">SKU码：{{projact.goodsSku}}</span>
                    <span class="order-price">¥{{projact.price}}</span>
                  </div>
                </li>
              </ul>
              <div class="order-settlement">
                <span class="order-zoom">消费地址：<b>{{item.shopName}}</b></span>
                <span class="order-address">订单状态 :<b>{{item.typeName}}</b></span>
                <span class="order-total">共计金额 :<b>¥{{item.discountPrice}}</b></span>
              </div>
            </div>
          </template>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from '../../../../components/scroll';
export default {
  name: "seeMoreOrder",
  components: {
    scroll
  },
  data() {
    return {
      path: this.GLOBAL.imgURL,
      control: [
        { name: '全部', type: '' },
        { name: '待付款', type: '001' },
        { name: '待发货', type: '002' },
        { name: '待收货', type: '003' },
        { name: '已完成', type: '004' }
      ],
      param: {
        memberId: '',
        type: '',
        status: '',
        size: '10',
        page: '1',
        requestName: '0'
      },
      current: 0,
      active: 'active',
      result: [],
      orderMx: [],
      isData: false,
      isShowScroll: true,
      OderList: [],
      clientHeight: '',
      nullDataAllLeft: false,
      isLoadingLeft: true,
      isShow: false
    }
  },
  mounted() {
    this.getParams()
    this.getOrder()
    this.clientHeight = `${document.documentElement.clientHeight}`;
    window.onresize = function () {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    }
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight() {
      this.changeFixed(this.clientHeight)
    }
  },
  methods: {
    /**
     * 获取参数
     */
    getParams() {
      this.param.memberId = this.$route.query.memberId;
      this.param.status = this.$route.query.status;
      if (this.param.status == 'LINE') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    /**
     * 获取商品数据
     */
    getOrder() {
      this.param.requestName = this.param.page
      this.$api.get('/memberorder', this.param, res => {
        if (res.errcode == 0) {
          let result = res.data.result;
          // console.log(result)
          this.OderList = result;
          if (result.length < 10) {
            this.isLoadingLeft = false;
            if (this.result.length < 10) {
              this.result = result;
            } else {
              this.result = this.result.concat(result);
            }
            this.param.page = 0
            this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');
          } else {
            this.isLoadingLeft = true;
            this.result = this.result.concat(result);
            this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
          }
          if (this.result.length == 0) {
            this.nullDataAllLeft = true;
          } else {
            this.nullDataAllLeft = false;
          }
          this.isData = false;
        }
      }, err => {
        console.log(err)
      })
    },
    /**
     * 下拉加载
     */
    loadBottom() {
      const that = this;
      if (!that.isData) {
        if (that.param.page < 0 || that.param.page == 0) {
          return
        } else {
          that.isData = true;
          that.param.page++
          that.param.requestName = that.param.page
          this.$refs.pullrefresh.$emit('infinitescroll.reInit');
          this.getOrder()
        }
      }
    },
    /**
     * 根据选项获取数据
     */
    curt(index) {
      this.result = [];
      this.current = index;
      this.param.page = '1';
      this.param.type = document.getElementsByClassName('controlBtn')[index].getAttribute('type');
      this.getOrder();
    },
    /**
     * 动态修改样式
     */
    changeFixed(clientHeight) {
      //console.log(clientHeight);
      if (this.param.status == 'LINE') {
        if (document.getElementById('orderControl')) {
          this.$refs.homePage.style.height = (clientHeight - document.getElementById('orderControl').offsetHeight) + 'px';
        }
      } else {
        this.$refs.homePage.style.height = (clientHeight) + 'px';
        this.$refs.homePage.style.top = '0px'
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../../style/scss/seeMoreOrder";
</style>
