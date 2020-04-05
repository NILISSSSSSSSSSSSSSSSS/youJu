<template>
	<view class="push_msg_view">
		<view @click="finishEntrust" class="finish_push">完成</view>

		<!--圆形进度-->
		<view class="circl_progress">
            <view class="agent_num_view">
				<view class="agent_num_val"><text class="agent_num">{{ agentNum }}</text>位</view>
				<view class="agent_num_text">经纪人</view>
            </view>

			<view class="circle_dot" :animation="progressAnimation"></view>
		</view>

		<!--等待经纪人接单-->
		<view class="wait_title_view f_r_c">
			<view class="wait_title_line"></view>
			<view class="wait_title_text">等待经纪人接单</view>
			<view class="wait_title_line"></view>
		</view>

		<!-- 经纪人box -->
		<view class="agent_list_view f_r_b">
			<block v-for="(arr, agentIndex) in agentList" :key="agentIndex">
				<swiper class='swiper-wrap-box'
				    :indicator-dots="false" :autoplay="autoplayArr[agentIndex + 1]['autoplay']"
				    :interval="500" :circular="true"
				    :duration="100" :vertical="true">
					<swiper-item class="sw-sli" v-if="autoplayArr[agentIndex + 1]['agentPicStatus']">
						<image :src="autoplayArr[agentIndex + 1]['url']" class="agent-image" mode="widthFix"/>
					</swiper-item>

					<block v-for="(item, index) in arr" :key="index"
						v-if="autoplayArr[agentIndex + 1]['autoplay']">
						<swiper-item class="sw-sli">
							<image :src="'http://cdn.haofang.net/static/uuminiapp/enstrutHead/' + item + '.png'"
								class="agent-image"
								mode="widthFix"/>
						</swiper-item>
					</block>
				</swiper>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agentNum: 0,  // 推送的经纪人数量
				progressInterval: null,
				progressAnimation: {},  // 进度动画
				agentNumInterval: null,
				//经纪人推送接单情况
				autoplayArr:{
					1: {autoplay: true, url: "", agentPicStatus: false},
					2: {autoplay: true, url: "", agentPicStatus: false},
					3: {autoplay: true, url: "", agentPicStatus: false},
					4: {autoplay: true, url: "", agentPicStatus: false},
					5: {autoplay: true, url: "", agentPicStatus: false},
				},
				agentList: [],  // 经纪人列表
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad() {
			this.initProgressAnimate();
			this.agentNumPush();
			this.createAgentList();
		},

		onUnload() {
			this.clearProgressAnimate();
			this.clearAgentPush();
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		methods: {
			// 初始化动画
			initProgressAnimate() {
				// #ifdef MP
				let dotAnData = uni.createAnimation({duration: 1400,});
				let i = 0;
				this.progressInterval = setInterval(() => {
					if(!this.progressInterval) return;

					dotAnData.rotate(20 * (++i)).step();
					this.progressAnimation = dotAnData.export();
				}, 1000);
				// #endif
			},
			// 清除动画
			clearProgressAnimate() {
				if(this.progressInterval) {
					clearInterval(this.progressInterval);
				}
				this.progressInterval = null;
			},

			// 经纪人数量推送
			agentNumPush() {
				let agentNum = 0;
				this.agentNumInterval = setInterval(() => {
					agentNum++;
					this.agentNum = agentNum;
				}, 500);
			},
			// 清除经纪人推送
			clearAgentPush() {
				if(this.agentNumInterval) {
					clearInterval(this.agentNumInterval);
				}
				this.agentNumInterval = null;
			},

			// 随机产生经纪人列表
			createAgentList() {
				let arr = [];
				for (let i = 1; i <= 50; i++) {
				  arr.push(i);
				}
				let agentLsit = [];
				while (agentLsit.length < 50) {
					let n = Math.floor(Math.random() * arr.length);
					agentLsit.push(arr.splice(n, 1)[0]);
				}
				/*定义五列经纪人头像数组*/
				let agentOneList = agentLsit.slice(0, 10).concat(agentLsit.slice(0, 1)),
					agentTwoList = agentLsit.slice(10, 20).concat(agentLsit.slice(10, 11)),
					agentThreeList = agentLsit.slice(20, 30).concat(agentLsit.slice(20, 21)),
					agentFourList = agentLsit.slice(30, 40).concat(agentLsit.slice(30, 31)),
					agentFiveList = agentLsit.slice(40, 50).concat(agentLsit.slice(40, 41));
				let agentList = [];
				agentList.push(agentOneList);
				agentList.push(agentTwoList);
				agentList.push(agentThreeList);
				agentList.push(agentFourList);
				agentList.push(agentFiveList);
				this.agentList = agentList;
			},

			// 完成委托
			finishEntrust() {
				uni.navigateBack({
					delta: 1
				});
			},
		},

	}
</script>

<style>
	::-webkit-scrollbar{width:0px;height: 0}
	.push_msg_view{
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		overflow: hidden;
	}
	.finish_push{
		position:absolute;
		top:20upx;
		right:20upx;
		font-size:32upx;
	}
	/* 进度 */
	.circl_progress{
		position:relative;
		width:300upx;
		height:300upx;
		margin:60upx auto;
	}
	.agent_num_view{
		position:absolute;
		top:80upx;
		margin:auto;
		width:100%;
		text-align:center;
	}
	.agent_num_val{
		font-size:20upx;
		color:#4daaf0;
	}
	.agent_num{
		font-size:60upx;
	}
	.circle_dot{
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
		top: 0;
		background: url(http://cdn.haofang.net/static/uuminiapp/new_images/agent_gif.png) center no-repeat;
		background-size: 100% 100%;
		width: 300upx;
		height:300upx;
		animation: circleRotate 14s infinite;
		transition-timing-function: linear;
	}
	@keyframes circleRotate {
		from {
            transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* 等待经纪人 */
	.wait_title_view{
		align-items:center;
		position:relative;
		left:0;
		right:0;
		margin:auto;
		height:40upx;
		margin-bottom:40upx;
		margin-top:40upx;
	}
	.wait_title_line{
		position:relative;
		width:20%;
		height:100%;
	}
	.wait_title_line::after{
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
		bottom: 50%;
		z-index: 15;
		display: block;
		height: 1px;
		width: 100%;
		background-color: #e4e4e4;
	}
	.wait_title_text{
		width:38%;
		height:100%;
		line-height:40upx;
		text-align:center;
		font-size:32upx;
		color:#808080;
	}
	.agent_list_view{
		width:100%;
		padding:0 50upx;
		box-sizing:border-box;
		margin-bottom:40upx;
	}
	.swiper-wrap-box{
		position: relative;
		z-index: 5;
		width: 110upx;
		height: 110upx;
		border: 1px solid #e1e1e1;
		border-radius: 100%;
		will-change: transform;
		overflow: hiden;
	}
	.sw-sli{
		width: 110upx;
		height: 110upx;
		border-radius: 100%;
		will-change: transform;
		overflow: hiden;
	}
	.agent-image{
		position: relative;
		width: 110upx;
		height: 110upx;
		z-index: -5;
	}
</style>
