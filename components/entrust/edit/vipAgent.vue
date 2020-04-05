<template>
	<view>
		<!-- 专属委托icon -->
		<view class="f_r_c vip_agent_icon_view">
			<image v-if="type == 'agent'" class="vip_agent_icon" mode="aspectFill"
				src="http://cdn.haofang.net/static/uuminiapp/entrustImg/zs_bg.png"></image>

			<image v-if="type == 'build'" class="vip_build_icon" mode="aspectFill"
				   src="http://cdn.haofang.net/static/uuminiapp/property/exclusiveDelegation.png"></image>
		</view>
		
		<!-- 经纪人信息 -->
		<view class="f_c_s vip_agent_info">
			<!-- 头像 -->
			<view class="f_r_c" :class="type == 'agent' ? 'vip_agent_head_view' : 'vip_build_head_view'">
				<image class="vip_agent_head" mode="aspectFill" :src="archiveHeadImg"></image>
			</view>
			
			<!-- 名子 -->
			<view class="vip_agent_name">{{ archiveName }}</view>
		</view>
		
		<!-- 描述 -->
		<view class="f_r_c">
			<image class="vip_agent_des_line" mode="aspectFill"
				src="http://cdn.haofang.net/static/uuminiapp/entrustImg/ms_l.png"></image>
				
			<view class="vip_agent_des_text">你的信赖是对TA最大的肯定</view>
			
			<image class="vip_agent_des_line" mode="aspectFill"
				src="http://cdn.haofang.net/static/uuminiapp/entrustImg/ms_r.png"></image>
		</view>
	</view>
</template>

<script>
	import { Const } from "@/utils/Const.js";
	
	export default {
		props: {
			archiveId: {
				type: Number | String,
				default: ""
			},
			archiveName: {
				type: Number | String,
				default: ""
			},
			archiveHeadImg: {
				type: Number | String,
				default: Const.defaultHeadImg
			},
			type: {
				type: Number | String,
				default: "agent"
			},
		},
	}
</script>

<style scoped>
	.vip_agent_icon_view{
		margin-bottom: 18upx;
	}
	.vip_agent_icon{
		width:305upx;
		height:59upx;
		margin: 0 auto;
	}
	.vip_build_icon{
		width:305upx;
		height:59upx;
		margin: 0 auto;
	}
	.vip_agent_info{
		margin-bottom: 40upx;
	}
	.vip_build_head_view{
		width:120upx;
		height:120upx;
		flex-shrink: 0;
		border-radius:100%;
		box-sizing: border-box;
		overflow: hidden;
		margin: 0 auto;
	}
	.vip_agent_head_view{
		width:122upx;
		height:122upx;
		flex-shrink: 0;
		border:2upx solid #ff5501;
		border-radius:100%;
		box-sizing: border-box;
		overflow: hidden;
		margin: 0 auto;
	}
	.vip_agent_head{
		width: 100%;
		height: 100%;
	}
	.vip_agent_name{
		color:#101D36;
		font-size:33upx;
		line-height: 122upx;
		/*margin-left: 26upx;*/
		text-align: center;
	}
	.vip_agent_des_line{
		width:67upx;
		margin: auto 0;
		height:12upx;
	}
	.vip_agent_des_text{
		color:#999999;
		font-size:24upx;
		text-align:center;
		margin: 0 15upx;
	}
</style>
