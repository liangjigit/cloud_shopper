<template>
  <div class="container_filtering">
    <div class="searchBox">
      <form method="post" class="search" id="search" @submit.prevent="submit">
        <input type="text" id="searchBar" v-model="searchValue" results="5" placeholder="输入手机号或工号" class="searchBar" />
        <input type="submit" name id class="searchBtn" value :style="note" />
      </form>
    </div>
    <div class="ScrollBox" ref="boxHeight">
      <scroll ref="pullrefresh" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll" :data="searchCustomers">
        <ul class="memberList" id="memberList" v-show="hasCustomers">
          <template>
            <li @click="pitchOn">
              <div class="memberData">
                <div class="circle">
                  <div class="box" :class="{'bgColor':isBg}"></div>
                </div>
                <div class="content">
                  <p>姓名：{{changeName}}</p>
                  <p>工号：{{changeCode}}</p>
                  <p>归属门店：{{changeShopName}}</p>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </scroll>
      <div class="mt-bun" v-show="hasCustomers">
        <mt-button type="default" size="large" plain @click="sureChange">确认更换</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import scroll from "../../../../components/scroll";
import { Toast } from "mint-ui";
export default {
  name: "replaceSuperior",
  components: {
    scroll
  },
  data() {
    return {
      note: {
        backgroundImage:
          "url(" + require("../../../../static/image/search_btn.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "22px 22px"
      },
      //保存查询信息
      searchValue: "",
      //通过公司ID和员工手机号查询一人时
      searchCustomers: {},
      //当前导购id
      currentGuideId: "",
      //查询的会员ID
      memberId: "",
      //数据源
      dataSource: "",
      //判断我的会员还是门店会员
      memberstate: 0,
      isShowScroll: true,
      //当前点击会员绑定的导购id
      clickGuideId: "",
      //查看会员详细信息节流阀
      flag: true,
      //请求会员数据的节流阀
      flagGet: true,
      //公司ID
      companyId: "",
      //查询出会员数据时为true
      hasCustomers: false,
      //用户是否选择的左侧按钮
      isBg: false,
      //修改绑定关系数据3个
      changeName: "",
      changeCode: "",
      changeShopName: "",
      changeId: ""
    };
  },
  created() {
    let user = localStorage.getItem("user");
    let company = localStorage.getItem("organizationId");
    if (user) {
      this.currentGuideId = user.replace(/\"/g, "");
    }
    if (company) {
      this.companyId = company;
    }
    this.memberId = this.$route.query.memberId;
  },
  methods: {
    submit() {
      if (this.searchValue != "") {
        if (this.flagGet) {
          this.flagGet = false;
          this.$api.post(
            "my/findEmployeeInfo",
            {
              mobileOrCode: this.searchValue,
              userId: this.currentGuideId
            },
            res => {
              // console.log(res);
              if (res.errcode == 0) {
                if (res.data == null) {
                  Toast({
                    message: "该导购不存在",
                    position: "middle"
                  });
                  this.flagGet = true;
                  this.hasCustomers = false;
                } else {
                  this.changeId = res.data.id;
                  this.changeName = res.data.name;
                  this.changeCode = res.data.code;
                  this.changeShopName = res.data.shopName;
                  this.flagGet = true;
                  this.hasCustomers = true;
                }
              }
            },
            error => {
              // console.log(error);
              if (error.errcode == "102") {
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                this.hasCustomers = false;
                this.flagGet = true;
              } else if (error.errcode == "103") {
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                this.hasCustomers = false;
                this.flagGet = true;
              }
            }
          );
        }
      } else {
        Toast({
          message: "请输入手机号或工号",
          position: "middle"
        });
      }
    },
    scroll(data) {
      this.scrollTop = data;
    },
    //选中当前选择的导购
    pitchOn() {
      if (this.isBg == false) {
        this.isBg = true;
      } else {
        this.isBg = false;
      }
    },
    //确认更换
    sureChange() {
      if (this.isBg == false) {
        Toast({
          message: "请选择您要更换的对象",
          position: "middle"
        });
      } else {
        this.$api.post(
          "my/modifyBind",
          {
            memberId: this.memberId,
            guideId: this.changeId,
            userId: this.currentGuideId
          },
          res => {
            // console.log(res);
            if (res.errcode == 0) {
              Toast({
                message: "修改成功",
                position: "middle"
              });
            }
          },
          error => {
            // console.log(error);
            switch (error.errcode) {
              case "102":
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                break;
              case "103":
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                break;
              case "507":
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                break;
              case "511":
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                break;
              case "501":
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                break;
              case "510":
                Toast({
                  message: error.errmsg,
                  position: "middle"
                });
                break;
              default:
                Toast({
                  message: "请联系管理员",
                  position: "middle"
                });
                break;
            }
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../style/scss/replaceSuperior";
</style>