<template>
  <div id="container_main">
    <div class="container_customer" @click="hide" ref="homePage">
      <scroll ref="pullrefresh">
        <div class="customerInformation_list">
          <!-- 头部数据 -->
          <div class="head" v-if="memberInfo !== undefined">
            <div class="head-left">
              <h1>
                <span>{{ memberInfo.name }}</span>
                <span class="addBackname" @click="openPrompt">
                  <img src="../../../static/image/edit_notes.png" alt />
                </span>
              </h1>
              <p>
                备注：
                <span v-if="memberInfo.remarkName !== ''">{{memberInfo.remarkName}}</span>
                <span v-else>{{ not }}</span>
              </p>
              <p>
                微信昵称：
                <span>{{ memberInfo.nickName }}</span>
              </p>
              <p>
                等级：
                <span>{{ memberInfo.card }}</span>
              </p>
              <p>
                信息：
                <span>{{ memberInfo.sex }}/{{ memberInfo.birthday }}/{{memberInfo.adress}}</span>
              </p>
              <p>
                卡号：
                <span>{{ memberInfo.cardNum }}</span>
              </p>
              <p>
                手机号码：
                <span>
                  {{ memberInfo.phone }}&nbsp;&nbsp;&nbsp;&nbsp;
                  <mt-button type="primary" @click="copyPhone" style="position: relative; top: -0.05rem" v-if="isSdk">复制
                  </mt-button>
                </span>
              </p>
            </div>
            <div class="head-right">
              <img alt :src="memberInfo.avatar" />
              <img src="../../../static/image/best_card.png" v-if="isShowCard">
            </div>
            <div class="head-down">
              <span>
                <h3 v-if="memberInfo.shopName != null">
                  {{ memberInfo.shopName }}
                </h3>
                <h3 v-else>无</h3>
                <p>归属门店</p>
              </span>
              <span @click="changeRelationship">
                <h3 v-if="memberInfo.guideName != null">
                  {{ memberInfo.guideName }}
                </h3>
                <h3 v-else>无</h3>
                <p>上级销售员</p>
              </span>
              <span>
                <h3 v-if="memberInfo.registDate != null">
                  {{ memberInfo.registDate }}
                </h3>
                <h3 v-else>无</h3>
                <p>入会日期</p>
              </span>
            </div>
          </div>
          <!-- 中间数据 -->
          <div class="infoTab">
            <div class="contentInfo">
              <mt-navbar v-model="selected" class="infoSelected">
                <mt-tab-item id="1">个人资料</mt-tab-item>
                <mt-tab-item id="2">消费记录</mt-tab-item>
                <mt-tab-item id="3">邀约回访</mt-tab-item>
              </mt-navbar>
              <!-- tab-container -->
              <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1" v-if="memberInfo !== undefined">
                  <div class="infoTag">
                    <ul class="infoTag-list" id="infoTag-list">
                      <template v-for="item in memberInfo.label">
                        <li v-if="item.source == 1" :key="item.labelId" class="public_lable">
                          #{{ item.labelName }}
                        </li>
                      </template>
                      <template v-for="item in memberInfo.label">
                        <li v-if="item.source == 2 || item.source == 3" :type="item.source" :key="item.labelId"
                          :lableid="item.labelId" class="custom_lable">
                          #{{ item.labelName }}
                          <b class="dlt" @click="delCustom_label" v-show="isDlt">
                            <img src="../../../static/image/close_.png" alt class="img" />
                          </b>
                        </li>
                      </template>
                      <div class="infoTag-control">
                        <div class="add" @click="add">
                          <img src="../../../static/image/jia.png" alt />
                        </div>
                        <div class="less" @click="del">
                          <img src="../../../static/image/jian.png" alt />
                        </div>
                      </div>
                    </ul>
                  </div>
                  <div class="memberRights" id="memberRights">
                    <p class="memberTit">会员权益</p>
                    <ul class="memberRights-list">
                      <li>
                        <img src="../../../static/image/ljjf.png" alt />
                        <h4>累计积分</h4>
                        <p v-if="memberInfo.accumulativeIntegral != null">
                          {{ memberInfo.accumulativeIntegral }}
                        </p>
                        <p v-else>0</p>
                      </li>
                      <li @click="toCurrentScore">
                        <img src="../../../static/image/dqjf.png" alt />
                        <h4>当前积分</h4>
                        <!-- <p v-if="memberInfo.integral!=null">{{memberInfo.integral}}</p>
                        <p v-else>0</p>-->
                        <p>{{ totalIntegral }}</p>
                      </li>
                      <li>
                        <img src="../../../static/image/rhzj.png" alt />
                        <h4>入会距今</h4>
                        <p v-if="memberInfo.joinDay != null">
                          {{ memberInfo.joinDay }}天
                        </p>
                        <p v-else>0天</p>
                      </li>
                    </ul>
                  </div>
                  <div class="memberCard">
                    <p class="memberTit">
                      卡券信息
                      <span class="seeMore" @click="seeMoreCoupon">
                        <div>查看更多</div>
                      </span>
                    </p>
                    <div class="offline_his" v-if="memberInfoFirst.length == 0">
                      暂无相关数据
                    </div>
                    <ul class="memberCard-list" v-if="memberInfoFirst.length != 0">
                      <li :style="{ backgroundImage: 'url(' + bgImg + ')' }" v-for="(item, index) in memberInfoFirst"
                        ref="cardDetails" @click="details(index)" :class="
                          item.status == 4 || item.status == 7 ? 'ban_li' : ''
                        " :key="index">
                        <img src="../../../static/image/used.png" alt class="icon" v-if="item.status == '4'" />
                        <img src="../../../static/image/Expired.png" alt class="icon" v-if="item.status == '7'" />
                        <div class="memberCard-item-left">
                          <span class="cardType"
                            :class="item.name.length > 15 ? 'autoWidth' : ''">{{ item.name }}</span>
                          <!--<span class="cardType autoWidth">暂无相关数据暂无相关据暂无相关数据暂无相关数据暂无相关数据暂无相关据暂无相关数据暂无相关数据</span>-->
                          <p class="cardCode">卡券券码：{{ item.code }}</p>
                          <p class="cardDate">
                            使用期限：{{ item.startTime | modTime }}~{{item.endTime | modTime}}
                          </p>
                        </div>
                        <div class="memberCard-item-right">
                          <!--<h1 class="cardEffect">满1000元使用</h1>-->
                          <p class="cardDiscount" v-if="item.typeCode =='DJQ'">
                            ¥{{ item.value }}
                          </p>
                          <p class="cardDiscount" v-if="item.typeCode =='ZKQ'">
                            {{ item.value }}折
                          </p>
                          <p class="cardDiscount paddingtop" v-if="item.typeCode != 'DJQ' &&item.typeCode != 'ZKQ'">
                            {{ item.typename }}
                          </p>
                          <p class="cardFeature" v-if="item.payOver != null && item.typeCode =='DJQ'">
                            满{{ item.payOver }}元使用
                          </p>
                          <p class="cardFeature" v-if="item.payOver != null && item.typeCode =='ZKQ'">
                            满{{ item.payOver }}使用
                          </p>
                          <p class="cardFeature"
                            v-if="(item.payOver == null && item.typeCode =='DJQ') || (item.payOver == null && item.typeCode =='ZKQ')">
                            无门槛
                          </p>
                          <p class="cardFeature" v-if="item.useRange == 0">
                            通用
                          </p>
                          <p class="cardFeature" v-if="item.useRange == 1">
                            线上
                          </p>
                          <p class="cardFeature" v-if="item.useRange == 2">
                            线下
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="browseRecord">
                    <p class="memberTit">浏览记录</p>
                    <div class="offline_his" v-if="goodsList == '' || goodsList == null">
                      暂无相关数据
                    </div>
                    <swiper :options="swiperOption" ref="mySwiper" v-if="goodsList != '' && goodsList !=null">
                      <!-- slides -->
                      <swiper-slide v-for="item in goodsList" :key="item.goodsList">
                        <img :src="path + item.image" alt />
                        <p class="introduction">{{ item.name }}</p>
                        <p class="price">
                          ¥
                          <span>{{ item.price }}</span>
                        </p>
                      </swiper-slide>
                      <!-- Optional controls -->
                    </swiper>
                  </div>
                </mt-tab-container-item>
                <!-- 消费记录 -->
                <mt-tab-container-item id="2" v-if="memberConsumption != undefined">
                  <div class="expensesRecord">
                    <div class="memberRights" id="memberPay">
                      <ul class="memberRights-list">
                        <li>
                          <img src="../../../static/image/xfze.png" alt />
                          <h4>消费总额</h4>
                          <p v-if="memberConsumption.consumptionPrice != null">
                            ¥{{ memberConsumption.consumptionPrice }}
                          </p>
                          <p v-else>¥0</p>
                        </li>
                        <li>
                          <img src="../../../static/image/gmcs.png" alt />
                          <h4>购买次数</h4>
                          <p v-if="memberConsumption.consumptionNum != null">
                            {{ memberConsumption.consumptionNum }}
                          </p>
                          <p v-else>0</p>
                        </li>
                        <li>
                          <img src="../../../static/image/csts.png" alt />
                          <h4>沉睡天数</h4>
                          <p v-if="memberConsumption.sleepDay != null">
                            {{ memberConsumption.sleepDay }}天
                          </p>
                          <p v-else>0天</p>
                        </li>
                        <li>
                          <img src="../../../static/image/zjxfmd.png" alt />
                          <h4>最近消费门店</h4>
                          <p v-if="memberConsumption.recentShopName != null">
                            {{ memberConsumption.recentShopName }}
                          </p>
                          <p v-else>无</p>
                        </li>
                        <li>
                          <img src="../../../static/image/zjxfsj.png" alt />
                          <h4>最近消费日期</h4>
                          <p v-if="memberConsumption.lateLyDate != ''">
                            {{ memberConsumption.lateLyDate }}
                          </p>
                          <p v-else>无</p>
                        </li>
                      </ul>
                    </div>
                    <p class="memberTit storeMemberTit">
                      <span class="titName">
                        门店消费
                        <b class="itemNum">(共{{ memberConsumption.offLineconNum }}笔)</b>
                      </span>
                      <span @click="seeMoreOrder">
                        <div class="seeMore" id="STORE">查看更多</div>
                      </span>
                    </p>
                    <div class="Consumption store" v-if="offline[0] == null">
                      <div class="offline_his">暂无相关数据</div>
                    </div>
                    <template v-if="offline[0] != null">
                      <div class="Consumption store" v-for="item in offline" :key="item.id">
                        <p class="orderNo">
                          <span class="orderNum">订单号：{{ item.orderNum }}</span>
                          <span class="orderDate">{{
                            item.saleDate ? item.saleDate : item.createTime
                          }}</span>
                        </p>
                        <template v-if="item.orderMx">
                          <ul class="order-list">
                            <li class="order-item" v-for="(shop, idx) in item.orderMx" :key="idx">
                              <img :src="path + shop.goodsSkuPicture" alt class="order-img"
                                v-if="shop.goodsSkuPicture != null" />
                              <img src="../../../static/image/phone_error.png" alt class="order-img" v-else />
                              <div class="order-info">
                                <span class="order-name">SKU码：{{ shop.goodsSku }}</span>
                                <span class="order-price">¥{{ shop.price }}</span>
                              </div>
                            </li>
                          </ul>
                        </template>
                        <div class="order-settlement">
                          <span class="order-address">
                            消费地址 :
                            <b>{{ item.shopName }}</b>
                          </span>
                          <span class="order-total">
                            共计金额 :
                            <b>¥{{ item.discountPrice + item.postage }}</b>
                          </span>
                        </div>
                      </div>
                    </template>
                    <p class="memberTit onlineMemberTit">
                      <span class="titName">
                        线上消费
                        <b class="itemNum">(共{{ memberConsumption.lineconNum }}笔)</b>
                      </span>
                      <span @click="seeMoreOrder">
                        <div id="LINE" class="seeMore">查看更多</div>
                      </span>
                    </p>
                    <div class="Consumption online" v-if="line == null">
                      <div class="offline_his">暂无相关数据</div>
                    </div>
                    <div class="Consumption online" v-if="line != null">
                      <p class="orderNo">
                        <span class="orderNum">订单号：{{ line.orderNum }}</span>
                        <span class="orderDate">{{
                          line.saleDate ? line.saleDate : line.createTime
                        }}</span>
                      </p>
                      <template v-if="line.orderMx !=null">
                        <ul class="order-list">
                          <li class="order-item" v-for="(projact, index) in line.orderMx" :key="index">
                            <img :src="path + projact.goodsSkuPicture" alt class="order-img"
                              v-if="projact.goodsSkuPicture != null" />
                            <img src="../../../static/image/phone_error.png" alt class="order-img" v-else />
                            <div class="order-info">
                              <span class="order-name">{{
                              projact.goodsName
                            }}</span>
                              <span class="order-specification">{{ projact.specificationOneName }}:{{
                                projact.specificationOneCode
                              }}
                                {{ projact.specificationTwoName }}:{{
                                projact.specificationTwoCode
                              }}
                                {{ projact.specificationThreeName }}:{{
                                projact.specificationThreeCode
                              }}</span>
                              <span class="order-sku">SKU码：{{ projact.goodsSku }}</span>
                              <span class="order-price">¥{{ projact.price }}</span>
                            </div>
                          </li>
                        </ul>
                      </template>
                      <div class="order-settlement">
                        <span class="order-address">
                          订单状态 :
                          <b>{{ line.typeName }}</b>
                        </span>
                        <span class="order-total">
                          共计金额 :
                          <b>¥{{ line.discountPrice + line.postage }}</b>
                        </span>
                      </div>
                    </div>
                  </div>
                </mt-tab-container-item>
                <!-- 邀约回访 -->
                <mt-tab-container-item id="3">
                  <div class="invitationToReturn">
                    <div class="contactTrack">
                      <div class="contactTrack-tit">
                        <span>联系轨迹</span>
                        <div class="contactTrack-add" @click="newOffer">
                          新增
                        </div>
                      </div>
                      <div class="offline_his" v-if="invitedReview == '' || invitedReview == null">
                        暂无相关数据
                      </div>
                      <ul class="contactTrack-list" v-else>
                        <li class="contactTrack-item" v-for="(item, index) in invitedReviewFive" :key="index">
                          <img src="../../../static/image/circle.png" alt />
                          <p class="contactTrack-date">
                            {{ item.startTime }}
                            <span>{{ item.way }}</span>
                          </p>
                          <div class="contactTrack-contact">
                            <span class="contactType" v-if="item.typeName == null">其他</span>
                            <span class="contactType" v-else>{{
                              item.typeName
                            }}</span>
                            <span class="contactText">备注：{{ item.remark }}</span>
                          </div>
                        </li>
                      </ul>
                      <a class="seeDetails" v-if="invitedReview != ''" @click="seeMoreInvitation">查看详情</a>
                    </div>
                  </div>
                </mt-tab-container-item>
              </mt-tab-container>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 底部tab -->
    <div class="memberContact" v-if="memberInfo != undefined">
      <a class="tell" :href="'tel:' + memberInfo.phone">
        <img :class="memberInfo.iscp == false ? wximg : ''" src="../../../static/image/dh.png" alt />
        <span :class="memberInfo.iscp == false ? wxspan : ''">电话联系</span>
      </a>
      <!-- <a class="wx testButton2" v-if="
          (memberInfo.iscp == 'true' && memberInfo.cpUserId != '') ||
          memberInfo.cpUserId != null
        "> -->
      <!-- <a class="wx testButton1" v-if="memberInfo.iscp && !memberInfo.cpUserId">
        <img class="double_" src="../../../static/image/qywx_die.png" alt />
        <span>企业微信</span>
        <p>未激活</p>
      </a> -->
      <a class="wx testButton2" @click="chatWeChat">
        <img class="double_" src="../../../static/image/qywx_live.png" alt />
        <span style="color: #000">企业微信</span>
      </a>
      <!-- <a class="sms" :href="'sms:'+memberInfo.phone"> -->
      <a class="sms" @click="sendNote">
        <img :class="memberInfo.iscp == false ? wximg : ''" src="../../../static/image/dx.png" alt />
        <span :class="memberInfo.iscp == false ? wxspan : ''">短信联系</span>
      </a>
      <!-- <a class="wx hidden" v-if="
          (memberInfo.iscp == 'false' && memberInfo.cpUserId == '') ||
          memberInfo.cpUserId == null
        "></a> -->
    </div>
    <!-- 去club小程序 -->
    <div id="launchMiniprogram" v-if="isShowLaunchMini" @click="isShowLaunchMini = false">
      <main>
        <header>
          <p>引导会员注册club，即可查询到会员信息(仅针对未注册club的会员)</p>
        </header>
        <footer>
          <a @click.stop="toMini">点击进入CLUB，一键转发，注册绑定</a>
        </footer>
      </main>
    </div>
  </div>
