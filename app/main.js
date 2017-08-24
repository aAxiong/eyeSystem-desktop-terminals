const electron = require('electron');

const http = require('http').createServer(handler);  //  http 服务
const url = require('url');
const fs = require('fs');
const os = require('os');
const path = require('path');
const io = require("socket.io").listen(http);
const sd = require('silly-datetime');  //时间
const xlsx = require("xlsx");          // xlsx


const {app} = electron;

const {BrowserWindow} = electron;
 
let win;
 
function createWindow() {//创建窗口

  win = new BrowserWindow({useContentSize:true,minWidth:1120,width: 1120,minHeight:768,height: 768});
 
  win.loadURL(`file://${__dirname}/pc/index.html#/sb`);   
  
  win.setMenu(null); //菜单
  win.webContents.openDevTools();    //打开工具开发页面

  win.on('closed', () => {
    win = null;
  });
}
 
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
 
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});



function handler(req,res){ //路径
    var pathname=__dirname+url.parse(req.url).pathname;
    if (path.extname(pathname)=="") {
        pathname+="/";
    }
    if (pathname.charAt(pathname.length-1)=="/"){
        pathname+="index.html";
    }

    fs.exists(pathname,function(exists){
        if(exists){
            switch(path.extname(pathname)){
                case ".html":
                    res.writeHead(200, {"Content-Type": "text/html"});
                    break;
                case ".js":
                    res.writeHead(200, {"Content-Type": "text/javascript"});
                    break;
                case ".css":
                    res.writeHead(200, {"Content-Type": "text/css"});
                    break;
                case ".gif":
                    res.writeHead(200, {"Content-Type": "image/gif"});
                    break;
                case ".jpg":
                    res.writeHead(200, {"Content-Type": "image/jpeg"});
                    break;
                case ".png":
                    res.writeHead(200, {"Content-Type": "image/png"});
                    break;
                default:
                    res.writeHead(200, {"Content-Type": "application/octet-stream"});
            }

            fs.readFile(pathname,function (err,data){
                res.end(data);
            });
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
        }
    });
}


http.listen(8899);


// 获取到你本地的ip 地址
function getIPAdress(){  
    var interfaces = os.networkInterfaces();  
    for(var devName in interfaces){  
          var iface = interfaces[devName];  
          for(var i=0;i<iface.length;i++){  
               var alias = iface[i];  
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                     return alias.address;  
               }  
          }  
    }  
}  


//时间模块 
var time=sd.format(new Date(), 'YYYY-MM-DD');

let filePath=__dirname;  //C:\Users\Administrator\Desktop\
localIP = getIPAdress();

