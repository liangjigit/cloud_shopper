<template>
  <div id="realityMoney">
    <div class="solid-pin">
      分公司邀约概况
    </div>
    <div class="Presentation" v-if="dataInfo != null">
      <div class="single">
        <p>邀约人数</p>
        <p>{{dataInfo.invitenum}}</p>
        <p v-if="dataInfo.invitenum_tb > 0" class=" increase">{{dataInfo.invitenum_tb}}&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.invitenum_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.invitenum_tb < 0" class="decrease">{{Math.abs(dataInfo.invitenum_tb)}}&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
      <div class="single">
        <p style="display: flex;justify-content: center;">回购率&nbsp;
          <van-icon name="warning" @click="showWarning" />
        </p>
        <p>{{dataInfo.returnrate}}%</p>
        <p v-if="dataInfo.returnrate_tb > 0" class=" increase">{{dataInfo.returnrate_tb}}%&nbsp;<span class="icon-arrow-up2"></span></p>
        <p v-if="dataInfo.returnrate_tb == 0" class="fair">持平</p>
        <p v-if="dataInfo.returnrate_tb < 0" class="decrease">{{Math.abs(dataInfo.returnrate_tb)}}%&nbsp;<span class="icon-arrow-down2"></span></p>
      </div>
      <div class="single">
        <p>邀约导购占比</p>
        <p>-</p>
        <p class="fair">-</p>
      </div>
      <div class="single">
        <p>全国排名</p>
        <p>-</p>
        <p class="fair">-</p>
      </div>
    </div>
    <div class="Presentation" v-else>
      <div class="single">
        <p>邀约人数</p>
        <p>0</p>
        <p class="fair">持平</p>
      </div>
      <div class="single">
        <p>回购率&nbsp;
          <van-icon name="warning" @click="showWarning" />
        </p>
        <p>0%</p>
        <p class="fair">持平</p>
      </div>
      <div class="single">
        <p>邀约导购占比</p>
        <p>-</p>
        <p class="fair">-</p>
      </div>
      <div class="single">
        <p>全国排名</p>
        <p>-</p>
        <p class="fair">-</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    Toast
  } from 'vant';
  export default {
    name: 'survey',
    props: {
      timeData: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        param: {
          userId: '',
          dataType: 'PROVINCE',
          timeType: ''
        },
        dataInfo: {},
        isShowToast: false
      }
    },
    created() {
      this.param.timeType = this.timeData
      let user = window.localStorage.getItem('user')
      if (user) {
        this.param.userId = user.replace(/\"/g, "")
      }
      this.getDataInfo()
    },
    watch: {
      timeData(v, o) {
        // console.log(v)
        this.param.timeType = v
        this.getDataInfo()
      },
    },
    methods: {
      /**
       * 获取数据
       */
      getDataInfo() {
        const _this = this
        _this.$indicator.open('数据加载中...')
        return new Promise(function(resolve, reject) {
          _this.$api.post('my/getInvitation', _this.param, res => {
            _this.dataInfo = res.data
            console.log(res)
            _this.$indicator.close()
            resolve()
          }, err => {
            console.log(err)
            reject()
          })
        })
      },
      /**
       * 提示
       */
      showWarning() {
        Toast({
          message: '在筛选时间范围下单且在之前30天内被邀约的会员记为回购\n(与邀约人数字段的查询维度不同)',
          className: 'waringbox',
          duration: 3000,
          forbidClick: true,
          overlay:true,
          // closeOnClick:true,
          // closeOnClickOverlay:true
        })
        this.clickHidden()
      },
      hiddenWraning(){
        const _this = this
        Toast.clear()
        document.body.removeEventListener('click',_this.hiddenWraning)
      },
      /**
       * 添加点击时间
       */
      clickHidden(){
        const _this = this
        document.body.addEventListener('click', _this.hiddenWraning,true)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../style/scss/realityMoney.scss";
  @import "../../../../style/icomoon/style.css";

  .solid-pin {
    background-color: #FFFFFF;
    padding: 0.4rem 0.2rem;
  }
  .single{
    p{
      &:nth-child(2){
        color: #fd9801 !important;
      }
    }
  }
</style>
