<template>
	<div id="storeManagement">
		<header>
			<datePicker ref="datePicker" v-on:sendday="receiveSendday" v-on:sendweek="receiveSendweek" v-on:sendmonth="receiveSendmonth"
			 v-on:sendtype="receiveSendtype" v-on:sendbegin="receiveSendbegin" v-on:sendend="receiveSendend">
			</datePicker>
		</header>
		<div class="select_box">
			<div class="select">
				<ul>
					<li @click="isShow=!isShow,areaShow=false">
						{{targets}}
						<i class="iconfont down" :class='{flip:isShow}'>&#xe668;</i>
					</li>
					<li @click="isShow=false,areaShow=!areaShow">
						城市
						<span class="down ">{{ city }}</span>
						<i class="iconfont" :class='{flip:areaShow}'>&#xe668;</i>
					</li>
				</ul>
			</div>
		</div>
		<div class="mask" v-if="isShow" @click="isShow=false">
			<div class="choose_box">
				<div class="choose_main">
					<div class="scroll">
						<ul>
							<li class="sale_targets">
								<h4>销售指标</h4>
								<ul>
									<li v-for="(item,index) in sellChooseList" class='targets_item' @click="toggle(index);selectThis($event);"
									 :index='index' :class="index == checkindex ? 'active' : ''" :key="index">{{ item.listItem }}</li>
								</ul>
							</li>
							<li class="member_targets">
								<h4>会员指标</h4>
								<ul>
									<li v-for='(item,index) in memberChooseList' class='targets_item' @click='toggle2(index);selectThis($event);'
									 :index='index+9' :class="index+13 == checkindex ? 'active' : ''" :key="index">{{ item.listItem }}</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>

		</div>
		<div class="mask" v-show="areaShow" @click="areaShow=false">
			<div class="choose_box">
				<div class="choose_main">
					<ul>
						<li class="member_targets">
							<ul>
								<li v-for='(item,index) in areaList' class='targets_item' @click='toggle3(index);selectArea($event,index)'
								 :areaId="item.id" :class="index == checkindex3 ? 'active' : ''" :key="index">{{ item.name }}</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="thead" :class="{touch:!isTouch}">
			<span class="tr rank">排名</span>
			<span class="tr store">店铺</span>
			<span class="tr salePrice">{{targets}}</span>
		</div>
		<div class="table" ref="boxHeight" :class="{touch:!isTouch}">
			<scroll ref="pullrefresh" :pullup="areShow" @scrollToEnd="loadMore" :data="empData" :page="page" :nullDataAll="nullDataAllLeft"
			 :isDone="isLoadingLeft">
				<div>
					<div class="tbody" v-for="(item,index) in rankList" :index="index" :key="index">
						<span class="td">{{ index+1 }}</span>
						<span class="td">{{ item.shopName }}</span>
						<span class="td">{{item.rankData}}</span>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import datePicker from './datePicker'
	import Scroll from '../../components/scroll'
	import vueEvent from '../../main'
	export default {
		name: "storeManagement",
		components: {
			datePicker,
			Scroll
		},
		data() {
			return {
				checkindex: 0,
				checkindex3: 0,
				MEMBERID: this.GLOBAL.MEMBERID,
				clientHeight: '',
				isShow: false,
				//透明度
				isTouch: true,
				areShow: true,
				isData: false,
				empData: [],

				areaShow: false,
				active: false,
				timeVal: '',
				city: '全部',
				targets: '净销售额',

				dateType: 'one',
				startTime: '',
				endTime: '',
				page: 1,
				size: 10,
				//选择区域
				areaId: '',
				type: '',
				status: '',
				percentage: '',
				// 提示语
				isLoadingLeft: true,
				nullDataAllLeft: false,
				isHaveData: false,
				// 加载完成
				noData: '',
				rankList: [],
				areaList: [{
					name: '全部'
				}],
				//选择指标
				indicators: '001',
				sellChooseList: [{
						listItem: '净销售额',
					},
					{
						listItem: '会员销售额占比',
					},
					{
						listItem: '会员销售件数占比',
					},
					{
						listItem: '新会员激活率',
					},
					{
						listItem: '二次购买率',
					},
					{
						listItem: '重复购买率',
					},
					{
						listItem: '客单价',
					},
					{
						listItem: '折扣率',
					},
					{
						listItem: '人效',
					}
				],
				memberChooseList: [{
						listItem: '线上新增'
					},
					{
						listItem: '线下新增'
					},
					{
						listItem: '人均线上新增'
					},
					{
						listItem: '老会员绑定进度'
					},
				]
			}
		},
		methods: {
			//选择昨日
			receiveSendday(mes) {
				var that = this;
				that.isLoadingLeft = true,
					that.rankList = [];
				that.dateType = mes[0];
				that.isTouch = mes[1]
				that.page = 1;
				that.getList();
			},
			//选择本周
			receiveSendweek(mes) {
				var that = this;
				that.isLoadingLeft = true,
				that.rankList = [];
				that.dateType = mes[0];
				that.isTouch = mes[3]
				that.page = 1;
				that.getList();
			},
			//选择本月
			receiveSendmonth(mes) {
				var that = this;
				that.isLoadingLeft = true,
				that.rankList = [];
				that.dateType = mes[0];
				that.isTouch = mes[1]
				that.page = 1;
				that.getList();
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
				that.isLoadingLeft = true,
				that.startTime = mes[0];
				that.isTouch = mes[1]
				that.page = 1;
				if (that.endTime) {
					that.rankList = [];
					that.getList();
				}
			},
			//选择结束时间
			receiveSendend(mes) {
				var that = this;
				that.isLoadingLeft = true,
				that.endTime = mes[0];
				that.isTouch = mes[1]
				that.page = 1;
				if (that.startTime) {
					that.getList();
				}
			},
			//样式
			toggle(index) {
				this.checkindex = index
			},
			toggle2(index) {
				this.checkindex = index + 13
			},
			toggle3(index) {
				this.checkindex3 = index
			},

			//选择区域
			selectArea(e, index) {
				var that = this;
				that.isLoadingLeft = true,
				that.page = 1;
				that.rankList.length = 0;
				that.city = e.srcElement.innerHTML;
				that.areaId = e.srcElement.attributes[0].value;
				that.getList();
			},
			//门店数据
			getList() {
				var that = this;
				var listData = [];
				that.$api.get(
					'/storeManager/storeRank', {
						// guideId: that.MEMBERID,
						guideId: 'c348c2b7439911e88088b82a72d782c1',
						page: that.page,
						size: 10,
						indicators: that.indicators,
						dateType: that.dateType,
						startTime: that.dateType == 'four' ? that.startTime : '',
						endTime: that.dateType == 'four' ? that.endTime : '',
						areaId: that.checkindex3 == 0 ? '' : that.areaId,
						requestName: that.page
					},
					res => {
						console.log(res)
						if (res.errcode == 0) {
							var list = res.data;
							console.log(list)
							//没有权限与有权限但无数据做同样处理
							if (list == null) {
								list = []
							}
							that.empData = list;
							console.log(that.empData)
							listData = listData.concat(list);
							if (listData.length < 10) {
								that.rankList = that.rankList.concat(listData);
								//把page设置成false 数据已经加载完毕了 不用在加载了
								this.page = false;
								that.isLoadingLeft = false;
								//所有数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');

							} else {
								that.rankList = that.rankList.concat(listData);;
								that.isLoadingLeft = true;
								//单次请求数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
							}
							if (that.empData.length == 0) {
								that.nullDataAllLeft = true;
							} else {
								that.nullDataAllLeft = false;
							}

							that.isData = false;
						}
					}, err => {
						console.log(err)
					}
				)
			},
			getArea() {
				var that = this;
				that.$api.get(
					'/area', {
						// guideId: that.MEMBERID,
						guideId: '8bae5fb879d111e88088b82a72d782c1',
						requestName: that.MEMBERID
					},
					res => {
						console.log(res.data)
						if (res.data == null) {
							res.data = []
						}
						var dataList = res.data;
						dataList.forEach((item) => {
							that.areaList.push(item)
						})
					}, err => {
						console.log(err)
					}
				)
			},
			selectThis(e) {
				var that = this;
				that.isLoadingLeft = true,
					that.page = 1;
				that.rankList.length = 0;
				that.targets = e.srcElement.innerHTML;
				switch (e.srcElement.attributes[0].value) {
					case '0':
						that.indicators = '001';
						that.getList();
						break;
					case '1':
						that.indicators = '002';
						that.getList();
						break;
					case '2':
						that.indicators = '003';
						that.getList();
						break;
					case '3':
						that.indicators = '004';
						that.getList();
						break;
					case '4':
						that.indicators = '005';
						that.getList();
						break;
					case '5':
						that.indicators = '006';
						that.getList();
						break;
					case '6':
						that.indicators = '007';
						that.getList();
						break;
					case '7':
						that.indicators = '008';
						that.getList();
						break;
					case '8':
						that.indicators = '009';
						that.getList();
						break;
					case '9':
						that.indicators = '010';
						that.getList();
						break;
					case '10':
						that.indicators = '011';
						that.getList();
						break;
					case '11':
						that.indicators = '012';
						that.getList();
						break;
					case '12':
						that.indicators = '013';
						that.getList();
						break;
					default:
						break;
				}
			},
			//加载更多
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
						that.getList();
					}
				}
			},
			changeFixed(clientHeight) { //动态修改样式
				this.$refs.boxHeight.style.height = (clientHeight - $('.contain').outerHeight(true) - $('.time').outerHeight(true) -
					$('.select_box').outerHeight(true) - $('.thead').outerHeight(true)) + 'px';
			},
		},
		created: function() {
			let user = localStorage.getItem('user');
			this.MEMBERID = user.replace(/\"/g, "");
		},
		mounted() {
			var that = this;
			that.getList();
			that.getArea();


			this.clientHeight = `${document.documentElement.clientHeight}`
			console.log(this.clientHeight)
			window.onresize = function temp() {
				this.clientHeight = `${document.documentElement.clientHeight}`;
			};
		},
		watch: {
			// 如果 `clientHeight` 发生改变，这个函数就会运行
			clientHeight: function() {
				this.changeFixed(this.clientHeight)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../style/scss/storeManagement";
	@import "../../style/common";

	@font-face {
		font-family: 'iconfont';
		/* project id 770909 */
		src: url('//at.alicdn.com/t/font_770909_5nyiunqf57n.eot');
		src: url('//at.alicdn.com/t/font_770909_5nyiunqf57n.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_770909_5nyiunqf57n.woff') format('woff'), url('//at.alicdn.com/t/font_770909_5nyiunqf57n.ttf') format('truetype'), url('//at.alicdn.com/t/font_770909_5nyiunqf57n.svg#iconfont') format('svg');
	}
</style>
