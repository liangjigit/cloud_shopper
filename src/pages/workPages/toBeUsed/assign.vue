<template>
  <div id="assign">
    <!--<mt-navbar v-model="selected">
      <mt-tab-item id="1">
        <div @click.stop="staffFun()">门店导购</div>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click.stop="dimissionFun()">分配记录</div>
      </mt-tab-item>
    </mt-navbar>-->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="mint-tab-containerList" ref="homePage_one">
          <scroll ref="pullrefresh" :pullup="isShow" @scrollToEnd="loadBottom" :data="empData" :nullDataAll="nullDataAllLeft" :isDone="isLoadingLeft">
            <ul class="staff" ref="staff">
              <li v-for="(item, index) in myEmpList" :memberid="item.id" :key="item.id" @click="checkedGuide(index)">
                <label :for="item.id">
                  <img :src="imgchecked" alt="" class="circle" />
                  <img :src="imgchecks" alt="" class="circle_check" />
                  <!-- <input type="radio" name="id" :id="item.id" value="" /> -->
                </label>
                <img :src="item.avatar?item.avatar: imgCom" alt="" class="avatar">
                <div class="staff_info">
                  <div class="staff_info_name">
                    <div class="name">
                      <p>{{item.name}}</p>
                    </div>
                    <div class="shopName">{{item.shopName}}</div>
                  </div>
                </div>
                <div class="btn" :index="index" :memberNum="item.memberNum" :id="item.id">
                  会员总数：{{item.memberNum}}
                </div>
              </li>
            </ul>
          </scroll>
        </div>
      </mt-tab-container-item>
      <!--<mt-tab-container-item id="2">
        <div class="mint-tab-containerList" ref="homePage">
          <scroll ref="pullrefresh_one" :pullup="isShow_one" @scrollToEnd="loadMoreDimission" :data="EmpListD"
                  :nullDataAll="nullDataAllRight" :isDone="isLoadingRight">
            <ul class="staff_assign">
              <li class="recordItem" v-for="(item, index) in myEmpListDimission" :key="index" >
              	<img :src="imgcheck" alt="">
              	<div class="message">
              		<p class="cardsValue">归属导购：{{item.employeeName}}</p>
              		<p class="cardsValue">分配会员：{{item.successNum}}</p>
              		<p class="cardsValue">分配时间：{{item.time}}</p>
              	</div>
              </li>
            </ul>
          </scroll>
        </div>
      </mt-tab-container-item>-->
    </mt-tab-container>
    <div class="determine" @click="distribution()"><span>确认分配</span></div>
  </div>
</template>

