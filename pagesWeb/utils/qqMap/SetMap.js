

let QQMapWX = require("./qqmap-wx-jssdk");

// 处理后的地图maker点
class DealAfterMaker {
    static dealMap = new Map();

    // item: new GpsItem()
    static setMaker(address = "", item) {
        this.dealMap.set(address, item);
    }

    static getMaker(address = "") {
        return this.dealMap.has(address) ? this.dealMap.get(address) : null;
    }
}

export class GpsItem {
    lat = null;
    lng = null;
}

export class SetMap {
    qqMapSdk = null;
    key = "AEMBZ-PVPWX-ITW4L-TCR25-ZYPO2-WIFQR";
    dealGpsTimeOutVal = null;

    constructor(props) {
        this.initMpa();
    }

    // 获取key
    getKey() {
        return this.key;
    }

    // 设置qq key
    initMpa() {
        this.qqMapSdk = new QQMapWX({
            key: this.key
        });
    }

    // 停止逆解析
    stopDealGps() {
        clearTimeout(this.dealGpsTimeOutVal);
        this.dealGpsTimeOutVal = null;
    }

    // 位置逆解析
    // timeoutVal：延迟时间
    // stop：是否停止逆解析
    getGpsFromAddress(address, timeoutVal, stop = false) {
        if(!address) {
            return Promise.resolve("");
        }

        return new Promise((resolve, reject) => {
            if(DealAfterMaker.getMaker(address)) {
                resolve(DealAfterMaker.getMaker(address));
                return;
            }

            if (stop) {
                this.stopDealGps();
            }
            this.dealGpsTimeOutVal = setTimeout(() => {
                this.qqMapSdk.geocoder({
                    address: address,
                    success: res => {
                        let location = res && res.result ? res.result.location || {} : {};
                        let item = new GpsItem();
                        item.lat = location.lat || null;
                        item.lng = location.lng || null;
                        DealAfterMaker.setMaker(address, item);
                        resolve(item);
                    },
                    fail: err => {
                        resolve("");
                    }
                });
            }, timeoutVal);
        });
    }
}