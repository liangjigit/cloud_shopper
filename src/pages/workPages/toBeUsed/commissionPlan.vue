
<template>
	<div id="commissionPlan">
		<header>
			<div class="header_box">
				<h2 class="title">温馨提示</h2>
				<h3>亲，您的佣金由以下组成：</h3>
				<p>1.发展会员佣金：归属于您的客户生成订单产生的佣金。</p>
				<p>2.推广商品佣金：通过链接或图片二维码生成订单产生的佣金。</p>
				<p>3.发货提成佣金：通过由您抢单并发货产生的佣金。</p>
			</div>
			<div class="commissionTitle">提佣方案</div>
			<div class="commissionSearch">
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
					<div class="mask" v-show="optionShow||optionSecondShow" ref="maskHeight"  @click="optionShow=false,optionSecondShow=false">
						<ul class="optionList" v-show="optionShow" @click="optionShow=false">
							<li class="option" :key="index" v-for="(item,index) in optionList" :tapindex='index' @click="send($event,index)">{{ item.optionText }}</li>
						</ul>
						<ul class="optionListTwo" v-show="optionSecondShow" @click="optionSecondShow=false">
							<li class="option" :key='index' v-for="(item,index) in optionListSecond" @click="send2($event,item.num,item.name=='全部'?'':item.name)"
							 :tag="item.num" v-if="item.name!='0.00' ">
								{{item.num==1?'￥':''}}{{ item.name!='0.00'?item.name:'' }}{{item.num==0?'%':''}}
							</li>
						</ul>
					</div>
				</div>
			</div>
			<ul class="goods_head">
				<li class="goods_left">商品</li>
				<li class="goods_right">售价</li>
				<li v-show="type!='003'" class="goods_right">发展会员</li>
				<li v-show="type!='003'" class="goods_right">推广链接</li>
				<li v-show="type=='003'" class="goods_right">发货佣金</li>
			</ul>
		</header>

		<div class="goods_box" ref="boxHeight">
			<scroll ref="pullrefresh" :pullup="areShow" @scrollToEnd="loadMore" :data="empData" :page="page" :nullDataAll="nullDataAllLeft"
			 :isDone="isLoadingLeft">
				<ul>
					<li v-for="(item,index) in mylist" :key="index">
						<ul class="goods">
							<li class="goods_left">
								<div class="avatar_box">
									<img :src=imgURL+item.picture class="avatar" />
								</div>
								<div class="goodsInfo_box">
									<span class="goodsName">{{item.goodsName}}</span>
									<span class="goodsId">{{item.goodsId}}</span>
								</div>
							</li>
							<li class="goods_right">
								<span class="goodsPrice goods_item">￥{{item.price}}</span>
							</li>
							<li class="goods_right">
								<span class="developMember goods_item">￥{{type!='003'?item.numberValue:item.consignmentValue}}</span>
							</li>
							<li class="goods_right">
								<span class="promoteLinks goods_item" v-show="type!='003'">{{item.extensionPercentageValue}}%</span>
							</li>
						</ul>
					</li>
				</ul>
			</scroll>
		</div>

	</div>
</template>

