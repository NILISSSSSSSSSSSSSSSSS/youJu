 ## 说明

输入内容并返回内容的prompt组件

提示名称： title

输入类型：inputType

默认值：defaultValue

input逻辑处理方法名称： func

输入最大长度：maxlength

主色：themeColor


## 用法

**父组件**

```html
<template>
	<view>
		<yomol-prompt :title="promptTitle" :inputType="promptInputType" :maxlength="maxlength" :defaultValue="promptDefaultValue" :func="promptFunc" ref="yomolPrompt" @onConfirm="onPromptConfirm"></yomol-prompt>
	</view>
</template>
```

```js
<script>
	import yomolPrompt from '@/components/yomol/yomol-prompt.vue'
	export default {
		components:{
			yomolPrompt
		},
		data() {
			return {
				promptTitle: '提示',
				promptDefaultValue: '',
				promptInputType: 'text',
				promptFunc: "", //空值不执行
				maxlength: 18,
			}
		},
		onBackPress() {
			if(this.$refs.yomolPrompt.visible){
				this.$refs.yomolPrompt.hide()
				return true
			}
		},
		onLoad呢(e) {
			//自定义input处理事件监听
			uni.$on('update-prompt',(data)=>{
				// data.value input输入值
				// data.callback 处理后返回方法名
				let val = data.value
				//逻辑处理
				
				uni.$emit(e.callback,val)
			})
		},
		onUnload呢() {
			/* 移除事件监听 */
			uni.$off('update-prompt')
		},
		methods: {
			/* 
			* 打开提示框
			*/
			onOpenPromptClick() {
				this.promptTitle = '修改名称' //提示名称
				this.promptDefaultValue = 'yomol' //默认值
				this.promptInputType = 'text' //输入类型 同Input组件
				this.maxlength = 18 //最大长度
				this.promptFunc = "update-prompt" //将定义好的处理逻辑名传给组件回调
				this.$refs.yomolPrompt.show()
			},
			/* 
			* 输入内容
			*/
			onPromptConfirm(e){
				console.log(e);
			}
		}
	}
</script>
```