function begin()
{
    recents();
    sleep(1500);
    if (textContains("强国挑战").exists()) {
        toastLog("正在切换小程序");
        click("强国挑战");
    } else {
        launch("com.tencent.mm");
        sleep(1000);
        desc("搜索").findOne().click();
        sleep(1000);
        setText("强国挑战答题答案查询");
    }
}

module.exports=begin;

