<template>
  <div id="dataMap">
    <div class="data-map" v-if="dataInfo != null">
      <div class="data-first">
        <div class="first">
          <p>总销售</p>
          <p>{{dataInfo.totalSales == null ? '-' : dataInfo.totalSales}}</p>
          <p style="opacity:0;">占位置</p>
        </div>
      </div>
      <div class="long-string">
        <div class="long-one">
        </div>
      </div>
      <div class="long-string-b">
        <div class="string-b">
          <div class="b1"></div>
          <div class="b2"></div>
        </div>
      </div>
      <div class="two-box">
        <div class="box-left">
          <p>云导购实销金额</p>
          <p>{{dataInfo.actualCloud == null ? '-' : dataInfo.actualCloud}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualCloudProportion == null ? '-' : dataInfo.actualCloudProportion}}%</span></p>
        </div>
        <div class="box-right">
          <p>线下销售</p>
          <p>{{dataInfo.actualOffline == null ? '-' : dataInfo.actualOffline}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualOfflineProportion == null ? '-' : dataInfo.actualOfflineProportion}}%</span></p>
        </div>
      </div>
      <div class="two-long-string">
        <div class="left-two-string"></div>
        <div class="two-string"></div>
      </div>
      <div class="left-two-box-line">
        <div class="box-line"></div>
        <div class="right-line"></div>
      </div>
      <div class="two-box-line">
        <div class="left-box">
          <p>云导购新会员销售</p>
          <p>{{dataInfo.actualCloudNew == null ? '-' : dataInfo.actualCloudNew}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualCloudNewProportion == null ? '-' : dataInfo.actualCloudNewProportion}}%</span></p>
        </div>
        <div class="right-box">
          <p>云导购老会员销售</p>
          <p>{{dataInfo.actualCloudOld == null ? '-' : dataInfo.actualCloudOld}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualCloudOldProportion == null ? '-' : dataInfo.actualCloudOldProportion}}%</span></p>
        </div>
        <div class="right-line-string"></div>
      </div>
      <div class="bottom-string">
        <div class="left-bottom-string"></div>
        <div class="right-bottom-string"></div>
      </div>
      <div class="bottom-three-box">
        <div class="one-box">
          <p>线下新会员销售</p>
          <p>{{dataInfo.actualOfflineNew == null ? '-' : dataInfo.actualOfflineNew}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualOfflineNewProportion == null ? '-' : dataInfo.actualOfflineNewProportion}}%</span></p>
        </div>
        <div class="two-box">
          <p>线下老会员销售</p>
          <p>{{dataInfo.actualOfflineOld == null ? '-' : dataInfo.actualOfflineOld}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualOfflineOldProportion == null ? '-' : dataInfo.actualOfflineOldProportion}}%</span></p>
        </div>
        <div class="three-box">
          <p>非会员销售额</p>
          <p>{{dataInfo.actualOfflineNon == null ? '-' : dataInfo.actualOfflineNon}}</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>{{dataInfo.actualOfflineNonProportion == null ? '-' : dataInfo.actualOfflineNonProportion}}%</span></p>
        </div>
      </div>
    </div>
    <div class="data-map" v-else>
      <div class="data-first">
        <div class="first">
          <p>总销售</p>
          <p>0</p>
          <p style="opacity:0;">占位置</p>
        </div>
      </div>
      <div class="long-string">
        <div class="long-one">
        </div>
      </div>
      <div class="long-string-b">
        <div class="string-b">
          <div class="b1"></div>
          <div class="b2"></div>
        </div>
      </div>
      <div class="two-box">
        <div class="box-left">
          <p>云导购实销金额</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
        <div class="box-right">
          <p>线下销售</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
      </div>
      <div class="two-long-string">
        <div class="left-two-string"></div>
        <div class="two-string"></div>
      </div>
      <div class="left-two-box-line">
        <div class="box-line"></div>
        <div class="right-line"></div>
      </div>
      <div class="two-box-line">
        <div class="left-box">
          <p>云导购新会员销售</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
        <div class="right-box">
          <p>云导购老会员销售</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
        <div class="right-line-string"></div>
      </div>
      <div class="bottom-string">
        <div class="left-bottom-string"></div>
        <div class="right-bottom-string"></div>
      </div>
      <div class="bottom-three-box">
        <div class="one-box">
          <p>线下新会员销售</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
        <div class="two-box">
          <p>线下老会员销售</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
        <div class="three-box">
          <p>非会员销售额</p>
          <p>0</p>
          <p><span>占比</span>&nbsp;&nbsp;<span>0%</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dataMap',
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
      _this.getDataMap()
    }, 100)
  },
  watch: {
    selectGuide(vN, vO) {
      this.getDataMap()
    },
    timeType(vN, vO) {
      this.getDataMap()
    },
    dataType() {
      this.getDataMap()
    }
  },
  methods: {
    /**
     * 获取实时数据
     */
    getDataMap() {
      const _this = this
      return new Promise(function (resolve, reject) {
        _this.$api.post('my/getTreeMap', {
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
@import "../../../../style/scss/dataMap.scss";
@import "../../../../style/icomoon/style.css";
</style>
