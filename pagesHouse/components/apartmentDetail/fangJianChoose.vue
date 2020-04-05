<template>
	<view class="fang_choose">
		<view class="fang_choose_item" v-for="(item, index) in fangJianList" :key="index">
			<view class="f_r_b">
				<view class="f_r_s">
					<view class="sex_img_view">
						<image class="sex_img" v-if="item.sex == 1"
							src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/man.png"></image>
						<image class="sex_img" v-else-if="item.sex == 2"
							src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/icon_avatar_women.png"></image>
						<image class="sex_img" v-else
							src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/icon_avatar.png"></image>
					</view>

					<view class="f_r_s">
						<view class="fangJianName">{{ item.fangJianName }}房间</view>

						<view class="isCurrentFangJian" v-if="item.isCurrentFangJian">当前房间</view>
					</view>
				</view>

				<view class="isAlreadyRent" v-if="item.isAlreadyRent">已出租</view>
				<view @click="lookRoomDetail(item, index)" v-if="!item.isAlreadyRent" class="f_r_e fang_money_view">
					<view class="fang_money_text main_color">￥{{ item.rentMoney }}</view>
					<image :class="{ lookMoreActive : item.isLookMore }"
						mode="aspectFill"
						src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/filter_btn_nomal.png"></image>
				</view>
			</view>

			<view class="fang_des_view" v-if="!item.isAlreadyRent && item.isLookMore">
				<view class="fang_des_img f_r_s">
					<view class="fang_des_img_view" v-for="(url, key) in item.imgList" :key="key">
						<image mode="aspectFill" :src="url"></image>
					</view>
				</view>

				<view class="f_r_s ru_woShiType">
					<view v-if="item.ruZhuTime && item.ruZhuTime > '2000-01-01'">{{ item.ruZhuTime }}入住</view>
					<view class="woShiType">{{ item.woShiType == 1 ? '主卧':'次卧' }}</view>
				</view>

				<!-- 房源标签 -->
				<view class="tags_view f_r_s">
					<view class="f_c_c" v-for="(info, i) in item.tags" :key="i">{{ info }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	class FangJianChooseItem {
		sex = "";  // 性别  1 ：男 ， 2 : 女
		fangJianName = "";  // 房间名称 例： A
		isCurrentFangJian = false;  // 是否是当前房间
		isAlreadyRent = false;  // 是否是已出租
		rentMoney = ""; // 租金 例： 900
		ruZhuTime = "";  // 入住时间 例如：2018.08.08
		woShiType = ""; // 卧室类型  1:主卧， 其他：次卧
		tags = [];  // 房间tags 例：[text]
		imgList = [];  // 房间图片列表 例：[url]
		isLookMore = false;
	}

	export default {
		data() {
			return {
				fangJianList: []
			}
		},

		props: {
			list: {
				type: Array,
				default: [],
			},
		},

		watch: {
			list(newValue, oldValue) {
				this.fangJianList = newValue;
			}
		},

		mounted() {
			this.fangJianList = this.list;
		},

		methods: {
			lookRoomDetail(item, index) {
				let boolean = item.isLookMore;
				let newFangJianList = [];
				item.isLookMore = !item.isLookMore;
				this.fangJianList.map((info) => {
					info.isLookMore = false;
					newFangJianList.push(info);
				});
				newFangJianList[index].isLookMore = !boolean;
				this.fangJianList = newFangJianList;
			}
		},
	}
</script>

<style scoped>
	.fang_choose{
		padding: 30upx 40upx 0;
		box-sizing: border-box;
	}
	.fang_choose_item{
		padding-bottom: 44upx;
		box-sizing: border-box;
	}
	.sex_img_view{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		will-change: transform;
		overflow: hidden;
		margin-right: 26upx;
		flex-shrink: 0;
	}
	.isAlreadyRent{
		color: #8E94A1;
		font-size: 32upx;
	}
	.sex_img{
		width: 100%;
		height: 100%;
	}
	.fangJianName{
		color: #101D36;
		font-size: 32upx;
		flex-shrink: 0;
		margin-top: 10upx;
	}
	.isCurrentFangJian{
		background-color:#ff945f;
		color:#FFFFFF;
		font-size:22upx;
		height: 32upx;
		line-height: 32upx;
		padding:0 8upx 0 8upx;
		margin-left:16upx;
		margin-top: 16upx;
		border-radius:4upx;
		will-change: transform;
		flex-shrink: 0;
		box-sizing: border-box;
	}
	.fang_money_view image{
		width: 27upx;
		height: 27upx;
		margin: 8upx 0 auto 0;
	}
	.fang_money_view .lookMoreActive{
	    transform:rotate(-180deg);
	}
	.fang_money_text{
		font-size: 40upx;
		margin-right: 17upx;
		font-weight: bold;
	}
	.fang_des_view{
		padding-left: 78upx;
		box-sizing: border-box;
	}
	.fang_des_img{
		overflow-x: auto;
	}
	.fang_des_img .fang_des_img_view:last-child{
		margin-right: 0;
	}
	.fang_des_img_view{
		height: 150upx;
		width: 190upx;
		flex-shrink: 0;
		border-radius: 4upx;
		will-change: transform;
		overflow: hidden;
		margin-right: 10upx;
	}
	.fang_des_img_view image{
		width: 100%;
		height: 100%;
	}
	.ru_woShiType{
		line-height: 40upx;
		margin-top: 17upx;
		font-size: 30upx;
		color: #101D36;
	}
	.woShiType{
		margin-left: 22upx;
	}
	.tags_view{
	    font-size:22upx;
		flex-wrap: wrap;
		margin-top: 15upx;
	}
	.tags_view view{
	    white-space: nowrap;
	    font-size:22upx;
	    display:flex;
	    flex-direction: column;
	    justify-content: center;
	    color:#7991a6;
	    background:#edf0f3;
	    padding:4upx 10upx 6upx;
	    border-radius:2upx;
		will-change: transform;
	    margin-right:10upx;
	    box-sizing: border-box;
	}
</style>
