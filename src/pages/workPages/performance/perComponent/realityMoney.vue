<template>
  <div id="realityMoney">
    <div class="solid-pin" v-if="dataInfo != null">
      云导购实销金额：<span>￥{{dataInfo.paidupmoney}}</span>&nbsp;&nbsp;
      <span v-if="dataInfo.paidupmoney_tb > 0" class="increase">{{dataInfo.paidupmoney_tb}}&nbsp;<span class="icon-arrow-up2"></span></span>
      <span v-if="dataInfo.paidupmoney_tb == 0" class="fair">持平</span>
      <span v-if="dataInfo.paidupmoney_tb < 0" class="decrease">{{Math.abs(dataInfo.paidupmoney_tb)}}&nbsp;<span class="icon-arrow-down2"></span></span>
    </div>
    <div class="solid-pin" v-else>
      云导购实销金额<span>￥0</span>&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="font-size:0.4rem" class="fair">持平</span>
    </div>
    <div class="hr">
      <div class="hr-line"></div>
    </div>
    <div class="Presentation" v-if="dataInfo != null">
      <div class="single">
        <p>总件数</p>
        <p>{{dataInfo.salesquantity}}</p>
        <p v-if="dataInfo.salesquantity_tb > 0" class=" increase">{{dataInfo.salesquantity_tb}}&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.salesquantity_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.salesquantity_tb < 0" class="decrease">{{Math.abs(dataInfo.salesquantity_tb)}}&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
      <div class="single">
        <p>件单价</p>
        <p>{{dataInfo.unit_price}}</p>
        <p v-if="dataInfo.unit_price_tb > 0" class=" increase">{{dataInfo.unit_price_tb}}&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.unit_price_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.unit_price_tb < 0" class="decrease">{{Math.abs(dataInfo.unit_price_tb)}}&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
      <div class="single">
        <p>购买人数</p>
        <p>{{dataInfo.clubidnum}}</p>
        <p v-if="dataInfo.clubidnum_tb > 0" class=" increase">{{dataInfo.clubidnum_tb}}&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.clubidnum_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.clubidnum_tb < 0" class="decrease">{{Math.abs(dataInfo.clubidnum_tb)}}&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
      <div class="single">
        <p>客单价</p>
        <p>{{dataInfo.pct}}</p>
        <p v-if="dataInfo.pct_tb > 0" class=" increase">{{dataInfo.pct_tb}}&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.pct_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.pct_tb < 0" class="decrease">{{Math.abs(dataInfo.pct_tb)}}&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
      <div class="single">
        <p>连带率</p>
        <p>{{dataInfo.joint_rate}}</p>
        <p v-if="dataInfo.joint_rate_tb > 0" class=" increase">{{dataInfo.joint_rate_tb}}&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.joint_rate_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.joint_rate_tb < 0" class="decrease">{{Math.abs(dataInfo.joint_rate_tb)}}&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
    </div>
    <div class="Presentation" v-else>
      <div class="single">
        <p>总件数</p>
        <p>0</p>
        <p class="fair">持平</p>
      </div>
      <div class="single">
        <p>件单价</p>
        <p>0</p>
        <p class="fair">持平</p>
      </div>
      <div class="single">
        <p>购买人数</p>
        <p>0</p>
        <p class="fair">持平</p>
      </div>
      <div class="single">
        <p>客单价</p>
        <p>0</p>
        <p class="fair">持平</p>
      </div>
      <div class="single">
        <p>连带率</p>
        <p>0</p>
        <p class="fair">持平</p>
      </div>
    </div>
    <div class="hr">
      <div class="hr-line"></div>
    </div>
    <dataMap :userId="userId" :dataType="dataType" :selectGuide="selectGuide" :timeType="timeType"></dataMap>
  </div>
</template>
<script>
import dataMap from './dataMap'
export default {
  name: 'realityMoney',
  components: {
    dataMap
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    dataType: {
      type: String,
      default: ''
    },
    selectGuide: {
      type: String,
      default: ''
    },
    timeType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataInfo: {}
    }
  },
  created() {
    const _this = this
    setTimeout(function () {
      _this.getRealityMoney()
    }, 100)
  },
  watch: {
    selectGuide(vN, vO) {
      this.getRealityMoney()
    },
    timeType(vN, vO) {
      this.getRealityMoney()
    },
    dataType() {
      this.getRealityMoney()
    }
  },
  methods: {
    /**
     * 获取实时数据
     */
    getRealityMoney() {
      const _this = this
      return new Promise(function (resolve, reject) {
        _this.$api.post('my/getAchievement', {
          userId: _this.userId,
          conditionId: _this.selectGuide,
          dataType: _this.dataType,
          timeType: _this.timeType
        }, res => {
          _this.dataInfo = res.data
          // console.log(res)
          resolve()
        }, err => {
          console.log(err)
          reject()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/scss/realityMoney.scss";
@import "../../../../style/icomoon/style.css";
</style>
