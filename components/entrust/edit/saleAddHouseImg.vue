<template>
	<view class="saleAddHouseImg">
		<view v-if="title" class="saleAddHouseImg_title">{{ title }}</view>

		<view class="saleAddHouseImg_list f_r_s">
            <view class="saleAddHouseImg_item" v-for="(item, index) in houseImgList" :key="index">
                <image class="saleAddHouseImg_item_img" mode="aspectFill" :src="item.picUrl"></image>

                <image class="delete-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/del_btn.png"
                    @click='deleteImg(index, item)'></image>
            </view>

			<view @click="chooseHouseImg" v-if="houseImgList.length < 9" class="saleAddHouseImg_add f_c_c">
				<image mode="aspectFill" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/btn_addto.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { Config } from "@/utils/config.js";
	import { DealHousePhoto } from "@/net/entrust/DealHousePhoto.js";
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
	import {UploadFile} from "../../../utils/common";

	class HouseImgListItem {
		photoId = "";
		picUrl = "";  // 完整路径
		saveUrl = "";  // 文件名
	}

	export default {
		props: {
			title: {
				type: String | Number,
				default: ""
			},
			imgList: {
				type: Array,
				default() {
					return [];
				}
			}
		},

		mounted() {
			this.houseImgList = this.imgList;
		},

		created() {
			this.houseImgList = this.imgList;
		},

		watch: {
			imgList(newValue, oldValue) {
				this.houseImgList = this.imgList;
			}
		},

		data() {
			return {
				houseImgList: []
			}
		},

		methods: {
			// 删除图片
			deleteImg(index, item) {
				let list = [];
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};

				if(item.photoId && cityInfo.cityId) {
					new DealHousePhoto({cityId: cityInfo.cityId,photoId: item.photoId}).send()
				}
				this.houseImgList.map((info) => {
					if(info.saveUrl != item.saveUrl) {
						list.push(info);
					}
				})
				this.houseImgList = list;
				this.$emit("onHouseImgChanged", {imgList: list});
			},

			// 上传图片
			uploadImg(filePath = "") {
				let that = this;
				let imgArr = that.houseImgList || [];
				new UploadFile(filePath).send().then(json => {
					if (json.STATUS == 1) {
						let url = json.data[0]['saveName'];
						imgArr.push({ photoId: '', picUrl: json.data[0]["fullUrl"], saveUrl: url });
						that.houseImgList = imgArr;
						that.$emit("onHouseImgChanged", {imgList: imgArr});
					}
				});
			},

			// 选择图片
			chooseHouseImg() {
				let that = this, imgArr = that.houseImgList || [];
				uni.chooseImage({
					count: 9 - imgArr.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						let tempFilePaths = res.tempFilePaths;
						let count = res.tempFilePaths.length;

						for (let i = 0; i < tempFilePaths.length; i++) {
							(function (j) {
								// #ifdef H5
								let canvas = document.createElement('canvas');
								let ctx = canvas.getContext('2d');
								let img = new Image;
								img.crossOrigin = 'Anonymous';
								img.onload = function(){
									canvas.height = img.height;
									canvas.width = img.width;
									ctx.drawImage(img,0,0);
									that.uploadImg(canvas.toDataURL('image/png'));
									canvas = null;
								};
								img.src = tempFilePaths[j];
								// #endif

								// #ifndef H5
								that.uploadImg(tempFilePaths[j]);
								// #endif
							})(i)
						}
					}
				});
			}
		},
	}
</script>

<style scoped>
	.saleAddHouseImg_title{
		color:#999;
		font-size:24upx;
		line-height:24upx;
		margin-bottom:36upx;
	}
	.saleAddHouseImg_list{
		flex-wrap: wrap;
	}
	.saleAddHouseImg_add{
		flex-shrink: 0;
		margin-bottom:30upx;
		width:200upx;
		height:200upx;
		position:relative;
		box-sizing:border-box;
		background:#eff0f2;
		border-radius:10upx;
		will-change: transform;
	}
	.saleAddHouseImg_add>image{
		width:56upx;
		height:56upx;
		flex-shrink: 0;
		margin: auto;
	}
	.saleAddHouseImg_item{
		margin-right:30upx;
		margin-bottom:30upx;
		position:relative;
		width:200upx;
		height:200upx;
	}
	.saleAddHouseImg_item>.saleAddHouseImg_item_img{
		width:100%;
		height:100%;
		border-radius:10upx;
		will-change: transform;
		box-sizing:border-box;
		overflow:hidden;
	}
	.saleAddHouseImg_item:nth-child(3n){
		margin-right: 0;
	}
	.saleAddHouseImg_item .delete-img{
		position:absolute;
		top:-9upx;
		right:-11upx;
		width:38upx;
		height:38upx;
	}
</style>
