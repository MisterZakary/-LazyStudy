importClass(android.database.sqlite.SQLiteDatabase);
/**
 * @Description: Auto.js xxqg-helper (6+6)+(6+6)+(1+1+2)+6+6=40分
 * @version: 3.1.0
 * @Author: Ivan
 * @Date: 2020-1-15
 */

var aCount=8;//文章学习篇数
var vCount=8;//小视频学习个数
var cCount=2;//收藏+分享+评论次数

var aTime=90;//每篇文章学习-90秒 90*8=720秒=12分钟
var vTime=15;//每个小视频学习-15秒
var rTime=1080;//广播收听-18分钟

var commentText=["支持党，支持国家！","为实现中华民族伟大复兴而不懈奋斗！","紧跟党走，毫不动摇！","不忘初心，牢记使命","努力奋斗，报效祖国！"];//评论内容，可自行修改，大于5个字便计分
var aCatlog="推荐"//文章学习类别

var lCount=3;//挑战答题轮数
var qCount=5;//挑战答题每轮答题数
//var dlCount=3;//每日答题轮数

/**
 * @description: 延时函数
 * @param: seconds-延迟秒数
 * @return: null
 */
function delay(seconds)
{
    sleep(1000*seconds);//sleep函数参数单位为毫秒所以乘1000
}

/**
 * @description: 文章学习计时(弹窗)函数
 * @param: n-文章标号 seconds-学习秒数
 * @return: null
 */
function article_timing(n,seconds)
{
    h=device.height;//屏幕高
    w=device.width;//屏幕宽
    x=(w/3)*2;
    h1=(h/6)*5;
    h2=(h/6);
    for(var i=0;i<seconds;i++)
    {
        while(!textContains("欢迎发表你的观点").exists())//如果离开了文章界面则一直等待
        {
            console.error("当前已离开第"+(n+1)+"文章界面，请重新返回文章页面...");
            delay(2);
        }
        if(i%5==0)//每5秒打印一次学习情况
        {
            console.info("第"+(n+1)+"篇文章已经学习"+(i+1)+"秒,剩余"+(seconds-i-1)+"秒!");
        }
        delay(1);
        if(i%10==0)//每10秒滑动一次，如果android版本<7.0请将此滑动代码删除
        {
            toast("这是防息屏toast,请忽视-。-");
            if(i<=seconds/2)
            {
                swipe(x,h1,x,h2,500);//向下滑动
            }
            else
            {
                swipe(x,h2,x,h1,500);//向上滑动
            }
        }
    }
}

/**
 * @description: 视频学习计时(弹窗)函数
 * @param: n-视频标号 seconds-学习秒数
 * @return: null
 */
function video_timing_bailing(n,seconds)
{
    for(var i=0;i<seconds;i++)
    {
        while(!textContains("分享").exists())//如果离开了百灵小视频界面则一直等待
        {
            console.error("当前已离开第"+(n+1)+"个百灵小视频界面，请重新返回视频");
            delay(2);
        }
        delay(1);
        console.info("第"+(n+1)+"个小视频已经观看"+(i+1)+"秒,剩余"+(seconds-i-1)+"秒!");
    }
}

/**
 * @description: 新闻联播小视频学习计时(弹窗)函数
 * @param: n-视频标号 seconds-学习秒数
 * @return: null
 */
function video_timing_news(n,seconds)
{
    for(var i=0;i<seconds;i++)
    {
        while(!textContains("欢迎发表你的观点").exists())//如果离开了联播小视频界面则一直等待
        {
            console.error("当前已离开第"+(n+1)+"个新闻小视频界面，请重新返回视频");
            delay(2);
        }
        delay(1);
        console.info("第"+(n+1)+"个小视频已经观看"+(i+1)+"秒,剩余"+(seconds-i-1)+"秒!");
    }
}

/**
 * @description: 广播学习计时(弹窗)函数
 * @param: r_time-已经收听的时间 seconds-学习秒数
 * @return: null
 */
function radio_timing(r_time,seconds)
{
    for(var i=0;i<seconds;i++)
    {
        delay(1);
        if(i%5==0)//每5秒打印一次信息
        {
            console.info("广播已经收听"+(i+1+r_time)+"秒,剩余"+(seconds-i-1)+"秒!");
        }
        if(i%15==0)//每15秒弹一次窗防止息屏
        {
            toast("这是防息屏弹窗，可忽略-. -");
        }
    }
}

