<template>
	<view>
		<view class="slider_title" v-if="title">{{ title }}</view>
		
		<view class="slider_view">
            <view :style="{left: movePositionLeft + '%'}"
				class="slider_top">{{ moveChooseVal }}{{ unit }}</view>
            <view style="height: 60upx;"></view>
            <slider activeColor="#ab7f2e" backgroundColor="#e6e6e6"
                    class="slider_cont"
                    :value="sliderVal"
                    @changing="sliderChange"
                    @change="sliderFinish"
                    :min="moveSliderMinVal"
                    :max="moveSliderMaxVal"/>
            <view class="scroll-bg-text">
              <view class="scroll-bg-text-ul">
                <view style="height: 10px;flex-shrink: 0;"></view>
                <view v-for="(item, index) in list" :key="index"
                      class="scroll-bg-text-li">{{ item }}{{ unit }}</view>
                <view style="height: 10px;flex-shrink: 0;"></view>
              </view>
            </view>
          </view>
	</view>
</template>

<script>
	let sliderEventMap = {
		area: {
			slider: "sliderAreaMoveChange",
			init: "initArea",
			up: "upAreaSlider"
		},
		price: {
			slider: "sliderPriceMoveChange",
			init: "initPrice",
			up: "upPriceSlider"
		},
		louCeng: {
			slider: "sliderLouCengMoveChange",
			init: "initLouCeng",
			up: "upLouCengSlider"
		}
	};
	let sliderMoveChangeTimeOutVal = null;
	
	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
			currentVal: {
				type: String | Number,
				default: ""
			},
			list: {
				type: Array,
				default: []
			},
			type: {
				type: String,
				default: ""
			},
			unit: {
				type: String,
				default: ""
			},
			caseType: {
				type: String | Number,
				default: ""
			}
		},
		
		data() {
			return {
                isRequesting: false,
				sliderVal: "",
				movePositionLeft: 0,
				moveChooseVal: "",
				moveSliderMinVal: 0,
				moveSliderMaxVal: 250,
			}
		},
		
		watch: {
			currentVal(newValue, oldValue) {
				this.initId();
			}
		},
		
		mounted() {
			this.initId();
		},

        created() {
            this.initId();
        },
		
		methods: {
			initId() {
				this.sliderVal = this.currentVal;
				if(this.list.length == 0) return;
				
				this[sliderEventMap[this.type].init]();
				this[sliderEventMap[this.type].up]();
			},
			
			// 初始化面积参数
			initArea() {
				this.moveSliderMinVal = 0;
				this.moveSliderMaxVal = 250;
			},
			// 初始化价格参数
			initPrice() {
				this.moveSliderMinVal = 0;
				this.moveSliderMaxVal = 380;
			},
			// 初始化楼层参数
			initLouCeng() {
				if(this.list.length == 0) return;
				
				this.moveSliderMinVal = this.list[0];
				this.moveSliderMaxVal = this.list[this.list.length - 1];
			},
			
			// 处理面积slider
			sliderChange(e) {
                this.isRequesting = true;
				this[sliderEventMap[this.type].slider](e);
			},
			
			// 更新初始化slidr 面积
			upAreaSlider() {
				this.sliderVal = this.currentVal;
				this.sliderAreaMoveChange({detail: {value: this.sliderVal}});
			},
			// 更新初始化slider价格
			upPriceSlider() {
				this.sliderVal = this.currentVal;
				this.sliderPriceMoveChange({detail: {value: this.transSliderHousePriceVal()}});
			},
			// 更新初始化slider楼层
			upLouCengSlider() {
				let val = this.transSliderLouCengval();
				
				this.movePositionLeft = val;
				this.sliderVal = val;
				this.moveChooseVal = this.currentVal;
				this.$emit("onSliderChanged", {louCeng: this.currentVal, type: this.type});
			},
			
			
			// 楼层 转化尺寸为slider的实际尺寸
			transSliderLouCengval() {
				let val = parseInt(this.currentVal);
				let currentFloorMoveVal = 0;
				let floorRange = this.list;
				let floorRangeFirstVal = parseInt(floorRange[0]);
				let floorRangeLastVal = parseInt(floorRange[floorRange.length - 1]);
				let sliderBiLi = (floorRangeLastVal - floorRangeFirstVal)/(floorRange.length);
				let banBiLi = sliderBiLi/2;
				if (val <= floorRangeFirstVal) {
					currentFloorMoveVal = floorRangeFirstVal;
				}
				if (val > floorRangeFirstVal) {
					currentFloorMoveVal = parseInt(( sliderBiLi * (val - floorRange[0]))
						/(floorRange[1] - floorRange[0])) + (banBiLi+floorRange[0]);
				}
				if (val > floorRange[1]) {
					currentFloorMoveVal = parseInt(( sliderBiLi * (val - floorRange[1]))
						/(floorRange[2] - floorRange[1]))+ (banBiLi*3+floorRange[0]);
				}
				if (val > floorRange[2]) {
					currentFloorMoveVal = parseInt(( sliderBiLi * (val - floorRange[2]))
						/(floorRange[3] - floorRange[2]))+ (banBiLi*5+floorRange[0]);
				}
				if (val > floorRange[3]) {
					currentFloorMoveVal = parseInt(( sliderBiLi * (val - floorRange[3]))
						/(floorRange[4] - floorRange[3]))+ (banBiLi*7+floorRange[0]);
				}
				if (val >= floorRangeLastVal) {
					currentFloorMoveVal = floorRange[4];
				}
				return currentFloorMoveVal;
			},
			// 价格 转化尺寸为slider的实际尺寸
			transSliderHousePriceVal() {
				let val = parseInt(this.sliderVal);
				let currentFloorMoveVal = 0;
				let floorRange = this.list;
				let banBiLi = ((Number(this.moveSliderMaxVal) - Number(this.moveSliderMinVal))/5)/2;
				let areaL = 0;
				let areaH = 0;
				let chaVal = 20;
				let unit = this.unit;
				let areaMoveChoose = "";
				let sliderVal = 0;
				let keDuVal = 0;
				let keDuCha = 0;
				if (val >= floorRange[2]) {
					chaVal = 20;
				}
				if (val > floorRange[0]) {
					keDuVal = floorRange[0];
					sliderVal = banBiLi;
					keDuCha = floorRange[1] - floorRange[0];
				}
				if (val > floorRange[1]) {
					keDuVal = floorRange[1];
					sliderVal = floorRange[0] + banBiLi * 1;
					keDuCha = floorRange[2] - floorRange[1];
				}
				if (val > floorRange[2]) {
					keDuVal = floorRange[2];
					sliderVal = floorRange[0] + banBiLi * 3;
					keDuCha = floorRange[3] - floorRange[2];
				}
				if (val > floorRange[3]) {
					keDuVal = floorRange[3];
					sliderVal = floorRange[0] + banBiLi * 5;
					keDuCha = floorRange[4] - floorRange[3];
				}
				if (val > floorRange[4]) {
					keDuVal = floorRange[4];
					sliderVal = floorRange[0] + banBiLi * 7;
					keDuCha = floorRange[4] - floorRange[3];
				}
				if (val <= floorRange[0]) {
					areaL = 0;
					unit += "以下";
					areaMoveChoose = floorRange[0] + unit
				}
				if (val >= floorRange[4]) {
					areaL = this.moveSliderMaxVal;
					unit += "以上";
					areaMoveChoose = floorRange[4] + unit;
				}
				if (val > floorRange[0] && val < floorRange[4]) {
					areaL = parseInt((banBiLi * 2 * (val - keDuVal))/keDuCha) + sliderVal;
					areaH = val + chaVal;
					areaMoveChoose = val + "-" + areaH + unit;
				}
				this.sliderVal = areaL;
				return areaL;
			},
			
            // slider finish
            sliderFinish(e) {
                if(this.isRequesting) return;
                
                this.sliderChange(e);
            },
			
			// slider change 面积
			sliderAreaMoveChange(e) {
				clearTimeout(that.private.sliderHouseAreaChangeTimeOutVal);
				that.private.sliderHouseAreaChangeTimeOutVal = null;

				that.private.sliderHouseAreaChangeTimeOutVal = setTimeout(() => {
				  if (!that.private.sliderHouseAreaChangeTimeOutVal) return;

					let sliderVal = 0;
					let keDuVal = 0;
					let keDuCha = 0;
					let houseFloor = 1;
					let val = parseInt(e.detail.value);
					let floorRange = that.data.hezuAreaRange;
					if (that.data.ishezu == 0) {
						floorRange = that.data.areaRange;
					}
					let floorRangeFirstVal = parseInt(floorRange[0]);
					let floorRangeLastVal = parseInt(floorRange[floorRange.length - 1]);
					let sliderBiLi = (floorRangeLastVal - floorRangeFirstVal)/(floorRange.length);
					let biLiYiBan = sliderBiLi/2;
					if (val > (biLiYiBan + floorRangeFirstVal)) {
						keDuVal = floorRangeFirstVal;
						sliderVal = (biLiYiBan + floorRangeFirstVal);
						keDuCha = floorRange[1] - floorRange[0];
					}
					if (val > (sliderBiLi+floorRangeFirstVal + biLiYiBan)) {
						keDuVal = floorRange[1];
						sliderVal = sliderBiLi+floorRangeFirstVal + biLiYiBan;
						keDuCha = floorRange[2] - floorRange[1];
					}
					if (val > (sliderBiLi*2 + floorRangeFirstVal + biLiYiBan)) {
						keDuVal = floorRange[2];
						sliderVal = sliderBiLi*2 + floorRangeFirstVal + biLiYiBan;
						keDuCha = floorRange[3] - floorRange[2];
					}
					if (val > (sliderBiLi*3 + floorRangeFirstVal + biLiYiBan)) {
						keDuVal = floorRange[3];
						sliderVal = sliderBiLi*3 + floorRangeFirstVal + biLiYiBan;
						keDuCha = floorRange[4] - floorRange[3];
					}
					if (val <= (biLiYiBan + floorRangeFirstVal)) {
						houseFloor = floorRangeFirstVal;
					}
					if (val >= (sliderBiLi*4 + floorRangeFirstVal + biLiYiBan)) {
						houseFloor = floorRangeLastVal;
					}
					if (val > (biLiYiBan + floorRangeFirstVal)
						&& val < (sliderBiLi*4 + floorRangeFirstVal + biLiYiBan)) {
						houseFloor = parseInt(((val - sliderVal) * keDuCha)/sliderBiLi) + keDuVal;
					}
                    
                    this.isRequesting = false;
// 				  that.setData({
// 					houseArea: houseFloor,
// 					houseAreaPositionLeft: that.getSliderBiLi(that.data.houseAreaSliderMinVal,that.data.houseAreaSliderMaxVal,e.detail.value)
// 				  });
				}, 50);
			},
			// slider change 价格
			sliderPriceMoveChange(e) {
				clearTimeout(sliderMoveChangeTimeOutVal);
				sliderMoveChangeTimeOutVal = null;

				let areaRange = this.list;
				let val = parseInt(e.detail.value);
				let caseType = this.caseType;
				sliderMoveChangeTimeOutVal = setTimeout(() => {
					if (!sliderMoveChangeTimeOutVal) return;

					let areaL = 0;
					let areaH = 0;
					let chaVal = 20;
					let unit = "万";
					let areaMoveChoose = "";
					let sliderVal = 0;
					let keDuVal = 0;
					let keDuCha = 0;

					if (caseType != 4) {
						if (val > 38) {
							keDuVal = 80;
							sliderVal = 38;
							keDuCha = 40;
						}
						if (val > 114) {
							keDuVal = 120;
							sliderVal = 114;
							keDuCha = 60;
						}
						if (val > 190) {
							keDuVal = 180;
							sliderVal = 190;
							keDuCha = 60;
						}
						if (val > 266) {
							keDuVal = 240;
							sliderVal = 266;
							keDuCha = 60;
						}

						areaL = val+"";
						if (caseType == 4) {
							areaL = areaL.substring(0, areaL.length -2);
							areaL = areaL + "00";
						}else {
							areaL = areaL.substring(0, areaL.length -1);
							areaL = areaL+"0";
						}
						areaL = parseInt(areaL);
						if (val <= 38) {
							areaH = 80;
							areaL = 0;
							unit = "以下";
							areaMoveChoose = areaH + "万" + unit
						}
						if (val >= 342) {
							areaL = 300;
							areaH = 0;
							unit = "以上";
							areaMoveChoose = areaL + "万" + unit;
						}
						if (val > 38 && val < 342) {
							areaL = parseInt(((val - sliderVal) * keDuCha)/76) + keDuVal + "";
							areaL = areaL.substring(0, areaL.length -1);
							areaL = areaL+"0";
							areaL = parseInt(areaL);
							areaH = areaL + chaVal;
							areaMoveChoose = areaL + "-" + areaH + unit;
						}
					}
					if (caseType == 4) {
						chaVal = 200;
						if (val >= 2000) {
							chaVal = 400;
						}
						if (val >= 3000) {
							chaVal = 700;
						}
						unit = "元";
						if (val > 600) {
							keDuVal = 1000;
							sliderVal = 600;
							keDuCha = 500;
						}
						if (val > 1800) {
							keDuVal = 1500;
							sliderVal = 1800;
							keDuCha = 500;
						}
						if (val > 3000) {
							keDuVal = 2000;
							sliderVal = 3000;
							keDuCha = 1000;
						}
						if (val > 4200) {
							keDuVal = 3000;
							sliderVal = 4200;
							keDuCha = 2000;
						}

						areaL = val+"";
						if (caseType == 4) {
							areaL = areaL.substring(0, areaL.length -2);
							areaL = areaL + "00";
						}else {
							areaL = areaL.substring(0, areaL.length -1);
							areaL = areaL+"0";
						}
						areaL = parseInt(areaL);
						if (val <= 600) {
							areaH = 1000;
							areaL = 0;
							unit = "以下";
							areaMoveChoose = areaH + "元" + unit
						}
						if (val >= 5400) {
							areaL = 5000;
							areaH = 0;
							unit = "以上";
							areaMoveChoose = areaL + "元" + unit;
						}
						if (val > 600 && val < 5400) {
							areaL = parseInt(((val - sliderVal) * keDuCha)/1200) + keDuVal + "";
							areaL = areaL.substring(0, areaL.length -2);
							areaL = areaL+"00";
							areaL = parseInt(areaL);
							areaH = areaL + chaVal;
							areaMoveChoose = areaL + "-" + areaH + unit;
						}
					}

                    this.isRequesting = false;
                    this.sliderVal = val;
					this.movePositionLeft = this.getSliderBiLi(this.moveSliderMinVal,this.moveSliderMaxVal,e.detail.value);
					this.moveChooseVal = areaMoveChoose;
					this.$emit("onSliderChanged", {priceMin: areaL, priceMax: areaH, type: this.type, priceText: areaMoveChoose});
				}, 50);
			},
			// slider change 楼层
			sliderLouCengMoveChange(e) {
				clearTimeout(sliderMoveChangeTimeOutVal);
				sliderMoveChangeTimeOutVal = null;
				sliderMoveChangeTimeOutVal = setTimeout(() => {
				  if (!sliderMoveChangeTimeOutVal) return;

					let sliderVal = 0;
					let keDuVal = 0;
					let keDuCha = 0;
					let houseFloor = 1;
					let val = parseInt(e.detail.value);
					let floorRange = this.list;
					let floorRangeFirstVal = parseInt(floorRange[0]);
					let floorRangeLastVal = parseInt(floorRange[floorRange.length - 1]);
					let sliderBiLi = (floorRangeLastVal - floorRangeFirstVal)/(floorRange.length);
					let biLiYiBan = sliderBiLi/2;
					if (val > (biLiYiBan + floorRangeFirstVal)) {
						keDuVal = floorRangeFirstVal;
						sliderVal = (biLiYiBan + floorRangeFirstVal);
						keDuCha = floorRange[1] - floorRange[0];
					}
					if (val > (sliderBiLi+floorRangeFirstVal + biLiYiBan)) {
						keDuVal = floorRange[1];
						sliderVal = sliderBiLi+floorRangeFirstVal + biLiYiBan;
						keDuCha = floorRange[2] - floorRange[1];
					}
					if (val > (sliderBiLi*2 + floorRangeFirstVal + biLiYiBan)) {
						keDuVal = floorRange[2];
						sliderVal = sliderBiLi*2 + floorRangeFirstVal + biLiYiBan;
						keDuCha = floorRange[3] - floorRange[2];
					}
					if (val > (sliderBiLi*3 + floorRangeFirstVal + biLiYiBan)) {
						keDuVal = floorRange[3];
						sliderVal = sliderBiLi*3 + floorRangeFirstVal + biLiYiBan;
						keDuCha = floorRange[4] - floorRange[3];
					}
					if (val <= (biLiYiBan + floorRangeFirstVal)) {
						houseFloor = floorRangeFirstVal;
					}
					if (val >= (sliderBiLi*4 + floorRangeFirstVal + biLiYiBan)) {
						houseFloor = floorRangeLastVal;
					}
					if (val > (biLiYiBan + floorRangeFirstVal)
						&& val < (sliderBiLi*4 + floorRangeFirstVal + biLiYiBan)) {
						houseFloor = parseInt(((val - sliderVal) * keDuCha)/sliderBiLi) + keDuVal;
					}
					
                    this.isRequesting = false;
                    this.sliderVal = val;
					this.movePositionLeft = e.detail.value;
					this.moveChooseVal = houseFloor;
					this.$emit("onSliderChanged", {louCeng: houseFloor, type: this.type});
				}, 50);
			},
			
			getSliderBiLi(x,y,val) {
				return (100*parseInt(val-x))/parseInt(y-x);
			}
		},
	}
</script>

<style scoped>
	.slider_title{
		text-align:left;
		font-size:28upx;
		color:#101d36;
		height:40upx;
		line-height:40upx;
		position:relative;
		box-sizing:border-box;
		margin-bottom: 28upx;
	}
	.slider_view{
		position: relative;
		padding: 40upx 0 0;
		box-sizing: border-box;
	}
	.slider_cont{
		padding: 0;
		margin: 0;
	}
	.slider_top{
		color: #ab7f2e;
		font-size: 40upx;
		text-align: left;
		position: absolute;
		top: 20upx;
		left: 0;
		white-space: nowrap;
	}
	.slider_top text{
		font-size: 28upx;
	}
	.scroll-bg-text{
		height: 40upx;
		line-height: 40upx;
		margin-top: 25upx;
	}
	.scroll-bg-text-ul{
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
	}
	.scroll-bg-text-li{
		text-align: center;
		font-size: 22upx;
		color: #999;
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		white-space: nowrap;
	}
	.scroll-bg-text-li:first-child{
		text-align: left;
	}
	.scroll-bg-text-li:last-child{
		text-align: right;
	}
</style>

