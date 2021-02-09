<template>
  <div id="container_member">
    <div class="memberNum">
      <img src="../../../static/image/ava.png" alt class="avatar" />
      <div class="member_num" id='allMember' @click="allMember($event)">
        <b>{{ all }}</b>
        <p>待绑定会员</p>
      </div>
      <span v-show="ifMember" @click="assignMembers()">清除待绑定关系</span>
    </div>
    <div class="memberTypeTit" id="addedToday ">
      <img src="../../../static/image/srhy.png" alt />
      <p>生日会员</p>
    </div>
    <div class="memberType">
      <ul class="typeBox">
        <li class="type" id="todayBirthday" @click="allMember($event)">
          <p class="membersTypeNum">{{ todayBirthday }}</p>
          <p class="membersTypeNam">今日生日</p>
        </li>
        <li class="type" id="tomorrowBirthday" @click="allMember($event)">
          <p class="membersTypeNum">{{ tomorrowBirthday }}</p>
          <p class="membersTypeNam">明日生日</p>
        </li>
        <li class="type" id="thisWeekBirthday" @click="allMember($event)">
          <p class="membersTypeNum">{{ thisWeekBirthday }}</p>
          <p class="membersTypeNam">本周生日</p>
        </li>
        <li class="type" id="thisMonthBirthday" @click="allMember($event)">
          <p class="membersTypeNum">{{ thisMonthBirthday }}</p>
          <p class="membersTypeNam">本月生日</p>
        </li>
      </ul>
    </div>
    <div class="memberTypeTit">
      <img src="../../../static/image/hyhy.png" alt />
      <p>活跃会员</p>
    </div>
    <div class="memberType">
      <ul class="typeBox">
        <li class="type" id="activeThisMonth" @click="allMember($event)">
          <p class="membersTypeNum">{{ activeThisMonth }}</p>
          <p class="membersTypeNam">本月活跃</p>
        </li>
        <li class="type" id="activeRecentMarch" @click="allMember($event)">
          <p class="membersTypeNum">{{ activeRecentMarch }}</p>
          <p class="membersTypeNam">近三个月</p>
        </li>
        <li class="type" id="activeSixMonths" @click="allMember($event)">
          <p class="membersTypeNum">{{ activeSixMonths }}</p>
          <p class="membersTypeNam">近六个月</p>
        </li>
        <li class="type" id="activePastYear" @click="allMember($event)">
          <p class="membersTypeNum">{{ activePastYear }}</p>
          <p class="membersTypeNam">近一年</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";
import { MessageBox, Toast } from "mint-ui";
export default {
  name: "pendingMember",
  components: {
    scroll,
  },
  data() {
    return {
      all: "0",
      todayBirthday: "0",
      tomorrowBirthday: "0",
      thisWeekBirthday: "0",
      thisMonthBirthday: "0",
      activeThisMonth: "0",
      activeRecentMarch: "0",
      activeSixMonths: "0",
      activePastYear: "0",
      guideId: "",
      state: "",
      type: "",
      dataSource: "",
      ifMember: false,
    };
  },
  created() {
    let user = localStorage.getItem("user");
    if (user) {
      this.guideId = user.replace(/\"/g, "");
    }
  },
  mounted() {
    this.getStoreMember();
  },
  methods: {
    /**
     * 获取展示数据
     */
    getStoreMember() {
      this.$api.post(
        "/myMemberNumWait",
        {
          guideId: this.guideId,
        },
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            const info = res.data;
            this.all = info.allMember;
            this.thisMonthBirthday = info.monthBirthday;
            this.activeSixMonths = info.sixActive;
            this.activeThisMonth = info.todayActive;
            this.activeRecentMarch = info.threeActive;
            this.todayBirthday = info.todayBirthday;
            this.tomorrowBirthday = info.tomorrowBirthday;
            this.thisWeekBirthday = info.weekBirthday;
            this.activePastYear = info.yearActive;
            if ("1" == info.storemanager) {
              this.ifMember = true;
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 点击进入详情列表
     */
    allMember(e) {
      this.dataSource = e.currentTarget.id;
      this.$router.push({
        name: "pendingMemberFilter",
        query: {
          dataSource: this.dataSource,
        },
      });
    },
    /**
     * 清除待绑定关系
     */
    assignMembers() {
      const _this = this;
      MessageBox.confirm(
        "该操作会清除掉门店内所有导购的待绑定关系，确认清除吗？"
      ).then((action) => {
        _this.$api.post(
          "my/clearShopWaitBindMember",
          {
            guideId: _this.guideId,
          },
          (res) => {
            // console.log(res);
            if (res.errcode == 0) {
              Toast("清除成功");
            } else {
              Toast("清除失败");
            }
          },
          (err) => {
            // console.log(err);
            Toast("清除失败，请联系管理人员");
          }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/scss/pendingMember";
</style>