/**
 * @description: 日期转字符串函数
 * @param: y,m,d 日期数字 2019 1 1
 * @return: s 日期字符串 "2019-xx-xx"
 */
function dateToString(y,m,d)
{
    var year=y.toString();
    if((m+1)<10){
        var month="0"+(m+1).toString();
    }
    else{
        var month=(m+1).toString();
    }
    if(d<10){
        var day="0"+d.toString();
    }
    else{
        var day=d.toString();
    }
    var s=year+"-"+month+"-"+day;//年-月-日
    return s;
}

/**
 * @description: 获取当天日期字符串函数
 * @param: null
 * @return: s 日期字符串 "2019-xx-xx"
 */
function getTodayDateString()
{
    var date=new Date();
    var y=date.getFullYear();
    var m=date.getMonth();
    var d=date.getDate();

    var s=dateToString(y,m,d);//年-月-日
    return s
}

/**
 * @description: 获取昨天日期字符串函数
 * @param: null
 * @return: s 日期字符串 "2019-xx-xx"
 */
function getYestardayDateString()
{
    var date=new Date();
    date.setDate(date.getDate()-1);
    var y=date.getFullYear();
    var m=date.getMonth();
    var d=date.getDate();
    var s=dateToString(y,m,d);//年-月-日
    return s
}

/**
 * @description: 文章学习函数  (阅读文章+文章学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function articleStudy()
{
    while(!desc("学习").exists());//等待加载出主页
    desc("学习").click();//点击主页正下方的"学习"按钮
    delay(2);
    var listView=className("ListView");//获取文章ListView控件用于翻页
    click(aCatlog);
    delay(2);
    var zt_flag=false;//判断进入专题界面标志
    var fail=0;//点击失败次数
    var date_string=getTodayDateString();//获取当天日期字符串

    for(var i=0,t=0;i<aCount;)
    {
        if(click(date_string,t)==true)//如果点击成功则进入文章页面,不成功意味着本页已经到底,要翻页
        {
            let n=0;
            while(!textContains("欢迎发表你的观点").exists())//如果没有找到评论框则认为没有进入文章界面，一直等待
            {
                delay(1);
                console.warn("正在等待加载文章界面...");
                if(n>3)//等待超过3秒则认为进入了专题界面，退出进下一篇文章
                {
                    console.warn("没找到评论框!该界面非文章界面!");
                    zt_flag=true;
                    break;
                }
                n++;
            }
            if(desc("展开").exists())//如果存在“展开”则认为进入了文章栏中的视频界面需退出
            {
                console.warn("进入了视频界面，即将退出并进下一篇文章!");
                t++;
                back();
                delay(1);
                click("电台");
                delay(1);
                click("最近收听");
                console.log("因为广播被打断，正在重新收听广播...");
                delay(2);
                back();
                while(!desc("学习").exists());
                desc("学习").click();
                delay(2);
                continue;
            }
            if(zt_flag==true)//进入专题页标志
            {
                console.warn("进入了专题界面，即将退出并进下一篇文章!")
                t++;
                back();
                delay(2);
                zt_flag=false;
                continue;
            }
            console.log("正在学习第"+(i+1)+"篇文章...");
            fail=0;//失败次数清0
            article_timing(i,aTime);
            if(i<cCount)//收藏分享2篇文章
            {
                //CollectAndShare(i);//收藏+分享 若c运行到此报错请注释本行！
                //Comment(i);//评论
            }
            back();//返回主界面
            while(!desc("学习").exists());//等待加载出主页
            delay(1);
            i++;
            t++;//t为实际点击的文章控件在当前布局中的标号,和i不同,勿改动!
        }
        else
        {
            if(i==0)//如果第一次点击就没点击成功则认为首页无当天文章
            {
                date_string=getYestardayDateString();
                console.warn("首页没有找到当天文章，即将学习昨日新闻!");
                continue;
            }
            if(fail>3)//连续翻几页没有点击成功则认为今天的新闻还没出来，学习昨天的
            {
                date_string=getYestardayDateString();
                console.warn("没有找到当天文章，即将学习昨日新闻!");
                continue;
            }
            if(!textContains(date_string).exists())//当前页面当天新闻
            {
                fail++;//失败次数加一
            }
            listView.scrollForward();//向下滑动(翻页)
            t=0;
            delay(1.5);
        }
    }
}

/**
 * @description: “百灵”小视频学习函数
 * @param: vCount,vTime
 * @return: null
 */
