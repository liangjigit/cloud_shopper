<template>
  <div class="container_filtering">
    <div class="searchBox">
      <form method="post" class="search" id="search" @submit.prevent="submit">
        <input type="submit" name id class="searchBtn" value :style="note" />
        <input type="text" id="searchBar" results="5" placeholder="输入客户手机号" class="searchBar" v-model="searchBar" />
        <div class="filterMenu" id="filterMenu" @click="toggleClassMenu">
          <img src="../../../static/image/menu.png" alt />
        </div>
      </form>
    </div>
    <div class="ScrollBox" ref="boxHeight" :id="top">
      <scroll ref="pullrefresh" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="clientList" :isDone="isLoadingLeft" :nullDataAll="nullDataAllLeft">
        <ul class="memberList" id="memberList">
          <li v-for="(item,index) in myClient" :key="item.id" :memberId="item.id" @click="memberInfo(index)">
            <div class="memberImg">
              <img :src="item.avatar" alt />
            </div>
            <div class="memberData">
              <span class="memberName">{{item.name}}</span>
              <span class="memberCard">{{item.card}}</span>
              <span class="memberPay">
                累计消费：¥
                <b>{{item.price}}</b>
              </span>
            </div>
            <div class="memberDate">
              <span class="registrationDate">
                注册日期：
                <b>{{item.registDate}}</b>
              </span>
              <span class="recentlyPurchased">
                最近购买：
                <b>{{item.lateLyDate}}</b>
              </span>
              <span class="lastTime">
                最后联系时间：
                <b>{{item.lastContactTime}}</b>
              </span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="menu" @click="toggleClassMenu">
      <div class="app-menu" @click="toggleClassMenu">
        <div class="menu_inside">
          <p class="filterTittle">性别</p>
          <ul class="filterBox sex">
            <li id="1" :class="gender == 1 ?  'tabin_in' : ''" @click="gender = 1">男</li>
            <li id="2" :class="gender == 2 ?  'tabin_in' : ''" @click="gender = 2">女</li>
          </ul>
          <p class="filterTittle">城市</p>
          <div class="filterBox city">
            <span id="addCity">{{addressC}}</span>
            <mt-button @click.native="addressClick" class="selectBtn"></mt-button>
          </div>
          <p class="filterTittle">等级</p>
          <ul class="filterBox grade">
            <li v-for="item in grade" :type="item.id" :class="grades == item.id ? 'tabin_in' : ''" :key="item.id" @click="grades = item.id">
              {{item.name}}
            </li>
          </ul>
          <p class="filterTittle">积分范围</p>
          <form action="#" class="filterBox integral">
            <input type="number" name id="integralB" v-model="integralB" />-
            <input type="number" name id="integralE" v-model="integralE" />
          </form>
          <p class="filterTittle">注册时间</p>
          <ul class="filterBox time">
            <li class="thisday" :key="index" :type="item.type" @click="choose(index);registDate = item.type" v-for="(item,index) in optionList" :class="registDate == item.type ? 'tabin_in' : ''">
              {{ item.txt }}
            </li>
          </ul>
          <p class="filterTittle custom_date">{{timeVal}}</p>
          <p class="filterTittle">会员标签</p>
          <div class="label">
            <ul id="addLabel">
              <div v-html="label" id="chooseLabel"></div>
              <span class="addLbel" @click="addLabel">+选择标签</span>
            </ul>
          </div>
        </div>
        <div class="btns">
          <span class="clear" id="clear" @click="clear">清除</span>
          <span class="filter" id="filter" @click="filterMember">筛选</span>
        </div>
      </div>
    </div>
    <mt-popup v-model="addressVisible" position="bottom">
      <div class="pickerBtns">
        <span class="pickerN" @click="addressHide">取消</span>
        <span class="pickerY" @click="addressVal">确定</span>
      </div>
      <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
    </mt-popup>
    <transition name="fade">
      <ul class="user_edit" v-show="showTime">
        <li @click="beginTime">{{begin?begin:'开始时间'}}</li>
        <li @click="endTime">{{end?end:'结束时间'}}</li>
      </ul>
    </transition>
    <!-- mint选择时间的组件 -->
    <mt-datetime-picker type="date" ref="pickerO" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirmO" confirmText="开始时间" v-model="startDate"></mt-datetime-picker>
    <mt-datetime-picker type="date" ref="pickerT" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirmT" confirmText="结束时间" v-model="endDate"></mt-datetime-picker>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";
