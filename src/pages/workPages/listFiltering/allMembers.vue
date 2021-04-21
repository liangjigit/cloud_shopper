<template>
  <div class="container_filtering">
    <div class="searchBox">
      <form method="post" class="search" id="search" @submit.prevent="submit">
        <input type="text" name id="searchBar" value v-model="searchValue" results="5" placeholder="输入手机号或会员卡号"
          class="searchBar" />
        <input type="submit" name id class="searchBtn" value :style="note" />
      </form>
    </div>
    <div class="ScrollBox" ref="boxHeight">
      <scroll ref="pullrefresh" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll"
        :data="searchCustomers">
        <ul class="memberList" id="memberList">
          <template>
            <li @click="judgePage" v-if="hasCustomers">
              <div class="memberImg">
                <img :src="searchCustomers.avatar" alt class="memberHead" />
              </div>
              <div class="memberData">
                <span class="memberName">{{searchCustomers.name}}<span class="unbind"
                    v-if="searchCustomers.unbindSoon == 1 && searchCustomers.unbindPeriod == true">即将解绑</span></span>
                <span class="memberCard">{{searchCustomers.gradeName}}</span>
                <span class="memberPay">
                  累计消费：¥
                  <b>{{searchCustomers.cumulativeSum}}</b>
                </span>
              </div>
              <div class="memberDate">
                <span class="registrationDate">
                  注册日期：
                  <b>{{searchCustomers.registTime}}</b>
                </span>
                <span class="recentlyPurchased">
                  最近购买：
                  <b>{{searchCustomers.finalConsumptionTime}}</b>
                </span>
              </div>
            </li>
          </template>
        </ul>
      </scroll>
    </div>
  </div>
</template>
<script>
  import {
    Toast
  } from "mint-ui";
  import scroll from "../../../components/scroll";
  export default {
    name: "allMembers",
    components: {
      scroll,
    },
    data() {
      return {
        note: {
          backgroundImage: "url(" + require("../../../static/image/search_btn.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "22px 22px",
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
        //用户判断是一个进来的页面
        prevPage: "",
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
      this.prevPage = this.$route.params.compMember;
    },
    methods: {
      submit() {
        if (this.flagGet) {
          this.flagGet = false
          this.$api.post(
            "findBasicsMemberDatas", {
              nameOrPhone: this.searchValue,
              organizationId: this.companyId,
            },
            (res) => {
              if (res.data == null) {
                Toast({
                  message: "该会员不存在",
                  position: "middle",
                })
                this.flagGet = true
              } else {
                this.hasCustomers = true
                this.searchCustomers = res.data
                this.flagGet = true
              }
            },
            (err) => {
              this.hasCustomers = false;
              Toast({
                message: "根据您提供的手机号码没有查询到会员",
                position: "middle",
              });
              this.flagGet = true;
            }
          );
        }
      },
      //滚动函数
      scroll(data) {
        // console.log(data);
        this.scrollTop = data;
      },
      /**
       * 判断从哪个页面进入当前页
       */
      judgePage() {
        if (this.prevPage == "016") {
          // console.log("我是从016进入的");
          this.memberInfo();
        } else {
          // console.log("我是从017进入的");
          this.changeBinding();
        }
      },
      /**
       * 从绑定查询入口进入
       */
      memberInfo() {
        if (this.flag) {
          this.flag = false;
          this.memberId = this.searchCustomers.id;
          this.clickGuideId = this.searchCustomers.guideId;
          this.dataSource = this.searchCustomers.dataSource;
          if (this.clickGuideId == this.currentGuideId) {
            this.$router.push({
              name: "customerInformation",
              query: {
                memberId: this.memberId,
                guideId: this.clickGuideId,
                state: this.memberstate,
                dataSource: this.dataSource,
                compMember: "016",
              },
            });
            this.flag = true;
          } else if (
            this.clickGuideId != this.currentGuideId &&
            this.clickGuideId != null
          ) {
            Toast({
              message: "该会员已经和其他导购建立绑定关系，请先对已绑定会员加以维护",
              position: "middle",
            });
            this.flag = true;
          } else if (this.clickGuideId == null) {
            Toast({
              message: "该会员暂无绑定导购，快去和会员建立绑定关系吧~",
              position: "middle",
            });
            this.flag = true;
          }
        }
      },
      //从修改绑定关系进入
      changeBinding() {
        this.$router.push({
          name: "customerInformation",
          query: {
            memberId: this.searchCustomers.id,
            guideId: this.searchCustomers.guideId,
            state: this.memberstate,
            dataSource: this.searchCustomers.dataSource,
            compMember: "017",
          },
        });
      },
    }
  };
</script>
<style lang="scss">
  @import "../../../style/scss/allMembers";

  .unbind {
    color: red;
    border: 2px solid red;
    width: fit-content;
    display: inline !important;
    border-radius: 8px;
    font-size: 0.1rem;
    padding: 0.05rem;
    margin-left: 0.2rem;
  }
</style>
