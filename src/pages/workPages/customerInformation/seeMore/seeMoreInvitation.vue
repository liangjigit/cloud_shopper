<template>
  <div class="container_Invitation">
    <div class="ScrollBox" ref="homePage">
      <scroll ref="pullrefresh" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="invitationList">
        <ul class="contactTrack-list">
          <li class="contactTrack-item" v-for="(item,index) in page" :key="index">
            <img src="../../../../static/image/circle.png" alt="" />
            <p class="contactTrack-date">{{item.startTime}} <span>{{item.way}}</span></p>
            <div class="contactTrack-contact">
              <span class="contactType" v-if="item.typeName==null">其他</span>
              <span class="contactType" v-else>{{item.typeName}}</span>
              <span class="contactText">备注：{{item.remark}}</span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from '../../../../components/scroll';
export default {
  name: "seeMoreInvitation",
  components: {
    scroll
  },
  data() {
    return {
      param: {
        memberId: '',
        page: '1',
        size: '10',
        requestName: ''
      },
      //				上拉加载参数
      page: [],
      isData: false,
      isShowScroll: true,
      invitationList: [],
      clientHeight: ''
    }
  },
  created() {
    this.param.memberId = this.$route.query.memberId;
    this.getPage();
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}`;
    window.onresize = function () {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  watch: {
    clientHeight() {
      this.changeFixed(this.clientHeight)
    }
  },
  methods: {
    getPage() {
      this.param.requestName = this.param.page
      this.$api.get('/invitedReview', this.param, res => {
        if (res.errcode == 0) {
          //   console.log(res.data)
          let invitations = res.data;
          this.invitationList = invitations;
          if (invitations.length < 10) {
            this.page = this.page.concat(invitations);
            this.param.page = 0
            this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');
          } else {
            this.page = this.page.concat(invitations);
            this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
          }
          this.isData = false
        }
      }, err => {
        console.log(err)
      })
    },
    loadBottom() {
      const that = this;
      if (!that.isData) {
        if (that.param.page == 0) {
          return
        } else {
          that.isData = true;
          that.param.page++
          that.param.requestName = that.param.page
          //上拉加载重新初始化
          this.$refs.pullrefresh.$emit('infinitescroll.reInit');
          that.getPage();
        }
      }

    },
    changeFixed(clientHeight) {
      this.$refs.homePage.style.height = clientHeight + 'px';
    }
  }
}
</script>

<style lang="scss">
@import "../../../../style/scss/seeMoreInvitation";
</style>
