<template>
  <div class="container" @click="hide">
    <datePicker ref="datePicker" v-on:sendday="receiveSendday" v-on:sendweek="receiveSendweek" v-on:sendmonth="receiveSendmonth" v-on:sendtype="receiveSendtype" v-on:sendbegin="receiveSendbegin" v-on:sendend="receiveSendend">
    </datePicker>
    <div class="choose" v-show="isChooseShow" @click="range">
      <p class="title">选择范围</p>
      <p class="btn"><span class="btn_val">全部</span><i class="iconfont dropDown" :class="{flip:isShow}">&#xe60e;</i></p>
    </div>
    <div class="pop-up" v-show="isShow">
      <div class="rangeBox">
        <ul class="select" id="select">
          <li id="shop" class="active" :value=param.guideId @click="repeat">全部</li>
          <li v-for="item in guideList[0]" :value=item.guideId @click="repeat">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!--v-bind:class="{change:isChooseShow}"-->
    <div id="wrapper" :class="{change:isChange}" v-if="sales[0]!==undefined" ref="homePage">
      <scroll ref="pullrefresh">
        <div class="completion">
          <p>净销售额：<span class="netSales">¥{{sales[0].netSales}}</span></p>

        </div>
        <div class="sellData">
          <ul class="sellInfo">
            <li>
              <p>总笔数</p>
              <p class="salesNum">{{sales[0].salesNum}}</p>
            </li>
            <li>
              <p>总件数</p>
              <p class="dealNum">{{sales[0].dealNum}}</p>
            </li>
            <li>
              <p>会员笔数</p>
              <p class="memberSaleNum">{{sales[0].memberSaleNum}}</p>
            </li>
            <li>
              <p>新会员笔数</p>
              <p class="newMemberSaleNum">{{sales[0].newMemberSaleNum}}</p>
            </li>
            <li class="margin_btm">
              <p>客单价</p>
              <p class="avgPrice">{{sales[0].avgPrice}}</p>
            </li>
            <li class="margin_btm">
              <p>会员复购率</p>
              <p class="memberSecondRate">{{sales[0].memberSecondRate}}</p>
            </li>
            <li class="margin_btm">
              <p>会销占比</p>
              <p class="salesRatio">{{sales[0].salesRatio}}</p>
            </li>
            <li class="margin_btm">
              <p>新会员销售</p>
              <p class="newMemberSale">¥{{sales[0].newMemberSale}}</p>
            </li>
          </ul>
        </div>
        <div class="dataTree">
          <div class="brach_a">
            <h3>总销售额</h3>
            <h1 class="salePrice">{{sales[0].salePrice}}</h1>
            <h4>VS 12-25同期<span></span></h4>
          </div>
          <div class="linnkLine_a"></div>
          <div class="linnkLine_b"></div>
          <div class="branch_b">
            <h3>线上总销售额</h3>
            <h1 class="linePrice">{{sales[0].linePrice}}</h1>
            <h4>占比<span class="lineRate">{{sales[0].lineRate}}</span></h4>
          </div>
          <div class="branch_c">
            <h3>门店总销售额</h3>
            <h1 class="storePrice">{{sales[0].storePrice}}</h1>
            <h4>占比<span class="storeRate">{{sales[0].storeRate}}</span></h4>
          </div>
          <div class="linnkLine_c"></div>
          <div class="linnkLine_d"></div>
          <div class="branch_d">
            <h3>会员销售额</h3>
            <h1 class="memberPrice">{{sales[0].memberPrice}}</h1>
            <h4>占比<span class="memberRate">{{sales[0].memberRate}}</span></h4>
          </div>
          <div class="branch_e">
            <h3>非会员销售额</h3>
            <h1 class="noMemberPrice">{{sales[0].noMemberPrice}}</h1>
            <h4>占比<span class="noMemberRate">{{sales[0].noMemberRate}}</span></h4>
          </div>
        </div>
      </scroll>
    </div>

  </div>
</template>

