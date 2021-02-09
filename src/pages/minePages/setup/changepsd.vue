<template>
  <div id="changepsd">
    <scroll ref="pullrefresh" style="height: 100%">
      <ul>
        <li>
          <input
            label="公司名"
            placeholder="公司名"
            @input="companyName($event)"
          />
        </li>
        <li>
          <input
            label="手机号"
            maxlength="11"
            placeholder="请输入手机号"
            type="tel"
            class="tel"
            @input="phone($event)"
          />
          <div class="getCode" @click="getCode">
            <span :style="{ color: count > 0 ? '#aeaeae' : '' }"
              >{{ count > 0 ? "已发送（" + count + "）" : "获取验证码" }}
            </span>
          </div>
        </li>
        <li>
          <input
            label="密码"
            placeholder="请输入验证码"
            type="number"
            @input="code($event)"
          />
        </li>
      </ul>
      <div class="changeNext" @click="changeNext">下一步</div>
    </scroll>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "changePsd",
  components: {
    scroll,
  },
  data() {
    return {
      // 公司名
      companyname: "",
      // 手机号
      userphone: "",
      // 验证码
      usercode: "",
      // 获取验证码
      verificationCode: true,
      // 下一步
      nextTemp: true,
      // 定时器
      timer: null,
      //  倒计时
      count: "",
    };
  },

  methods: {
    // 获取验证码
    getCode() {
      const that = this;
      let companyName = that.companyname;
      let phone = that.userphone;
      if (
        companyName == null ||
        companyName == undefined ||
        companyName.length == 0
      ) {
        that.toast("公司名不能为空");
        return;
      } else if (phone == null || phone == undefined || phone == 0) {
        that.toast("手机号不能为空");
        return;
      } else if (!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
        that.toast("手机号有误！");
        return;
      }
      // 获取验证码
      //60S内不可重复获取验证码
      if (!that.verificationCode) return;
      that.$api.get(
        "my/code",
        {
          companyName: that.companyname,
          username: that.userphone,
          requestName: that.userphone,
        },
        (res) => {
          // console.log(res);
          that.toast("验证码已发送");
          const TIME_COUNT = 60;
          //如果timer为null进入
          if (!that.timer) {
            that.count = TIME_COUNT;
            that.verificationCode = false;
            that.timer = setInterval(() => {
              if (that.count > 0 && that.count <= TIME_COUNT) {
                that.count--;
              } else {
                that.verificationCode = true;
                clearInterval(that.timer);
                that.timer = null;
              }
            }, 1000);
          }
        },
        (err) => {
          // console.log(err);
          console.log("请求出错");
          this.verificationCode = true;
          let code = err.errcode;
          switch (code) {
            case "109":
              that.toast("组织不存在");
              break;
            case "103":
              that.toast("用户不存在");
              break;
            case "104":
              that.toast("用户名或密码错误");
              break;
            case "501":
              that.toast("用户已停用");
              break;
          }
        }
      );
    },

    // 提示
    toast(messages) {
      const that = this;

      that.$toast({
        message: messages,
        position: "middle",
        iconClass: "icon icon-success",
        duration: 3000,
      });
    },

    //获取公司名
    companyName($event) {
      // console.log($event);
      this.companyname = $event.target.value;
    },

    //获取手机号
    phone($event) {
      // console.log($event);
      this.userphone = $event.target.value;
    },

    //获取验证码
    code($event) {
      // console.log($event);
      this.usercode = $event.target.value;
    },

    //进行下一步
    changeNext() {
      const that = this;
      //判断是否进行下一步
      if (!that.nextTemp) return;
      that.nextTemp = false;
      that.$api.post(
        "my/validationCode",
        {
          code: that.usercode,
          username: that.userphone,
          requestName: that.userphone,
        },
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            that.nextTemp = true;
            that.$router.replace({
              path: "/newPsd",
              query: {
                // 公司
                companyname: that.companyname,
                // 手机号
                userphone: that.userphone,
              },
            });
          }
        },
        (err) => {
          // console.log(err);
          that.nextTemp = false;
          let code = err.errcode;
          switch (code) {
            case "106":
              that.toast("验证码错误");
              break;
            case "105":
              that.toast("验证码已过期");
              break;
          }
        }
      );
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/changepsd";
#changepsd {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
