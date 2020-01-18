"ui";
importClass(android.view.View);
var tikuCommon = require("./tikuCommon.js");
let deviceWidth = device.width;
let deviceHeight = device.height;

let margin = parseInt(deviceWidth * 0.02);
let buttonWidth = parseInt(deviceWidth * 0.40);
//记录集数组 重要！！！
let qaArray = [];

ui.layout(
    <vertical margin={margin + "px"} gravity="left|top">
        <horizontal>
            <button margin={margin + "px"} id={"showFloating"} text={" 1 加载悬浮窗 "} w={buttonWidth + "px"} />
            <button margin={margin + "px"} id={"about"} text={" 2 使用说明"} w={buttonWidth + "px"} />
        </horizontal>
        <horizontal>
            <button margin={margin + "px"} id={"updateTikuNet"} text={" 3 更新网络题库 "} w={buttonWidth + "px"} />
            <button margin={margin + "px"} id={"crud"} text={" 4 手动改题"} w={buttonWidth + "px"} />
        </horizontal>
        <text id={"resultLabel"} w="*" />
        <frame id={"crudFrame"} >
            <vertical>
                <text id={"answerLabel"} text={"检索关键字"} />
                <input margin={margin + "px"} id={"keyword"} hint={" 在此输入"} w="*" h="auto" />
                <horizontal>
                    <vertical>
                        <text id={"questionLabel"} text={"题目"} />
                        <horizontal>
                            <text id={"questionIndex"} text={"0"} />
                            <text id={"slash"} text={"/"} />
                            <text id={"questionCount"} text={"0"} />
                        </horizontal>
                    </vertical>
                    <input margin={margin + "px"} id={"question"} w="*" h="auto" />
                </horizontal>
                <horizontal>
                    <text id={"answerLabel"} text={"答案"} />
                    <input id={"answer"} w="*" h="auto" />
                </horizontal>
                <horizontal>
                    <button id="search" text=" 查询 " />
                    <button id="lastTen" text=" 最近十条 " />
                    <button id="prev" text=" 上一条 " />
                    <button id="next" text=" 下一条 " />
                </horizontal>
                <horizontal>
                    <button id="update" text=" 修改 " />
                    <button id="delete" text=" 删除 " />
                    <button id="insert" text=" 新增 " />
                    <button id="reset" text=" 重置 " />
                </horizontal>
            </vertical>
        </frame>
    </vertical>
);

//设置不可见
ui.run(() => {
    ui.crudFrame.setVisibility(View.INVISIBLE);
});

//加载悬浮窗
ui.showFloating.click(() => {
    engines.execScriptFile("floating.js");
});

//使用说明
ui.about.click(() => {
    let info = "" +
        "〇脚本的实际操作需要 悬浮窗 和 无障碍权限（设置→辅助功能→无障碍→本 APP，不同手机可能会不一样）\n" +
        "☆挑战答题为无限答题模式，点击停止按钮，停止答题\n";

    dialogs.confirm(info);
});

//更新网络题库
ui.updateTikuNet.click(() => {
    threads.start(function () {
        ui.run(() => {
            ui.resultLabel.setText("正在更新网络题库...");
        });
        var ss = "./updateTikuNet.js";
        let begin = require(ss);
        var resultNum = begin();
        var resultStr = "更新" + resultNum + "条";
        ui.run(() => {
            ui.resultLabel.setText(resultStr);
        });
    })
});

//开启关闭 手动改题
ui.crud.click(() => {
    if (ui.crudFrame.getVisibility() == View.INVISIBLE) {
        ui.crudFrame.setVisibility(View.VISIBLE);
    } else {
        ui.crudFrame.setVisibility(View.INVISIBLE);
    }
});

