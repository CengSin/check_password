# check_password
密码校验（javaScript）

> 校验规则

1. 口令长度至少8位
2. 口令中应该包含数字，小写字母，大写字母，特殊符号4类中的3类
3. 口令和用户名无相关性 ， 口令中不得包含用户名的完整字符串，大小写变换和形似变换的字符串
4. 口令应该避免键盘排序密码

该js中使用了编辑距离的算法来校验口令和用户名相似度，检验算法参考[[LevenshTeinDistance算法的JavaScript](https://www.oschina.net/code/snippet_89964_26140)



