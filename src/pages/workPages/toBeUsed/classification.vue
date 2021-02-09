
<template>
  <div id="classification">
    <div class="header">
      <div class="page-title">
        <router-link to="/">
          <i class="iconfont backBtn">&#xe600;</i>
        </router-link>
        <span class="headerTitle">分类邀约</span>
        <span class="management" @click="goManagement">管理</span>
      </div>
    </div>
    <mt-navbar class="page-part" v-model="selected">
      <mt-tab-item id="1" class="navTitle">
        <span @click.stop="staffFun()">公司分类</span>
      </mt-tab-item>
      <mt-tab-item id="2" class="navTitle">
        <span @click.stop="dimissionFun()">个性分类</span>
      </mt-tab-item>
    </mt-navbar>
    <div id="wrap" ref="boxHeight">
      <!-- navbar -->
      <!-- tabcontainer -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <div class="totalNum_container mint-tab-containerList">
            <p
              style="background-color: #d6d0d0;font-size: 0.45rem;text-indent: 0.6rem;margin-top:0.5rem"
            >已绑定会员</p>
            <scroll
              ref="pullrefresh"
              @scrollToEnd="loadMore"
              :data="empData"
              :page="page"
              :nullDataAll="nullDataAllLeft"
              :isDone="isLoadingLeft"
            >
              <ul class="box">
                <li
                  class="totalNum"
                  v-for="(item,index) in companyList"
                  :key="index"
                  v-on:click="toggle(index)"
                  :data="empData"
                >
                  <div class="title">
                    <i class="iconfont toggle" v-bind:class="{ active: isShow === index }">&#xe60e;</i>
                    <span class="totalLeft">{{ item.name }}</span>
                    <span class="totalRight">{{ item.memebrNum }}人</span>
                  </div>
                  <ul class="labelList" v-show="isShow === index">
                    <li v-for="index in item.labelList" :typeId="index.typeId" :key="index.typeId">
                      <router-link
                        :to="{path: '/inviteList', query: { id: index.typeId,mark:1 }}"
                        class="lable"
                      >
                        <span>{{ index.name }}</span>
                        <span>{{ index.memebrNum }}人</span>
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </scroll>
          </div>
          <div class="totalNum_container mint-tab-containerList">
            <p
              style="background-color: #d6d0d0;font-size: 0.45rem;text-indent: 0.6rem;margin-top:0.5rem"
            >已绑定会员</p>
            <scroll
              ref="pullrefresh"
              @scrollToEnd="loadMore"
              :data="empData"
              :page="page"
              :nullDataAll="nullDataAllLeft"
              :isDone="isLoadingLeft"
            >
              <ul class="box">
                <li
                  class="totalNum"
                  v-for="(item,index) in companyList"
                  :key="index"
                  v-on:click="toggle(index)"
                  :data="empData"
                >
                  <div class="title">
                    <i class="iconfont toggle" v-bind:class="{ active: isShow === index }">&#xe60e;</i>
                    <span class="totalLeft">{{ item.name }}</span>
                    <span class="totalRight">{{ item.memebrNum }}人</span>
                  </div>
                  <ul class="labelList" v-show="isShow === index">
                    <li v-for="index in item.labelList" :typeId="index.typeId" :key="index.typeId">
                      <router-link
                        :to="{path: '/inviteList', query: { id: index.typeId,mark:1 }}"
                        class="lable"
                      >
                        <span>{{ index.name }}</span>
                        <span>{{ index.memebrNum }}人</span>
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </scroll>
          </div>
        </mt-tab-container-item>

        <mt-tab-container-item id="2">
          <div class="mint-tab-containerList">
            <scroll
              ref="pullrefresh_one"
              @scrollToEnd="loadMoreTwo"
              :data="EmpListD"
              :nullDataAll="nullDataAllRight"
              :isDone="isLoadingRight"
            >
              <div v-for="item in personList" v-if="personList.length>0" :typeId="item.id">
                <router-link
                  :to="{path: '/inviteList', query: { id: item.id,mark:2 }}"
                  class="main_container"
                >
                  <div>{{item.labelName}}</div>
                  <div>
                    <i class="iconfont more">&#xe601;</i>
                  </div>
                </router-link>
              </div>
            </scroll>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import Scroll from "../../../components/scroll";

