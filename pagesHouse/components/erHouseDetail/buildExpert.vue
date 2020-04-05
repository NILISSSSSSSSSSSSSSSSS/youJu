<template>
	<view class="build_expert_view">
		<view class="build_expert">
			<village-expert :item="item" @villageExpertListChange="villageExpertList"></village-expert>

			<!--<view class="bulid_cont" v-if="item.houseList && item.houseList.length > 0">-->
				<!--<view class="he_house_title">-->
					<!--<view class="he_house_title_text">同小区TA的房源</view>-->
				<!--</view>-->
				<!---->
				<!--<view>-->
					<!--<block v-for="(info, index) in item.houseList" :key="index">-->
						<!--<er-house-list-item :item="info"></er-house-list-item>-->
					<!--</block>-->
				<!--</view>-->
			<!--</view>-->
		</view>
	</view>
</template>

<script>
	import villageExpert from "@/components/villageExpert.vue";
	import erHouseListItem from "@/components/erHouseListItem.vue";

	class BuildExpertItem {
		zhuangXiuStatusId = "";  // 装修情况
		zhuangXiuStatusName = "";
		roomId = "";  // 几室id
		roomName = "";
		regionId = "";
		regionName = "";
		houseTypeId = ""; // 房屋类型id
		houseTypeName = ""; // 房屋类型文案
		buildId = "";
		buildName = "";  // 小区名称
		buildAddress = "";  // 服务地址
		agentHeaderImg = ""; // 专家头像
		agentName = "";  // 专家姓名
		agentPhone = "";  // 专家电话
		archiveId = ""; // id
		noBoxShadow = false;  // 不显示view 的 box-shadow style
		caseId = ""; // 房源id
		caseType = "";  // 房源类型
		cityId = ""; // 城市id
		reSource = 1;  // 来源

		shareInfoFlag = false;  // 经纪人个人微店 进入及掌通分享:新房显示、小区专家显示
		houseList = [];  // 负责的房源列表 类型同房源列表
	}

	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},
			haveList: false,
		},

		data() {
			return {
				has: false,
			}
		},

		components: {
			villageExpert,
			erHouseListItem
		},

		watch: {
			haveList() {
				this.has = this.haveList;
			}
		},

		mounted() {
			this.has = this.haveList;
		},

		methods: {
			villageExpertList(list) {
				if(list.length > 0) {
					this.has = true;
				}else {
					this.has = false;
				}
				this.$emit("villageExpertListChange", list);
			}
		}
	}
</script>

<style scoped>
	.build_expert_view{
		padding: 20upx 40upx 0;
		box-sizing: border-box;
	}
	.build_expert{
		width: 100%;
		border-radius: 10upx;
		/*box-shadow:0 0 20upx #E2E2E2;*/
	}
	.he_house_title{
		color: #9097a7;
		font-size: 24upx;
		position: relative;
		display: flex;
	}
	.he_house_title::after{
		content: "";
		width: 100%;
		box-sizing: border-box;
		height: 1upx;
		background-color: #F5F5F5;
		margin: auto 0 auto 24upx;
	}
	.he_house_title_text{
		flex-shrink: 0;
	}
	.bulid_cont{
		padding: 18upx 26upx 0;
		box-sizing: border-box;
	}
</style>
