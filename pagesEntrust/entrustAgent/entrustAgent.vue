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
		
		 <!--底部砸蛋-->
		<view class='footer-box' v-if="remainShow">
			<view class='egg-box'>
				<view :class='acti==1 ?"egg-b-ed":"egg-b"' @click='smashEggs(1)'>
					<view class='hammer' v-if="cursor == 1" :animation="animation"></view>
				</view>
				<view :class='acti==2 ?"egg-b-ed":"egg-b"' @click='smashEggs(2)'>
					<view class='hammer' v-if="cursor == 2" :animation="animation"></view>
				</view>
				<view :class='acti==3 ?"egg-b-ed":"egg-b"' @click='smashEggs(3)'>
					<view :class="startZaDan ? 'hammer_active' : ''" class='hammer'
						v-if="cursor == 3" :animation="animation"></view>
				</view>
			</view>
			<view class='chance-time'>您还有<text>{{remainTimes}}次</text>机会</view>
			<view class='game-rule' @click='seeRuleBtn'>查看游戏规则></view>
		</view>
		
		
		<!-- 游戏规则弹窗 -->
		<view class='tosat-w f_c_c' @click='closeToastBtn' v-if="toastMask">
			<!--中奖与未中奖提示-->
			<view class='to-cont' @click.stop="" v-if="winnStatus">
				<view class="to-title">{{ winningTips }}</view>
				<!--现金卷-->
				<view class='cash-wrap' v-if="cashStatus">
					<view class='cash-volume'>获得<text>20</text>元悠居客租房现金券!</view>
					<view :class="cashStatusd=='sale'? 'cash-img-sale' : 'cash-img-lease'" 
						class='cash-img'><text class='c-num'><text class='c-icon'>￥</text>20</text></view>
					<view class='cash-msg'>租房现金券可用于抵扣租房佣金，可在<text>个人中心-优惠券</text>中查看您获得的全部优惠券。</view>
				</view>
				
				<!--未中奖-->
				<view class='no-winn' v-if="noWinStatus">
					<view class='no-txt'>再接再厉哦！</view>
					<view class='gameover-img'></view>
				</view>
				
				<!--没次数-->
				<view class='no-winn' v-if="noNums">
					<view class='gameover-img'></view>
				</view>
				
				<view class='btn-to' @click='closeToastBtn'>哦,朕知道了</view>
				<view class='close-icon' @click='closeToastBtn'></view>
			</view>
			
			<!--游戏规则-->
			<view class='to-cont' @click.stop="" v-if="gameRules">
				<view class="to-title game-ruless">游戏规则</view>
				<view class='ruless'>发布需求成功后，可获得3次抽奖机会。</view>
				<view class='ruless'>每次抽奖只能选择一个金蛋，砸开金蛋即完成抽奖。</view>
				<view class='ruless'>如果抽中的是悠居客现金券,则仅限于租房、买房抵扣佣金使用，不提现、不转让。</view>
				<view class='ruless'>如果抽中的是滴滴出行大礼包，则可用于滴滴出行打车时享受优惠。具体使用规则请参照滴滴出行官方说明。</view>
				<view class='ruless'>所有优惠明细请到个人中心-优惠券中查看。</view>
				<view class='ruless'>本游戏最终解释权在法律规定的范围内归成都好房通科技股份有限公司所有。</view>
				<view class='close-icon' @click='closeToastBtn'></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { GetPushAgentDetail, ZaDan } from "@/net/entrust/EntrustAgent.js";
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
	let animationVal = "";
	
	export default {
		data() {
			return {
				caseType: 1,
				caseId: "",
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
				remainTimes: "",  // 剩余金蛋数
				isFirstEnter: true,  // 是否是第一次进入
				remainShow: false,  // 是否显示砸蛋
				
				toastMask: false, // 弹窗
				winnStatus: false,  // 没次数
				cashStatus: true,  // 现金卷中奖
				noWinStatus: false,  // 未中奖
				noNums: false,  // 没次数
				gameRules: false,  // 游戏规则
				cursor: 3,   // 锤子初始
				acti: 0,  // 砸蛋初始
				animation: '', // 砸蛋动画
				startZaDan: false
			}
		},
		
		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},
		
		onLoad(params) {
			this.initParams(params);
			this.initAgentInfo();
		},
		
		onUnload() {
			this.clearProgressAnimate();
			this.clearAgentPush();
		},
		
		onReady() {
			// #ifdef MP
			animationVal = uni.createAnimation({
				duration: 1000,
				delay: 30,
				transformOrigin: 'right bottom 0',
			});
			// #endif
		},
        
        onShow() {
            new this.SetMetaInfo().initDefault();
        },
		
		methods: {
			// 初始化参数
			initParams(params) {
				if(params.caseType) {
					this.caseType = params.caseType;
				}
				if(params.caseId) {
					this.caseId = params.caseId;
				}
			},
			
			// 初始化经纪人信息
			initAgentInfo() {
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				if(!me.userId || !cityInfo.cityId) return Promise.reject("暂无id");
				
				return new GetPushAgentDetail({
					cityId: cityInfo.cityId,
					caseId: this.caseId,
					wxId: me.userId,
					caseType: this.caseType,
				}).send()
					.then(res => {
						let data = res.DATA || {};
						let list = data.list || [];
						this.remainTimes = data.remainTimes || 0;
						this.agentNumPush();
						if(list.length > 0) {
							list.forEach(function (item, index) {
								this.stopAgentPic(index + 1, item.userPhoto);
							});
						}
						if(!this.isFirstEnter && this.remainTimes <= 0) {
							this.remainShow = false;
						}else{
							this.remainShow = true;
						}
						this.createAgentList();
						this.initProgressAnimate();
					});
			},
			
			// 初始化动画
			initProgressAnimate() {
				// #ifdef MP
				let i = 0;
				let dotAnData = uni.createAnimation({duration: 1400,});
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
				uni.redirectTo({
					url: "/pagesEntrust/trustList/trustList?caseType=" + this.caseType
				});
			},
		
			// 接单经纪人显示
			stopAgentPic(index, url) {
				let autoplayArr = this.autoplayArr;
				autoplayArr[index]['autoplay'] = false;
				autoplayArr[index]['agentPicStatus'] = true;
				autoplayArr[index]['url'] = url;
				this.autoplayArr = autoplayArr;
			},
		
			// 查看游戏规则
			seeRuleBtn() {
				this.toastMask = true;
				this.gameRules = true;
				this.winnStatus = false;
			},
			// 关闭弹窗
			closeToastBtn() {
				this.toastMask = false;
			},
			// 砸蛋
			smashEggs(index) {
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				if(!me.userId || !cityInfo.cityId) return Promise.reject("暂无id");
				
				this.startZaDan = true;
				setTimeout(() => {
					this.startZaDan = false;
				}, 1000);
				// #ifdef MP
				animationVal.rotate(-20).step();
				this.animation = animationVal.export();
				// #endif

				if(this.remainTimes <= 0 || !this.remainTimes) {
					setTimeout(() => {
						this.winningTips = "您的抽奖次数已用完！";
						this.toastMask = true;
						this.noNums = true;
						this.winnStatus = true;
						this.gameRules = false;
						this.cashStatus = false;
						this.noWinStatus = false;
					}, 300);
					return;
				}
				
				new ZaDan({
					cityId: cityInfo.cityId,
					caseId: this.caseId,
					wxId: me.userId,
					caseType: this.caseType,
				}).send()
					.then(res => {
						if(res.STATUS != 1) {
							uni.showToast({
								icon: "none",
								title: "砸金蛋失败啦！"
							});
							return;
						}

						this.acti = index;
						this.cursor = index;
						let data = res.DATA || {};
						this.remainTimes = data.remainTimes || 0;
						if(data.type == 4) {
							this.winningTips = "很遗憾，您未砸中奖品！";
							this.noWinStatus = true;
							this.toastMask = true;
							this.noNums = false;
							this.winnStatus = true;
							this.gameRules = false;
							this.cashStatus = false;
							return;
						}
						
						if(data.type == 3) {
							this.cashStatusd = (this.caseType == 3 ? "sale" : "lease");
							this.winningTips = "哇，恭喜您获得";
							this.toastMask = true;
							this.winnStatus = true;
							this.gameRules = false;
							return;
						}
						
						if(data.msg) {
							uni.showToast({
								icon: "none",
								title: data.msg
							});
						}
					})
					.catch(err => {
						uni.showToast({
							icon: "none",
							title: "砸金蛋失败啦！"
						});
					});
			},
		},
	}
