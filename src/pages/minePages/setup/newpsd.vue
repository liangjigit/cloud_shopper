<template>
  <div id="changepsd" class="newpsd">
    <scroll ref="pullrefresh" style="height: 100%">
      <ul>
        <li>
          <input
            label="密码"
            placeholder="输入新密码"
            type="password"
            @input="password_one($event)"
          />
        </li>
        <li>
          <input
            label="密码"
            placeholder="请确认密码"
            type="password"
            @input="password_two($event)"
          />
        </li>
      </ul>
      <div class="changeNext" @click="changeNext">确认</div>
    </scroll>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "newPsd",
  components: {
    scroll,
  },
  data() {
    return {
      passWord: "",
      password_new: "",
      password_affirm: "",
    };
  },

  methods: {
    //确认新密码
    changeNext() {
      const that = this;
      if (that.password_new == that.password_affirm) {
        that.$api.post(
          "my/updatePassword",
          {
            companyName: that.$route.query.companyname,
            userName: that.$route.query.userphone,
            passWord: that.password_new,
            requestName: that.$route.query.userphone,
          },
          (res) => {
            // console.log(res);
            if (res.errcode == 0) {
              that.toast("密码修改成功");
              setTimeout(function () {
                that.$router.replace({
                  path: "/mine",
                });
              }, 3000);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        that.toast("密码输入不一致，请重新输入");
      }
    },

    //mint-ui提示
    toast(message) {
      const that = this;
      that.$toast({
        message: message,
        position: "middle",
        iconClass: "icon icon-success",
        duration: 3000,
      });
    },

    //输入新密码
    password_one($event) {
      // console.log($event);
      this.password_new = $event.target.value;
    },

    //确认新密码
    password_two($event) {
      // console.log($event);
      this.password_affirm = $event.target.value;
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/changepsd";
</style>
