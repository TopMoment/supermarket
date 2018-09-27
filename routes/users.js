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
  const sqlStr = `insert into users(username, password, groups) values ('${username}', '${password}', '${group}')`;
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log(data);
      if (data.affectedRows > 0) {
        res.send({'errcode' : '1', "msg": "添加成功!"})
      } else {
        res.send({'errcode' : '0', "msg": "添加失败!"})
      }
    }
  })

})
module.exports = router;
