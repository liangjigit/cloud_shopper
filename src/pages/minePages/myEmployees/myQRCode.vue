<template>
  <div id="myQRCode">
    <scroll ref="pullrefresh">
      <div class="myQRCode_div">
        <div class="myQRCodeMain" v-for="(item, index) in memberInfo" :key="index" :style="{
            backgroundImage: 'url(' + imgURL + item.backgroundImg + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '100% 100%',
          }">
          <div v-if="item.templateType == 1">
            <div class="member_avatar">
              <div class="member_logo myQRCodeCom">
                <img :src="item.avatar" alt="" class="myQRCodeCom" />
              </div>
            </div>

            <div class="menbre_Info">
              <div class="menbre_name" :style="{
                  color: item.nameColor,
                  fontSize: (item.nameSize * 2) / 75 + 'rem',
                }">
                <p>{{ item.name }}</p>

                <div class="menbre_popularize" :style="{
                    color: item.popularizingTextColor,
                    fontSize: (item.popularizingTextSize * 2) / 75 + 'rem',
                    marginTop:
                      item.shareExplainSize == '' ? '' : 96 / 75 + 'rem',
                  }">
                  <!--v-if="item.logoType"-->
                  <div class="menbre_share" :style="{
                      color: item.shareExplainColor,
                      fontSize: (item.shareExplainSize * 2) / 75 + 'rem',
                    }">
                    {{ item.shareExplain }}
                  </div>
                  {{ item.popularizingText }}
                </div>

                <div class="member_code member_codeCom">
                  <img :src="imgURL + item.qrCode" alt="" class="member_code_img member_codeCom" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.templateType == 2">
            <div class="member_avatar2">
              <div class="member_avatarInfo">
                <div class="member_logo2 myQRCodeCom">
                  <img :src="item.avatar" alt="" class="myQRCodeCom" />
                </div>
                <div class="menbre_Info2">
                  <div class="menbre_name" :style="{
                      color: item.nameColor,
                      fontSize: (item.nameSize * 2) / 75 + 'rem',
                    }">
                    <p>{{ item.name }}</p>
                    <div class="menbre_popularize menbre_popularize2" :style="{
                        color: item.popularizingTextColor,
                        fontSize: (item.popularizingTextSize * 2) / 75 + 'rem',
                      }">
                      {{ item.popularizingText }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="menbre_share menbre_share2" :style="{
                  color: item.shareExplainColor,
                  fontSize: (item.shareExplainSize * 2) / 75 + 'rem',
                }">
                {{ item.shareExplain }}
              </div>

              <div class="member_code2">
                <!--<span>-->
                <!--<p>长按二维码</p>-->
                <!--<p>进入购物平台</p>-->
                <!--</span>-->

                <img :src="imgURL + item.qrCode" alt="" class="member_code_img2 member_codeCom" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "myQRCode",
  components: {
    scroll,
  },
  data() {
    return {
      memberInfo: [],
      // 图片地址
      imgURL: this.GLOBAL.imgURL,
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      clientHeight: "",
    };
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight);
    },
  },
  created() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");

    this.geterCode();
  },

  mounted() {
    const that = this;
    // 获取浏览器可视区域高度
    that.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    window.onresize = function temp() {
      that.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },

  methods: {
    //动态修改样式
    changeFixed(clientHeight) {
      document
        .getElementsByClassName("myQRCode_div")[0]
        .setAttribute("height", `${clientHeight}px`);
    },

    geterCode() {
      let that = this;

      that.$api.get(
        "my/employeeQrCode",
        {
          guideId: that.MEMBERID,
          requestName: that.MEMBERID,
        },
        (res) => {
          // console.log(res.data);
          that.memberInfo.push(res.data);
        }
      );
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/myQRCode";
</style>
