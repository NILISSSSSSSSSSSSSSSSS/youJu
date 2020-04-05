<template>
	<form report-submit @submit="formSubmit">
		<view class="build_des_view">
			<view class="f_r_s build_des">
				<view class="f_r_s build_des_item">
					<view class="f_r_b build_des_title four_view">物业类别:</view>
					<view class="build_des_hide">{{ item.wuYeType || "--" }}</view>
				</view>

				<view class="f_r_s build_des_item">
					<view class="f_r_b build_des_title four_view">建筑类型:</view>
					<view class="build_des_hide">{{ item.jianZhuType || "--" }}</view>
				</view>

				<view class="f_r_s build_des_item">
					<view class="f_r_b build_des_title four_view">产权年限:</view>
					<view class="build_des_hide">{{ item.chanQuanNianXIan || "--" }}</view>
				</view>

				<view class="f_r_s build_des_item">
					<view class="f_r_b build_des_title three_view">物业费:</view>
					<view class="build_des_hide">{{ item.wuYeFei || "--" }}</view>
				</view>

				<view class="f_r_s build_des_item">
					<view class="f_r_b build_des_title three_view">绿化率:</view>
					<view class="build_des_hide">{{ item.luHuaLv || "--" }}</view>
				</view>

				<view class="f_r_s build_des_item">
					<view class="f_r_b build_des_title three_view">容积率:</view>
					<view class="build_des_hide">{{ item.rongJiLv || "--" }}</view>
				</view>

				<view v-if="isLookMore" style="width: 100%;" class="f_r_s flex_wap">
					<view class="f_r_b build_des_title four_view">竣工时间:</view>
					<view class="">{{ item.junGongTime || "--" }}</view>
				</view>

				<view v-if="isLookMore" style="width: 100%;" class="margin_bottom_20">
					<text class="f_r_b build_des_title three_view">开发商:</text>
					<text class="">{{ item.kaiFaShang || "--" }}</text>
				</view>

				<view v-if="isLookMore" style="width: 100%;" class="margin_bottom_20">
					<text class="build_des_title four_view">物业公司:</text>
					<text class="">{{ item.wuYeGongSi || "--" }}</text>
				</view>

				<view v-if="isLookMore" style="width: 100%;" class="margin_bottom_20">
					<text class="build_des_title four_view">小区概况:</text>
					<text class="build_more">{{ item.xiaoQuGaiKuang || "--" }}</text>
				</view>
			</view>

			<button form-type="submit" hover-class="none"
				@click="lookMore" class="more_btn f_r_c">
				<image :class="{ lookMoreActive : isLookMore }"
					mode="aspectFill"
					src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/filter_btn_nomal.png"></image>
			</button>
		</view>
	</form>
</template>

<script>
    export class BuildDesItem {
        wuYeType = "";  // 物业类别
        jianZhuType = "";  // 建筑类型
        chanQuanNianXIan = "";  // 产权年限
        wuYeFei = "";  // 物业费
        luHuaLv = ""; // 绿化率
        rongJiLv = "";  // 容积率
        junGongTime = "";  // 竣工时间
        kaiFaShang = "";  // 开发商
        wuYeGongSi = "";  // 物业公司
        xiaoQuGaiKuang = "";  // 小区概况
    }

	export default {
		data() {
			return {
				isLookMore: false
			};
		},

        props: {
        	item: {
        		type: Object,
        		default: {}
        	},
        },

		mounted() {
			new this.InitFormSubmit(this);
		},

        methods: {
        	lookMore() {
        		this.isLookMore = !this.isLookMore;
				this.PlatformUserBehavior.villageMore();
        	}
        },
	}
</script>

<style scoped>
	.margin_bottom_20{
		margin-bottom: 20upx;
	}
    .build_des_view{
        width: 100%;
        padding: 0 40upx;
        box-sizing: border-box;
    }
    .build_des{
        width:100%;
		box-sizing:border-box;
		background:#fff;
		flex-wrap: wrap;
		box-sizing: border-box;
		margin-top: 8upx;
		font-size: 32upx;
		color: #101D36;
    }
    .build_des_item{
        width:50%;
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow:hidden;
		text-align: left;
		line-height: 66upx;
    }
    .flex_wap{
        flex-wrap: wrap;
        width:50%;
        margin-bottom: 20upx;
    }
    .build_des_title{
        color: #8E94A1;
        font-size: 32upx;
        margin-right: 17upx;
        flex-shrink: 0;
		display: inline-block;
		width: 146upx;
		text-align: left;
    }
	.build_more{
		font-size: 32upx;
		color: #101D36;
        line-height: 1.5;
	}
    .four_view text{
        margin-left: 4upx;
    }
    .three_view text{
        margin-left: 20upx;
    }
    .build_des_hide{
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    }
   .more_btn{
		height: 40upx;
		line-height: 40upx;
		width: 100%;
		margin-top: 18upx;
		flex-shrink: 0;
   }
   /* .more_btn view{
		margin: auto;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png)  no-repeat;
		background-size:242px 40px;
		height:9px;
		width:9px;
		background-position:-23px 0;
   } */
   .more_btn .lookMoreActive{
		transform:rotate(-180deg);
   }
</style>
