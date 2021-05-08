<template>
  <div id="login">
    <scroll ref="pullrefresh" style="height: 100%">
      <div class="company_logo">
        <img :src="imgCom" alt />
      </div>
      <div class="login_tit">登录导购助手账号</div>
      <ul>
        <li>
          <input label="公司名" placeholder="公司名" @input="companyName($event)" />
        </li>
        <li>
          <input label="用户名" placeholder="用户名" type="text" @input="userName($event)" />
        </li>
        <li>
          <input label="密码" placeholder="密码" type="password" @input="passWord($event)" />
        </li>
        <router-link to="changePsd">
          <div class="forget">忘记密码？</div>
        </router-link>
      </ul>
      <div class="loginBtn" @click="loginBtn">登录</div>
    </scroll>
  </div>
</template>

<script>
  import scroll from "../components/scroll";

  export default {
    components: {
      scroll,
    },
    name: "login",
    data() {
      return {
        imgCom: require("../static/image/logo-target.png"),
        // 公司名
        companyname: "",
        //密码
        password: "",
        // 用户名
        username: "",
        // 是否从详情页进来
        fromCust: false
      };
    },
    created() {
      const fromCust = this.$route.query.fromCust
      if (fromCust == 'customerInformation') this.fromCust = true
    },
    methods: {
      // 登录
      loginBtn() {
        const that = this;
        that.$api.post(
          "my/login", {
            username: that.username,
            password: that.password,
            companyName: that.companyname,
            requestName: that.username,
          },
          (res) => {
            // console.log(res);
            const dataList = res.data;
            // console.log(dataList);
            that.$store.commit("$_setStorage", res.data.id);
            that.$store.commit("$_setLogin", "1");
            that.$store.commit("$_setOrganizationId", res.data.organizationId);
            that.toast("登录成功", 1000);
            setTimeout(function() {
              if (that.fromCust) {
                that.fromCust = false
                that.$router.replace({
                  path: "/customerInformation",
                  name: "customerInformation",
                  // query: { id: res.data.id },
                });
              } else {
                that.$router.replace({
                  path: "/",
                  name: "index",
                  query: {
                    id: res.data.id
                  },
                });
              }
            }, 1000);
          },
          (err) => {
            // console.log(err);
            let code = err.errcode;
            switch (code) {
              case "109":
                that.toast("组织不存在", 3000);
                break;
              case "103":
                that.toast("用户不存在", 3000);
                break;
              case "104":
                that.toast("用户名或密码错误", 3000);
                break;
              case "501":
                that.toast("用户已停用", 3000);
                break;
            }
          }
        );
      },

      // mint-ui提示
      toast(message, duration) {
        const that = this;
        that.$toast({
          message: message,
          position: "middle",
          iconClass: "icon icon-success",
          duration: duration,
        });
      },

      // 公司名
      companyName($event) {
        // console.log($event);
        this.companyname = $event.target.value;
      },

      // 用户名
      userName($event) {
        // console.log($event);
        this.username = $event.target.value;
      },

      // 密码
      passWord($event) {
        // console.log($event);
        this.password = $event.target.value;
      },
    },
  };
</script>

<style lang="scss">
  @import "../style/scss/login";
</style>
