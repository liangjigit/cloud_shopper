<template>
  <div id="cardIssue">
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">
        <div @click.stop="staffFun()">我的卡券</div>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click.stop="diMissionFun()">发放记录</div>
      </mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="allType" :style="note">
          <span @click="isShowDialog = !isShowDialog">全部类型</span>
        </div>
        <transition name="fade">
          <div class="dialog" :style="isShowDialog ? 'display:block':''">
            <ol class="cardsType" :style="isShowDialog ? 'display:block':''">
              <li class="all" id @click="all()">全部类型</li>
              <li class="cash" id="000" @click="cash()">现金券</li>
              <li class="discount" id="001" @click="discount()">折扣券</li>
              <li class="gift" id="002" @click="gift()">礼品券</li>
            </ol>
          </div>
        </transition>
        <div class="mint-tab-containerList myCard" ref="homePage_one">
          <scroll ref="pullrefresh" :pullup="isShow" @scrollToEnd="loadBottom" :data="empData" :nullDataAll="nullDataAllLeft" :isDone="isLoadingLeft">
            <ul class="staff">
              <!--<li v-for="(item, index) in myEmpList" :key="index">
                <img :src="item.avatar?item.avatar: imgCom" alt="">
                <div class="staff_info">
                  <div class="staff_info_name">
                    <div class="name"><p>{{item.name}}</p><span>{{item.position}}</span></div>
                    <div class="shopName">{{item.shopName}}</div>
                    <div class="phone">{{item.phone}}</div>
                  </div>
                </div>
                <div class="btn" :index="index" :memberNum="item.memberNum" :id="item.id"
                     @click="dimissionBtn($event)">
                  发放记录
                </div>
              </li>-->
              <li class="cardBox" v-for="(item,idx) in myEmpList" :key="idx">
                <label class="lab" :for="item.id" @click="selectedId = idx" :class="selectedId == idx ? 'checked': ''">
                  <img :src="imgchecked" alt class="circle" :style="selectedId == idx ? 'display:inline': ''" />
                  <img :src="imgchecks" alt class="circle_check" :style="selectedId == idx ? 'display:none': ''" />
                </label>
                <div class="card" :id="item.id" :cardmanagerentid="item.cardManagerentId" :style="note1" @click="details(idx)">
                  <div class="cardLeft">
                    <p class="cardType" :class="item.name.length>12?'autoWidth':''">
                      <span>{{item.name}}</span>
                    </p>
                    <p class="cardTime" :class="item.name.length>12?'lineheight':''">
                      有效期：
                      <span v-if="item.startTime==null||item.endTime==null" class="cardCode_never">永久有效</span>
                      <span v-else class="cardCode_never">{{item.startTime}}-{{item.endTime}}</span>
                    </p>
                    <p class="cardCode">
                      <span v-if="(item.daysNum==null||item.daysNum=='')&&(item.endTime==null||item.endTime=='')">使用期限：不限制</span>
                      <span v-if="(item.daysNum==null||item.daysNum=='')&&(item.endTime!=null||item.endTime!='')">使用期限：截止到{{item.endTime}}</span>
                      <span v-if="(item.daysNum!=null||item.daysNum!='')&&(item.endTime==null||item.endTime=='')">使用期限：领取后{{item.daysNum}}天</span>
                    </p>
                  </div>

                  <div class="cardRight">
                    <p class="cardValue" v-if="item.typeCode=='000'&&item.value==null">
                      ¥
                      <span>{{item.lower}}-{{item.upper}}</span>
                    </p>
                    <p class="cardValue" v-if="item.typeCode=='000'&&item.value!=null">
                      ¥
                      <span>{{item.value}}</span>
                    </p>
                    <p class="cardValue" v-if="item.typeCode=='001'">
                      <span>{{(item.value)*10}}折</span>
                    </p>
                    <p class="cardUsed" v-if="item.typeCode=='002'">
                      <span>{{item.typename}}</span>
                    </p>
                    <p class="cardFeature cardOnly" v-if="(item.typeCode=='000'||item.typeCode=='001')&&item.payOver==null">无门槛</p>
                    <p class="cardFeature cardOnly" v-if="item.typeCode=='000'&&item.payOver!=null">满{{item.payOver}}元使用</p>
                    <p class="cardFeature cardOnly" v-if="item.typeCode=='001'&&item.payOver!=null">满{{item.payOver}}元使用</p>
                    <p class="cardFeature cardOnly" v-if="item.useRange==0">通用</p>
                    <p class="cardFeature cardOnly" v-if="item.useRange==1">线上</p>
                    <p class="cardFeature cardOnly" v-if="item.useRange==2">线下</p>
                  </div>
                </div>
                <p class="closeTime">发券截止：{{item.closingDate}}</p>
                <span class="cardNum">X{{item.guideNum}}</span>
              </li>
            </ul>
          </scroll>
        </div>
        <div class="wantSend" @click="coupon()">
          <span>我要发券</span>
          <!--<input type="button" id="" value="我要发券" />-->
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="mint-tab-containerList" ref="homePage">
          <scroll ref="pullrefresh_one" :pullup="isShow_one" @scrollToEnd="loadMoreDimission" :data="EmpListD" :nullDataAll="nullDataAllRight" :isDone="isLoadingRight">
            <ul class="staff">
              <!--<li v-for="(item, index) in myEmpListDimission" :key="index">
                <img :src="item.avatar?item.avatar: imgCom" alt="">
                <div class="staff_info">
                  <div class="staff_info_name">
                    <div class="name"><p>{{item.name}}</p><span>{{item.position}}</span></div>
                    <div class="shopName">{{item.shopName}}</div>
                    <div class="phone">{{item.phone}}</div>
                  </div>
                </div>
                <div class="starbtn" :index="index" :memberNum="item.memberNum" :id="item.id"
                     @click="startBtn($event)">
                  启用
                </div>
              </li>-->
              <li v-for="(item,idx) in myEmpListDimission" :key="idx" class="recordItem" :id="item.id" :guideid="item.guideid">
                <img :src="recordItemImg" alt />
                <div class="message">
                  <p class="sendCards">发放卡券：{{item.couponName}}（券名）</p>
                  <p class="cardsValue" v-if="item.type=='000'&&item.value==null">卡券面值：{{item.lower}}-{{item.upper}}元</p>
                  <p class="cardsValue" v-if="item.type=='000'&&item.value!=null">卡券面值：{{item.value}}元</p>
                  <p class="cardsValue" v-if="item.type=='001'">卡券面值：{{(item.value)*10}}元</p>
                  <p class="cardsValue" v-if="item.type=='002'">卡券面值：礼品券</p>
                  <p class="cardsValue">成功发放人数：{{item.successNum}}人</p>
                  <p class="cardsValue">失败发放人数：{{item.failNum}}人</p>
                  <p class="sendTime">发放时间：{{item.sendTime}}</p>
                </div>
              </li>
            </ul>
          </scroll>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";
