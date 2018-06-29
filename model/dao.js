const mysql = require("mysql");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydemo_node'
});

connection.connect(function(err){
	if(err){
		console.log("数据库连接失败");
		return;
	}
});
//从数据库查数据
exports.query = (sql, callback) => { 
	connection.query(sql, function(err, result) {
		if(err) {
			throw err;
			callback("查询失败", null);
			return;
		}
		callback(null, result);
	});
}
//向数据库添加数据
exports.add = (sql, params, callback) => { 
	connection.query(sql, params, function(err, result) {
		if(err) {
			throw err;
			callback("插入失败", null);
			return;
		}
		callback(null, result);
	});
}
//数据库更新操作
exports.update = (sql, params, callback) => { 
	connection.query(sql, params, function(err, result) {
		if(err) {
			callback("更新失败", null);
			return;
		}
		callback(null, result);
	});
}

exports.remove = (sql, callback) => {
	connection.query(sql, function(err, result) {
		if(err) {
			throw err;
			callback("删除失败",null);
			return;
		}
		callback(null,result);
	});
}