io.sockets.on('connection',function(socket){
    socket.emit('open');
   // console.log(socket);
    socket.emit('ip', { ip: localIP });

    socket.on('start config',function(data){   //打开配置文件 --服务器地址
       fs.exists(filePath +"/"+"ifconfig.json", function(exists) {    //判断是否有这个 配置文件
            if(exists){   //文件存在
               fs.readFile(filePath +"/ifconfig.json","utf8",function (error,data){
                    var str=eval('(' + data + ')');
                    socket.emit('start config', { ser: str.ser });  
                    });
               }
       });

    })

    socket.on('updata config',function(data){   //修改配置文件 --服务器地址
        var js=require(filePath +"/ifconfig.json"); //拿到文件内容
        var str = JSON.stringify(js);  //转换字符串
        var obj2 = JSON.parse(str);   //转换obj
        obj2.ser=data.data;    //服务器文本框的值
        var serText = JSON.stringify(obj2);
        fs.writeFile(filePath +"/ifconfig.json",serText);   
    })

    socket.on('start rp',function(data){   //打开配置文件 --分辨率
       fs.exists(filePath +"/"+"ifconfig.json", function(exists) {    //判断是否有这个 配置文件
            if(exists){   //文件存在
               fs.readFile(filePath +"/ifconfig.json","utf8",function (error,data){
                    var str=eval('(' + data + ')');
                    socket.emit('start rp', { width: str.xianWid, height: str.xianHeight });  
                    });
               }
       });

    })

    socket.on('updata rp',function(data){   //修改配置文件 --分辨率
      console.log(data);
        var js=require(filePath +"/ifconfig.json"); //拿到文件内容
        var str = JSON.stringify(js);  //转换字符串
        var obj2 = JSON.parse(str);   //转换obj
        obj2.xianWid=data.width;    //宽度
        obj2.xianHeight=data.height;  
        var serText = JSON.stringify(obj2);
        fs.writeFile(filePath +"/ifconfig.json",serText);   
    })


    socket.on('show eyesInfo',function(data){   //打开信息文件  
      fs.exists(filePath +'/'+time+".txt", function(exists) {   //判断是否有这个 信息文件
            if(exists){   //文件存在
              fs.readFile(filePath +'/'+time+".txt","utf8",function (error,data){
                    var str=eval('(' + data + ')');
                    socket.emit('show eyesInfo', { data: str });  
                    });
              }
       });
    })





    socket.on('search info',function(data){   //接受搜索内容
        fs.exists(filePath +'/'+time+".txt", function(exists) {   //判断是否有这个 信息文件
            if(exists){   //文件存在
              fs.readFile(filePath +'/'+time+".txt","utf8",function (error,info){
                    var name=data.data;
                    console.log(name);
                    var arr=[];
                    var str=eval('(' + info + ')');
                    for(var i=0;i<str.length;i++){
                      if(name==str[i]['姓名']){
                        arr.push(str[i]);
                      }
                    }
                    socket.emit('search info', { data: arr });  
                    });
              }
       });  
    })

    
    socket.on('delete info',function(data){   //删除信息
      var count=0;
       fs.exists(filePath +'/'+time+".txt", function(exists) {   //判断是否有这个 信息文件
           if(exists){   //文件存在
              fs.readFile(filePath +'/'+time+".txt","utf8",function (error,info){
                    var name=data.data;
                    var str=eval('(' + info + ')');
                    for(var i=str.length-1;i>=0;i--){
                      if(name==str[i]['姓名']){
                        str.splice(i,1);
                      }
                    }
                    var serText = JSON.stringify(str);
                    fs.writeFile(filePath +'/'+time+".txt",serText);   
                  });
              }
       });  


    })



    //socket.emit('delect file',{data:success});

   socket.on('delect file',function(data){   //删除文件
        if(data.success == 1){
            fs.unlinkSync(time+".txt");
        }
    })

    //这里监听客户端的 chat message 事件  由客户端触发
    socket.on('char message',function(data){
        socket.broadcast.emit('char message',data);   //向其他用户发送信息 
    });

    socket.on('ew close',function(data){
        socket.broadcast.emit('ew close',data);   //向其他用户发送信息 
    });
    
     socket.on('route jump',function(data){  //测试的项目
     
        socket.broadcast.emit('route jump',data);   //向其他用户发送信息 
    });


    
    socket.on('wenben',function(data){ //接收到手机端发送来的提交报告数据
     // console.log(data);
       var aq = data.data[0];  //这里是数据
       if(aq == "" || aq == undefined || aq == false)  return;
        fs.exists(filePath +'/'+time+".txt", function(exists) {  

            if(exists){   //文件存在
             fs.readFile(filePath +'/'+time+".txt","utf8",function (error,data){
                 var bq =  data.substring(0,data.length-1);   //如果有新数据进入 
                 var str5 = ','+JSON.stringify(aq);
                 bq +=str5;
                 bq +=']';
                 var strbq=eval('(' + bq + ')');
                 var count=0;
                 for(var i=strbq.length-1;i>=0;i--){
                    if(aq['姓名']==strbq[i]['姓名']&&aq['出生日期']==strbq[i]['出生日期']){
                        // strbq[i]=aq;
                        count++;
                    }
                    if(aq['姓名']==strbq[i]['姓名']&&aq['出生日期']==strbq[i]['出生日期']&&count>1){ 
                      strbq.splice(i,1);
                    }
                 }
                var serText = JSON.stringify(strbq);
                 fs.writeFile(filePath +'/'+time+".txt",serText,function(err){
                    if (err) throw err; 
                    dachu(serText);
                 })
             }) ;
            }
            else{        //文件不存在
                var str = '[';
                var str2 = JSON.stringify(aq);
                str += str2;
                str += ']';
                fs.appendFile(filePath +'/'+time+'.txt',str,function(err){  //创建文件
                     if (err) throw err; 
               });
            }
            // console.log(exists ? "创建成功" : "创建失败");  
        }); 
        socket.broadcast.emit('wenben',data); 
    })
})


 //  // 
//excel 导出     xlsx   
function dachu (tuq){
var _headers = ['姓名', '出生日期', '左眼视力','右眼视力','夜视力','色盲检查','立体视','眼位'];    //头标签   
var _data = eval('('+tuq+')');   
var headers = _headers
                .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
var data = _data
              .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
              .reduce((prev, next) => prev.concat(next))
              .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
var output = Object.assign({}, headers, data);
var outputPos = Object.keys(output);
var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
var wb = {
    SheetNames: ['Sheet'],
    Sheets: {
        'Sheet': Object.assign({}, output, { '!ref': ref })
    }
};
xlsx.writeFile(wb, filePath+'/'+time+'.xlsx');   
}

//2017 -4.14 交接 start



function serachData(){  //查找学生姓名

}


//-end
// 程序安装和卸载   
var handleStartupEvent = function () {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];

  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':
      install();
      return true;
    case '--squirrel-uninstall':
      uninstall();
      app.quit();
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
  }


  function install() {
    var cp = require('child_process');    
    var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
    var target = path.basename(process.execPath);
    var child = cp.spawn(updateDotExe, ["--createShortcut", target], { detached: true });
    child.on('close', function(code) {
        app.quit();
    });
  }
   function uninstall() {
    var cp = require('child_process');    
    var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
    var target = path.basename(process.execPath);
    var child = cp.spawn(updateDotExe, ["--removeShortcut", target], { detached: true });
    child.on('close', function(code) {
        app.quit();
    });
  }

};

if (handleStartupEvent()) {
  return;
}

