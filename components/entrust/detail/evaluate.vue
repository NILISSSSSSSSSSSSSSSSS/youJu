<template>
	<view class="evaluate_tc_view f_c_e" @click="closeEvaluateTc">
		<view class="evaluate_item_view">
			<view class="f_r_c evaluate_item_title">
				<view>匿名评价带看服务</view>
				<image class="evaluate_item_close" mode="aspectFill" 
					@click="closeEvaluateTc"
					src="http://cdn.haofang.net/static/uuminiapp/entrustDetail/close2.png"></image>
			</view>
			
			<view class="evaluate_item_cont" @click.stop="">
				<view class="f_r_c real_house_view">
					<view class="unreal_house_btn" :class="{ unreal_selected : defaultSelected == 1}"
						@click="changeEvaluate"></view>
					<view class="real_house_btn" :class="{ real_selected : defaultSelected == 2}"
						@click="changeEvaluate"></view>
				</view>
				
				<!-- 假房源内容 -->
				<block v-if="defaultSelected == 1">
					<!-- 假房源原因-->
					<view class="unreal_house_reason f_r_s">
						<view v-for="(text, index) in unrealReasonList"
							:key="index"
							@click="chooseUnrealReason(text,index)"
							:class="chooseReason.indexOf(index) >= 0 ? 'unreal_house_reason_active' : ''"
							class="unreal_house_reason_item">{{ text }}</view>
					</view>
					
					<!-- 假房源textarea -->
					<view class="unreal_textarea">
						<textarea placeholder="简要说明便于尽快为您处理举报（15字以上）"
						  class="house_textarea"
						  @input="houseTextareaInput($event, 'unrealTextareaVal')"
						  placeholder-class="house_textarea_pl"
						  :maxlength="textareaMaxLength"></textarea>
						<view class="house_textarea_num">{{ unrealTextareaVal.length}}/{{ textareaMaxLength }}</view>  
					</view>
					
					<!-- 假房源提交 -->
					<view @click="unrealHouseBtn" class="unreal_submit">提交</view>
				</block>
			
				<!-- 真房源内容 -->
				<block v-if="defaultSelected == 2">
					<view class="real_house_title">我们将会替您打赏获得五星好评的经纪人</view>
					
					<!-- 服务态度 -->
					<view class="f_r_s house_star_view">
						<view>服务态度</view>
						
						<view class="f_r_s attitude_star_view">
							<block v-for="(url, index) in serviceAttitudeList" :key="index">
								<image @click="chooseServiceAttitude(index)" 
									class="attitude_star_img" :src="url"></image>
							</block>
						</view>
					</view>
					
					<!-- 专业水平 -->
					<view class="f_r_s house_star_view">
						<view>专业水平</view>
						
						<view class="f_r_s attitude_star_view">
							<block v-for="(url, index) in specialLevelList" :key="index">
								<image @click="chooseSpecialLevel(index)" 
									class="attitude_star_img" :src="url"></image>
							</block>
						</view>
					</view>
					
					<!-- textarea -->
					<view class="unreal_textarea">
						<textarea placeholder="其他建议或吐槽（匿名评价，放心填写）"
						  class="house_textarea"
						  @input="houseTextareaInput($event, 'realTextareaVal')"
						  placeholder-class="house_textarea_pl"
						  :maxlength="textareaMaxLength"></textarea>
						<view class="house_textarea_num">{{ realTextareaVal.length}}/{{ textareaMaxLength }}</view>  
					</view>
				
					<!-- 底部btn -->
					<view class="real_btn_view_bottom f_r_b">
						<view @click="realHouseBtn(0)" class="real_bottom_no_want">不再考虑该房</view>
						<view @click="realHouseBtn(1)" class="real_bottom_want">保留该房源意向</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import { GetStarList } from "@/utils/common.js";
	import { WriteEvaluate } from "@/net/entrust/EntrustDetail.js";
	
	export default {
		props: {
			// 1: 假房源   2:真房源
			selected: {
				type: Number | String,
				default: 2
			},
			maxlength: {
				type: Number | String,
				default: 4
			},
			// 服务评价分数
			serviceAttitudeNum: {
				type: Number | String,
				default: 0
			},
			//专业水平
			specialLevel: {
				type: Number | String,
				default: 0
			},
			// 委托id
			entrustId: {
				type: String,
				default: ""
			},
			// 推荐房源id
			recomInfoId: {
				type: String,
				default: ""
			}
		},
		
		watch: {
			selected(newValue, oldValue) {
				this.initData();
			},
			serviceAttitudeNum() {
				this.initData();
			},
			specialLevel() {
				this.initData();
			}
		},
		
		mounted() {
			this.initData();
		},
		
		data() {
			return {
				defaultSelected: 2,
				defaultAttitudeNum: 0,  // 服务评价分数
				defaultLevel: 0,  // 专业水平分数
				unrealReasonList: ["房源不存在", "房源已出租", "图片不真实", "价格不真实"],
				chooseReason: [],  // 选择的原因
				unrealTextareaVal: "",  // 假房源textarea值
				realTextareaVal: "",  // 真房源textarea值
				textareaMaxLength: 100,
				serviceAttitudeList: [],  // 服务评价
				specialLevelList: [],  // 专业水平
			}
		},
		
		methods: {
			// 初始化数据
			initData() {
				this.defaultSelected = this.selected;
				this.defaultAttitudeNum = this.serviceAttitudeNum;
				this.defaultLevel = this.specialLevel;
				this.initServiceAttitudeList();
				this.initSpecialLevelList();
			},
			
			// 初始化服务评价分数
			initServiceAttitudeList() {
				this.serviceAttitudeList = new GetStarList(this.defaultAttitudeNum, 
					"../../", 5, 0).getList();
			},
			
			// 初始化专业水平分数
			initSpecialLevelList() {
				this.specialLevelList = new GetStarList(this.defaultLevel, 
					"../../", 5, 0).getList();
			},
			
			// 切换状态
			changeEvaluate() {
				this.defaultSelected = (this.defaultSelected == 1 ? 2 : 1);
			},
			
			// 选择原因
			chooseUnrealReason(text, i) {
				let index = (this.chooseReason).findIndex((info) => {
					return info == i;
				});
				do{
					if(index >= 0) {
						this.chooseReason.splice(index, 1);
						break;
					}
					
					if(this.chooseReason.length >= this.maxlength) {
						this.chooseReason.shift();
						this.chooseReason.push(i);
						break;
					}
					
					this.chooseReason.push(i);
				}while(false);
			},
		
			// textarea
			houseTextareaInput(e, key) {
				if(this[key] != undefined) {
					this[key] = e && e.detail ? e.detail.value || "" : "";
				}
			},
			
			// 改变服务评价分数
			chooseServiceAttitude(index) {
				this.defaultAttitudeNum = index + 1;
				this.initServiceAttitudeList();
			},
			
			// 改变专业水平分数
			chooseSpecialLevel(index) {
				this.defaultLevel = index + 1;
				this.initSpecialLevelList();
			},
			
			// 关闭
			closeEvaluateTc() {
				this.$emit("onEvaluateChanged", false);
			},
			
			// 真房源btn
			realHouseBtn(isLike) {
				if(this.defaultAttitudeNum < 1) {
					uni.showToast({
						icon: "none",
						title: "请给经纪人服务态度评分"
					});
					return;
				}
				
				if(this.defaultLevel < 1) {
					uni.showToast({
						icon: "none",
						title: "请给经纪人专业水平评分"
					});
					return;
				}
				
				let request = {
					pushLogId: this.entrustId,
					realHouse: 1,
					evaContent: this.realTextareaVal,
					evaTagIndex: "",
					recomInfoId: this.recomInfoId,
					seeStar: this.defaultAttitudeNum,
					levStar: this.defaultLevel,
					isLike: isLike
				};
				this.writeEvaluateApi(request);
			},
			// 假房源btn
			unrealHouseBtn() {
				if(!this.unrealTextareaVal) {
					uni.showToast({
						title: '请填写评论指出经纪人的不足吧',
						icon: 'none',
					});
					return;
				}
				
				if(this.unrealTextareaVal.length < 15) {
					uni.showToast({
						title: '请至少输入15个字',
						icon: 'none',
					});
					return;
				}
				
				let request = {
					pushLogId: this.entrustId,
					realHouse: 0,
					evaContent: this.unrealTextareaVal,
					evaTagIndex: this.chooseReason.join(","),
					recomInfoId: this.recomInfoId,
					seeStar: 0,
					levStar: 0,
					isLike: ""
				};
				this.writeEvaluateApi(request);
			},
			writeEvaluateApi(request = {}) {
				return new WriteEvaluate(request).send()
					.then(res => {
						if(res.STATUS != 1) {
							uni.showToast({
								title: res.INFO || "提交失败",
								icon: 'none',
							});
							return;
						}
						
						uni.showToast({
							title: '操作成功',
							icon: 'success',
						});
						this.closeEvaluateTc();
						this.$emit("onEvaluateFinishChanged", "finish");
					})
					.catch(err => {
						uni.showToast({
							title: "提交失败",
							icon: 'none',
						});
					});
			}
		},
	}
