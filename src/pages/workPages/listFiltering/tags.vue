<template>
  <div class="contianer" @click="isIndex=null">
    <div class="header">
      <i class="iconfont backBtn" @click="back">&#xe600;</i>
      <span></span>
      <span id="personalityEnter" v-show="isEnter" @click="personality">确认</span>
    </div>
    <mt-navbar v-model="selected" class="controler">
      <mt-tab-item id="1" class="aMember">
        <div @click.stop="getAuto()">自动标签</div>
      </mt-tab-item>
      <mt-tab-item id="2" class="shopMember">
        <div @click.stop="getLabel()">公司标签</div>
      </mt-tab-item>
      <mt-tab-item id="3" class="myMember">
        <div @click.stop="getLabelHistory()">个性标签</div>
      </mt-tab-item>
    </mt-navbar>

    <!--tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <scroll ref="pullrefresh" :nullDataAll="nullDataAllLeft">
          <ul class="autotagType" id="autotagType">
            <li class="tagType-list" v-for="item in autoLabels" :key="item.labelId">
              <p class="tag-title">{{item.labelName}}：</p>
              <ol class="tags">
                <template v-if="status && status == 0">
                  <li v-for="project in item.labelList" :key="project.labelId" @click="toggle" :labelId="project.labelId" :value="project.source" :class="project.source == 2 ? tag_bg : ''">#{{project.labelName}}</li>
                </template>
                <template v-if="status && status == 1">
                  <li v-for="project in item.labelList" :key="project.labelId" @click="toggle" :labelId="project.labelId" :value="project.source" :class="project.source == 1 ? disabled : ''">#{{project.labelName}}</li>
                </template>
              </ol>
            </li>
          </ul>
        </scroll>
        <div class="footer" v-show="isShow">
          <span class="selected">已选择：{{selectedNum}}个标签</span>
          <span class="enter" @click="company">确定</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <scroll ref="pullrefresh" :nullDataAll="nullDataAllMiddle">
          <ul class="tagType" id="tagType">
            <li class="tagType-list" v-for="item in label" :key="item.labelId">
              <p class="tag-title">{{item.labelName}}：</p>
              <ol class="tags">
                <template v-if="status && status == 0">
                  <li v-for="project in item.labelList" :key="project.labelId" @click="toggle" :labelId="project.labelId" :value="project.source" :class="project.source == 2 ? tag_bg : ''">#{{project.labelName}}</li>
                </template>
                <template v-if="status && status == 1">
                  <li v-for="project in item.labelList" :key="project.labelId" @click="toggle" :labelId="project.labelId" :value="project.source" :class="project.source == 1 ? disabled : ''">#{{project.labelName}}</li>
                </template>
              </ol>
            </li>
          </ul>
        </scroll>
        <div class="footer" v-show="isShow">
          <span class="selected">已选择：{{selectedNum}}个标签</span>
          <span class="enter" @click="company">确定</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <scroll ref="pullrefresh" :nullDataAll="nullDataAllRight">
          <div class="addTags">
            <div class="tag_data" v-show="isTag">
              <template v-for="(item,index) in labelSelect">
                <div class="tag-item tag_top" :key="item.id" v-if="item.type == 2" :value="item.id" @click.stop="delSelect(index)">
                  <span>{{item.labelName}}</span>
                  <img src="../../../static/image/close_.png" :class="{display:index == isIndex}" alt />
                </div>
              </template>
              <input type="text" ref="tag_data_txt" placeholder="输入标签" maxlength="15" autocomplete="off" onkeyup="this.size=(this.value.length>4?this.value.length:4);" size="4" class="tag_data_txt" style="width: auto;" @keyup.13="addTag" @keyup.delete="deleTag" />
              <p class="prompt" style="display: none;">输入字数不超过15个字！</p>
            </div>
          </div>
          <div class="tag_history">
            <p class="tag_tittle tit_h">历史记录：</p>
            <ul class="tag_mode history" id="history">
              <template v-if="status && status == 0">
                <li v-for="(item,index) in labelHistory" :key="index" :class="item.type == 2 ? tag_mode_bg : ''" :value="item.id" @click="itemTag">#{{item.labelName}}</li>
              </template>
              <template v-if="status && status == 1">
                <li v-for="item in labelSelect" :key="item.id" :class="item.type == 2 ? tag_bg : ''" :value="item.id" @click="toggle">#{{item.labelName}}</li>
              </template>
            </ul>
          </div>
        </scroll>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="footer" v-show="isHave">
      <span class="selected">已选择：{{selectedNum}}个标签</span>
      <span class="enter" @click="subLabel">确定</span>
    </div>
  </div>
