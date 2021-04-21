<template>
  <div class="container_filtering">
    <div class="searchBox">
      <form method="post" class="search" id="search" @submit.prevent="submit">
        <input type="submit" class="searchBtn" value :style="note" />
        <input type="text" id="searchBar" results="5" placeholder="输入会员手机号码/会员卡号" class="searchBar"
          v-model="searchBar" />
        <!-- 右上角筛选框 -->
        <div class="filterMenu" id="filterMenu" @click="toggleClassMenu">
          <img src="../../../static/image/menu.png" alt />
        </div>
      </form>
    </div>
    <div class="check" v-if="memberstate == 2 || memberstate == 3">
      <div class="allCheckBox">
        <label class="allChecK" @click="isAllChecked()">
          <img :src="imgcheck" />
        </label>
        <span>全选</span>
        <span :class="memberstate == 3 ? checkPeopleNum : ''">
          已选
          <b>{{selectedCount}}</b>人
        </span>
      </div>
      <div class="checkNum" v-if="memberstate == 2">共{{ all }}人</div>
    </div>
    <!-- 会员列表，利用better-scroll -->
    <div class="ScrollBox" ref="boxHeight" :id="memberstate == 2 || memberstate == 3 ? top : ''">
      <scroll ref="pullrefresh" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll"
        @scrollToEnd="loadBottom" :data="clientList" :isDone="isLoadingLeft" :nullDataAll="nullDataAllLeft">
        <ul class="memberList" id="memberList" style="margin: 0">
          <template v-if="memberstate == 0 || memberstate == 1">
            <li v-for="(item, id) in myClient" :key="id" :memberId="item.id" @click="memberInfo(id)">
              <div class="memberImg" style="margin-left: 0.3rem">
                <img :src="item.avatar == '' || item.avatar == null ? null : ''" alt class="memberHead" />
              </div>
              <div class="memberData" style="margin-left: 0.2rem; width: 33%">
                <span class="memberName">{{ item.name }}
                  <span class="unbind" v-if="item.unbindSoon == 1 && item.unbindPeriod == true">即将解绑</span></span>
                <span class="memberCard">{{ item.card }}</span>
                <span class="memberPay">
                  累计消费：¥
                  <b>{{ item.price }}</b>
                </span>
              </div>
              <div class="memberDate">
                <span class="registrationDate">
                  注册日期：
                  <b>{{ item.registDate }}</b>
                </span>
                <span class="recentlyPurchased">
                  最近购买：
                  <b>{{ item.lateLyDate }}</b>
                </span>
                <span class="lastTime">
                  最后联系时间：
                  <b>{{ item.lastContactTime }}</b>
                </span>
              </div>
            </li>
          </template>
          <template v-else-if="memberstate == 2">
            <li v-for="(item, id) in myClient" :memberId="item.id" :key="id">
              <label ref="labelC" v-if="memberstate == 2" :for="item.id" style="margin-left: 0.3rem"
                @click="assignMembers(id)">
                <img :src="imgcheck" />
              </label>
              <div class="memberImg">
                <img :src="item.avatar" alt class="memberHead" />
              </div>
              <div class="memberData" style="margin-left: 0.2rem; width: 30%">
                <span class="memberName">{{ item.name }}<span class="unbind"
                    v-if="item.unbindSoon == 1 && item.unbindPeriod == true">即将解绑</span></span>
                <span class="memberCard">{{ item.card }}</span>
                <span class="memberPay">
                  累计消费：¥
                  <b>{{ item.price }}</b>
                </span>
              </div>
              <div class="memberDate">
                <span class="registrationDate">
                  注册日期：
                  <b>{{ item.registDate }}</b>
                </span>
                <span class="recentlyPurchased">
                  最近购买：
                  <b>{{ item.lateLyDate }}</b>
                </span>
                <span class="lastTime">
                  最后联系时间：
                  <b>{{ item.lastContactTime }}</b>
                </span>
              </div>
            </li>
          </template>
          <template v-else-if="memberstate == 3">
            <li v-for="(item, id) in myClient" :memberId="item.id" :key="id">
              <label ref="labelC" v-if="memberstate == 3" :for="item.id" style="margin-left: 0.3rem"
                @click="assignMembers(id)">
                <img :src="imgcheck" />
              </label>
              <div class="memberImg">
                <img :src="item.avatar" alt class="memberHead" />
              </div>
              <div class="memberData" style="margin-left: 0.2rem; width: 30%">
                <span class="memberName">{{ item.name }}<span class="unbind"
                    v-if="item.unbindSoon == 1 && item.unbindPeriod == true">即将解绑</span></span>
                <span class="memberCard">{{ item.card }}</span>
                <span class="memberPay">
                  累计消费：¥
                  <b>{{ item.price }}</b>
                </span>
              </div>
              <div class="memberDate">
                <span class="registrationDate">
                  注册日期：
                  <b>{{ item.registDate }}</b>
                </span>
                <span class="recentlyPurchased">
                  最近购买：
                  <b>{{ item.lateLyDate }}</b>
                </span>
                <span class="lastTime">
                  最后联系时间：
                  <b>{{ item.lastContactTime }}</b>
                </span>
              </div>
            </li>
          </template>
        </ul>
      </scroll>
    </div>
    <!-- 隐藏的筛选 -->
    <div class="menu" @click="toggleClassMenu">
      <div class="app-menu" @click="toggleClassMenu">
        <div class="menu_inside">
          <p class="filterTittle">性别</p>
          <ul class="filterBox sex">
            <li id="1" :class="gender == 1 ?  'tabin_in' : ''" @click="gender = 1">男</li>
            <li id="2" :class="gender == 2 ?  'tabin_in' : ''" @click="gender = 2">女</li>
          </ul>
          <!-- <p class="filterTittle">城市</p>
          <div class="filterBox city">
            <span id="addCity">{{ addressC }}</span>
            <mt-button @click.native="addressClick" class="selectBtn"></mt-button>
          </div> -->
          <p class="filterTittle">绑定状态</p>
          <ul class="filterBox sex">
            <li :class="param.unbindSoon == '1' ?  'tabin_in' : ''" @click="unbindSoon">即将解绑</li>
          </ul>
          <p class="filterTittle">等级</p>
          <ul class="filterBox grade">
            <li v-for="item in grade" :type="item.id" :class="grades == item.id ? 'tabin_in' : ''" :key="item.id"
              @click="grades = item.id">
              {{ item.name }}
            </li>
          </ul>
          <p class="filterTittle" v-show="isshopGuide">归属导购</p>
          <ul class="filterBox shopGuide" v-show="isshopGuide">
            <li v-for="item in shopGuide" :type="item.guideId" :class="shopGuides == item.guideId ? 'tabin_in' : ''"
              :key="item.guideId" @click="shopGuides = item.guideId">
              {{ item.name }}
            </li>
          </ul>
          <p class="filterTittle">积分范围</p>
          <form action="#" class="filterBox integral">
            <input type="number" id="integralB" v-model="smallPoint" />-
            <input type="number" id="integralE" v-model="bigPoint" />
          </form>
          <p class="filterTittle">注册时间</p>
          <ul class="filterBox time">
            <li class="thisday" :key="index" :type="item.type" @click="choose(index);registDate = item.type"
              v-for="(item, index) in optionList" :class="registDate == item.type ? 'tabin_in' : ''">
              {{ item.txt }}
            </li>
          </ul>
          <p class="filterTittle custom_date">{{ timeVal }}</p>
          <p class="filterTittle">会员标签</p>
          <div class="label">
            <ul id="addLabel">
              <div v-html="label" id="chooseLabel"></div>
              <span class="addLbel" @click="addLabel">+选择标签</span>
            </ul>
          </div>
          <p class="filterTittle">最后联系时间</p>
          <ul class="filterBox last">
            <li class="lastday" :key="index" :type="item.type" @click="chooseLastTime(index);lastTime = item.type"
              v-for="(item, index) in lastTimeList" :class="lastTime == item.type ? 'tabin_in' : ''">
              {{ item.txt }}
            </li>
          </ul>
          <p class="filterTittle last_date" style="color:#0996ff">{{lastTimeVal}}</p>
        </div>
        <div class="btns">
          <span class="clear" id="clear" @click="clear">清除</span>
          <span class="filter" id="filter" @click="filterMember">筛选</span>
        </div>
      </div>
    </div>
    <!-- 隐藏选择城市的组件 -->
    <mt-popup v-model="addressVisible" position="bottom">
      <div class="pickerBtns">
        <span class="pickerN" @click="addressHide">取消</span>
        <span class="pickerY" @click="addressVal">确定</span>
      </div>
      <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
    </mt-popup>
    <!-- 自定义选择注册时间的组件 -->
    <transition name="fade">
      <ul class="user_edit" v-show="showTime">
        <li @click="beginTime">{{ begin ? begin : "开始时间" }}</li>
        <li @click="endTime">{{ end ? end : "结束时间" }}</li>
      </ul>
    </transition>
    <!-- mint选择时间的组件 -->
    <mt-datetime-picker type="date" ref="pickerO" year-format="{value} 年" month-format="{value} 月"
      date-format="{value} 日" @confirm="handleConfirmO" confirmText="开始时间" v-model="startDate"></mt-datetime-picker>
    <mt-datetime-picker type="date" ref="pickerT" year-format="{value} 年" month-format="{value} 月"
      date-format="{value} 日" @confirm="handleConfirmT" confirmText="结束时间" v-model="endDate"></mt-datetime-picker>
    <div class="determine" @click="assign()" v-if="memberstate == 2 || memberstate == 3">
      <span>确认</span>
    </div>
  </div>
