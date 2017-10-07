const express = require('express');
const routes = require('./routes');
const user = require('./routes/user');
const http = require('http');
const path = require('path');
const lessMiddleware = require('less-middleware');

const app = express();

const server = http.createServer(app);
const io = require('socket.io').listen(server)

// all environments
app.set('port', process.env.PORT || 3000);
// 设置视图的对应目录
app.set('views', path.join(__dirname, 'views'));
// 设置默认的模板引擎
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(lessMiddleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));
// websocket监听
io.on('connection', function(socket){
  socket.emit('open')
  var client = {
    socket: socket,
    id: '',
    name: false
  }
  socket.on('message', function(msg){
    var obj = {
      time: new Date().toLocaleTimeString()
    };
    if(!client.name){
      client.name = msg.uname;
      client.id = msg.uuid
      obj['text'] = client.name;
      obj['author'] = 'Addorleave';
      obj['type'] = 'welcome';
      obj['id'] = client.id;
      console.log(client.name + ' login')
      // 返回消息
      socket.emit('addorleave', obj)
      // 广播向其他用户发消息
      socket.broadcast.emit('addorleave', obj);
    }else{
      // 如果不是第一次的连接， 正常聊天
      obj['text'] = msg.msg;
      obj['author'] = client.name;
      obj['id'] = client.id;
      obj['type'] = 'message';
      // 返回消息
      socket.emit('msg', obj)
      // 广播向其他用户发消息
      socket.broadcast.emit('msg', obj)
    }
  })
  // 断开连接
  socket.on("disconnect", function(){
    if(client.name){
      var obj = {
        time: new Date().toLocaleTimeString()
      };
      obj['text'] = client.name;
      obj['author'] = 'Addorleave';
      obj['type'] = 'bye';

      socket.emit('addorleave', obj)
      socket.broadcast.emit('addorleave', obj);
    }
  })
})

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

const getColor = () =>{

}