<script>
	import vueEvent from '../../../main'
	import Scroll from '../../../components/scroll'
	export default {
		name: "commissionPlan",
		components: {
			Scroll
		},
		data() {
			return {
				MEMBERID: this.GLOBAL.MEMBERID,
				imgURL: this.GLOBAL.imgURL,
				clientHeight: '',
				// 重复上拉
				isData: false,
				empData: [],
				isShow: true,
				areShow: true,

				optionShow: false,
				optionSecondShow: false,
				chooseVal: '发展会员',
				chooseVal2: '全部',

				// 提示语
				isLoadingLeft: true,
				nullDataAllLeft: false,

				//筛选条件
				page: 1,
				type: '001',
				status: '',
				percentage: '',
				//数据列表
				mylist: [],
				//一级列表
				optionList: [{
						optionText: '发展会员'
					},
					{
						optionText: '推广链接'
					},
					{
						optionText: '发货佣金'
					}
				],
				//二级列表
				optionListSecond: [{
					name: '全部',
					num: '3'
				}, ],
			}
		},
		methods: {
			//加载更多
			loadMore() {
				var that = this;
				if (!that.isData) {
					if (that.page < 0 || that.page == false) {
						return
					} else {
						that.isData = true;
						that.nullDataLight = false;
						that.page++
						//上拉加载重新初始化
						this.$refs.pullrefresh.$emit('infinitescroll.reInit');
						setTimeout(function() {
							that.getData();
						}, 1000)
					}
				}
			},
			getData() {
				var that = this;
				var listData = [];
				that.$api.get(
					'/commissionPlan', {
						guideId: this.MEMBERID,
						size: 10,
						page: that.page,
						type: that.type,
						status: that.status,
						percentage: that.percentage,
						requestName: that.page
					},
					res => {
						if (res.errcode == 0) {
							var list = res.data;
							console.log(list)
							// 数据
							that.empData = list;
							console.log(that.empData)
							listData = listData.concat(list);
							if (listData.length < 10) {
								that.mylist = that.mylist.concat(listData);
								//把page设置成false 数据已经加载完毕了 不用在加载了
								this.page = false;
								that.isLoadingLeft = false;
								//所有数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.loadedDone');
							} else {
								that.mylist = that.mylist.concat(listData);
								that.isLoadingLeft = true;
								//单次请求数据加载完毕后
								this.$refs.pullrefresh.$emit('infinitescroll.finishLoad');
							}
							if (that.empData.length == 0) {
								that.nullDataAllLeft = true;
							}else{
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
			getPoint() {
				var that = this;
				that.$api.get('/point', {
					guideId: that.MEMBERID,
					page: 1,
					size: 10,
					type: that.type,
				}, res => {
					console.log(res.data)
					that.optionListSecond = that.optionListSecond.slice(0, 1);
					console.log(that.optionListSecond)
					var resList = res.data.list;
					resList.forEach((item) => {
						that.optionListSecond.push(item)
					})
					console.log(that.optionListSecond)
				})
			},
			//获取数据
			send: function(e, index) {
				var that = this;
				//初始化提示语
				that.isLoadingLeft = true;
				console.log(that.nullDataAllLeft)
				that.nullBool = true;
				that.mylist.length = 0;
				that.page = 1;
				that.chooseVal = e.srcElement.innerHTML;
				that.chooseVal2 = '全部';
				that.status = '';
				that.percentage = '';
				//筛选
				var tapIndex = index + 1;
				that.type = '00' + tapIndex;
				that.getData();
				that.getPoint();
			},
			send2(e, tag, name) {
				var that = this;
				//初始化提示语
				that.isLoadingLeft = true;
				that.mylist.length = 0;
				that.chooseVal2 = e.srcElement.innerHTML;
				that.page = 1;
				that.status = tag;
				that.percentage = name;
				that.getData();
			},
			changeFixed(clientHeight) { //动态修改样式
				this.$refs.boxHeight.style.height = (clientHeight - $('.header_box').outerHeight(true) - $('.commissionTitle').outerHeight(
					true) - $('.commissionSearch').outerHeight(true) - $('.goods_head').outerHeight(true)) + 'px';
				this.$refs.maskHeight.style.height = (clientHeight - $('.header_box').outerHeight(true) - $('.commissionTitle').outerHeight(
					true) - $('.commissionSearch').outerHeight(true)) + 'px';
			}
		},
		mounted() {
			var that = this;
			that.getData();
			that.getPoint();
			this.clientHeight = `${document.documentElement.clientHeight}`
			window.onresize = function temp() {
				this.clientHeight = `${document.documentElement.clientHeight}`;
			};
			//在.outerHeight()计算中总是包含padding-top ,padding-bottom 和 border-top，border-bottom ；如果includeMargin参数是true，那么margin (top 和 bottom)也会被包含。
		},
		watch: {
			clientHeight: function() {
				this.changeFixed(this.clientHeight)
			}
		},
		created: function() {
			let user = localStorage.getItem('user');
			this.MEMBERID = user.replace(/\"/g, "");
		}
	}
</script>

<style lang="scss">
	@import "../../../style/scss/commissionPlan";

	@font-face {
		font-family: 'iconfont';
		/* project id 770909 */
		src: url('//at.alicdn.com/t/font_770909_t92q8jeclj.eot');
		src: url('//at.alicdn.com/t/font_770909_t92q8jeclj.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.woff') format('woff'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.ttf') format('truetype'), url('//at.alicdn.com/t/font_770909_t92q8jeclj.svg#iconfont') format('svg');
	}
</style>