export default {
  name: "classification",
  components: {
    Scroll,
  },
  data() {
    return {
      areShow: true,
      isShow_one: true,
      MEMBERID: this.GLOBAL.MEMBERID,
      clientHeight: "",
      isShow: false,
      page: 1,
      nullData: false,
      selected: "1",
      isActive: true,
      // 是否显示加载更多
      staffList: true,
      dimList: true,
      isDataL: false,
      isDataR: false,
      //初始化公司分类
      companyList: [],
      empData: [],
      //初始化个性分类
      personList: [],
      EmpListD: [],
      // 个性页数
      pageSize: 1,

      // 提示语
      isLoadingLeft: true,
      isLoadingRight: true,
      nullDataAllLeft: false,
      nullDataAllRight: false,
      // 是否第一次进入，默认false
      isFirstEnter: false,
      isBack: false,
    };
  },

  created() {
    this.isFirstEnter = true;
  },

  activated() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      //初始化公司分类
      this.companyList = [];
      //初始化个性分类
      this.personList = [];
      this.page = 1;
      this.lableList();
      this.clientHeight = `${document.documentElement.clientHeight}`;
      console.log(this.clientHeight);
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
    // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
    this.isFirstEnter = false;
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight);
    },
  },
  methods: {
    //公司分类
    lableList() {
      const that = this;
      let listData = [];
      that.$api.get(
        "/interviewTypeAndLabel",
        {
          guideId: that.MEMBERID,
          page: that.page,
          size: 10,
          requestName: that.MEMBERID,
        },
        (res) => {
          if (res.errcode == 0) {
            console.log(res.data);
            const list = res.data;
            this.empData = list;
            listData = listData.concat(list);
            if (list.length < 10) {
              that.companyList = that.companyList.concat(listData);
              that.staffList = false;
              that.isLoadingLeft = false;
              //把page设置成false 数据已经加载完毕了 不用在加载了
              this.page = false;
              //所有数据加载完毕后
              this.$refs.pullrefresh.$emit(
                "infinitescroll.loadedDone",
                that.page
              );
            } else {
              that.companyList = that.companyList.concat(listData);
              // that.page++;
              that.staffList = true;
              that.isLoadingLeft = true;
              //单次请求数据加载完毕后
              this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
            }
            if (that.companyList.length == 0) {
              that.nullDataAllLeft = true;
            } else {
              that.nullDataAllLeft = false;
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },

    //公司分类
    staffFun() {
      const that = this;
      that.selected = "1";
      if (that.staffList) {
        that.page = 1;
        that.isLoadingLeft = true;
        that.isLoadingRight = false;
        that.companyList.length = 0;
        that.lableList();
      }
    },
    // 个性分类
    dimissionFun() {
      const that = this;
      that.selected = "2";
      if (that.dimList || this.params === "true") {
        that.pageSize = 1;
        that.isLoadingRight = true;
        that.isLoadingLeft = false;
        that.personList.length = 0;
        that.guideList();
      }
    },
    //打开列表
    toggle: function (index) {
      if (this.isShow === index) {
        this.isShow = -1;
      } else {
        this.isShow = index;
      }
    },
    //路由跳转
    goManagement: function () {
      var that = this;
      that.$router.push({
        path: "/management",
      });
    },

    //个性分类
    guideList() {
      var that = this,
        listData = [];
      that.$api.get(
        "interview/guidelabel",
        {
          guideId: this.MEMBERID,
          page: that.pageSize,
          size: 10,
          requestName: that.page,
        },
        (res) => {
          console.log(res.data);
          var list = res.data;
          this.EmpListD = list;
          listData = listData.concat(list);
          console.log("页数" + that.pageSize + "数据" + res.data);
          if (list.length < 10) {
            that.personList = that.personList.concat(listData);
            that.dimList = false;
            //把page设置成false 数据已经加载完毕了 不用在加载了
            this.pageSize = false;
            that.isLoadingRight = false;
            //所有数据加载完毕后
            this.$refs.pullrefresh.$emit(
              "infinitescroll.loadedDone",
              that.page
            );
          } else {
            that.personList = that.personList.concat(listData);
            that.dimList = true;
            that.isLoadingRight = true;
            //单次请求数据加载完毕后
            this.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
          }
          that.isDataR = false;
          if (that.personList.length == 0) {
            that.nullDataAllRight = true;
          } else {
            that.nullDataAllRight = false;
          }
        }
      );
      (err) => {
        console.log(err);
      };
    },

    //公司加载
    loadMore() {
      let that = this;
      if (!that.isDataL) {
        if (!that.page) {
          return;
        } else {
          that.isDataL = true;
          that.nullDataLight = false;
          that.page++;
          //上拉加载重新初始化
          this.$refs.pullrefresh.$emit("infinitescroll.reInit");
          if (that.selected == "1" && that.staffList) {
            setTimeout(() => {
              that.lableList();
            }, 1000);
          }
        }
      }
    },

    // 个性加载
    loadMoreTwo() {
      if (!this.pageSize) return;
      let that = this;
      that.nullDataRight = false;
      that.pageSize++;
      //上拉加载重新初始化
      this.$refs.pullrefresh_one.$emit("infinitescroll.reInit");
      if (that.selected == "2" && (that.dimList || this.params == "true")) {
        // setTimeout(() => {
        that.guideList();
        // }, 1000);
      }
    },

    changeFixed(clientHeight) {
      //动态修改样式
      this.$refs.boxHeight.style.height =
        clientHeight -
        $(".page-part").outerHeight(true) -
        $(".header").outerHeight(true) +
        "px";
    },
  },

  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true;
    if (from.name == "management" || from.name == "inviteList") {
      to.meta.isBack = true;
      //判断是从哪个路由过来的，
      //如果是从management或者inviteList过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }
    next();
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/classification";
/*头部*/

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
