<template>
  <div id="areaManage">
    <header style="background-color: #f0f0ef;">
      <div class="time">
        <ul>
          <li v-for="(item,index) in timeData" @click="seleTime(index)" :class="seleId == index ? 'seleStyle' : ''">{{item}}</li>
        </ul>
        <p>{{timeVal}}</p>
      </div>
    </header>
    <survey :timeData="changeTime" />
    <main>
      <div class="back-line"></div>
      <header>
        <div class="title">
          门店邀约概况
        </div>
        <input placeholder="请输入门店代码" v-model.trim="param.code" />
        <div class="search" @click="getShopList">搜索</div>
      </header>
      <article>
        <template v-if="shopList != null && shopList.length > 0">
          <section v-for="(item,index) in shopList">
            <div class="number" :style="(index + 1) > 3 ? 'opacity:0' : ''">
              <p>{{index +1}}</p>
            </div>
            <div class="data">
              <p>{{item.shopname}}</p>
              <div class="people">
                <p>邀约人数</p>
                <p>{{item.invitenum}}</p>
              </div>
              <div class="back">
                <p>回购率</p>
                <p>{{item.returnrate}}%</p>
              </div>
              <div class="noInvite" @click="toDetail(item.shopno,item.notinviteshopguidenum)">
                <p style="color: #03c;text-decoration: underline;">未邀约导购</p>
                <p style="color: #03c;">{{item.notinviteshopguidenum}}</p>
              </div>
            </div>
          </section>
        </template>
      </article>
    </main>
    <template v-if="shopList == null || shopList.length == 0">
      <div class="no-data">
        <img src="../../../static/image/null_logo.png" />
        <p>暂时还没有数据</p>
      </div>
    </template>
  </div>
</template>

<script>
  import survey from './components/survey.vue'
  import {
    Toast
  } from "mint-ui";
  export default {
    name: 'areaManage',
    components: {
      survey
    },
    data() {
      return {
        timeData: ['昨日', '本周', '本月', '本季度'],
        seleId: '0',
        //要传递的参数
        param: {
          userId: '',
          dataType: 'PROVINCE',
          timeType: '',
          code: ''
        },
        shopList: [],
        timeVal: ''
      }
    },
    watch: {
      changeTime(v, o) {
        this.getShopList()
      }
    },
    created() {
      let currentTime = this.$store.state.currentTime
      let user = window.localStorage.getItem('user')
      if (user) {
        this.param.userId = user.replace(/\"/g, "")
      }
      let nowDate = new Date()
      nowDate.setTime(nowDate.getTime() - 24 * 60 * 60 * 1000)
      this.timeVal =
        `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1) < 10 ? `0${nowDate.getMonth() + 1}` : (nowDate.getMonth() + 1)}-${nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()}`
      // console.log(this.param.userId)
      // this.getShopList()
      this.param.timeType = ''
      this.seleTime(currentTime)
    },
    methods: {
      /**
       * 获取展示数据
       */
      getShopList() {
        const _this = this
        _this.$api.post('my/getInvitationShopDetail', _this.param, res => {
          // console.log(res)
          this.shopList = res.data
        }, err => {
          console.log(err)
        })
      },
      /**
       * 选择时间
       */
      seleTime(i) {
        this.seleId = i
        this.param.code = ''
        switch (i) {
          case 0:
            this.param.timeType = 'D'
            this.$store.commit('$_setCurrentTime', i)
            this.yesterday()
            break;
          case 1:
            this.param.timeType = 'W'
            this.$store.commit('$_setCurrentTime', i)
            this.thisWeek()
            break;
          case 2:
            this.param.timeType = 'M'
            this.$store.commit('$_setCurrentTime', i)
            this.thisMonth()
            break;
          case 3:
            this.param.timeType = 'Q'
            this.$store.commit('$_setCurrentTime', i)
            this.quarter()
            break;
        }
        // console.log(this.param.timeType)
      },
      /**
       * 去详情页
       */
      toDetail(id, n) {
        // console.log(id)
        // console.log(n)
        const _this = this
        if (n == 0) {
          Toast('没有未邀约导购')
        } else {
          _this.$router.push({
            name: 'inviteShow',
            params: {
              id,
              time: _this.param.timeType
            }
          })
        }
      },
      /**
       * 昨日
       */
      yesterday() {
        let nowDate = new Date()
        nowDate.setTime(nowDate.getTime() - 24 * 60 * 60 * 1000)
        let yesterdayTime =
          `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1) < 10 ? `0${nowDate.getMonth() + 1}` : (nowDate.getMonth() + 1)}-${nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()}`
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
          let yesterdayTime =
            `${time.getFullYear()}-${(time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : `0${time.getMonth() + 1}`}-${(time.getDate() - 1) > 10 ? (time.getDate() - 1) : `0${time.getDate() - 1}`}`
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
            let thisMonthTime =
              `${time.getFullYear()}-${time.getMonth() > 10 ? time.getMonth() : `0${time.getMonth()}`}`
            this.timeVal = thisMonthTime
          }
        } else {
          let thisMonthTime =
            `${time.getFullYear()}-${time.getMonth() + 1 > 10 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`}`
          this.timeVal = thisMonthTime
        }
      },
      /**
       * 季度
       */
      quarter() {
        let time = new Date()
        let month = time.getMonth() + 1
        if (month == 1 || month == 2 || month == 3) {
          this.timeVal = '一季度'
        } else if (month == 4 || month == 5 || month == 6) {
          this.timeVal = '二季度'
        } else if (month == 7 || month == 8 || month == 9) {
          this.timeVal = '三季度'
        } else if (month == 10 || month == 11 || month == 12) {
          this.timeVal = '四季度'
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
    },
    computed: {
      changeTime() {
        return this.param.timeType
      }
    }
  }
</script>

<style lang="scss">
  @import '@/style/scss/areaManage.scss';

  .waringbox {
    line-height: 2 !important;
    font-size: 30px !important;
  }

  .van-icon {
    color: #03c !important;
  }

  .van-toast {
    color: black !important;
    background: white !important;
  }

  .mint-indicator-text {
    font-size: 0.4rem !important;
  }

  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;

    img {
      width: 25%;
    }

    p {
      margin-top: 0.5rem;
      font-size: 0.4rem;
      color: #969799;
    }
  }
</style>
