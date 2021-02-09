<template>
  <div id="inviteShow">
    <header>未邀约导购</header>
    <div class="back-line"></div>
    <main>
      <ul>
        <li v-for="item in dataInfo">
          <p>姓名：{{item.shopguidename}}</p>
          <p>工号：{{item.shopguideno}}</p>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'inviteShow',
    data() {
      return {
        param: {
          code: '',
          dataType: 'SHOP',
          timeType: ''
        },
        dataInfo:[]
      }
    },
    created() {
      let {
        id,
        time
      } = this.$route.params
      this.param.code = id
      this.param.timeType = time
      this.getNoInvite()
    },
    methods: {
      /**
       * 获取未邀约导购
       */
      getNoInvite() {
        const _this = this
        _this.$api.post('my/getInvitationShopGuideNotDetail', _this.param, res => {
          // console.log(res)
          _this.dataInfo = res.data
        }, err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #inviteShow {
    header {
      height: 1rem;
      background-color: #FFFFFF;
      font-size: 0.5rem;
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      font-weight: bolder;
    }
.back-line{
  height: 0.3rem;
  background: #f0f0ef;
}
    main {
      background-color: #FFFFFF;
      padding: 0.2rem 0.3rem;
    }

    ul {
      li {
        margin: 0.4rem 0;
        font-size: 0.4rem;
        font-weight: bolder;

        p {
          padding: 0.1rem 0;
        }
      }
    }
  }
</style>
