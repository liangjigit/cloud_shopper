<template>
  <div id="inviteList">
    <div class="ScrollBox">
      <scroll ref="pullrefresh" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="empData" :nullDataAll="nullDataAllLeft" :isDone="isLoading">
        <ul class="memberList">
          <li v-for="(item,id) in myClient" :memberId=item.id :key="id">
            <router-link :to="{path:'/customerInformation',query:{memberId:item.id,guideId:MEMBERID}}">
              <div class="memberImg">
                <img :src=item.avatar alt="" class="memberHead" />
              </div>
              <div class="memberData">
                <span class="memberName">{{item.name}}</span>
                <span class="memberCard">{{item.card}}</span>
                <span class="memberPay">累计消费：¥
									<b>{{item.price?item.price:0}}</b>
								</span>
              </div>
              <div class="memberDate">
								<div class="registrationDate"><span>注册日期：</span>
									{{item.registDate}}
								</div>
                <div class="recentlyPurchased"><span>最近购买：</span>
									{{item.lateLyDate}}
								</div>

								<div class="recentlyPurchased" v-if="item.lastContactTime!=null"><span>最后联系时间：</span>
									{{item.lastContactTime}}
								</div>
								<div class="recentlyPurchased" v-else><span>最后联系时间：</span>
									-
								</div>
              </div>
            </router-link>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../../components/scroll'

  export default {
    name: "inviteList",
    components: {
      Scroll
    },
    data() {
      return {
        isShowScroll: true,
        MEMBERID: this.GLOBAL.MEMBERID,
        labelId: '',
        page: 1,
        // 是否显示加载更多
        staffList: true,
        isDataL: false,
        //初始化公司分类
        empData: [],
        myClient: [],
        interface: '',
        // 提示语
        isLoading: true,
        nullDataAllLeft: false,
        // 是否第一次进入，默认false
        isFirstEnter: false,
        isBack: false,
      }
    },
    mounted: function () {
    },
    methods: {
      //list
      getInviteList() {
        var that = this;
        var listData = [];
        that.$api.get(
          this.interface, {
            guideId: that.MEMBERID,
            labelId: that.labelId,
            page: that.page,
            size: 10,
						requestName:that.page
          },
          res => {
            if (res.errcode == 0) {
              var list = res.data;
              this.empData = list;
              console.log(list)
              listData = listData.concat(list);
              console.log('页数' + that.page + '数据' + res.data);
              if (list.length < 10) {
                that.isLoading = false;
                that.myClient = that.myClient.concat(listData);
                this.page = false
                //所有数据加载完毕后
                this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');
              } else {
                that.isLoading = true;
                that.myClient = that.myClient.concat(listData);
                that.staffList = true;
                this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
              }


              if (that.myOrderList.length == 0) {
                that.nullDataAllLeft = true;
              }

              that.isDataL = false;
            }
          }
        )
      },

      //加载更多
      loadBottom() {
        console.log('reachbottom')
        let that = this;
        if (!that.isDataL) {
          if (that.page < 0 || that.page == false) {
            return
          } else {
            that.isDataL = true;
            that.page++
            //上拉加载重新初始化
            this.$refs.pullrefresh.$emit('infinitescroll.reInit');
            that.getInviteList();
          }
        }
      },
    },
    computed: {},
    created: function() {
      this.isFirstEnter = true;
    },

    activated() {
      console.log('activated');

      if (!this.$route.meta.isBack || this.isFirstEnter) {
        let user = localStorage.getItem('user');
        this.MEMBERID = user.replace(/\"/g, "");
        const id = this.$route.query.id;
        const mark = this.$route.query.mark;
        this.empData = [];
        this.myClient = [];
        this.page = 1;
        this.isLoading = true;
          this.nullDataAllLeft = false;
        console.log(id)
        console.log(mark)
        if (mark == 1) {
          this.interface = '/interviewLabel'
        } else if (mark == 2) {
          this.interface = 'interview/labelMember'
        }
        this.labelId = id;

        this.getInviteList();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false
      // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
      this.isFirstEnter = false;
    },

    beforeRouteEnter(to, from, next) {
      console.log(to.meta.keepAlive + '===========to.meta.keepAlive')
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'customerInformation') {
        to.meta.isBack = true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }
      next();
    },
  }
</script>

<style lang="scss">
  @import "../../../style/scss/inviteList";
  /*头部*/

  @font-face {
    font-family: 'iconfont';
    /* project id 770909 */
    src: url('//at.alicdn.com/t/font_770909_vfebvlxw6jo.eot');
    src: url('//at.alicdn.com/t/font_770909_vfebvlxw6jo.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_770909_vfebvlxw6jo.woff') format('woff'), url('//at.alicdn.com/t/font_770909_vfebvlxw6jo.ttf') format('truetype'), url('//at.alicdn.com/t/font_770909_vfebvlxw6jo.svg#iconfont') format('svg');
  }
</style>
