<template>
	<form report-submit @submit="formSubmit">
		<view class="near_info_view">
			<view class="near_info" :class="{ near_info_hidden : !isLookMore }">{{ item.text }}</view>

			<button v-if="isShowLookBtn" form-type="submit" hover-class="none"
					@click="lookMore" class="more_btn f_r_c">
				<image :class="{ lookMoreActive : isLookMore }"
					mode="aspectFill"
					src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/filter_btn_nomal.png"></image>
			</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				isLookMore: true,
				isShowLookBtn: false
			}
		},

		props: {
			item: {
				type: Object,
				default: {}
			},
		},

		watch: {
			item(newValue, oldValue) {
				this.initBtnShow();
			}
		},

		mounted() {
			new this.InitFormSubmit(this);
			this.initBtnShow();
		},

		methods: {
			// 初始化展开更多的按钮是否显示
			initBtnShow() {
				setTimeout(() => {
					this.DifferenceApi.boundingClientRect(".near_info", this).then(data => {
							if(!data || !data.height) {
								this.isLookMore = true;
								return;
							}

							if(data.height && data.height > (uni.upx2px(50)) * 5) {
								this.isShowLookBtn = true;
								this.isLookMore = false;
							}
					});
				}, 1000);
			},

			lookMore() {
				this.isLookMore = !this.isLookMore;
				this.PlatformUserBehavior.villageMore();
			}
		},
	}
</script>

<style scoped>
	.near_info_view{
		margin-top: 10upx;
	}
	.near_info{
		font-size: 30upx;
		color: #101D36;
		padding:  0 40upx;
		box-sizing: border-box;
		line-height: 50upx;
	}
	.near_info_hidden{
		-webkit-box-flex:1;
		overflow:hidden;
		white-space:normal;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:5;
		text-overflow: ellipsis;
		-webkit-box-pack:center;
	}
	.more_btn{
	    height: 40upx;
	    line-height: 40upx;
	    width: 100%;
		margin-top: 18upx;
		flex-shrink: 0;
	}
	.more_btn image{
	    width: 27upx;
	    height: 27upx;
		margin: auto;
	}
	.more_btn .lookMoreActive{
	    transform:rotate(-180deg);
	}
</style>
