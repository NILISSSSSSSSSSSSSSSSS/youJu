<template>
	<view class="finish_evaluate_view">
		<view class="see-evaluate-header">
			<view class="see-evaluate-tt">匿名评价服务</view>
			<view class="see-evaluate-close" @click="completeEvaClose"></view>
		</view>

		<view class="finish_evaluate_title">线上佣金（中介费）实际支付:</view>
		<view class="finish_evaluate_money">￥{{ payMoney }}</view>
		<view class="finish_evaluate_find_house">恭喜您找到好房，祝您新居生活幸福！</view>

		<view class="server-evaluate-result"><text>本次服务评价：</text></view>
		<view class="f_r_c finish_evaluate_star_view">
			<block v-for="(url, index) in noFinishServiceStarList" :key="index">
				<image @click="noFinishStarBtn(index)" class="finish_evaluate_star"
					:src="url"></image>
			</block>
		</view>

		<!-- 原因 -->
		<view class="no_finish_reason_view f_r_s">
			<block v-for="(text, index) in (noMeetReasonMap[serviceStarVal] || [])" :key="index">
				<view :class="noMeetReasonSelectedMap[serviceStarVal] && ((noMeetReasonSelectedMap[serviceStarVal][0] && noMeetReasonSelectedMap[serviceStarVal][0] == index) || (noMeetReasonSelectedMap[serviceStarVal][1] && noMeetReasonSelectedMap[serviceStarVal][1] == index) || (noMeetReasonSelectedMap[serviceStarVal][2] && noMeetReasonSelectedMap[serviceStarVal][2] == index) || (noMeetReasonSelectedMap[serviceStarVal][3] && noMeetReasonSelectedMap[serviceStarVal][3] == index) || (noMeetReasonSelectedMap[serviceStarVal][4] && noMeetReasonSelectedMap[serviceStarVal][4] == index) || (noMeetReasonSelectedMap[serviceStarVal][5] && noMeetReasonSelectedMap[serviceStarVal][5] == index) || (noMeetReasonSelectedMap[serviceStarVal][6] && noMeetReasonSelectedMap[serviceStarVal][6] == index) || (noMeetReasonSelectedMap[serviceStarVal][7] && noMeetReasonSelectedMap[serviceStarVal][7] == index)) ? 'no_finish_reason_item_active' : ''"
					@click="noMeetReasonChoose(index)"
					class="no_finish_reason_item">{{ text }}</view>
			</block>
		</view>

		<view class="no_finish_remark" v-if="serviceStarVal <= 3">
			<textarea
				placeholder="其他原因可在此对经纪人匿名反馈，帮助我们提高质量。"
				@input="completeEvaContentInput"
				class="no_finish_textarea"
				placeholder-class="no_finish_textarea_pl"
				maxlength="100"></textarea>
			<view class="no_finish_textarea_num">{{completeEvaContent.length}}/100字</view>
		</view>

		<view class="no_finish_confirm_btn" @click='submitCompleteEvaData'>提交匿名评价</view>

		<view class="no_finish_bottom_view"></view>
	</view>
</template>

<script>
	import { PaySuccessWriteServiceEvaluate } from "@/net/entrust/EntrustDetail.js";
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import { GetStarList } from "@/utils/common.js";

	export default {
		data() {
			return {
				finishServiceStarList: [],  // 已评价的星数组
				noFinishServiceStarList: [],  // 未评价的星数
				serviceStarVal: 4,  // 未评价星
				noMeetReasonMap: {
					1: ["讲解很不清晰", "专业知识不强", "反馈不及时", "服务态度不好"],
					2: ["讲解一般", "专业度不高", "反馈一般", "服务态度一般"],
					3: ["讲解有待提升", "专业度有待提升", "反馈一般", "服务态度一般"]
				},  // 不满意的原因
				noMeetReasonSelectedMap: {
					1: [],
					2: [],
					3: [],
					4: [],
					5: []
				},
				completeEvaContent: "",  // 未评价输入原因
			}
		},

		props: {
			// 委托id
			entrustId: {
				type: String,
				default: ""
			},
			// 经纪人id
			archiveId: {
				type: String,
				default: ""
			},
			// 城市id
			cityId: {
				type: String,
				default: ""
			},
			// 服务初始化评分
			evaStar: {
				type: String | Number,
				default: 4
			},
			// 支付的佣金
			payMoney: {
				type: String | Number,
				default: ""
			}
		},

		watch: {
			evaStar(newValue, oldValue) {
				this.serviceStarVal = this.evaStar;
				this.initNoFinishStarList();
			}
		},

		mounted() {
			this.serviceStarVal = this.evaStar;
			this.initNoFinishStarList();
		},

		methods: {
			// 关闭
			completeEvaClose() {
				this.$emit("onServiceCloseChanged", false);
			},

			// 支付后未评价
			initNoFinishStarList() {
				this.noFinishServiceStarList = new GetStarList(this.serviceStarVal,
					"../../", 5, 0).getList(true,
						"https://zdzfapi.haofang.net/Public/wxApp/images/entrustDetail/ic_star_yellow.png",
						"https://zdzfapi.haofang.net/Public/wxApp/images/entrustDetail/ic_star_gray.png");
			},

			// 未评价星点击事件
			noFinishStarBtn(index) {
				this.serviceStarVal = index + 1;
				this.initNoFinishStarList();
			},
			// 选择原因
			noMeetReasonChoose(i) {
				let selected = this.noMeetReasonSelectedMap[this.serviceStarVal];
				let index = (selected).findIndex((info) => {
					return info == i;
				});
				do{
					if(index >= 0) {
						selected.splice(index, 1);
						break;
					}

					if(selected.length >= 5) {
						selected.shift();
						selected.push(i);
						break;
					}

					selected.push(i);
				}while(false);
				this.noMeetReasonSelectedMap[this.serviceStarVal] = selected;
			},
			// 输入原因
			completeEvaContentInput(e) {
				this.completeEvaContent = e && e.detail ? e.detail.value || "" : "";
			},
			// 匿名提交
			submitCompleteEvaData() {
				let me = new UserInfoModel().getModel("me") || {};
				let reasonSelected = this.noMeetReasonSelectedMap[this.serviceStarVal] || [];
				if(this.serviceStarVal < 4 && reasonSelected.length == 0
					&& this.completeEvaContent.length == 0) {
					uni.showToast({
						icon: "none",
						title: "请选择标签或填写评论指出经纪人的不足吧"
					});
					return;
				}

				let request = {
					pushLogId: this.entrustId,
					userId: me.userId || "",
					archiveId: this.archiveId,
					cityId: this.cityId,
					evaContent: this.completeEvaContent,
					evaTagIndex: reasonSelected.join(","),
					evaStar: this.serviceStarVal
				};
				new PaySuccessWriteServiceEvaluate(request).send()
					.then(res => {
						if(res.STATUS != 1) {
							uni.showToast({
								icon: "none",
								title: "提交失败"
							});
							return;
						}

						uni.showToast({
							title: "操作成功",
							icon: "success"
						});
						this.$emit("onFinishServiceChanged", true);
					})
					.catch((err) => {
						uni.showToast({
							icon: "none",
							title: "提交失败"
						});
					});
			},
		},
	}
