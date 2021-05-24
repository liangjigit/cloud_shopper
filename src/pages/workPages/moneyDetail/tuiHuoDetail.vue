<template>
  <div id="tuiHuoDetail">
    <main>
      <article>
        <header>订单号</header>
        <p v-for="(item,index) in data" :index="index">{{item.orderno}}</p>
      </article>
      <article>
        <header>退货佣金</header>
        <p v-for="(item,index) in data" :index="index">{{item.commission}}元</p>
      </article>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'tuiHuoDetail',
    data() {
      return {
        dateType: '',
        MEMBERID: '',
        data: []
      }
    },
    created() {
      this.dateType = window.sessionStorage.getItem('dateType')
      let user = localStorage.getItem("user");
      this.MEMBERID = user.replace(/\"/g, "");
      this.getData()
    },
    methods: {
      getData() {
        this.$api.post('/my/getBackCommission', {
          // 用户 id
          userId: this.MEMBERID,
          // 时间类型编码
          timeType: this.dateType
        }, res => {
          // console.log('退货', res)
          const {
            data
          } = res
          this.data = data
          // console.log(data)
        }, err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #tuiHuoDetail {
    width: 100%;
    height: 100%;

    main {
      margin-top: 100px;
      display: flex;
      justify-content: space-evenly;

      article {
        height: 6rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: 0.4rem;
        font-weight: bold;
        p{
          margin-top: 1rem;
        }
      }
    }
  }
</style>