</template>

<script>
  import scroll from "../../../components/scroll";
  import address from "../../../static/json/pca.json"; //引入省市区数据
  export default {
    name: "listFiltering",
    components: {
      scroll,
    },
    data() {
      return {
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
          lastContactTime: "",
          startDate: "",
          endDate: "",
          unbindSoon: null,
        },
        myClient: [],
        lastTimeVal: '',
        isCheck: false,
        clientList: [],
        isshopGuide: false,
        all: "",
        imgcheck: require("../../../static/image/checks.png"),
        //归属导购
        shopGuide: [],
        shopGuides: "",
        selectedCount: '0',
        gradeVisible: false,
        grade: [],
        grades: "",
        note: {
          backgroundImage: "url(" + require("../../../static/image/search_btn.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "22px 22px",
        },
        //监听滚动高度
        scrollTop: "",
        top: "top",
        isShowScroll: true,
        isData: false,
        nullDataAllLeft: false,
        isLoadingLeft: true,
        addressC: "+选择城市",
        addressVisible: false,
        searchBar: '',
        //选择城市的数据
        addressSlots: [{
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
        //省，市，区
        addressProvince: "",
        addressCity: "",
        addressArea: "",
        //注册时间数据
        optionList: [{
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
        registDate: "",
        custom: false,
        //初始化日期
        defaultDate: new Date(),
        //筛选条件
        dateType: "one",
        timeVal: "",
        touchBol: true,
        confirm: true,
        //开始时间
        begin: "",
        //结束时间
        end: "",
        startDate: '',
        endDate: '',
        //时间戳对比
        time1: "",
        time2: "",
        autoLabel: "",
        manualLabel: "",
        guideLabel: "",
        // 是否第一次进入，默认false
        isFirstEnter: false,
        clientHeight: "",
        lastTimeList: [{
            type: "weekBefore",
            txt: "一周前",
          },
          {
            type: "monthBefore",
            txt: "一个月前",
          },
          {
            type: "threeMonthBefore",
            txt: "三个月前",
          },
          {
            type: "noContact",
            txt: "从未联系",
          },
          {
            type: "customize",
            txt: "自定义",
          },
        ],
        lastTime: "",
        isLastTime: false,
        lastTime1: "",
        lastTime2: "",
        gender: "",
        label: "",
        status: "1",
        states: "",
        checkPeopleNum: "checkPeopleNum",
        data: "",
        memberstate: "",
        people: "",
        smallPoint: '',
        bigPoint: '',
        showTime: false,
        guideNum: 0
      };
    },
    beforeRouteEnter(to, from, next) {
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      if (from.name == "customerInformation") {
        to.meta.isBack = true;
        next((vm) => {
          vm.$refs.pullrefresh.scrollTo(0, vm.scrollTop);
        });
      } else {
        next((vm) => {
          vm.$refs.pullrefresh.scrollTo(0, 0);
        });
      }
    },
    created() {
      //第一次进入时执行
      this.isFirstEnter = true;
    },
    activated() {
      let user = localStorage.getItem("user");
      this.param.guideId = user.replace(/\"/g, "");
      this.guideNum = this.$route.query.guideNum
      //第一次进入时进入判断
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.myClient = [];
        this.firstClear();
        this.toggleClassMenu();
        //从路由中获取state
        this.memberstate = this.$route.query.state;
        this.param.dataSource = this.$route.query.dataSource;
        this.param.page = "1";
        this.param.state = this.memberstate;
        // 通过memberstate进行不同的请求
        if (this.memberstate == "0") {
          this.getmyMember();
          this.isshopGuide = false;
        } else if (this.memberstate == "1") {
          this.getStoreMember();
          this.getshopGuide();
          this.isshopGuide = true;
        } else if (this.memberstate == "2") {
          this.getStoreMember();
          this.isshopGuide = false;
        } else if (this.memberstate == "3") {
          this.getmyMember();
          this.getshopGuide();
          this.isshopGuide = false;
        }
      }
      this.gradeClick();
      this.$nextTick(() => {
        this.getParams();
      })
      if (this.memberstate == "0" || this.memberstate == "1") {
        this.param.isShop = false;
      } else if (this.memberstate == "3") {
        this.param.isShop = false;
        this.param.couponId = this.$route.query.couponId;
        this.param.memberLsit = this.$route.query.memberLsit;
        this.param.cardManagementId = this.$route.query.cardManagementId;
        this.param.cardManagermentId = this.$route.query.cardManagermentId;
      } else {
        this.param.isShop = true;
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
      this.showTime = false
      this.clientHeight = `${document.documentElement.clientHeight}`;
      window.onresize = function() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    },
    watch: {
      clientHeight() {
        this.changeFixed(this.clientHeight);
      }
    },
    methods: {
      //解绑
      unbindSoon() {
        if (this.param.unbindSoon == null) {
          this.$set(this.param,'unbindSoon','1')
        } else {
          this.$set(this.param,'unbindSoon',null)
        }
        // console.log(this.param.unbindSoon)
      },
      /**
       * 切换筛选框显示隐藏
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
       * state0，3时获取列表数据
       */
      getmyMember() {
        this.$api.get(
          "/myMember",
          this.param,
          (res) => {
            // console.log(res.data);
            if (res.errcode == 0) {
              let client = res.data;
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
              console.log(this.myClient)
              this.isData = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      /**
       * 列表上拉加载
       */
      loadBottom() {
        const that = this;
        if (!that.isData) {
          if (that.param.page < 0 || that.param.page == 0) {
            return;
          } else {
            that.isData = true;
            that.param.page++;
            //上拉加载重新初始化
            this.$refs.pullrefresh.$emit("infinitescroll.reInit");
            this.param.state = this.memberstate;
            if (this.memberstate == "0" || this.memberstate == "3") {
              this.getmyMember();
            } else if (this.memberstate == "1" || this.memberstate == "2") {
              this.getStoreMember();
            }
          }
        }
      },
      /**
       * 获取门店会员列表
       */
      getStoreMember() {
        this.$api.get(
          "/departmentMember",
          this.param,
          (res) => {
            // console.log(res.data);
            if (res.errcode == 0) {
              this.all = res.data.totalCount;
              let client = res.data.result;
              if (
                client.length != 0 &&
                (this.memberstate == "2" || this.memberstate == "3")
              ) {
                document.querySelector('.allChecK').classList.remove('checked')
                document.querySelector('.allChecK').children[0].style.display = 'none'
              }
              this.param.state = this.memberstate;
              this.clientList = client;
              this.people = res.data.totalCount;
              if (client.length < 10) {
                this.isLoadingLeft = false;
                this.myClient = this.myClient.concat(client);
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
       * state=2/3用于全选的按钮
       */
      isAllChecked() {
        this.isCheck = !this.isCheck;
        let isImgShow = document.querySelector('.allChecK').childNodes[0]
        let isClass = document.querySelector('.allChecK').classList
        let isClassLength = document.querySelector('.allChecK').classList.length
        //	更新已选人数
        if (isClassLength == 2) {
          isClass.remove("checked")
          isImgShow.style.display = 'none'
          this.$refs.labelC.forEach(function(item) {
            item.classList.remove('chosen')
            item.childNodes[0].style.display = 'none'
          })
        } else {
          isClass.add('checked')
          isImgShow.style.display = 'inline'
          this.$refs.labelC.forEach(function(item) {
            item.classList.add('chosen')
            item.childNodes[0].style.display = 'inline'
          })
        }
        this.selectedCount = document.querySelectorAll(".memberList .chosen").length
      },
      /**
       * 获取导购列表
       */
      getshopGuide() {
        this.$api.get(
          "/guideList", {
            guideId: this.param.guideId,
          },
          (res) => {
            // console.log(res)
            if (res.errcode == 0) {
              const info = res.data;
              this.shopGuide = res.data;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      /**
       * 当state=2/3用于单选的按钮
       */
      assignMembers(id) {
        let isClass = document.querySelector('.allChecK').classList
        let isImgShow = document.querySelector('.allChecK').childNodes[0]
        this.$refs.labelC.forEach(function(item, index, arr) {
          if (id == index) {
            arr[id].classList.toggle('chosen')
          }
          if (item.classList.value == 'chosen') {
            item.childNodes[0].style.display = 'inline'
          } else {
            item.childNodes[0].style.display = 'none'
          }
        })
        let hasChosen = this.$refs.labelC
        hasChosen = hasChosen.filter(function(item) {
          return item.className == 'chosen'
        })
        if (this.$refs.labelC.length == hasChosen.length) {
          isClass.add('checked')
          isImgShow.style.display = 'inline'
        } else {
          isClass.remove("checked")
          isImgShow.style.display = 'none'
        }
        this.selectedCount = document.querySelectorAll(".memberList .chosen").length
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
      //选择城市的组件
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
       * 在筛选中等级数据
       */
      gradeClick() {
        this.$api.get(
          "/gradeList", {
            guideId: this.param.guideId,
            requestName: "0",
          },
          (res) => {
            if (res.errcode == 0) {
              // console.log(res);
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
       * 注册时间选择
       */
      choose(index) {
        // console.log(index);
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
            this.isLastTime = false;
            this.userEdit();
            break;
        }
      },
      //选择最后联系时间
      chooseLastTime(index) {
        const _this = this;
        switch (index) {
          case 0:
            _this.param.lastContactTime = "weekBefore";
            _this.lastTimeVal = ''
            break;
          case 1:
            _this.param.lastContactTime = "monthBefore";
            _this.lastTimeVal = ''
            break;
          case 2:
            _this.param.lastContactTime = "threeMonthBefore";
            _this.lastTimeVal = ''
            break;
          case 3:
            _this.param.lastContactTime = "noContact";
            _this.lastTimeVal = ''
            break;
          default:
            _this.isLastTime = true;
            _this.param.lastContactTime = "customize";
            _this.userEdit();
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
          (that.defaultDate.getMonth() + 1 < 10 ?
            "0" + (that.defaultDate.getMonth() + 1) :
            that.defaultDate.getMonth() + 1) +
          "-" +
          (that.defaultDate.getDate() - 1 < 10 ?
            "0" + that.defaultDate.getDate() :
            that.defaultDate.getDate());
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
          (that.defaultDate.getMonth() + 1 < 10 ?
            "0" + (that.defaultDate.getMonth() + 1) :
            that.defaultDate.getMonth() + 1) +
          "-" +
          (that.defaultDate.getDate() - 1 < 10 ?
            "0" + (that.defaultDate.getDate() - 1) :
            that.defaultDate.getDate() - 1);
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
          (that.defaultDate.getMonth() + 1 < 10 ?
            "0" + (that.defaultDate.getMonth() + 1) :
            that.defaultDate.getMonth() + 1);
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
        if (!this.isLastTime) {
          that.custom = !that.custom;
          that.dateType = "four";
          that.touchBol = !that.touchBol;
          this.$emit("sendtype", [that.dateType, that.touchBol]);
          that.confirm = false;
          that.showTime = !that.showTime
        } else {
          that.showTime = !that.showTime
        }
      },
      //开始时间
      beginTime() {
        const that = this;
        that.$refs.pickerO.open();
        if (!that.isLastTime) {
          that.confirm = false;
        }
      },
      //结束时间mint
      endTime() {
        const that = this;
        that.$refs.pickerT.open();
        if (!that.isLastTime) {
          that.confirm = false;
        }
      },
      //开始时间
      handleConfirmO(e) {
        const that = this;
        //非不是最后联系时间
        if (!that.isLastTime) {
          that.custom = false;
          that.confirm = true;
          that.time1 = e;
          that.begin = e.getFullYear() + "-" + (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1) +
            "-" + (e.getDate() < 10 ? "0" + e.getDate() : e.getDate());
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
        } else {
          that.lastTime1 = e;
          that.param.startDate =
            e.getFullYear() +
            "-" +
            (e.getMonth() + 1 < 10 ?
              "0" + (e.getMonth() + 1) :
              e.getMonth() + 1) +
            "-" +
            (e.getDate() < 10 ? "0" + e.getDate() : e.getDate());
          that.lastTimeVal = `${that.param.startDate}至${that.param.endDate}`
          if (that.lastTime2) {
            if (that.lastTime2 >= that.lastTime1) {
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
          }
        }
      },
      //结束时间mint
      handleConfirmT(e) {
        const that = this;
        //非最后联系时间
        if (!that.isLastTime) {
          that.time2 = e;
          that.custom = false;
          that.confirm = true;
          that.end = e.getFullYear() + "-" + (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1) +
            "-" + (e.getDate() < 10 ? "0" + e.getDate() : e.getDate());
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
        } else {
          that.lastTime2 = e;
          that.param.endDate =
            e.getFullYear() +
            "-" +
            (e.getMonth() + 1 < 10 ?
              "0" + (e.getMonth() + 1) :
              e.getMonth() + 1) +
            "-" +
            (e.getDate() < 10 ? "0" + e.getDate() : e.getDate());
          that.lastTimeVal = `${that.param.startDate}至${that.param.endDate}`
          if (that.lastTime1) {
            if (that.lastTime2 >= that.lastTime1) {
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
          }
        }
      },
      /**
       * 顶部搜索框
       */
      submit() {
        this.param.name = this.searchBar;
        this.param.page = "1";
        this.myClient = [];
        if (this.memberstate == "0") {
          this.param.state = this.memberstate;
          this.getmyMember();
        } else if (this.memberstate == "1" || this.memberstate == "2") {
          this.param.state = this.memberstate;
          this.getStoreMember();
        } else if (this.memberstate == "3") {
          this.param.state = this.memberstate;
          this.getmyMember();
        }
      },
      /**
       * better-scroll发生滚动监听
       */
      scroll(data) {
        this.scrollTop = data;
      },

      /**
       * 跳转详情页
       */
      memberInfo(id) {
        this.$router.push({
          path: "customerInformation",
          query: {
            memberId: this.myClient[id].id,
            guideId: this.param.guideId,
            state: this.memberstate,
            dataSource: this.param.dataSource,
          },
        });
      },
      /**
       * 当页面可视高度发生变化执行
       */
      changeFixed(clientHeight) {
        const _this = this
        //动态修改样式
        if (_this.memberstate == "2" || _this.memberstate == "3") {
          if (document.querySelector('.searchBox') && document.querySelector('.check') && document.querySelector(
              '.determine')) {
            let searchBoxH = document.querySelector('.searchBox').offsetHeight
            let checkH = document.querySelector('.check').offsetHeight
            let determineH = document.querySelector('.determine').offsetHeight
            _this.$refs.boxHeight.style.height = clientHeight - searchBoxH - checkH - determineH + "px";
          }
        } else {
          if (document.querySelector('.searchBox')) {
            let searchBoxH = document.querySelector('.searchBox').offsetHeight
            _this.$refs.boxHeight.style.height = clientHeight - searchBoxH + "px";
          }
        }
      },
      /**
       * 做最终筛选
       */
      filterMember() {
        this.isCheck = false;
        this.selectedCount = 0
        this.param.page = 1;
        this.param.gender = this.gender
        let ads = this.addressC
        if (ads == "+选择城市") {
          this.param.address = "";
        } else {
          this.param.address = this.addressC;
        }
        if (document.querySelector('.grade li.tabin_in')) {
          this.param.grade = document.querySelector('.grade li.tabin_in').type;
        }
        if (this.isshopGuide) {
          if (document.querySelector('.shopGuide li.tabin_in')) {
            this.param.guideBelong = document.querySelector('.shopGuide li.tabin_in').type;
          }
        }
        this.param.pointSmall = this.smallPoint;
        this.param.pointBig = this.bigPoint;
        if (document.querySelector('.time li.tabin_in')) {
          this.param.registDate = document.querySelector('.time li.tabin_in').type;
        }
        if (this.param.registDate != "four") {
          //等于four时为自定义
          this.param.startTime = "";
          this.param.endTime = "";
        } else {
          let tim = this.timeVal
          let timV = tim.split("至");
          this.param.startTime = timV[0];
          this.param.endTime = timV[1];
        }
        document.querySelector('.memberList').innerHTML = ''
        if (this.memberstate == "0" || this.memberstate == "3") {
          this.getmyMember();
        } else if (this.memberstate == "1" || this.memberstate == "2") {
          this.getStoreMember();
        }
        this.toggleClassMenu();
        // console.log(document.querySelector('.memberLis'))
        // 自动标签
        // const auto = $(".auto");
        // for (let a = 0; a < auto.length; a++) {
        //   this.autoLabel += auto[a].getAttribute("labelid") + ",";
        // }
        // this.param.autoLabel = this.autoLabel.substring(
        //   0,
        //   this.autoLabel.length - 1
        // );
        // 公司标签
        // const manual = $(".manual");
        // for (let m = 0; m < manual.length; m++) {
        //   this.manualLabel += manual[m].getAttribute("labelid") + ",";
        // }
        // this.param.manualLabel = this.manualLabel.substring(
        //   0,
        //   this.manualLabel.length - 1
        // );
        // 导购标签
        // const guide = $(".guide");
        // for (let g = 0; g < guide.length; g++) {
        //   this.guideLabel += guide[g].getAttribute("value") + ",";
        // }
        // this.param.guideLabel = this.guideLabel.substring(
        //   0,
        //   this.guideLabel.length - 1
        // );
        // this.autoLabel = "";
        // this.manualLabel = "";
        // this.guideLabel = "";
      },
      /**
       * 清除所有选项
       */
      clear() {
        this.isCheck = false;
        this.selectedCount = 0
        document.querySelectorAll('.filterBox li').forEach(function(item) {
          if (item.classList.value.indexOf('tabin_in') != -1) {
            item.classList.value = item.classList.value.replace(/tabin_in/g, '')
          }
        })
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
        this.param.lastContactTime = "";
        this.param.startDate = "";
        this.param.endDate = "";
        this.addressC = "+选择城市";
        this.grades = "";
        this.registDate = "";
        this.timeVal = ''
        this.lastTimeVal = ""
        this.lastTime = ''
        document.querySelector('#chooseLabel').innerHTML = ''
        document.querySelector('.memberList').innerHTML = ''
        this.smallPoint = ''
        this.bigPoint = ""
        this.param.page = 1;
        if (this.memberstate == "0" || this.memberstate == "3") {
          this.getmyMember();
        } else if (this.memberstate == "1" || this.memberstate == "2") {
          this.getStoreMember();
        }
        this.toggleClassMenu();
      },
      /**
       * 第一次进入时清除初始化
       */
      firstClear() {
        this.isCheck = false;
        this.selectedCount = 0
        document.querySelectorAll('.filterBox li').forEach(function(item) {
          if (item.classList.value.indexOf('tabin_in') != -1) {
            item.classList.value = item.classList.value.replace(/tabin_in/g, '')
          }
        })
        this.param.unbindSoon = null;
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
        this.param.lastContactTime = "";
        this.param.startDate = "";
        this.param.endDate = "";
        this.addressC = "+选择城市";
        this.timeVal = ''
        this.grades = "";
        this.registDate = "";
        this.lastTimeVal = ''
        this.lastTime = ''
        document.querySelector('#chooseLabel').innerHTML = ''
        this.toggleClassMenu();
        document.querySelector('.memberList').innerHTML = ''
        this.smallPoint = ''
        this.bigPoint = ''
        this.param.page = 1;
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
        if (this.isshopGuide) {
          if (document.querySelector('.shopGuide li.tabin_in')) {
            this.param.guideBelong = document.querySelector('.shopGuide li.tabin_in').type;
          }
        }
        this.param.pointSmall = this.smallPoint
        this.param.pointBig = this.bigPoint
        if (document.querySelector('.time li.tabin_in')) {
          this.param.registDate = document.querySelector('.time li.tabin_in').type;
        }
        if (this.memberstate == "3") {
          this.$router.replace({
            path: "tags",
            query: {
              status: this.status,
              gender: this.param.gender,
              address: this.param.address,
              grades: this.param.grade,
              shopGuides: this.param.guideBelong,
              pointSmall: this.param.pointSmall,
              pointBig: this.param.pointBig,
              registDate: this.param.registDate,
              timeVal: this.timeVal,
              dataSource: this.param.dataSource,
              state: this.memberstate,
              couponId: this.param.couponId,
              memberId: this.param.memberId,
              cardManagementId: this.param.cardManagementId,
              cardManagermentId: this.param.cardManagermentId,
              lastTime: this.lastTime,
              lastTimeVal: this.lastTimeVal
            },
          });
        } else {
          this.$router.replace({
            path: "tags",
            query: {
              status: this.status,
              gender: this.param.gender,
              address: this.param.address,
              grades: this.param.grade,
              shopGuides: this.param.guideBelong,
              pointSmall: this.param.pointSmall,
              pointBig: this.param.pointBig,
              registDate: this.param.registDate,
              timeVal: this.timeVal,
              dataSource: this.param.dataSource,
              state: this.memberstate,
              lastTime: this.lastTime,
              lastTimeVal: this.lastTimeVal
            },
          });
        }
      },


      /**
       * 处理上个页面传来的参数
       */
      getParams() {
        // console.log(this.$route);
        // 将数据放在当前组件的数据内
        this.states = this.$route.params.states;
        this.gender = this.$route.params.gender;
        this.grades = this.$route.params.grades;
        this.shopGuides = this.$route.params.shopGuides;
        this.smallPoint = this.$route.params.pointSmall;
        this.bigPoint = this.$route.params.pointBig;
        this.registDate = this.$route.params.registDate;
        this.lastTime = this.$route.params.lastTime;
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
        if (
          this.$route.params.lastTimeVal != "" &&
          this.$route.params.lastTimeVal != null &&
          this.$route.params.lastTimeVal != undefined
        ) {
          this.lastTimeVal = this.$route.params.lastTimeVal;
        }
        this.lastTimeList.forEach((item, index) => {
          if (item.type == this.lastTime) {
            if (document.querySelectorAll('.lastday')) {
              document.querySelectorAll('.lastday')[index].classList.add('tabin_in')
            }
          }
        })
      },

      //state为2/3时
      assign() {
        let id = ""
        let noMemberId = ""
        if (document.querySelectorAll(".memberList label")) {
          document.querySelectorAll(".memberList label").forEach((item, index, arr) => {
            if (item.classList.value == 'chosen') {
              let memberId = item.getAttribute('for')
              id += memberId + ','
            } else {
              let noId = item.getAttribute('for')
              noMemberId += noId + ','
            }
          })
        }
        id = id.substring(0, id.length - 1);
        noMemberId = noMemberId.substring(0, noMemberId.length - 1);
        this.param.memberLsit = id + "," + this.param.memberLsitid;
        this.param.gender = this.gender;
        let ads = this.addressC;
        if (ads == "+选择城市") {
          this.param.address = "";
        } else {
          this.param.address = this.addressC;
        }
        if (document.querySelector('.grade li.tabin_in')) {
          this.param.grade = document.querySelector('.grade li.tabin_in').type
        }
        if (document.querySelector('.shopGuide li.tabin_in')) {
          this.param.guideBelong = document.querySelector('.shopGuide li.tabin_in').type
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
          let tim = this.timeVal;
          let timV = tim.split("至");
          this.param.startTime = timV[0];
          this.param.endTime = timV[1];
        }
        this.param.name = this.searchBar
        let people = this.selectedCount
        let check_length = id.length;
        let numS = parseInt(people);
        if (numS > 0) {
          if (this.selectedCount > this.guideNum) {
            this.$messagebox({
              title: '警告',
              message: `会员人数不能超过${this.guideNum}人`,
              showCancelButton: false,
            });
          } else {
            if (this.memberstate == "3") {
              this.$router.push({
                name: "cardIssueTo",
                query: {
                  couponId: this.param.couponId,
                  memberId: this.param.memberLsit,
                  cardManagementId: this.param.cardManagementId,
                  cardManagermentId: this.param.cardManagermentId,
                },
              });
            }
            // if (this.memberstate == "2") {
            //   this.$router.push({
            //     name: "assign",
            //     query: {
            //       memberId: id,
            //       allCheckNum: people,
            //     },
            //   });
            // }
          }
        } else {
          this.$messagebox({
            message: "请选择会员！",
            showCancelButton: false,
          });
        }
        //		自动标签
        // const auto = $(".auto");
        // for (let a = 0; a < auto.length; a++) {
        //   this.autoLabel += auto[a].getAttribute("labelid") + ",";
        // }
        // this.param.autoLabel = this.autoLabel.substring(
        //   0,
        //   this.autoLabel.length - 1
        // );
        //		公司标签
        // const manual = $(".manual");
        // for (let m = 0; m < manual.length; m++) {
        //   this.manualLabel += manual[m].getAttribute("labelid") + ",";
        // }
        // this.param.manualLabel = this.manualLabel.substring(
        //   0,
        //   this.manualLabel.length - 1
        // );
        //		导购标签
        // const guide = $(".guide");
        // for (let g = 0; g < guide.length; g++) {
        //   this.guideLabel += guide[g].getAttribute("value") + ",";
        // }
        // this.param.guideLabel = this.guideLabel.substring(
        //   0,
        //   this.guideLabel.length - 1
        // );
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../style/scss/listFiltering";

  @font-face {
    font-family: "iconfont";
    /* project id 770909 */
    src: url("//at.alicdn.com/	t/font_770909_t92q8jeclj.eot");
    src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix") format("embedded-opentype"),
      url("//at.alicdn.com/t/font_770909_t92q8jeclj.woff") format("woff"),
      url("//at.alicdn.com/t/font_770909_t92q8jeclj.ttf") format("truetype"),
      url("//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont") format("svg");
  }

  .unbind {
    color: red;
    border: 2px solid red;
    width: fit-content;
    display: inline !important;
    border-radius: 8px;
    font-size: 0.8em !important;
    padding: 0.05rem;
    margin-left: 0.2rem;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to

  /* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
  }
</style>
