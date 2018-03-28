// 密码校验
var validatePwdNew;
validatePwdNew = {
    checkPassword:function (user, pwd) {
        var result = new Object();
        var pattern = /^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![a-z!@#\$%]+$)(?![A-Z\d]+$)(?![A-Z!@#\$%]+$)(?![\d!@#\$%]+$)[a-zA-Z\d!@#\$%]+$/;
        // 口令长度至少8位，
        if (pwd.length <= 8) {
            result.errocode = 11;
            result.erroinfo = "密码长度小于8位";
        }
        // 应该至少包括数字，小写字母，大写字母，特殊符号4类中的至少3类，
        else if (!(pattern.test(pwd))) {
            result.errocode = 12;
            result.erroinfo = "至少包括数字，小写字母，大写字母，特殊符号4类中的3类";
        }
        // 和用户名没有相关性，不得包含和用户名完整字符串，大小写变位，形似变换的字符串
        else if (LevenshteinDistance.init(pwd, user).get() > 0.5) {
            result.errocode = 13;
            result.erroinfo = "不得包含和用户名完整字符串，大小写变位，形似变换的字符串";
        }
        else if (this._similarityString(user, pwd)) {
            result.errocode = 14;
            result.erroinfo = "不得包含和用户名完整字符串，大小写变位，形似变换的字符串";
        }

        // 避免键盘排序密码
        /*if (this._keyboardSortPassword(pwd)) {
            result.errocode = 15;
            result.erroinfo = "密码过于简单";
        }*/
        return result;
    },

    _similarityString:function (user, pwd) {
        // 不得包含和用户名完整字符串，大小写变位的字符串
        if (pwd.indexOf(user) || pwd.toLocaleUpperCase().indexOf(user.toLocaleUpperCase())) {
            return true;
        }
        // 形似变换(编辑距离算法，编辑距离越小，字符串相似程度越大)
        if (similarity(user, pwd) > 0.8) {
            return true;
        }
        return false;
    },

    /* 如果存在键盘排序字符串的话，就返回true，否则返回false */
    _keyboardSortPassword:function (pwd) {
        pwd = pwd.toLocaleLowerCase();
        var i = 0;
        var arr = ["1234567890","qwertyuiop[]","|asdfghjklzxcvbnm","~!@#$%^&*()_+"];
        for (i = 0; i < arr.length; i++) {
            if(arr[i].indexOf(pwd)) {
                break;
            }
        }
        if(i < arr.length) {
            return true;
        }
        return false;
    }

};

var LevenshteinDistance;
LevenshteinDistance = {
    _str1:null,
    _str3:null,
    _matrix:null,
    _isString:function(s){
        return Object.prototype.toString.call(s) === '[object String]';
    },
    _isNumber:function(s){
        return Object.prototype.toString.call(s) === '[object Number]';
    },
    init:function(str1,str2){
        if(!this._isString(str1) || !this._isString(str2)) return;

        this._str1 = str1;
        this._str2 = str2;

        str1.length &&  str2.length && this._createMatrix(str1.length+1,str2.length+1);
        this._matrix && this._initMatrix();

        return this;
    },
    get:function(){
        return 1 - this._getDistance()/Math.max(this._str1.length,this._str2.length);
    },
    //计算编辑距离
    _getDistance:function(){
        var len1 = this._str1.length,
            len2 = this._str2.length;

        if(!len1 || !len2) return Math.max(len1,len2);

        var str1 = this._str1.split(''),
            str2 = this._str2.split('');

        var i = 0,j = 0,temp = 0;
        while(i++ < len1){
            j = 0;
            while(j++ < len2){
                temp = str1[i-1] === str2[j-1] ? 0 : 1;
                this._matrix[i][j] = Math.min(this._matrix[i-1][j]+1,this._matrix[i][j-1]+1,this._matrix[i-1][j-1]+temp);
            }
        }
        return this._matrix[i-1][j-1];
    },
    /*
     * 初始化矩阵
     * 为第一行、第一列赋值
     */
    _initMatrix:function(){
        var cols = this._matrix[0].length,
            rows = this._matrix.length;
        var l = Math.max(cols,rows);
        while(l--){
            cols-1 >= l && (this._matrix[0][l] = l);
            rows-1 >= l && (this._matrix[l][0] = l);
        }
    },
    /*
     * 创建矩阵
     * n:行
     * m:列
     */
    _createMatrix:function(n,m){
        if(!this._isNumber(n) || !this._isNumber(m) || n<1 || m<1) return;

        this._matrix = new Array(n),i = 0;
        while(i<n) this._matrix[i++] = new Array(m);
    }
}