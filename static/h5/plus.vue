<template></template>

<script>
    class PrivateData {
        static mapVal = null;
        static screenWidth = 0;
        static mapCtx = null;
    }

    export default {
        data() {
            return {
                markers: [
                    {
                        id: 1,
                        latitude: 30.5702000000,
                        longitude: 104.0647600000,
                        alpha: 1,
                        callout: {
                            content: "天府五街",
                            color: "#101d36",
                            fontSize: uni.upx2px(24),
                            borderRadius: uni.upx2px(50),
                            bgColor: "#ffffff",
                            textAlign: "center",
                            padding: 10,
                            display: "ALWAYS",
                        }
                    }
                ],
                lat: 30.5702000000,
                lng: 104.0647600000,
            }
        },
        onReady() {
        },
        onLoad() {
            this.initData();
        },
        methods: {
            createMap() {
                let pages = getCurrentPages();
                let page = pages[pages.length - 1];
                let currentWebview = page.$getAppWebview();
                if (!PrivateData.mapVal) {
                    PrivateData.mapVal = plus.maps.create("map", {
                        top: '0',
                        left: '0px',
                        width: "100%",
                        height: "70%",
                        position: "absolute",
                    });
                    currentWebview.append(PrivateData.mapVal);
                }
                PrivateData.mapVal.reset();
                PrivateData.mapVal.centerAndZoom(new plus.maps.Point(this.lng, this.lat), 16);
                let marker = new plus.maps.Marker(new plus.maps.Point(this.lng, this.lat));
                marker.setIcon("http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/map/marker_new.png");
                marker.setLabel("HBuilder");
                let bubble = new plus.maps.Bubble("打造最好的HTML5移动开发工具");
                marker.setBubble(bubble, true);
                PrivateData.mapVal.addOverlay(marker);
                setTimeout(() => {
                    // PrivateData.mapVal.clearOverlays();
                }, 2000);

                PrivateData.mapVal.onclick = (point) => {
                    console.error("点击地图", point);
                };
                PrivateData.mapVal.onstatuschanged = (e) => {
                    console.error("地图状态发生改变", e);
                };
            },

            initData() {
                this.createMap();
                this.drawBottomView();
                this.drawTopLeftView();
            },

            // 绘制底部按钮
            drawBottomView() {
                let shareMenu = new plus.nativeObj.View("shareMenu", {
                    bottom: '0px',
                    left: '0px',
                    height: uni.upx2px(220) + "px",
                    width: '100%',
                    backgroundColor: '#ffffff',
                });
                shareMenu.draw([
                    {
                        tag: 'rect',//菜单顶部的分割灰线
                        color: '#f5f5f5',
                        position: {
                            top: '0px',
                            height: '1px'
                        }
                    },
                    {
                        tag: 'font',
                        id: 'sharecancel',//底部取消按钮的文字
                        text: '取消',
                        textStyles: {
                            size: '16px',
                            color: "#ab7f2e"
                        },
                        position: {
                            bottom: '0px',
                            height: '44px'
                        }
                    },
                    {
                        tag: 'rect',//底部取消按钮的顶部边线
                        color: '#f5f5f5',
                        position: {
                            bottom: '45px',
                            height: '1px'
                        }
                    }
                ]);
                shareMenu.show();

                shareMenu.addEventListener("click", function (e) {
                    console.error(e, "111");
                    PrivateData.mapVal.show();
                    console.error("区域", PrivateData.mapVal.getBounds());
                    console.error("地图中心点", PrivateData.mapVal.getCenter());
                    PrivateData.mapVal.getCurrentCenter((state, point) => {
                        console.error("当前中心点", state, point);
                    });
                    console.error("地图显示类型",
                        PrivateData.mapVal.getMapType() == plus.maps.MapType.MAPTYPE_SATELLITE
                            ? "卫星视图" : "街道视图"
                    );
                    PrivateData.mapVal.getUserLocation((state, point) => {
                        console.error("定位信息", state, point);
                    });
                    console.error("缩放级别", PrivateData.mapVal.getZoom());
                    console.error("隐藏地图", PrivateData.mapVal.hide());
                    setTimeout(() => {
                        console.error("显示地图", PrivateData.mapVal.show());
                    }, 1500);
                    console.error("打开用户位置显示", PrivateData.mapVal.showUserLocation(true));
                    console.error("是否打开用户位置显示", PrivateData.mapVal.isShowUserLocation());
                    setTimeout(() => {
                        console.error("隐藏用户位置显示", PrivateData.mapVal.showUserLocation(false));
                    }, 3000);
                    console.error("显示缩放控件", PrivateData.mapVal.showZoomControls(true));
                    console.error("是否显示系统缩放控件", PrivateData.mapVal.isShowZoomControls());
                    setTimeout(() => {
                        console.error("隐藏缩放控件", PrivateData.mapVal.showZoomControls(false));
                    }, 4000);
                });
            },
            // 绘制顶部按钮
            drawTopLeftView() {
                let topLeft = new plus.nativeObj.View("topLeft", {
                    top: '0px',
                    left: '0px',
                    height: "100px",
                    width: "100px",
                    backgroundColor: "#ff5400",
                });
                topLeft.draw([
                    {
                        tag: 'font',
                        id: 'sharecancel',//底部取消按钮的文字
                        text: '取消',
                        textStyles: {
                            size: '16px',
                            color: "#ab7f2e"
                        },
                        position: {
                            bottom: '0px',
                            height: '44px'
                        }
                    }
                ]);
                topLeft.show();
                topLeft.addEventListener("click", (e) => {
                    console.error("缩放", PrivateData.mapVal.setZoom(14));
                });
            }
        }
    }
</script>

<style>
    .cont-view {
        width: 750rpx;
        height: 400rpx;
        background-color: #ff5400;
    }

    .dragLayer {
        width: 750rpx;
        position: fixed;
        background-color: #fff;
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        bottom: 0;
    }

    .nav-view {
        flex-direction: row;
        justify-content: center;
        width: 750rpx;
        box-sizing: border-box;
        margin-top: 26rpx;
    }

    .nav-item {
        width: 220rpx;
        height: 52rpx;
        line-height: 52rpx;
        text-align: center;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #ffffff;
        border-bottom-left-radius: 25rpx;
        border-bottom-right-radius: 25rpx;
        border-top-left-radius: 25rpx;
        border-top-color: #ffffff;
        border-top-width: 1px;
        border-left-color: #ffffff;
        border-left-width: 1px;
        border-right-width: 1px;
        border-right-color: #ffffff;
        border-top-right-radius: 25rpx;
    }

    .nav-text {
        color: #777777;
        font-size: 36rpx;
        font-family: PingFang-SC-Medium;
    }

    .nav-item-active {
        border-bottom-color: #e6e6e6;
        border-top-color: #e6e6e6;
        border-left-color: #e6e6e6;
        border-right-color: #e6e6e6;
    }

    .nav-text-active {
        color: #3072f6;
    }
</style>