</script>

<style>
	page{
		height: 100%;
	}
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
		overflow: hiden;
	}
	.sw-sli{
		width: 110upx;
		height: 110upx;
		border-radius: 100%;
		overflow: hiden;
	}
	.agent-image{
		position: relative;
		width: 110upx;
		height: 110upx;
		z-index: -5;
	}
	
	/* 砸蛋 */
	.footer-box{
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 460upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/g_fbwt.png) no-repeat center center;
		background-size: 100% auto;
	}
	.hammer{
		position: absolute;
		top: -80upx;
		right: -80upx;
		width: 144upx;
		height: 144upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/img_hammer.png) no-repeat center;
		background-size: 100% 100%;
		z-index: 100;
	}
	.egg-box{
		position: absolute;
		bottom: 120upx;
		width: 100%;
		display: -webkit-flex;
		justify-content: center;
	}
	.egg-b{
		position: relative;
		width: 152upx;
		height: 208upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/g_egg.png) no-repeat center;
		background-size: 100%;
		margin-left: 30upx;
	}
	.egg-b-ed{
		position: relative;
		width: 177upx;
		height: 208upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/g_brokenEgg.png) no-repeat center bottom;
		background-size: 100%;
		margin-left: 30upx;
	}
	.chance-time{
		position: absolute;
		bottom: 80upx;
		width: 100%;
		text-align: center;
		font-size: 28upx;
		font-weight: bold;
		color: #fff;
	}
	.chance-time text{
		color: #ffe142;
	}
	.game-rule{
		position: absolute;
		bottom: 10upx;
		width: 100%;
		text-align: center;
		font-size: 28upx;
		color: #fa594f;
	}

	/*弹框*/
	.tosat-w{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 500;
		background: rgba(0,0,0,.5);
	}
	.to-cont{
		margin: auto;
		width: 85%;
		background: #ffffff;
		border-radius: 10upx;
		text-align: center;
		padding: 40upx 0; 
		z-index: 505;
		position: relative;
	}
	.to-title{
		position: relative;
		text-align: center;
		font-size: 36upx;
		font-weight: bold;
		color: #fa594f;
		min-height: 42upx;
	}
	.gameover-img{
		width: 288upx;
		height: 288upx;
		margin: 20upx auto;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/f_over.png) no-repeat center;
		background-size: 100%;
	}
	/*现金卷*/
	.cash-volume{
		font-size: 28upx;
		color: #686868;
		width: 100%;
		text-align: center;
		font-weight: bold;
		line-height: 60upx;
	}
	.cash-volume text{
		color: #fa594f;
	}
	.cash-img{
		width: 378upx;
		height: 274upx;
		position: relative;
		margin: 20upx auto;
	}
	.cash-img-sale{
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/coupon_sale.png) no-repeat center;
		background-size: 100%;
	}
	.cash-img-lease{
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/coupon_lease.png) no-repeat center;
		background-size: 100%;
	}
	.cash-img .c-num{
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
		top: 40upx;
		display: inline-block;
		text-align: center;
		width: 100%;
		color: #fff;
		font-size: 60upx;
	}
	.cash-img .c-num .c-icon{
		font-size: 32upx;
	}
	.cash-msg{
		font-size: 24upx;
		color: #686868;
		width: 100%;
		text-align: left;
		margin: 60upx auto;
		padding:0 30upx;
		box-sizing: border-box;
	}
	.cash-msg text{
		color: #fa594f;
	}
	.no-txt{
		width: 100%;
		font-size: 32upx;
		text-align: center;
		line-height: 60upx;
	}
	.btn-to{
		width: 80%;
		margin: 0 auto;
		height: 90upx;
		line-height:90upx;
		color: #fff;
		font-size:36upx;
		text-align: center;
		background: #fa594f;
	}
	.close-icon{
		width: 60upx;
		height: 60upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/g_close.png) center;
		background-size: cover;
		position: absolute;
		right: -20upx;
		top: -24upx;
	}
	.game-ruless{
		margin-bottom: 40upx;
	}
	.game-ruless::before{
		content: '';
		display: inline-block;
		width: 30upx;
		height: 30upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/g_border.png) no-repeat top left;
		background-size: cover;
		position: absolute;
		top: -10upx;
		left: 35%;
	} 
	.game-ruless::after{
		content: '';
		display: inline-block;
		width: 30upx;
		height: 30upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/enstrutHead/g_borderB.png) no-repeat top left;
		background-size: cover;
		position: absolute;
		top: 30upx;
		left: 60%;
	}
	.ruless{
		padding: 0 40upx;
		box-sizing: border-box;
		position: relative;
		font-size: 24upx;
		color: #fa594f;
		line-height: 40upx;
		margin-bottom: 10px;
		text-align: left;
	}
	.ruless::before{
		content: '';
		display: inline-block;
		width: 8upx;
		height: 8upx;
		border-radius: 8upx;
		background-color: #fa594f;
		margin-right: 30upx;
		position: absolute;
		top: 16upx;
		left:20upx;
	}
	.hammer_active{
		animation: zaDanAnimate 1s;
		transform-origin: right bottom 0;
	}
	@keyframes zaDanAnimate{
		from {transform: rotate(0);}
		to {transform: rotate(-20deg);}
	}
</style>
