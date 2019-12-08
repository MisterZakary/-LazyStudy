function DailyQuestion() {
    if (desc("填空题").exists()) {
        var blanks = className("android.view.View").depth(11).find();
        var blankLen = blanks.length;
        //toastLog(strlen);
        var keyView = className("EditText").findOnce().parent().parent().child(2);
        var keyStr = keyView.desc();
        //toastLog(keyStr);
        if (desc("查看提示").exists()) {
            desc("查看提示").findOnce().click();
        } else {
            log("Not found 查看提示");
            return;
        }

        sleep(1000);
        if (desc("提示").exists()) {
            var tipsLine = desc("提示").findOnce().parent();
            //获取提示内容
            var tipsView = tipsLine.parent().child(1).child(0);
            var tipsStr = tipsView.desc();
            //获取答案字符串
            var indexKey = tipsStr.indexOf(keyStr);
            var ansFind = tipsStr.substr(indexKey - blankLen, blankLen);
            //找不到答案时，用0补全
            let answer=blankLen>ansFind.length ? "0".repeat(blankLen):ansFind;
            toastLog(answer);
            //sleep(500);
            //关闭提示
            tipsLine.child(1).click();
            sleep(500);
            //点击编辑方格，获得焦点
            blanks[0].click();
            //输入答案
            setText(answer);
        } else {
            log("Not found  提示");
            click(300,300);
            return;
        }
    }

    if (desc("单选题").exists()) {
        //desc("查看提示").findOnce().click();
        if (desc("查看提示").exists()) {
            desc("查看提示").findOnce().click();
        } else {
            log("Not found  查看提示");
            return;
        }
        sleep(1500);
        if (desc("提示").exists()) {
            var tipsLine = desc("提示").findOnce().parent();
            //获取提示内容
            var tipsView = tipsLine.parent().child(1).child(0);
            var tipsStr = tipsView.desc();
            tipsLine.child(1).click();
            sleep(500);
            //检索答案并点击
            if (className("android.widget.ListView").exists()) {
                var findAns = false;
                var listAns = className("android.widget.ListView").findOne().children();
                listAns.forEach(child => {
                    var listStr = child.child(0).child(2).desc();
                    if (tipsStr.indexOf(listStr) != -1) {
                        child.child(0).child(0).click();
                        findAns = true;
                    }
                    //找不到，点击第一个
                    if (!findAns) {
                        className("RadioButton").findOnce().click();
                    }
                });
            }
        } else {
            log("Not found  提示");
            click(300,300);
            return;
        }
    }

    if (desc("多选题").exists()) {
        /*if (className("android.widget.ListView").exists()) {
            className("android.widget.ListView").findOne().children().forEach(child => {
                child.child(0).child(0).click();
            });
        }
        */
        //全选并点击
        className("CheckBox").find().forEach(item => {
            item.parent().click();
            //sleep(300);
        });
    }

}


function begin()
{
    while (true) {
        if (className("Button").exists()) {
            if (className("Button").desc("再来一组").exists()) {
                className("Button").desc("再来一组").findOnce().click();
            } else {
                className("Button").findOnce().click();
            }
        }
        sleep(1000);
        DailyQuestion();
        sleep(1000);
    }
}

module.exports=begin;