function videoStudy_bailing(vCount,vTime)
{
    h=device.height;//屏幕高
    w=device.width;//屏幕宽
    x=(w/3)*2;//横坐标2分之3处
    h1=(h/6)*5;//纵坐标6分之5处
    h2=(h/6);//纵坐标6分之1处

    click("百灵");
    delay(2);
    click("竖");
    delay(2);
    var a=className("FrameLayout").depth(23).findOnce(0);//根据控件搜索视频框，但部分手机不适配，改用下面坐标点击
    a.click();
    //click((w/2)+random()*10,h/4);//坐标点击第一个视频
    delay(1);
    for(var i=0;i<vCount;i++)
    {
        console.log("正在观看第"+(i+1)+"个小视频");
        video_timing_bailing(i,vTime);//观看每个小视频
        if(i!=vCount-1){
            swipe(x,h1,x,h2,500);//往下翻（纵坐标从5/6处滑到1/6处）
        }
    }
    back();
    delay(2);
}

/**
 * @description:新闻联播小视频学习函数
 * @param: null
 * @return: null
 */
function videoStudy_news()
{
    click("电视台");
    delay(2)
    click("联播频道");
    delay(3);
    var listView=className("ListView");//获取listView视频列表控件用于翻页
    let s="中央广播电视总台";
    if(!textContains("中央广播电视总台")){
        s="央视网";
    }
    for(var i=0,t=1;i<vCount;)
    {
        if(click(s,t)==true)
        {
            console.log("即将学习第"+(i+1)+"个视频!");
            video_timing_news(i,vTime);//学习每个新闻联播小片段
            back();//返回联播频道界面
            while(!desc("学习").exists());//等待加载出主页
            delay(1);
            i++;
            t++;
            if(i==3)
            {
                listView.scrollForward();//翻页
                delay(2);
                t=2;
            }
        }
        else
        {
            listView.scrollForward();//翻页
            delay(2);
            t=3;
        }
    }
}


/**
 * @description: 听“电台”新闻广播函数  (视听学习+视听学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function listenToRadio()
{
    click("电台");
    delay(2);
    click("听新闻广播");
    delay(2);
    click("正在收听");
    console.log("正在收听“中国之声”广播...");
    delay(2);
    back();//返回电台界面
}

/**
 * @description: 启动app
 * @param: null
 * @return: null
 */
function start_app()
{
    console.setPosition(0,device.height/2);//部分华为手机console有bug请注释本行
    console.show();//部分华为手机console有bug请注释本行
    console.log("正在启动app...");
    if(!launchApp("学习强国"))//启动学习强国app
    {
        console.error("找不到学习强国App!"); 
        return;
    }
    while(!desc("学习").exists())
    {
        console.log("正在等待加载出主页");
        delay(1);
    }
    delay(1);
}


/**
 * @description: 打开本地频道
 * @param: null
 * @return: null
 */
function openLocalChannel()
{
    console.log("开始点击 本地频道");
    if(text("新思想").exists()){
        text("新思想").findOne().parent().parent().child(3).click();
        delay(3);
        className("android.support.v7.widget.RecyclerView").findOne().child(2).click();
        delay(2);
        console.log("返回主界面");
        back();
        text("新思想").findOne().parent().parent().child(0).click();
    }else{
        console.log("请手动点击 本地频道");
    }
}

//主函数
function main()
{
    start_app();//启动app
    var start=new Date().getTime();//程序开始时间
    //challengeQuestion();//挑战答题
    //dailyQuestion();//每日答题
    openLocalChannel();
    videoStudy_news();//看小视频
    listenToRadio();//听电台广播
    var r_start=new Date().getTime();//广播开始时间
    articleStudy();//学习文章，包含点赞、分享和评论
    listenToRadio();//继续听电台
    var end=new Date().getTime();//广播结束时间
    var radio_time=(parseInt((end-r_start)/1000));//广播已经收听的时间
    radio_timing(parseInt((end-r_start)/1000),rTime-radio_time);//广播剩余需收听时间
    end=new Date().getTime();
    console.log("运行结束,共耗时"+(parseInt(end-start))/1000+"秒");
}

module.exports = main;

