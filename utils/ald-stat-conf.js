

//对字符串进行加密
function compileStr(code){
    var c=String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }
    return escape(c);
}
//字符串进行解密
function uncompileStr(code){
    code = unescape(code);
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
    return c;
}


//悠居客小程序的配置
exports.app_key = "0ff25c52e9b088b88ec64042ef5b4969"; //请在此行填写从阿拉丁后台获取的appkey
exports.appid = "wx28b7902beee26937"; //统计分享到群、二维码扫码数据时需填写，不填写无法统计
exports.appsecret = uncompileStr("%84%C5%91%95%9C%9A%98fbjke%94%97mpj%97%98%93%93kqh%91%99o%9B%9Agd%96"); //统计分享到群、二维码扫码数据时需填写，不填写无法统计

exports.getLocation = true; //默认不获取用户坐标位置
exports.plugin = false;  //您的小程序中是否使用了插件。根据是否启用插件会有不同的接入方式，请参考文档文档。