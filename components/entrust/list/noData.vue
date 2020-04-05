<template>
	<view class="f_c_c no_data_view">
		<view class="no_data_img"></view>
		<view v-if="caseType" @click="noDataBtn"
			class="no_data_btn global-confirm-btn">{{ caseTypeMap[caseType] ? caseTypeMap[caseType].text : "" }}</view>
	</view>
</template>

<script>
	export default {
		props: ["caseType"],

		data() {
			return {
				caseTypeMap: {
					1: { text: '我要卖房', titleText: '卖房委托', url: '/pagesEntrust/registration/registration?caseType=1' },
					2: { text: '我要出租', titleText: '出租委托', url: '/pagesEntrust/registration/registration?caseType=2' },
					3: { text: '我要买房', titleText: '买房委托', url: '/pagesEntrust/entrust/entrust?caseType=3' },
					4: { text: '我要租房', titleText: '租房委托', url: '/pagesEntrust/entrust/entrust?caseType=4' }
				}
			}
		},

		methods: {
			noDataBtn() {
				if(!this.caseTypeMap[this.caseType]) {
					uni.showToast({
						title: "暂无caseType, 无法跳转。"
					});
					return;
				}

				uni.navigateTo({
					url: this.caseTypeMap[this.caseType].url
				});
			}
		},
	}
</script>

<style scoped>
	.no_data_view{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		bottom: 0;
	}
	/* #ifdef H5 */
	.no_data_view{
		top: 88upx;
	}
	/* #endif */
	.no_data_img{
		width:246upx;
		height:296upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/personalCenter/no-entrust.png) center center no-repeat;
		background-size:100% 100%;
		margin:0 auto;
	}
	.no_data_btn{
		width:250upx;
		height:80upx;
		font-size:32upx;
		text-align:center;
		line-height:80upx;
		background:-webkit-linear-gradient(left, rgb(255,203,0) , rgb(255,148,2));
		color:#fff;
		border-radius:50upx;
		will-change: transform;
		margin: 80upx auto 0;
	}
</style>
