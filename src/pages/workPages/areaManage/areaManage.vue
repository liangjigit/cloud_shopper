<template>
  <div id="areaManage">
    <header style="background-color: #f0f0ef;">
      <div class="time">
        <ul>
          <li v-for="(item,index) in timeData" @click="seleTime(index)" :class="seleId == index ? 'seleStyle' : ''">{{item}}</li>
        </ul>
      </div>
    </header>
    <survey :timeData="param.timeType" />
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
              <div class="noInvite"  @click="toDetail(item.shopno,item.notinviteshopguidenum)">
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
          timeType: 'D',
          code: ''
        },
        shopList: [],
      }
    },
    watch: {
      changeTime(v, o) {
        this.getShopList()
      }
    },
    created() {
      let user = window.localStorage.getItem('user')
      if (user) {
        this.param.userId = user.replace(/\"/g, "")
      }
      // console.log(this.param.userId)
      this.getShopList()
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
            break;
          case 1:
            this.param.timeType = 'W'
            break;
          case 2:
            this.param.timeType = 'M'
            break;
          case 3:
            this.param.timeType = 'Q'
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
