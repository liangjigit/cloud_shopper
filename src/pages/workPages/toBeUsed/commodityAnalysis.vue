<template>
	<div id="commodityAnalysis">
		<!--图表-->
		<div class="container_son" ref="boxHeight" :class="{touch:!isTouch}">
			<div class="container">
				<scroll ref="pullrefresh">
					<h4 class="title chartTitle">销售排行榜(TOP30)</h4>
					<div class="chart_box" v-if="charsShow">
						<div id="myChart">
						</div>
					</div>
					<div class="nullData nullpos" v-else>暂无相关数据</div>
					<div class="productTable">
						<div class="border"></div>
						<h4 class="title">销售明细</h4>
						<div class="thead">
							<div class="td rank">
								排行
							</div>
							<div class="td code">
								商品代码
							</div>
							<div class="td salenum">
								销售件数
							</div>
							<div class="td saleprice">
								销售额
							</div>
							<div class="td discount">
								折扣
							</div>
						</div>
						<div class="tbody" v-for="(item,index) in saleDetailList" :index="index" :key=index v-if="saleShow">
							<div class="td rank">
								{{index+1}}
							</div>
							<div class="td code">
								{{ item.goodsCode }}
							</div>
							<div class="td salenum">
								{{ item.salesVolume}}
							</div>
							<div class="td saleprice">
								￥{{ item.salesAmount }}
							</div>
							<div class="td discount">
								{{ item.discount}}
							</div>
						</div>
						<div v-if="!saleShow" class="nullData">暂无相关数据</div>
					</div>
					<div class="border"></div>
					<div class="product_swiper">
						<h4 class="title">商品浏览量(TOP10)</h4>
						<swiper :options="swiperOption" ref="mySwiper" v-if="swiperList.length>1">
							<swiper-slide v-for="(item,index) in swiperList" :index="index" :key="item.index" class="swiper_box">
								<div class="goodsimg">
									<img :src=imgURL+item.goodsPicture alt="" />
								</div>
								<p class="rank">TOP{{index+1}}</p>
								<p class="code">{{item.goodsCode}}</span>
								</p>
								<p class="viewnum">浏览量：{{item.browseAmount}}</p>
							</swiper-slide>
						</swiper>
					</div>
				</scroll>
			</div>
		</div>
		<datePicker ref="datePicker" v-on:sendday="receiveSendday" v-on:sendweek="receiveSendweek" v-on:sendmonth="receiveSendmonth"
		 v-on:sendtype="receiveSendtype" v-on:sendbegin="receiveSendbegin" v-on:sendend="receiveSendend">
		</datePicker>
	</div>
</template>

