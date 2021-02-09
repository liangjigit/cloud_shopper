<template>
  <div id="detail">
    <div class="can-use">
      <p>可用积分</p>
      <div class="all-points">
        {{allPoints}}
      </div>
    </div>
    <div class="detail-points">
      <ul class="dpoints">
        <li>我的积分</li>
        <li v-for="(item,index) in detailedIntegration" :key="index">{{item.positive_point}}</li>
      </ul>
      <ul class="etime">
        <li>到期时间</li>
        <li v-for="(item,index) in detailedIntegration" :key="index">{{item.expiration_time | getDay(item.expiration_time)}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import scroll from '../../../../components/scroll';
export default {
  name: 'currentScore',
  components: {
    scroll
  },
  created() {
    this.cardNum = this.$route.query.cstId,
      this.currentScore()
  },
  data() {
    return {
      //用户会员卡号
      cardNum: '',
      //保存详细积分信息
      detailedIntegration: [],
      //全部积分
      allPoints: Number,
      //判断积分是否为空
      // isPoints:false
    }
  },
  methods: {
    currentScore() {
      this.$api.get('/findMemerIntegral', {
        cstId: this.cardNum
      }, res => {
        if (res.data != null) {
          this.detailedIntegration = res.data.Integral,
            this.allPoints = res.data.totalIntegral
          // this.isPoints = true
          // res.data.Integral.forEach(item => {
          //     console.log(item.expiration_time.substr(0,10))
          // })
        } else {
          // this.isPoints = false
          // console.log(this.isPoints)
          this.allPoints = 0
        }
      })
    }
  },
  filters: {
    getDay(value) {
      return value.substr(0, 10)
    }
  }
}
</script>

<style lang="scss">
@import "../../../../style/scss/currentScore";
</style>