<template>
  <div class="container_Analysis" @click="hide">
    <datePicker
      ref="datePicker"
      v-on:sendday="receiveSendday"
      v-on:sendweek="receiveSendweek"
      v-on:sendmonth="receiveSendmonth"
      v-on:sendtype="receiveSendtype"
      v-on:sendbegin="receiveSendbegin"
      v-on:sendend="receiveSendend"
    >
    </datePicker>
    <div class="choose" @click="range" v-show="isChooseShow">
      <p class="title">选择范围</p>
      <p class="btn">
        <span class="btn_val">全部</span
        ><i class="iconfont dropDown" :class="{ flip: isShow }">&#xe60e;</i>
      </p>
    </div>
    <div class="pop-up" v-show="isShow">
      <div class="rangeBox">
        <ul class="select" id="select">
          <li id="shop" class="active" :value="param.guideId" @click="repeat">
            全部
          </li>
          <li v-for="item in guideList" :value="item.guideId" @click="repeat">
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="container_scroll" ref="homePage" :class="{ change: isChange }">
      <scroll ref="pullrefresh">
        <div class="number">
          <ul class="head">
            <li class="vipNum">{{ memberData.memberNum }}</li>
            <li class="vipText">我的会员数</li>
          </ul>
        </div>
        <ul class="vipData">
          <li>
            <h3 class="c_orange lineAdd">{{ memberData.lineAdd }}</h3>
            <p>线上新增</p>
          </li>
          <li>
            <h3 class="c_orange bindMemberNum">
              {{ memberData.bindMemberNum }}
            </h3>
            <p>绑定会员</p>
          </li>
          <li>
            <h3 class="activeMemberNum">{{ memberData.activeMemberNum }}</h3>
            <p>激活会员数</p>
          </li>
          <li>
            <h3 class="activeRate">{{ memberData.activeRate }}</h3>
            <p>活跃率</p>
          </li>
          <li>
            <h3 class="storeAdd">{{ memberData.storeAdd }}</h3>
            <p>线下新增</p>
          </li>
          <li>
            <h3 class="intervieNum">{{ memberData.intervieNum }}</h3>
            <p>邀约数</p>
          </li>
        </ul>
        <div class="echartsBox">
          <div class="item" id="grade"></div>
          <div class="item" id="analysis"></div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import vueEvent from "../../main";