import { MessageBox } from "mint-ui";
export default {
  name: "cardIssue",
  components: { scroll },
  data() {
    return {
      isShowDialog: false,
      isShow: true,
      selectedTicket: false,
      isShow_one: true,
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      // 图片地址
      imgURL: this.GLOBAL.imgURL,

      imgCom: require("../../../static/image/nodata_people.png"),
      // tab
      selected: "1",
      // 我的卡券
      myEmpList: [],
      empData: [],
      // 发放记录
      myEmpListDimission: [],
      EmpListD: [],
      // 我的卡券页数
      page: 1,
      type: "",
      // 发放记录页数
      pageSize: 1,
      isDataL: false,
      isDataR: false,
      clientHeight: "",
      // 提示语
      isLoadingLeft: true,
      isLoadingRight: true,
      nullDataAllLeft: false,
      nullDataAllRight: false,
      imgDown: require("../../../static/image/down.png"),
      note: {
        backgroundImage:
          "url(" + require("../../../static/image/down.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "8px 6px",
        backgroundPosition: "62% center",
      },
      note1: {
        backgroundImage:
          "url(" + require("../../../static/image/yhj.png") + ")",
        backgroundRepeat: "no-repeat",
      },
      imgchecks: require("../../../static/image/check_ready.png"),
      imgchecked: require("../../../static/image/checked.png"),
      recordItemImg: require("../../../static/image/check.png"),
      autoWidth: "autoWidth",
      lineheight: "lineheight",
      selectedId: -1
    };
  },

  created() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");
  },

  mounted() {
    const that = this;
    // 获取浏览器可视区域高度
    that.clientHeight = `${document.documentElement.clientHeight}`;
    window.onresize = function () {
      that.clientHeight = `${document.documentElement.clientHeight}`;
    };
    that.getHistory();
  },

  watch: {
    clientHeight() {
      this.changeFixed(this.clientHeight);
    },
  },

  methods: {
    /**
     * 获取历史卡券
     */
    getHistory() {
      this.$api.get(
        "my/cancelData",
        {
          guideId: this.MEMBERID,
        },
        (res) => {
          // console.log(res.data);
          if (res.data != null) {
            this.selected = "2";
            // 获取数据
            this.myEmpFunDimission();
          } else {
            // 我的卡券数据
            this.myEmpFunStaff();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 我的卡券数据
     */
    myEmpFunStaff() {
      const that = this
      that.$api.post(
        "CardVoucher/getVoucher",
        {
          guideId: that.MEMBERID,
          page: that.page,
          size: 10,
          type: that.type,
          // requestName: that.page,
        },
        (res) => {
          // console.log(res)
          if (res.errcode == 0) {
            const list = res.data
            that.empData = list
            if (list.length < 10) {
              that.myEmpList = [...that.myEmpList, ...list]
              this.page = 0
              that.isLoadingLeft = false
              that.$refs.pullrefresh.$emit("infinitescroll.loadedDone")
            } else {
              that.myEmpList = [...that.myEmpList, ...list]
              that.isLoadingLeft = true
              that.$refs.pullrefresh.$emit("infinitescroll.finishLoad")
            }
            that.isDataL = false
            if (that.myEmpList.length == 0) {
              that.nullDataAllLeft = true
            } else {
              that.nullDataAllLeft = false
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 我的卡券加载
     */
    loadBottom() {
      const that = this;
      if (that.isDataL) return;
      if (!that.page) return;
      that.isDataL = true;
      that.nullDataLight = false;
      that.page++;
      that.$refs.pullrefresh.$emit("infinitescroll.reInit");
      if (that.selected == "1") {
        that.myEmpFunStaff();
      }
    },
    /**
     * 发放记录数据
     */
    myEmpFunDimission() {
      const that = this
      that.$api.post(
        "CardVoucher/couponSendHistory",
        {
          guideId: that.MEMBERID,
          page: that.pageSize,
          size: 10,
          type: 1,
          // requestName: that.page,
        },
        (res) => {
          //console.log(res.data)
          const list = res.data
          this.EmpListD = list
          if (list.length < 10) {
            that.myEmpListDimission = [...that.myEmpListDimission, ...list];
            that.isLoadingRight = false;
            this.pageSize = 0;
            that.$refs.pullrefresh_one.$emit("infinitescroll.loadedDone");
          } else {
            that.isLoadingRight = true;
            that.myEmpListDimission = [...that.myEmpListDimission, ...list];
            that.$refs.pullrefresh_one.$emit("infinitescroll.finishLoad");
          }
          that.isDataR = false;
          if (that.myEmpListDimission.length == 0) {
            that.nullDataAllRight = true;
          } else {
            that.nullDataAllRight = false;
          }
        }
      );
    },
    /**
     * 发放记录加载
     */
    loadMoreDimission() {
      const that = this;
      if (that.isDataR) return;
      if (!this.pageSize) return;
      that.isDataR = true;
      that.nullDataRight = false;
      that.pageSize++;
      that.$refs.pullrefresh_one.$emit("infinitescroll.reInit");
      if (that.selected == "2") {
        that.myEmpFunDimission();
      }
    },
    /**
     * 类型选择
     */
    all() {
      this.type = "";
      this.commonStaff();
    },
    cash() {
      this.type = "000";
      this.commonStaff();
    },
    discount() {
      this.type = "001";
      this.commonStaff();
    },
    gift() {
      this.type = "002";
      this.commonStaff();
    },
    /**
     * 筛选券之后获取数据
     */
    commonStaff() {
      this.page = 1;
      this.isDataL = false;
      this.isLoadingLeft = true;
      this.isLoadingRight = false;
      this.myEmpList.length = 0;
      this.myEmpFunStaff();
      this.nullDataAllLeft = false;
      this.isShowDialog = false
    },
    /**
     * 点击进入我的卡券
     */
    staffFun() {
      const that = this;
      that.selected = "1";
      that.page = 1;
      that.isDataL = false;
      that.isLoadingLeft = true;
      that.isLoadingRight = false;
      that.myEmpList.length = 0;
      that.myEmpFunStaff();
      that.nullDataAllLeft = false;
      that.isShowDialog = false
    },
    /**
     * 点击进入发放记录
     */
    diMissionFun() {
      const that = this;
      that.selected = "2";
      that.pageSize = 1;
      that.isDataR = false;
      that.isLoadingRight = true;
      that.isLoadingLeft = false;
      that.nullDataAllRight = false;
      that.myEmpListDimission.length = 0;
      that.myEmpFunDimission();
      that.isShowDialog = false
    },
    /**
     * 我要发券
     */
    coupon() {
      if (document.querySelector('.checked')) {
        let couponId = document.querySelector('.checked').getAttribute('for')
        let cardManagementId = document.querySelector('.checked').nextElementSibling.getAttribute('cardmanagerentid')
        if (couponId != undefined && cardManagementId != undefined) {
          this.$router.push({
            name: "cardIssueTo",
            query: {
              couponId: couponId,
              cardManagementId: cardManagementId,
            },
          });
        }
      } else {
        this.$messagebox
          .confirm("", {
            message: "请选择要发放的优惠券",
            title: "选择优惠券",
            confirmButtonText: "确认",
            cancelButtonText: "返回",
          })
          .then((action) => {
            //确认的回调
            if (action == "confirm") {
            }
          });
      }
    },

    /**
     * 动态修改样式
     */
    changeFixed(clientHeight) {
      if (document.querySelector('.mint-navbar') && document.querySelector('.allType') && document.querySelector('.wantSend') && document.querySelector('.myCard')) {
        let height_ = document.querySelector('.mint-navbar').offsetHeight;
        let _height = document.querySelector('.allType').offsetHeight;
        let wantSendHeight = document.querySelector('.wantSend').offsetHeight;
        document.querySelector('.myCard').style.height = `${clientHeight - height_ - _height - wantSendHeight - 30}px`
      }
    },

    /**
     * 点击查看详情
     */
    details(idx) {
      let htmls = ``;
      if (this.myEmpList[idx].getLimit == null) {
        htmls += `<p><b>每人限领:</b>不限制</p>`;
      } else {
        htmls +=
          `<p><b>每人限领:</b>` + this.myEmpList[idx].getLimit + `张</p>`;
      }
      if (this.myEmpList[idx].vipGrade == null) {
        htmls += `<p><b>会员等级:</b>全部</p>`;
      } else {
        htmls += `<p><b>会员等级:</b>` + this.myEmpList[idx].vipGrade + `</p>`;
      }
      if (
        this.myEmpList[idx].couponRemark == null ||
        this.myEmpList[idx].couponRemark == ""
      ) {
        htmls += `<p><b>使用说明:</b>无</p>`;
      } else {
        htmls += `<p><b>使用说明:</b></p>`;
        const remark = this.myEmpList[idx].couponRemark.split("\n");
        for (let r = 0; r < remark.length; r++) {
          htmls += `<p>` + remark[r] + `</p>`;
        }
      }
      this.$messagebox
        .alert("", {
          message: htmls,
          title: "提示",
          confirmButtonText: "确定",
        })
        .then((action) => {
          //确认的回调
          if (action == "confirm") {
            // console.log("提示完成");
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/cardIssue";

#cardIssue .mint-tab-containerList {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 0;
  max-width: 1024px;
}
#cardIssue .myCard {
  top: 195px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
