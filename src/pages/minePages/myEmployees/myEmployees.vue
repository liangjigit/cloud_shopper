<template>
  <div id="myEmployees">
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">
        <div @click.stop="staffFun()">在职员工</div>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click.stop="diMissionFun()">离职员工</div>
      </mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="mint-tab-containerList" ref="homePage_one">
          <scroll
            ref="pullrefresh"
            :pullup="isShow"
            @scrollToEnd="loadBottom"
            :data="empData"
            :nullDataAll="nullDataAllLeft"
            :isDone="isLoadingLeft"
          >
            <ul class="staff">
              <li v-for="(item, index) in myEmpList" :key="item.id">
                <img :src="item.avatar ? item.avatar : imgCom" alt />
                <div class="staff_info">
                  <div class="staff_info_name">
                    <div class="name">
                      <span>{{ item.name }}</span>
                      <div class="name-span">
                      <span>{{ item.position }}</span>
                      </div>
                    </div>
                    <div class="shopName">{{ item.shopName }}</div>
                    <div class="phone">{{ item.phone }}</div>
                  </div>
                </div>
                <div
                  class="mixBtn"
                  :index="index"
                  :memberNum="item.memberNum"
                  :id="item.id"
                  @click="dispatchShop($event)"
                  style="right: 1rem;"
                >
                  调店
                </div>
                <!-- <div
                  class="btn"
                  :index="index"
                  :memberNum="item.memberNum"
                  :id="item.id"
                  @click="diMissionBtn($event)"
                >
                  离职
                </div> -->
              </li>
            </ul>
          </scroll>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="mint-tab-containerList" ref="homePage">
          <scroll
            ref="pullrefresh_one"
            :pullup="isShow_one"
            @scrollToEnd="loadMoreDiMission"
            :data="EmpListD"
            :nullDataAll="nullDataAllRight"
            :isDone="isLoadingRight"
          >
            <ul class="staff">
              <li v-for="(item, index) in myEmpListDiMission" :key="item.id">
                <img :src="item.avatar ? item.avatar : imgCom" alt />
                <div class="staff_info">
                  <div class="staff_info_name">
                    <div class="name">
                      <span>{{ item.name }}</span>
                      <div class="name-span">
                        <span>{{ item.position }}</span>
                      </div>
                    </div>
                    <div class="shopName">{{ item.shopName }}</div>
                    <div class="phone">{{ item.phone }}</div>
                  </div>
                </div>
                <div
                  class="starbtn"
                  :index="index"
                  :memberNum="item.memberNum"
                  :id="item.id"
                  @click="startBtn($event)"
                >
                  启用
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
export default {
  name: "myEmployees",
  components: { scroll },
  data() {
    return {
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      // 图片地址
      imgURL: this.GLOBAL.imgURL,

      imgCom: require("../../../static/image/nodata_people.png"),
      // tab
      selected: "1",
      empData: [],
      // 在职
      myEmpList: [],
      // 在职页数
      page: 1,
      // 离职页数
      pageSize: 1,
      isShow: true,
      isShow_one: true,
      isLoadingLeft: true,
      isLoadingRight: true,
      nullDataAllLeft: false,
      nullDataAllRight: false,
      // 离职
      myEmpListDiMission: [],
      EmpListD: [],
      clientHeight: "",
    };
  },

  created() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");
  },

  mounted() {
    const that = this;
    // 获取浏览器可视区域高度
    that.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    window.onresize = function () {
      that.clientHeight = `${document.documentElement.clientHeight}`;
    };
    // 在职数据
    that.myEmpFunStaff();
  },

  watch: {
    //如果路由有变化，会再次执行该方法
    $route(to, from) {
      if (this.$route.path == "/myEmployees") {
        this.staffFun();
      }
    },
    //高度变化函数运行
    clientHeight() {
      this.changeFixed(this.clientHeight);
    },
  },

  methods: {
    /**
     * 在职员工数据
     */
    myEmpFunStaff() {
      const that = this;
      that.$api.post(
        "my/getEmployeeList",
        {
          guideId: that.MEMBERID,
          page: that.page,
          size: 10,
          type: 0,
          excludeSelf: 1,
          // requestName: that.page,
        },
        (res) => {
          if (res.errcode == 0) {
            // console.log(res.data);
            const list = res.data;
            that.empData = list;
            if (list.length < 10) {
              that.myEmpList = that.myEmpList.concat(list);
              this.page = 0;
              that.isLoadingLeft = false;
              //所有数据加载完毕后
              that.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else {
              that.myEmpList = that.myEmpList.concat(list);
              that.isLoadingLeft = true;
              //单次请求数据加载完毕后
              that.$refs.pullrefresh.$emit("infinitescroll.finishLoad");
            }
            if (that.myEmpList.length == 0) {
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

    /**
     * 点击在职
     */
    staffFun() {
      const that = this;
      that.selected = "1";
      that.page = 1;
      that.isLoadingLeft = true;
      that.isLoadingRight = false;
      that.myEmpList.length = 0;
      that.myEmpList = [];
      that.nullDataAllLeft = false;
      that.myEmpFunStaff();
    },

    /**
     * 点击离职
     */
    diMissionFun() {
      const that = this;
      that.selected = "2";
      that.pageSize = 1;
      that.isLoadingRight = true;
      that.isLoadingLeft = false;
      that.nullDataAllRight = false;
      that.myEmpListDiMission.length = 0;
      that.myEmpListDiMission = [];
      that.myEmpFunDiMission();
    },

    /**
     * 离职员工数据
     */
    myEmpFunDiMission() {
      const that = this;
      that.$api.post(
        "my/getEmployeeList",
        {
          guideId: that.MEMBERID,
          page: that.pageSize,
          size: 10,
          type: 1,
          excludeSelf: 1,
          // requestName: that.page,
        },
        (res) => {
          // console.log(res.data);
          const list = res.data;
          this.EmpListD = list;
          if (list.length < 10) {
            that.myEmpListDiMission = that.myEmpListDiMission.concat(list);
            that.isLoadingRight = false;
            this.pageSize = 0;
            that.$refs.pullrefresh_one.$emit("infinitescroll.loadedDone");
          } else {
            that.isLoadingRight = true;
            that.myEmpListDiMission = that.myEmpListDiMission.concat(list);
            that.$refs.pullrefresh_one.$emit("infinitescroll.finishLoad");
          }
          if (that.myEmpListDiMission.length == 0) {
            that.nullDataAllRight = true;
          } else {
            that.nullDataAllRight = false;
          }
        }
      );
    },

    /**
     * 在职员工数据加载
     */
    loadBottom() {
      const that = this;
      if (!that.page) return;
      that.nullDataLight = false;
      that.page++;
      that.$refs.pullrefresh.$emit("infinitescroll.reInit");
      if (that.selected == "1") {
        that.myEmpFunStaff();
      }
    },

    /**
     * 点击调店
     */
    dispatchShop(e) {
      const _this = this;
      let index = e.target.attributes.index.nodeValue;
      let memberNum = e.target.attributes.membernum.nodeValue;
      let id = e.target.attributes.id.nodeValue;
      let list = JSON.stringify(_this.myEmpList[index]);
      const state = 0;
      // console.log(index, memberNum, id, list);
      this.$router.push({
        path: "changeShop",
        query: {
          index,
          memberNum,
          id,
          state,
          list,
        },
      });
    },

    /**
     * 在职员工点击离职
     */
    diMissionBtn($event) {
      const that = this;
      let memberNum = ~~$event.target.attributes.membernum.nodeValue;
      let index = $event.target.attributes.index.nodeValue;
      let guideId = $event.currentTarget.id;
      const state = 1;
      that.$messagebox
        .confirm("", {
          message: "确认后，该账号员工将被冻结",
          title: "公司收回",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then((action) => {
          //确认的回调
          if (action == "confirm") {
            if (memberNum == 0) {
              that.$api.get(
                "my/stopEmployee",
                {
                  guideId: guideId,
                  type: 2,
                },
                (res) => {
                  if (res.errcode == 0) {
                    that.$messagebox.alert("操作成功").then((action) => {
                      that.myEmpList.splice(index, 1);
                      that.diMissionFun();
                    });
                  }
                }
              );
            } else {
              this.$router.push({
                path: "assignStaff",
                name: "assignStaff",
                query: {
                  list: JSON.stringify(that.myEmpList[index]),
                  state,
                },
              });
            }
          }
        })
        .catch((err) => {
          //取消的回调
          if (err == "cancel") {
            console.log("取消");
          }
        });
    },

    /**
     * 离职人员启用
     */
    startBtn($event) {
      const that = this;
      let index = $event.target.attributes.index.nodeValue;
      let guideId = $event.currentTarget.id;
      that.$messagebox
        .confirm("", {
          message: "确认后，该账号员工将被启用",
          title: "启用员工",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then((action) => {
          //确认的回调
          if (action == "confirm") {
            that.$api.get(
              "my/stopEmployee",
              {
                guideId: guideId,
                type: 1,
              },
              (res) => {
                // console.log(res);
                if (res.errcode == 0) {
                  that.myEmpListDiMission.splice(index, 1);
                  that.staffFun();
                }
              }
            );
          }
        })
        .catch((err) => {
          //取消的回调
          if (err == "cancel") {
            console.log("取消");
          }
        });
    },

    /**
     * 根据高度动态修改样式
     */
    changeFixed(clientHeight) {
      let height_ = document.getElementsByClassName("mint-navbar")[0]
        .offsetHeight;
      document
        .getElementsByClassName("mint-tab-container")[0]
        .setAttribute("height", `${clientHeight - height_}px`);
    },

    /**
     * 离职人员加载
     */
    loadMoreDiMission() {
      const that = this;
      if (!this.pageSize) return;
      that.nullDataRight = false;
      that.pageSize++;
      that.$refs.pullrefresh_one.$emit("infinitescroll.reInit");
      if (that.selected == "2") {
        that.myEmpFunDiMission();
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../../style/scss/myEmployees";

#myEmployees .mint-tab-containerList {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 0;
  max-width: 1024px;
}
</style>
