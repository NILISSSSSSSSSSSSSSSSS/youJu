<template>
	<view class="trend_view">
		<view class="trend_view_cont f_r_b">
			<view class="f_c_c trend_item">
			    <view class="trend_val">{{ itemData.benYueJunJia || "--" }}<text>{{ itemData.priceUnit }}</text></view>
			    <view class="trend_text">本月均价</view>
			</view>
			
			<view class="f_c_c trend_item">
			    <view class="f_r_s">
					<view v-if="itemData.huanBiShangYueAdd" class="trend_up"></view>
					<view v-else class="trend_down"></view>
					
			        <view class="trend_val">{{ itemData.huanBiShangYue || "--" }}</view>
			    </view>
			    <view class="trend_text">环比上月</view>
			</view>
			
			<view class="f_c_c trend_item">
			    <view class="f_r_s">
					<view v-if="itemData.tongBiQuNianAdd" class="trend_up"></view>
					<view v-else class="trend_down"></view>
					
			        <view class="trend_val">{{ itemData.tongBiQuNian || "--" }}</view>
			    </view>
			    <view class="trend_text">同比去年</view>
			</view>
		</view>
	</view>
</template>

<script>
    export class PriceTrendItem {
        benYueJunJia = "";  // 本月均价
		priceUnit = "元/㎡";  // 均价单位
		baiFenBiUnit = "%";  // 环比的单位
        huanBiShangYue = "";  // 环比上月
        huanBiShangYueAdd = false; // 环比上月是否增加
        tongBiQuNian = "";  // 同比去年
        tongBiQuNianAdd = false; // 同比去年是否增加
    }
    
	export default {
		data() {
			return {
				upIconUrl: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/up.png?t=20190219",
				downIconUrl: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/down.png?t=20190219"
			};
		},
		props: {
			item: {
				type: Object,
				default: {}
			},
		},
		computed: {
			itemData: function () {
				this.item.huanBiShangYue = this.item.huanBiShangYue? (this.item.huanBiShangYue*100).toFixed(2) + "%": '';
				this.item.tongBiQuNian = this.item.tongBiQuNian? (this.item.tongBiQuNian*100).toFixed(2) + "%": '';
				return this.item;
			}
		},
	}
</script>

<style scoped>
    .trend_view{
        margin: 10upx 0 7upx;
        padding: 0 40upx;
        box-sizing: border-box;
		height: 200upx;
    }
	.trend_view_cont{
		height: 100%;
		width: 100%;
		background: #FFFFFF;
		border-radius: 6upx;
		border: 1upx solid #F5F5F5;
	}
	
    .trend_item{
        width: 100%;
		padding-left: 26upx;
		box-sizing: border-box;
        text-align: left;
    }
		.trend_item::before{
			content: "";
			width: 1px;
			height: 78upx;
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			background: #ebebeb;
		}
		.trend_item:last-child::before {
			display: none;
		}
    .trend_val{
        font-size: 44upx;
		font-weight: bold;
        color: #101D36;
        margin-bottom: 10upx;
    }
	.trend_val text{
		font-size: 26upx;
		font-weight: normal;
		margin-left: 5upx;
	}
	.trend_item:first-child .trend_val text{
		white-space: nowrap;
	}
    .trend_text{
        font-size:22upx;
        color:#8E94A1;
    }
    .trend_up{
			margin: auto 10upx auto 0;
			flex-shrink: 0;
			background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png)  no-repeat;
			background-size: 242px 40px;
			height: 7px;
			width: 8px;
			background-position: -6px 0;
    }
    .trend_down{
			margin: auto 10upx auto 0;
			flex-shrink: 0;
			background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png)  no-repeat;
			background-size:242px 40px;
			height:7px;
			width:9px;
			background-position:-14.5px 0;
    }
</style>
