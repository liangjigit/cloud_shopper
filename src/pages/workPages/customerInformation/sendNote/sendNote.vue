<template>
  <div id="editT">
    <div ref="note" class="edit-note" v-html="editNoteStr" @click="getClickSpan($event)"></div>
    <div class="edit-alert">点击{}内黑色部分可对短信进行修改</div>
    <div class="edit-box">
      <p v-if="isShow">请修改，最多{{editTextMember}}个字</p>
      <input type="text" v-model="editText" :maxlength="editTextMember" v-if="isShow" />
      <div class="box-button">
        <mt-button type="primary" @click="sureEdit" v-if="isShow">确认修改</mt-button>
      </div>
    </div>
    <a @click="sendMessage">发送短信</a>
  </div>
</template>
<script>
import { MessageBox, Toast, Indicator } from "mint-ui";
export default {
  name: "sendNote",
  data() {
    return {
      //修改的文字
      editText: "",
      //修改的字数
      editTextMember: 0,
      editTextArr: [],
      //获取用户选择的短信模板对象
      noteObject: {},
      //要进行修改的整个字符串
      editNoteStr: "",
      //最新显示到页面上的短信字符串
      noteStr: "",
      //保存获取到可以修改的json数组
      UbsObj: [],
      //正则匹配到的数组以及临时变量
      regArr: [],
      temp: [],
      //获取到用户修改的dom
      changeNoteText: [],
      //保存选中的index
      selectChangeIndex: 0,
      //用于给data-index
      index: 0,
      //当前页面的显示文本
      nowPageText: [],
      //是否显示修改文本框
      isShow: false,
      flag: true,
      //保存要发送的文本
      finalMessage: "",
      //最后的手机号码
      finalPhone: "",
      //导购ID
      finalGuideId: "",
      //会员id
      finalMemberId: "",
      //短信标题
      noteType: ""
    };
  },
  methods: {
    sendMessage() {
      const _this = this;
      // console.log(this.finalMessage);
      // console.log(this.$store.state.memberPhone);
      _this.finalPhone = _this.$store.state.memberPhone;
      _this.finalMemberId = _this.$store.state.memberId;
      _this.finalGuideId = _this.$store.state.guideId;
      MessageBox.confirm("发送后短信不可修改，确定发送?").then(action => {
        Indicator.open({
          text: "发送中...",
          spinnerType: "fading-circle"
        });
        _this.$api.post(
          "my/sendMessage",
          {
            phone: _this.finalPhone,
            // phone: "15901292608",
            content: _this.finalMessage,
            guideId: _this.finalGuideId,
            memberId: _this.finalMemberId,
            type: _this.noteType
          },
          res => {
            // console.log(res);
            if (res.errcode == 0) {
              Indicator.close();
              MessageBox.alert("短信发送成功").then(action => {
                _this.$router.go(-2);
              });
            }
          },
          err => {
            console.log(err);
            if (err.errcode == 500) {
              Indicator.close();
              MessageBox.alert(err.errmsg).then(action => { });
            } else {
              Indicator.close();
              MessageBox.alert(
                "短信发送失败，请联系管理员" + err.errmsg
              ).then(action => { });
            }
          }
        );
      });
    },
    //捕捉发生时间的span
    getClickSpan(e) {
      if (this.flag) {
        // console.log(e);
        if (e.target.nodeName === "SPAN") {
          this.isShow = true;
          this.selectChangeIndex = e.target.dataset.index;
          this.editTextMember = this.editTextArr[this.selectChangeIndex];
          this.editText = "";
        }
      } else {
        this.finalMessage = e.target.innerText;
        this.finalMessage = this.finalMessage.replace(/{/g, "");
        this.finalMessage = this.finalMessage.replace(/}/g, "");
        // console.log(this.finalMessage);
        this.flag = true;
      }
    },
    // 确认修改
    sureEdit() {
      const _this = this;
      if (_this.editText == "") {
        MessageBox.alert("修改内容不能为空").then(action => { });
      } else {
        _this.isShow = false;
        _this.nowPageText = [];
        let indexName = document.querySelectorAll(".changeNote");
        indexName.forEach(function (item, index, arr) {
          //页面目前显示的可修改的短信数组
          _this.nowPageText.push(item.innerHTML);
        });
        _this.editNoteStr = _this.editNoteStr.replace(
          _this.nowPageText[_this.selectChangeIndex],
          "{" + _this.editText + "}"
        );
        _this.flag = false;
        this.$nextTick(function () {
          _this.$refs.note.click();
        });
      }
    },
    //处理返回的字符串
    disposeStr() {
      const _this = this;
      const reg = /{(.*?)}/g;
      while ((_this.temp = reg.exec(_this.editNoteStr))) {
        _this.regArr.push(_this.temp[0]);
      }
      for (let item of _this.regArr) {
        for (let key in _this.UbsObj) {
          if (item == key) {
            _this.editNoteStr = _this.editNoteStr.replace(
              key,
              "<span class='changeNote' data-index='" +
              _this.index +
              "'>" +
              key +
              "</span>"
            );
            _this.index++;
            _this.editTextArr.push(_this.UbsObj[key]);
          }
        }
      }
    }
  },
  created() {
    const noteObj = JSON.parse(window.localStorage.getItem('noteObj'))
    this.noteType = noteObj.templateTitle;
    this.noteObject = noteObj;
    this.editNoteStr = noteObj.templateContent;
    this.UbsObj = JSON.parse(noteObj.templateUbs);
    let organizationId = window.localStorage.getItem("organizationId");
    this.disposeStr();
  },
  beforeRouteLeave(to, from, next) {
    window.localStorage.removeItem('noteObj')
    next()
  }
};
</script>
<style lang="scss">
@import "../../../../style/scss/sendNote";
</style>