</template>

<script>
import scroll from "../../../components/scroll";
export default {
  name: "addTag",
  components: {
    scroll
  },
  data() {
    return {
      //判断进来路由,true为listFiltering
      fromRoute: true,
      selected: "1",
      tag_mode_bg: "tag_mode_bg",
      tag_bg: "tag_bg",
      disabled: "disabled",
      isIndex: null,
      isTag: true,
      isShow: true,
      isHave: false,
      nullDataAllLeft: false,
      nullDataAllMiddle: false,
      nullDataAllRight: false,
      selectedNum: "0",
      //		    	status为1时是筛选标签,为0时是添加标签
      status: "",
      //		    	从会员列表页保存的筛选数据
      gender: "",
      address: "",
      grades: "",
      shopGuides: "",
      registDate: "",
      pointSmall: "",
      pointBig: "",
      timeVal: "",
      dataSource: "",
      couponId: "",
      memberId: "",
      cardManagementId: "",
      cardManagermentId: "",
      //			判断从门店会员还是我的会员进入
      state: "",
      //			公司标签
      label: [],
      //			历史标签
      labelHistory: [],
      //			已选中标签
      labelSelect: [],
      data: {
        id: "",
        labelName: "",
        page: "1",
        size: "1000",
        type: ""
      },
      param: {
        guideId: "",
        memberId: "",
        labelName: "",
        labers: "",
        page: "1",
        size: "1000"
      },
      paramData: {
        guideId: "",
        label: "",
        requestName: "3",
        page: "1",
        size: "1000"
      },
      autoLabels: [],
      lables: [],
      lables_company_s: [],
      lables_customize_s: [],
      isEnter: false,
      lastTime: '',
      lastTimeVal: ''
    };
  },
  beforeRouteEnter(to, from, next) {
    //判断由哪个页面过来
    if (from.name == "listFiltering") {
      next(vm => {
        vm._data.fromRoute = true;
      });
    } else {
      next(vm => {
        vm._data.fromRoute = false;
      });
    }
  },
  created() {
    let user = localStorage.getItem("user");
    this.param.guideId = user.replace(/\"/g, "");
    this.paramData.guideId = this.param.guideId;
    this.getParams();
    let status = this.status;
    if (status == 1) {
      this.isTag = false;
      this.isShow = false;
      this.isEnter = false;
      this.isHave = true;
    }
  },
  mounted() {
    this.getAuto();
  },
  methods: {
    /**
     * 将数据放在当前组件的数据内
     */
    getParams() {
      this.dataSource = this.$route.query.dataSource;
      this.status = this.$route.query.status;
      this.gender = this.$route.query.gender;
      this.address = this.$route.query.address;
      this.grades = this.$route.query.grades;
      this.shopGuides = this.$route.query.shopGuides;
      this.pointSmall = this.$route.query.pointSmall;
      this.pointBig = this.$route.query.pointBig;
      this.registDate = this.$route.query.registDate;
      this.timeVal = this.$route.query.timeVal;
      this.state = this.$route.query.state;
      this.couponId = this.$route.query.couponId;
      this.memberLsit = this.$route.query.memberLsit;
      this.cardManagementId = this.$route.query.cardManagementId;
      this.cardManagermentId = this.$route.query.cardManagermentId;
      this.lastTime = this.$route.query.lastTime;
      this.lastTimeVal = this.$route.query.lastTimeVal
    },
    /**
     * 退回上个页面
     */
    back() {
      this.$router.go(-1);
    },
    /**
     * 获取自动标签
     */
    getAuto() {
      this.selected = "1";
      const status = this.status;
      if (status == 1) {
        this.$api.get(
          "/CardVoucher/autoLabel",
          {
            guideId: this.param.guideId,
            requestName: "0",
            page: "1",
            size: "1000"
          },
          res => {
            if (res.errcode == 0) {
              const info = res.data;
              if (info.length == 0) {
                this.nullDataAllLeft = true;
              } else {
                this.nullDataAllLeft = false;
              }
              if (info.length <= 1000) {
                this.autoLabels = info;
              } else {
                this.autoLabels = this.autoLabels.concat(info);
              }
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    /**
     * 标签选中与反选
     */
    toggle(e) {
      const status = this.status;
      if (status == 1) {
        if (e.srcElement.className == "") {
          e.srcElement.className = this.tag_bg;
        } else if (e.srcElement.className != "") {
          e.srcElement.className = "";
        }
        this.selectedNum = document.getElementsByClassName("tag_bg").length;
      }
    },
    /**
     * 获取公司标签
     */
    getLabel() {
      this.selected = "2";
      const status = this.status;
      if (status == 1) {
        this.$api.get(
          "/CardVoucher/manualLabel",
          {
            guideId: this.param.guideId,
            requestName: "1"
          },
          res => {
            if (res.errcode == 0) {
              const info = res.data;
              if (info.length == 0) {
                this.nullDataAllMiddle = true;
              } else {
                this.nullDataAllMiddle = false;
              }
              if (info.length <= 1000) {
                this.label = info;
              } else {
                this.label = this.label.concat(info);
              }
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    /**
     * 获取个人标签
     */
    getLabelHistory() {
      this.selected = "3";
      const status = this.status;
      // console.log(this.param)
      if (status == 1) {
        this.$api.get(
          "/interview/guidelabel",
          {
            guideId: this.param.guideId,
            memberId: this.param.memberId,
            labelName: this.param.labelName,
            labers: this.param.labers,
            requestName: "2"
          },
          res => {
            if (res.errcode == 0) {
              const info = res.data;
              // console.log(info);
              if (info.length == 0) {
                this.nullDataAllRight = true;
              } else {
                this.nullDataAllRight = false;
              }
              if (info.length <= 1000) {
                this.labelSelect = info;
              } else {
                this.labelSelect = this.labelSelect.concat(info);
              }
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    /**
     * 确认选中的标签并返回
     */
    subLabel() {
      let label_len = document.querySelectorAll('li.tag_bg');
      let label_i = "";
      for (let i = 0; i < label_len.length; i++) {
        label_i += label_len[i].outerHTML;
      }
      if (this.fromRoute) {
        this.$router.replace({
          name: "listFiltering",
          params: {
            gender: this.gender,
            address: this.address,
            grades: this.grades,
            shopGuides: this.shopGuides,
            pointSmall: this.pointSmall,
            pointBig: this.pointBig,
            registDate: this.registDate,
            timeVal: this.timeVal,
            label: label_i,
            states: this.status,
            tagsPage: true,
            lastTime: this.lastTime,
            lastTimeVal: this.lastTimeVal
          },
          query: {
            dataSource: this.dataSource,
            state: this.state,
            couponId: this.couponId,
            memberLsit: this.memberLsit,
            cardManagementId: this.cardManagementId,
            cardManagermentId: this.cardManagermentId
          }
        });
      } else {
        this.$router.replace({
          name: "pendingMemberFilter",
          params: {
            gender: this.gender,
            address: this.address,
            grades: this.grades,
            shopGuides: this.shopGuides,
            pointSmall: this.pointSmall,
            pointBig: this.pointBig,
            registDate: this.registDate,
            timeVal: this.timeVal,
            label: label_i,
            states: this.status,
            tagsPage: true,
            lastTime: this.lastTime,
            lastTimeVal: this.lastTimeVal
          },
          query: {
            dataSource: this.dataSource,
            state: this.state,
            couponId: this.couponId,
            memberLsit: this.memberLsit,
            cardManagementId: this.cardManagementId,
            cardManagermentId: this.cardManagermentId
          }
        });
      }
    },
    /**
     *提交公司标签  
     */
    company() {
      this.param.guideId = "";
      let tagType = document.getElementById("tagType");
      let company_li = tagType.getElementsByTagName("li");
      if (company_li) {
        for (var i = 0; i < company_li.length; i++) {
          if (company_li[i].className == "tag_bg") {
            this.lables.push(company_li[i].getAttribute("labelid"));
          }
        }
      }
      this.param.labers = this.lables.toString();
      this.$api.get(
        "/addlabel",
        {
          guideId: this.param.guideId,
          memberId: this.param.memberId,
          labelName: this.param.labelName,
          labers: this.param.labers,
          requestName: "4"
        },
        res => {
          if (res.errcode == 0) {
            this.$router.push({
              path: "yourPath",
              name: "customerInformation",
              query: {
                name: "name",
                memberId: this.param.memberId
              }
            });
          }
        },
        err => {
          console.log(err);
          let code = err.code;
        }
      );
    },
    /**
     * 选中已选择的个性标签删除
     */
    delSelect(index) {
      if (this.isIndex == index) {
        let listT = this.labelSelect;
        listT[index].type = 1;
        this.isIndex = null;
      } else {
        this.isIndex = index;
      }
    },
    /**
     * 按下enter添加个性标签
     */
    addTag() {
      if (this.$refs.tag_data_txt.value != "") {
        this.data = [
          { id: "", labelName: this.$refs.tag_data_txt.value, type: "2" }
        ];
        console.log(this.labelSelect);
        for (var i in this.labelSelect) {
          if (this.labelSelect[i].labelName == this.data[0].labelName) {
            this.labelSelect[i].className = this.tag_mode_bg;
            this.labelHistory[i].className = this.tag_mode_bg;
            console.log(this.labelSelect);
            return;
          }
        }
        this.labelSelect = this.labelSelect.concat(this.data);
        for (var i in this.labelHistory) {
          if (this.labelHistory[i].labelName == this.data[0].labelName) {
            this.labelHistory[i].className = this.tag_mode_bg;
            return;
          }
        }
        this.labelHistory = this.labelHistory.concat(this.data);
        console.log(this.labelSelect);
        this.$refs.tag_data_txt.value = "";
      }
    },
    //         	按下delete删除个性标签
    deleTag: function (e) {
      if (this.$refs.tag_data_txt.value == "") {
        let listV;
        let listAl;
        let deleVal =
          e.srcElement.previousElementSibling.childNodes[0].innerHTML;
        let listVal = document.getElementsByClassName("tag_mode_bg");
        let listT = this.labelSelect;
        for (let i = 0; i < listVal.length; i++) {
          listV = listVal[i];
          listAl = listVal[i].innerHTML;
          if (deleVal == listAl) {
            listV.setAttribute("class", "");
          }
        }
        for (var s = 0; s < listT.length; s++) {
          if (deleVal == listT[s].labelName) {
            listT[s].type = "1";
          }
        }
        console.log(listT);
      }
    },
    //         	选中历史标签
    itemTag: function (e) {
      let deleVal = e.srcElement.innerHTML;
      let listT = this.labelSelect;
      this.data = { id: "", labelName: e.srcElement.innerHTML, type: "2" };
      if (e.srcElement.className == "") {
        for (var s = 0; s < listT.length; s++) {
          if (deleVal == listT[s].labelName) {
            listT[s].type = 2;
          }
        }
        e.srcElement.className = this.tag_mode_bg;
        //					this.labelSelect=this.labelSelect.concat(this.data);
        console.log(this.labelSelect);
      } else if (e.srcElement.className != "") {
        e.srcElement.className = "";
        for (var s = 0; s < listT.length; s++) {
          if (deleVal == listT[s].labelName) {
            listT[s].type = 1;
          }
        }
        this.isIndex = null;
        console.log(this.labelSelect);
      }
    },


    //			提交个性标签
    personality: function () {
      let personalityLab;
      let personalityLabList = [];
      let label = document.getElementsByClassName("tag_top");
      for (let i = 0; i < label.length; i++) {
        personalityLab = label[i].childNodes[0].innerHTML;
        personalityLabList.push(personalityLab);
      }
      this.param.labelName = personalityLabList.toString();
      console.log(this.param);
      this.$api.get(
        "/addlabelGuideId",
        {
          guideId: this.param.guideId,
          memberId: this.param.memberId,
          labelName: this.param.labelName,
          labers: this.param.labers,
          requestName: "5"
        },
        res => {
          if (res.errcode == 0) {
            this.$router.push({
              path: "yourPath",
              name: "customerInformation",
              query: {
                name: "name",
                memberId: this.param.memberId
              }
            });
          }
        },
        err => {
          console.log(err);
          let code = err.code;
        }
      );
    },

    // getSave() {
    //   this.$api.get(
    //     "/my/saveData",
    //     this.paramData,
    //     res => {
    //       if (res.errcode == 0) {
    //       }
    //     },
    //     err => {
    //       console.log(err);
    //       let code = err.code;
    //     }
    //   );
    // }
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/tags";
@font-face {
  font-family: "iconfont";
  /* project id 770909 */
  src: url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.eot");
  src: url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.woff") format("woff"),
    url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_770909_vfebvlxw6jo.svg#iconfont") format("svg");
}
</style>