<script>
import scroll from '../../../components/scroll'
export default {
  name: "assign",
  components: { scroll },
  data() {
    return {
      isShow: true,
      isShow_one: true,
      // 导购id
      MEMBERID: this.GLOBAL.MEMBERID,
      // 图片地址
      imgURL: this.GLOBAL.imgURL,

      imgCom: require('../../../static/image/nodata_people.png'),
      imgcheck: require('../../../static/image/check.png'),
      imgchecks: require('../../../static/image/check_ready.png'),
      imgchecked: require('../../../static/image/checked.png'),
      // tab
      selected: '1',
      // 门店导购
      myEmpList: [],
      empData: [],
      // 分配记录
      myEmpListDimission: [],
      EmpListD: [],
      // 会员id
      memberId: '',
      // 门店导购页数
      page: 1,
      // 分配记录页数
      pageSize: 1,
      isDataL: false,
      isDataR: false,
      clientHeight: '',
      // 提示语
      isLoadingLeft: true,
      isLoadingRight: true,
      nullDataAllLeft: false,
      nullDataAllRight: false,
      // 从会员列表页保存的筛选数据
      gender: '',
      address: '',
      grades: '',
      shopGuides: '',
      registDate: '',
      pointSmall: '',
      pointBig: '',
      timeVal: '',
      dataSource: '',
      name: '',
      autoLabel: '',
      manualLabel: '',
      guideLabel: '',
      isAll: '',
      check_num: '',
      noMemberId: '',
      allCheckNum: '',
    }
  },
  watch: {
    clientHeight() {
      // this.changeFixed(this.clientHeight)
    }
  },
  created() {
    let user = localStorage.getItem('user')
    this.MEMBERID = user.replace(/\"/g, "")
    this.memberId = this.$route.query.memberId
    this.gender = this.$route.query.gender
    this.address = this.$route.query.address
    this.grades = this.$route.query.grades
    this.shopGuides = this.$route.query.shopGuides
    this.pointSmall = this.$route.query.pointSmall
    this.pointBig = this.$route.query.pointBig
    this.registDate = this.$route.query.registDate
    this.timeVal = this.$route.query.timeVal
    this.dataSource = this.$route.query.dataSource
    this.name = this.$route.query.name
    this.autoLabel = this.$route.query.autoLabel
    this.manualLabel = this.$route.query.manualLabel
    this.guideLabel = this.$route.query.guideLabel
    this.isAll = this.$route.query.isAll
    this.noMemberId = this.$route.query.noMemberId
    this.allCheckNum = this.$route.query.allCheckNum
  },
  mounted() {
    const that = this;
    that.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function () {
      that.clientHeight = `${document.documentElement.clientHeight}`;
    };
    that.myEmpFunStaff();
  },

  methods: {
    /**
     * 获取门店导购数据
     */
    myEmpFunStaff() {
      const that = this
      let listData = []
      that.$api.post('my/shopGuide', {
        // guideId: that.MEMBERID,
        guideId: '9f720035ca3011ea8d2e005056b49afc',
        page: that.page,
        size: 10,
        type: 0,
      }, res => {
        if (res.errcode == 0) {
          const list = res.data
          this.empData = list
          listData = listData.concat(list)
          if (list.length < 10) {
            that.myEmpList = that.myEmpList.concat(listData)
            this.page = 0
            that.isLoadingLeft = false
            that.$refs.pullrefresh.$emit('infinitescroll.loadedDone')
          } else {
            that.myEmpList = that.myEmpList.concat(listData);
            that.isLoadingLeft = true;
            that.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
          }
          that.isDataL = false;
          if (that.myEmpList.length == 0) {
            that.nullDataAllLeft = true;
          } else {
            that.nullDataAllLeft = false;
          }
        }
      }, err => {
        console.log(err)
      })
    },
    /**
     * 门店导购初始化
     */
    staffFun() {
      this.selected = '1';
      this.page = 1;
      this.isDataL = false;
      this.isLoadingLeft = true;
      this.isLoadingRight = false;
      this.myEmpList.length = 0;
      this.myEmpFunStaff();
      this.nullDataAllLeft = false;
    },
    /**
     * 门店数据加载
     */
    loadBottom() {
      const that = this
      if (that.isDataL) return
      if (!that.page) return
      that.isDataL = true
      that.nullDataLight = false
      that.page++
      that.$refs.pullrefresh.$emit('infinitescroll.reInit')
      if (that.selected == '1') {
        that.myEmpFunStaff();
      }
    },
    /**
     * 点击选择
     */
    checkedGuide(index) {
      // console.log(this.$refs.staff.children[index].querySelector('label'))
      if (this.$refs.staff) {
        let clickLi = this.$refs.staff.children[index].querySelector('label')
        if (clickLi.classList.value == 'checked') {
          clickLi.classList.remove('checked')
          clickLi.children[0].style.display = 'none'
          clickLi.children[1].style.display = 'block'
        } else {
          clickLi.classList.add('checked')
          clickLi.children[0].style.display = 'block'
          clickLi.children[1].style.display = 'none'
        }
      }
    },
    /**
     * 确认分配
     */
    distribution() {
      var forid = $(".checked").attr("for")
      // let forId = document.querySelectorAll('.checked')
      // console.log(forId)
      var check_name = $(".checked").siblings(".staff_info").find(".name p").html();
      var allCheckNum = this.allCheckNum;
      if (forId != "" && forId != null) {
        if (!this.isAll) {
          this.$messagebox.confirm('', {
            message: '给' + check_name + '分配' + allCheckNum + '人',
            title: '确认分配',
            confirmButtonText: '确认',
            cancelButtonText: '返回'
          }).then(action => {
            //确认的回调
            if (action == 'confirm') {
              this.$api.post('my/distributionMember', {
                isAll: this.isAll,
                chooseGuideId: forid,
                memberId: this.memberId,
                guideId: this.MEMBERID,
              }, res => {
                if (res.errcode == 0) {
                  const info = res.data;
                  this.toast('分配成功', 1500);
                  setTimeout(() => {
                    this.$router.push({
                      name: 'memberListScreening',
                      query: {
                        dataSource: this.dataSource,
                        state: 1
                      }
                    })
                  }, 2000);
                }
              }, err => {
                console.log(err)
                let code = err.code;
                this.toast(code, 1500);
              })
            }
          }).catch(err => {
            //取消的回调
            if (err == 'cancel') {
              this.toast('取消分配', 1500);
            }
          });
        } else {
          this.$api.get('my/distributionMember', {
            ifAll: this.isAll,
            chooseGuideId: forid,
            guideId: this.MEMBERID,
            name: this.name,
            gender: this.gender,
            address: this.address,
            grade: this.grade,
            pointSmall: this.pointSmall,
            pointBig: this.pointBig,
            registDate: this.registDate,
            startTime: this.startTime,
            endTime: this.endTime,
            autoLabel: this.autoLabel,
            manualLabel: this.manualLabel,
            guideLabel: this.guideLabel,
            noMemberId: this.noMemberId
          }, res => {
            if (res.errcode == 0) {
              const info = res.data;
              const allCheckNum = this.allCheckNum;
              this.$messagebox.confirm('', {
                message: '给' + check_name + '成功分配' + allCheckNum + '人',
                title: '分配成功',
                confirmButtonText: '继续分配',
                cancelButtonText: '返回'
              }).then(action => {
                //确认的回调
                if (action == 'confirm') {
                  this.$router.push({
                    path: 'yourPath',
                    name: 'listFiltering',
                    query: {
                      //	            dataSource: this.dataSource,
                      state: 2
                    }
                  })
                }
              }).catch(err => {
                //取消的回调
                if (err == 'cancel') {
                  this.$router.push({
                    path: 'yourPath',
                    name: 'memberListScreening',
                    query: {
                      //	            dataSource: this.dataSource,
                      state: 1
                    }
                  })
                }
              });
            }
          }, err => {
            console.log(err)
          })
          // }
          // this.selected = '2'
          // this.$nextTick(function () {
          //   this.myEmpFunDimission();
          // })
          // this.myEmpFunStaff();
        }
      }
    },
    //动态修改样式
    // changeFixed(clientHeight) {
    //   console.log(clientHeight);
    //   let height_ = $('.mint-navbar').outerHeight(true);
    //   let _height = $('.determine').outerHeight(true);
    //   console.log(_height)
    //   $('.mint-tab-container').css('height', ((clientHeight - height_) + 'px'));
    //   this.$refs.homePage_one.style.height = (clientHeight - _height) + 'px';
    // },

    // 分配记录
    dimissionFun() {
      console.log(document.body.scrollTop)

      var that = this;
      that.selected = '2';
      console.log('分配记录');
      // 页数
      that.pageSize = 1;
      // 禁止重复加载
      that.isDataR = false;
      // 加载图标
      that.isLoadingRight = true;
      that.isLoadingLeft = false;
      // 无数据图标
      that.nullDataAllRight = false;
      // 清空数组
      that.myEmpListDimission.length = 0;
      // 获取数据
      that.myEmpFunDimission();
    },
    // 分配记录加载
    loadMoreDimission() {
      let that = this;
      if (that.isDataR) return;
      if (!this.pageSize) return;

      that.isDataR = true;
      that.nullDataRight = false;
      that.pageSize++;
      // 上拉加载重新初始化
      that.$refs.pullrefresh_one.$emit('infinitescroll.reInit');

      if (that.selected == '2') {
        that.myEmpFunDimission();
      }
    },
    // 分配记录数据
    myEmpFunDimission() {
      let that = this,
        listData = [];

      that.$api.post('my/distributionRecord', {
        guideId: that.MEMBERID,
        page: that.pageSize,
        size: 10,
        type: 1,
        // requestName: that.page,
      }, res => {
        console.log(res.data);

        var list = res.data;
        this.EmpListD = list;
        listData = listData.concat(list);
        console.log('页数' + that.pageSize + '数据' + res.data);

        if (list.length < 10) {
          //        	if(that.myEmpListDimission.length<10){
          //      		  	that.myEmpListDimission = list;
          //		        	}else{
          //			              that.myEmpListDimission = that.myEmpList.concat(list);
          //		        	}
          that.myEmpListDimission = that.myEmpListDimission.concat(listData);

          that.isLoadingRight = false;
          //把page设置成false 数据已经加载完毕了 不用在加载了
          this.pageSize = false;
          //所有数据加载完毕后
          console.log(that.$refs.pullrefresh_one);
          that.$refs.pullrefresh_one.$emit('infinitescroll.loadedDone');
        } else {
          that.isLoadingRight = true;
          that.myEmpListDimission = that.myEmpListDimission.concat(listData);
          //单次请求数据加载完毕后
          that.$refs.pullrefresh_one.$emit('infinitescroll.finishLoad');
        };

        that.isDataR = false;
        // 判断是否显示空页面
        if (that.myEmpListDimission.length == 0) {
          that.nullDataAllRight = true;
        } else {
          that.nullDataAllRight = false;
        };
      })
    },
  }
}

</script>

<style lang="scss">
@import "../../../style/scss/assign";

#assign .mint-tab-containerList {
  width: 100%;
  /*height: 100%;*/
  position: absolute;
  top: 0;
  bottom: 76px;
  z-index: 0;
  max-width: 1024px;
}
</style>
