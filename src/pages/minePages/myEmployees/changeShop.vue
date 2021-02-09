<template>
  <div class="dealShop">
    <div class="changeShop" v-if="beChange">
      <div class="search">
        <div class="input">
          <input type="text" placeholder="  输入门店代码" v-model="inputV" />
        </div>
        <div class="img" @click="searchShop">
          <img src="../../../static/image/search_btn.png" alt />
        </div>
      </div>
      <div class="result">
        <div class="isResult" v-if="hasShop" @click="selShop">
          <div class="circle">
            <div class="circle-ball" :class="{ selBall: isSel }"></div>
          </div>
          <div class="info">
            <p>门店代码：{{ shopCode }}</p>
            <p>门店名称：{{ shopName }}</p>
          </div>
        </div>
        <div class="noResult" v-if="noShop">
          <p>暂无该门店，请联系总部申请开通</p>
        </div>
      </div>
      <div class="button" v-if="isSel" @click="sureChange">
        <mt-button type="primary" size="large">下一步</mt-button>
      </div>
    </div>
    <div class="changeSuc" v-else>
      <div class="changeOver">
        <p>该员工名下现有{{ memberNum }}名可分配会员</p>
      </div>
      <div class="changeNew">
        <div class="compBack">
          <p>公司收回</p>
          <p @click="toCompB">取消上级分销员</p>
          <img src="../../../static/image/more.png" @click="toCompB" />
        </div>
        <div class="compBack">
          <p>店内分配</p>
          <p @click="toShopA">{{ list.shopName }}</p>
          <img src="../../../static/image/more.png" @click="toShopA" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "changeShop",
  data() {
    return {
      inputV: "",
      isSel: false,
      beChange: true,
      hasShop: false,
      noShop: false,
      userId: "",
      state: "",
      shopCode: "",
      shopName: "",
      shopId: "",
      guideId: "",
      memberNum: "",
      list: {},
    };
  },
  // watch: {
  //   inputV(a, b) {
  //     console.log(a, b);
  //   }
  // },
  methods: {
    //获取当前门店信息的名字
    getNowShopName() {
      // console.log(JSON.parse(this.$route.query.list));
      this.list = JSON.parse(this.$route.query.list);
    },
    //查找门店信息
    searchShop() {
      const _this = this;
      _this.$api.post(
        "getShopInfo",
        {
          userId: _this.userId,
          code: _this.inputV,
        },
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            if (res.data == null) {
              _this.hasShop = false;
              _this.noShop = true;
              _this.isSel = false;
            } else {
              _this.shopCode = res.data.code;
              _this.shopName = res.data.name;
              _this.shopId = res.data.id;
              _this.hasShop = true;
              _this.noShop = false;
              _this.isSel = false;
            }
          }
        },
        (err) => {
          // console.log(err);
          if (err.errcode == 102) {
            _this.hasShop = false;
            _this.noShop = false;
            _this.isSel = false;
            MessageBox("提示", "您的输入不能为空");
          }
        }
      );
    },
    selShop() {
      if (!this.isSel) {
        this.isSel = true;
      } else {
        this.isSel = false;
      }
    },
    //点击下一步
    sureChange() {
      const _this = this;
      _this.$api.post(
        "my/findSameShopMemberCount",
        {
          guideId: _this.guideId,
          // guideId: "1"
        },
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            // console.log(res.data);
            if (res.data == 0) {
              MessageBox.confirm("确认进行员工调店操作吗？").then((action) => {
                _this.$api.post(
                  "my/changeStoresNoBind",
                  {
                    userId: _this.userId,
                    guideId: _this.guideId,
                    changeShopId: _this.shopId,
                  },
                  (res) => {
                    // console.log(res);
                    if (res.errcode == 0) {
                      MessageBox.alert("操作成功").then((action) => {
                        _this.$router.push("myEmployees");
                      });
                    }
                  },
                  (err) => {
                    // console.log(err);
                    let errCode = err.errcode;
                    let errMsg = err.errmsg;
                    switch (errCode) {
                      case "103":
                        MessageBox("提示", errMsg);
                        break;
                      case "513":
                        MessageBox("提示", errMsg);
                        break;
                      case "514":
                        MessageBox("提示", errMsg);
                        break;
                    }
                  }
                );
              });
            } else {
              _this.memberNum = res.data;
              _this.beChange = false;
            }
          }
        },
        (err) => {
          // console.log(err);
          let errCode = err.errcode;
          let errMsg = err.errmsg;
          // console.log(errCode);
          switch (errCode) {
            case "102":
              MessageBox("提示", errMsg);
              break;
            case "103":
              MessageBox("提示", errMsg);
              break;
            case "510":
              MessageBox("提示", errMsg);
              break;
          }
        }
      );
    },
    toCompB() {
      const _this = this;
      MessageBox.confirm("确认进行员工调店操作吗？").then((action) => {
        _this.$api.post(
          "my/changeStoresRecovery",
          {
            userId: _this.userId,
            guideId: _this.guideId,
            changeShopId: _this.shopId,
          },
          (res) => {
            // console.log(res);
            if (res.errcode == 0) {
              MessageBox.alert("操作成功").then((action) => {
                _this.$router.push("myEmployees");
              });
            }
          },
          (err) => {
            // console.log(err);
            let errCode = err.errcode;
            let errMsg = err.errmsg;
            switch (errCode) {
              case "103":
                MessageBox("提示", errMsg);
                break;
              case "513":
                MessageBox("提示", errMsg);
                break;
              case "514":
                MessageBox("提示", errMsg);
                break;
            }
          }
        );
      });
    },
    toShopA() {
      const _this = this;
      _this.$router.push({
        path: "storeAllocation",
        query: {
          userId: _this.userId,
          id: _this.guideId,
          changeShopId: _this.shopId,
          state: _this.state,
          memberNum: _this.memberNum,
        },
      });
    },
  },
  created() {
    this.guideId = this.$route.query.id;
    this.state = this.$route.query.state;
    let user = window.localStorage.getItem("user");
    this.userId = user.replace(/\"/g, "");
    this.getNowShopName();
  },
};
</script>
<style lang="scss">
@import "../../../style/scss/changeShop.scss";
</style>