
<template>
	<div id="commission">
		<header>
			<datePicker ref="datePicker" v-on:sendday="receiveSendday" v-on:sendweek="receiveSendweek" v-on:sendmonth="receiveSendmonth"
			 v-on:sendtype="receiveSendtype" v-on:sendbegin="receiveSendbegin" v-on:sendend="receiveSendend">
			</datePicker>
		</header>

		<ul class="commission_price">
			<li>
				<p>￥{{ initDetailList.memberCommission }}</p>
				<span>归属会员佣金</span>
			</li>
			<li>
				<p>￥{{ initDetailList.promoteCommission }}</p>
				<span>推广链接佣金</span>
			</li>
			<li>
				<p>￥{{ initDetailList.orderCommission }}</p>
				<span>发货佣金</span>
			</li>
		</ul>

		<div class="commission_search" :class="{touch:!isTouch}">
			<div class="commissionTitle">
				佣金明细查询
			</div>
			<div class="navbox" @mouseleave="optionShow=false,optionSecondShow=false">
				<ul class="nav">
					<li class="nav_first" @click="optionShow=!optionShow,optionSecondShow=false">
						<span class="defaultOption">{{ chooseVal }}</span>
						<i class="iconfont dropDown" :class="{flip:optionShow}">&#xe60e;</i>
					</li>
					<li class="nav_second" @click="optionSecondShow=!optionSecondShow,optionShow=false">
						<span class="defaultOption">{{ chooseVal2 }}</span>
						<i class="iconfont dropDown" :class="{flip:optionSecondShow}">&#xe60e;</i>
					</li>
				</ul>
			</div>
			<div class="mask" v-show="optionShow||optionSecondShow" @click="optionShow=false,optionSecondShow=false" ref="maskHeight">
				<ul class="optionList" v-show="optionShow">
					<li class="option" v-for="(item,index) in optionList" :tapIndex='index' @click.stop="send" :key="index">{{ item.optionText }}</li>
				</ul>
				<ul class="optionListTwo" v-show="optionSecondShow">
					<li class="option" v-for="(item,index) in optionListSecond" :tapIndex='index' @click.stop="send2" :key="index">{{ item.optionText }}</li>
				</ul>
			</div>

		</div>
		<div class="commission_list mint-tab-container" ref="comlistHeight" :class="{touch:!isTouch}">
			<scroll ref="pullrefresh" :pullup="areShow" @scrollToEnd="loadMore" :data="empData" :nullDataAll="nullDataAllLeft"
			 :isDone="isLoadingLeft">
				<ul>
					<li v-for='(item,index) in dataList' class="list_item" :style="{backgroundImage: 'url(' + backgroundImage  + ')'}"
					 :key="index">
						<div class="commission_list_left">
							<p class="type">{{ '佣金金额' }}</p>
							<p class="price">{{ item.price }}</p>
							<p class="status">{{ item.status }}</p>
						</div>
						<div class="commission_list_right">
							<p class="dataSource">{{ item.dataSource }}</p>
							<p class="orderPrice">支付金额：
								<span>{{ item.orderPrice }}</span>
							</p>
							<p class="memberName">下单会员：
								<span>{{ item.memberName }}</span>
							</p>
							<p class="orderNum">订单编号：
								<span>{{ item.orderNum }}</span>
							</p>
							<p class="orderTime">下单时间：
								<span>{{ item.orderTime }}</span>
							</p>
						</div>
					</li>
				</ul>
			</scroll>
		</div>
		<footer>
			<div class="footer_left">
				<span>佣金金额：</span>￥{{initDetailList.commissionAll}}
			</div>
			<div class="footer_right">
				<span>订单笔数：</span>{{initDetailList.orderNum}}
			</div>
		</footer>
	</div>
</template>

