<template>
  <div id="cardIssueTo" @click="deleFalse()">
    <ul class="couponsList">
      <li class="card" :style="note1" @click="details()">
        <div class="cardLeft">
          <p class="cardType" :class="card.name && card.name.length>12?autoWidth:''">
            <span>{{card.name}}</span>
          </p>
          <p class="cardTime" :class="card.name && card.name.length>12?lineheight:''">
            使用期限：
            <span v-if="card.startTime == null || card.endTime == null">永久有效</span>
            <span v-else>{{card.startTime}}-{{card.endTime}}</span>
          </p>
          <p class="cardCode">
            <span v-if="(card.daysNum==null||card.daysNum=='')&&(card.endTime==null||card.endTime=='')">使用期限：不限制</span>
            <span v-if="(card.daysNum==null||card.daysNum=='')&&(card.endTime!=null||card.endTime!='')">使用期限：截止到{{card.endTime}}</span>
            <span v-if="(card.daysNum!=null||card.daysNum!='')&&(card.endTime==null||card.endTime=='')">使用期限：领取后{{card.daysNum}}天</span>
          </p>
        </div>
        <div class="cardRight">
          <p class="cardValue" v-if="card.typeCode=='000'&&card.value==null">
            ¥
            <span>{{card.lower}}-{{card.upper}}</span>
          </p>
          <p class="cardValue" v-if="card.typeCode=='000'&&card.value!=null">
            ¥
            <span>{{card.value}}</span>
          </p>
          <p class="cardValue" v-if="card.typeCode=='001'">
            ¥
            <span>{{(card.value)*10}}</span>
          </p>
          <p class="cardUsed" v-if="card.typeCode=='002'">
            <span>{{card.typename}}</span>
          </p>
          <p class="cardFeature cardOnly" v-if="(card.typeCode=='000'||card.typeCode=='001')&&card.payOver==null">无门槛</p>
          <p class="cardFeature cardOnly" v-if="card.typeCode=='000'&&card.payOver!=null">满{{card.payOver}}元使用</p>
          <p class="cardFeature cardOnly" v-if="card.typeCode=='001'&&card.payOver!=null">满{{card.payOver}}折使用</p>
          <p class="cardFeature cardOnly" v-if="card.useRange==0">通用</p>
          <p class="cardFeature cardOnly" v-if="card.useRange==1">线上</p>
          <p class="cardFeature cardOnly" v-if="card.useRange==2">线下</p>
        </div>
      </li>
    </ul>
    <div class="cardNum">
      <div class="people_num">
        <!--<span class="less">－</span>
							<input type="number" name="sum" id="" value="0" class="distribution_num">
        <span class="plus">＋</span>-->
        <b>1</b>张
      </div>

      <p class="cardTotal">
        已选
        <b>{{people_num}}</b>人 每人
      </p>
      <p class="cardsaLL">
        共计
        <b>{{card.guideNum}}</b>张
      </p>
    </div>
    <div id="wrapper">
      <div class="scroller">
        <ul class="userAdd">
          <li v-for="item in member" class="addItem" :id="item.id" :key="item.id" @click.stop="delSelf(item.id)">
            <img :src="item.avatar" alt class="avatar" />
            <p>{{item.name}}</p>
            <img :src="close_" alt class="delete" v-show="close" />
          </li>
          <li class="add" index="0" @click="add()">
            <a href="javascript:;">+</a>
          </li>
          <li class="remove" @click.stop="dele()">
            <a href="javascript:;">-</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="sendCards" @click="sendCoupon()">
      <!--<input type="button" id="" value="发送" />-->
      <span ref="sendCouponSpan">发送</span>
    </div>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";