</script>

<style scoped>
	.see-evaluate-header{
		position: relative;
		text-align: center;
		font-size: 36upx;
		color: #000;
		height: 80upx;
		line-height: 80upx;
		border-bottom: 1upx solid #ddd;
		margin-bottom: 20upx;
	}
	.see-evaluate-tt{
		font-weight: 400;
	}
	.see-evaluate-close{
		position: absolute;
		width: 80upx;
		height: 80upx;
		top: 0;
		right: 0;
		background: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/close2.png) center center no-repeat;
		background-size: 26upx 26upx;
	}
	.finish_evaluate_view{
		background:#fff;
		width:100%;
		box-sizing:border-box;
		padding: 0 50upx 50upx;
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		z-index: 600;
		overflow-y: auto;
	}
	/* #ifdef H5 */
	.finish_evaluate_view{
		top: 88upx;
	}
	/* #endif */
	.finish_evaluate_title{
		font-size:32upx;
		color:#999;
		margin-bottom:75upx;
		text-align: left;
	}
	.finish_evaluate_money{
		font-weight:bold;
		font-size:50upx;
		text-align:center;
		margin:0 auto 54upx;
		color: #101D36;
	}
	.finish_evaluate_find_house{
		font-size:32upx;
		margin:0 auto 60upx;
		text-align:center;
		color:#000;
	}
	.no_finish_reason_view{
		width: 100%;
		margin:40upx auto 44upx;
		flex-wrap:wrap;
		padding: 0 70upx;
		box-sizing: border-box;
	}
	.no_finish_reason_item{
		width: 47%;
		height:60upx;
		line-height:60upx;
		font-size:26upx;
		box-sizing:border-box;
		text-align:center;
		border:1upx solid #ddd;
		border-radius:4upx;
		will-change: transform;
		color:#999;
		position:relative;
		box-sizing:border-box;
		margin-right: 6%;
		margin-bottom:26upx;
	}
	.no_finish_reason_view .no_finish_reason_item:nth-child(2n){
		margin-right: 0;
	}
	.no_finish_reason_view .no_finish_reason_item_active{
		border:1upx solid #333;
		color:#333;
		background-color:#f6f6f6;
	}
	.no_finish_remark{
		position:relative;
		width: 100%;
		height:126upx;
		overflow:hidden;
		margin:0 auto 38upx
	}
	.no_finish_textarea{
		background-color:#f1f1f1;
		width:100%;
		height:100%;
		font-size:28upx;
		border-radius:8upx;
		padding:15upx 20upx;
		will-change: transform;
		box-sizing:border-box;
		color:#000;
	}
	.no_finish_textarea_num{
		font-size:26upx;
		position:absolute;
		right:15upx;
		bottom:18upx;
		color:#888;
	}
	.no_finish_textarea_pl{
		font-size: 28upx;
		color: #888;
		background-color: #f1f1f1;
	}
	.no_finish_confirm_btn{
		height:94upx;
		line-height:94upx;
		border-radius:8upx;
		will-change: transform;
		text-align:center;
		color:#fff;
		font-size:32upx;
		background: -webkit-linear-gradient(left, rgb(255,111,46) , rgb(254,142,13));
		letter-spacing:1upx;
		margin-top:26upx;
	}
	.no_finish_bottom_view{
		height: 80upx;
		width: 100%;
	}
	.server-evaluate-result{
		font-size: 30upx;
		padding: 30upx 0;
		color: #888;
	}
	.server-evaluate-result text{
		text-align: left;
		display: inline;
	}
	.server-evaluate-result text:last-child{
		font-size: 28upx;
	}
	.finish_evaluate_star_view{
		height:86upx;
		margin:0 auto;
		margin-bottom:20upx;
		margin-top:20upx;
	}
	.finish_evaluate_star{
		width:86upx;
		height:86upx;
		flex-shrink: 0;
		margin: auto 16upx auto 0;
	}
	.finish_evaluate_star_view .finish_evaluate_star:last-child{
		margin-right: 0;
	}
</style>
