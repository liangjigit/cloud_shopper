<template>
  <div id="tuiHuoDetail">
    <main>
      <article>
        <header>订单号</header>
        <p>12312312412341241</p>
        <p>12312312412341241</p>
        <p>12312312412341241</p>
        <p>12312312412341241</p>
      </article>
      <article>
        <header>退货佣金</header>
        <p>-500元</p>
        <p>-500元</p>
        <p>-500元</p>
        <p>-500元</p>
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
        MEMBERID: ''
      }
    },
    created() {
      this.dateType = this.$route.query.dateType
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
          // console.log(res)
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
        justify-content: space-between;
        font-size: 0.4rem;
        font-weight: bold;
      }
    }
  }
</style>
