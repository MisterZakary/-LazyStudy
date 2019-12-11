//import {searchTiku,insertOrUpdate} from "./tikuCommon.js";
var tikuCommon = require("./tikuCommon.js");

function getTimuArray() {
    var timuArray = new Array();
    var timuCollections = descEndsWith("/5").findOnce().parent().parent().child(1);
    if (timuCollections.childCount() == 0) { //是选择题
        timuArray.push(timuCollections.desc());
    } else { //填空题
        timuCollections.children().forEach(item => {
            if (item.childCount() == 0) { //题目段
                timuArray.push(item.desc());
            } else {
                var blankNumStr = "|" + (item.childCount() - 1).toString();
                timuArray.push(blankNumStr);
            }
        });
    }
    return timuArray;
}

function getTipsStr() {
    var _tipsStr = "";
    while (_tipsStr == "") {
        if (desc("查看提示").exists()) {
            desc("查看提示").findOnce().click();
        } else {
            log("Not found 查看提示");
            continue;
        }
        sleep(1000);
        if (desc("提示").exists()) { //正确捕获提示
            var tipsLine = desc("提示").findOnce().parent();
            //获取提示内容
            var tipsView = tipsLine.parent().child(1).child(0);
            _tipsStr = tipsView.desc();
            //关闭提示
            tipsLine.child(1).click();

        } else {
            log("Not found  提示");
            click(device.width * 0.5, device.height * 0.2);
            continue;
        }
    }
    return _tipsStr;
}

function getByTimu(timu, tipsStr) {
    var ansTips = "";
    for (var i = 1; i < timu.length - 1; i++) {
        if (timu[i].charAt(0) == "|") {
            var blankLen = timu[i].substring(1);
            var indexKey = tipsStr.indexOf(timu[i + 1]);
            var ansFind = tipsStr.substr(indexKey - blankLen, blankLen);
            ansTips += ansFind;
        }
    }
    return ansTips;
    //let answer = !ansFind.length ? "0".repeat(blankLen) : ansFind;
}

function clickByTips(tipsStr) {
    var clickStr = "";
    var isFind = false;
    if (className("android.widget.ListView").exists()) {
        var listArray = className("android.widget.ListView").findOne().children();
        listArray.forEach(item => {
            var ansStr = item.child(0).child(2).desc();
            if (tipsStr.indexOf(ansStr) >= 0) {
                item.child(0).click();
                clickStr += item.child(0).child(1).desc().charAt(0);
                isFind = true;
            }
        });
        if (!isFind) { //没有找到 点击第一个
            listArray[0].child(0).click();
            clickStr += listArray[0].child(0).child(1).desc().charAt(0);

        }
    }
    return clickStr;
}

function clickByAnswer(answer) {
    if (className("android.widget.ListView").exists()) {
        var listArray = className("android.widget.ListView").findOne().children();
        listArray.forEach(item => {
            var listIndexStr = item.child(0).child(1).desc().charAt(0);
            //历史遗留，兼容单元答案为非ABCD
            var listDescStr = item.child(0).child(2).desc();
            if (answer.indexOf(listIndexStr) >= 0) {
                item.child(0).click();
            }
            if (answer.indexOf(listDescStr) >= 0) {
                item.child(0).click();
            }
        });
    }
}

function checkAndSql(timuStr, ansTiku, answer) {
    if (className("Button").desc("下一题").exists() || className("Button").desc("完成").exists()) {
        swipe(100, device.height - 100, 100, 100, 500);
        var nCout = 0
        while (nCout < 10) {
            if (descStartsWith("正确答案").exists()) {
                var correctAns = descStartsWith("正确答案").findOnce().desc().substr(5);
                //toastLog(descStartsWith("正确答案").findOnce().desc());
                if (ansTiku == "") { //题库为空则插入正确答案                
                    var sqlstr = "INSERT INTO tiku VALUES ('" + timuStr + "','" + correctAns + "','')";
                } else { //更新题库答案
                    var sqlstr = "UPDATE tiku SET answer='" + correctAns + "' WHERE question LIKE '" + timuStr + "'";
                }
                //执行sql语句
                // toastLog(sqlstr);
                tikuCommon.insertOrUpdate(sqlstr);
                break;
            } else {
                var clickPos = className("android.webkit.WebView").findOnce().child(2).child(0).child(1).bounds();
                click(clickPos.left + device.width * 0.13, clickPos.top + device.height * 0.1);
                log("未捕获 正确答案，尝试修正");
            }
            nCout++;
        }
    } else { //正确后进入下一题，或者进入再来一局界面
        if (ansTiku == "" && answer != "") { //正确进入下一题，且题库答案为空
            //插入正确答案                
            var sqlstr = "INSERT INTO tiku VALUES ('" + timuStr + "','" + answer + "','')";
            tikuCommon.insertOrUpdate(sqlstr);
        }
    }

}

function clickBtn() {
    if (className("Button").exists()) {
        if (className("Button").desc("再来一组").exists()) {
            className("Button").desc("再来一组").findOnce().click();
        } else {
            className("Button").findOnce().click();
        }
    } else {
        click(device.width * 0.85, device.height * 0.1);
    }
}

function DailyQuestion() {
    clickBtn();
    sleep(500);
    clickBtn();
    sleep(500);
    //获得题目数组
    var timuArray = getTimuArray();
    var blankArray = new Array();
    //toastLog("timuArray=" + timuArray.toString());

    //由题目数组获得题目字符串
    var timuStr = "";
    timuArray.forEach(item => {
        if (item.charAt(0) == "|") { //是空格数
            blankArray.push(item.substring(1));
        } else { //是题目段
            timuStr += item;
        }
    });
    timuStr = timuStr.replace(/\s/g, "");
    //toastLog("timuStr = " + timuStr + "blankArray = " + blankArray.toString());

    //检索题库
    var ansTiku = tikuCommon.searchTiku(timuStr);
    //获取答案
    var answer = ansTiku;
    //toastLog("answer=" + answer);
    if (desc("填空题").exists()) {
        //toastLog("填空题");
        if (answer == "") {
            var tipsStr = getTipsStr();
            answer = getByTimu(timuArray, tipsStr);
        }

        //点击 文本框
        //editCollections[0].parent().child(1).click();
        //className("EditText").findOnce().parent().child(1).click();
        //输入答案
        log("answer= " + answer);
        setText(0, answer.substr(0, blankArray[0]));
        if (blankArray.length > 1) {
            for (var i = 1; i < blankArray.length; i++) {
                setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
            }
        }
        //setText(answer);


    } else { //选择题，包括单选 双选
        //toastLog("选择题");
        if (answer == "") {
            var tipsStr = getTipsStr();
            answer = clickByTips(tipsStr);
        } else {
            toastLog("ansTiku= " + ansTiku);
            clickByAnswer(answer);
        }

    }
    //判断是否正确
    sleep(1000);
    clickBtn();
    sleep(300);
    checkAndSql(timuStr, ansTiku, answer);

}


function begin() {
    while (true) {
        DailyQuestion();
        sleep(1000);
    }
}
//begin();

module.exports = begin;