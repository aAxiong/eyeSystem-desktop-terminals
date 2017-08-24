
var url  = require("url"),
     fs=require("fs"),
     http=require("http").createServer(handler),
     path = require("path");
    // os=require('os'),
     //io = require("socket.io").listen(http);
 
http.listen(3000);


// iptable={},
// ifaces=os.networkInterfaces();
// for (var dev in ifaces) {
//   ifaces[dev].forEach(function(details,alias){
//     if (details.family=='IPv4') {
//       iptable[dev+(alias?':'+alias:'')]=details.address;
//     }
//   });
// }
// console.log(iptable);


function handler(req,res){
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

// io.sockets.on('connection',function(socket){

//     //socket.emit('open');

//     // socket.emit('news', { hello: 'data' });

//     // socket.on('my other event', function (data) { 
//     //      console.log(data);  //
        
//     // });    

//     //这里监听客户端的 chat message 事件  由客户端触发
//     socket.on('char message',function(data){
//         socket.broadcast.emit('char message',data);   //向其他用户发送信息 
//     });


// })