//查询 根据关键字
ui.search.click(() => {
    threads.start(function () {
        if (ui.keyword.getText() != "") {
            var keyw = ui.keyword.getText();
            qaArray = tikuCommon.searchTiku(keyw);
            var qCount = qaArray.length;
            if (qCount > 0) {
                ui.run(() => {
                    ui.question.setText(qaArray[0].question);
                    ui.answer.setText(qaArray[0].answer);
                    ui.questionIndex.setText("1");
                    ui.questionCount.setText(String(qCount));
                });
            } else {
                toastLog("未找到");
                ui.run(() => {
                    ui.question.setText("未找到");
                });
            }
        } else {
            toastLog("请输入关键字");
        }
    });
});

//上一条
ui.prev.click(() => {
    threads.start(function () {
        if (qaArray.length > 0) {
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            if (qIndex > 0) {
                ui.run(() => {
                    ui.question.setText(qaArray[qIndex - 1].question);
                    ui.answer.setText(qaArray[qIndex - 1].answer);
                    ui.questionIndex.setText(String(qIndex));
                });
            } else {
                toastLog("已经是第一条了！");
            }
        } else {
            toastLog("题目为空");
        }
    });
});

//下一条
ui.next.click(() => {
    threads.start(function () {
        if (qaArray.length > 0) {
            //toastLog(qaArray);
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            if (qIndex < qaArray.length - 1) {
                //toastLog(qIndex);
                //toastLog(qaArray[qIndex + 1].question);
                ui.run(() => {
                    ui.question.setText(qaArray[qIndex + 1].question);
                    ui.answer.setText(qaArray[qIndex + 1].answer);
                    ui.questionIndex.setText(String(qIndex + 2));
                });
            } else {
                toastLog("已经是最后一条了！");
            }
        } else {
            toastLog("题目为空");
        }
    });
});

//最近十条
ui.lastTen.click(() => {
    threads.start(function () {
        var keyw = ui.keyword.getText();
        qaArray = tikuCommon.searchDb(keyw, "", "SELECT question,answer FROM tiku ORDER BY rowid DESC limit 10");
        var qCount = qaArray.length;
        if (qCount > 0) {
            //toastLog(qCount);
            ui.run(() => {
                ui.question.setText(qaArray[0].question);
                ui.answer.setText(qaArray[0].answer);
                ui.questionIndex.setText("1");
                ui.questionCount.setText(qCount.toString());
            });
        } else {
            toastLog("未找到");
            ui.run(() => {
                ui.question.setText("未找到");
            });
        }
    });
});

//修改
ui.update.click(() => {
    threads.start(function () {
        if (ui.question.getText() && qaArray.length > 0 && parseInt(ui.questionIndex.getText()) > 0) {
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            var questionOld = qaArray[qIndex].question;
            var questionStr = ui.question.getText();
            var answerStr = ui.answer.getText();
            var sqlstr = "UPDATE tiku SET question = '" + questionStr + "' , answer = '" + answerStr + " ' WHERE question=  '" + questionOld + "'";
            tikuCommon.executeSQL(sqlstr);
        } else {
            toastLog("请先查询");
        }
    });
});

//删除
ui.delete.click(() => {
    threads.start(function () {
        if (qaArray.length > 0 && parseInt(ui.questionIndex.getText()) > 0) {
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            var questionOld = qaArray[qIndex].question;
            var sqlstr = "DELETE FROM tiku WHERE question = '" + questionOld + "'";
            tikuCommon.executeSQL(sqlstr);
        } else {
            toastLog("请先查询");
        }
    });
});

//新增
ui.insert.click(() => {
    threads.start(function () {
        if (ui.question.getText() != "" && ui.answer.getText() != "") {
            var questionStr = ui.question.getText();
            var answerStr = ui.answer.getText();
            var sqlstr = "INSERT INTO tiku VALUES ('" + questionStr + "','" + answerStr + "','')";
            tikuCommon.executeSQL(sqlstr);
        } else {
            toastLog("请先输入 问题 答案");
        }
    });
});

//重置
ui.reset.click(() => {
    threads.shutDownAll();
    threads.start(function () {
        qaArray = [];
        ui.run(() => {
            ui.keyword.setText("");
            ui.question.setText("");
            ui.answer.setText("");
            ui.questionIndex.setText("0");
            ui.questionCount.setText("0");
        });
        toastLog("重置完毕!");
    });
});