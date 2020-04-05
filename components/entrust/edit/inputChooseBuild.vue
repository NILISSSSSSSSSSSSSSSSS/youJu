<template>
	<view class="input_choose_build_view">
		<view class="hoose_build_input_view">
			<view class="search-box-head">
				<view class="search-head-con">
					<view class="search-input-box f_c_c">
						<input type="text" class="input-padding"
							@input='searchBuildData' :value="searchInputValue"
							style="width:100%;"
							placeholder="请输入楼盘名或首字母搜索"
							placeholder-class="input-font"/>
					</view>
					<view class="kwd-delte" @click='deleteKedEvent'></view>
				</view>
				<view class="search-cancle-btn" @click='searchCancleEvent'>取消</view>
			</view>
		</view>

		<view class="search-list-con">
			<view class="search-list-li" v-for="(item, index) in inputBuildList" :key="index" @click="inputBuildBtn(item)">
				<view class="search-build-name">{{ item.buildName }}</view>
				<view class="search-build">{{ item.regName }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { SearchNearBuildList } from "../../../net/entrust/SearchNearBuildList.js";
	import { GpsInfoModel } from "../../../model/GpsInfoModel.js";

	let privateData = {
		timeOutVal: null
	};

	class NearBuildListItem {
		buildId = "";  // 小区id
		buildName = "";  // 小区名称
		regId = "";  // 小区所在的区域id
		regName = ""; // 小区所在的区域名称
		compId = "";  // 公司id
		deptId = "";  // 门店id
		buildCompPhoto = ""; // 公司门店图片
	}

	export default {
		props: {
			caseType: {
				type: String | Number,
				default: ""
			},
		},

		data() {
			return {
				searchInputValue: "",
				inputBuildList: []
			}
		},

		methods: {
			searchBuildData(e) {
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				if(!cityInfo.cityId) return;

				this.searchInputValue = e.detail.value;
				clearTimeout(privateData.timeOutVal);
				privateData.timeOutVal = null;
                let that = this;
				privateData.timeOutVal = setTimeout(() => {
					new SearchNearBuildList({cityId: cityInfo.cityId, caseType: this.caseType,
						keyWord: this.searchInputValue}).send()
						.then(res => {
							let inputBuildList = [];
							let list = res.DATA ? res.DATA.list : [];
							list.map(info => {
								if(info.buildId && info.buildRegion) {
									let item = new NearBuildListItem();
									item.buildId = info.buildId || "";
									item.buildName = info.buildName || "";
									item.regId = info.buildRegion || "";
									item.regName = info.regName || "";
									item.compId = info.compId || "";
									item.deptId = info.deptId || "";
									item.buildCompPhoto = info.buildCompPhoto || "";
									inputBuildList.push(item);
								}
							});
							that.inputBuildList = inputBuildList;
						});
				}, 200);
			},

			// 清空
			deleteKedEvent() {
				this.searchInputValue = "";
				this.inputBuildList = [];
			},

			// 取消
			searchCancleEvent() {
				this.$emit("onInputBuildCancelChanged", false);
			},

			// 点击搜索结果
			inputBuildBtn(item) {
				this.$emit("onInputBuildResultChanged", item);
			}
		},
	}
</script>

<style scoped>
	.input_choose_build_view{
		position:fixed;
		width:100%;
		top:0;
		left:0;
		height:100%;
		background:#fff;
		z-index:10000;
	}
	.hoose_build_input_view{
		position:fixed;
		top:0;
		width:100%;
		z-index:99;
		background-color:#FFFFFF;
		padding:26upx 40upx 0;
		box-sizing:border-box;
		margin:0 auto 0;
	}
	.search-box-head{
		height:83upx;
		line-height:83upx;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.search-head-con{
		border-radius:40upx;
		will-change: transform;
		background:#f8f8f9;
		height: 100%;
		line-height: 83upx;
		margin-right: 40upx;
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
        overflow: hidden;
	}
	.search-cancle-btn{
		color: #7a8190;
		font-size: 28upx;
		flex-shrink: 0;
	}
	.input-font{
		color: #c9cdd2;
        line-height: 82upx;
        height: 82upx;
        margin: auto 0;
	}
	.search-input-box{
		padding-left: 84upx;
		height: 83upx;
		line-height: 83upx;
		position: relative;
		font-size: 28upx;
		overflow: hidden;
		box-sizing: border-box;
		width: 100%;
        background-color: #F8F8F9;
		padding-right:60upx;
	}
	.search-input-box::before{
		content:'';
		display: inline-block;
		width:40upx;
		height: 40upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/registration/search_icon.png) center no-repeat;
		background-size: 100% 100%;
		position: absolute;
		left:34upx;
		top: 50%;
		margin-top: -20upx;
	}
    .input-padding{
        background: #F8F8F9;
		height: 40upx;
		line-height: 40upx;
		margin: auto 0;
    }
	.kwd-delte{
		width: 60upx;
		height: 60upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/new_images/close.png?t=20180503) center center no-repeat;
		background-size: 35upx 35upx;
		position: absolute;
		right:0;
		top: 50%;
		margin-top: -34upx;
		z-index:999999;
		padding-right:10upx;
	}
	.search-list-con {
		height: 100%;
		overflow: auto;
		padding: 108upx 40upx 40upx;
		box-sizing: border-box;
	}
	.search-list-li {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 112upx;
		line-height: 112upx;
		font-size: 32upx;
		border-bottom: 1upx solid #ececec;
		box-sizing: border-box;
	}
	.search-build-name {
		color: #101d36;
		position: relative;
	}
	.search-build {
		color: #8e94a1;
		font-size: 28upx;
	}
</style>
