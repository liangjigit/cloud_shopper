<template>
	<div id="ShoppersRanking" :class="isShow?'discroll':''" ref="getTimer">
		<datePicker ref="datePicker" v-on:sendday="receiveSendday" v-on:sendweek="receiveSendweek" v-on:sendmonth="receiveSendmonth"
		 v-on:sendtype="receiveSendtype" v-on:sendbegin="receiveSendbegin" v-on:sendend="receiveSendend">
		</datePicker>
		<div class="choose_title_box" @click="chooseIndicators">
			<div class="choose_title">
				<span>选择指标</span>
				<span>{{ defaultVal }}
					<i class="iconfont dropDown" :class="{flip:isShow}">&#xe60e;</i>
				</span>
			</div>
		</div>
		<div class="mask" v-show="isShow" @click="isShow=false">
			<div class="choose_box">
				<div class="choose_main">
					<ul>
						<li class="sale_targets">
							<h4>销售指标</h4>
							<ul>
								<li :key="index" v-for="(item,index) in sellChooseList" class='targets_item' @click="toggle(index,$event)"
								 :class="index == checkindex ? 'active' : ''" :data-id='index'>{{ item.listItem }}</li>
							</ul>
						</li>
						<li class="member_targets">
							<h4>会员指标</h4>
							<ul>
								<li :key="index" v-for='(item,index) in memberChooseList' class='targets_item' @click="toggle2(index,$event)"
								 :class="index+9 == checkindex ? 'active' : ''" :data-id='index+9'>{{ item.listItem }}</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="rankList" ref="boxHeight" :class="{touch:!isTouch}">
			<scroll ref="pullrefresh" :pullup="areShow" @scrollToEnd="loadMore" :data="empData" :page="page" :nullDataAll="nullDataAllLeft"
			 :isDone="isLoadingLeft">
				<ul>
					<li v-for="(item, index) in rankList" :key="index" :index="index" :class="index==0?'NO1':''">
						<div>
							<img src="../../static/image/Trophy.png" v-if="index==0" class="champion" />
							<span class="rank" v-else>TOP{{ index+1 }}</span>
							<span class="logo">
								<img :src="item.avatar?item.avatar:require('../../static/image/nodata_people.png')" class="avatar" />
								<img src="../../static/image/sale_king.png" v-if="index==0" class='king' />
							</span>
							<span class="name">{{ item.name }}</span>
							<span class="data">￥{{ item.salePrice==null?0:item.salePrice }}</span>
						</div>
					</li>
				</ul>
			</scroll>
		</div>
	</div>
</template>

