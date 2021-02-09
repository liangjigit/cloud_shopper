<template>
  <div class="contianer" @click="isIndex=null">
    <div class="header">
      <i class="iconfont backBtn" @click="back">&#xe600;</i>
      <span></span>
      <span id="personalityEnter" v-show="isEnter" @click="personality">确认</span>
    </div>
    <mt-navbar v-model="selected" class="controler">
      <mt-tab-item id="1" class="shopMember">
        <div @click.stop="getLabel()">公司标签</div>
      </mt-tab-item>
      <mt-tab-item id="2" class="myMember">
        <div @click.stop="getLabelHistory()">个性标签</div>
      </mt-tab-item>
    </mt-navbar>
    <!--tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <scroll ref="pullrefresh" :nullDataAll="nullDataAllLeft">
          <ul class="tagType" id="tagType">
            <li class="tagType-list" v-for="item in label" :key="item.labelId">
              <p class="tag-title">{{item.labelName}}：</p>
              <ol class="tags">
                <template v-if="status == 0">
                  <li v-for="project in item.labelList" :key="project.labelId" @click="toggle" :labelId="project.labelId" :value="project.source" :class="project.source == 2 ? tag_bg : ''">{{project.labelName}}</li>
                </template>
                <template v-if="status == 1">
                  <li v-for="project in item.labelList" :key="project.labelId" @click="toggle" :labelId="project.labelId" :value="project.source" :class="project.source == 1 ? disabled : ''">{{project.labelName}}</li>
                </template>
              </ol>
            </li>
          </ul>
        </scroll>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <scroll ref="pullrefresh" :nullDataAll="nullDataAllRight">
          <div class="addTags">
            <div class="tag_data" v-show="isTag">
              <template v-for="(item,index) in labelSelect">
                <div class="tag-item tag_top" v-if="item.type==2" :value="item.id" :key="item.id" @click.stop="delSelect(index)">
                  <span>{{item.labelName}}</span>
                  <img src="../../../../static/image/close_.png" :class="{display:index==isIndex}" alt />
                </div>
              </template>
              <input type="text" ref="tag_data_txt" placeholder="输入标签" maxlength="15" autocomplete="off" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>4?this.value.length:4);" size="4" class="tag_data_txt" style="width: auto;" @keyup.13="addTag" @keyup.delete="deleTag" />
              <p class="prompt" style="display: none;">输入字数不超过15个字！</p>
            </div>
          </div>
          <div class="tag_history">
            <p class="tag_tittle tit_h">历史记录：</p>
            <ul class="tag_mode history" id="history">
              <template v-if="status==0">
                <li v-for="item in labelHistory" :class="item.type==2?tag_mode_bg:''" :value="item.id" :key="item.id" @click="itemTag">{{item.labelName}}</li>
              </template>
              <template v-if="status==1">
                <li v-for="item in labelSelect" :class="item.type==2?tag_bg:''" :key="item.id" :value="item.id" @click="toggle">{{item.labelName}}</li>
              </template>
            </ul>
          </div>
        </scroll>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="footer" v-show="isShow&&selected == '1'">
      <span class="selected">已选择：{{selectedNum}}个标签</span>
      <span class="enter" @click="company">确定</span>
    </div>
  </div>
</template>

