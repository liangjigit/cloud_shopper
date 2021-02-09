<template>
  <div id="performance" :style="isS == true ? 'overflow:hidden':''">
    <perHeaderO v-if="code == '001'" :id="guideId" @devType="devType" @delShop="getShop" @getOpenSelect="getOpenSelect"></perHeaderO>
    <perHeaderT v-if="code == '002'" :id="guideId" @deliveryId="deliveryId" @getOpenSelect="getOpenSelect"></perHeaderT>
    <realTimeInfo :dataType="codeType" :id="guideId" :selectGuide='selectGuide'></realTimeInfo>
    <div class="chooseTime">
      <div class="around">
        <ul>
          <li v-for="(item,index) in chooseDate" :key="index" @click="clickTime = item.type ; clickChooseTime(index)" :class="item.type == clickTime ? 'click-li' : ''">{{item.text}}</li>
        </ul>
        <p>{{timeVal}}</p>
      </div>
    </div>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item name="1" :is-link="false">
        <template #title>
          <div style="display: flex;align-items: center;font-size:0.45rem;font-weight:900">{{typeName}}
            <van-icon style="margin-left:0.2rem" :name="arrowCss" />
          </div>
        </template>
        <realityMoney :userId="guideId" :dataType="codeType" :timeType="timeType" :selectGuide="selectGuide"></realityMoney>
      </van-collapse-item>
      <!-- <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
      <van-collapse-item title="标题3" name="3">内容</van-collapse-item> -->
    </van-collapse>
  </div>