</template>
<script>
  import scroll from "../../../components/scroll";
  import {
    MessageBox,
    Toast,
    Indicator
  } from "mint-ui";
  import {
    WxRegistered
  } from '../../../util/wxConfig.js'
  export default {
    name: "customerInformation",
    components: {
      scroll,
    },
    data() {
      return {
        isShowLaunchMini: false,
        public_lable: "public_lable",
        wximg: "wximg",
        ban_in: "ban_in",
        wxspan: "wxspan",
        autoWidth: "autoWidth",
        path: this.GLOBAL.imgURL,
        tel: "tel:",
        sms: "sms:",
        double_: "double_",
        //			个人资料
        memberInfo: [],
        //取个人资料的第一个数组
        memberInfoFirst: [],
        goodsList: [],
        //			消费记录
        memberConsumption: [],
        //			门店消费
        offline: [],
        offlineOrderMx: [],
        //			线上消费
        line: [],
        lineOrderMx: [],
        //			邀约回访
        invitedReview: [],
        selected: "1",
        bgImg: require("../../../static/image/yhj.png"),
        banners: ["/1.jpg", "/2.jpg", "/3.jpg"],
        swiperOption: {
          initialSlide: 0,
          direction: "horizontal",
          autoplay: {
            delay: 2000, //1秒切换一次
            disableOnInteraction: false,
          },
          loop: true,
          loopAdditionalSlides: 0,
          slidesPerView: 3,
          spaceBetween: 10,
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
        },
        memberid: "",
        guideId: "",
        not: "-",
        //		        标签参数
        status: "0",
        lables_disable: "",
        lables: "",
        isDlt: false,
        //		        删除标签传的参数
        labelId: "",
        type: "",
        clientHeight: "",
        //				企业微信聊天参数
        href: "",
        organizationId: "",
        _url: "",
        compMember: "",
        loginGuideId: "",
        copyP: null,
        totalIntegral: 0,
        //确认JSsdk初始化
        isSdk: false,
        //判断优享卡展示
        isShowCard: false,
      };
    },
    created() {
      this.href = location.origin;
      this._url = location.origin + "/doublev2v-crm-v2-wechat/wxcp/self";
      this.memberid = this.$route.query.memberId;
      this.guideId = this.$route.query.guideId;
      this.compMember = this.$route.query.compMember;
      this.organizationId = window.localStorage.organizationId;
    },
    mounted() {
      const _this = this
      if (this.organizationId == undefined) {
        this.$router.push({
          name: "login",
          query: {
            fromCust: 'customerInformation',
          }
        })
        return false
      }
      Indicator.open()
      _this.$nextTick(() => {
        window.setTimeout(function() {
          // 注入微信权限
          _this.getWxPermission().then(res => {
            // console.log('微信权限注入成功')
            _this.isInChatUser()
          })
        }, 500)
      })
      window.onresize = function() {
        this.clientHeight = "${document.documentElement.clientHeight}";
      };
    },
    methods: {
      //跳转裂变活动
      toMini() {
        wx.invoke('launchMiniprogram', {
          "appid": "wx9b801423992ecd1e", // 需跳转的小程序appid
          "path": "pages/index/index", // 所需跳转的小程序内页面路径及参数。非必填
        }, function(res) {
          if (res.err_msg == "launchMiniprogram:ok") {
            // 正常
            console.log(res)
          } else {
            // 错误处理
            console.log(res)
          }
        });
      },
      //从聊天进入获取外部联系人userid转换云客服id
      changeExternalUserId(externalUserId) {
        const _this = this
        let user = window.localStorage.getItem("user");
        user = user.replace(/"/g, "")
        _this.$api.post('my/getWorkWeChatMember', {
          guideId: user,
          // 外部联系人 userId
          externalUserId
        }, res => {
          _this.isSdk = true
          // console.log('--------------------------')
          // console.log(res)
          const {
            data,
            errcode: code,
            errmsg: message
          } = res
          if (code == 0) {
            // console.log('我是数据',data)
            _this.memberid = data
            _this.initInformation()
          }
        }, err => {
          Indicator.close()
          _this.isSdk = false
          const {
            data,
            errcode: code,
            errmsg: message
          } = err
          if (code == 518) {
            MessageBox.alert('企业微信接口查不到userid，无法查询会员信息，待技术后续优化', '提示');
          } else if (code == 519) {
            MessageBox.alert('企业微信接口查不到unionid，无法查询会员信息，待技术后续优化', '提示');
          } else if (code == 520) {
            _this.isShowLaunchMini = true
          } else if (code == 300) {
            MessageBox.alert('云客服查不到会员信息，待技术后续优化', '提示');
          } else {
            MessageBox.alert(message, '提示');
          }
        })
      },
      //是否从企业微信聊天工具栏进入详情
      isInChatUser() {
        const _this = this
        wx.invoke('getCurExternalContact', {}, function(res) {
          // console.log('我进入聊天方法')
          if (res.err_msg == "getCurExternalContact:ok") {
            // console.log('可以获取外部联系人userId')
            //返回当前外部联系人userId
            _this.changeExternalUserId(res.userId)
          } else {
            // console.log('我不是从聊天进入的')
            _this.isSdk = true
            //非聊天进入
            _this.initInformation()
          }
        });
      },
      //正常进入页面初始化
      initInformation() {
        const _this = this
        //获取会员信息
        this.getMemberInfo().then(function() {
          _this.hasBestCard()
        });
        //获取卡券信息
        this.getCardInfo();
        this.getMemberConsumption();
        this.getInvitedReview();
      },
      /**
       * 给当前页面注入应用微信权限
       */
      getWxPermission() {
        return new Promise((resolve, reject) => {
          const url = location.href.split("#")[0];
          // this.$api.post('my/getCpParameterApplication', {
          //   url: loCa
          // }
          // console.log(this.organizationId)
          // console.log(url)
          this.$api.post(
            "my/getCpParameter", {
              organizationId: this.organizationId,
              url,
            },
            res => {
              // console.log('获取注入微信的参数')
              // console.log(res.data);
              WxRegistered(res.data).then(response => {
                resolve()
              }).catch(err => {
                // console.log(err)
                Indicator.close()
                this.$toast({
                  message: "企业微信权限注入失败",
                  position: "middle",
                });
              })
            },
            err => {
              Indicator.close()
              console.log(err);
            }
          );
        })
      },
      /**
       * 获取顶部会员数据
       */
      getMemberInfo() {
        if (!this.isSdk) return false
        const _this = this
        return new Promise(function(resolve, reject) {
          let user = window.localStorage.getItem("user");
          let guideId = user.replace(/\"/g, "");
          _this.$api.get(
            "/memberInfo", {
              memberId: _this.memberid,
              requestName: "0",
            },
            (res) => {
              if (res.errcode == 0) {
                // console.log(res.data);
                const info = res.data;
                _this.memberInfo = info;
                _this.getIntegral(res.data.cardNum);
                _this.goodsList = info.goodsList;
                let memberId = _this.$route.query.memberId;
                _this.$store.commit({
                  type: "$_setMemberInfo",
                  phone: info.phone,
                  memberId,
                  guideId,
                });
                resolve()
              }
            },
            (err) => {
              Indicator.close()
              console.log(err);
              reject()
            }
          );
        })
      },
      /**
       * 获取当前积分
       */
      getIntegral(cstId) {
        if (!this.isSdk) return false
        this.$api.post(
          "findMemerIntegral", {
            cstId,
          },
          (res) => {
            // console.log(res);
            if (res.errcode == 0) {
              if (res.data == null) {
                this.totalIntegral = 0;
              } else {
                this.totalIntegral = res.data.totalIntegral;
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      /**
       * 输入备注名
       */
      openPrompt() {
        if (!this.isSdk) return false
        const _this = this
        const htmlS = `
				    <input placeholder="请输入备注名！" ref="remark" maxlength="5" type="text" id="remark">
       			<div class="message">
				     备注请不要超过5个字！
				    </div>
       `;
        MessageBox.confirm("", {
            message: htmlS,
            title: "添加备注",
          })
          .then((action) => {
            if (action == "confirm") {
              if (document.querySelector('#remark')) {
                let value = document.querySelector('#remark').value
                _this.memberInfo.remarkName = value;
                //添加备注成功并请求接口
                _this.$api.get(
                  "/updateMemberName", {
                    memberId: _this.memberid,
                    memberName: value,
                  },
                  (res) => {
                    // console.log(res)
                    if (res.errcode != 0) {
                      console.log("错误码" + res.errcode);
                    }
                  },
                  (err) => {
                    console.log(err)
                  }
                );
                document.querySelector('#remark').value = '';
              }
            }
          })
          .catch((err) => {
            if (err == "cancel") {
              if (document.querySelector('#remark')) {
                document.querySelector('#remark').value = '';
              }
            }
          });
      },
      /**
       * 切换绑定关系code为017时
       */
      changeRelationship() {
        if (!this.isSdk) return false
        const _this = this;
        if (this.compMember == "017") {
          let user = window.localStorage.getItem("user");
          _this.loginGuideId = user.replace(/\"/g, "");
          this.$api.post(
            "/whetherAssignable", {
              memberId: _this.memberid,
              userId: _this.loginGuideId,
            },
            (res) => {
              // console.log(res);
              if (res.errcode == 0) {
                _this.$router.push({
                  name: "replaceSuperior",
                  query: {
                    memberId: this.memberid,
                  },
                });
              }
            },
            (error) => {
              // console.log(error);
              switch (error.errcode) {
                case "102":
                  Toast({
                    message: error.errmsg,
                    position: "middle",
                  });
                  break;
                case "103":
                  Toast({
                    message: error.errmsg,
                    position: "middle",
                  });
                  break;
                case "506":
                  Toast({
                    message: error.errmsg,
                    position: "middle",
                  });
                  break;
                case "507":
                  Toast({
                    message: "该会员暂无绑定导购，不支持修改绑定关系",
                    position: "middle",
                  });
                  break;
                case "508":
                  Toast({
                    message: error.errmsg,
                    position: "middle",
                  });
                  break;
                case "509":
                  Toast({
                    message: "该会员绑定的是其他区域导购，如有修改需求，可联系当地区域经理",
                    position: "middle",
                  });
                  break;
                case "300":
                  Toast({
                    message: error.errmsg,
                    position: "middle",
                  });
                  break;

                default:
                  Toast({
                    message: "请联系管理员",
                    position: "middle",
                  });
                  break;
              }
            }
          );
        }
      },
      /**
       * 删除个人资料中的标签
       */
      delCustom_label(e) {
        if (!this.isSdk) return false
        if (this.isDlt) {
          // console.log(e.target.className);
          if (e.target.getAttribute("class") == "img") {
            this.labelId = e.target.parentNode.parentNode.getAttribute("lableid");
            this.type = e.target.parentNode.parentNode.getAttribute("type");
            e.target.parentNode.parentNode.remove();
          } else {
            this.labelId = e.target.getAttribute("lableid");
            this.type = e.target.getAttribute("type");
            e.target.remove();
          }
          this.$api.get(
            "/deleteLabel", {
              memberId: this.memberid,
              labelId: this.labelId,
              type: this.type,
            },
            (res) => {
              // console.log(res)
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      /**
       * 个人资料标签加
       */
      add() {
        if (!this.isSdk) return false
        this.$router.push({
          name: "addTag",
          query: {
            status: this.status,
            memberId: this.memberid,
          }
        });
      },
      /**
       * 个人标签减
       */
      del() {
        if (!this.isSdk) return false
        this.$nextTick(function() {
          let tagType = document.getElementById("infoTag-list");
          let public_lable = tagType.getElementsByClassName("public_lable");
          for (let i = 0; i < public_lable.length; i++) {
            if (public_lable[i].className == "public_lable") {
              public_lable[i].classList.add('opcity')
            }
          }
          this.isDlt = true;
        })
      },
      /**
       * 去往当前积分
       */
      toCurrentScore() {
        if (!this.isSdk) return false
        this.$router.push({
          name: "currentScore",
          query: {
            cstId: this.memberInfo.cardNum,
          },
        });
      },
      /**
       * 查看更多卡券
       */
      seeMoreCoupon() {
        if (!this.isSdk) return false
        this.$router.push({
          name: "seeMoreCoupon",
          query: {
            memberId: this.memberid,
            phone: this.memberInfo.phone,
          },
        });
      },
      /**
       * 获取卡券信息
       */
      getCardInfo() {
        if (!this.isSdk) return false
        this.$api.post(
          "/CardVoucher/findCouponByVip", {
            memberId: this.memberid,
          },
          (res) => {
            Indicator.close()
            // console.log(res.data);
            if (res.errcode == 0) {
              this.memberInfoFirst = res.data.filter(function(n, i) {
                return i <= 2;
              });
              // console.log(this.memberInfoFirst);
            }
          },
          (err) => {
            Indicator.close()
            console.log(err);
          }
        );
      },
      /**
       * 点击优惠券
       */
      details(idx) {
        if (!this.isSdk) return false
        let htmls = ``;
        if (this.memberInfoFirst[idx].getLimit == null) {
          htmls += `<p><b>每人限领:</b>不限制</p>`;
        } else {
          htmls +=
            `<p><b>每人限领:</b>` +
            this.memberInfoFirst[idx].getLimit +
            `张</p>`;
        }
        if (this.memberInfoFirst[idx].vipGrade == null) {
          htmls += `<p><b>会员等级:</b>全部</p>`;
        } else {
          htmls +=
            `<p><b>会员等级:</b>` +
            this.memberInfoFirst[idx].vipGrade +
            `</p>`;
        }
        if (
          this.memberInfoFirst[idx].couponRemark == null ||
          this.memberInfoFirst[idx].couponRemark == ""
        ) {
          htmls += `<p><b>使用说明:</b>无</p>`;
        } else {
          htmls += `<p><b>使用说明:</b></p>`;
          let remark = this.memberInfoFirst[idx].couponRemark.split("\n");
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
            if (action == "confirm") {}
          });
      },
      /**
       * 获取消费记录数据
       */
      getMemberConsumption() {
        if (!this.isSdk) return false
        this.$api.get(
          "/memberConsumption", {
            memberId: this.memberid,
            requestName: "1",
          },
          (res) => {
            Indicator.close()
            if (res.errcode == 0) {
              const info = res.data;
              this.memberConsumption = info;
              this.offline = info.offLine;
              this.offlineOrderMx = this.offline.orderMx;
              this.line = info.line[0];
              this.lineOrderMx = this.line.orderMx;
              // console.log(this.line);
            }
          },
          (err) => {
            Indicator.close()
            console.log(err);
          }
        );
      },
      /**
       * 消费记录-查看更多
       */
      seeMoreOrder(e) {
        if (!this.isSdk) return false
        let id = e.target.id;
        this.$router.push({
          name: "seeMoreOrder",
          query: {
            status: id,
            memberId: this.memberid,
          },
        });
      },
      /**
       * 邀约回访-新增
       */
      newOffer() {
        if (!this.isSdk) return false
        this.$router.push({
          name: "newOffer",
          query: {
            memberId: this.memberid,
            guideId: this.guideId,
          },
        });
      },
      /**
       * 获取联系轨迹数据
       */
      getInvitedReview() {
        if (!this.isSdk) return false
        this.$api.get(
          "/invitedReview", {
            memberId: this.memberid,
            requestName: "2",
          },
          (res) => {
            Indicator.close()
            if (res.errcode == 0) {
              const info = res.data;
              this.invitedReview = info;
              // console.log(this.invitedReview)
            }
          },
          (err) => {
            Indicator.close()
            console.log(err);
          }
        );
      },
      /**
       * 查看更多轨迹数据
       */
      seeMoreInvitation() {
        if (!this.isSdk) return false
        this.$router.push({
          name: "seeMoreInvitation",
          query: {
            memberId: this.memberid,
          },
        });
      },
      /**
       * 发送短信，选取短信模板
       */
      sendNote() {
        if (!this.isSdk) return false
        this.$router.push("selectNote");
      },
      /**
       * 动态修改高度
       */
      changeFixed(clientHeight) {
        if (!this.isSdk) return false
        //动态修改样式
        if (document.querySelector('.memberContact')) {
          this.$refs.homePage.style.height =
            clientHeight - document.querySelector('.memberContact').offsetHeight + "px";
        }
      },
      /**
       * 隐藏删除标记
       */
      hide() {
        if (!this.isSdk) return false
        this.isDlt = false;
        let tagType = document.getElementById("infoTag-list");
        let public_lable = tagType.getElementsByClassName("public_lable");
        for (let i = 0; i < public_lable.length; i++) {
          if (public_lable[i].className != "") {
            public_lable[i].classList.remove("opcity");
          }
        }
      },
      /**
       * 判断是否有优享卡角标
       */
      hasBestCard() {
        if (!this.isSdk) return false
        const _this = this
        _this.$api.post('findMemberBenefit', {
          vipId: _this.memberInfo.cardNum,
          type: "AMYXK"
        }, res => {
          Indicator.close()
          console.log(res)
          if (res.errcode == 0) {
            res.data.length ? _this.isShowCard = true : _this.isShowCard = false
          }
        }, err => {
          Indicator.close()
          // console.log(err)
        })
      },
      /**
       * 复制手机号码
       */
      copyPhone() {
        if (!this.isSdk) return false
        const _this = this;
        wx.setClipboardData({
          data: _this.memberInfo.phone, // 设置的
          success: function(res) {
            // console.log(res.errMsg);
            _this.$toast({
              message: "成功复制手机号码到剪切板",
              position: "middle",
            });
          },
          fail: function(err) {
            console.log(err);
          },
        });
      },
      /**
       * 判断是否企业微信聊天，创建会话群
       */
      chatWeChat() {
        if (!this.isSdk) return false
        Indicator.open();
        const _this = this
        _this.$api.post('/my/getWorkWeChatParameter', {
          guideId: _this.guideId,
          memberId: _this.memberid
        }, res => {
          // console.log(res)
          Indicator.close();
          let userIds = res.data.userId
          let externalUserIds = res.data.externalUserId
          // console.log(userIds, externalUserIds)
          //通过接口掉起讨论群
          wx.openEnterpriseChat({
            userIds, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
            externalUserIds, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
            groupName: '爱慕云导购', // 必填，会话名称。单聊时该参数传入空字符串""即可。
            success: function(res) {
              // console.log(res)
              // 回调
            },
            fail: function(res) {
              // console.log(res)
              if (res.errMsg.indexOf('function not exist') > -1) {
                alert('版本过低，请升级')
              }
            }
          });
        }, err => {
          Indicator.close();
          // console.log(err)
          let code = err.errcode
          switch (code) {
            case '103':
              Toast({
                message: err.errmsg,
                position: "middle",
              });
              break
            case '300':
              Toast({
                message: err.errmsg,
                position: "middle",
              });
              break
            case '515':
              Toast({
                message: '无法查询中台会员卡信息，请联系技术人员',
                position: "middle",
              });
              break
            case '516':
              Toast({
                message: '无法查询中台会员信息，请联系技术人员',
                position: "middle",
              });
              break
            case '517':
              Toast({
                message: '无法查询中台会员信息unionid，请联系技术人员',
                position: "middle",
              });
              break
            case '518':
              Toast({
                message: '没有外部联系人信息，请先加会员好友',
                position: "middle",
              });
              break
          }
        })
      },



      // btn1() {
      //   console.log(1111111);
      //   wx.invoke(
      //     "selectExternalContact",
      //     {
      //       filterType: 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
      //     },
      //     function (res) {
      //       if (res.err_msg == "selectExternalContact:ok") {
      //         var userIds = res.userIds; //返回此次选择的外部联系人userId列表，数组类型
      //         if (userIds.length != 1) {
      //           alert("只能选取一个联系人");
      //           return;
      //         }
      //         var userId = userIds + "";
      //         alert(userId);
      //         this.$api.get(
      //           "" + this._url + "/getExternalContact",
      //           {
      //             memberUserId: userId,
      //             memberId: this.memberId,
      //           },
      //           (res) => {
      //             if (res.errcode == "0") {
      //               if ($(".memberContact .testButton2").length == 0) {
      //                 $(".testButton1").remove();
      //                 $(".memberContact .sms").before(
      //                   '<a href="javascript:;" class="wx testButton2">' +
      //                   '<img src="../images/qywx_live.png" alt="" class="sms" />' +
      //                   "<p>企业微信</p></a>"
      //                 );
      //                 $(".memberContact .wx").css("color", "#000");
      //               }
      //               this.conversation(userIds);
      //             } else if (res.errcode == "100") {
      //               MessageBox({
      //                 title: "警告",
      //                 message: "系统异常！",
      //                 showCancelButton: false,
      //               });
      //             } else if (res.errcode == "502") {
      //               MessageBox({
      //                 title: "警告",
      //                 message: "会员与外部联系人信息不一致，请重新选择！",
      //                 showCancelButton: false,
      //               });
      //             }
      //           },
      //           (err) => {
      //             console.log(err);
      //             let code = err.code;
      //           }
      //         );
      //       } else if (res.err_msg == "selectExternalContact:fail") {
      //         //错误处理
      //         //				alert(res.err_msg)
      //       }
      //     }
      //   );
      // },
      // //企业微信
      // conversation(userIds) {
      //   let userId = userIds + "";
      //   console.log(userId);
      //   wx.openEnterpriseChat({
      //     externalUserIds: userId,
      //     groupName: "123",
      //     success: function (res) { },
      //     fail: function (res) {
      //       if (res.errMsg.indexOf("function not exist") > -1) {
      //         alert("版本过低请升级");
      //       }
      //     },
      //   });
      // },
      // btn2() {
      //   console.log(2222222);
      //   this.$api.get(
      //     "memberInfo",
      //     {
      //       memberId: this.memberid,
      //     },
      //     (res) => {
      //       console.log(res);
      //       var info = res.data;
      //       var cpUserId = info.cpUserId;
      //       wx.openEnterpriseChat({
      //         externalUserIds: cpUserId,
      //         groupName: "123",
      //         success: function (res) {
      //           // 回调
      //           console.log(res);
      //           //alert(res.err_msg);
      //         },
      //         fail: function (res) {
      //           console.log(res);
      //           if (res.errMsg.indexOf("function not exist") > -1) {
      //             alert("版本过低请升级");
      //           }
      //         },
      //       });
      //     },
      //     (err) => {
      //       console.log(err);
      //       let code = err.code;
      //     }
      //   );
      // },
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      },
      invitedReviewFive() {
        return this.invitedReview.slice(0, 5)
      }
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight() {
        this.changeFixed(this.clientHeight);
      }
    },
    filters: {
      modTime(data) {
        return data.substr(0, 10);
      },
    },
  };
</script>
<style lang="scss">
  @import "../../../style/scss/customerInfomation";
</style>