import datePicker from "./datePicker";
import Scroll from "../../components/scroll";
export default {
  name: "memberAnalysis",
  data() {
    return {
      isShow: false,
      param: {
        guideId: "",
        type: "",
        code: "002",
        datetype: "",
        startTime: "",
        endTime: "",
      },
      guideList: [],
      memberData: [],
      memberDatapie: [],
      active: [],
      grade: [],
      gradeName: [],
      gradeData: [],
      activeName: [],
      activeData: [],
      clientHeight: "",
      isChooseShow: false,
      isChange: true,
      //				权限参数
      code: "",
      isFirstEnter: false,
    };
  },
  components: {
    datePicker,
    Scroll,
  },
  created() {
    this.isFirstEnter = true;
    //			let user = localStorage.getItem('user');
    //			this.param.guideId = user.replace(/\"/g, "");
  },

  activated() {
    console.log("activated");

    if (!this.$route.meta.isBack || this.isFirstEnter) {
      let user = localStorage.getItem("user");
      this.param.guideId = user.replace(/\"/g, "");

      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.role();
      this.getGuideList();
      this.getMemberData();
      this.getMemberDatapie();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
    // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
    this.isFirstEnter = false;
  },
  mounted() {
    //			this.role();
    //			this.getGuideList();
    //			this.getMemberData();
    //			this.getMemberDatapie();
    window.onresize = function temp() {
      this.clientHeight = "${document.documentElement.clientHeight}";
    };
  },
  methods: {
    role() {
      this.$api.post(
        "/my/role",
        {
          guideId: this.MEMBERID,
        },
        (res) => {
          this.code = res.data;
          console.log(this.code);
          if (this.code == "001" || this.code == "002") {
            this.isChooseShow = true;
            this.isChange = false;
          } else if (this.code == "003" || this.code == "004") {
            this.isChooseShow = false;
            this.isChange = true;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    receiveSendday(mes) {
      this.param.datetype = mes;
      this.param.startTime = "";
      this.param.endTime = "";
      this.sales = [];
      this.getMemberData();
    },
    receiveSendweek(mes) {
      this.param.datetype = mes[0];
      this.param.startTime = "";
      this.param.endTime = "";
      this.sales = [];
      this.getMemberData();
    },
    receiveSendmonth(mes) {
      this.param.datetype = mes;
      this.param.startTime = "";
      this.param.endTime = "";
      this.sales = [];
      this.getMemberData();
    },
    receiveSendtype(mes) {
      this.param.datetype = mes;
    },
    receiveSendbegin(mes) {
      this.param.startTime = mes;
      if (this.param.endTime != "") {
        this.sales = [];
        this.getMemberData();
      }
    },
    receiveSendend(mes) {
      this.param.endTime = mes;
      if (this.param.startTime != "") {
        this.sales = [];
        this.getMemberData();
      }
    },
    hide: function () {
      this.isShow = false;
      const docH = (document.documentElement.style.overflowY = "auto");
    },
    range: function (e) {
      e.stopPropagation();
      this.isShow = !this.isShow;
      const doc = document.getElementsByClassName("pop-up")[0].style.display;
      if (doc === "none") {
        const docH = (document.documentElement.style.overflowY = "hidden");
      } else {
        const docH = (document.documentElement.style.overflowY = "auto");
      }
    },
    repeat: function (e) {
      this.param.guideId = e.target.getAttribute("value");
      document.getElementsByClassName("btn_val")[0].innerHTML =
        e.target.innerHTML;
      this.isShow = false;
      document.getElementById("select").childNodes.className = "";
      if (e.target.innerHTML == "全部") {
        this.param.type = "all";
      } else {
        this.param.type = "";
      }

      let id = document.getElementById("select").children;
      for (var i = 0; i < id.length; i++) {
        if (id[i] !== e) {
          id[i].className = "";
        }
      }
      e.target.className = "active";
      this.getMemberData();
      this.getMemberDatapie();
    },
    getGuideList() {
      this.$api.get(
        "/guideList",
        {
          guideId: this.param.guideId,
          type: this.param.type,
          code: "002",
          datetype: this.param.datetype,
          startTime: this.param.startTime,
          endTime: this.param.endTime,
          requestName: "0",
        },
        (res) => {
          if (res.errcode == 0) {
            const info = res.data;
            this.guideList = info;
          }
        },
        (err) => {
          console.log(err);
          let code = err.code;
        }
      );
    },
    getMemberData() {
      this.$api.get(
        "/memberData",
        {
          guideId: this.param.guideId,
          type: this.param.type,
          code: "002",
          datetype: this.param.datetype,
          startTime: this.param.startTime,
          endTime: this.param.endTime,
          requestName: "1",
        },
        (res) => {
          if (res.errcode == 0) {
            const info = res.data;
            this.memberData = info;
          }
        },
        (err) => {
          console.log(err);
          let code = err.code;
        }
      );
    },
    getMemberDatapie() {
      this.$api.get(
        "/memberDatapie",
        {
          guideId: this.param.guideId,
          type: this.param.type,
          code: "002",
          datetype: this.param.datetype,
          startTime: this.param.startTime,
          endTime: this.param.endTime,
          requestName: "2",
        },
        (res) => {
          if (res.errcode == 0) {
            const info = res.data;
            this.memberDatapie = info;
            this.active = info.active;
            this.grade = info.grade;
            if ((this.active = info.active)) {
              for (var i = 0; i < this.active.length; i++) {
                this.activeName.push(this.active[i].name);
                this.activeData.push({
                  value: this.active[i].num,
                  name: this.active[i].name,
                });
              }
              console.log(this.activeData);
            }
            if ((this.grade = info.grade)) {
              for (var i = 0; i < this.grade.length; i++) {
                this.gradeName.push(this.grade[i].name);
                this.gradeData.push({
                  value: this.grade[i].num,
                  name: this.grade[i].name,
                });
              }
            }

            // 基于准备好的dom，初始化echarts实例
            let myChart_g = this.$echarts.init(
              document.getElementById("grade")
            );
            let myChart_a = this.$echarts.init(
              document.getElementById("analysis")
            );
            // 绘制图表
            myChart_g.setOption({
              title: {
                top: 35,
                text: "顾客等级",
                left: "center",
              },
              grid: {
                containLabel: false,
              },
              tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)",
                textStyle: {
                  fontWeight: "normal",
                  fontSize: 12,
                },
              },
              legend: {
                bottom: 20,
                data: this.gradeName,
                //							data: ['积分会员','银卡', '白金卡']
              },
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                },
                {
                  type: "pie",
                  radius: ["32.5%", "45%"],
                  center: ["50%", "47.5%"],
                  label: {
                    normal: {
                      formatter(v) {
                        let text = v.name;
                        return text.length < 4
                          ? text
                          : `${text.slice(0, 4)}\n${text.slice(4)}`;
                      },
                    },
                  },
                  data: this.gradeData,
                  //									data: [{
                  //											value:59,
                  //											name: '积分会员'
                  //										},
                  //										{
                  //											value:59,
                  //											name: '银卡'
                  //										},
                  //										{
                  //											value:62,
                  //											name: '白金卡'
                  //										},
                  //									]
                },
              ],
            });
            myChart_a.setOption({
              title: {
                top: 35,
                text: "活跃度分析",
                left: "center",
              },
              grid: {
                containLabel: false,
              },
              tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)",
                textStyle: {
                  fontWeight: "normal",
                  fontSize: 12,
                },
              },
              legend: {
                bottom: 20,
                data: this.activeName,
                //								data: ['休眠会员', 'R≤30天', '30＜R≤90天', '90＜R≤180天', '180＜R≤360天', 'R>24个月']
              },
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                },
                {
                  type: "pie",
                  radius: ["32.5%", "45%"],
                  center: ["50%", "47.5%"],
                  label: {
                    normal: {
                      formatter(v) {
                        let text = v.name;
                        return text.length < 4
                          ? text
                          : `${text.slice(0, 4)}\n${text.slice(4)}`;
                      },
                      textStyle: {
                        fontWeight: "normal",
                        fontSize: 12,
                      },
                    },
                  },
                  data: this.activeData,
                  //									data: [{
                  //											value: '',
                  //											name: '休眠会员'
                  //										}]
                },
              ],
            });
            this.gradeName.length = 0;
            this.gradeData.length = 0;
            this.activeName.length = 0;
            this.activeData.length = 0;
          }
        },
        (err) => {
          console.log(err);
          let code = err.code;
        }
      );
    },
    changeFixed(clientHeight) {
      //动态修改样式

      this.$refs.homePage.style.height =
        clientHeight -
        $(".contain").outerHeight(true) -
        $(".time").outerHeight(true) -
        $(".choose").outerHeight(true) +
        "px";
      console.log(this.$refs.homePage.style.height);
    },
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight);
    },
  },
  //  路由
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if (from.name != "mine" && from.name != "login" && from.name != null) {
      to.meta.isBack = true;
      //判断是从哪个路由过来的，
      //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }
    next();
  },
};
</script>

<style lang="scss">
@import "../../style/scss/datePicker";
@import "../../style/scss/memberAnalysis";
@import "../../style/common";
@font-face {
  font-family: "iconfont";
  /* project id 770909 */
  src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot");
  src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.woff") format("woff"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont") format("svg");
}
</style>
