<template>
	<form report-submit @submit="formSubmit">
		<view class="scroll_box">
			<scroll-view scroll-x>
				<button form-type="submit" hover-class="none"
					@click="maptBtn(item,index)" class="map_item" 
					v-for="(item, index) in mapBtnArr" :key="index">
					<view class="map_img" :class="index === dataIndex ? item.activeClassName : item.defaultClassName"></view>
					<view class="map_text">{{ item.text }}</view>
				</button>
			</scroll-view>
		</view>
	</form>
</template>

<script>
    import { Notification } from "@/utils/Notification.js";
    import { Notify } from "@/utils/Notify.js";
    
	export default {
		data() {
			return {
				dataIndex: 0,
				mapBtnArr: [
                    {
                        text: "公交",
                        type: "transit",
						activeClassName: "transit_map_active",
						defaultClassName: "transit_map_default",
                    },
                    {
                        text: "地铁",
                        type: "subway",
						activeClassName: "subway_map_active",
						defaultClassName: "subway_map_default",
                    },
                    {
                        text: "学校",
                        type: "school",
						activeClassName: "school_map_active",
						defaultClassName: "school_map_default",
                    },
                    {
                        text: "医院",
                        type: "hospital",
						activeClassName: "hospital_map_active",
						defaultClassName: "hospital_map_default",
                    },
                    {
                        text: "银行",
                        type: "bank",
						activeClassName: "bank_map_active",
						defaultClassName: "bank_map_default",
                    },
                    {
                        text: "休闲娱乐",
                        type: "play",
						activeClassName: "play_map_active",
						defaultClassName: "play_map_default",
                    },
                    {
                        text: "购物",
                        type: "shop",
						activeClassName: "shop_map_active",
						defaultClassName: "shop_map_default",
                    },
                    {
                        text: "餐饮",
                        type: "eat",
						activeClassName: "eat_map_active",
						defaultClassName: "eat_map_default",
                    },
                    {
                        text: "运动健身",
                        type: "sport",
						activeClassName: "sport_map_active",
						defaultClassName: "sport_map_default",
                    }
                ],
			};
		},
        
        props: {
            currentIndex: {
                type: Number,
                default: 0
            }
        },
		
		watch: {
			currentIndex(newValue, oldValue) {
				this.dataIndex = newValue;
			}
		},
		
		mounted() {
			this.dataIndex = this.currentIndex;
			new this.InitFormSubmit(this);
		},
        
        methods: {
            maptBtn(item,index) {
                new Notification().postNotification(Notify.NearInfoMapBtnChanged.Name, {item: item, index: index});
                if(this.dataIndex <0) return;
                
                this.dataIndex = index;
            }
        }
	}
</script>

<style scoped>
    .scroll_box{
        width: 100%;
        overflow: hidden;
        background: #fff;
        white-space: nowrap;
        padding: 20upx 30upx;
        box-sizing: border-box;
    }
    .map_item{
        display: inline-block;
        width: 100upx;
        text-align: center;
    }
    .map_img{
        width: 50upx;
        height: 50upx;
        margin: 0 auto;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/near_map_sprites.png)  no-repeat;
		background-size:468px 26px;
    }
	.shop_map_active{height:26px;width:26px;background-position:0 0;}
	.sport_map_default{height:26px;width:26px;background-position:-26px 0;}
	.school_map_active{height:26px;width:26px;background-position:-52px 0;}
	.shop_map_default{height:26px;width:26px;background-position:-78px 0;}
	.sport_map_active{height:26px;width:26px;background-position:-104px 0;}
	.transit_map_default{height:26px;width:26px;background-position:-130px 0;}
	.transit_map_active{height:26px;width:26px;background-position:-156px 0;}
	.subway_map_default{height:26px;width:26px;background-position:-182px 0;}
	.subway_map_active{height:26px;width:26px;background-position:-208px 0;}
	.eat_map_default{height:26px;width:26px;background-position:-234px 0;}
	.eat_map_active{height:26px;width:26px;background-position:-260px 0;}
	.bank_map_default{height:26px;width:26px;background-position:-286px 0;}
	.bank_map_active{height:26px;width:26px;background-position:-312px 0;}
	.hospital_map_default{height:26px;width:26px;background-position:-338px 0;}
	.play_map_active{height:26px;width:26px;background-position:-364px 0;}
	.school_map_default{height:26px;width:26px;background-position:-390px 0;}
	.hospital_map_active{height:26px;width:26px;background-position:-416px 0;}
	.play_map_default{height:26px;width:26px;background-position:-442px 0;}
    .map_text{
        font-size:24upx;
        text-align:center;
        margin: 0 auto 0;
    }
</style>
