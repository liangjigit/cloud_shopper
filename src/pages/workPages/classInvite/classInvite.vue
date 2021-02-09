<template>
  <div class="invite">
    <van-nav-bar title="分类邀约" right-text="管理" left-arrow @click-left="onBackIndex" @click-right="onManage" />
    <van-tabs v-model="active" animated>
      <van-tab title="公司分类">
        <div class="ScrollBox" ref="boxHeight">
          <scroll ref="pullComp" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll" @scrollToEnd="loadBottom">
            <div class="is-binding">
              <p>已绑定会员</p>
              <van-collapse v-model="activeNames">
                <van-collapse-item :title="`${item0.name}(${item0.memebrNum}人)`" v-for="(item0,index0) in bindingMember" :key="index0" :name="index0">
                  <ul>
                    <li v-for="(item1,index1) in item0.labelList" :key="index1" @click="toInviteList(item1)">
                      <div class="second-item">
                        <p>{{item1.name}}</p>
                        <p>{{`${item1.memebrNum}人`}}</p>
                      </div>
                      <hr v-if="item0.labelList.length > 1 && index1 != item0.labelList.length - 1" style="margin:0.25rem auto;color:#d6d0d0" />
                    </li>
                  </ul>
                </van-collapse-item>
              </van-collapse>
            </div>
            <div class="no-binding">
              <p>待绑定会员</p>
              <van-collapse v-model="activeNames">
                <van-collapse-item :title="`${item0.name}(${item0.memebrNum}人)`" v-for="(item0,index0) in noBindingMember" :key="index0" :name="'se' + index0">
                  <ul>
                    <li v-for="(item1,index1) in item0.labelList" :key="index1" @click="toNoBindingMember(item0,item1)">
                      <div class="second-item">
                        <p>{{item1.name}}</p>
                        <p>{{`${item1.memebrNum}人`}}</p>
                      </div>
                      <hr v-if="item0.labelList.length > 1 && index1 != item0.labelList.length - 1" style="margin:0.25rem auto;color:#d6d0d0" />
                    </li>
                  </ul>
                </van-collapse-item>
              </van-collapse>
            </div>
          </scroll>
        </div>
      </van-tab>
      <van-tab title="个性分类">
        <div class="ScrollBox" ref="boxHeight">
          <scroll ref="pullrefresh" :listenScroll="isShowScroll" @scroll="scroll" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="personalList" :isDone="isLoadingLeft" :nullDataAll="nullDataAllLeft">
            <ul class="person-ul">
              <li class="person-li" v-for="(item,index) in personalList" :key="index" @click="toPersonal(item)">
                {{item.labelName}}
                <div class="next"></div>
              </li>
            </ul>
          </scroll>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import scroll from "../../../components/scroll";
export default {
  name: "classInvite",
  components: {
    scroll,
  },
  data() {
    return {
      active: 0,
      activeNames: ["-1"],
      userId: "",
      bindingMember: [],
      noBindingMember: [],
      bindingTypeId: "",
      noBindingTypeId: "",
      params: {
        guideId: "",
        page: 1,
        size: 500,
      },
      personalList: [],
      isShowScroll: true,
      nullDataAllLeft: false,
      isLoadingLeft: true,
    };
  },
  methods: {
    //滚动派发的事件
    scroll(data) {
      // console.log(data);
    },
    //下拉加载更多
    loadBottom() {
      // console.log("到最底部啦");
    },
    //返回首页
    onBackIndex() {
      // console.log("返回首页");
      this.$router.push({
        path: "/",
      });
    },
    //管理
    onManage() {
      // console.log(this.userId);
      this.$router.push({
        path: "management",
        query: {
          userId: this.userId,
        },
      });
    },
    //获取已绑定会员的数据
    getBindingList() {
      const _this = this;
      return new Promise((resolve, reject) => {
        _this.$api.get(
          "interviewTypeAndLabel",
          {
            guideId: _this.userId,
          },
          (res) => {
            // console.log(res.data);
            _this.bindingMember = res.data;
            resolve();
          },
          (err) => {
            console.log(err);
          }
        );
      });
    },
    //获取待绑定会员的数据
    getNoBindingList() {
      const _this = this;
      this.$api.post(
        "interviewTypeAndLabelWait",
        {
          guideId: _this.userId,
        },
        (res) => {
          // console.log(res.data);
          _this.noBindingMember = res.data;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    //去绑定会员列表
    toInviteList(a) {
      this.bindingTypeId = a.typeId;
      this.$router.push({
        path: "inviteListJ",
        query: {
          typeId: this.bindingTypeId,
          guideId: this.userId,
          state: 1,
        },
      });
      // console.log(this.bindingTypeId);
    },
    //去待绑定会员的列表
    toNoBindingMember(a, b) {
      // console.log(a);
      // console.log(b);
      this.$router.push({
        path: "inviteListJ",
        query: {
          interviewId: a.typeId,
          labelId: b.typeId,
          guideId: this.userId,
          state: 2,
        },
      });
    },
    //获取个人分类
    getPersonal() {
      this.$api.get(
        "interview/guidelabel",
        this.params,
        (res) => {
          // console.log(res);
          this.personalList = res.data;
          this.$nextTick(() => {
            if (res.data.length == 0) {
              this.nullDataAllLeft = true;
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            } else if (res.data.length > 0 && res.data.length < 500) {
              this.isLoadingLeft = false;
              this.nullDataAllLeft = false;
              this.$refs.pullrefresh.$emit("infinitescroll.loadedDone");
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    //去个人分类列表
    toPersonal(a) {
      // console.log(a);
      this.$router.push({
        path: "inviteListJ",
        query: {
          labelId: a.id,
          userId: this.userId,
          state: 3,
        },
      });
    },
  },
  created() {
    this.userId = this.$route.query.user;
    this.params.guideId = this.$route.query.user;
    this.getBindingList().then(() => {
      this.getNoBindingList();
    });
  },
  watch: {
    active(n, o) {
      // console.log(n, o);
      if (n == 1) {
        this.getPersonal();
      }
    },
  },
};
</script>
<style lang="scss">
@import "../../../style/scss/classInvite.scss";
</style>