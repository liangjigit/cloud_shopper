<template>
  <div id="noteT">
    <div :style="scrollHeight">
      <scroll ref="pullrefresh" :isShowOver="true">
        <div class="noteClass">
          <ul>
            <li @click="selectTemp(index)" v-for="(item,index) in noteName" :key="index">
              <p ref="noteNameP">{{item}}</p>
            </li>
          </ul>
        </div>
        <ul class="noteContent">
          <li v-for="(item,index) in noteTemp" :key="index" @click="sureNote(index)">
            <div class="content-left">
              <div class="left-circle" ref="circle"></div>
            </div>
            <div class="content-right">{{item.templateContent}}</div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="noteButton">
      <mt-button type="default" plain size="large" :style="sureCss" @click="editNote" v-if="isSureNote">编辑短信</mt-button>
    </div>
  </div>
</template>
<script>
import scroll from "../../../../components/scroll";
import { MessageBox, Toast } from "mint-ui";
export default {
  name: "selectNote",
  components: {
    scroll,
  },
  data() {
    return {
      //判断是否选择当前的短信模板
      isSureNote: false,
      //保存短信模板的数组
      noteTemp: [],
      //保存短信模板的名字
      noteName: [],
      //组织ID
      organizationId: "",
      //选中的短信模板名字作为参数
      noteNameParams: "",
      //要编辑的短信模板对象
      editNoteContent: {},
      //获取屏幕高度
      bodyHeight: 0,
      //确认样式
      sureCss: 'height:1rem;font-size:0.4rem;border:1px solid black;background-color:white'
    };
  },
  methods: {
    //修改当前选择的短信模板
    editNote() {
      window.localStorage.setItem('noteObj', JSON.stringify(this.editNoteContent))
      this.$router.push({
        name: "sendNote"
      });
    },
    //确定选择当前短信模板
    sureNote(i) {
      // console.log(i);
      this.isSureNote = true; //证明进行了选择，才可以进行下一步
      this.$refs.circle.forEach(function (item, index, arr) {
        item.classList.remove("sure-note");
        if (i == index) {
          item.classList.add("sure-note");
        }
      });
      this.editNoteContent = this.noteTemp[i];
    },
    //选择当前短信模板
    selectTemp(i) {
      const _this = this;
      this.$refs.noteNameP.forEach(function (item, index, arr) {
        item.classList.remove("selected");
        if (i == index) {
          item.classList.add("selected");
        }
      });
      this.noteNameParams = this.noteName[i];
      this.getSelectNote().then(function () {
        _this.$refs.circle.forEach(function (item, index, arr) {
          item.classList.remove("sure-note");
        });
      });
      this.isSureNote = false;
    },
    //通过名字获取当前短信的模板
    getSelectNote() {
      const _this = this;
      return new Promise(function (resolve, reject) {
        _this.$api.post(
          "my/findMessageTitleByTemplate",
          {
            organizationId: _this.organizationId,
            title: _this.noteNameParams,
          },
          (res) => {
            // console.log(res);
            // console.log(_this.$refs.pullrefresh);
            if (res.errcode == 0) {
              _this.noteTemp = res.data;
              _this.$refs.pullrefresh.refresh();
              resolve();
            }
          },
          (err) => {
            console.log(err);
          }
        );
      });
    },
    // 初始化当前页面短信模板
    noteInit() {
      this.$api.get(
        "my/getMessagetitle",
        {
          organizationId: this.organizationId,
        },
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            this.noteName = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
  computed: {
    scrollHeight() {
      return `height:calc(${this.bodyHeight}px - 2rem)`;
    },
  },
  created() {
    this.organizationId = window.localStorage.getItem("organizationId");
    this.noteInit();
  },
  mounted() {
    if (document.body) {
      this.bodyHeight = document.body.clientHeight;
      // console.log(this.scrollHeight);
    }
  }
};
</script>
<style lang="scss">
@import "../../../../style/scss/selectNote";
</style>
