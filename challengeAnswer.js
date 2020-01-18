var tikuCommon = require("./tikuCommon.js");

//显示对号悬浮窗
function drawfloaty(x, y) {
    //floaty.closeAll();
    var window = floaty.window(
        <frame gravity="center">
            <text id="text" text="✔" textColor="red" />
        </frame>
    );
    window.setPosition(x, y - 45);
    return window;
}


function doChallengeAnswer() {
    let hasError = false;
    //提取题目
    if (className("android.widget.ListView").exists()) {
        var _timu = className("android.widget.ListView").findOnce().parent().child(0).desc();
    } else {

        toastLog("提取题目失败");
        hasError = true;
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
        toastLog("答案获取失败");
        hasError = true;
        return;
    }

    var ansSearchArray = [];//tiku表答案数组
    var answerArray = [];//答案临时数组

    //获得答案数组
    ansSearchArray = tikuCommon.searchTiku(_timu);
    if (ansSearchArray.length == 0) { //tiku表中没有，搜索网络表
        ansSearchArray = tikuCommon.searchNet(_timu);
    }
    if (ansSearchArray.length == 0) { //网络中也没有，随机
        let randomIndex = random(0, ansTimu.length - 1);
        answerArray.push({ "question": _timu, "answer": ansTimu[randomIndex] });
    }
    answerArray = ansSearchArray;

    var answer = "";
    //对答案数组逐项点击
    for (var i = 0, len = answerArray.length; i < len; i++) {
        answer = answerArray[i].answer;
        if (/^[a-zA-Z]{1}$/.test(answer)) { //如果为ABCD形式
            var indexAns = tikuCommon.indexFromChar(answer.toUpperCase());
            answer = ansTimu[indexAns];
        }
        toastLog("answer = " + answer);
        sleep(300);
        //开始点击
        var hasClicked = false;
        var listArray = className("ListView").findOnce().children();
        var clickAns = "";
        //for(ans of answer){//答案数组逐个匹配
        listArray.forEach(item => {
            var listDescStr = item.child(0).child(1).desc();
            if (listDescStr == answer) {
                clickAns = answer;
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
        //}

        if (hasClicked == false) { //没有点击成功
            toastLog("点击答案失败，请手动点击");
        }
    }

    sleep(1000);
    //写库
    if (className("android.view.View").descContains("本次答对").exists() == false) { //如果答对，插入记录
        if (ansSearchArray.length == 0 && clickAns != "") {
            var sqlstr = "INSERT INTO tiku VALUES ('" + _timu + "','" + clickAns + "','')";
            tikuCommon.executeSQL(sqlstr);
        }
    } else { //tiku表中有，但答错，删除错误记录
        if (ansSearchArray.length > 0 && hasError == false) {
            //删掉这条
            toastLog("删除答案: " + answer);
            var sqlstr = "DELETE FROM tiku WHERE question LIKE '" + _timu + "'";
            tikuCommon.executeSQL(sqlstr);
        }
    }
    //sleep(1000);
}

function main() {
    while (true) {
        if (className("android.view.View").desc("挑战答题").exists()) {
            className("android.view.View").desc("挑战答题").click();
            sleep(3000);
        }
        doChallengeAnswer();
        sleep(1000);
    }
}

module.exports = main;