export default {
  name: "cardIssueTo",
  components: { scroll },
  data() {
    return {
      member: [],
      clientList: [],
      nullDataAllLeft: false,
      isLoadingLeft: true,
      note1: {
        backgroundImage:
          "url(" + require("../../../static/image/yhj.png") + ")",
        backgroundRepeat: "no-repeat",
      },
      card: [],
      param: {
        guideId: "",
        couponId: "",
        memberId: "",
        cardManagementId: "",
        cardManagermentId: "",
      },
      memberList: "",
      close: false,
      close_: require("../../../static/image/close_.png"),
      people_num: "",
      autoWidth: "autoWidth",
      lineheight: "lineheight",
      sendFlag: true,
    };
  },
  created() {
    let user = localStorage.getItem("user");
    this.param.guideId = user.replace(/\"/g, "");
    this.param.couponId = this.$route.query.couponId;
    if (
      this.$route.query.memberId != undefined ||
      this.$route.query.memberId != null
    ) {
      this.param.memberId = this.$route.query.memberId;
    }
    this.param.cardManagementId = this.$route.query.cardManagementId;
    this.param.cardManagermentId = this.param.cardManagementId;
  },
  mounted() {
    this.getCard();
  },
  methods: {
    /**
     * 获取卡券信息
     */
    getCard() {
      const _this = this
      this.$api.get(
        "CardVoucher/sengMemberMangeer",
        this.param,
        (res) => {
          // console.log(res.data);
          this.card = res.data.coupon;
          this.member = res.data.memberList;
          this.people_num = this.member.length;
        },
        (err) => {
          // console.log(err);
          this.$messagebox
            .alert("", {
              message: err.errmsg,
              title: "提示",
              confirmButtonText: "确定",
            })
            .then((action) => {
              //确认的回调
              if (action == "confirm") {
                // console.log("提示完成");
                _this.$router.push('cardIssue')
              }
            });
        }
      );
    },
    /**
     * 获取卡券详细信息
     */
    details() {
      let htmls = ``;
      if (this.card.getLimit == null) {
        htmls += `<p><b>每人限领:</b>不限制</p>`;
      } else {
        htmls += `<p><b>每人限领:</b>` + this.card.getLimit + `张</p>`;
      }
      if (this.card.vipGrade == null) {
        htmls += `<p><b>会员等级:</b>全部</p>`;
      } else {
        htmls += `<p><b>会员等级:</b>` + this.card.vipGrade + `</p>`;
      }
      if (this.card.couponRemark == null || this.card.couponRemark == "") {
        htmls += `<p><b>使用说明:</b>无</p>`;
      } else {
        htmls += `<p><b>使用说明:</b></p>`;
        const remark = this.card.couponRemark.split("\n");
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
    /**
     * 点击添加
     */
    add() {
      this.getMemberList();
      this.$router.push({
        name: "listFiltering",
        query: {
          state: "3",
          couponId: this.param.couponId,
          cardManagementId: this.param.cardManagementId,
          cardManagermentId: this.param.cardManagermentId,
          memberLsit: this.memberList,
          guideNum: this.card.guideNum
        },
      });
    },
    /**
     * 得到地址栏传参的memberList
     */
    getMemberList() {
      let memberList = "";
      this.memberList = "";
      for (let i = 0; i < this.member.length; i++) {
        memberList += this.member[i].id + ",";
      }
      this.memberList = memberList.substring(0, memberList.length - 1);
    },
    /**
     * 点击删掉
     */
    dele() {
      this.close = !this.close;
    },
    deleFalse() {
      this.close = false;
    },
    delSelf(id) {
      if (this.close == true) {
        for (let i = 0; i < this.member.length; i++) {
          if (id == this.member[i].id) {
            this.member.splice(i, 1);
            this.people_num = this.member.length;
          }
        }
      }
    },
    /**
     * 发送
     */
    sendCoupon() {
      const _this = this
      if (this.sendFlag == true) {
        this.sendFlag = false;
        this.$refs.sendCouponSpan.style.opacity = "0.3";
        this.$refs.sendCouponSpan.innerHTML = "发送中，请稍后";
        this.getMemberList();
        this.$api.get(
          "CardVoucher/sendCoupon",
          {
            guideId: this.param.guideId,
            couponId: this.param.couponId,
            cardManagementId: this.param.cardManagementId,
            cardManagermentId: this.param.cardManagermentId,
            memberIds: this.memberList,
          },
          (res) => {
            // console.log(res.data);
            this.getSave();
            this.$router.push("cardIssue");
          },
          (err) => {
            // console.log(err);
            this.$messagebox
              .alert("", {
                message: err.errmsg,
                title: "提示",
                confirmButtonText: "确定",
              })
              .then((action) => {
                //确认的回调
                if (action == "confirm") {
                  // console.log("提示完成");
                  _this.$router.push('cardIssue')
                }
              });
          }
        );
      }
    },
    //	点击保存已选好的数据
    getSave() {
      this.$api.get(
        "my/saveData",
        {
          guideId: this.param.guideId,
          cardsType: "0",
        },
        (res) => {
          // console.log(res.data);
        },
        (err) => {
          // console.log(err);
        }
      );
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/cardIssueTo";
</style>
