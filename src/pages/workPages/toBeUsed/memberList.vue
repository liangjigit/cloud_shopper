<template>
  <div class="container" @click="hide">
    <!--controler-->
    <div class="controler">
      <span class="shopMember" id="shopMember">
        <div>门店会员</div>
      </span>
      <span class="myMember" id="myMember">
        <div>我的会员</div>
      </span>
    </div>
    <!--searchInput-->
    <div class="searchInput">
      <form method="post" id="searchInput" @submit.prevent="submit">
        <input type="text" placeholder="输入客户手机号/客户名称搜索" class="searchBar" v-model="param.keywords" />
        <input type="submit" value="搜索" class="searchBtn" />
      </form>
    </div>
    <!--memberType-->
    <div class="memberType">
      <span @click="customer(index)" :index=item.index v-for="(item,index) in clients" :class="{tabin:index==current}">{{item.text}}</span>

    </div>
    <!--filter-->
    <div class="filter" value="toggle" v-show="isShopShow">
      <span class="memberNum">
        共<b v-if="myClient!==undefined">{{count}}</b>位客户
      </span>

      <span class="filterBar" v-on:click="toggle">
        高级筛选
      </span>
      <img src="../../../static/image/shaixuan.png" alt="" class="filterIcon" />
    </div>
    <!--筛选条件-->
    <div class="filterDialog" v-show="isShow">
      <ul class="memberSelect" @click="stopPropagation">
        <li>
          <span class="selectName">性别</span>
          <span id="sex" class="dialog_val">{{gender}}<img src="../../../static/image/addition.png" alt="" v-show="isSex"></span>
          <mt-button @click.native="sexClick" class="selectBtn"></mt-button>
          <mt-popup v-model="sexVisible" position="bottom">
            <div class="pickerBtns">
              <span class="pickerN" @click="sexHide">取消</span>
              <span class="pickerY" @click="sexVal">确定</span>
            </div>
            <mt-picker :slots="sex" @change="onValuesChange" id="chooseSex"></mt-picker>
          </mt-popup>
        </li>
        <li>
          <span class="selectName">年龄</span>
          <span id="age" class="dialog_val">{{param.age}}<img src="../../../static/image/addition.png" alt="" v-show="isAge"></span>
          <mt-button @click.native="ageClick" class="selectBtn"></mt-button>
          <mt-popup v-model="ageVisible" position="bottom">
            <div class="pickerBtns">
              <span class="pickerN" @click="ageHide">取消</span>
              <span class="pickerY" @click="ageVal">确定</span>
            </div>
            <mt-picker :slots="age" @change="onValuesChange" id="chooseAge"></mt-picker>
          </mt-popup>
        </li>
        <li>
          <span class="selectName">所在地</span>
          <span id="address" class="dialog_val">{{param.address}}<img src="../../../static/image/addition.png" alt="" v-show="isAdress"></span>
          <mt-button @click.native="addressClick" class="selectBtn"></mt-button>
          <mt-popup v-model="addressVisible" position="bottom">
            <div class="pickerBtns">
              <span class="pickerN" @click="addressHide">取消</span>
              <span class="pickerY" @click="addressVal">确定</span>
            </div>
            <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
          </mt-popup>
        </li>
        <li>
          <span class="selectName">归属导购</span>
          <span id="guide" class="dialog_val">{{param.whichGuide}}<img src="../../../static/image/addition.png" alt="" v-show="isGuide"></span>
          <mt-button @click.native="guideClick" class="selectBtn"></mt-button>
          <mt-popup v-model="guideVisible" position="bottom">
            <div class="pickerBtns">
              <span class="pickerN" @click="guideHide">取消</span>
              <span class="pickerY" @click="guideVal">确定</span>
            </div>
            <mt-picker :slots="guide" @change="onValuesChange" id="chooseGuide"></mt-picker>
          </mt-popup>
        </li>
        <li>
          <span class="selectName">会员等级</span>
          <span id="grade" class="dialog_val">{{param.grade}}<img src="../../../static/image/addition.png" alt="" v-show="isGrade"></span>
          <mt-button @click.native="gradeClick" class="selectBtn"></mt-button>
          <mt-popup v-model="gradeVisible" position="bottom">
            <div class="pickerBtns">
              <span class="pickerN" @click="gradeHide">取消</span>
              <span class="pickerY" @click="gradeVal">确定</span>
            </div>
            <mt-picker :slots="grade" @change="onValuesChange" id="chooseGrade"></mt-picker>
          </mt-popup>
        </li>
        <li>
          <span class="selectName">注册日期</span>
          <span id="date" class="dialog_val">{{param.registDate}}<img src="../../../static/image/addition.png" alt="" v-show="isDate"></span>
          <mt-button @click.native="open('picker4')" class="selectBtn" size="large"></mt-button>
          <mt-datetime-picker ref="picker4" type="date" v-model="value4" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleChange">
          </mt-datetime-picker>
        </li>
        <li>
          <span class="selectName">归属店铺</span>
          <span id="shop" class="dialog_val">{{param.shopDate}}<img src="../../../static/image/addition.png" alt="" v-show="isShop"></span>
          <mt-button @click.native="shopClick" class="selectBtn"></mt-button>
          <mt-popup v-model="shopVisible" position="bottom">
            <div class="pickerBtns">
              <span class="pickerN" @click="shopHide">取消</span>
              <span class="pickerY" @click="shopVal">确定</span>
            </div>
            <mt-picker :slots="shop" @change="onValuesChange" id="chooseShop"></mt-picker>
          </mt-popup>
        </li>
        <li @click="lab">
          <span class="selectName">会员标签</span>
          <span id="label" class="dialog_val"><b v-show="islabelShow">已选择{{selectedNum}}个标签</b><img src="../../../static/image/addition.png" alt="" v-show="isLable"></span>
        </li>
        <div class="filterBtn">
          <span class="filterReset" @click="clear">重置</span>
          <span class="filterOk" @click="filter">筛选</span>
        </div>
      </ul>
    </div>
    <div class="memberControler" v-show="isMineShow" v-if="selets!==undefined">
      <span class="memberControler_btn" id="one" @click="quantity(0)" :class="{tabin_in:'0'==isIndex}">
        <b class="memberControler-num">{{selets.taday}}</b>
        <p class="memberControler-name">{{clientTxt.one}}</p>
      </span>
      <span class="memberControler_btn" id="two" @click="quantity(1)" :class="{tabin_in:'1'==isIndex}">
        <b class="memberControler-num">{{selets.week}}</b>
        <p class="memberControler-name">{{clientTxt.two}}</p>
      </span>
      <span class="memberControler_btn" id="three" @click="quantity(2)" :class="{tabin_in:'2'==isIndex}">
        <b class="memberControler-num">{{selets.month}}</b>
        <p class="memberControler-name">{{clientTxt.three}}</p>
      </span>
      <span class="memberControler_btn" id="four" @click="quantity(3)" :class="{tabin_in:'3'==isIndex}">
        <b class="memberControler-num">{{selets.year}}</b>
        <p class="memberControler-name">{{clientTxt.fore}}</p>
      </span>
    </div>
    <div class="ScrollBox" ref="homePage">
      <scroll ref="pullrefresh" :pullup="isShowScroll" @scrollToEnd="loadBottom" :data="clientList">
        <ul class="memberList" id="memberList">
          <li v-for="(item,id) in myClient" :memberId=item.id @click="memberInfo(id)">
            <div class="memberImg"><img :src=item.avatar alt="" class="memberHead" /></div>
            <div class="memberData">
              <span class="memberName">{{item.name}}</span>
              <span class="memberCard">{{item.card}}</span>
              <span class="memberPay">累计消费：¥<b>{{item.price}}</b></span>
            </div>
            <div class="memberDate">
              <span class="registrationDate">注册日期：<b>{{item.registDate}}</b></span>
              <span class="recentlyPurchased">最近购买：<b>{{item.lateLyDate}}</b></span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>

  </div>
