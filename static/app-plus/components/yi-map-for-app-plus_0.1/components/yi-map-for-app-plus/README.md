# MapForAppPlus使用说明
#####具体属性可参考uni-app或小程序的map组件
#####详细的属性和方法说明参见组件注释
```vue
<yi-map-for-app-plus :longitude="position.longitude" :latitude="position.latitude" @markertap="markerClick"/>
```

```ecmascript 6
import YiMapForAppPlus from '@/components/yi-map-for-app-plus/Yi-MapForAppPlus';

export default {
    computed:{
        position(){
            return {
                longitude: 108.88392,
                latitude: 40.339493
            }
        }
    },
    
    methods:{
        markerClick(marker){
            marker.setIcon('/static/my-icon.png');
        }
    }
}

```
