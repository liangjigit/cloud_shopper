<template>
  <div id="onlineCommission">
    <header>
      <div class="header_box">
        <div class="header_left">
          <p>{{ name }}</p>
          <span>{{ department }}</span>
        </div>
        <div class="header_right">
          <img :src="logo" />
        </div>
      </div>
    </header>

    <div class="guideInfo">
      <div class="guideInfo_item">
        <p>￥{{ totalNum==null?0:totalNum }}</p>
        <span>总佣金收入</span>
      </div>
      <div class="guideInfo_item">
        <p>￥{{availablePrice==null?0:availablePrice}}</p>
        <span>可提现金额</span>
      </div>
      <div class="guideInfo_item">
        <p>{{num}}</p>
        <span>我的会员</span>
      </div>
    </div>

    <div class="line"></div>
    <footer>
      <div class="footer_box">
        <router-link to='commission'>
          <div class="footer_item">
            <span>
              <img src="../../../static/image/ckyj.png" />
              佣金明细
            </span>
            <i class="iconfont more">&#xe601;</i>
          </div>
        </router-link>
        <div class="border"></div>
        <router-link to='commissionPlan'>
          <div class="footer_item">
            <span>
              <img src="../../../static/image/yjfa.png" />
              佣金方案
            </span>
            <i class="iconfont more">&#xe601;</i>
          </div>
        </router-link>
      </div>
    </footer>
  </div>

</template>

<script>
export default {
  name: "onlineCommission",
  data() {
    return {
      MEMBERID: this.GLOBAL.MEMBERID,
      //名称
      name: '',
      //店铺名称
      department: '',
      //头像
      logo: '',
      //会员
      num: 0,
      //总佣金收入
      totalNum: 0,
      //可提现佣金
      availablePrice: 0,
      isFirstEnter: false,


    }
  },

  activated() {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      let user = localStorage.getItem('user');
      this.MEMBERID = user.replace(/\"/g, "");
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.guideInfo();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false
    // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
    this.isFirstEnter = false;
  },
  methods: {
    guideInfo: function () {
      var that = this;
      that.$api.get(
        '/guideInfo', {
        guideId: that.MEMBERID,
        requestName: that.MEMBERID
      },
        res => {
          var dataList = res.data;
          if (res.errcode == 0) {
            //名称
            that.name = dataList.name;
            //店铺名称
            that.department = dataList.departmentName;
            that.logo = dataList.avatar;
            that.num = dataList.memberNum;
            that.totalNum = dataList.totalDistribution;
            that.availablePrice = dataList.availableDistribution;
            that.logo = dataList.avatar
          }
        }, err => {
          console.log(err)
        }
      );
    }
  },
  created: function () {
    let user = localStorage.getItem('user');
    this.MEMBERID = user.replace(/\"/g, "");
  },
  beforeMount: function () { },
  //页面渲染完毕
  mounted: function () {

  }
}
</script>

<style lang="scss">
@import "../../../style/scss/onlineCommission";

@font-face {
  font-family: "iconfont";
  /* project id 770909 */
  src: url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.eot");
  src: url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.woff") format("woff"),
    url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.svg#iconfont") format("svg");
}
</style>
