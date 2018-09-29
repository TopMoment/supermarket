var express = require('express');
var router = express.Router();

// 引入连接数据库模块
const connection = require('./conn')
// 调用mysql
connection.connect(() => {
  console.log('连接数据库成功;')
});
// 检查用户名和密码是否正确
router.post('/checklogin',(req, res) => {
  // 接受用户名和密码
  let {username, password} = req.body;
  const sqlStr = `select * from users where username='${username}' and password='${password}'`;
  connection.query(sqlStr, (err, data) => {
    if(err) {
      throw err
    } else {
      if (data.length) {
        // 登录成功 设置cookie
        res.cookie('username', data[0].username);
        // res.cookie('password', data[0].password);
        res.cookie('groups', data[0].groups);

        res.send({'errcode' : 1, "msg": "恭喜 登录成功!"})
      } else {
        res.send({'errcode' : 0, "msg": "登录失败! 请检查用户名和密码"})
      }
    }
  })
})
// 检查用户是否已经登陆过
router.get('/checkIsLogin', (req, res) => {
  let username = req.cookies.username
  if(username) {
    res.send('ok!')
  } else {
    res.send('alert("请登录后再操作");location.href = "./login.html";')
  }
});
// 退出登录
router.get('/logout',(req,res) => {
  res.clearCookie('username');
  res.clearCookie('groups');
  res.send('<script>alert("退出成功!"); location.href = "http://localhost:666/login.html"</script>')

})
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

});
// 修改账户 把原来的数据查询出来
router.get('/useredit', (req, res) => {
  // 接收id
  let {id} = req.query;
  // 根据id 构造sql语句
  const sqlStr = `select * from users where id = ${id}`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.send(data);
    }
  })
  });
  // 把修改后的新数据保存回去 覆盖掉原来的
  router.post('/saveedit', (req, res) => {
    let {username, password, group, id} = req.body;
    // 构造sql语句
    const sqlStr = `update users set username='${username}', password='${password}', groups= '${group}' where id = ${id}`;
 
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
      if (err) {
        throw err;
      } else {
        if (data.affectedRows > 0) {
          res.send({'errcode':1, 'msg':"修改成功!"})
        } else {
          res.send({'errcode':0, 'msg':"修改失败!"})
        }
      }
    })
  });
  // 接收批量删除的数组
  router.post('/batchesdel',(req, res) => {
    // 接收需要批量删除的id们
    let idArr = req.body['idArr[]']
    // 构造sql语句
    const sqlStr = `delete from users where id in (${idArr})`;
     
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (data.affectedRows > 0) {
        res.send({'errcode':1, 'msg':"批量删除成功!"})
      } else {
        res.send({'errcode':0, 'msg':"批量删除失败!"})
      }
    }
  })
  })
 



module.exports = router;
