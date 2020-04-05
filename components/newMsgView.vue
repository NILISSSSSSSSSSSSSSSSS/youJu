<template>
	<view @click="lookNewMsg" v-if="isShow" class="new_msg_view">
		<view class="new_msg_point has_new_msg_icon"></view>
	</view>
</template>

<script>
	import { Notify } from "../utils/Notify.js";
	import { Notification } from "../utils/Notification.js";

	export default {
		data() {
			return {
				isShow: false
			};
		},

		mounted() {
			// 更新消息体NC
			new Notification().addObserver(this, "OtherUserMsgChanged", Notify.OtherUserMsgChanged.Name);
		},

		destroyed() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		methods: {
			OtherUserMsgChanged() {
				this.isShow = true;
			},

			lookNewMsg() {
				this.isShow = false;
				uni.switchTab({
					url: "/pages/message/message"
				});
			}
		},
	}
</script>

<style scoped>
	.new_msg_view{
		width:100upx;
		height:100upx;
		position:fixed;
		background:url(http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/btn_mess.png) center center no-repeat;
		right:21upx;
		bottom:270upx;
		border-radius:50%;
		will-change: transform;
		z-index:9;
		background-size:100% 100%;
		box-shadow:0px 0px 33upx 2upx rgba(0, 0, 0, 0.16);
	}
	.new_msg_point{
		background-color:red;
		height:12upx;
		width:12upx;
		right:20upx;
		top:26upx;
		position:absolute;
		border-radius:50%;
		will-change: transform;
	}
	.has_new_msg_icon{
		animation:pound 1s infinite;
	}
	@keyframes pound{
		from{transform:none}
		50%{transform:scale(1.6)}
		to{transform:none}
	}
</style>
