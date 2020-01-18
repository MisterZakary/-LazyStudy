 //先引用
importClass(android.database.sqlite.SQLiteDatabase);

function result(keyw) {
    //数据文件名
    var dbName = "tiku.db";
    //文件路径
    var path = files.path(dbName);
    //确保文件存在
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    //db.execSQL("UPDATE tiku SET wrongAnswer='0'");
    //db.close;
    //keyw="无产阶级";
    
    //var query="select rowid from tiku group by question HAVING count(*)>1";
    //var query="SELECT * FROM tiku GROUP BY question HAVING count( * ) >1";
    var query = "select answer from tikuNet where question LIKE '%" + keyw + "%'";
    //var query="select count(*) from tikuNet WHERE question LIKE '"+ keyw + "'";
    
    //var query="select count(1) from tikuNet";
    //db.execSQL(query);
    toastLog(query);
    var cursor = db.rawQuery(query, null);
    
    if (cursor.getCount()) {
        cursor.moveToFirst();
        do {
            toastLog(cursor.getString(0));
        } while (cursor.moveToNext());
    }
    cursor.close();
    db.close();
    //return toaststr;
}
let keyw = "国旗设计者";
//let keyw = "2016年7月1日，习近平总书记在庆祝中国共产党成立95周年大会上的讲话指出，是党执政兴国的第一要务，是解决中国所有问题的关键。";
result(keyw);//;);;);;);;);;;;中国共产党成立95周年大会上的讲话指出，是党执政兴国的第一要务，是解决中国所有问题的关键。";
//result(keyw);//;);;);;);;);;;;;;;;;;;;;