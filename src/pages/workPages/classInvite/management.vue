<template>
  <div id="management">
    <header ref="headerHeight" v-show="isChooseShow">
      <div @click="toggleShow" class="choose_box">
        <span class="chooseSpace">选择范围</span>
        <span class="chooseVal">
          {{ defaultMsg }}
          <i class="iconfont dropDown">&#xe60e;</i>
        </span>
      </div>
      <div class="mask" v-show="personShow" @click="personShow = false">
        <div class="box">
          <div class="allPerson" v-show="personShow" ref="personHeight">
            <a class="person" :key="index" v-for="(item,index) in guideList" @click.stop="toggle(index);send($event,index)"
              :index="item.guideId" :class="index == checkindex ? 'active' : ''">{{ item.name }}</a>
          </div>
        </div>
      </div>
    </header>

    <div class="scroll">
      <div class="ScrollBox" :class="{change:isChange}" ref="boxHeight">
        <scroll ref="pullrefresh">
          <div class="invitationSchedule" v-if="inviteTimeInfo.length > 0">
            <div class="invitationTitle">邀约概况</div>
            <div class="invitationInfo">
              <ul class="invitationList">
                <li class="invitationItem">
                  <p>昨日邀约</p>
                  <p>{{ inviteTimeInfo[0].data == null ? 0 : inviteTimeInfo[0].data.invitenum}}</p>
                  <template v-if="inviteTimeInfo[0].data != null">
                    <p v-if="inviteTimeInfo[0].data.invitenum_tb > 0" class=" increase">{{inviteTimeInfo[0].data.invitenum_tb}}&nbsp;<span
                        class="icon-arrow-up2"></span></p>
                    <p v-if="inviteTimeInfo[0].data.invitenum_tb == 0" class="fair">持平</p>
                    <p v-if="inviteTimeInfo[0].data.invitenum_tb < 0" class="decrease">{{Math.abs(inviteTimeInfo[0].data.invitenum_tb)}}&nbsp;<span
                        class="icon-arrow-down2"></span></p>
                  </template>
                  <template v-else>
                    <p class="fair">持平</p>
                  </template>
                </li>
                <li class="invitationItem">
                  <p>本周邀约</p>
                  <p>{{ inviteTimeInfo[1].data == null ? 0 : inviteTimeInfo[1].data.invitenum }}</p>
                  <template v-if="inviteTimeInfo[1].data != null">
                    <p v-if="inviteTimeInfo[1].data.invitenum_tb > 0" class=" increase">{{inviteTimeInfo[1].data.invitenum_tb}}&nbsp;<span
                        class="icon-arrow-up2"></span></p>
                    <p v-if="inviteTimeInfo[1].data.invitenum_tb == 0" class="fair">持平</p>
                    <p v-if="inviteTimeInfo[1].data.invitenum_tb < 0" class="decrease">{{Math.abs(inviteTimeInfo[1].data.invitenum_tb)}}&nbsp;<span
                        class="icon-arrow-down2"></span></p>
                  </template>
                  <template v-else>
                    <p class="fair">持平</p>
                  </template>
                </li>
                <li class="invitationItem">
                  <p  style="display: flex;justify-content: center;">回购率&nbsp;
                    <van-icon name="warning" @click="showWarning" />
                  </p>
                  <p>{{ inviteTimeInfo[1].data == null ? 0 : inviteTimeInfo[1].data.returnrate }}%</p>
                  <template v-if="inviteTimeInfo[1].data != null">
                    <p v-if="inviteTimeInfo[1].data.returnrate_tb > 0" class=" increase">{{inviteTimeInfo[1].data.returnrate_tb}}%&nbsp;<span
                        class="icon-arrow-up2"></span></p>
                    <p v-if="inviteTimeInfo[1].data.returnrate_tb == 0" class="fair">持平</p>
                    <p v-if="inviteTimeInfo[1].data.returnrate_tb < 0" class="decrease">{{Math.abs(inviteTimeInfo[1].data.returnrate_tb)}}%&nbsp;<span
                        class="icon-arrow-down2"></span></p>
                  </template>
                  <template v-else>
                    <p class="fair">持平</p>
                  </template>
                </li>
                <li class="invitationItem">
                  <p>本月邀约</p>
                  <p>{{ inviteTimeInfo[2].data == null ? 0 : inviteTimeInfo[2].data.invitenum }}</p>
                  <template v-if="inviteTimeInfo[2].data != null">
                    <p v-if="inviteTimeInfo[2].data.invitenum_tb > 0" class=" increase">{{inviteTimeInfo[2].data.invitenum_tb}}&nbsp;<span
                        class="icon-arrow-up2"></span></p>
                    <p v-if="inviteTimeInfo[2].data.invitenum_tb == 0" class="fair">持平</p>
                    <p v-if="inviteTimeInfo[2].data.invitenum_tb < 0" class="decrease">{{Math.abs(inviteTimeInfo[2].data.invitenum_tb)}}&nbsp;<span
                        class="icon-arrow-down2"></span></p>
                  </template>
                  <template v-else>
                    <p class="fair">持平</p>
                  </template>
                </li>
                <li class="invitationItem">
                  <p  style="display: flex;justify-content: center;">回购率&nbsp;
                    <van-icon name="warning" @click="showWarning" />
                  </p>
                  <p>{{ inviteTimeInfo[2].data == null ? 0 : inviteTimeInfo[2].data.returnrate }}%</p>
                  <template v-if="inviteTimeInfo[2].data != null">
                    <p v-if="inviteTimeInfo[2].data.returnrate_tb > 0" class=" increase">{{inviteTimeInfo[2].data.returnrate_tb}}%&nbsp;<span
                        class="icon-arrow-up2"></span></p>
                    <p v-if="inviteTimeInfo[2].data.returnrate_tb == 0" class="fair">持平</p>
                    <p v-if="inviteTimeInfo[2].data.returnrate_tb < 0" class="decrease">{{Math.abs(inviteTimeInfo[2].data.returnrate_tb)}}%&nbsp;<span
                        class="icon-arrow-down2"></span></p>
                  </template>
                  <template v-else>
                    <p class="fair">持平</p>
                  </template>
                </li>
              </ul>
            </div>
          </div>
          <div class="dateTitle">我的邀约日程</div>
          <!--日历-->
          <div class="calendar">
            <Calendar ref="Calendar" style="width: 100%;" :sundayStart="false" v-on:choseDay="clickDay" :markDateMore="markList"
              v-on:changeMonth="changeDate"></Calendar>
          </div>
          <footer v-show="showInfo">
            <div class="details nopadding" :key="index" v-for="(item,index) in detailsList" :typeId="item.id " :style="index != detailsList.length - 1 ? '' : 'border:0'">
              <div class="footerTitle">{{ item.detailsTitle }}({{ item.memberNum }})</div>
              <div v-for="(item1,id) in item.dataList" :key="id" @click="toCustomer(item1)">
                <!-- <router-link
                :to="{path:'/customerInformation',query:{memberId:item.memberId }}"
                class="details"
                >-->
                <div class="headPortrait">
                  <!--	用户没有头像设置默认-->
                  <img :src="item1.avatarSrc?item1.avatarSrc:require('../../../static/image/nodata_people.png')" />
                </div>
                <div>
                  <div class="message">
                    <span class="thisName">{{ item1.membername }}</span>
                    <mt-badge type="warning" size="large" color="#f8a120" class="badge" v-show="item1.Badge">{{ item1.Badge }}</mt-badge>
                    <p class="comment">备注：{{ item1.remark }}</p>
                  </div>
                </div>
                <!-- </router-link> -->
              </div>
            </div>
          </footer>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
  import Calendar from "vue-calendar-component";
  import scroll from "../../../components/scroll";
  import {
    Toast
  } from 'vant';
  export default {
    name: "management",
    components: {
      Calendar,
      scroll,
    },
    data() {
      return {
        MEMBERID: this.GLOBAL.MEMBERID,
        // 初始化第一个栏块高亮
        checkindex: 0,
        personShow: false,
        isChooseShow: false,
        isChange: true,
        //				权限参数
        code: "",
        defaultMsg: "全部",
        showInfo: false,
        //初始化选择的导购id
        chooseGuideId: "",
        //初始化邀约的标记日期
        inviteDay: [],
        //初始化邀约数据
        inviteList: {
          inviteAll: 0,
          inviteMonth: 0,
          inviteWeek: 0,
          inviteDay: 0,
        },
        //初始化导购列表
        guideList: [{
          name: "全部",
          guideId: this.GLOBAL.MEMBERID,
        }, ],
        //初始化邀约会员列表列表
        detailsList: [],
        //初始化标记列表
        markList: [],
        month: "",
        clientHeight: "",
        inviteTimeInfo: []
      };
    },
    created() {
      const that = this
      let user = localStorage.getItem("user");
      this.MEMBERID = user.replace(/\"/g, "");
      that.role().then((res) => {
        if (res != '002') {
          that.getInviteNotManager(that.MEMBERID)
        } else {
          that.getInviteManager()
        }
      })
    },
    mounted() {
      // console.log(this.$refs.Calendar);
      this.clientHeight = `${document.documentElement.clientHeight}`;
      window.onresize = function() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };

      //日历样式
      const that = this,
        prevMonth = document.body.querySelector(
          ".wh_top_changge li:first-of-type"
        ),
        nextMonth = document.body.querySelector(
          ".wh_top_changge li:last-of-type"
        ),
        iconPrev = '<i class="iconfont iconPrev">&#xe67e;</i>',
        iconNext = '<i class="iconfont iconNext">&#xe67d;</i>';
      prevMonth.innerHTML = iconPrev;
      nextMonth.innerHTML = iconNext;
      that.chooseGuideId = that.guideList[0].guideId;
      //初始化获取导购列表并根据导购获取邀约标记
      that
        .getGuideList()
        .then(() => {
          return that.getList();
        })
        .then(() => {
          that.getInviteInfo();
        });
      that.clickDay();
      that.month = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
    },
    methods: {
      /**
       * 获取店长当前邀约概况数据
       */
      getInviteManager() {
        const _this = this
        let p1 = _this.postInvite({
          userId: _this.MEMBERID,
          dataType: 'SHOP',
          timeType: 'D'
        })
        let p2 = _this.postInvite({
          userId: _this.MEMBERID,
          dataType: 'SHOP',
          timeType: 'W'
        })
        let p3 = _this.postInvite({
          userId: _this.MEMBERID,
          dataType: 'SHOP',
          timeType: 'M'
        })
        Promise.all([p1, p2, p3]).then(res => {
          console.log(res)
          _this.inviteTimeInfo = res
        }).catch(err => {
          console.log(err)
        })
      },
      /**
       * 获取非店长当前邀约概况数据
       */
      getInviteNotManager(userId) {
        const _this = this
        let p1 = _this.postInvite({
          userId,
          dataType: 'SHOPGUIDE',
          timeType: 'D'
        })
        let p2 = _this.postInvite({
          userId,
          dataType: 'SHOPGUIDE',
          timeType: 'W'
        })
        let p3 = _this.postInvite({
          userId,
          dataType: 'SHOPGUIDE',
          timeType: 'M'
        })
        Promise.all([p1, p2, p3]).then(res => {
          console.log(res)
          _this.inviteTimeInfo = res
        }).catch(err => {
          console.log(err)
        })
      },
      /**
       * 请求邀约数据
       */
      postInvite(param) {
        const _this = this
        return new Promise((resolve, reject) => {
          _this.$api.post('my/getInvitation', param, res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        })
      },
      /**
       * 提示回购率
       */
      showWarning() {
        Toast({
          message: '在筛选时间范围下单且在之前30天内被邀约的会员记为回购\n(与邀约人数字段的查询维度不同)',
          className: 'waringbox',
          duration: 3000,
          forbidClick: true,
          overlay: true,
        })
        this.clickHidden()
      },
      hiddenWraning() {
        const _this = this
        Toast.clear()
        document.body.removeEventListener('click', _this.hiddenWraning)
      },
      /**
       * 添加点击时间
       */
      clickHidden() {
        const _this = this
        document.body.addEventListener('click', _this.hiddenWraning, true)
      },
      //去详情页
      toCustomer(item) {
        // console.log(item);
        this.$router.push({
          path: "/customerInformation",
          query: {
            memberId: item.id
          },
        });
      },
      //获取当前导购的code
      //001:区经   002：店长  003：导购  其余都是全部页面展示
      role() {
        const _this = this
        return new Promise((resolve, reject) => {
          _this.$api.post(
            "/my/role", {
              guideId: _this.MEMBERID,
            },
            (res) => {
              // console.log(res.data);
              _this.code = res.data;
              // console.log(this.code);
              //002是店长
              if (_this.code == "002") {
                _this.checkindex = 0;
                _this.isChooseShow = true;
                _this.isChange = false;
              } else if (
                _this.code == "001" ||
                _this.code == "003" ||
                _this.code == "004"
              ) {
                _this.checkindex = -1;
                _this.isChooseShow = false;
                _this.isChange = true;
              }
              resolve(res.data)
            },
            (err) => {
              reject(err);
            }
          );
        })
      },
      //顶部选择范围
      toggleShow() {
        const that = this;
        that.personShow = !that.personShow;
      },
      //获取导购列表并根据导购获取邀约标记
      getGuideList() {
        const that = this;
        return new Promise((resolve, reject) => {
          that.$api.get(
            "/guideList", {
              guideId: that.MEMBERID,
              requestName: that.MEMBERID,
            },
            (res) => {
              console.log(res.data);
              const dataList = res.data;
              dataList.forEach((item) => {
                that.guideList.push(item);
              });
              // console.log(that.guideList);
              that.defaultMsg = that.guideList[0].name;
              resolve();
            },
            (err) => {
              console.log(err);
            }
          );
        });
      },
      //根据选择的导购和日期获取邀约日程
      getList(time) {
        const that = this;
        if (time) {
          let initTime = time;
          let yearTime = time.substr(0, 5);
          let monthTime = time.substr(5);
          if (monthTime < 10) {
            time = `${yearTime}0${monthTime}`;
          } else {
            time = initTime;
          }
        }
        // console.log(time);
        return new Promise((resolve, reject) => {
          that.$api.get(
            "/InvitationManagementtwo", {
              guideId: that.chooseGuideId,
              calendar: time, //月份
              type: that.checkindex == 0 ? "all" : "",
              requestName: time,
            },
            (res) => {
              //返回时间戳
              resolve();
              // console.log("成功返回");
              if (res.data.length > 0) {
                that.inviteDay = [];
                res.data.forEach((item) => {
                  let date = new Date(item);
                  // console.log(date);
                  date =
                    date.getFullYear() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getDate();
                  that.inviteDay.push(date);
                  for (let i = 0; i < that.inviteDay.length; i++) {
                    if (that.inviteDay) {
                      that.markList.push({
                        className: "mark1",
                        date: that.inviteDay[i],
                      });
                      // console.log(that.markList);
                    }
                  }
                });
              } else {
                // console.log("未找到匹配项");
                //删除标记
                that.markList = [];
                // console.log(that.markList);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        });
      },
      //active样式
      toggle(index) {
        const _this = this
        _this.checkindex = index;
        // console.log(_this.guideList)
        let userId = _this.guideList[index].guideId
        if (index == 0) {
          _this.getInviteManager()
        } else {
          _this.getInviteNotManager(userId)
        }
      },

      //获取邀约数据
      send(e, index) {
        // console.log(e);
        const that = this;
        that.showInfo = false;
        that.personShow = false;
        that.markList.length = 0;
        that.defaultMsg = e.srcElement.innerHTML;
        that.chooseGuideId = e.target.attributes[0].nodeValue;
        //今天日期
        const defaultDate = new Date();
        const time = this.month;
        // console.log("当前月份为" + this.month);
        that.getList(time);
        that.clickDay();
        that.getInviteInfo();
      },
      //日历
      clickDay(data) {
        // console.log(data);
        // console.log("我进到筛选日期函数");
        const that = this;
        let chooseData = data;
        const clickDate = new Date(data),
          [y, m, d] = [
            clickDate.getFullYear(),
            clickDate.getMonth() + 1,
            clickDate.getDate(),
          ];
        let dateType = y + "-" + m + "-" + d;
        // console.log(dateType);
        for (let i = 0; i < that.markList.length; i++) {
          if (chooseData == that.markList[i].date) {
            // console.log("选择的日期与之前日期相等");
            //根据时间查找邀约会员
            that.$api.get(
              "/InvitationManagement", {
                guideId: that.chooseGuideId,
                dateType: dateType,
                type: that.checkindex == 0 ? "all" : "",
                requestName: that.dateType,
              },
              (res) => {
                // console.log(res.data);
                if (res.errcode == 0) {
                  that.detailsList = [];
                  const resList = res.data;
                  // console.log(resList);
                  for (let i = 0; i < resList.length; i++) {
                    for (let j = 0; j < resList[i].memberList.length; j++) {
                      that.detailsList.push({
                        detailsTitle: resList[i].name,
                        memberNum: resList[i].memebrNum,
                        id: resList[i].typeId,
                        dataList: [{
                          avatarSrc: resList[i].memberList[j].avatar,
                          membername: resList[i].memberList[j].membername,
                          Badge: resList[i].memberList[j].way,
                          remark: resList[i].memberList[j].remark,
                          id: resList[i].memberList[j].memberId,
                        }, ],
                      });
                      // console.log(that.detailsList);
                    }
                  }
                  // console.log(that.detailsList);
                }
              },
              (err) => {
                console.log(err);
              }
            );
            // console.log("我点的是相同的时间");
            that.showInfo = true;
            return;
          } else {
            // console.log("我点的是不同的时间");
            that.showInfo = false;
          }
        }
      },
      //邀约概况
      getInviteInfo() {
        const that = this;
        // console.log("进入函数");
        this.$api.get(
          "/InvitationManagementone", {
            guideId: that.chooseGuideId,
            type: that.checkindex == 0 ? "all" : "",
            requestName: that.checkindex,
          },
          (res) => {
            // console.log("成功返回");
            if (res.errcode == 0) {
              that.inviteList.inviteAll = res.data.inviteAll;
              that.inviteList.inviteMonth = res.data.inviteMonth;
              that.inviteList.inviteWeek = res.data.inviteWeek;
              that.inviteList.inviteDay = res.data.inviteDay;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      changeFixed(clientHeight) {
        //动态修改样式
        const _this = this
        window.setTimeout(function() {
          if (document.querySelector('.choose_box')) {
            _this.$refs.boxHeight.style.height =
              clientHeight - document.querySelector('.choose_box').offsetHeight + "px";
          }
        }, 1000)
      },
      //切换月份
      changeDate(data) {
        // console.log(data);
        let Today = new Date(data);
        let y = Today.getFullYear();
        let m = Today.getMonth() + 1;
        let time = y + "-" + m;
        this.month = time;
        const that = this;
        that.getList(time, that.guideList[0].id);
      },
    },
    watch: {
      clientHeight() {
        this.changeFixed(this.clientHeight);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../style/scss/management";
  @import "../../../style/icomoon/style.css";

  @font-face {
    font-family: "iconfont";
    /* project id 770909 */
    src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot");
    src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix") format("embedded-opentype"),
      url("//at.alicdn.com/t/font_770909_t92q8jeclj.woff") format("woff"),
      url("//at.alicdn.com/t/font_770909_t92q8jeclj.ttf") format("truetype"),
      url("//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont") format("svg");
  }

  .waringbox {
    line-height: 2 !important;
    font-size: 30px !important;
  }

  .increase {
    color: #ee0a24;
    // font-size: 0.4rem;
    font-weight: 900;
  }

  .van-icon {
    color: #03c !important;
  }

  .fair {
    color: #969799;
    // font-size: 0.4rem;
    font-weight: 900;
  }

  .decrease {
    color: #07c160;
    // font-size: 0.4rem;
    font-weight: 900;
  }

  .icon-arrow-up2::before {
    color: #ee0a24;
    // font-size: 0.35rem;
  }

  .icon-arrow-down2::before {
    color: #07c160;
    // font-size: 0.35rem;
  }
</style>