</template>
<script>
import perHeaderO from './perComponent/perHeaderO'
import perHeaderT from './perComponent/perHeaderT'
import realTimeInfo from './perComponent/realTimeInfo'
import realityMoney from './perComponent/realityMoney'
export default {
  name: 'performance',
  components: {
    perHeaderO,
    perHeaderT,
    realTimeInfo,
    realityMoney
  },
  data() {
    return {
      chooseDate: [{
        type: 'yesterday',
        text: '昨日'
      }, {
        type: 'thisWeek',
        text: '本周'
      }, {
        type: 'thisMonth',
        text: '本月'
      }, {
        type: 'thisYear',
        text: '本年'
      },],
      clickTime: 'yesterday',
      timeVal: '',
      activeName: '0',
      guideId: '',
      //001区经 002店长 003导购
      code: '',
      codeType: '',
      //记录选择的导购
      selectGuide: '',
      //D W M Y
      timeType: 'D',
      arrowCss: 'arrow',
      typeName: '我的业绩',
      isS: false
    }
  },
  created() {
    let user = window.localStorage.getItem('user')
    if (user) {
      this.guideId = user.replace(/\"/g, "")
    }
    this.getRole()
    let nowDate = new Date()
    nowDate.setTime(nowDate.getTime() - 24 * 60 * 60 * 1000)
    this.timeVal = `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1) < 10 ? `0${nowDate.getMonth() + 1}` : (nowDate.getMonth() + 1)}-${nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()}`
  },
  watch: {
    activeName(nV) {
      if (1 != nV) {
        this.arrowCss = 'arrow'
      } else {
        this.arrowCss = 'arrow-down'
      }
    },
    codeType(vN) {
      if ('PROVINCE' == vN) {
        this.typeName = '分公司业绩'
      } else if ('SHOP' == vN) {
        this.typeName = '门店业绩'
      } else {
        this.typeName = '我的业绩'
      }
    }
  },
  methods: {
    /**
     * 是否点击下拉选择
     */
    getOpenSelect(isS) {
      this.isS = isS
    },
    /**
     * 获取区经的门店数据
     */
    getShop(data) {
      // console.log(data)
      this.codeType = data.shopType
      this.selectGuide = data.shopId
    },
    /**
     * 传递数据type
     */
    devType(type) {
      this.codeType = type
      this.selectGuide = ''
    },
    /**
     * 传递导购id
     */
    deliveryId(id) {
      // console.log(id)
      if (id == 0) {
        this.codeType = 'SHOP'
        this.selectGuide = ''
      } else {
        this.codeType = 'SHOPGUIDE'
        this.selectGuide = id
      }
    },
    /**
     * 获取角色权限
     */
    getRole() {
      this.$api.post('my/role', {
        guideId: this.guideId
      }, res => {
        // console.log(res)
        if (res.errcode == 0) {
          this.code = res.data
          switch (res.data) {
            case '001':
              //区经
              this.codeType = 'PROVINCE'
              break;
            case '002':
              //店长
              this.codeType = 'SHOP'
              break
            default:
              //导购
              this.codeType = 'SHOPGUIDE'
          }
        }
      }, err => {
        console.log(res)
      })
    },
    /**
     * 点击选择时间
     */
    clickChooseTime(index) {
      this.activeName = '1'
      switch (index) {
        case 0:
          this.timeType = 'D'
          this.yesterday()
          break;
        case 1:
          this.timeType = 'W'
          this.thisWeek()
          break;
        case 2:
          this.timeType = 'M'
          this.thisMonth()
          break;
        default:
          this.timeType = 'Y'
          this.thisYear()
          break;
      }
    },
    /**
     * 昨日
     */
    yesterday() {
      let nowDate = new Date()
      nowDate.setTime(nowDate.getTime() - 24 * 60 * 60 * 1000)
      let yesterdayTime = `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1) < 10 ? `0${nowDate.getMonth() + 1}` : (nowDate.getMonth() + 1)}-${nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()}`
      this.timeVal = yesterdayTime
    },
    /**
     * 本周
     */
    thisWeek() {
      let time = new Date()
      //为星期一时候显示上一周的数据
      if (1 == time.getDay()) {
        let lastWeekTime = `${this.getTime(7)}至${this.getTime(1)}`
        this.timeVal = lastWeekTime
        //为星期二时候只显示星期一数据
      } else if (2 == time.getDay()) {
        this.timeVal = this.getTime(0)
      } else {
        let yesterdayTime = `${time.getFullYear()}-${(time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : `0${time.getMonth() + 1}`}-${(time.getDate() - 1) > 10 ? (time.getDate() - 1) : `0${time.getDate() - 1}`}`
        let thisWeekTime = `${this.getTime(0)} 至 ${yesterdayTime}`
        this.timeVal = thisWeekTime
      }
    },
    /**
     * 本月
     */
    thisMonth() {
      let time = new Date()
      //如果为当月的1号，则显示上一个月数据
      if (1 == time.getDate()) {
        //如果此时是1月
        if (0 == time.getMonth()) {
          let thisMonthTime = `${time.getFullYear() - 1}-12`
          this.timeVal = thisMonthTime
        } else {
          let thisMonthTime = `${time.getFullYear()}-${time.getMonth() > 10 ? time.getMonth() : `0${time.getMonth()}`}`
          this.timeVal = thisMonthTime
        }
      } else {
        let thisMonthTime = `${time.getFullYear()}-${time.getMonth() + 1 > 10 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`}`
        this.timeVal = thisMonthTime
      }
    },
    /**
     * 本年
     */
    thisYear() {
      let time = new Date()
      //如果是1月1日显示上一年数据
      if (0 == time.getMonth && 1 == time.getDate()) {
        let thisYearTime = time.getFullYear() - 1
        this.timeVal = thisYearTime
      } else {
        let thisYearTime = time.getFullYear()
        this.timeVal = thisYearTime
      }
    },
    /**
     * 过滤时间函数
     */
    getTime(n) {
      const that = this;
      that.defaultDate = new Date();
      let year = that.defaultDate.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      let month = that.defaultDate.getMonth() + 1;
      let date = that.defaultDate.getDate();
      let day = that.defaultDate.getDay();
      //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
      if (day !== 0) {
        n = n + (day - 1);
      } else {
        n = n + day;
      }
      if (day) {
        if (month > 1) {
          month = month;
        }
        //这个判断是为了解决跨年的问题,月份是从0开始的
        else {
          year = year - 1;
          month = 12;
        }
      }
      that.defaultDate.setDate(that.defaultDate.getDate() - n);
      year = that.defaultDate.getFullYear();
      month = that.defaultDate.getMonth() + 1;
      date = that.defaultDate.getDate();
      let s =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date);
      return s;
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/scss/performance";
</style>