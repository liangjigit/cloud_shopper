<template>
  <div id="realTimeInfo">
    <div class="real-time">
      <div class="top-text">云导购实时快讯<span>（仅供参考，实际以最终发货数据为准）</span></div>
      <div class="time">
        <template v-if="noDataTime == true">
          <span style="font-size:0.4rem">每日0点-5点数据暂不更新</span>
        </template>
        <template v-else-if="noDataTime == false  && dataInfo == null">
          <span style="font-size:0.4rem">暂无数据</span>
        </template>
        <template v-else>
          <span style="font-size:0.4rem">截止&nbsp;{{dataInfo.updatetime}}</span>
        </template>
      </div>
      <div class="knockdown" v-if="noDataTime == true || dataInfo == null">
        成交金额：<span>￥0</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="fair">持平</span>
      </div>
      <div class="knockdown" v-else>
        成交金额：<span>￥{{dataInfo.paidupmoney}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span v-if="dataInfo.paidupmoney_tb > 0" class=" increase">{{dataInfo.paidupmoney_tb}}&nbsp;<span class="icon-arrow-up2"></span></span>
        <span v-if="dataInfo.paidupmoney_tb == 0" class="fair">持平</span>
        <span v-if="dataInfo.paidupmoney_tb < 0" class="decrease">{{Math.abs(dataInfo.paidupmoney_tb)}}&nbsp;<span class="icon-arrow-down2"></span></span>
      </div>
    </div>
    <div class="Presentation" v-if="noDataTime == true || dataInfo == null">
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
    <div class="Presentation" v-else>
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
  </div>
</template>
<script>
export default {
  name: 'realTimeInfo',
  props: {
    dataType: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    selectGuide: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataInfo: {},
      noDataTime: true
    }
  },
  created() {
    let nowTime = new Date().getHours()
    if (0 <= nowTime && 5 > nowTime) {
      this.noDataTime = true
    } else {
      this.noDataTime = false
    }
  },
  watch: {
    selectGuide(vN, vO) {
      this.getRealTimeInfo()
    },
    dataType() {
      // console.log(this.id)
      // console.log(this.dataType)
      // console.log(this.selectGuide)
      this.getRealTimeInfo()
    }
  },
  methods: {
    /**
     * 获取实时数据
     */
    getRealTimeInfo() {
      const _this = this
      return new Promise(function (resolve, reject) {
        _this.$api.post('my/getNow', {
          userId: _this.id,
          conditionId: _this.selectGuide,
          dataType: _this.dataType
        }, res => {
          _this.dataInfo = res.data
          _this.dataInfo.updatetime = _this.dataInfo.updatetime.substr(0, 19)
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
@import "../../../../style/scss/realTimeInfo";
@import "../../../../style/icomoon/style.css";
</style>