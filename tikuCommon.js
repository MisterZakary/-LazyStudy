importClass(android.database.sqlite.SQLiteDatabase);

function searchTiku(keyw) {
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

    query = "SELECT answer FROM tiku WHERE question LIKE '" + keyw + "%'"
    //query="select * from tiku"
    //db.execSQL(query);

    var cursor = db.rawQuery(query, null);
    cursor.moveToFirst();
    //var toaststr = "共有" + cursor.getCount() + "行记录，答案是 :";
    //找到记录
    if (cursor.getCount()) {
        cursor.moveToFirst();
        //toast("找到答案");
        //toaststr = toaststr + cursor.getString(0);  
        var ansTiku = cursor.getString(0);
        cursor.close();
        return ansTiku;
    } else {
        log("题库中未找到: " + keyw);
        cursor.close();
        return "";
    }
}

function insertOrUpdate(sqlstr) {
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
    db.execSQL(sqlstr);
    toastLog(sqlstr);
    db.close();
}

exports.searchTiku= searchTiku;
exports.insertOrUpdate= insertOrUpdate;