<script>
import datePicker from "./datePicker";
import Scroll from "../../components/scroll";
export default {
  name: "commodityAnalysis",
  components: {
    datePicker,
    Scroll,
  },
  data() {
    return {
      clientHeight: "",
      imgURL: this.GLOBAL.imgURL,
      saleShow: false,
      charsShow: false,
      nullDraw: false,
      isTouch: true,
      //接口参数
      MEMBERID: this.GLOBAL.MEMBERID,
      dateType: "one",
      begin: "",
      end: "",
      //列表
      saleDetailList: [],
      productNamesList: [],
      productSalesCountList: [],
      swiperList: [],
      //轮播参数配置
      swiperOption: {
        //设定初始化时slide的索引
        initialSlide: 0,
        //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
        direction: "horizontal",
        autoplay: {
          delay: 2500, //2.5秒切换一次
          disableOnInteraction: false,
        },
        //环状轮播
        loop: true,
        slidesPerView: "auto",
        loopedSlides: 3,
        loopAdditionalSlides: 0,
        //一个屏幕展示的数量
        slidesPerView: 3,
        spaceBetween: 26,
        //修改swiper自己或子元素时，自动初始化swiper
        observer: true,
        //修改swiper的父元素时，自动初始化swiper
        observeParents: true,
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  methods: {
    // 绘制图表
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        grid: {
          top: "5%",
          left: "14%",
          bottom: "32.5%",
        },
        color: ["#f00"], //全局字体颜色
        textStyle: {
          fontSize: 12,
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          show: false, //提示
        },
        xAxis: {
          show: this.charsShow,
          data: this.productNamesList, //x轴数据
          axisLabel: {
            interval: 0,
            rotate: 50, //旋转
            textStyle: {
              fontSize: 10,
            },
            formatter: function (val) {
              var relVal = "";
              relVal += val.substr(0, 5) + "…";
              return relVal;
            }, //处理函数
          },
        },
        yAxis: {
          fontSize: 12,
          type: "value",
          show: this.charsShow,
          axisLabel: {
            textStyle: {
              fontSize: 12, // 让字体变大
            },
          },
        },
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.productSalesCountList,
          },
        ],
        dataZoom: [
          {
            type: "slider",
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: 60,
          },
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 60,
          },
        ],
      });
    },
    //图表
    getSaleRanking() {
      let that = this;
      this.$api.get(
        "/productSalesTop",
        {
          guideId: that.MEMBERID,
          datetype: that.dateType,
          startTime: that.begin,
          endTime: that.end,
          requestName: that.MEMBERID,
        },
        (res) => {
          console.log(res.data);
          if (res.errcode == 0) {
            var dataList = res.data;
            that.productNamesList = dataList.productNames;
            that.productSalesCountList = dataList.productSalesCount;
            console.log(that.productSalesCountList);
            if (
              that.productNamesList.length > 0 &&
              that.productSalesCountList.length > 0
            ) {
              that.nullDraw = true;
              that.charsShow = true;
              if (that.nullDraw == true) {
                this.$nextTick(function () {
                  this.drawLine();
                });
              }
            } else {
              //首次加载如果没有数据不加载图表，如果有数据再加载图表，每次执行完毕设置nullDraw为false
              that.nullDraw = false;
              if (that.nullDraw == true) {
                this.$nextTick(function () {
                  this.drawLine();
                });
              }
              that.charsShow = false;
              that.nullDraw = false;
            }
          }
        }
      );
    },
    getProductAnalysis() {
      var that = this;
      that.$api.get(
        "/productAnalysis",
        {
          guideId: that.MEMBERID,
          datetype: that.dateType,
          startTime: that.dateType == "four" ? that.begin : "",
          endTime: that.dateType == "four" ? that.end : "",
          requestName: that.dateType,
        },
        (res) => {
          console.log(res);
          var listData = [];
          if (res.errcode == 0) {
            var dataList = res.data;
            if (dataList.length > 0) {
              that.saleShow = true;
              listData = listData.concat(dataList);
              that.saleDetailList = that.saleDetailList.concat(listData);
            } else {
              that.saleShow = false;
              listData = listData.concat(dataList);
              that.saleDetailList = that.saleDetailList.concat(listData);
            }
          }
        }
      ),
        (err) => {
          console.log(err);
        };
    },
    getSwiperList() {
      var that = this;
      that.$api.get(
        "/productPageView",
        {
          guideId: that.MEMBERID,
          datetype: that.dateType,
          startTime: that.begin,
          endTime: that.end,
          requestName: that.begin,
        },
        (res) => {
          console.log(res);
          var listData = [];
          if (res.errcode == 0) {
            var dataList = res.data;
            listData = listData.concat(dataList);
            that.swiperList = that.swiperList.concat(listData);
          }
        }
      ),
        (err) => {
          console.log(err);
        };
    },
    //选择昨日
    receiveSendday(mes) {
      var that = this;
      console.log(mes);
      that.nullDraw = true;
      that.isTouch = mes[1];
      that.productSalesCountList.length = 0;
      that.productNamesList.length = 0;
      that.saleDetailList.length = 0;
      that.swiperList.length = 0;
      that.dateType = mes[0];
      that.getSaleRanking();
      that.getProductAnalysis();
      that.getSwiperList();
    },
    //选择本周
    receiveSendweek(mes) {
      var that = this;
      console.log(mes);
      that.nullDraw = true;
      that.isTouch = mes[3];
      that.productSalesCountList.length = 0;
      that.productNamesList.length = 0;
      console.log(that.saleDetailList);
      that.saleDetailList.length = 0;
      that.swiperList.length = 0;
      that.dateType = mes[0];
      that.getSaleRanking();
      that.getProductAnalysis();
      that.getSwiperList();
    },
    //选择本月
    receiveSendmonth(mes) {
      var that = this;
      that.nullDraw = true;
      that.productSalesCountList.length = 0;
      that.productNamesList.length = 0;
      that.saleDetailList.length = 0;
      that.swiperList.length = 0;
      that.dateType = mes[0];
      that.isTouch = mes[1];
      that.getSaleRanking();
      that.getProductAnalysis();
      that.getSwiperList();
    },
    //自定义接收type类型
    receiveSendtype(mes) {
      var that = this;
      that.nullDraw = true;
      that.dateType = mes[0];
      that.isTouch = mes[1];
    },
    //选择开始时间
    receiveSendbegin(mes) {
      var that = this;
      that.nullDraw = true;
      that.productSalesCountList.length = 0;
      that.productNamesList.length = 0;
      that.saleDetailList.length = 0;
      that.swiperList.length = 0;
      that.begin = mes[0];
      that.isTouch = mes[1];
      if (that.end) {
        that.getSaleRanking();
        that.getProductAnalysis();
        that.getSwiperList();
      }
    },
    //选择结束时间
    receiveSendend(mes) {
      var that = this;
      that.nullDraw = true;
      that.productSalesCountList.length = 0;
      that.productNamesList.length = 0;
      that.saleDetailList.length = 0;
      that.swiperList.length = 0;
      that.end = mes[0];
      that.isTouch = mes[1];
      if (that.begin) {
        that.getSaleRanking();
        that.getProductAnalysis();
        that.getSwiperList();
      }
    },
    changeFixed(clientHeight) {
      this.$refs.boxHeight.style.height =
        clientHeight -
        $(".contain").outerHeight(true) -
        $(".time").outerHeight(true) +
        "px";
    },
  },
  mounted() {
    var that = this;
    that.getProductAnalysis();
    that.getSwiperList();
    that.getSaleRanking();
    this.clientHeight = `${document.documentElement.clientHeight}`;
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  created() {
    let user = localStorage.getItem("user");
    this.MEMBERID = user.replace(/\"/g, "");
  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight);
    },
  },
};
</script>

<style lang="scss">
@import "../../style/scss/commodityAnalysis";
</style>
