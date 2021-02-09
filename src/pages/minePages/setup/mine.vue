<template>
  <div id="index_mine">
    <div class="index_mine_div">
      <scroll ref="pullrefresh">
        <!-- 个人信息 -->
        <div class="mine_top">
          <img
            class="mine_img"
            :src="
              memberInfo.avatar != null
                ? memberInfo.avatar
                : require('../../../static/image/nodata_people.png')
            "
            alt
          />
          <div class="mine_info">
            <div class="mine_person">
              <div class="mine_name">{{ memberInfo.name }}</div>
              <div class="mine_position">{{ memberInfo.position }}</div>
            </div>
            <div class="mine_store">{{ memberInfo.departmentName }}</div>
          </div>
        </div>
        <!-- 二维码/员工 -->
        <div class="code_employees">
          <ul>
            <router-link to="myQRCode">
              <li>
                <img src="../../../static/image/QRCode.png" alt />
                <span>我的二维码</span>
              </li>
            </router-link>
            <div id="mine_line"></div>
            <router-link to="myEmployees" v-show="memberInfo.isDplay">
              <li>
                <img src="../../../static/image/personal-center.png" alt />
                <span>我的员工</span>
              </li>
            </router-link>
          </ul>
          <ul>
            <router-link to="setUp">
              <li>
                <img src="../../../static/image/set.png" alt />
                <span>设置</span>
              </li>
            </router-link>
          </ul>
        </div>
      </scroll>
    </div>
    <Footer :index_leftV="tab_left" :mine_LeftV="mine_Left"></Footer>
  </div>
</template>

<script>
import Footer from "./index_home";
import scroll from "../../../components/scroll";

export default {
  name: "mine",
  components: {
    Footer,
    scroll,
  },
  data() {
    return {
      // 导购id
      MEMBERID: "",
      tab_left: false,
      mine_Left: true,
      memberInfo: {},
      isFirstEnter: false,
    };
  },
  /**
   * 路由
   */
  beforeRouteEnter(to, from, next) {
    if (from.name != "index") {
      to.meta.isBack = true;
    }
    next();
  },
  created() {
    this.isFirstEnter = true;
    if (localStorage.getItem("user")) {
      let user = localStorage.getItem("user");
      this.MEMBERID = user.replace(/\"/g, "");
      this.memberData();
    }
  },

  activated() {
    if (!this.$route.meta.isBack || !this.isFirstEnter) {
      if (localStorage.getItem("user")) {
        let user = localStorage.getItem("user");
        this.MEMBERID = user.replace(/\"/g, "");
        this.memberData();
      } else {
        this.$router.replace({
          path: "/login",
        });
      }
    }
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },

  mounted() {
    let height_ =
      document.documentElement.clientHeight -
      document.getElementById("footer").offsetHeight;
    document
      .getElementsByClassName("index_mine_div")[0]
      .setAttribute("height", `${height_}px`);
  },

  methods: {
    /**
     * 获取个人数据
     */
    memberData() {
      const that = this;
      that.$api.get(
        "my/myInfo",
        {
          guideId: that.MEMBERID,
          requestName: that.MEMBERID,
        },
        (res) => {
          // console.log(res.data);
          that.memberInfo = res.data;
          // let isDplay = res.data.isDplay;
          // if (isDplay) {
          //   this.isStaff = true;
          // } else {
          //   this.isStaff = false;
          // }
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/scss/index_mine";
</style>