</template>

<script>
import address from '../../../static/json/pca.json'; //引入省市区数据
import Scroll from '../../../components/scroll'
export default {
  name: "memberList",
  components: {
    Scroll
  },
  data() {
    return {
      isShow: false,
      isShowScroll: true,
      isShopShow: true,
      isMineShow: false,
      islabelShow: false,
      isIndex: 0,
      current: 0,
      tabin: 'tabin',
      tabin_in: 'tabin_in',
      //	      	我的客户参数
      param: {
        guideId: '',
        page: '1',
        size: '10',
        dataType: '',
        dateType: '',
        status: 'all',
        keywords: '',
        type: 'my',
        sex: '',
        age: '',
        address: '',
        whichGuide: '',
        grade: '',
        registDate: '',
        shopDate: '',
        company: '',
        customize: ''
      },
      count: '',
      selectedNum: '',
      gender: '',
      myClient: [],
      clientList: [],
      selets: '',
      clientTxt: {
        one: '今日新增',
        two: '本周新增',
        three: '本月新增',
        fore: '本年新增'
      },
      clients: [
        { text: '全部客户' },
        { text: '新增客户' },
        { text: '生日客户' },
        { text: '活跃客户' }
      ],
      other: [],
      sexVisible: false,
      sex: [
        {
          values: ['男', '女'],
          textAlign: 'center'
        }
      ],
      ageVisible: false,
      age: [
        {
          values: [],
          textAlign: 'center'
        }
      ],
      guideVisible: false,
      guide: [
        {
          values: [],
          textAlign: 'center'
        }
      ],
      gradeVisible: false,
      grade: [
        {
          values: [],
          textAlign: 'center'
        }
      ],
      shopVisible: false,
      shop: [
        {
          values: [],
          textAlign: 'center'
        }
      ],
      value4: new Date(),
      visible4: false,
      addressVisible: false,
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['北京'],
          className: 'slot3',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot4'
        }, {
          flex: 1,
          values: ['东城区', '西城区', '崇文区', '宣武区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '平谷区', '怀柔区', '密云县', '延庆县', '其他'],
          className: 'slot5',
          textAlign: 'center'
        }
      ],
      addressProvince: '',
      addressCity: '',
      addressArea: '',
      //	        标签传参
      status: '1',
      memberid: '',
      isData: false,
      //      筛选条件后隐藏icon
      isSex: true,
      isAge: true,
      isAdress: true,
      isGuide: true,
      isGrade: true,
      isDate: true,
      isShop: true,
      isLable: true,
      // 可视窗口高度
      clientHeight: ''
    }
  },
  mounted() {
    this.getmyClient();
    this.clientHeight = `${document.documentElement.clientHeight}`;         //document.body.clientWidth;
    //console.log(self.clientHeight);
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };

  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  created() {
    //		  	this.onAddressChange(picker, values)

    let user = localStorage.getItem('user');
    this.param.guideId = user.replace(/\"/g, "");
    this.getParams();
    if (this.selectedNum != undefined) {
      this.isShow = true;
      this.islabelShow = true;
      document.documentElement.style.overflowY = "hidden";
      this.isLable = false;
    }
    if (this.selectedNum == '') {
      this.isShow = true;
      this.islabelShow = false;
    }

  },
  methods: {
    getParams() {
      // 将数据放在当前组件的数据内
      this.selectedNum = this.$route.params.selectedNum
      this.param.company = this.$route.params.company
      this.param.customize = this.$route.params.customize
      this.param.sex = this.$route.params.sex
      this.param.age = this.$route.params.age
      this.gender = this.$route.params.gender
      this.param.address = this.$route.params.address
      this.param.whichGuide = this.$route.params.whichGuide
      this.param.grade = this.$route.params.grade
      this.param.registDate = this.$route.params.registDate
      this.param.shopDate = this.$route.params.shopDate
      console.log(this.selectedNum)
    },
    //		    上拉加载
    loadBottom() {
      let that = this;

      if (!that.isData) {
        if (that.param.page < 0 || that.param.page == false) {
          return
        } else {
          that.isData = true;
          that.param.page++
          //上拉加载重新初始化
          this.$refs.pullrefresh.$emit('infinitescroll.reInit');

          that.getmyClient();
        }
      }

    },
    //		    显示筛选条件
    toggle(e) {
      e.stopPropagation();
      this.isShow = !this.isShow;
      const doc = document.getElementsByClassName("filterDialog")[0].style.display;
      if (doc === 'none') {
        const docH = document.documentElement.style.overflowY = "hidden";
      } else {
        const docH = document.documentElement.style.overflowY = "auto";
      }

    },
    hide: function () {
      this.isShow = false
      const docH = document.documentElement.style.overflowY = "auto";
    },
    //		    阻止事件冒泡
    stopPropagation(e) {
      e.stopPropagation();
    },
    //		   搜索框
    submit: function () {
      this.param.page = '1';
      this.myClient = [];
      this.getmyClient();
    },
    //     		点击切换客户列表
    customer(index) {
      this.myClient = [];
      this.selects = {
        taday: '0',
        week: '0',
        month: '0',
        year: '0'
      }
      this.param.page = '1';
      this.current = index;
      this.clients.taday = '今日新增';
      this.clients.week = '本周新增';
      this.clients.month = '本月新增';
      this.clients.year = '本年新增';
      if (index == 0) {
        this.isShopShow = true;
        this.isMineShow = false;
        this.param.dataType = '';
        this.param.dateType = '';
        this.param.status = 'all';
        document.getElementsByClassName('ScrollBox')[0].classList.remove("ScrollBox_top");
      } else {
        document.getElementsByClassName('ScrollBox')[0].classList.add('ScrollBox_top');
        this.isShopShow = false;
        this.isMineShow = true;
        this.param.dataType = 'one';
        this.param.dateType = 'one';
        let son = document.getElementsByClassName("tabin_in")[0].id;
        if (index == 1) {
          this.param.status = 'new';
          this.param.dateType = son;
          this.clientTxt.one = '今日新增';
          this.clientTxt.two = '本周新增';
          this.clientTxt.three = '本月新增';
          this.clientTxt.fore = '本年新增';
        } else if (index == 2) {
          this.param.status = 'birthday';
          this.param.dateType = son;
          this.clientTxt.one = '今日生日';
          this.clientTxt.two = '明日生日';
          this.clientTxt.three = '本周生日';
          this.clientTxt.fore = '本月生日';

        } else if (index == 3) {
          this.param.status = 'actieve';
          this.param.dateType = son;
          this.clientTxt.one = '本月活跃';
          this.clientTxt.two = '近三个月'
          this.clientTxt.three = '近六个月'
          this.clientTxt.fore = '近一年';
        }

      }
      this.getmyClient();

    },
    quantity(e) {
      this.param.page = '1';
      this.myClient = [];
      this.isIndex = e;
      let idName = document.getElementsByClassName("memberControler_btn")[e].id;
      this.param.dateType = idName;
      console.log(this.param.dateType)
      this.getmyClient();
    },
    getmyClient() {
      this.$api.get('/myClient', {
        guideId: this.param.guideId,
        page: this.param.page,
        size: '10',
        dataType: this.param.dataType,
        dateType: this.param.dateType,
        status: this.param.status,
        keywords: this.param.keywords,
        type: 'my',
        sex: this.param.sex,
        age: this.param.age,
        address: this.param.address,
        whichGuide: this.param.whichGuide,
        grade: this.param.grade,
        registDate: this.param.registDate,
        shopDate: this.param.shopDate,
        company: this.param.company,
        customize: this.param.customize,
        requestName: this.param.page
      }, res => {
        if (res.errcode == 0) {
          this.count = res.data.count;
          let client = res.data.memberList;
          this.clientList = client;
          this.selets = res.data;
          this.clients.taday = '今日新增';
          this.clients.week = '本周新增';
          this.clients.month = '本月新增';
          this.clients.year = '本年新增';
          console.log(this.myClient.length)
          if (client.length < 10) {
            if (this.myClient.length < 10) {
              this.myClient = client;
            } else {
              this.myClient = this.myClient.concat(client);
            }
            //把page设置成false 数据已经加载完毕了 不用在加载了
            this.param.page = false
            //所有数据加载完毕后
            this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');

          } else {
            this.myClient = this.myClient.concat(client);

            //单次请求数据加载完毕后
            this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
          }
          this.isData = false;
        }
      }, err => {
        console.log(err)
        let code = err.code;
      })

    },
    onAddressChange(picker, values) {
      var adrs = new Array();
      var ads = address[values[0]];
      for (var key in ads) {
        //				  console.log(key);        //键名
        adrs.push(key)
        //				  console.log(ads[key]);   //键值

      }
      var adsVal = values[1];
      picker.setSlotValues(1, adrs);
      picker.setSlotValues(2, ads[adsVal]);

      var adrees = ads[adsVal];
      //				获取省市区筛选后的数据
      this.addressProvince = values[0];
      this.addressCity = values[1];
      this.addressArea = values[2];
    },
    onValuesChange(picker, values) {
      this.value = values[0];
    },
    //			选择性别
    sexClick: function () {
      this.sexVisible = true
    },
    sexHide: function () {
      this.sexVisible = false
    },
    sexVal() {
      this.sexVisible = false
      var sel = document.getElementById("chooseSex").querySelector(".picker-selected").innerHTML.replace(/\s+/g, "");
      this.gender = sel
      this.isSex = false;
      if (sel == '男') {
        sel = '1';
      } else if (sel == '女') {
        sel = '2'
      } else {
        sel = ''
      }
      this.param.sex = sel
      console.log(this.param.sex)
    },
    //	       	选择年龄
    ageClick: function () {
      for (var i = 1; i <= 100; i++) {
        this.age[0].values.push(i)
      };
      this.ageVisible = true
    },
    ageHide: function () {
      this.ageVisible = false
    },
    ageVal() {
      this.ageVisible = false
      const sel = document.getElementById("chooseAge").querySelector(".picker-selected").innerHTML.replace(/\s+/g, "");
      this.param.age = sel
      this.isAge = false;
    },
    //			选择所在地
    addressClick: function () {
      this.addressVisible = true;
    },
    addressHide: function () {
      this.addressVisible = false
    },
    addressVal() {
      this.addressVisible = false
      this.param.address = this.addressProvince + ' ' + this.addressCity + ' ' + this.addressArea
      this.isAdress = false;
    },
    //	       	选择归属导购
    guideClick: function () {
      this.guide[0].values = [];
      this.$api.get('/guideList', this.param, res => {
        if (res.errcode == 0) {
          const info = res.data;
          for (var i = 0; i < info.length; i++) {
            this.guide[0].values.push(info[i].name)
          }

        }
      }, err => {
        console.log(err)
        let code = err.code;
      })
      this.guideVisible = true
    },
    guideHide: function () {
      this.guideVisible = false
    },
    guideVal() {
      this.guideVisible = false
      const sel = document.getElementById("chooseGuide").querySelector(".picker-selected").innerHTML.replace(/\s+/g, "");
      this.param.whichGuide = sel;
      this.isGuide = false;
    },
    //			选择等级
    gradeClick: function () {
      this.grade[0].values = []
      this.$api.get('/gradeList', this.param, res => {
        if (res.errcode == 0) {
          const info = res.data;
          for (var i = 0; i < info.length; i++) {
            this.grade[0].values.push(info[i].name)
          }

        }
      }, err => {
        console.log(err)
        let code = err.code;
      })
      this.gradeVisible = true
    },
    gradeHide: function () {
      this.gradeVisible = false
    },
    gradeVal() {
      this.gradeVisible = false
      const sel = document.getElementById("chooseGrade").querySelector(".picker-selected").innerHTML.replace(/\s+/g, "");
      this.param.grade = sel;
      this.isGrade = false;
    },
    //	        	选择时间
    open(picker) {
      this.$refs[picker].open();
    },

    handleChange(value) {
      function formatDate(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var dat = now.getDate();
        return year + "-" + month + "-" + dat;
      }
      this.param.registDate = formatDate(value)
      this.isDate = false;
    },
    //			选择店铺
    shopClick: function () {
      this.shop[0].values = [];
      this.$api.get('/shoplist', this.param, res => {
        if (res.errcode == 0) {
          const info = res.data;
          for (var i = 0; i < info.length; i++) {
            this.shop[0].values.push(info[i].name)
          }

        }
      }, err => {
        console.log(err)
        let code = err.code;
      })
      this.shopVisible = true
    },
    shopHide: function () {
      this.shopVisible = false
    },
    shopVal() {
      this.shopVisible = false
      const sel = document.getElementById("chooseShop").querySelector(".picker-selected").innerHTML.replace(/\s+/g, "");
      this.param.shopDate = sel;
      this.isShop = false;
    },

    //	        重置高级筛选列表
    clear() {
      this.gender = '';
      this.param.page = '1';
      this.param.sex = '';
      this.param.age = '';
      this.param.address = '';
      this.param.whichGuide = '';
      this.param.grade = '';
      this.param.registDate = '';
      this.param.shopDate = '';
      this.param.company = '';
      this.param.customize = '';
      this.selectedNum = '';
      this.isShow = false;
      this.islabelShow = false;
      this.myClient = [];
      this.getmyClient();
      this.isSex = true;
      this.isAge = true;
      this.isAdress = true;
      this.isGuide = true;
      this.isGrade = true;
      this.isDate = true;
      this.isShop = true;
      this.isLable = true;
    },
    filter() {
      this.param.page = '1';
      this.myClient = [];
      this.getmyClient();
      this.isShow = false;
      this.islabelShow = false;
      this.isSex = true;
      this.isAge = true;
      this.isAdress = true;
      this.isGuide = true;
      this.isGrade = true;
      this.isDate = true;
      this.isShop = true;
      this.isLable = true;
      this.gender = '';
      this.param.page = '1';
      this.param.sex = '';
      this.param.age = '';
      this.param.address = '';
      this.param.whichGuide = '';
      this.param.grade = '';
      this.param.registDate = '';
      this.param.shopDate = '';
      this.param.company = '';
      this.param.customize = '';
      this.selectedNum = '';
    },
    lab() {
      document.documentElement.style.overflowY = "auto";
      console.log(this.param.sex)
      this.$router.push({
        path: 'yourPath',
        name: 'addTag',
        query: {
          status: this.status,
          sex: this.param.sex,
          age: this.param.age,
          address: this.param.address,
          whichGuide: this.param.whichGuide,
          grade: this.param.grade,
          registDate: this.param.registDate,
          shopDate: this.param.shopDate
        }
        /*query: {
            name: 'name',
            dataObj: this.msg
        }*/
      })

    },
    memberInfo(id) {

      //				this.memberid=this.myClient[id].id;
      //				sessionStorage.setItem("memberid",this.myClient[id].id);
      this.$router.push({
        path: 'yourPath',
        name: 'customerInformation',
        query: {
          name: 'name',
          memberId: this.myClient[id].id
        }
      })
    },
    changeFixed(clientHeight) {                        //动态修改样式
      console.log(clientHeight);
      this.$refs.homePage.style.height = (clientHeight - $('.searchInput').outerHeight(true) - $('.memberType').outerHeight(true) - $('.filter').outerHeight(true)) + 'px';
      console.log(this.$refs.homePage.style.height)
    }

  }

}
</script>
<style lang="scss">
@import "../../../style/scss/memberList";
</style>
