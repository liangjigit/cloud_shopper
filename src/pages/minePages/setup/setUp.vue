<template>
  <div id="setUp">
    <scroll ref="pullrefresh">
      <router-link to="changePsd">
        <div class="change_psw">
          <img src="../../../static/image/lock.png" alt="" />
          <div>修改密码</div>
        </div>
      </router-link>
      <div class="exit_btn" @click="exit_btn">退出</div>
    </scroll>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "setUp",
  components: {
    scroll,
  },
  methods: {
    exit_btn() {
      const that = this;
      that.$messagebox
        .confirm("", {
          message: "是否退出？",
          title: "提示",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then((action) => {
          //确认的回调
          if (action == "confirm") {
            localStorage.clear();
            this.$router.replace({
              path: "/login",
              name: "login",
            });
          }
        })
        .catch((err) => {
          //取消的回调
          if (err == "cancel") {
            console.log("取消");
          }
        });
    },
  },
};
</script>

<style lang="scss">
#setUp {
  font-family: SourceHanSansCN-Regular;
  padding-top: 28px;
  position: fixed;
  width: 100%;

  .change_psw {
    height: 118px;
    display: flex;
    align-items: center;
    background: #fff;
    margin-bottom: 73px;

    img {
      height: 37px;
      padding: 0 20px 0 41px;
    }
    div {
      font-size: 28px;
      color: #333333;
    }
  }

  .change_psw::after {
    content: "\e72b";
    font-family: "iconfont";
    height: 118px;
    position: absolute;
    right: 27px;
    line-height: 118px;
    font-size: 34px;
    color: #999;
  }

  .exit_btn {
    width: 708px;
    height: 80px;
    background-color: #e56a69;
    border-radius: 4px;
    font-size: 30px;
    color: #ffffff;
    margin: 0 auto;
    text-align: center;
    line-height: 80px;
  }
}
</style>
