<template>
  <div class="container" ref="homePage">
    <!-- <scroll ref="pullrefresh"> -->
    <div class="contactbox">
      <p class="contactTitle">联系方式：</p>
      <ul class="mode">
        <li v-for="(item,index) in contact" @click="addClass(index)" :class="{li_active:index==current}" :key="index">{{item.type}}</li>
      </ul>
    </div>
    <div class="matter">
      <form class="visit_type">
        <mt-radio title="选择邀约事项：" v-model="value" :options="options"></mt-radio>
      </form>
    </div>
    <div class="remarkInformation">
      <mt-field label="备注信息：" placeholder="（选填）请输入您的邀约备注信息" width="200" height="300" type="textarea" rows="8" @blur.native.capture="checkCard"></mt-field>
    </div>
    <div class="contact">
      <button class="tel" @click="back">撤销</button>
      <button class="message" @click="check">确认</button>
    </div>
    <!-- </scroll> -->
  </div>
</template>

<script>
import scroll from "../../../../components/scroll";
export default {
  name: "newOffer",
  components: {
    scroll,
  },
  data() {
    return {
      //	存放所选选项（字符串）
      value: "",
      current: 0,
      li_active: "li_active",
      //	联系方式
      contact: [
        { type: "微信" },
        { type: "短信" },
        { type: "电话" },
        { type: "面谈" },
        { type: "其他" },
      ],
      // radio的选项
      options: [],
      param: {
        guideId: "",
        memberId: "",
        typeId: "",
        remark: "",
        way: "",
      },
      guideId: "",
      clientHeight: "",
    };
  },
  created() {
    let user = localStorage.getItem("user");
    this.param.guideId = user.replace(/\"/g, "");
    this.getParams();
  },
  mounted() {
    this.param.way = document.getElementsByClassName("li_active")[0].innerHTML;
    this.getInterviewType();
    window.onresize = function () {
      this.clientHeight = "${document.documentElement.clientHeight}";
    };
    console.log(this.$refs.pullrefresh)
  },
  watch: {
    clientHeight() {
      this.changeFixed(this.clientHeight);
    },
  },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.param.memberId = this.$route.query.memberId;
      this.guideId = this.$route.query.guideId;
    },
    addClass(index) {
      this.current = index;
    },
    checkCard() {
      window.scrollTo(0, 0);
    },
    /**
     * 获取选项信息
     */
    getInterviewType() {
      this.$api.get(
        "/interviewType",
        this.param,
        (res) => {
          if (res.errcode == 0) {
            // console.log(res.data)
            const info = res.data;
            info.map(function (v) {
              v["label"] = v.name;
              v["value"] = v.typeId;
            });
            this.options = info;
            this.value = info[0].value;
            this.param.typeId = this.value;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 确认
     */
    check() {
      this.param.typeId = this.value;
      this.param.way = document.getElementsByClassName(
        "li_active"
      )[0].innerHTML;
      this.param.remark = document.getElementsByClassName(
        "mint-field-core"
      )[0].value;
      this.$indicator.open();
      this.$api.post(
        "/addinvitedReview",
        this.param,
        (res) => {
          if (res.errcode == 0) {
            this.$indicator.close();
            this.$router.replace({
              name: "customerInformation",
              query: {
                memberId: this.param.memberId,
                guideId: this.guideId,
              },
            });
          }
        },
        (err) => {
          this.$indicator.close();
          console.log(err);
        }
      );
    },
    back() {
      this.$router.replace({
        name: "customerInformation",
        query: {
          memberId: this.param.memberId,
          guideId: this.guideId,
        },
      });
    },

    changeFixed(clientHeight) {
      this.$refs.homePage.style.height = clientHeight + "px";
    },
  },
};
</script>

<style lang="scss">
@import "../../../../style/scss/newOffer";
</style>
