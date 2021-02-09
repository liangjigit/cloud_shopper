<template>
  <div id="container_member">
    <div class="memberNum" id=" ">
      <img src="../../../static/image/ava.png" alt class="avatar" />
      <div class="member_num" id="allMember" @click="allMember($event)">
        <b>{{ all }}</b>
        <p>全部会员</p>
      </div>
      <!-- <span v-show="ifMember" @click="assignMembers()">分配无归属会员</span> -->
    </div>
    <div class="memberTypeTit">
      <img src="../../../static/image/xzhy.png" alt />
      <p>新增会员</p>
    </div>
    <div class="memberType">
      <ul class="typeBox">
        <li class="type" id="addedToday" @click="allMember($event)">
          <p class="membersTypeNum">{{ addedToday }}</p>
          <p class="membersTypeNam">今日新增</p>
        </li>
        <li class="type" id="addedThisweek" @click="allMember($event)">
          <p class="membersTypeNum">{{ addedThisweek }}</p>
          <p class="membersTypeNam">本周新增</p>
        </li>
        <li class="type" id="addedThismonth" @click="allMember($event)">
          <p class="membersTypeNum">{{ addedThismonth }}</p>
          <p class="membersTypeNam">本月新增</p>
        </li>
        <li class="type" id="addedThisyear" @click="allMember($event)">
          <p class="membersTypeNum">{{ addedThisyear }}</p>
          <p class="membersTypeNam">本年新增</p>
        </li>
      </ul>
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
export default {
  name: "memberListScreening",
  components: {
    scroll,
  },
  data() {
    return {
      all: "0",
      addedToday: "0",
      addedThisweek: "0",
      addedThismonth: "0",
      addedThisyear: "0",
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
      this.state = this.$route.query.state;
      // console.log(this.state)
    }
  },
  mounted() {
    //state=1门店会员 state=0我的会员
    if (this.state == "1") {
      this.getStoreMember();
    } else {
      this.getMemberList();
    }
  },
  methods: {
    /**
     * 我的会员
     */
    getMemberList() {
      this.$api.get(
        "/myMemberNum",
        {
          guideId: this.guideId,
        },
        (res) => {
          if (res.errcode == 0) {
            const info = res.data;
            this.all = info.allMember;
            this.addedToday = info.todayNew;
            this.addedThisweek = info.weekNew;
            this.addedThismonth = info.monthNew;
            this.addedThisyear = info.yearNew;
            this.todayBirthday = info.todayBirthday;
            this.tomorrowBirthday = info.tomorrowBirthday;
            this.thisWeekBirthday = info.weekBirthday;
            this.thisMonthBirthday = info.monthBirthday;
            this.activeThisMonth = info.todayActive;
            this.activeRecentMarch = info.threeActive;
            this.activeSixMonths = info.sixActive;
            this.activePastYear = info.yearActive;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },

    /**
     * 门店会员
     */
    getStoreMember() {
      this.$api.get(
        "/departmentMemberNum",
        {
          guideId: this.guideId,
        },
        (res) => {
          if (res.errcode == 0) {
            const info = res.data;
            this.all = info.allMember;
            this.addedToday = info.todayNew;
            this.addedThisweek = info.weekNew;
            this.addedThismonth = info.monthNew;
            this.addedThisyear = info.yearNew;
            this.todayBirthday = info.todayBirthday;
            this.tomorrowBirthday = info.tomorrowBirthday;
            this.thisWeekBirthday = info.weekBirthday;
            this.thisMonthBirthday = info.monthBirthday;
            this.activeThisMonth = info.todayActive;
            this.activeRecentMarch = info.threeActive;
            this.activeSixMonths = info.sixActive;
            this.activePastYear = info.yearActive;
            if ("0" == info.ifMember) {
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
     * 点击全部会员
     */
    allMember(e) {
      this.dataSource = e.currentTarget.id;
      this.$router.push({
        path: "/listFiltering",
        query: {
          dataSource: this.dataSource,
          state: this.state,
        },
      });
    },

    /**
     * 分配无归属会员
     */
    assignMembers() {
      //this.dataSource=event.currentTarget.id
      this.$router.push({
        path: "yourPath",
        name: "listFiltering",
        query: {
          //dataSource: this.dataSource,
          state: 2,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/scss/memberListScreening";
</style>
