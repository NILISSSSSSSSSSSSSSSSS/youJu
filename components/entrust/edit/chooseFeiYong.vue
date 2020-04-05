<template>
  <view>
    <view class="choose_fei_title" v-if="title">{{ title }}</view>
    <view class="choose_fei_cont f_r_b">
      <view class="choose_fei_item" :class="clickVal == item.fee ? 'choose_fei_item_active global-selecet-box' : ''"
            @click="changeFeiYongBtn(item)"
            v-for="(item, index) in list" :key="index">
        <view class="fee_li_val">
          <text class="fee_li_val_name">{{item.name}}</text>
          <text class="fee_li_val_unit">{{item.unit}}</text>
        </view>

        <view class="fee_li_text" v-if="index == 0">精打细算过日子</view>
        <view class="fee_li_text" v-if="index == 1">重金之下必有勇夫</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ""
      },
      list: {
        type: Array,
        default() {
          return [];
        }
      },
      currentVal: {
        type: String,
        default: ""
      }
    },

    watch: {
      currentVal(newValue, oldValue) {
        this.clickVal = newValue;
      }
    },

    mounted() {
      this.clickVal = this.currentVal;
    },

    created() {
      this.clickVal = this.currentVal;
    },

    data() {
      return {
        clickVal: ""
      }
    },

    methods: {
      changeFeiYongBtn(item) {
        this.clickVal = item.fee;
        this.$emit("onFeiYongChanged", item.fee);
      }
    },
  }
</script>

<style scoped>
  .choose_fei_title {
    text-align: left;
    font-size: 28upx;
    color: #101d36;
    height: 40upx;
    line-height: 40upx;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 28upx;
  }

  .choose_fei_cont {
    position: relative;
    box-sizing: border-box;
  }

  .choose_fei_item {
    width: 100%;
    height: 124upx;
    text-align: center;
    color: #101d36;
    font-size: 28upx;
    background-color: #f1f3f6;
    border-radius: 12upx;
    will-change: transform;
    margin: auto 23upx auto 0;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .choose_fei_cont .choose_fei_item_active {
    background-color: #FFFFFF;
    color: #ab7f2e;
    border: 1upx solid #ab7f2e;
    font-weight: normal;
  }

  .choose_fei_item:last-child {
    margin-right: 0;
  }

  .choose_fei_item_active .fee_li_val {
    color: #101d36;
  }

  .fee_li_val {
    color: #101d36;
    margin-bottom: 2upx;
  }

  .fee_li_val_name {
    font-size: 36upx;
    font-weight: bold;
  }

  .fee_li_val_unit {
    font-weight: normal;
    font-size: 26upx;
    margin-left: 5upx;
  }
</style>