</script>

<style scoped>
	.evaluate_tc_view{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	.evaluate_item_view{
		background: #FFFFFF;
	}
	.evaluate_item_title{
		position:relative;
		text-align:center;
		font-size:36upx;
		color:#000;
		height:128upx;
		line-height:128upx;
		border-bottom:1upx solid #ddd;
	}
	.evaluate_item_close{
		position:absolute;
		top:50%;
		margin-top: -13upx;
		right:30upx;
		width: 26upx;
		height: 26upx;
		font-weight: 400;
	}
	.unreal_house_btn{
		width:156upx;
		height:64upx;
		margin-right: 36upx;
		background-size:100%;
		background-repeat:no-repeat;
		background-position:center center;
		background-image: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/ic_unselect_fake_source.png);
	}
	.real_house_btn{
		width:156upx;
		height:64upx;
		background-size:100%;
		background-repeat:no-repeat;
		background-position:center center;
		background-image: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/ic_unselect_real_source.png);
	}
	.real_house_view .unreal_selected{
		background-image: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/ic_select_fake_source.png);
	}
	.real_house_view .real_selected{
		background-image: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/ic_select_real_source.png);
	}
	.evaluate_item_cont{
		padding: 66upx 70upx 0;
		box-sizing: border-box;
	}

	/* 假房源原因 */
	.unreal_house_reason{
		margin:40upx auto 70upx;
		flex-wrap:wrap;
	}
	.unreal_house_reason_item{
		width: 47%;
		height:60upx;
		line-height:60upx;
		font-size:26upx;
		text-align:center;
		border:1upx solid #ddd;
		border-radius:4upx;
		color:#999;
		position:relative;
		box-sizing:border-box;
		margin-right: 6%;
		margin-bottom: 26upx;
	}
	.unreal_house_reason .unreal_house_reason_item:nth-child(2n) {
		margin-right: 0;
	}
	.unreal_house_reason .unreal_house_reason_active{
		border:1upx solid #333;
		color:#333;
		background-color:#f6f6f6;
	}
	
	/* textarea */
	.unreal_textarea{
		position:relative;
		width: 100%;
		height:166upx;
		overflow:hidden;
		margin:0 auto 38upx
	}
	.house_textarea{
		background-color:#f1f1f1;
		width:100%;
		height:100%;
		font-size:28upx;
		border-radius:8upx;
		padding:15upx 20upx;
		box-sizing:border-box;
		color:#000;
	}
	.house_textarea_num{
		font-size:26upx;
		position:absolute;
		right:15upx;
		bottom:18upx;
		color:#888;
	}

	/* 假房源提交 */
	.unreal_submit{
		width: 100%;
		height:70upx;
		line-height:70upx;
		font-size:30upx;
		border-radius:8upx;
		text-align:center;
		color:white;
		background:orangered;
		margin:0 auto 60upx;
	}

	/* 真房源title */
	.real_house_title{
		text-align:center;
		font-size:26upx;
		color:#333;
		width: 100%;
		margin: 50upx auto 65upx;
		line-height:40upx;
	}
	.attitude_star_img{
		width: 50upx;
		height: 50upx;
		margin: auto 10upx auto 0;
	}
	.house_star_view{
		width: 100%;
		margin:0 auto;
		margin-bottom:35upx;
		color:#999;
		font-size:33upx;
		height:50upx;
		line-height:50upx;
		box-sizing: border-box;
	}
	.attitude_star_view{
		padding-left: 20upx;
		box-sizing: border-box;
		margin: auto 0;
	}

	/* 真房源底部btn */
	.real_btn_view_bottom{
		height:160upx;
		overflow:hidden;
		margin:0 auto;
	}
	.real_btn_view_bottom view{
		position:relative;
		width:45%;
		height:70rpx;
		line-height:70rpx;
		font-size:30rpx;
		border-radius:8rpx;
		text-align:center;
	}
	.real_bottom_no_want{
		background:#fcad08;
	}
	.real_bottom_want{
		background:orangered;
		color:white;
	}
</style>