import address from "../../../static/json/pca.json"; //引入省市区数据
export default {
  name: "pendingMemberFilter",
  components: {
    scroll,
  },
  data() {
    return {
      label: '',
      searchBar: '',
      integralB: '',
      integralE: '',
      myClient: [],
      clientList: [],
      isShowScroll: true,
      isData: false,
      nullDataAllLeft: false,
      isLoadingLeft: true,
      status: "1",
      states: "",
      top: "top",
      checkPeopleNum: "checkPeopleNum",
      imgcheck: require("../../../static/image/checks.png"),
      //				判断是门店会员还是我的会员
      clientHeight: "",
      note: {
        backgroundImage:
          "url(" + require("../../../static/image/search_btn.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "22px 22px",
      },
      addressVisible: false,
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          className: "slot1",
          textAlign: "center",
        },
        {
          divider: true,
          content: "-",
          className: "slot2",
        },
        {
          flex: 1,
          values: ["北京"],
          className: "slot3",
          textAlign: "center",
        },
        {
          divider: true,
          content: "-",
          className: "slot4",
        },
        {
          flex: 1,
          values: [
            "东城区",
            "西城区",
            "崇文区",
            "宣武区",
            "朝阳区",
            "丰台区",
            "石景山区",
            "海淀区",
            "门头沟区",
            "房山区",
            "通州区",
            "顺义区",
            "昌平区",
            "大兴区",
            "平谷区",
            "怀柔区",
            "密云县",
            "延庆县",
            "其他",
          ],
          className: "slot5",
          textAlign: "center",
        },
      ],
      addressProvince: "",
      addressCity: "",
      addressArea: "",
      autoLabel: "",
      manualLabel: "",
      guideLabel: "",
      //				城市
      param: {
        guideId: "",
        page: "1",
        size: "100",
        dataSource: "",
        gender: "",
        address: "",
        grade: "",
        pointSmall: "",
        pointBig: "",
        registDate: "",
        startTime: "",
        endTime: "",
        autoLabel: "",
        manualLabel: "",
        guideLabel: "",
        requestName: "1",
        isShop: "",
        couponId: "",
        memberLsit: "",
        cardManagementId: "",
        cardManagermentId: "",
      },
      gender: "",
      addressC: "+选择城市",
      grades: "",
      shopGuides: "",
      pointSmall: "",
      pointBig: "",
      registDate: "",
      label: "",
      data: "",
      grade: [],
      confirm: true,
      touchBol: true,
      startDate: '',
      endDate: '',
      optionShow: false,
      optionSecondShow: false,
      timeVal: "+选择筛选时间",
      custom: false,
      //初始化日期
      defaultDate: new Date(),
      //时间戳对比
      time1: "",
      time2: "",

      //筛选条件
      dateType: "one",
      //开始时间
      begin: "",
      //结束时间
      end: "",

      optionList: [
        {
          type: "five",
          txt: "今日",
        },
        {
          type: "one",
          txt: "昨日",
        },
        {
          type: "two",
          txt: "本周",
        },
        {
          type: "three",
          txt: "本月",
        },
        {
          type: "four",
          txt: "自定义",
        },
      ],
      //				全选人数
      people: "",
      dataNull: "0",
      // 全部人数
      all: "",
      gender: '',
      showTime: false
    };
  },
  /**
   * 进入路由前操作
   */
  beforeRouteEnter(to, from, next) {
    //如果从这两个路由进来说明第第一进入该页面
    if (from.path == '/pendingMember' || from.path == '/pendingMember' || from.path == '/') {
      to.meta.isBack = false;
    } else {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    //每次进入该页面都会执行
    let user = localStorage.getItem("user");
    this.param.guideId = user.replace(/\"/g, "");
    this.param.dataSource = this.$route.query.dataSource;
    if (!this.$route.meta.isBack) {
      this.myClient = [];
      this.clear();
      this.getAllList();
    }
    this.gradeClick();
    this.$route.meta.isBack = false;
    this.clientHeight = `${document.documentElement.clientHeight}`;
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
    this.$nextTick(function () {
      this.getParams();
    });
  },
  watch: {
    clientHeight() {
      this.changeFixed(this.clientHeight);
    },
  },
  methods: {
    /**
     * 进页面后清除所有选项
     */
    clear() {
      if (document.querySelectorAll('.filterBox li')) {
        document.querySelectorAll('.filterBox li').forEach(function (item) {
          item.classList.remove('tabin_in')
        })
      }
      this.param.gender = "";
      this.param.address = "";
      this.param.grade = "";
      this.param.guideBelong = "";
      this.param.pointSmall = "";
      this.param.pointBig = "";
      this.param.registDate = "";
      this.param.startTime = "";
      this.param.endTime = "";
      this.param.autoLabel = "";
      this.param.manualLabel = "";
      this.param.guideLabel = "";
      this.gender = "";
      this.addressC = "+选择城市";
      this.grades = "";
      this.pointSmall = "";
      this.pointBig = "";
      this.registDate = "";
      this.timeVal = ''
      if (document.querySelectorAll('#addLabel li')) {
        document.querySelectorAll('#addLabel li').forEach(function (item) {
          item.outerHTML = ''
        })
      }
      if (document.querySelector('#memberList')) {
        document.querySelector('#memberList').innerHTML = ''
      }
      document.querySelector('#chooseLabel').innerHTML = ''
      this.integralB = ''
      this.integralE = ''
      this.param.page = 1;
    },
    /**
     * 获取展示数据
     */
    getAllList() {
      this.$api.post(
        "myMemberWait",
        this.param,
        (res) => {
          if (res.errcode == 0) {
            // console.log(res)
            const client = res.data;
            this.clientList = client;
            if (client.length < 10) {
              this.myClient = this.myClient.concat(client);
              this.isLoadingLeft = false;
              this.param.page = 0;
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.myClient = this.myClient.concat(client);
              this.isLoadingLeft = true;
              this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
            }
            if (this.myClient.length == 0) {
              this.nullDataAllLeft = true;
            } else {
              this.nullDataAllLeft = false;
            }
            this.isData = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 滑动时数据
     */
    scroll(data) {
      // console.log(data);
      this.scrollTop = data;
    },
    /**
     * 上拉加载数据
     */
    loadBottom() {
      const that = this;
      if (!that.isData) {
        if (that.param.page == 0) {
          return;
        } else {
          that.isData = true;
          that.param.page++;
          this.$refs.pullrefresh.$emit("infinitescroll.reInit");
          this.getAllList();
        }
      }
    },
    /**
     * 菜单切换
     */
    toggleClassMenu() {
      if (document.querySelector('.menu')) {
        let isShowMenu = document.querySelector('.menu').getAttribute('class') == 'menu menu--visible'
        if (!isShowMenu) {
          document.querySelector('.menu').setAttribute('class', 'menu menu--visible')
        } else {
          document.querySelector('.menu').setAttribute('class', 'menu')
        }
      }
    },
    /**
     * 获取等级数据
     */
    gradeClick() {
      this.$api.get(
        "/gradeList",
        {
          guideId: this.param.guideId,
          requestName: "0",
        },
        (res) => {
          if (res.errcode == 0) {
            this.grade = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
      this.gradeVisible = true;
    },
    /**
     * 获取从上个页面传来的参数
     */
    getParams() {
      // console.log(this.$route.params);
      this.states = this.$route.params.states;
      this.gender = this.$route.params.gender;
      this.grades = this.$route.params.grades;
      this.smallPoint = this.$route.params.pointSmall;
      this.bigPoint = this.$route.params.pointBig;
      this.registDate = this.$route.params.registDate;
      this.label = this.$route.params.label;
      if (
        this.$route.params.address == undefined ||
        this.$route.params.address == ""
      ) {
        this.addressC = "+选择城市";
      } else if (
        this.$route.params.address != "+选择城市" &&
        this.$route.params.address != null &&
        this.$route.params.address != undefined
      ) {
        this.addressC = this.$route.params.address;
      }
      if (
        this.$route.params.timeVal != "" &&
        this.$route.params.timeVal != null &&
        this.$route.params.timeVal != undefined
      ) {
        this.timeVal = this.$route.params.timeVal;
      }
    },
    /**
     * 搜索框筛选数据
     */
    submit() {
      this.param.name = this.searchBar;
      this.param.page = "1";
      this.myClient = [];
      this.getAllList();
    },
    /**
     * 跳转详情页
     */
    memberInfo(id) {
      this.$router.push({
        name: "customerInformation",
        query: {
          memberId: this.myClient[id].id,
          guideId: this.param.guideId,
          dataSource: this.param.dataSource,
        },
      });
    },
    /**
     * 获取城市信息
     */
    //选择城市弹出
    addressClick() {
      this.addressVisible = true;
    },
    //选择城市隐藏
    addressHide() {
      this.addressVisible = false;
    },
    //获取选择城市的值
    addressVal() {
      this.addressVisible = false;
      this.addressC = this.addressProvince + " " + this.addressCity + " " + this.addressArea
    },
    //选择城市组件
    onAddressChange(picker, values) {
      const adrs = new Array();
      const ads = address[values[0]];
      for (let key in ads) {
        //获取省下所有市
        adrs.push(key);
      }
      let adsVal = values[1];
      picker.setSlotValues(1, adrs);
      picker.setSlotValues(2, ads[adsVal]);
      const adrees = ads[adsVal];
      //获取省市区筛选后的最终数据
      // console.log(values[0]);
      // console.log(values[1]);
      // console.log(values[2]);
      this.addressProvince = values[0] ? values[0] : "";
      this.addressCity = values[1] ? values[1] : "";
      this.addressArea = values[2] ? values[2] : "";
    },
    /**
     * 注册时间选择
     */
    choose(index) {
      switch (index) {
        case 0:
          this.thisDay();
          break;
        case 1:
          this.thisYesterday();
          break;
        case 2:
          this.thisWeek();
          break;
        case 3:
          this.thisMonth();
          break;
        default:
          this.userEdit();
          break;
      }
    },
    //选择本日
    thisDay() {
      const that = this;
      that.custom = false;
      //最新时间戳
      that.defaultDate = new Date();
      that.dateType = "five";
      let day =
        that.defaultDate.getFullYear() +
        "-" +
        (that.defaultDate.getMonth() + 1 < 10
          ? "0" + (that.defaultDate.getMonth() + 1)
          : that.defaultDate.getMonth() + 1) +
        "-" +
        (that.defaultDate.getDate() - 1 < 10
          ? "0" + that.defaultDate.getDate()
          : that.defaultDate.getDate());
      that.timeVal = day;
      that.touchBol = true;
      this.$emit("sendday", [that.dateType, that.touchBol]);
      that.confirm = true;
      that.showTime = false
    },
    //选择昨日
    thisYesterday() {
      const that = this;
      that.custom = false;
      that.defaultDate = new Date();
      that.dateType = "one";
      let day =
        that.defaultDate.getFullYear() +
        "-" +
        (that.defaultDate.getMonth() + 1 < 10
          ? "0" + (that.defaultDate.getMonth() + 1)
          : that.defaultDate.getMonth() + 1) +
        "-" +
        (that.defaultDate.getDate() - 1 < 10
          ? "0" + (that.defaultDate.getDate() - 1)
          : that.defaultDate.getDate() - 1);
      that.timeVal = day;
      that.touchBol = true;
      this.$emit("sendday", [that.dateType, that.touchBol]);
      that.confirm = true;
      that.showTime = false
    },
    //选择本周
    thisWeek() {
      const that = this;
      that.dateType = "two";
      that.timeVal = that.getTime(0) + "~" + that.getTime(-6);
      // console.log(that.timeVal);
      that.touchBol = true;
      this.$emit("sendweek", [
        that.dateType,
        that.getTime(0),
        that.getTime(-6),
        that.touchBol,
      ]);
      that.confirm = true;
      that.showTime = false
    },
    //选择本月
    thisMonth() {
      const that = this;
      that.custom = false;
      that.defaultDate = new Date();
      that.dateType = "three";
      let month =
        that.defaultDate.getFullYear() +
        "-" +
        (that.defaultDate.getMonth() + 1 < 10
          ? "0" + (that.defaultDate.getMonth() + 1)
          : that.defaultDate.getMonth() + 1);
      that.timeVal = month;
      that.confirm = true;
      that.showTime = false
      that.touchBol = true;
      this.$emit("sendmonth", [that.dateType, that.touchBol]);
    },
    //获取时间
    getTime(n) {
      const that = this;
      that.defaultDate = new Date();
      let year = that.defaultDate.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      let month = that.defaultDate.getMonth() + 1;
      let date = that.defaultDate.getDate();
      let day = that.defaultDate.getDay();
      //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
      if (day !== 0) {
        n = n + (day - 1);
      } else {
        n = n + day;
      }
      if (day) {
        if (month > 1) {
          month = month;
        }
        //这个判断是为了解决跨年的问题,月份是从0开始的
        else {
          year = year - 1;
          month = 12;
        }
      }
      that.defaultDate.setDate(that.defaultDate.getDate() - n);
      year = that.defaultDate.getFullYear();
      month = that.defaultDate.getMonth() + 1;
      date = that.defaultDate.getDate();
      let s =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date);
      return s;
    },
    //自定义
    userEdit() {
      const that = this;
      //判断是否最后联系时间
      that.custom = !that.custom;
      that.dateType = "four";
      that.touchBol = !that.touchBol;
      this.$emit("sendtype", [that.dateType, that.touchBol]);
      that.confirm = false;
      that.showTime = !that.showTime
    },
    //开始时间
    beginTime() {
      const that = this;
      that.$refs.pickerO.open();
      that.confirm = false;
    },
    //结束时间mint
    endTime() {
      const that = this;
      that.$refs.pickerT.open();
      that.confirm = false;
    },
    //开始时间
    handleConfirmO(e) {
      const that = this;
      //非不是最后联系时间
      that.custom = false;
      that.confirm = true;
      that.time1 = e;
      that.begin = e.getFullYear() + "-" + (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1) + "-" + (e.getDate() < 10 ? "0" + e.getDate() : e.getDate());
      that.timeVal = `${that.begin}至${that.end}`
      //判断结束时间是否大于开始时间
      if (that.time2) {
        if (that.time2 >= that.time1) {
          that.touchBol = true;
          this.$emit("sendbegin", [that.begin, that.touchBol]);
          that.showTime = false
        } else {
          that.$messagebox({
            title: "警告",
            message: "选择的结束时间不得小于开始时间！",
            showCancelButton: false,
          });
        }
      } else {
        this.$refs.pickerT.open();
        this.$emit("sendbegin", [that.begin, that.touchBol]);
      }
    },
    //结束时间mint
    handleConfirmT(e) {
      const that = this;
      //非最后联系时间
      that.time2 = e;
      that.custom = false;
      that.confirm = true;
      that.end = e.getFullYear() + "-" + (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1) + "-" + (e.getDate() < 10 ? "0" + e.getDate() : e.getDate());
      that.timeVal = `${that.begin}至${that.end}`
      //判断开始时间是否小于结束时间
      if (that.time1) {
        if (that.time2 >= that.time1) {
          that.touchBol = true;
          this.$emit("sendend", [that.end, that.touchBol]);
          that.showTime = false
        } else {
          that.$messagebox({
            title: "警告",
            message: "选择的结束时间不得小于开始时间！",
            showCancelButton: false,
          });
        }
      } else {
        this.$refs.pickerO.open();
        this.$emit("sendend", [that.end, that.touchBol]);
      }
    },
    /**
     * 页面可视高度变化时执行
     */
    changeFixed(clientHeight) {
      //动态修改样式
      const _this = this
      if (document.querySelector('.searchBox')) {
        let searchBoxH = document.querySelector('.searchBox').offsetHeight
        _this.$refs.boxHeight.style.height = clientHeight - searchBoxH + "px";
      }
    },
    /**
     * 添加会员标签
     */
    addLabel() {
      this.param.gender = this.gender;
      if (this.addressC != "+选择城市" && this.addressC) {
        this.param.address = this.addressC;
      }
      if (document.querySelector('.grade li.tabin_in')) {
        this.param.grade = document.querySelector('.grade li.tabin_in').type;
      }
      this.param.pointSmall = this.integralB
      this.param.pointBig = this.integralE
      if (document.querySelector('.time li.tabin_in')) {
        this.param.registDate = document.querySelector('.time li.tabin_in').type;
      }
      this.$router.replace({
        path: "tags",
        query: {
          status: this.status,
          gender: this.param.gender,
          address: this.param.address,
          grades: this.param.grade,
          pointSmall: this.param.pointSmall,
          pointBig: this.param.pointBig,
          registDate: this.param.registDate,
          timeVal: this.timeVal,
          dataSource: this.param.dataSource,
        },
      });
    },
    /**
     * 做最终筛选
     */
    filterMember() {
      this.param.page = 1;
      this.param.gender = this.gender;
      let ads = this.addressC
      if (ads == "+选择城市") {
        this.param.address = "";
      } else {
        this.param.address = this.addressC;
      }
      if (document.querySelector('.grade li.tabin_in')) {
        this.param.grade = document.querySelector('.grade li.tabin_in').type;
      }
      this.param.pointSmall = this.smallPoint;
      this.param.pointBig = this.bigPoint;
      if (document.querySelector('.time li.tabin_in')) {
        this.param.registDate = document.querySelector('.time li.tabin_in').type;
      }
      if (this.param.registDate != "four") {
        this.param.startTime = "";
        this.param.endTime = "";
      } else {
        let tim = this.timeVal
        let timV = tim.split("至");
        this.param.startTime = timV[0];
        this.param.endTime = timV[1];
      }
      // document.querySelector('.memberList').innerHTML = ''
      this.myClient = []
      this.getAllList();
      this.toggleClassMenu();
    },
  },


};
</script>

<style lang="scss">
@import "../../../style/scss/pendingMemberFilter";
@font-face {
  font-family: "iconfont";
  /* project id 770909 */
  src: url("//at.alicdn.com/	t/font_770909_t92q8jeclj.eot");
  src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.woff") format("woff"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont") format("svg");
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
