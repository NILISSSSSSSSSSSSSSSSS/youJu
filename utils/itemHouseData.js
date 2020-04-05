

import { ErHouseListItem } from '@/utils/Const.js';

// 处理房源列表数据方法
export class ItemHouseData {
	itemData(item) {
		let itemBuild = new ErHouseListItem();
		
		if(item.houseHall == undefined || item.houseHall == 0){
			item.houseHall = '';
		}
		if(item.houseRoom == 0){
			item.houseRoom = ''
		}
		if(item.hotNum == undefined){
			item.hotNum = '';
		}
		if(item.priceUnit){
			item.priceUnit = item.priceUnit.replace(/[0-9]/ig,"");
		}
		let priceUnit = item.priceUnit?item.priceUnit:'万'
		if(item.caseType == 2){
			priceUnit = item.priceUnitCn?item.priceUnitCn:'元/月'
		}
		
		if(item.houseRoom !== undefined){
			item.houseRoom = item.houseRoom.replace(/[&\|\\\*^%$#@\-]/g,"");
		}
		item.houseHall = item.houseHall.replace(/[&\|\\\*^%$#@\-]/g,"");
		
		let houseRoom = item.houseRoom && parseInt(item.houseRoom) ?item.houseRoom+'室':'';
		let houseHall = item.houseHall && parseInt(item.houseHall)?item.houseHall+'厅':'';
		
		itemBuild.buildId = item.buildId;
    itemBuild.houseId = item.houseId;
		itemBuild.houseUseage=item.houseUseage?item.houseUseage:"";//房屋用途
    itemBuild.houseImg = item.thumbUrl;    // 房屋图片
    itemBuild.houseTitle = item.houseSubject;   // 房屋顶部title
		itemBuild.shareTitle = "";  // 简短的title
    itemBuild.houseTing = houseRoom + houseHall;   // 厅/室/卫
		itemBuild.houseRoom = item.houseRoom?item.houseRoom:'';  // 室
		itemBuild.houseHall = item.houseHall?item.houseHall:'';  // 厅
		itemBuild.houseWei = "";  // 卫
    itemBuild.houseArea = item.houseArea?parseInt(item.houseArea):'';     // 面积数值
    itemBuild.houseAreaUnit = item.houseArea?"m²":'';  // 面积单位
		itemBuild.houseDirectCn = item.houseDirectCn;		//  朝向
    itemBuild.houseAddress = "";   // 地理位置文案
    itemBuild.houseName = item.buildName;   // 房源名称
		itemBuild.houseTags = item.tagDesc?item.tagDesc.split('|'):item.houseTagDesc?item.houseTagDesc.split('|'):[];  // 标签数组
		itemBuild.houseTotalPrice = item.houseTotalPrice?item.houseTotalPrice:'';   // 总价数值，也可以代表租房的单价
    itemBuild.houseTotalPriceUnit = priceUnit;   // 总价单位， 也可以代表租房的价格单位
		
	// 列表单价处理
	if(item.priceUnitCn=="万"){
		itemBuild.houseUnitPrice=item.houseUnitPrice?parseInt(item.houseUnitPrice):item.houseTotalPrice*10000/item.houseArea
	}else{
		itemBuild.houseUnitPrice=item.houseUnitPrice?parseInt(item.houseUnitPrice):""
	}
	// itemBuild.housePriceOfArea = itemBuild.houseUnitPrice?parseInt(itemBuild.houseUnitPrice):'';// 单位面积的价格数值  
	// 列表单位面积的价格数值  
	if(item.houseUnitPrice){
		if(item.houseUnitPrice.indexOf('元')>-1){
			itemBuild.housePriceOfArea = item.houseUnitPrice?item.houseUnitPrice:'';
		}else{
			itemBuild.housePriceOfArea = item.houseUnitPrice?parseInt(item.houseUnitPrice)+"元/㎡":'';
		}
	}
    // itemBuild.housePriceOfArea = item.houseUnitPrice?parseInt(item.houseUnitPrice):'';  // 单位面积的价格数值  
	
    itemBuild.housePriceOfAreaUnit = item.priceUnitCn?item.priceUnitCn:'';   // 单位面积的价格单位  
		itemBuild.browseNum = item.hotNum?item.hotNum:'';	// 
		itemBuild.isShowBrowseNum = item.isShowBrowseNum == true?item.isShowBrowseNum: false;
    itemBuild.hasVr = false;   // 是否有vr
    itemBuild.hasVideo = false;   // 是否有video
    itemBuild.cityId = item.cityId;   // 房源所在的城市id
    itemBuild.caseType = item.caseType;  // 房源类型  1 代表二手房
    itemBuild.reSource = "";  // 来源
    itemBuild.trueHouse = false;  // 是否是真房源
		itemBuild.houseUseage = "";  // 类型id 如：1 = 住宅
		itemBuild.houseUseageCn = item.houseUseageCn?item.houseUseageCn:'';  // 类型id对应的文案
		itemBuild.regionName = "";  // 区域
		itemBuild.sectionName = "";  // 商圈
		return itemBuild;
	}	
}