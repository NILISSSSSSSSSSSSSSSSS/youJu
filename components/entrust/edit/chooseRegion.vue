<template>
	<view class="choose_region_view">
		<view v-for="(item, index) of regionList" :key="index">
			<!-- 区域 -->
			<view class="f_r_s reg_list">
				<view class="reg_item" :class="info.id == currentRegionId ? 'reg_item_active global-confirm-btn' :''"
					@click="chooseRegId(info, index)"
					v-for="(info, infoIndex) of item" :key="info.id">{{ info.name }}</view>
			</view>

			<!-- 商圈 -->
			<view v-if="showSection && currentRegionId && currentIndex == index && setctionMap[currentRegionId] && setctionMap[currentRegionId].length > 0"
				class="f_r_s section_list">
				<view class="section_item f_r_c"
					v-for="(sectionInfo, sectionIndex) of setctionMap[currentRegionId]"
					@click="chooseSectionId(sectionInfo)"
					  :class="(!sectionInfo.id && currentSectionId.length === 0) || (sectionInfo.id && (currentSectionId[0] && currentSectionId[0] == sectionInfo.id || currentSectionId[1] && currentSectionId[1] == sectionInfo.id) || currentSectionId[2] && currentSectionId[2] == sectionInfo.id ) ? 'section_item_active global-selecet-box-entrust' :''"
					  :key="sectionInfo.id">
                    <view class="section_item_text">{{ sectionInfo.name }}</view>
                </view>
			</view>
		</view>
	</view>
</template>

<script>
	class RegionListItem {
		id = "";  // 区域id
		name = "";  // 区域名称
	}

	export default {
		props: {
			regionList: {
				type: Array,
				default(){
					return [];
				}
			},
			// regId 为 key , RegionListItem的数组 为value
			setctionMap: {
				type: Object,
				default(){
					return {};
				}
			},
			regionId: {
				type: String | Number,
				default: ""
			},
			// 例如: 20,30,40  最多三个
			sectionId: {
				type: String | Number,
				default: ""
			},
			// 是否是编辑  1 是 2 否
			isEdit: {
				type: String | Number,
				default: "2"
			}
		},

		mounted() {
			this.currentRegionId = this.regionId;
			if(this.sectionId) {
				this.currentSectionId = this.sectionId.split(",");
			}
			this.initCurrentIndex();
		},

		created() {
			this.currentRegionId = this.regionId;
			if(this.sectionId) {
				this.currentSectionId = this.sectionId.split(",");
			}
			this.initCurrentIndex();
		},

		watch: {
			regionId(newValue, oldValue) {
				this.currentRegionId = newValue;
			},
			sectionId(newValue, oldValue) {
				if(newValue) {
					this.currentSectionId = newValue.split(",");
				}else {
					this.currentSectionId = [];
				}
			},
			sectionName(newValue, oldValue) {
				if(newValue) {
					this.currentSectionName = newValue.split(",");
				}else {
					this.currentSectionName = [];
				}
			},
			regionList(newValue, oldValue) {
				this.initCurrentIndex();
			},
			setctionMap(newValue, oldValue) {
				this.initCurrentIndex();
			},
		},

		data() {
			return {
				currentRegionId: "",
				currentSectionId: [],
				currentIndex: "",
				currentRegionName: "",
				currentSectionName: "",
				showSection: true
			}
		},

		methods: {
			initCurrentIndex() {
				if(!this.regionList || this.regionList.length == 0) return;

				let currentIndex = "";
				for(let i = 0;i<this.regionList.length;i++) {
					let contLsit = this.regionList[i];
					for(let j = 0;j<contLsit.length;j++) {
						if(contLsit[j].id == this.currentRegionId) {
							this.currentIndex = i;
							this.currentRegionName = contLsit[j].name;
							break;
						}
					}
				}
			},

			// 选择区域
			chooseRegId(item, index) {
				this.showSection = !this.showSection;
				if(this.currentRegionId != item.id) {
					this.showSection = true;
				}
				this.currentIndex = index;
				this.currentSectionId = [];
				this.currentRegionId = item.id;
				this.currentRegionName = item.name;
				this.currentSectionName = "不限";
				this.upRegSectionId();
			},

			// 选择商圈
			chooseSectionId(item) {
				let sectionIds = [];
				let sectionNames = [];
				if(this.currentSectionId && this.currentSectionId.length > 0) {
					sectionIds = this.currentSectionId;
					sectionNames = this.currentSectionName.split(",");
				}
				do{
					if(!item.id) {
						this.currentSectionId = [item.id];
						this.currentSectionName = item.name;
						break;
					}

					if(sectionIds.indexOf(item.id) >= 0) {
						let delIndex = sectionIds.findIndex((val) => {
							return val == item.id;
						});
						sectionIds.splice(delIndex, 1);
						sectionNames.splice(delIndex, 1);
						this.currentSectionId = sectionIds;
						this.currentSectionName = sectionNames.join(",");
						break;
					}

					if(sectionIds.length < 3) {
						sectionIds.push(item.id);
						sectionNames.push(item.name);
						this.currentSectionId = sectionIds;
						this.currentSectionName = sectionNames.join(",");
						break;
					}

					sectionIds.push(item.id);
					sectionNames.push(item.name);
					sectionIds.splice(0, 1);
					sectionNames.splice(0, 1);
					this.currentSectionId = sectionIds;
					this.currentSectionName = sectionNames.join(",");
				}while(false);
				this.upRegSectionId();
			},

			// 更新父组件id
			upRegSectionId() {
				let list = this.setctionMap[this.currentRegionId];
				let currentSectionName = "不限";
				let currentSectionNames = [];
				for (let info of list) {
					if(this.currentSectionId.includes(info.id)) {
						currentSectionNames.push(info.name);
					}
				}
				if (currentSectionNames.length > 0) {
					currentSectionName = currentSectionNames.join(",");
				}
				this.$emit("onRegSectionChanged", {
					regId: this.currentRegionId,
					sectionId: this.currentSectionId && this.currentSectionId.length > 0
							? this.currentSectionId.join(",") : "",
					regName: this.currentRegionName,
					sectionName: currentSectionName
				});
			}
		},
	}
</script>

<style scoped>
	.reg_item{
		width:155upx;
		height:64upx;
		line-height:64upx;
		text-align:center;
		color:#101d36;
		font-size:28upx;
		background-color:#f1f3f6;
		border-radius:5upx;
		will-change: transform;
		margin:0 16upx 16upx 0;
		box-sizing:border-box;
	}
	.reg_list .reg_item_active{
		color:#fff;
		background:-webkit-linear-gradient(left, #fe8814, #ff7528);
	}
	.reg_list>.reg_item:nth-child(4n) {
		margin-right: 0;
	}
	.section_list{
		flex-wrap: wrap;
		box-sizing:border-box;
		min-height:160upx;
		padding-top:26upx;
	}
	.section_item{
		width:114upx;
		height:50upx;
		line-height:50upx;
		margin-bottom:20upx;
		margin-right:20upx;
		text-align:center;
		font-size:26upx;
		box-sizing:border-box;
		color:#89909d;
		border-radius:8upx;
		will-change: transform;
		background-color:#FFFFFF;
		border:1upx solid #d3d3d3;
	}
    .section_item_text{
        overflow:hidden;
        max-width:110upx;
        margin: auto 0;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
	.section_list .section_item:nth-child(5n) {
		margin-right: 0;
	}
	.section_list .section_item_active{
		border:1upx solid #ab7f2e;
		color:#ab7f2e;
	}
</style>