<script>
	import datePicker from './datePicker'
	import {
		Toast
	} from 'mint-ui';
	import Scroll from '../../components/scroll'

	export default {
		name: "ShoppersRanking",
		components: {
			datePicker,
			Scroll
		},
		data() {
			return {
				clientHeight: '',
				defaultVal: '净销售额',
				checkindex: 0,
				isShow: false,
				isTouch: true,
				areShow: true,
				isData: false,
				empData: [],
				rankList: [],
				//接口参数
				MEMBERID: this.GLOBAL.MEMBERID,
				dateType: 'one',
				page: 1,
				type: '',
				begin: '',
				end: '',
				status: '',
				percentage: '',
				indicators: '001',
				// 提示语
				isLoadingLeft: true,
				nullDataAllLeft: false,
				//list
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
				}]
			}
		},

		created: function() {
			let user = localStorage.getItem('user');
			this.MEMBERID = user.replace(/\"/g, "");
		},
		mounted() {
			var that = this;
			this.getData();
			this.clientHeight = `${document.documentElement.clientHeight}`
			window.onresize = function temp() {
				this.clientHeight = `${document.documentElement.clientHeight}`;
			};
		},
		watch: {
			// 如果 `clientHeight` 发生改变，这个函数就会运行
			clientHeight: function() {
				this.changeFixed(this.clientHeight)
			}
		},
		methods: {
			//选择昨日
			receiveSendday(mes) {
				var that = this;
				that.isLoadingLeft = true,
					that.rankList.length = 0;
				that.page = 1;
				that.dateType = mes[0];
				that.isTouch = mes[1]
				that.getData();
			},
			//选择本周
			receiveSendweek(mes) {
				var that = this;
				that.isLoadingLeft = true,
					that.page = 1;
				that.rankList.length = 0;
				that.dateType = mes[0];
				that.isTouch = mes[3]
				that.getData();
			},
			//选择本月
			receiveSendmonth(mes) {
				var that = this;
				that.isLoadingLeft = true,
				that.rankList.length = 0;
				that.dateType = mes[0];
				that.isTouch = mes[1];
				that.page = 1;
				that.getData();
			},
			//自定义接收type类型
			receiveSendtype(mes) {
				var that = this;
				that.dateType = mes[0];
				that.isTouch = mes[1];
			},
			//选择开始时间
			receiveSendbegin(mes) {
				var that = this;
				that.isLoadingLeft = true,
				that.rankList.length = 0;
				that.page = 1;
				that.begin = mes[0];
				console.log(mes)
				that.isTouch = mes[1]
				if (that.end) {
					that.getData();
				}
			},
			//选择结束时间
			receiveSendend(mes) {
				var that = this;
				that.isLoadingLeft = true,
				that.rankList.length = 0;
				that.page = 1;
				that.end = mes[0];
				that.isTouch = mes[1];
				if (that.begin) {
					that.getData();
				}
			},
			toggle(index, e) {
				var that = this;
				that.isLoadingLeft = true,
				that.page = 1;
				that.rankList.length = 0;
				that.checkindex = index;
				that.defaultVal = e.srcElement.innerHTML;
				that.indicators = '00' + (that.checkindex + 1)
				that.getData();
			},
			toggle2(index, e) {
				var that = this;
				that.isLoadingLeft = true,
				that.page = 1;
				that.checkindex = index + 9;
				that.rankList.length = 0;
				that.defaultVal = e.srcElement.innerHTML;
				that.indicators = '0' + (that.checkindex + 1)
				that.getData();
			},
			//排行数据
			getData() {
				var that = this,
					listData = [];
				that.$api.get(
					'/saleRankInfo', {
						guideId: that.MEMBERID,
						page: that.page,
						size: 10,
						datetype: that.dateType,
						startTime: that.dateType == 'four' ? that.begin : '',
						endTime: that.dateType == 'four' ? that.end : '',
						indicators: that.indicators,
						requestName: that.page
					},
					res => {
						console.log(res)
						if (res.errcode == 0) {
							var list = res.data;
							if (list == null) {
								list = []
							}
							that.empData = list;
							listData = listData.concat(list);
							console.log(listData)
							// console.log(list)
							if (listData.length < 10) {
								that.rankList = that.rankList.concat(listData);
								//把page设置成false 数据已经加载完毕了 不用再加载了
								this.page = false;
								that.isLoadingLeft = false;
								//所有数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');
							} else {
								that.rankList = that.rankList.concat(listData);
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
			chooseIndicators() {
				var that = this;
				that.isShow = !that.isShow;
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
						that.getData();
					}
				}
			},
			changeFixed(clientHeight) { //动态修改滚动加载高度
				this.$refs.boxHeight.style.height = (clientHeight - $('.contain').outerHeight(true) - $('.time').outerHeight(true) -
					$('.choose_title_box').outerHeight(true)) + 'px';
			}
		}
	}
</script>

<style lang="scss">
	@import "../../style/scss/ShoppersRanking";
	@import "../../style/common";

	@font-face {
		font-family: 'iconfont';
		/* project id 770909 */
		src: url('//at.alicdn.com/t/font_770909_t92q8jeclj.eot');
		src: url('//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.woff') format('woff'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.ttf') format('truetype'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont') format('svg');
	}
</style>