<script>
import scroll from "../../../../components/scroll";
export default {
  name: "addTag",
  components: {
    scroll,
  },
  data() {
    return {
      selected: "1",
      tag_mode_bg: "tag_mode_bg",
      tag_bg: "tag_bg",
      disabled: "disabled",
      isIndex: null,
      isTag: true,
      isShow: true,
      isHave: false,
      nullDataAllLeft: false,
      nullDataAllRight: false,
      //		        删除标签标示
      deledt: false,
      //		    	status为1时是筛选标签,为0时是添加标签
      status: "",
      //		    	从会员列表页保存的筛选数据
      sex: "",
      gender: "",
      age: "",
      address: "",
      whichGuide: "",
      grade: "",
      registDate: "",
      shopDate: "",
      selectedNum: "",
      //公司标签
      label: [],
      //历史标签
      labelHistory: [],
      //已选中个人标签
      labelSelect: [],
      data: {
        id: "",
        labelName: "",
        page: "1",
        size: "1000",
        type: "",
      },
      param: {
        guideId: "",
        memberId: "",
        labelName: "",
        page: "1",
        size: "1000",
        labers: "",
      },
      paramData: {
        guideId: "",
        company: "",
        page: "1",
        size: "1000",
        customize: "",
        requestName: "0",
      },
      lables: [],
      lables_company_s: [],
      lables_customize_s: [],
      isEnter: false,
      //第一次进入个人标签
      firstEnterP: true,
    };
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
    this.getLabel();
  },
  methods: {
    /**
     * 将URL数据放在当前组件的数据内
     */
    getParams() {
      this.status = this.$route.query.status;
      this.param.memberId = this.$route.query.memberId;
      this.paramData.memberId = this.param.memberId;
      this.sex = this.$route.query.sex;
      this.age = this.$route.query.age;
      this.address = this.$route.query.address;
      this.whichGuide = this.$route.query.whichGuide;
      this.grade = this.$route.query.grade;
      this.registDate = this.$route.query.registDate;
      this.shopDate = this.$route.query.shopDate;
    },
    /**
     * 返回
     */
    back() {
      this.$router.go(-1);
    },
    /**
     * 获取公司标签
     */
    getLabel() {
      this.selected = "1";
      const status = this.status;
      if (status == 1) {
        this.$api.get(
          "/getLabel",
          {
            guideId: this.param.guideId,
            memberId: this.param.memberId,
            labelName: this.param.labelName,
            labers: this.param.labers,
            page: "1",
            size: "1000",
            requestName: "1",
          },
          (res) => {
            if (res.errcode == 0) {
              // console.log(res.data)
              const info = res.data;
              if (info.length < 1000) {
                this.label = info;
              } else {
                this.label = this.label.concat(info);
              }
              let cont = 0;
              for (let i = 0; i < info.length; i++) {
                let lableL = info[i].labelList;
                for (let j = 0; j < lableL.length; j++) {
                  if (lableL[j].source == "2") {
                    cont++;
                  }
                }
              }
              this.selectedNum = cont;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.$api.get(
          "/label",
          {
            guideId: this.param.guideId,
            memberId: this.param.memberId,
            labelName: this.param.labelName,
            labers: this.param.labers,
            page: "1",
            size: "1000",
            requestName: "2",
          },
          (res) => {
            if (res.errcode == 0) {
              // console.log(res.data)
              const info = res.data;
              if (info.length == 0) {
                this.nullDataAllLeft = true;
              } else {
                this.nullDataAllLeft = false;
              }
              if (info.length < 1000) {
                this.label = info;
              } else {
                this.label = this.label.concat(info);
              }
              let cont = 0;
              for (let i = 0; i < info.length; i++) {
                let lableL = info[i].labelList;
                for (let j = 0; j < lableL.length; j++) {
                  if (lableL[j].source == "2") {
                    cont++;
                  }
                }
              }
              this.selectedNum = cont;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    /**
     * 公司标签选中&取消选中选择
     *
     */
    toggle(e) {
      if (e.srcElement.className == "") {
        e.srcElement.className = this.tag_bg;
      } else if (e.srcElement.className != "") {
        e.srcElement.className = "";
      }
      this.selectedNum = document.getElementsByClassName("tag_bg").length;
    },
    /**
     * 提交公司标签
     */
    company() {
      this.param.guideId = "";
      let tagType = document.getElementById("tagType");
      let company_li = tagType.getElementsByTagName("li");
      for (let i = 0; i < company_li.length; i++) {
        if (company_li[i].className == "tag_bg") {
          this.lables.push(company_li[i].getAttribute("labelid"));
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
          requestName: "4",
        },
        (res) => {
          if (res.errcode == 0) {
            this.$router.replace({
              name: "customerInformation",
              query: {
                memberId: this.param.memberId,
              },
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 获取个性标签
     */
    getLabelHistory() {
      this.selected = "2";
      const status = this.status;
      if (status == 1) {
        this.$api.get(
          "/interview/guidelabel",
          {
            guideId: this.param.guideId,
            memberId: this.param.memberId,
            labelName: this.param.labelName,
            labers: this.param.labers,
            page: "1",
            size: "1000",
            requestName: "3",
          },
          (res) => {
            if (res.errcode == 0) {
              // console.log(res.data)
              const info = res.data;
              if (info.length < 1000) {
                this.labelSelect = info;
              } else {
                this.labelSelect = this.labelSelect.concat(info);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.$api.get(
          "/labelhistory",
          {
            guideId: this.param.guideId,
            memberId: this.param.memberId,
            labelName: this.param.labelName,
            labers: this.param.labers,
            page: "1",
            size: "1000",
            requestName: "3",
          },
          (res) => {
            if (res.errcode == 0) {
              // console.log(res.data)
              const info = res.data;
              if (info.length == 0) {
                this.nullDataAllRight = true;
              } else {
                this.nullDataAllRight = false;
              }
              if (info.length < 1000) {
                this.labelHistory = info;
                if (this.firstEnterP) {
                  this.labelSelect = info;
                  this.firstEnterP = false;
                }
              } else {
                this.labelHistory = this.labelHistory.concat(info);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    /**
     * 选中历史标签
     */
    itemTag(e) {
      let deleVal = e.srcElement.innerHTML;
      let listT = this.labelSelect;
      this.data = { id: "", labelName: e.srcElement.innerHTML, type: "2" };
      if (e.srcElement.className == "") {
        for (let s = 0; s < listT.length; s++) {
          if (deleVal == listT[s].labelName) {
            //通过改变type来展示
            listT[s].type = 2;
          }
        }
        e.srcElement.className = this.tag_mode_bg;
      } else {
        e.srcElement.className = "";
        for (let s = 0; s < listT.length; s++) {
          if (deleVal == listT[s].labelName) {
            listT[s].type = 1;
          }
        }
        this.isIndex = null;
      }
    },
    /**
     * 提交个性标签
     */
    personality() {
      let personalityLab;
      let personalityLabList = [];
      let label = document.getElementsByClassName("tag_top");
      for (let i = 0; i < label.length; i++) {
        personalityLab = label[i].childNodes[0].innerHTML;
        personalityLabList.push(personalityLab);
      }
      this.param.labelName = personalityLabList.toString();
      this.param.labelName = this.param.labelName + "," + this.$refs.tag_data_txt.value;
      this.$api.get(
        "/addlabelGuideId",
        {
          guideId: this.param.guideId,
          memberId: this.param.memberId,
          labelName: this.param.labelName,
          labers: this.param.labers,
          requestName: "5",
        },
        (res) => {
          if (res.errcode == 0) {
            this.$router.replace({
              name: "customerInformation",
              query: {
                memberId: this.param.memberId,
              },
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    /**
     * 按下确认添加个性标签
     */
    addTag() {
      if (this.$refs.tag_data_txt.value != "") {
        this.data = [
          { id: "", labelName: this.$refs.tag_data_txt.value, type: "2" },
        ];
        for (let i in this.labelSelect) {
          if (this.labelSelect[i].labelName == this.data[0].labelName) {
            this.labelSelect[i].className = this.tag_mode_bg;
            this.labelHistory[i].className = this.tag_mode_bg;
            return;
          }
        }
        this.labelSelect = this.labelSelect.concat(this.data);
        for (let i in this.labelHistory) {
          if (this.labelHistory[i].labelName == this.data[0].labelName) {
            this.labelHistory[i].className = this.tag_mode_bg;
            return;
          }
        }
        this.labelHistory = this.labelHistory.concat(this.data);
        this.$refs.tag_data_txt.value = "";
        if (this.labelHistory.length == "0") {
          this.nullDataAllRight = true;
        } else {
          this.nullDataAllRight = false;
        }
      }
    },
    /**
     * 按下delete删除个性标签
     *  */
    deleTag(e) {
      if (this.$refs.tag_data_txt.value == "") {
        if (this.deledt) {
          let listV;
          let listAl;
          let deleVal = e.srcElement.previousElementSibling.childNodes[0].innerHTML;
          let listVal = document.getElementsByClassName("tag_mode_bg");
          let listT = this.labelSelect;
          for (let i = 0; i < listVal.length; i++) {
            listV = listVal[i];
            listAl = listVal[i].innerHTML;
            if (deleVal == listAl) {
              listV.setAttribute("class", "");
            }
          }
          for (let s = 0; s < listT.length; s++) {
            if (deleVal == listT[s].labelName) {
              listT[s].type = "1";
            }
          }
        }
        this.deledt = true;
      } else {
        this.deledt = false;
      }
      if (this.labelHistory.length == 0) {
        this.nullDataAllRight = true;
      } else {
        this.nullDataAllRight = false;
      }
    },
    /**
     * 选中已选择的个性标签删除
     *  */
    delSelect(index) {
      if (this.isIndex == index) {
        let listT = this.labelSelect;
        listT[index].type = 1;
        this.isIndex = null;
      } else {
        this.isIndex = index;
      }
    },



    // getSave() {
    //   this.$api.get(
    //     "/my/saveData",
    //     this.paramData,
    //     (res) => {
    //       if (res.errcode == 0) {
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // },
    // subLabel() {
    //   //      		公司标签的参数
    //   var tagType = document.getElementById("tagType");
    //   var li = tagType.getElementsByTagName("li");
    //   for (var i = 0; i < li.length; i++) {
    //     if (li[i].className == "tag_bg") {
    //       this.lables_company_s.push(li[i].getAttribute("labelid"));
    //     }
    //   }
    //   this.paramData.company = this.lables_company_s.toString();
    //   //      		console.log(this.paramData.company)
    //   //      		个性标签的参数
    //   var tagType = document.getElementById("history");
    //   var his_li = tagType.getElementsByTagName("li");
    //   for (var i = 0; i < his_li.length; i++) {
    //     if (his_li[i].className == "tag_bg") {
    //       this.lables_customize_s.push(his_li[i].getAttribute("value"));
    //     }
    //   }
    //   this.paramData.customize = this.lables_customize_s.toString();
    //   //  			console.log(this.paramData.customize)
    //   this.getSave();
    //   if (this.sex == 1) {
    //     this.gender = "男";
    //   } else if (this.sex == 2) {
    //     this.gender = "女";
    //   } else {
    //     this.gender = "";
    //   }
    //   this.$router.push({
    //     name: "memberList",
    //     params: {
    //       name: "name",
    //       company: this.paramData.company,
    //       customize: this.paramData.customize,
    //       selectedNum: this.selectedNum,
    //       sex: this.sex,
    //       gender: this.gender,
    //       age: this.age,
    //       address: this.address,
    //       whichGuide: this.whichGuide,
    //       grade: this.grade,
    //       registDate: this.registDate,
    //       shopDate: this.shopDate,
    //     }
    //   });
    // },
  },
  watch: {
    selected(val, oldVal) {
      if (val == 2) {
        this.isEnter = true;
      } else {
        this.isEnter = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../../../style/scss/addTag";
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
