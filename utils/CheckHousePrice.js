

// 价格单位处理策略
class PriceUnitStrategy {
    static moRen = 0;
    static monthDays = 30;

    static unitMap = new Map([
       ["元/月", "yuan_month"]
       ,["元/天", "yuan_day"]
       ,["元/平米*月", "yuan_m_month"]
       ,["元/平米*天", "yuan_m_day"]
       ,["元/年", "yuan_year"]
    ]);

    constructor(unit, price, area) {
        this.unit = unit;
        this.price = Number(price);
        this.area = Number(area);
    }

    getMonthDays() {
        return PriceUnitStrategy.monthDays;
    }

    getUnit() {
        return this.unit;
    }

    getPrice() {
        return this.price;
    }

    getArea() {
        return this.area;
    }

    yuan_month() {
        return this.getPrice();
    }

    yuan_day() {
        return this.getPrice() * this.getMonthDays();
    }

    yuan_m_month() {
        if (!this.getArea()) return PriceUnitStrategy.moRen;

        return this.getPrice() * this.getArea();
    }

    yuan_m_day() {
        if (!this.getArea()) return PriceUnitStrategy.moRen;

        return this.getPrice() * this.getMonthDays() * this.getArea();
    }

    yuan_year() {
        if (!this.getArea()) return PriceUnitStrategy.moRen;

        return this.getPrice()/12;
    }

    returnPrice() {
        if (!PriceUnitStrategy.unitMap.has(this.getUnit())) {
            return this.getPrice();
        }

        return this[PriceUnitStrategy.unitMap.get(this.getUnit())]();
    }
}

class CheckPriceItem {
    min = 0;
    max = 0;
    unit = "平米/月";
    area = 0;
    currentPrice = 0;
}
class CheckPriceDefault {
    constructor(item) {
        if (!item) {
            throw new Error("请配置item");
        }

        this.monthDays = 30;
        this.item = item;
        this.initItem();
    }

    initItem() {
        let item = this.item;
        item.min = Number(item.min);
        item.max = Number(item.max);
        item.area = Number(item.area);
        item.currentPrice = Number(item.currentPrice);
        this.item = item;
    }

    getMonthDays() {
        return this.monthDays;
    }

    getMin() {
        return this.item.min;
    }

    getMax() {
        return this.item.max;
    }

    getUnit() {
        return this.item.unit;
    }

    getArea() {
        return this.item.area;
    }

    getCurrentPrice() {
        return new PriceUnitStrategy(this.getUnit(), this.item.currentPrice, this.getArea()).returnPrice();
    }

    // 统一转化为元/月
    getMaxPrice() {
        if (!this.getUnit()) return 0;

        return this.getMax() * this.getArea();
    }

    getMinPrice() {
        if (!this.getUnit()) return 0;

        return this.getMin() * this.getArea();
    }

    minMaxIsMeet() {
        if (this.getMaxPrice() <= 0 || this.getMin() <= 0) {
            return false;
        }

        if (this.getMinPrice() > this.getCurrentPrice()
            || this.getMaxPrice() < this.getCurrentPrice()) {
            return false;
        }

        return true;
    }
}

// 房源类型 根据 CheckFactoryType 会动态初始化实例
class CheckZhuZhai extends CheckPriceDefault{
    constructor(item) {
        if (!item) {
            throw new Error("请配置item");
        }

        item.min = 3;
        item.max = 75;
        super(item);
    }
}
class CheckBieShu extends CheckPriceDefault{
    constructor(item) {
        if (!item) {
            throw new Error("请配置item");
        }

        item.min = 30;
        item.max = 300;
        super(item);
    }
}
class CheckShangPu extends CheckPriceDefault{
    constructor(item) {
        if (!item) {
            throw new Error("请配置item");
        }

        item.min = 20;
        item.max = 1200;
        super(item);
    }
}
class CheckXieZiLou extends CheckPriceDefault{
    constructor(item) {
        if (!item) {
            throw new Error("请配置item");
        }

        item.min = 20;
        item.max = 300;
        super(item);
    }
}

const CheckFactoryType = {
  1: CheckZhuZhai  // 住宅
  ,2: CheckBieShu  // 别墅
  ,3: CheckShangPu  // 商铺
  ,4: CheckXieZiLou  // 写字楼
};


// 调用方只需要关注这个类， 其他的无需关注
export class CheckHousePrice {
    static moRen = 0;

	// 参数类型
	// type：房源类型，具体看 CheckFactoryType 这个常量
	// area：房源面积
	// currentPrice： 当前的价格 例如：1000元/月的1000
	// unit： 价格的单位 例如：1000元/月的元/月
	// 返回值：如果价格合理会但会传入的currentPrice，否则会返回0
    static getPrice(type, area, currentPrice, unit) {
        if (!currentPrice) return this.moRen;

        if (!area) return this.moRen;

        if (!CheckFactoryType[type]) return currentPrice;

        let item = new CheckPriceItem();
        item.area = area;
        item.currentPrice = currentPrice;
        item.unit = unit || "元/月";
        let minMaxIsMeet = new CheckFactoryType[type](item).minMaxIsMeet();
        return minMaxIsMeet ? currentPrice : this.moRen;
    }
}
