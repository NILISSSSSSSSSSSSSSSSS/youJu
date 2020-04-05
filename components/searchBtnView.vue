<template>
	<form report-submit @submit="formSubmit">
		<view>
			<view v-if="!name" class="search_box">
				<view hover-class="none" form-type="submit" @click="searchHouse" class="search f_r_s">

					<image class="search_icon" :src="searchIcon"></image>
					<view class="f_c_c" style="color: #7A8190;">请输入小区或商圈名称</view>
				</view>
			</view>

			<view v-else class="search_box">
				<view class="search f_r_b" style="padding-right: 0;">
					<view hover-class="none" form-type="submit" @click="searchHouse" style="width: 100%;" class="f_r_s">
						<image class="search_icon" :src="searchIcon"></image>
						<view class="f_c_c search_text">{{name}}</view>
					</view>

					<view hover-class="none" form-type="submit" @click.stop="clearBtn" class="clear_btn"></view>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
	import { Notification } from "../utils/Notification.js";
	import { Notify } from "../utils/Notify.js";
	import { SearchHouseModel } from "../model/SearchHouseModel.js"

	export default {
		data() {
			return {
				searchIcon: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_search_icon.png"
			};
		},

		props: {
			name: {
				type: String,
				default: ""
			},
			caseType: {
				type: String,
				default: ""
			}
		},

		mounted() {
			new this.InitFormSubmit(this);
		},

		methods: {
			searchHouse() {
				uni.navigateTo({
					url: "../search/search?caseType=" + this.caseType + "&from=other"
				});
			},

			clearBtn() {
				let item = { houseName: "", houseId: "", houseAddress: "" };
				new SearchHouseModel().setModel(item);
				new Notification().postNotification(Notify.SearchResChanged.Name, item);
			}
		},
	}
</script>

<style scoped>
	.search_box {
		margin: 28upx 0 15upx;
		padding: 0 40upx;
		box-sizing: border-box;
	}

	.search {
		height: 82upx;
		background-color: #f8f8f9;
		border-radius: 41upx;
		position: relative;
		color: #666666;
		box-sizing: border-box;
		line-height: 82upx;
		font-size: 28upx;
		color: #7A8190;
		border: 0;
		outline: none;
		padding: 0 32upx;
	}

	.search_icon {
		width: 30upx;
		height: 30upx;
		box-sizing: border-box;
		margin: 28upx 15upx auto 0;
		flex-shrink: 0;
	}

	.search_text {
		font-size: 28upx;
		color: #101D36;
	}

	.clear_btn {
		width: 82upx;
		height: 82upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/search/clear.png) no-repeat center center;
		background-size: 30upx 30upx;
		flex-shrink: 0;
	}
</style>