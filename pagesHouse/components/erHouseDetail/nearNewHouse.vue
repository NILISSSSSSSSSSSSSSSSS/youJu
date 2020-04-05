<template>
	<view class="near_new_house">
		<block v-for="(item, index) in list" :key="index">
			<new-house-list-item :item="item"></new-house-list-item>
		</block>
	</view>
</template>

<script>
	import newHouseListItem from "@/components/newHouseListItem.vue";
	
	export default {
		data() {
			return {
				
			};
		},
		
		components: {
			newHouseListItem
		},
        
        props: {
        	list: {
        		type: Array,
        		default: []
        	},
        },
        
        watch: {
        	list(newValue, oldValue) {
        		
        	}
        }
	}
</script>

<style scoped>
   .near_new_house{
	   margin-top: -40upx;
	   padding: 0 40upx;
	   margin-bottom: -2upx;
	   box-sizing: border-box;
	   overflow: hidden;
   }
</style>
