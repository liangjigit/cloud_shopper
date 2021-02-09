<template>
  <div class="inviteListJ">
    <div class="ScrollBox" ref="boxHeight">
      <scroll ref="pullrefresh" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="clientList" :isDone="isLoadingLeft" :nullDataAll="nullDataAllLeft">
        <ul class="memberList" id="memberList">
          <template>
            <li v-for="(item,id) in myClient" :memberId="item.id" @click="memberInfo(id)" :key="id">
              <div class="memberImg">
                <img :src="item.avatar" alt class="memberHead" />
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
          </template>
        </ul>
      </scroll>
    </div>
  </div>
</template>
<script>
import scroll from "../../../components/scroll";
export default {
  name: "inviteListJ",
  components: {
    scroll,
  },
  data() {
    return {
      //为绑定的参数
      params: {
        guideId: "",
        interviewId: "",
        labelId: "",
        page: "1",
        size: "100",
      },
      //绑定的参数
      paramsF: {
        guideId: "",
        labelId: "",
        page: "1",
        size: "100",
      },
      //个人列表的参数
      paramsP: {
        guideId: "",
        labelId: "",
        page: "1",
        size: "100",
      },
      state: 0,
      myClient: [],
      clientList: [],
      isShowScroll: true,
      isData: false,
      isshopGuide: false,
      nullDataAllLeft: false,
      isLoadingLeft: true,
    };
  },
  methods: {
    //跳转到详情页面
    memberInfo(id) {
      // console.log(this.myClient[id].id);
      // console.log(this.state);
      let guideId = "";
      switch (this.state) {
        case "1":
          guideId = this.paramsF.guideId;
          break;
        case "2":
          guideId = this.params.guideId;
          break;
        case "3":
          guideId = this.paramsP.guideId;
          break;
      }
      this.$router.push({
        path: "yourPath",
        name: "customerInformation",
        query: {
          name: "name",
          memberId: this.myClient[id].id,
          guideId,
        },
      });
    },
    //截取上个页面传来的参数
    getPrev() {
      let url = window.location.hash;
      let theRequest = new Object();
      if (url.indexOf("?") != -1) {
        let str = url.substr(14);
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    //发送网络请求获取数据（已绑定）
    getAllFList() {
      this.$api.get(
        "interviewLabel",
        this.paramsF,
        (res) => {
          // console.log(res);
          if (res.errcode == 0) {
            this.clientList = res.data;
            //小于10代表请求到最后一页了
            if (this.clientList.length < 10) {
              this.myClient = this.myClient.concat(this.clientList);
              this.isLoadingLeft = false;
              //把page设置成false 数据已经加载完毕了 不用在加载了
              this.paramsF.page = false;
              //所有数据加载完毕后
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.myClient = this.myClient.concat(this.clientList);
              this.isLoadingLeft = true;
              //单次请求数据加载完毕后
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
    //发送网络请求获取数据（未绑定）
    getAllList() {
      this.$api.post(
        "/interviewLabelWait",
        this.params,
        (res) => {
          console.log(res);
          if (res.errcode == 0) {
            this.clientList = res.data;
            //小于10代表请求到最后一页了
            if (this.clientList.length < 10) {
              this.myClient = this.myClient.concat(this.clientList);
              this.isLoadingLeft = false;
              //把page设置成false 数据已经加载完毕了 不用在加载了
              this.params.page = false;
              //所有数据加载完毕后
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.myClient = this.myClient.concat(this.clientList);
              this.isLoadingLeft = true;
              //单次请求数据加载完毕后
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
    getAllPList() {
      this.$api.get(
        "interview/labelMember",
        this.paramsP,
        (res) => {
          console.log(res);
          if (res.errcode == 0) {
            this.clientList = res.data;
            //小于10代表请求到最后一页了
            if (this.clientList.length < 10) {
              this.myClient = this.myClient.concat(this.clientList);
              this.isLoadingLeft = false;
              //把page设置成false 数据已经加载完毕了 不用在加载了
              this.paramsP.page = false;
              //所有数据加载完毕后
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              this.myClient = this.myClient.concat(this.clientList);
              this.isLoadingLeft = true;
              //单次请求数据加载完毕后
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
    //滚动事件
    scroll(data) {
      // console.log(data);
    },
    //上拉加载
    loadBottom() {
      let that = this;
      switch (this.state) {
        case "1":
          if (!that.isData) {
            if (that.paramsF.page < 0 || that.paramsF.page == false) {
              return;
            } else {
              that.isData = true;
              that.paramsF.page++;
              //上拉加载重新初始化
              this.$refs.pullrefresh.$emit("infinitescroll.reInit");
              this.getAllFList();
            }
          }
          break;
        case "2":
          if (!that.isData) {
            if (that.params.page < 0 || that.params.page == false) {
              return;
            } else {
              that.isData = true;
              that.params.page++;
              //上拉加载重新初始化
              this.$refs.pullrefresh.$emit("infinitescroll.reInit");
              this.getAllList();
            }
          }
          break;
        default:
          if (!that.isData) {
            if (that.paramsP.page < 0 || that.paramsP.page == false) {
              return;
            } else {
              that.isData = true;
              that.paramsP.page++;
              //上拉加载重新初始化
              this.$refs.pullrefresh.$emit("infinitescroll.reInit");
              this.getAllPList();
            }
          }
          break;
      }
    },
    //获取绑定
    getF() {
      this.paramsF.guideId = this.getPrev().guideId;
      this.paramsF.labelId = this.getPrev().typeId;
      // console.log(this.paramsF);
      this.getAllFList();
    },
    //获取未绑定
    getS() {
      this.params.guideId = this.getPrev().guideId;
      this.params.interviewId = this.getPrev().interviewId;
      this.params.labelId = this.getPrev().labelId;
      console.log(this.params);
      this.getAllList();
    },
    //获取个人列表
    getP() {
      this.paramsP.guideId = this.getPrev().userId;
      this.paramsP.labelId = this.getPrev().labelId;
      console.log(this.paramsP);
      this.getAllPList();
    },
  },
  created() {
    this.state = this.getPrev().state;
    switch (this.state) {
      case "1":
        this.getF();
        break;
      case "2":
        this.getS();
        break;
      default:
        this.getP();
        break;
    }
  },
};
</script>
<style lang="scss">
@import "../../../style/scss/inviteListJ";
</style>