<script>
import datePicker from './datePicker'
import Scroll from '../../../components/scroll'
export default {
  name: "myPerformance",
  components: {
    datePicker,
    Scroll
  },
  data() {
    return {
      isShow: false,
      isChooseShow: false,
      isChange: true,
      sales: [],
      guideList: [],
      param: {
        guideId: '',
        type: '',
        datetype: '',
        startTime: '',
        endTime: '',
        requestName: ''
      },
      clientHeight: '',
      //				权限参数
      code: '',
      isFirstEnter: false
    }
  },
  created() {
    this.isFirstEnter = true;
    //			  let user = localStorage.getItem('user');
    //			  this.param.guideId = user.replace(/\"/g, "");
    //		  	this.param.requestName=this.param.guideId;

  },
  activated() {
    console.log('activated');

    if (!this.$route.meta.isBack || this.isFirstEnter) {
      let user = localStorage.getItem('user');
      this.param.guideId = user.replace(/\"/g, "");
      this.param.requestName = this.param.guideId;
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.getGuideList();
      this.getSales();
      this.$nextTick(function () {
        this.role();
      })

    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false
    // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
    this.isFirstEnter = false;
  },
  mounted() {
    //				this.getGuideList();
    //      this.getSales();
    //				this.$nextTick(function () {
    //					this.role();
    //				})
    window.onresize = function temp() {
      this.clientHeight = '${document.documentElement.clientHeight}';
    };
  },
  methods: {
    role() {
      this.$api.post(
        '/my/role', {
        guideId: this.param.guideId
      },
        res => {
          this.code = res.data;
          console.log(this.code)
          if (this.code == '001' || this.code == '002') {
            this.isChooseShow = true
            this.isChange = false
          } else if (this.code == '003' || this.code == '004') {
            this.isChooseShow = false
            this.isChange = true
          }
        }, err => {
          console.log(err)
        });
    },
    receiveSendday(mes) {
      this.param.datetype = mes;
      this.param.startTime = '';
      this.param.endTime = '';
      this.sales = [];
      this.getSales();
    },
    receiveSendweek(mes) {
      this.param.datetype = mes[0];
      this.param.startTime = '';
      this.param.endTime = '';
      this.sales = [];
      this.getSales();
    },
    receiveSendmonth(mes) {
      this.param.datetype = mes;
      this.param.startTime = '';
      this.param.endTime = '';
      this.sales = [];
      this.getSales();
    },
    receiveSendtype(mes) {
      this.param.datetype = mes;
    },
    receiveSendbegin(mes) {
      this.param.startTime = mes;
      if (this.param.endTime != "") {
        this.sales = [];
        this.getSales();
      }

    },
    receiveSendend(mes) {
      this.param.endTime = mes;
      if (this.param.startTime != "") {
        this.sales = [];
        this.getSales();
      }
    },
    hide: function () {
      this.isShow = false
      const docH = document.documentElement.style.overflowY = "auto";
    },
    range: function (e) {
      e.stopPropagation();
      this.isShow = !this.isShow;
      const doc = document.getElementsByClassName("pop-up")[0].style.display;
      if (doc === 'none') {
        const docH = document.documentElement.style.overflowY = "hidden";
      } else {
        const docH = document.documentElement.style.overflowY = "auto";
      }

    },
    repeat: function (e) {
      this.sales.length = 0;
      this.param.guideId = e.target.getAttribute("value");
      const btnV = document.getElementsByClassName("btn_val")[0].innerHTML = e.target.innerHTML;
      this.isShow = false;
      const fa = document.getElementById("select").childNodes.className = "";

      if (e.target.innerHTML == '全部') {
        this.param.type = 'all';
      } else {
        this.param.type = '';
      }
      this.getSales();
      let id = document.getElementById('select').children;
      for (var i = 0; i < id.length; i++) {
        if (id[i] !== e) {
          id[i].className = '';
        }
      }
      e.target.className = 'active';
    },
    getSales: function () {
      this.$api.get('/shop/sales', this.param, res => {
        if (res.errcode == 0) {
          const info = res.data;
          this.sales.push(info);
        }
      }, err => {
        console.log(err)
        let code = err.code;
      })

    },
    getGuideList: function () {
      this.$api.get('/guideList', {
        guideId: this.param.guideId
      }, res => {
        if (res.errcode == 0) {
          const info = res.data;
          this.guideList.push(info);
          console.log(this.guideList)
        }
      }, err => {
        console.log(err)
        let code = err.code;
      })

    },
    changeFixed(clientHeight) {                        //动态修改样式
      console.log(clientHeight);
      this.$refs.homePage.style.height = (clientHeight - $('.contain').outerHeight(true) - $('.time').outerHeight(true) - $('.choose').outerHeight(true)) + 'px';

    }

  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },

  //  路由
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if (from.name != 'mine' && from.name != 'login' && from.name != null) {
      to.meta.isBack = true;
      //判断是从哪个路由过来的，
      //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }
    next();
  }
}
</script>

<style lang="scss">
@import "../../../style/scss/datePicker";
@import "../../../style/scss/myPerformance";
@import "../../../style/common";
@font-face {
  font-family: "iconfont";
  /* project id 770909 */
  src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot");
  src: url("//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.woff") format("woff"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont") format("svg");
}
</style>
