/**
 *检测参数必传
 */
let must = () => {
    throw new Error('缺少必要的参数!');
}
/**
 *@param string content 编码内容
 *@param string identity emoji标识
 *@param int copy 重复次数
 *@param radix 返回进制
 *@return tmp 返回处理后的字符
 */
let decodeEmoji = (str = must, identity, copy, radix) => {
    //字符串转字符实体
    let arr = [];
    identity = identity || '*';
    copy = copy || 1;
    radix = radix || 0; //返回的字符实体默认10进制，也可以选择16进制
    let idents = identity.repeat(identity); //实体标识

    var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    str = str.replace(patt, function(char) {
        var code;
        if (char.length === 2) { //设定所有所有emoji为四个字节，
            let tmp = stringToEntity(char, radix);
            return identity + tmp + identity;
            // return "&#" + code + ";";  
        } else {
            return char;
        }
    });
    return str;
};
/**
 *@param string str 解码的字符
 *@param string identity 解密标识
 *param int copy 标识重复次数
 */
let encodeEmoji = (str = must, identity, copy) => {
    identity = identity || '*';
    copy = copy || 1;
    let idents = identity.repeat(identity); //实体标识
    //注意eval警告
    let patt = /\*(&(amp;)?#\d+;){1,3}\*/g;
    str = str.replace(patt, function(char) {
        char = char.replace(/amp;/g, '');
        let min = char.indexOf(identity);
        let max = char.lastIndexOf(identity);
        let tmp = entityToString(char.substring(min + 1, max + 1));
        return tmp;
    });
    console.log('str', str)
    return str;
}
//将带有表情包的字符串转换为替换后的数组
let emojiToArray = (str) => {
    let arr = [];
    for (var i = 0; i < str.length; i++) {
                let start = i;
                let end = i + 13;
                let emoji = str.substring(start, end);
                if (!emoji.match(/^mucairen&#\*\d\*$/)) {
                    arr.push(str[i]);
                } else {
                    arr.push(emoji);
                    i+=12;
                }
    }
    return arr;
}
//字串转字符实体
function stringToEntity(str, radix) {
    let arr = []
    //返回的字符实体默认10进制，也可以选择16进制
    radix = radix || 0
    for (let i = 0; i < str.length; i++) {
        arr.push((!radix ? '&#' + str.charCodeAt(i) : '&#x' + str.charCodeAt(i).toString(16)) + ';')
    }
    let tmp = arr.join('');
    return tmp;
}
//字符实体转字符串
function entityToString(entity) {
    let entities = entity.split(';')
    entities.pop()
    let tmp = '';
    for (let i = 0; i < entities.length; i++) {
        let num = entities[i].trim().slice(2)
        if (num[0] === 'x') //10进制还是16进制
            num = parseInt(num.slice(1), 16);
        else num = parseInt(num);
        tmp += String.fromCharCode(num);
    }
    return tmp;
}

export default {
    decodeEmoji,
    encodeEmoji,
    emojiToArray,
}