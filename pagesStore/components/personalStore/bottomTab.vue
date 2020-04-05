<template>
	<view class="bottom_tab_view f_r_c">
		<block v-for="(item, index) in tabList" :key="index">
			<view class="bottom_tab_item f_c_c" 
				@click="changeTabSelect(item)">
				<image class="bottom_tab_img"
					:src="select == item.id ? item.selectedIconPath : item.iconPath"></image>
				<view class="bottom_tab_text">{{ item.text }}</view>
			</view>
		</block>
	</view>
</template>

<script>
	class BottomTabItem {
		id = "";  // id
		text = "";  // 文案
		pagePath = ""; // 跳转的页面
		pageToMethod = "navigateTo";  // 页面跳转方法
		iconPath = "";  // 默认图片路径 
		selectedIconPath = "";  // active时的图片路径
	}
	
	export default {
		props: {
			tabList: {
				type: Array,
				default() {
					return []
				}
			},
			defaultSelected: {
				type: String | Number,
				default: ""
			},
			// active时的文字颜色
			activeColor: {
				type: String,
				default: "#2491FF"
			},
			// 默认的文字颜色
			defaultColor: {
				type: String,
				default: "#BBBBBB"
			}
		},
		
		data() {
			return {
				select: ""
			}
		},
		
		watch: {
			defaultSelected(newValue, oldValue) {
				this.select = this.defaultSelected;
			}
		},
		
		mounted() {
			this.select = this.defaultSelected;
		},
		
		methods: {
			changeTabSelect(item) {
				this.select = item.id || "";
				if(item.pagePath && !item.pageToMethod) {
					uni.showToast({
						icon: "none",
						title: "请配置跳转方法"
					});
					return;
				}
				
				if(item.pagePath && !uni[item.pageToMethod]) {
					uni.showToast({
						icon: "none",
						title: "请配置正确的页面跳转方法"
					});
					return;
				}
				
				this.$emit("onBottomTabChanged", item);

				if(item.pagePath) {
					uni[item.pageToMethod]({
						url: item.pagePath
					});
				}
			}
		},
	}
</script>

<style>
	.bottom_tab_view{
		background:#fff;
		border-top: 2upx solid #e7e7e7;
		height:100upx;
		position:fixed;
		left: 50%;
		max-width: 640px;
		transform: translateX(-50%);
		right:0;
		bottom:0;
		margin:auto;
		width:100%;
		box-sizing:border-box;
		z-index: 100;
	}
	.bottom_tab_item{
		width: 100%;
		text-align: center;
	}
	.bottom_tab_img{
		width:40upx;
		height:40upx;
		flex-shrink: 0;
		margin: 0 auto;
	}
	.bottom_tab_text{
		text-align: center;
		margin-top: 6upx;
		font-size: 22upx;
	}
</style>
