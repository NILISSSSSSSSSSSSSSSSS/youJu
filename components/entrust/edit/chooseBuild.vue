<template>
	<view class="choose_build">
		<!-- 输入搜索 -->
		<view @click="chooseBuildInputBtn" class="choose_build_input_btn f_r_s">
			<view class="choose_build_btn_search"></view>
			<view :class="chooseBuildName ? 'choose_build_btn_text' : ''">{{ chooseBuildName ? chooseBuildName : '请输入小区名称' }}</view>
		</view>

		<!-- 附近小区 -->
		<view class="choose_near_build">
			<view class="choose_near_build_title">附近小区</view>
			<view class="f_r_s choose_near_list">
				<view class="choose_near_list_item f_r_c" v-for="(item, index) in nearBuildList"
					:class="chooseBuildId == item.buildId ? 'choose_near_list_item_active global-selecet-box' : ''"
					@click="chooseBuildInfo(item)"
					:key="item.buildId">
                    <view class="choose_near_list_item_text">{{ item.buildName }}</view>
                </view>
			</view>
		</view>

		<!-- 输入搜索弹窗 -->
		<inputChooseBuild v-if="isShowInputBuild" :caseType="caseType"
			@onInputBuildResultChanged="onInputBuildResultChanged"
			@onInputBuildCancelChanged="onInputBuildCancelChanged"></inputChooseBuild>
	</view>
</template>

<script>
	import inputChooseBuild from "./inputChooseBuild.vue";

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
			buildName: {
				type: String | Number,
				default: ""
			},
			buildId: {
				type: String | Number,
				default: ""
			},
			regId: {
				type: String | Number,
				default: ""
			},
			nearBuildList: {
				type: Array,
				default(){
					return [];
				}
			}
		},

		components: {
			inputChooseBuild
		},

		data() {
			return {
				chooseBuildName: "",
				chooseBuildId: "",
				chooseRegId: "",
				chooseRegName: "",
				chooseCompId: "",
				chooseDeptId: "",
				chooseBuildCompPhoto: "",

				isShowInputBuild: false,  // 输入搜索小区
			}
		},

		mounted() {
			this.chooseBuildName = this.buildName;
			this.chooseBuildId = this.buildId;
			this.chooseRegId = this.regId;
		},

		created() {
			this.chooseBuildName = this.buildName;
			this.chooseBuildId = this.buildId;
			this.chooseRegId = this.regId;
		},

		watch: {
			buildName(newValue, oldValue) {
				this.chooseBuildName = newValue;
			},
			buildId(newValue, oldValue) {
				this.chooseBuildId = newValue;
			},
			regId(newValue, oldValue) {
				this.chooseRegId = newValue;
			}
		},

		methods: {
			// 点击附近小区
			chooseBuildInfo(item) {
				this.chooseRegName = item.regName;
				this.chooseBuildName = item.buildName;
				this.chooseBuildId = item.buildId;
				this.chooseRegId = item.regId;
				this.chooseCompId = item.compId;
				this.chooseDeptId = item.deptId;
				this.chooseBuildCompPhoto = item.buildCompPhoto;
				this.upNearBuildId();
			},

			// input button
			chooseBuildInputBtn() {
				this.isShowInputBuild = true;
			},

			// 更新父组件id
			upNearBuildId() {
				this.$emit("onNearBuildChanged", {
					buildId: this.chooseBuildId,
					regId: this.chooseRegId,
					buildName: this.chooseBuildName,
					regName: this.chooseRegName,
					compId: this.chooseCompId,
					deptId: this.chooseDeptId,
					buildCompPhoto: this.chooseBuildCompPhoto
				});
			},

			// 搜索取消回调
			onInputBuildCancelChanged(boolean) {
				this.isShowInputBuild = false;
			},

			// 搜索结果点击回调
			onInputBuildResultChanged(item) {
				this.chooseRegName = item.regName;
				this.isShowInputBuild = false;
				this.chooseBuildName = item.buildName;
				this.chooseBuildId = item.buildId;
				this.chooseRegId = item.regId;
				this.chooseCompId = item.compId;
				this.chooseDeptId = item.deptId;
				this.chooseBuildCompPhoto = item.buildCompPhoto;
				this.upNearBuildId();
			},
		},
	}
</script>

<style scoped>
	.choose_build_input_btn{
		width:100%;
		height:83upx;
		line-height:83upx;
		margin:26upx auto 0;
		border-radius:40upx;
		will-change: transform;
		background:#f8f8f9;
		color:#d3d6da;
		text-align:left;
		font-size:28upx;
	}
	.choose_build_btn_search{
		margin: auto 20upx auto 34upx;
		width:30upx;
		height:30upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_search_icon.png) center no-repeat;
		background-size:100% 100%;
	}
	.choose_near_build{
		padding-bottom:30upx;
		margin-top:28upx;
		box-sizing: border-box;
	}
	.choose_near_build_title{
		font-size:26upx;
		color:#101d36;
		margin-top:36upx;
		padding-bottom:4upx;
        box-sizing: border-box;
	}
	.choose_near_list{
		flex-wrap:wrap;
		margin-top:28upx;
        padding-top: 4upx;
        box-sizing: border-box;
	}
	.choose_near_list_item{
		width:210upx;
        padding: 11upx 0;
		text-align:center;
		color:#101d36;
		font-size:28upx;
		background-color:#f1f3f6;
		border-radius:5upx!important;
		will-change: transform;
		margin:0 16upx 16upx 0;
        border: 1upx solid #f1f3f6;
		box-sizing: border-box;
        flex-shrink: 0;
	}
    .choose_near_list_item_text{
        overflow:hidden;
        max-width:90%;
        height: 40upx;
        line-height: 40upx;
        margin: auto;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
	.choose_near_list_item:nth-child(3n) {
		margin-right: 0;
	}
	.choose_near_list .choose_near_list_item_active{
		color:#ab7f2e;
		background-color:#FFFFFF;
		border:1upx solid #ab7f2e;
		box-sizing:border-box;
	}
	.choose_build_input_btn .choose_build_btn_text{
		color: #101d36;
	}
</style>
