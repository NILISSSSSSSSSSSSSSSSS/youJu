<template>
	<view class="f_r_s house_other">
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">开盘时间:</text></view>
			<view class="house_other_text">{{ item.kaiPanTime || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">房屋用途:</text></view>
			<view class="house_other_text">{{ item.fangWuYongTu || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">绿化率:</text></view>
			<view class="house_other_text">{{ item.luHuaLv || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">容积率:</text></view>
			<view class="house_other_text">{{ item.rongJiLv || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">装修情况:</text></view>
			<view class="house_other_text">{{ item.zhuangXiuQingKuang || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">产权年限:</text></view>
			<view class="house_other_text">{{ item.chanQuanYear || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">占地面积:</text></view>
			<view class="house_other_text">{{ item.zhanDiArea || "--" }}</view>
		</view>
		
		<view class="f_r_s house_other_item">
			<view class="f_r_b house_other_title">停车位:</text></view>
			<view class="house_other_text">{{ item.tingCheWei || "--" }}</view>
		</view>
		
		<view class="house_other_item_100">
			<text class="f_r_s house_other_title_more"><text class="house_other_title">建筑面积:</text><text class="house_other_cont">{{ item.jianZhuArea || "--" }}</text></text>
		</view>
		
		<view class="house_other_item_100">
			<text class="f_r_s house_other_title_more"><text class="house_other_title">交房时间:</text><text class="house_other_cont">{{ item.jiaoFangTime || "--" }}</text></text>
		</view>
		
		
		<view class="house_other_item_100">
			<text class="f_r_s house_other_title_more"><text class="house_other_title">物管公司:</text><text class="house_other_cont">{{ item.wuGuanGongSi || "--" }}</text></text>
		</view>
		
		<view class="house_other_item_100">
			<text class="f_r_s house_other_title_more"><text class="house_other_title">开发商:</text><text class="house_other_cont">{{ item.kaiFaShang || "--" }}</text></text>
		</view>
		
		<view class="house_other_item_100">
			<text class="f_r_s house_other_title_more"><text class="house_other_title">售楼地址:</text><text class="house_other_cont">{{ item.shouLouAddress || "--" }}</text></text>
		</view>
		
		<view class="house_other_item_100">
			<text class="f_r_s house_other_title_more"><text class="house_other_title">售楼许可:</text><text class="house_other_cont">{{ item.shouLouXuKe || "--" }}</text></text>
		</view>
	</view>
</template>

<script>
	class LouPanInfoItem {
		kaiPanTime = "";  //开盘时间
		fangWuYongTu = "";  // 房屋用途
		luHuaLv = "";  // 绿化率
		rongJiLv = ""; // 容积率
		zhuangXiuQingKuang = "";  // 装修情况
		chanQuanYear = "";  // 产权年限
		zhanDiArea = "";  // 占地面积
		tingCheWei = ""; // 停车位
		jianZhuArea = "";  // 建筑面积
		jiaoFangTime = "";  // 交房时间
		wuGuanGongSi = "";  // 物管公司
		kaiFaShang = ""; // 开发商
		shouLouAddress = "";  // 售楼地址
		shouLouXuKe = "";  // 售楼许可
	}
	
	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},
		},
	}
</script>

<style scoped>
	/* 单价+楼层+装修+朝向+年代+类型+小区 */
	.house_other{
	    width:100%;
	    box-sizing:border-box;
	    background:#fff;
	    flex-wrap: wrap;
	    box-sizing: border-box;
	    font-size: 32upx;
		color: #101D36;
		padding: 0 40upx;
	}
	.house_other_item{
	    width:50%;
	    text-overflow:ellipsis;
	    white-space:nowrap;
	    overflow:hidden;
		text-align: left;
		line-height: 66upx;
		padding-right: 10upx;
		box-sizing: border-box;
	}
	.house_other_item_100{
		width: 100%;
		line-height: 66upx;
	}
	.house_other_item_100 .house_other_cont{
		font-size: 32upx;
		color: #101D36;
	}
	.house_other_title{
	    color: #8E94A1;
	    font-size: 32upx;
	    margin-right: 17upx;
		flex-shrink: 0;
		width: 140upx;
	}
	.house_other_title_more{
		color: #8E94A1;
		font-size: 32upx;
		margin-right: 17upx;
		flex-shrink: 0;
	}
	.house_other_title_more .house_other_title{
		display: inline-block;
	}
	.house_other_text{
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow:hidden;
		text-align: left;
		width:50%;
		flex: 1;
	}
</style>
