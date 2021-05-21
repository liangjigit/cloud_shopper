<template>
  <div id="moneyDetail">
    <main>
      <header>
        <p v-show="dateType == 'D' || dateType == 'Y'">预估佣金仅供参考</p>
        <p v-show="dateType == 'D' || dateType == 'Y'">实际佣金以最终发货订单为准</p>
        <p v-show="dateType == 'LM'">上月佣金为实际所得佣金</p>
      </header>
      <footer>
        <p>绑定佣金：{{moneyData && moneyData.BIND ? moneyData.BIND : '0'}}元</p>
        <p>推广佣金：{{moneyData && moneyData.SPREAD ? moneyData.SPREAD : '0'}}元</p>
        <p>代客佣金：{{moneyData && moneyData.VALET ? moneyData.VALET : '0'}}元</p>
        <p style="color: blue;text-decoration: underline;" @click="goTuiHuo">退货佣金：{{moneyData && moneyData.BACK ? moneyData.BACK : '0'}}元</p>
        <p>累计佣金：{{moneyData && moneyData.ALL ? moneyData.ALL : '0'}}元</p>
      </footer>
    </main>
  </div>
</template>

<script>
  export default{
    name:'moneyDetail',
    data() {
      return{
        moneyData:null,
        dateType:'',
        detailText:''
      }
    },
    created() {
      let sessionData = window.sessionStorage.getItem('moneyData')
      let {data,dateType} = JSON.parse(sessionData)
      this.moneyData = data
      this.dateType = dateType
      // console.log(this.moneyData)
    },
    methods:{
      goTuiHuo(){
        this.$router.push({
          path:'tuiHuoDetail',
          query:{
            dateType:this.dateType
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #moneyDetail{
    width: 100%;
    height: 100%;
    overflow: hidden;
    main{
      width: 100%;
      height: 100%;
      margin-top: 100px;
      // background-color: red;
      header{
        height: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        color: rgb(177,177,177);
        font-size: 0.5rem;
        font-weight: bold;
      }
      footer{
        height: 6rem;
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: space-between;
        font-size: 0.5rem;
        font-weight: bold;
        p{
          margin-left: 30%;
        }
      }
    }
  }
</style>
