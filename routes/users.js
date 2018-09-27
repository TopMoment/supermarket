var express = require('express');
var router = express.Router();

// 引入连接数据库模块
const connection = require('./conn')
// 调用mysql
connection.connect(() => {
  console.log('连接数据库成功;')
});

// 接收添加用户添加账号的请求
router.post('/userAdd', (req,res) => {
  // 接收前端参数账号
  let {username, password, group} = req.body;
  // console.log(username, password, group);
  const sqlStr = `insert into users(id, username, password, groups, ctime) values (default,?,?,?,default)`;
  
// const sqlParams = [username, password, group]  数组可以直接解析变量
  const sqlParams = [`${username}`, `${password}`, `${group}`]
  connection.query(sqlStr, sqlParams, (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log(data);
      if (data.affectedRows > 0) {
        res.send({'errcode' : 1, "msg": "添加成功!"})
      } else {
        res.send({'errcode' : 0, "msg": "添加失败!"})
      }
    }
  })

});

router.get('/userList', (req, res) => {
  // 构造sql语句 查询
  const sqlStr = 'select * from users order by ctime desc';
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
     res.send(data);
    }
  })

});
// 接收单挑删除请求的方式
router.get('/userDeleteOne', (req, res) => {
  let {id} = req.query;

  const sqlStr = `delete from users where id = ${id}`;
//  执行删除
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (data.affectedRows > 0) {
        res.send({'errcode' : 1, "msg": "删除成功!"})
      } else {
        res.send({'errcode' : 0, "msg": "删除失败!"})
      }
    }
  })

})


module.exports = router;
