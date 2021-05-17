<template>
  <div id="launchMiniprogram">
    <main>
      <header>
        <p>引导会员注册club，即可查询到会员信息(仅针对未注册club的会员)</p>
      </header>
      <footer>
        <a v-if="isShowLaunch" @click="toMini">点击进入CLUB，一键转发，注册绑定</a>
      </footer>
    </main>
  </div>
</template>

<script>
  import {
    WxRegistered
  } from '../../../../util/wxConfig.js'
  import {
    Indicator
  } from "mint-ui";
  export default {
    name: 'launchMiniprogram',
    data() {
      return {
        isShowLaunch: false
      }
    },
    mounted() {
      const _this = this
      this.organizationId = window.localStorage.organizationId;
      Indicator.open()
      this.$nextTick(() => {
        window.setTimeout(function() {
          // 注入微信权限
          _this.getWxPermission().then(res => {
            Indicator.close()
            _this.isShowLaunch = true
          })
        }, 100)
      })
    },
    methods: {
      toMini() {
        //跳转裂变活动
        wx.invoke('launchMiniprogram', {
          "appid": "wx9b801423992ecd1e", // 需跳转的小程序appid
          "path": "pages/index/index", // 所需跳转的小程序内页面路径及参数。非必填
        }, function(res) {
          if (res.err_msg == "launchMiniprogram:ok") {
            // 正常
            console.log(res)
          } else {
            // 错误处理
            console.log(res)
          }
        });
      },
      /**
       * 给当前页面注入应用微信权限
       */
      getWxPermission() {
        return new Promise((resolve, reject) => {
          const url = location.href.split("#")[0];
          // this.$api.post('my/getCpParameterApplication', {
          //   url: loCa
          // }
          // console.log(this.organizationId)
          // console.log(url)
          this.$api.post(
            "my/getCpParameter", {
              organizationId: this.organizationId,
              url,
            },
            res => {
              // console.log('获取注入微信的参数')
              // console.log(res.data);
              WxRegistered(res.data).then(response => {
                resolve()
              }).catch(err => {
                // console.log(err)
                this.$toast({
                  message: "企业微信权限注入失败",
                  position: "middle",
                });
              })
            },
            err => {
              console.log(err);
            }
          );
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  #launchMiniprogram {
    width: 100vw;
    height: 100vh;

    main {
      position: fixed;
      top: 20%;
      // transform: translateY(-50%);
      width: 100vw;
      height: 6rem;

      header {
        width: 100vw;
        height: 50%;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.5rem;
        font-weight: bold;
      }

      footer {
        width: 100vw;
        height: 50%;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.4rem;
        font-weight: bold;
        color: #26a2ff;
        text-decoration: underline;
      }
    }
  }
</style>
