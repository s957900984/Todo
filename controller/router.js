const formidable = require("formidable");
const dao = require("../model/dao.js");

exports.getLogin = (request, response, next) => {
	let tips = "";
	let tip = request.query.tip;
	if(tip == "1") tips = "用户名或密码错误";
	else if(tip == "2") tips = "您还没有登陆呢";
	response.render("login", {
		"tip": tips
	});
}

exports.postLogin = (request, response, next) => {
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let userName = fields.userName;
		let userPass = fields.userPass;
		let sql = "select * from login where userName = '" + userName + "' and userPass = '" + userPass + "'";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			if(result.length == 0) {
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/login?tip=1"
				});
				response.end();
			} else {
				request.session.userName = userName;
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=2"
				});
				response.end();
			}
		});
	});
}

exports.getIndex = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = 2;
	if(request.query.list != null) id = parseInt(request.query.list);
	let sql = "select * from lists";
	dao.query(sql, (err, left_result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		if(id == 1) {
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let day = now.getDate();
			if(month < 10) month = "0" + month;
			if(day < 10) day = "0" + day;
			let now_date = year + "-" + month + "-" + day;
			sql = "select * from things where time='" + now_date + "' and isdelete=0 order by urgent desc";
		} else if(id == 2) sql = "select * from things where isdelete=0 order by urgent desc";
		else if(id == 3) sql = "select * from things where isdelete=1 order by urgent desc";
		else sql = "select * from things where list_id=" + id + " and isdelete=0 order by urgent desc";
		dao.query(sql, (err, right_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.render("index", {
					"userName": request.session.userName,
					"lists": left_result,
					"contents": right_result,
					"list_flag": id
			});
		});
	});
}
//添加任务事项
exports.postAddThing = (request, response, next) => { 
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	let list_id = 2;
	if(request.query.list != null) list_id = parseInt(request.query.list);
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		let id = request.query.update;
		let title = fields.title;
		let message = fields.message;
		let urgent = parseInt(fields.urgent);
		let year = fields.year;
		let month = fields.month;
		let day = fields.day;
		if(month < 10) month = "0" + parseInt(month);
		if(day < 10) day = "0" + parseInt(day);
		let time = year + "-" + month + "-" + day;
		let sql = "insert into things values(null,?,?,?,?,0,?)";
		let params = [title, message, urgent, time, list_id];
		if(id != null) {
			sql = "update things set title=?,message=?,urgent=?,time=? where id=" + id;
			params = [title, message, urgent, time];
			dao.update(sql, params, (err, result) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=" + list_id
				});
				response.end();
			});
		} else {
			dao.add(sql, params, (err, result) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=" + list_id
				});
				response.end();
			});
		}
	});
}
//完成任务
exports.getDeleteThing = (request, response, next) => { 
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = request.query.id;
	let list = request.query.list;
	let sql = "update things set isdelete=1 where id=?";
	dao.update(sql, [id], (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
		});
		response.end();
	});
}
//彻底删除
exports.getRemoveThing = (request, response, next) => {//实现彻底删除功能。
	if(request.session.userName == null) {//使用session判断用户是否登陆，如果用户名为空，则域名重定向，访问location的url，即返回登陆页面。
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = request.query.id;//使用query解析路由中每个查询字符串参数的属性的对象，赋值给id。
	let sql = "delete from things where id=" + id;//使用id编写mysql删除语句并赋值给sql。
	dao.remove(sql, (err, result) => {//删除数据库中相应id的任务事项，结果返回给result。
		if(err) {//如果错误继续执行该请求，使用next()函数触发下一个回调函数，如果没有下一个回调函数则触发下一个中间件。
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {//如果成功，域名重定向，暂时先用location的URL访问。
			"Location": "http://127.0.0.1:3000/index?list=3"
		});
		response.end();//响应结束，使 Web 服务器停止处理脚本并返回当前结果。
	});
}

exports.postAddList = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		let listName = fields.listName;
		let sql = "insert into lists values(null,?,null)";
		dao.add(sql, [listName], (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.getRemoveList = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let list = request.query.list;
	let sql = "delete from lists where id=" + parseInt(request.query.id);
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
		});
		response.end();
	});
}

exports.postSearch = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var search = fields.search;
		var sql = "select * from things where title like '%" + search + "%' and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			sql = "select * from lists";
			dao.query(sql, (err, resl) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.render("index", {
					"userName": request.session.userName,
					"lists": resl,
					"contents": result,
					"list_flag": -1
				});
			});
		});
	});
}

exports.getLogout = (request, response, next) => {
	request.session.userName = null;
	response.writeHead(302, {
		"Location": "http://127.0.0.1:3000/login?tip=2"
	});
	response.end();
}