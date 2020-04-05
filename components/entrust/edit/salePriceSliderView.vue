<template>
	<view>
		<view class="slider_title" v-if="title">{{ title }}</view>
        
		<view class="slider_view">
            <view :style="{left: movePositionLeft > 92 ? 92 + '%' : movePositionLeft + '%',transform: 'translateX(' + (-((movePositionLeft > 92 ? 92 : movePositionLeft)/1.56)/2) + 'px)'}" 
				class="slider_top global-font-color">{{ moveChooseVal }}{{ unit }}</view>
            <view style="height: 60upx;"></view>
            <slider activeColor="#ffd900" backgroundColor="#e6e6e6"
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
				this.sliderVal = this.transSliderHousePriceVal();
				this.movePositionLeft = this.getSliderBiLi(this.moveSliderMinVal
                  , this.moveSliderMaxVal, this.sliderVal);
				this.moveChooseVal = this.currentVal;
			},
			
			
			// 价格 转化尺寸为slider的实际尺寸
			transSliderHousePriceVal() {
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
			
            // slider finish
            sliderFinish(e) {
                if(this.isRequesting) return;
                
                this.sliderPriceMoveChange(e);
            },
            
			// slider change 面积
			sliderAreaMoveChange(e) {
				clearTimeout(sliderMoveChangeTimeOutVal);
				sliderMoveChangeTimeOutVal = null;

				let areaRange = this.list;
				let val = parseInt(e.detail.value);
				sliderMoveChangeTimeOutVal = setTimeout(() => {
					if (!sliderMoveChangeTimeOutVal) return;

					let areaL = 0;
					let areaH = 0;
					let chaVal = 10;
					let unit = "㎡";
					let areaMoveChoose = "";
					let sliderVal = 0;
					let keDuVal = 0;
					let keDuCha = 0;
					if (val >= 100) {
						chaVal = 20;
					}
					if (val > 25) {
						keDuVal = 50;
						sliderVal = 25;
						keDuCha = 20;
					}
					if (val > 75) {
						keDuVal = 70;
						sliderVal = 75;
						keDuCha = 30;
					}
					if (val > 125) {
						keDuVal = 100;
						sliderVal = 125;
						keDuCha = 50;
					}
					if (val > 175) {
						keDuVal = 150;
						sliderVal = 175;
						keDuCha = 50;
					}
					areaL = val+"";
					areaL = areaL.substring(0, areaL.length -1);
					areaL = areaL+"0";
					areaL = parseInt(areaL);
					if (val <= 25) {
						areaH = 50;
						areaL = 0;
						unit = "以下";
						areaMoveChoose = areaH + "㎡" + unit
					}
					if (val >= 225) {
						  areaL = 200;
						  areaH = 0;
						  unit = "以上";
						  areaMoveChoose = areaL + "㎡" + unit;
					}
					if (val > 25 && val < 225) {
						areaL = parseInt(((val - sliderVal) * keDuCha)/50) + keDuVal + "";
						areaL = areaL.substring(0, areaL.length -1);
						areaL = areaL+"0";
						areaL = parseInt(areaL);
						areaH = areaL + chaVal;
						areaMoveChoose = areaL + "-" + areaH + unit;
					}
					
                    this.sliderVal = val;
					this.movePositionLeft = this.getSliderBiLi(this.moveSliderMinVal,this.moveSliderMaxVal,e.detail.value);
					this.moveChooseVal = areaMoveChoose;
					this.$emit("onSliderChanged", {areaMin: areaL, areaMax: areaH, type: this.type});
				}, 50);
			},
			
			// slider change 价格
			sliderPriceMoveChange(e) {
                let that = this;
				clearTimeout(sliderMoveChangeTimeOutVal);
				sliderMoveChangeTimeOutVal = null;

				sliderMoveChangeTimeOutVal = setTimeout(() => {
					if ((!sliderMoveChangeTimeOutVal)) return;

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

					if (this.caseType != 1) {
						houseFloor = houseFloor + "";
						houseFloor = houseFloor.substring(0, houseFloor.length -2);
						houseFloor = houseFloor + "00";
					}
					
                    this.sliderVal = val;
                    this.movePositionLeft = this.getSliderBiLi(this.moveSliderMinVal,this.moveSliderMaxVal,e.detail.value);
                    this.moveChooseVal = houseFloor;
					this.$emit("onSliderChanged", {price: houseFloor, type: this.type});
                    this.isRequesting = false;
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
		/* color: #ab7f2e; */
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

