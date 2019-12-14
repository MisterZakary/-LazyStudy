//先引用
//importClass(android.database.sqlite.SQLiteDatabase);
importClass(android.media.MediaPlayer);
var tikuCommon = require("./tikuCommon.js");
//import {searchTiku,insertOrUpdate} from "./tikuCommon.js";

function indexFromChar(str) {
    return str.charCodeAt(0) - "A".charCodeAt(0);
}

function searchNet(question) {
    var ansNet = [];
    //toastLog("开始网络搜题");
    recents();
    sleep(1500);
    if (textContains("强国挑战").exists()) {
        toastLog("正在切换小程序");
        click("强国挑战");
    } else {
        toastLog("请先点击 切到搜题");
        return ansNet;
    }
    sleep(500);
    textContains("搜索").findOnce().parent().child(0).child(0).child(1).child(0).child(0).click();
    sleep(800);
    setText(question);
    sleep(500);
    //className("android.widget.EditText").findOnce().setText(question);
    textContains("搜索").findOnce().click();
    sleep(1000);

    if (textContains("答案：").exists()) {
        //toastLog(textContains("答案：").findOnce().text().substring(3));
        textContains("答案：").find().forEach(item => {
            ansNet.push(item.text().substring(3));
        });
    }
    //sleep(300);
    recents();
    sleep(300);
    click("学习强国");
    // if (textContains("学习强国").exists()) {
    //     textContains("学习强国").findOnce().parent().click();
    // }
    //sleep(500);
    return ansNet;
}

function drawfloaty(x, y) {
    //floaty.closeAll();
    var window = floaty.window(
        <frame gravity="center">
            <text id="text" text="✔" textColor="red" />
        </frame>
    );
    window.setPosition(x, y-45);
    return window;
    //sleep(2000);
    //window.close();
}

function beep() {
    return;
    //     var player = new MediaPlayer();
    //     var path = files.cwd() + "/beep.mp3";
    //     player.setDataSource(path);
    //     player.setVolume(50, 50);
    //     player.prepare();
    //     player.start();
    //     setTimeout(() => {
    //         player.stop();
    //         player.release();
    //     }, 5000);
}

function tiaoZhan() {
    let hasError = false;
    //提取题目
    if (className("android.widget.ListView").exists()) {
        var _timu = className("android.widget.ListView").findOnce().parent().child(0).desc();
    } else {
        //back();
        toastLog("提取题目失败");
        hasError = true;
        beep();
        return;
    }

    var chutiIndex = _timu.lastIndexOf("出题单位");
    if (chutiIndex != -1) {
        _timu = _timu.substring(0, chutiIndex - 2);
    }
    var timuOld = _timu;
    _timu = _timu.replace(/\s/g, "");

    //提取答案列表选项
    var ansTimu = [];
    if (className("android.widget.ListView").exists()) {
        className("android.widget.ListView").findOne().children().forEach(child => {
            var answer_q = child.child(0).child(1).desc();
            ansTimu.push(answer_q);
        });
    } else {
        //back();
        toastLog("答案获取失败");
        hasError = true;
        beep();
        return;
    }

    var ansTiku = tikuCommon.searchTiku(_timu);
    toastLog("answer = " + ansTiku);

    if (/^[a-zA-Z]{1}$/.test(ansTiku)) {//如果为ABCD形式
        var indexAnsTiku = indexFromChar(ansTiku.toUpperCase());
        ansTiku = ansTimu[indexAnsTiku];
        toastLog("answer from char=" + ansTiku);
    }
    sleep(300);

    var answer = "";
    var ansFind = "";
    //toastLog(findAnsRet);

    //如果题库中有
    if (ansTiku != "") {
        answer = ansTiku;
    } else {//从网络搜索
        //从题目中提取检索关键词
        var reg = /[\u4e00-\u9fa5a-zA-Z\d]{4,}/;
        var regTimu = reg.exec(timuOld);
        log("search:" + regTimu);
        //网络搜索
        var ansNet = searchNet(regTimu); //一个数组
        sleep(500);
        //遍历题中的答案
        //log("网络答案: " + ansNet);
        for (let item of ansTimu) {
            //toastLog(item);
            var indexFind = ansNet.indexOf(item);
            if (indexFind != -1) {
                ansFind = item;
                break;
            }
        }
        //toastLog("匹配结果: " + ansFind);
        if (ansFind != "") {
            answer = ansFind;
        } else {
            //网络也没找到，那么随机咯
            let randomIndex = random(0, ansTimu.length - 1);
            answer = ansTimu[randomIndex];
            beep();
            //sleep(10*1000);
            //return;
        }
        toastLog("answer = " + answer);
    }

    //开始点击
    var hasClicked = false;
    var listArray = className("ListView").findOnce().children();
    listArray.forEach(item => {
        var listDescStr = item.child(0).child(1).desc();
        if (listDescStr == answer) {
            //显示 对号
            var b = item.child(0).bounds();
            var tipsWindow = drawfloaty(b.left, b.top);
            sleep(300);
            //点击
            item.child(0).click();
            hasClicked = true;
            sleep(300);
            //消失 对号
            tipsWindow.close();
        }
    });
    if (hasClicked == false) {//没有点击成功
        toastLog("点击答案失败，请手动点击");
        hasError = true;
        beep();
        //return;
    }


    sleep(1000);
    //写库
    if (className("android.view.View").descContains("本次答对").exists() == false) {//如果答对
        if (ansTiku == "" && answer != "") {
            var sqlstr = "INSERT INTO tiku VALUES ('" + _timu + "','" + answer + "','')";
            tikuCommon.insertOrUpdate(sqlstr);
        }
    } else {//题中有，但答错，应当删除
        if (ansTiku != "" && hasError == false) {
            //删掉这条
            toastLog("删除答案: " + ansTiku);
            var sqlstr = "DELETE FROM tiku WHERE question LIKE '" + _timu + "'";
            tikuCommon.insertOrUpdate(sqlstr);
        }
    }
    //sleep(1000);
}

function begin() {
    while (true) {
        //floaty.closeAll();
        if (className("android.view.View").descContains("本次答对").exists()) {
            beep();
            //break;
            //back();
        }
        if (className("android.view.View").desc("挑战答题").exists()) {
            className("android.view.View").desc("挑战答题").click();
            sleep(3000);
        }
        tiaoZhan();
        sleep(1000);
        //i++;
    }
}

module.exports = begin;