<script>
	import vueEvent from '../../../main'
	import datePicker from '../datePicker'
	import Scroll from '../../../components/scroll'
	export default {
		name: "commission",
		components: {
			datePicker,
			Scroll
		},
		data() {
			return {
				MEMBERID: this.GLOBAL.MEMBERID,
				clientHeight: '',
				optionShow: false,
				isTouch: true,
				optionSecondShow: false,
				chooseVal: '全部',
				chooseVal2: '全部',
				backgroundImage: require("../../../static/image/111111.png"),
				//筛选条件
				dateType: 'one',
				startTime: '',
				endTime: '',
				page: 1,
				type: '',
				status: '',
				percentage: '',
				// 是否显示加载更多
				staffList: false,

				// 禁止是否上拉
				isShow: true,
				empData: [],
				areShow: true,
				isData: false,
				initDetailList: [],
				dataList: [],
				// 提示语
				isLoadingLeft: true,
				nullDataAllLeft: false,

				//一级列表
				optionList: [{
						optionText: '全部'
					},
					{
						optionText: '归属会员佣金'
					},
					{
						optionText: '推广链接佣金'
					},
					{
						optionText: '发货佣金'
					},
				],
				//二级列表
				optionListSecond: [{
						optionText: '全部'
					},
					{
						optionText: '冻结中'
					},
					{
						optionText: '可提现'
					},
					{
						optionText: '已关闭'
					},
				],
			}
		},
		computed: {
			totalPrice() {
				var that = this;
				var sum = 0;
				that.dataList.forEach((item) => {
					var num = item.price
					sum += Number(item.price)
				})
				return sum;
			}
		},
		methods: {
			//选择昨日
			receiveSendday(mes) {
				var that = this;
				//初始化
				that.isLoadingLeft = true;
				that.initDetailList.length = 0;
				that.dataList.length = 0;
				that.dateType = mes[0];
				that.isTouch = mes[1]
// 				that.startTime = '';
// 				that.endTime = '';
				that.page = 1;
				that.getCommission();
			},
			//选择本周
			receiveSendweek(mes) {
				var that = this;
				//初始化
				that.isLoadingLeft = true;
				that.initDetailList.length = 0;
				that.dataList.length = 0;
// 				that.startTime = '';
// 				that.endTime = '';
				that.dateType = mes[0];
				that.isTouch = mes[3]
				that.page = 1;
				that.getCommission();
			},
			//选择本月
			receiveSendmonth(mes) {
				var that = this;
				//初始化
				that.isLoadingLeft = true;
				that.initDetailList.length = 0;
				that.dataList.length = 0;
				that.dateType = mes[0];
				that.isTouch = mes[1]
// 				that.startTime = '';
// 				that.endTime = '';
				that.page = 1;
				that.getCommission();
			},
			//自定义接收type类型
			receiveSendtype(mes) {
				var that = this;
				that.dateType = mes[0];
				that.isTouch = mes[1]
			},
			//选择开始时间
			receiveSendbegin(mes) {
				var that = this;
				//初始化
				console.log(mes)
				that.isLoadingLeft = true;
				that.initDetailList.length = 0;
				that.dataList.length = 0;
				that.startTime = mes[0];
				that.isTouch = mes[1]
				that.page = 1;
				console.log(that.endTime)
				if (that.endTime) {
					that.getCommission();
				}
			},
			//选择结束时间
			receiveSendend(mes) {
				var that = this;
				console.log(mes)
				that.isLoadingLeft = true;
				that.initDetailList.length = 0;
				that.dataList.length = 0;
				that.endTime = mes[0];
				that.isTouch = mes[1]
				that.page = 1;
				if (that.startTime) {
					that.getCommission();
				}
			},
			loadMore() {
				let that = this;
				if (!that.isData) {
					if (that.page < 0 || that.page == false) {
						return
					} else {
						that.isData = true;
						that.nullDataLight = false;
						that.page++
						//上拉加载重新初始化
						this.$refs.pullrefresh.$emit('infinitescroll.reInit');
						that.getCommission();
					}
				}
			},
			//一级筛选
			send(e) {
				var that = this;
				//初始化
				that.isLoadingLeft = true;
				that.page = 1;
				that.optionShow = false,
				that.initDetailList.length = 0;
				that.dataList.length = 0;
				vueEvent.$emit("outmes", e.srcElement.innerHTML);
				//筛选
				var tapIndex = e.srcElement.attributes[0].value;
				if (tapIndex == '0') {
					that.type = ''
				} else {
					that.type = '00' + tapIndex;
				}
				that.getCommission();
			},
			//二级筛选
			send2(e) {
				var that = this;
				that.page = 1;
				//初始化
				that.isLoadingLeft = true;
				that.optionSecondShow = false,
				that.initDetailList.length = 0;
				that.dataList.length = 0;
				vueEvent.$emit("outmes2", e.srcElement.innerHTML);
				//筛选
				var tapIndex = e.srcElement.attributes[0].value;
				if (tapIndex == '0') {
					that.status = ''
				} else {
					that.status = '00' + tapIndex;
				}
				console.log(that.status)
				that.getCommission();
			},
			getCommission() {
				let that = this,
					listData = [];
				that.$api.get('/commission', {
						guideId: '928ef9cd6f9811e88088b82a72d782c1',
						page: that.page,
						size: 10,
						datatype: that.dateType,
						startTime: that.dateType=='four'?that.startTime:'',
						endTime: that.dateType=='four'?that.endTime:'',
						type: that.type,
						status: that.status,
						requestName: that.page
					},
					res => {
						if (res.errcode == 0) {
							var list = res.data;
							// 数据
							that.initDetailList = list;
							that.empData = list.detailList;
							listData = listData.concat(list.detailList);
							console.log(that.initDetailList, listData);
							if (listData.length < 10) {
								that.dataList = that.dataList.concat(listData);
								//把page设置成false 数据已经加载完毕了 不用在加载了
								this.page = false;
								that.isLoadingLeft = false;
								//所有数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');
							} else {
								that.dataList = that.dataList.concat(listData);
								that.isLoadingLeft = true;
								//单次请求数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
							}
							if (that.dataList.length == 0) {
								that.nullDataAllLeft = true;
							}
							else{
								that.nullDataAllLeft = false;

							}
							that.isData = false;
						}
					},
					err => {
						console.log(err)
					}
				)
			},
			changeFixed(clientHeight) {
				var num = parseInt($('.navbox').css('marginBottom'))
				console.log($('.commission_price').outerHeight(true))
				this.$refs.comlistHeight.style.height =
					(clientHeight - $('.contain').outerHeight(true) - $('.time').outerHeight(true) - $('.commission_price').outerHeight(
						true) - $('.commission_search').outerHeight(true) - $('footer').outerHeight(
						true)) + 'px';
				this.$refs.maskHeight.style.height =
					(clientHeight - $('.contain').outerHeight(true) - $('.time').outerHeight(true) - $('.commission_price').outerHeight(
						true) - $('.commission_search').outerHeight(true) - $('footer').outerHeight(
						true) + num) + 'px';
			},
		},
		created: function() {
			let user = localStorage.getItem('user');
			this.MEMBERID = user.replace(/\"/g, "");
		},
		mounted() {
			var that = this;
			var now = new Date();
			that.getCommission();
			that.startDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
			vueEvent.$on("outmes", function(mes) {
				that.chooseVal = mes;
			});
			vueEvent.$on("outmes2", function(mes) {
				that.chooseVal2 = mes;
			});
			this.clientHeight = `${document.documentElement.clientHeight}`
			window.onresize = function temp() {
				this.clientHeight = `${document.documentElement.clientHeight}`;
			};
		},
		watch: {
			clientHeight: function() {
				this.changeFixed(this.clientHeight)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../style/scss/commission";
	@import "../../../style/common";

	@font-face {
		font-family: 'iconfont';
		/* project id 770909 */
		src: url('//at.alicdn.com/t/font_770909_t92q8jeclj.eot');
		src: url('//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.woff') format('woff'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.ttf') format('truetype'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont') format('svg');
	}
</style>
