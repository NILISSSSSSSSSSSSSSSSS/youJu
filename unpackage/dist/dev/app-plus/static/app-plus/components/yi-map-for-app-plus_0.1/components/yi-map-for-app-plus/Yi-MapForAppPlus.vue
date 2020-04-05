<template></template>
<script>
    // #ifdef APP-PLUS
    let maps = null;
    let geolocation = null;
    let map = null;
    let currentPositionButton = null;
    let markerArray = null;
    let polylines = null;
    let polygons = null;
    let circles = null;
    let userLocationMarker = null;
    let watchUserLocationId = null;

    /**
     * 使用5+ API实现的基础地图增强版
     * @description 本组件仅部分实现(增强)了uni-app原生map组件的功能，为方便开发者进行二次开发，代码都为比较通俗易懂的
     * @tutorial https://uniapp.dcloud.io/component/map
     * @property {mapStyle} type = [Object] 地图样式对象，top、left、width、height、position
     * @property {longitude} type = [Number] 地图中心经度，同uni-app的map组件
     * @property {latitude} type = [Number] 地图中心纬度，同uni-app的map组件
     * @property {scale} type = [Number] 地图缩放比例，默认值16，同uni-app的map组件
     * @property {zoomControls} type = [Boolean] 原生缩放控件，默认值false，设为true可展示原生的比例缩放控件（5+）
     * @property {currentPositionButton} type = [Boolean] 回到当前位置按钮，默认值false，设为true可在地图左下角展示一个用于回到定位位置的按钮
     * @property {trafficView} type = [Boolean] 是否展示交通情况，默认值false
     * @property {showLocation} type = [Boolean] 是否展示用户当前位置的定位点（无方向指示箭头），默认值false，通过marker模拟实现
     * @property {showLocationNative} type = [Boolean] 是否展示原生用户当前位置的定位点（5+ Maps原生版），默认值false，和showLocation互斥，优先级高于showLocation
     * @property {markers} type = [Array=>Object] 标记点数组，基本等同于uni-app的map组件的markers属性，属性兼容性一致（可支持callout的display属性）
     * @property {polylines} type = [Array=>Object] 折线数组，数组元素属性等同于uni-app的map组件的polyline属性
     * @property {polygons} type = [Array=>Object] 多边形数组，数组元素属性等同于uni-app（小程序）的map组件的polygon属性（不支持zIndex）
     * @property {circles} type = [Array=>Object] 圆形数组，数组元素属性等同于uni-app的map组件的circle属性
     * @event {Function} markertap 点击标记点触发，携带一个参数，为所点击的标记点对象（5+ 原生标记点对象，即可以直接调用Marker的相关方法，如setIcon）
     * @event {Function} callouttap 点击标记点气泡触发，携带一个参数，为所点击的标记点对象（5+ 原生标记点对象，即可以直接调用Marker的相关方法，如setIcon）
     * @event {Function} regionchange 地图视野发生变化时触发，携带一个参数对象，包含地图缩放级别和中心点坐标
     * @event {Function} statuschanged 地图状态变化时触发，为regionchange的5+原生实现，完全等同于regionchange事件
     * @event {Function} tap 点击地图触发，携带一个参数对象，为所点击的坐标点（经纬度）
     * @example <map-for-app-plus :map-style="mapStyle" :longitude="positionCity.longitude" :latitude="positionCity.latitude" :show-location="true" :markers="markers" :traffic-view="true" @markertap="clickMarker" @callouttap="clickCallout" @tap="tapMap"/>
     */

    export default {
        name: "Yi-MapForAppPlus",

        props:{
            /**
             * 地图的基本样式
             * top距离屏幕顶端的距离，单位px
             * left距离屏幕左侧的距离，单位px
             * width地图的宽度，默认100%
             * height地图的高度，默认100%
             * position地图的定位方式，默认static，可选值absolute（页面存在滚动条地图也不随着滚动条滚动，类似于CSS的fixed）
             */
            mapStyle: {
                type: Object,
                default: function(){
                    return {
                        top: 'auto',
                        left: 'auto',
                        width: '100%',
                        height: '100%',
                        position: 'static'
                    }
                }
            },

            /**
             * 地图中心点经度
             * 类型 Number
             * 默认值 天安门广场的经度
             */
            longitude: {
                type: Number,
                default: 116.397434
            },

            /**
             * 地图中心点纬度
             * 类型 Number
             * 默认值 天安门广场的纬度
             */
            latitude: {
                type: Number,
                default: 39.908557
            },

            /**
             * 地图缩放比例
             * 类型 Number
             * 取值范围 1-22
             * 默认值 16
             */
            scale: {
                type: Number,
                default: 16
            },

            /**
             * 是否展示地图原生缩放控件
             * 类型 Boolean
             * 默认值 false
             */
            zoomControls: {
                type: Boolean,
                default: false
            },

            /**
             * 是否展示地图回到当前位置控件
             * 类型 Boolean
             * 默认值 false
             */
            currentPositionButton: {
                type: Boolean,
                default: false
            },

            /**
             * 是否显示交通情况
             * 类型 Boolean
             * 默认值 false
             */
            trafficView: {
                type: Boolean,
                default: false
            },

            /**
             * 是否实时显示用户所在位置
             * 类型 Boolean
             * 默认值 false
             * tips 打开后会增加耗电量，实现原理通过5+ geolocation的监听位置信息变化后改变Marker位置
             */
            showLocation: {
                type: Boolean,
                default: false
            },

            /**
             * 是否实时显示用户所在位置的原生方法，与showLocation互斥，优先级更高
             * 类型 Boolean
             * 默认值 false
             * tips 显示用户位置将打开定位设备
             */
            showLocationNative: {
                type: Boolean,
                default: false
            },

            /**
             * 标记点数组
             * 类型 Array
             * 默认值 []
             * tips 行为同uni-app的map组件的markers属性类似，会动态响应变更
             */
            markers: {
                type: Array,
                default: function(){
                    return [];
                }
            },

            /**
             * 地图上的折线对象们
             * 类型为数组，数组中每一项为对象，对象的属性和属性兼容性等同uni-app的map组件的polyline属性
             * points为数组，数组项为包含折线每一个点经纬度的对象，例如{longitude: 103.773832, latitude: 39.338943}
             * color为8位RGB颜色字符串，后两位为透明度(不透明则不写)，例如#FF000065，表示红色，透明度65%的线段，默认值为100%透明度的黑色
             * width为折线宽度，类型数字，默认值为5
             */
            polylines: {
                type: Array,
                default: function(){
                    return [];
                }
            },

            /**
             * 地图上的多边形对象们
             * 类型为数组
             * 数组中每一项为对象，对象中每一项属性可参考微信小程序map组件的polygon属性(不支持zIndex)
             * 为实现多个多边形而改造
             */
            polygons: {
                type: Array,
                default: function(){
                    return [];
                }
            },

            /**
             * 地图上的圆形对象们
             * 类型为数组
             * 数组中每一项为对象，对象中每一项属性可参考微信小程序map组件的circle属性
             * 为实现多个圆形而改造
             */
            circles: {
                type: Array,
                default: function(){
                    return [];
                }
            }
        },

        computed:{
            /**
             * 处理polyline属性，转换为可用属性
             * 试图兼容uni-app的map组件的polyline属性，属性支持度相同
             * @return {Object}
             */
            validPolylines(){
                let _this = this;
                return _this.polylines.map(item => {
                    let polyline = {};
                    if(item.color && item.color.length === 9){
                        polyline.opacity = item.color.substring(7,9) / 100;
                        polyline.color = item.color.substring(0,7);
                    }
                    else{
                        polyline.opacity = 1;
                        polyline.color = item.color || '#000000';
                    }
                    polyline.width = item.width || 5;
                    polyline.points = item.points.map(item => {
                        return new plus.maps.Point(item.longitude, item.latitude);
                    });

                    return polyline;
                });
            },

            /**
             * 处理polygons属性，转换为可用属性
             * 试图兼容微信小程序的map组件的polygon属性，属性支持度基本相同
             * 同时试图支持多个多边形对象
             * @return {Array}
             */
            validPolygons(){
                let polygons = [], _this = this;
                polygons = _this.polygons.map(item => {
                    let polygon = {};

                    if(item.strokeColor.length === 9){
                        polygon.strokeOpacity = item.strokeColor.substring(7,9) / 100;
                        polygon.strokeColor = item.strokeColor.substring(0,7);
                    }
                    else{
                        polygon.strokeOpacity = 1;
                        polygon.strokeColor = item.strokeColor || '#000000';
                    }
                    if(item.fillColor.length === 9){
                        polygon.fillOpacity = item.fillColor.substring(7,9) / 100;
                        polygon.fillColor = item.fillColor.substring(0,7);
                    }
                    else if(item.fillColor.length === 7){
                        polygon.fillOpacity = 1;
                        polygon.fillColor = item.fillColor || '#000000';
                    }
                    else{
                        polygon.fillOpacity = 0;
                        polygon.fillColor = item.fillColor || '#000000';
                    }
                    polygon.strokeWidth = item.strokeWidth || 5;
                    polygon.points = item.points.map(item => {
                        return new plus.maps.Point(item.longitude, item.latitude);
                    });

                    return polygon;
                });

                return polygons;
            },

            /**
             * 处理circles属性，转换为可用属性
             * 试图兼容微信小程序的map组件的circle属性，属性支持度相同
             * 同时试图支持多个圆形对象
             * @return {Array}
             */
            validCircles(){
                let  _this = this;
                return _this.circles.map(item => {
                    let circle = {};
                    if(item.color.length === 9){
                        circle.strokeOpacity = item.color.substring(7,9) / 100;
                        circle.strokeColor = item.color.substring(0,7);
                    }
                    else{
                        circle.strokeOpacity = 1;
                        circle.strokeColor = item.color || '#000000';
                    }
                    if(item.fillColor.length === 9){
                        circle.fillOpacity = item.fillColor.substring(7,9) / 100;
                        circle.fillColor = item.fillColor.substring(0,7);
                    }
                    else if(item.fillColor.length === 7){
                        circle.fillOpacity = 1;
                        circle.fillColor = item.fillColor || '#000000';
                    }
                    else{
                        circle.fillOpacity = 0;
                        circle.fillColor = item.fillColor || '#000000';
                    }
                    circle.longitude = item.longitude || _this.longitude;
                    circle.latitude = item.latitude || _this.latitude;
                    circle.radius = item.radius || 50;
                    circle.strokeWidth = item.strokeWidth || 5;

                    return circle;
                });
            }
        },

        watch:{
            /**
             * 侦听显示用户位置状态的改变
             */
            'showLocation': function(value){
                if(value && this.showLocationNative === false){
                    this.makeUserLocationMarker();
                    this.onWatchPosition();
                }
                else{
                    this.offWatchPosition();
                }
            },

            /**
             * 侦听原生显示用户位置状态的改变
             */
            'showLocationNative': function(value){
                map.showUserLocation(value);
            },

            /**
             * 侦听地图中心点经度的改变
             */
            'longitude': function(value){
                let point = new maps.Point(value, this.latitude);
                map.setCenter(point);
            },

            /**
             * 侦听地图中心点纬度的改变
             */
            'latitude': function(value){
                let point = new maps.Point(this.longitude, value);
                map.setCenter(point);
            },

            /**
             * 侦听地图缩放级别的改变
             */
            'scale':function(value){
                map.setZoom(value);
            },

            /**
             * 侦听地图原生缩放控件展示的改变
             */
            'zoomControls':function(value){
                map.showZoomControls(value);
            },

            /**
             * 侦听地图交通图状态展示的改变
             */
            'trafficView':function(value){
                map.setTraffic(value);
            },

            /**
             * 侦听markers数组的改变
             * 重新创建markers(为与uni-app的map组件的markers属性行为尽可能一致)
             */
            'markers': function(){
                this.removeMarkers();
                this.createMarkers();
            },

            /**
             * 侦听polyline对象的改变
             * 重新创建polyline折线对象
             */
            'polylines': {
                handler:function(){
                    this.removePolylines();
                    this.createPolylines();
                },
                deep: true
            },

            /**
             * 侦听polygons对象的改变
             * 重新创建polygons多边形对象
             * 与polyline侦听不同的是，polygons侦听只对多边形数量发生变化时给予响应，并不会响应多边形填充颜色等的变化
             */
            'polygons': function(){
                this.removePolygons();
                this.createPolygons();
            },

            /**
             * 侦听circles对象的改变
             * 重新创建circles圆形对象
             * 与polyline侦听不同的是，circles侦听只对圆形数量发生变化时给予响应，并不会响应多边形填充颜色等的变化
             */
            'circles': function(){
                this.removeCircles();
                this.createCircles();
            },

            /**
             * 侦听currentPositionButton的改变
             * 决定是否继续显示回到定位的按钮（不会销毁）
             */
            'currentPositionButton': function(){
                this.createCurrentPositionButton();
            },
        },

        /**
         * 初始化的操作
         */
        mounted(){
            let _this = this;
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            let currentWebview = page.$getAppWebview();                                             //获取当前webview

            maps = plus.maps;
            geolocation = plus.geolocation;

            let point = new maps.Point(_this.longitude, _this.latitude);                            //创建地图初始中心点

            let mapStyle = Object.assign({}, _this.mapStyle, {center: point}, {zoom: _this.scale}); //合并初始化地图参数对象

            map = new maps.Map('map', mapStyle);                                                    //初始化地图

            /**
             * 地图缩放、拖动时向上发送statuschanged和regionchange事件
             * 回调函数的参数对象包含地图中心点的经纬度和地图缩放级别
             * @param event
             */
            map.onstatuschanged = function(event){
                _this.$emit('statuschanged', {zoom: event.zoom, center: event.center});
                _this.$emit('regionchange', {zoom: event.zoom, center: event.center});
            };

            /**
             * 地图点击回调函数，向上发送tap事件
             * 回调函数的参数对象包括点击位置的经纬度坐标
             * @param point
             */
            map.onclick = function(point){
                _this.$emit('tap', point);
            };

            map.showZoomControls(_this.zoomControls);

            map.setTraffic(_this.trafficView);

            currentWebview.append(map);                                                             //添加地图至当前webview

            if(_this.showLocation === true && _this.showLocationNative === false){                  //是否需要初始化用户位置
                _this.makeUserLocationMarker();
                _this.onWatchPosition();
            }
            else if(_this.showLocationNative === true){                                             //开启原生showUserLocation
                map.showUserLocation(true);
            }

            _this.createMarkers();

            _this.createPolylines();

            _this.createPolygons();

            _this.createCircles();

            _this.createCurrentPositionButton();
        },

        /**
         * 卸载地图
         */
        beforeDestroy(){
            if(userLocationMarker !== null){
                map.removeOverlay(userLocationMarker);
                userLocationMarker = null;
            }
            this.removeMarkers();
            this.removePolylines();
            this.removePolygons();
            this.removeCircles();
            this.destroyCurrentPositionButton();
            this.offWatchPosition();
            map.close();
        },

        methods:{
            /**
             * 开启监听位置变更
             * 随着位置变更会更新当前用户所处位置的marker
             * @return {boolean}
             */
            onWatchPosition(){
                if(watchUserLocationId === null){
                    watchUserLocationId = geolocation.watchPosition(function(position){
                        let point = new maps.Point(position.coords.longitude, position.coords.latitude);
                        if(userLocationMarker !== null) userLocationMarker.setPoint(point);
                    });
                    return true;
                }
                return false;
            },

            /**
             * 停止监听位置变更
             * @return {boolean}
             */
            offWatchPosition(){
                if(watchUserLocationId !== null){
                    geolocation.clearWatch(watchUserLocationId);
                    watchUserLocationId = null;
                    return true;
                }
                return false;
            },

            /**
             * 创建回到定位点按钮
             * @return {Boolean}
             */
            createCurrentPositionButton(){
                let _this = this;
                let device_info = uni.getSystemInfoSync();
                if(_this.currentPositionButton === true){
                    if(currentPositionButton === null){
                        currentPositionButton = new plus.nativeObj.View('currentPosition', {
                            width: (83 * _this.upxToPxScale) + 'px',
                            height: (83 * _this.upxToPxScale) + 'px',
                            left: (20 * _this.upxToPxScale) + 'px',
                            top: (parseFloat(_this.mapStyle.height) + parseFloat(_this.mapStyle.top) + (device_info.screenHeight - device_info.windowHeight) - (133 * _this.upxToPxScale)) + 'px'
                        }, [
                            {tag: 'img',id: 'img',src: '/static/yi-map-for-app-plus/current-position.png', position: {top: '0px', left: '0px', width: '100%', height: '100%'}}
                        ]);
                        currentPositionButton.show();
                        currentPositionButton.addEventListener('click', function(){
                            let point;
                            geolocation.getCurrentPosition(function(position){
                                point = new maps.Point(position.coords.longitude, position.coords.latitude);
                                map.centerAndZoom(point, _this.scale);
                            },function(){
                                point = new maps.Point(_this.longitude, _this.latitude);
                                map.centerAndZoom(point, _this.scale);
                            });
                        })
                    }
                    else{
                        currentPositionButton.show();
                    }
                    return true;
                }
                else{
                    if(currentPositionButton !== null){
                        currentPositionButton.hide();
                    }
                    return false;
                }
            },

            /**
             * 销毁回到定位点按钮
             * @return {Boolean}
             */
            destroyCurrentPositionButton(){
                if(currentPositionButton !== null){
                    currentPositionButton.close();
                    return true;
                }
                return false;
            },

            /**
             * 创建用户当前位置marker
             * 可以获取到当前位置时使用当前位置
             * 获取当前位置失败则使用地图中心点坐标
             * @return {boolean}
             */
            makeUserLocationMarker(){
                let _this = this;
                if(userLocationMarker === null){
                    let point;
                    geolocation.getCurrentPosition(function(position){
                        point = new maps.Point(position.coords.longitude, position.coords.latitude);
                        userLocationMarker = new maps.Marker(point);
                        userLocationMarker.setIcon('/static/yi-map-for-app-plus/my-position.png');
                        map.addOverlay(userLocationMarker);
                    },function(){
                        point = new maps.Point(_this.longitude, _this.latitude);
                        userLocationMarker = new maps.Marker(point);
                        userLocationMarker.setIcon('/static/yi-map-for-app-plus/my-position.png');
                        map.addOverlay(userLocationMarker);
                    });
                    return true;
                }
                return false
            },

            /**
             * 创建地图标记点
             * @return {boolean}
             */
            createMarkers(){
                let _this = this;
                if(_this.markers.length){
                    markerArray = _this.markers.map(item => {
                        let point = new maps.Point(item.longitude, item.latitude);  //创建marker中心点
                        let marker = new maps.Marker(point);                        //创建marker对象


                        marker.setIcon(item.iconPath);                              //设置marker图标
                        if(item.label instanceof Object && item.label.content){     //若存在label对象且label对象内容不为空则为此marker创建label
                            marker.setLabel(item.label.content);
                        }
                        marker.markerData = item;                                   //将markers数组对象的内容挂载到marker实例上，以备他用

                        /**
                         * 创建marker点击事件，向上发送markertap事件
                         * 为一定程度上兼容uni-app的map组件(事件名相同，参数不同)
                         * @param markerObject
                         */
                        marker.onclick = function(markerObject){
                            _this.$emit('markertap', markerObject);
                        };

                        if(item.callout instanceof Object){
                            let bubble = new maps.Bubble(item.callout.content);         //创建callout气泡对象
                            let bubbleDisplay = item.callout.display === 'ALWAYS';      //设置气泡是否自动显示，为一定程度兼容uni-app的map组件的callout
                            console.log(bubbleDisplay);
                            marker.setBubble(bubble, bubbleDisplay);                    //设置callout气泡
                            /**
                             * 创建callout点击事件，向上发送callouttap事件
                             * 为一定程度上兼容uni-app的map组件(事件名相同，参数不同)
                             * 事件回调函数的参数等同于markertap事件
                             * @param bubble
                             */
                            bubble.onclick = function(bubble){
                                _this.$emit('callouttap', bubble.belongMarker());
                            };
                        }

                        marker.setDraggable(item.isDraggable || false);             //设置marker的可拖拽属性，默认为false
                        /**
                         * 创建拖拽marker事件，向上发送markerdrag事件
                         * 事件回调函数的参数等同于markertap事件
                         * 可通过marker.getPoint()获取marker坐标
                         * @param marker
                         */
                        marker.onDrag = function(marker){
                            _this.$emit('markerdrag', marker);
                        };

                        map.addOverlay(marker);                                     //添加marker到地图中
                        return marker;
                    });
                    return true;
                }
                return false;
            },

            /**
             * 移除地图标记点
             * @return {boolean}
             */
            removeMarkers(){
                if(markerArray.length){
                    markerArray.forEach(item => {
                        map.removeOverlay(item);
                    });
                    return true;
                }
                return false;
            },

            /**
             * 创建polylines折线对象们并添加进地图
             * @return {boolean}
             */
            createPolylines(){
                let _this = this;
                if(_this.validPolylines.length){
                    polylines = _this.validPolylines.map(item => {
                        let polyline = new maps.Polyline(item.points);
                        polyline.setStrokeColor(item.color);
                        polyline.setStrokeOpacity(item.opacity);
                        polyline.setLineWidth(item.width);

                        map.addOverlay(polyline);

                        return polyline;
                    });

                    return true;
                }
                return false;
            },

            /**
             * 从地图中移除polylines折线对象们
             * @return {boolean}
             */
            removePolylines(){
                if(polylines !== null && polylines.length){
                    polylines.forEach(item => {
                        map.removeOverlay(item);
                    });
                    polylines = null;
                    return true;
                }
                return false;
            },

            /**
             * 创建polygons多边形对象们并添加进地图
             * @return {boolean}
             */
            createPolygons(){
                let _this = this;
                if(_this.validPolygons.length){
                    polygons = _this.validPolygons.map(item => {
                        let polygon = new maps.Polygon(item.points);
                        polygon.setStrokeColor(item.strokeColor);
                        polygon.setStrokeOpacity(item.strokeOpacity);
                        polygon.setFillColor(item.fillColor);
                        polygon.setFillOpacity(item.fillOpacity);
                        polygon.setLineWidth(item.width);

                        map.addOverlay(polygon);

                        return polygon;
                    });

                    return true;
                }
                return false;
            },

            /**
             * 从地图中移除polygons多边形对象们
             * @return {boolean}
             */
            removePolygons(){
                if(polygons !== null && polygons.length){
                    polygons.forEach(item => {
                        map.removeOverlay(item);
                    });
                    polygons = null;
                    return true;
                }
                return false;
            },

            /**
             * 创建circles圆形对象们并添加进地图
             * @return {boolean}
             */
            createCircles(){
                let _this = this;
                if(_this.validCircles.length){
                    circles = _this.validCircles.map(item => {
                        let point = new maps.Point(item.longitude, item.latitude);
                        let circle = new maps.Circle(point, item.radius);
                        circle.setStrokeColor(item.strokeColor);
                        circle.setStrokeOpacity(item.strokeOpacity);
                        circle.setFillColor(item.fillColor);
                        circle.setFillOpacity(item.fillOpacity);
                        circle.setLineWidth(item.strokeWidth);

                        map.addOverlay(circle);

                        return circle;
                    });
                    return true;
                }
                return false;
            },

            /**
             * 从地图中移除circles圆形对象们
             * @return {boolean}
             */
            removeCircles(){
                if(circles !== null && circles.length){
                    circles.forEach(item => {
                        map.removeOverlay(item);
                    });
                    circles = null;
                    return true;
                }
                return false;
            }
        }
    }

    class MapTools{
        /**
         * 计算坐标点是否在多边形内
         * @param point 坐标点，必须包含longitude[经度]和latitude[纬度]两个属性
         * @param polygon 多边形顶点数组，每一项为构成多边形的顶点坐标，同样为longitude和latitude属性
         * @return {boolean} 点在多边形内返回true，否则返回false
         */
        static pointInPolygon(point, polygon){
            for(var result = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i)
                ((polygon[i].latitude <= point.latitude && point.latitude < polygon[j].latitude) || (polygon[j].latitude <= point.latitude && point.latitude < polygon[i].latitude)) && (point.longitude < (polygon[j].longitude - polygon[i].longitude) * (point.latitude - polygon[i].latitude) / (polygon[j].latitude - polygon[i].latitude) + polygon[i].longitude) && (result = !result);
            return result;
        }

        /**
         * 计算坐标点是否在多个多边形中的任意一个内
         * @param point 坐标点，必须包含longitude[经度]和latitude[纬度]两个属性
         * @param polygons 多个多边形顶点数组，为多边形顶点数组构成的二维数组
         * @return {boolean} 点在任意一个多边形内则返回true，否则返回false
         */
        static pointInPolygons(point, polygons){
            for(let item of polygons){
                if(MapTools.pointInPolygon(point, item) === true){
                    return true;
                }
            }
            return false;
        }
    }

    // export {MapTools};
    // #endif
</script>
