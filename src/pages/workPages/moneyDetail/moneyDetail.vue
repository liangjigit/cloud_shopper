<template>
  <div id="moneyDetail">
    <main>
      <header>
        <p v-show="dateType == 'D' || dateType == 'M'">预估佣金仅供参考</p>
        <p v-show="dateType == 'D' || dateType == 'M'">实际佣金以最终发货订单为准</p>
        <p v-show="dateType == 'LM'">上月佣金为实际所得佣金</p>
      </header>
      <footer>
        <p>绑定佣金：{{moneyData && moneyData.BIND ? moneyData.BIND.commission : '0'}}元</p>
        <p>推广佣金：{{moneyData && moneyData.SPREAD ? moneyData.SPREAD.commission : '0'}}元</p>
        <p>代客佣金：{{moneyData && moneyData.VALET ? moneyData.VALET.commission : '0'}}元</p>
        <p style="color: blue;text-decoration: underline;" @click="goTuiHuo">
          退货佣金：{{moneyData && moneyData.BACK ? moneyData.BACK.commission : '0'}}元</p>
        <p>累计佣金：{{moneyData && moneyData.ALL ? moneyData.ALL.commission : '0'}}元</p>
      </footer>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'moneyDetail',
    data() {
      return {
        moneyData: null,
        dateType: ''
      }
    },
    created() {
      let user = localStorage.getItem("user");
      this.MEMBERID = user.replace(/\"/g, "");
      this.dateType = window.sessionStorage.getItem('dateType')
      this.getMoney(window.sessionStorage.getItem('dateType'))
    },
    methods: {
      /*
       * 获得佣金数据
       */
      getMoney(dateType) {
        const _this = this
        _this.$api.post('/my/getAllTypeCommission', {
          userId: _this.MEMBERID,
          // 时间类型编码
          timeType: dateType
        }, res => {
          // console.log('获取佣金数据', res.data)
          _this.moneyData = res.data
        }, err => {
          console.log(err)
        })
      },
      goTuiHuo() {
        this.$router.push({
          path: 'tuiHuoDetail'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #moneyDetail {
    width: 100%;
    height: 100%;
    overflow: hidden;

    main {
      width: 100%;
      height: 100%;
      margin-top: 100px;

      // background-color: red;
      header {
        height: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        color: rgb(177, 177, 177);
        font-size: 0.5rem;
        font-weight: bold;
      }

      footer {
        height: 6rem;
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: space-between;
        font-size: 0.5rem;
        font-weight: bold;

        p {
          margin-left: 30%;
        }
      }
    }
  }
</style>
