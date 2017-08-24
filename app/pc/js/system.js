
												//配置文件  配置参数
var config = {  
    WinWidth : 1220,                            //获取目前屏幕宽度
    WinHeight : 768,                            //获取目前屏幕高度
    ResolutionWide : 297,                       //分辨率宽设置   身份证
    ResolutionHigh : 195,                       //分辨率高设置   身份证
    HiddenWidth : 0,                            //隐藏的宽
    HiddenHeight : 0,                           //隐藏的高
    Distance : 2.5,                             //测试距离,默认值为2.5M
    ELength : 126.16,							//E的边长  默认 126.16
    ECMth : 3.636,                              //E的厘米宽
    EboxLen : 0,                                //E盒子的边长
    CheckediTems : [],                          //检查的项目 默认4个都有   里面有值就是隐藏的值
    MOKHeight : 0,                              //1,2,3,4,5,6   选中的导航值
    ColorBlindImg:["s1.png","s2.png","s3.png"], //色盲的图片
    RedGreenRandomImg:["h1.png","h2.png","h3.png",'h4.png'], //红绿随机点立体图
    localIp : "127.0.0.1"
}



var system = {
	// 初始化函数
	init : function(){ 
	    this.MultiControl().Io();   //多屏操控函数
		this.WindowDrag();     //窗口拖
		this.EventTrigger();   //事件初始函数		
	},
	//事件初始函数
	EventTrigger:function(){
		
		this.SetUp();
		this.Navdiscolor();    // 事件状体变色
		this.SeachQuery();     //查询学生功能
	},
	socket : "",
	MultiControl : function(){     //窗口控制函数
		var _that =this;
		function Io(){
			socket = io.connect('http://localhost:8899');
			//console.log(config.CheckediTems);
			//socket.emit('route jump',{ route :  });		
			socket.on('ip',function(data){
				data.ip !="" ? config.localIp = data.ip : config.localIp=config.localIp;
				config.CheckediTems == ""? config.localIp :  config.localIp +=","+config.CheckediTems.toString();
				// console.log(config.localIp);
				_that.MobilescanCode().mo();  //二维码函数
				socket.emit('start config',{ state : "1" }); //发送打开配置文件--服务器地址
				socket.emit('start rp',{ state : "1" }); //发送打开配置文件--分辨率矫正
				socket.emit('show eyesInfo',{ state : "1" }); //发送打开信息文件
			});



			socket.on('ew close',function(data){
				 data.state == "success" ? $(".TwoDimenWindow").hide() : "";
			})

			socket.on('char message',function(data){    //别人给你发送的信息   接收到的信息

				data.NUM == ""? data.NUM = 1 : data.NUM;

				// console.log(data.NUM);

				//console.log(data.NUM)

            	Rf(data);

            	// MF : 1  对应下面的功能导航  
            	// NUM : 1-13 分别对应的是  度数设定4.0  
            	// NUM : 14 下一步   //图片切换的值
            	// NUM : 15 上一步	 //图片切换的值  目前只有下一步 
            	// NUM : 16 提交报告

            	// { "MF"：1,"NUM": 1}

          	});
			socket.on('start config',function(data){   //接受到打开配置文件的命令  --服务器地址
				var ser=data.ser;
				$(".dpart .commun input").val(ser);

			})

			socket.on('start rp',function(data){   //接受到打开配置文件的命令  --服务器地址
				var width=parseInt(data.width);
				var height=parseInt(data.height);
				system.xianDrap(width,height);  //画线 

			})

			socket.on('show eyesInfo',function(data){   //接收到 展示信息命令
				var data=data.data;
 				var re = $(".Resbox table");
          		for(var i=data.length-1;i>=0;i--){
          		$('<tr class="try"><td class="r1" data-name="'+data[i]['姓名']+'">'+data[i]['姓名']+'</td><td class="r2 rg" data-bir="'+data[i]['出生日期']+'">'+ data[i]['出生日期']+'</td><td class="r2">'+data[i]['左眼视力']+'</td><td class="r2">'+data[i]['右眼视力']+'</td><td class="r2">'+data[i]['夜视力']+'</td><td class="r2">'+data[i]['色盲检查']+'</td><td class="r3">'+data[i]['立体视']+'</td><td class="r1">'+data[i]['眼位']+'</td><tr/>').appendTo(re);
          		}
          		AD(data);

			})
			socket.on('search info',function(data){   //接收到查找到的值  --查找学生信息 根据名字
				var data=data.data;
				if(data.length>0){
					var re = $(".Resbox table");
          			for(var i=0;i<data.length;i++){
          			$('<tr class="try"><td class="r1" data-name="'+data[i]['姓名']+'">'+data[i]['姓名']+'</td><td class="r2 rg" data-bir="'+data[i]['出生日期']+'">'+ data[i]['出生日期']+'</td><td class="r2">'+data[i]['左眼视力']+'</td><td class="r2">'+data[i]['右眼视力']+'</td><td class="r2">'+data[i]['夜视力']+'</td><td class="r2">'+data[i]['色盲检查']+'</td><td class="r3">'+data[i]['立体视']+'</td><td class="r1">'+data[i]['眼位']+'</td><tr/>').appendTo(re);
          			}
          			AD(data);
					}
			})


          	socket.on('wenben',function(data){
          		 var data = data.data;  
          		 var re = $(".Resbox table");
          		 if($("td[data-name='"+data[0]['姓名']+"']").length>0&&$("td[data-bir='"+data[0]['出生日期']+"']").length>0){
          		 var uPtr=$("td[data-name='"+data[0]['姓名']+"']").parent("tr").find("td[data-bir='"+data[0]['出生日期']+"']").parent("tr");
          		 uPtr.prependTo(re);
          		 uPtr.find("td:eq(2)").text(data[0]['左眼视力']);
          		 uPtr.find("td:eq(3)").text(data[0]['右眼视力']);
          		 if("异常"==data[0]['夜视力']){uPtr.find("td:eq(4)").addClass("rcolor").text(data[0]['夜视力']);}
          		 else if("未测"==data[0]['夜视力']){$('<td class="r2 gcolor">'+data[0]['夜视力']+'</td>').appendTo(tr)}
          		 else{uPtr.find("td:eq(4)").removeClass("rcolor").text(data[0]['夜视力']);}

				 if("异常"==data[0]['色盲检查']){uPtr.find("td:eq(5)").addClass("rcolor").text(data[0]['色盲检查']);}
				 else if("未测"==data[0]['色盲检查']){$('<td class="r2 gcolor">'+data[0]['色盲检查']+'</td>').appendTo(tr)}
				 else{uPtr.find("td:eq(5)").removeClass("rcolor").text(data[0]['色盲检查']);}

				 if("异常"==data[0]['立体视']){uPtr.find("td:eq(6)").addClass("rcolor").text(data[0]['立体视']);}
				 else if("未测"==data[0]['立体视']){$('<td class="r2 gcolor">'+data[0]['立体视']+'</td>').appendTo(tr)}
				 else{uPtr.find("td:eq(6)").removeClass("rcolor").text(data[0]['立体视']);}

				 if("异常"==data[0]['眼位']){uPtr.find("td:eq(7)").addClass("rcolor").text(data[0]['眼位']);}
				 else if("未测"==data[0]['眼位']){$('<td class="r2 gcolor">'+data[0]['眼位']+'</td>').appendTo(tr)}
				 else{uPtr.find("td:eq(7)").removeClass("rcolor").text(data[0]['眼位']);}
				
          		 }
          		 else{
          		 var tr=$('<tr class="try"><td class="r1" data-name="'+data[0]['姓名']+'">'+ data[0]['姓名']+'</td><td class="r2 rg" data-bir="'+data[0]['出生日期']+'">'+data[0]['出生日期']+'</td><td class="r2">'+data[0]['左眼视力']+'</td><td class="r2">'+data[0]['右眼视力']+'</td></tr>').prependTo(re);
          		 if("异常"==data[0]['夜视力']){$('<td class="r2 color">'+data[0]['夜视力']+'</td>').appendTo(tr)}
          		 else if("未测"==data[0]['夜视力']){$('<td class="r2 gcolor">'+data[0]['夜视力']+'</td>').appendTo(tr)}
          		 else{$('<td class="r2">'+data[0]['夜视力']+'</td>').appendTo(tr);}

				 if("异常"==data[0]['色盲检查']){$('<td class="r2 rcolor">'+data[0]['色盲检查']+'</td>').appendTo(tr)}
				 else if("未测"==data[0]['色盲检查']){$('<td class="r2 gcolor">'+data[0]['色盲检查']+'</td>').appendTo(tr)}
				 else{$('<td class="r2">'+data[0]['色盲检查']+'</td>').appendTo(tr);}

				 if("异常"==data[0]['立体视']){$('<td class="r3 rcolor">'+data[0]['立体视']+'</td>').appendTo(tr)}
				 else if("未测"==data[0]['立体视']){$('<td class="r2 gcolor">'+data[0]['立体视']+'</td>').appendTo(tr)}
				 else{$('<td class="r3">'+data[0]['立体视']+'</td>').appendTo(tr);}

				 if("异常"==data[0]['眼位']){$('<td class="r1 rcolor">'+data[0]['眼位']+'</td>').appendTo(tr)}
				 else if("未测"==data[0]['眼位']){$('<td class="r2 gcolor">'+data[0]['眼位']+'</td>').appendTo(tr)}
				 else{$('<td class="r1">'+data[0]['眼位']+'</td>').appendTo(tr);}	
          		 }
          		if($(".try td:eq(0)")){}
          	});



		}
		function AD(data){  //判断表格里面是否有异常，有就变色
			for(var i=0;i<data.length;i++){
				for(var j=4;j<8;j++){
					var text=$(".Resbox table tr.try").eq(i).find("td").eq(j).text();
					if("异常"==text){
					$(".Resbox table tr.try").eq(i).find("td").eq(j).addClass("rcolor");
					}
					if("未测"==text){
						$(".Resbox table tr.try").eq(i).find("td").eq(j).addClass("gcolor");
					}
				}
			}
		}
		
		function Rf(DT){            //状态控制函数  收到信息
			//导航栏页面切换
			// MF  1 - 6    1是视力表  2 夜视力 3色盲筛查图  4红绿随机点立体图   5检测报告  6设置

			

			//var hash = "";

			switch(DT.MF){
				case 1 :  SL(); break;
				case 2 :  YS(); break;
				case 3 :  SM(); break;
				case 4 :  HL(); break;
				case 5 :  JC(); break;
				case 6 :  SZ(); break;
			}

			function SL(){ window.location.hash = "/sb";_that.EventState().a(0);  _that.EventState().b(DT.NUM-1,DT.EQ);  }
			function YS(){ window.location.hash = "/ys"; _that.EventState().a(1); config.ColorBlindImg.sort(); $("#colorScreen .sCbox img").attr("src", "images/PRO/" + config.ColorBlindImg[0]);  _that.EventState().c(DT.NUM-1,DT.EQ);  }
			function SM(){ window.location.hash = "/sm"; _that.EventState().a(2);  config.RedGreenRandomImg.sort(); $("#redGreenRandom .sCbox img").attr("src", "images/PRO/" + config.RedGreenRandomImg[0]);   _that.EventState().d(DT.NUM); }
			function HL(){ window.location.hash = "/hl";_that.EventState().a(3); config.ColorBlindImg.sort(); $("#colorScreen .sCbox img").attr("src", "images/PRO/" + config.ColorBlindImg[0]);   _that.EventState().e(DT.NUM); }
			function JC(){ window.location.hash = "/jc";_that.EventState().a(4);  }
			function SZ(){ window.location.hash = "/sz";_that.EventState().a(5); }

		}

		return {
			Io : Io,
		}

		

	      //  $(".headTit").click(function(){   //你给别人发送的信息
	      //  	   // window.location.hash = "/sz";
	      //  	   // $(".SmallTit li").removeClass("active").eq(5).addClass("active");
	      //      socket.emit('char message', { my: 'two' });
	      // })
	},

	EVisten :function(){   //E的算法函数   返回长度
		function EPIXELS(MRECORD){    //E的像素
			var DeCimal = 0.1;   //小数记录 默认 4.0   第一次传参默认4.0
			var AngDu = 1/6;     //视角度数	默认 1/6
			var CutValue = 0.017453293;   //度数*(2PI/360) 得到弧度
			var length = 0;      //边长单位 mm
			var EProPort = 0;    //E的实际比  身份证85.6 
			var LengPX = 0;      //边长像素 px
			var StandLen = 85.6; //身份证长度
			
			switch(MRECORD){
				case 5.3: DeCimal = 2.0;  break;
				case 5.2: DeCimal = 1.5;  break;
				case 5.1: DeCimal = 1.2;  break;
				case 5.0: DeCimal = 1.0;  break;
				case 4.9: DeCimal = 0.8;  break;
				case 4.8: DeCimal = 0.6;  break;
				case 4.7: DeCimal = 0.5;  break; 
				case 4.6: DeCimal = 0.4;  break;
				case 4.5: DeCimal = 0.3;  break;
				case 4.4: DeCimal = 0.25;  break;
				case 4.3: DeCimal = 0.2;  break;
				case 4.2: DeCimal = 0.15; break;
				case 4.1: DeCimal = 0.12; break;
				case 4.0: DeCimal = 0.1;  break;
				default:
					DeCimal = 0.1;  break;
			}

			AngDu = (1/DeCimal) * (1/60);    //视角度数
			length = Math.tan(AngDu*CutValue) * config.Distance * 5 * 1000;  //单个E的边长   一个E有5个间隙 *5 1000转单位
			config.ECMth = length / 10; 
			EProPort = StandLen/length;            //实际比
			LengPX = config.ResolutionWide/ EProPort;   //获取到E的像素宽

            return LengPX;
		}
		return {
			EPIXELS : EPIXELS
		}
	},

	ERandom : function(CM){   //E的随机

		var cls = "",newes = [],es = ["W-E","A-E","S-E","D-E"];
		CM ==0 ? cls = "visualChat" : cls = "nightVision";
		if(arguments[1]!=undefined){
			newes = arguments[1];
		}else{
		   newes = es.sort(function(){ return 0.5 - Math.random() });
		}

		for(var i = 0;i<$("."+cls+" .visVaE img").length;i++){
			$("."+cls+" .visVaE img").eq(i).removeClass().addClass(newes[i]);
		}	

		// if(arguments[0]!=undefined){

		// }else{
		// 	var ;
		// 	newes = es.sort(function(){ return 0.5 - Math.random() });		
		// };

		// for(var i = 0;i<$(".visVaE img").length;i++){
		// 	$(".visVaE img").eq(i).removeClass().addClass(newes[i]);
		// }	

	},

	InizFun : function(){
		this.EventState().c(0); this.EventState().b(0); ng = 0; ny = 0;  
		 
		
		
	},

	//窗口拖动函数
	WindowDrag :function(){
		var _that = this;
		_that.layout();
		$(window).resize(function(){
			_that.layout();
		})

	},

	//手机扫码主函数
	MobilescanCode : function(){
         //二维码生成	
         document.getElementById('qrcode').innerHTML = "";
         new QRCode(document.getElementById('qrcode'), 'http://'+config.localIp+':8899/m/index.html');


         //ip 地址修改
         $(".Dimeaddres").text('http://'+config.localIp+':8899/m/index.html');
         $(".DimeIp input").val(config.localIp);

		 function mo(){
		 	$(".MobileCode").click(function(){
		 		 $(".TwoDimenWindow").show();
		 	})
		 	$(".TwoDimenWindow .DimeClose").click(function(){
		 		 $(".TwoDimenWindow").hide();
		 	});	
		 	$(".Dimetishi img").click(function(){
		 		$(".Dimetishi").hide();
		 	})
		 }
		 return {
		 	mo : mo
		 }
	},

	//设置的函数
	SetUp :function(){      //需要检测的项目
		$.ajax({
			url:"http://sight.baifoxs.com/index.php/Admin/ExlInput/get_test",
			data:{},
			datatype:"post",
			 success: function (data) {
			 	var re=$(".savaSelect select");
				$.each(data, function(index, value, data) {	
					$("<option value='"+index+"'>"+value+"</option>").appendTo(re);
				});
             },
            error:function(XMLHttpRequest, textStatus, errorThrown){
            	var re=$(".savaSelect select");
            	$("<option >检查是否联网</option>").appendTo(re);
            }
		})
		var operUl = $(".operUl li");
		operUl.click(function(){
			var index = $(this).index();
			
			var indexa = $(this);

			if(indexa.hasClass('active')){
				indexa.removeClass("active");
				config.CheckediTems.push(index);
			}else{
				for(var i = 0;i<config.CheckediTems.length;i++){
					 if(config.CheckediTems[i]==index){
					 	 config.CheckediTems.splice(i,1);
					 }
				}
				indexa.addClass("active");
			}
			if(config.CheckediTems.length>0){
				$(".SmallTit li").show();
				for(var j = 0;j<config.CheckediTems.length;j++){
					var b = config.CheckediTems[j];
					$(".SmallTit li").eq(b).hide();
				}
			}else{
				$(".SmallTit li").show();
			}

			socket.emit('route jump',{ route : config.CheckediTems });



		});
	},

	//事件状态 变色 
	Navdiscolor : function(){
		var _that =this;
		this._thsm = ".SmallTit li a";                 //导航
		this._thvi = ".visualChat .visValue li a";     //视力E
		this._thys = ".nightVision .visValue li a";    //夜视E
		this._thvimg = ".visualChat .visVaE img";      //视力E图片
		this._thyimg = ".nightVision .visVaE img";     //夜视E图片
		var _thvbtn = "#visuabtn";                     //视力按钮
		var _thybtn = "#nightbtn";                     //夜视按钮
		this._colorbtnPrev = "#colorbtnPrev";           //色盲上一个按钮
		this._colorbtnNext = "#colorbtnNext";           //色盲下一个按钮
		var _colorImg = "#colorScreen .sCbox img";     	//色盲图片
		this._redGreenPrev = "#redGreenPrev";           	//红绿上一个按钮
		this._redGreenNext = "#redGreenNext";           	//红绿下一个按钮
		var _redGreenImg = "#redGreenRandom .sCbox img"; 	//红绿图片
		var _garound = ".garound" ;                       //左边大div
		var _header = ".header";                        	//头部大div
		this._resary = ".resary";                         //分辨率按钮
		var _ResolvingPower = ".ResolvingPower";         	//分辨率窗体
		var _ResClose = ".ResolvingPower .DimeClose";    	//分辨率关闭 
		var _operzhi =".setUp .operzhi .lightBtn";       	//设置 
		var _ser='.Report a'  ;                          	//云服务上传按钮
        var _LineSight = ".lightshe";                    	//视距按钮
		var _LineSightCl = ".LineSight .DimeClose";        //视距关闭按钮
		var _DimeChong = ".LineSight .DimeChong";          //视距重置
		var _delbtn = ".delbtn";                           //删除按钮
		var _DelSure = ".DelSure";                         //信息界面
		var _DelSureBtn = ".DelSure .DimeClose";           //信息按钮
		var _SDimeChong = ".DelSure .DimeChong";           //信息确定按钮
		var _Resbox = ".Resbox table .try";                  //table清空
		ng= 0,ny =0;


		//导航
		$(this._thsm).click(function(){  
			var n = $(this).index(_that._thsm);
			_that.EventState().a(n);
		});

		//视力表E
		$(this._thvi).click(function(){
			ng = $(this).index(_that._thvi);
			_that.EventState().b(ng);
		});
		$(_thvbtn).click(function(){

			if(ng<$(_that._thvi).length-1){
				ng = ng+1;
				_that.EventState().b(ng);
			}
		});

		//夜视力E
		$(this._thys).click(function(){
			ny=$(this).index(_that._thys);
			_that.EventState().c(ny);
		});
		$(_thybtn).click(function(){
			if(ny<$(_that._thys).length-1){
				ny = ny+1;
				_that.EventState().c(ny);
			}
		});

		//色盲图 下一个
		$(this._colorbtnNext).click(function(){
			   var first = config.ColorBlindImg.shift();
			   config.ColorBlindImg.push(first);    
			   $(_colorImg).attr("src", "images/PRO/" + config.ColorBlindImg[0]);

		});

		//色盲图 上一个
		$(this._colorbtnPrev).click(function(){
			   var last = config.ColorBlindImg.pop();
			    config.ColorBlindImg.unshift(last);    
			   $(_colorImg).attr("src", "images/PRO/" + last);

		});

		//红绿图 下一个
		$(this._redGreenNext).click(function(){
			   var first = config.RedGreenRandomImg.shift();
			   config.RedGreenRandomImg.push(first);    
			   $(_redGreenImg).attr("src", "images/PRO/" + config.RedGreenRandomImg[0]);

		});

		//红绿图 上一个
		$(this._redGreenPrev).click(function(){
			   var last = config.RedGreenRandomImg.pop();
			    config.RedGreenRandomImg.unshift(last);    
			   $(_redGreenImg).attr("src", "images/PRO/" + last);
		});

		
		$(_garound).dblclick(function(){
			 config.HiddenWidth  =  $(_garound).width() - 5;
			 $(_garound).animate({ "marginLeft":-($(_garound).width()-5)},function(){
			 	 _that.layout();
			 });
			 $(".upart").animate({"width":$(".upart").width()+config.HiddenWidth});
			  $(".dpart").animate({"width":$(".dpart").width()+config.HiddenWidth});
			  $(".visVaE").animate({"width":$(".visVaE").width()+config.HiddenWidth});
			  $(".gturn.pd").animate({"width":$(".gturn.pd").width()+config.HiddenWidth});

		});

		$(_garound).hover(function(){
			config.HiddenWidth = 0;
			_that.layout();
			$(_garound).animate({"marginLeft":"0px"},function(){
			});
		},function(){});


		$(_header).dblclick(function(){
			config.HiddenHeight =  $(_header).height() - 5;
			 $(_header).animate({ "marginTop":-($(_header).height()-5)},function(){ 
			 	 _that.layout();
			 });	
			 $(".dpart").animate({"height":$(".dpart").height()+config.HiddenHeight});
			 $(".garound").animate({"height":$(".garound").height()+config.HiddenHeight});
			 $(".visVaE").animate({"height":$(".visVaE").height()+config.HiddenHeight});
			  $(".gturn.pd").animate({"height":$(".gturn.pd").height()+config.HiddenHeight});
		});

		$(_header).hover(function(){
			config.HiddenHeight = 0;
			$(_header).animate({"marginTop":"0px"},function(){
				_that.layout();
			});

		},function(){});

		//分辨率按钮
		$(this._resary).click(function(){
			var xianWid=parseInt($(".lie").eq(1).position().left)-parseInt($(".lie").eq(0).position().left);
			 var xianHeight=parseInt($(".han").eq(1).position().top)-parseInt($(".han").eq(0).position().top);
			 $(_ResolvingPower).hide();
			 config.ELength = _that.EVisten().EPIXELS(parseFloat(4.0));
			 $(_that._thvimg).css("width",config.ELength);  _that.LvieWE(config.EboxLen,config.ELength);
			 $(_that._thyimg).css("width",config.ELength);  _that.LvieWE(config.EboxLen,config.ELength);
			 socket.emit('updata rp', { width: xianWid, height: xianHeight });  

		});
		$(_ResClose).click(function(){
			 $(_ResolvingPower).hide();
		})
		$(_operzhi).click(function(){
			 $(_ResolvingPower).show(); 
		});

		//视距设置
		$(_LineSightCl).click(function(){
			 $(this).parent().parent().hide();
		})
		$(_LineSight).click(function(){
			 $(".LineSight").show();
		});
  		
  		$(_delbtn).click(function(){  //设置：删除按钮
  			 $(_DelSure).show();
  		})

		$(_DimeChong).click(function(){
			 $(".Dimecon input").val("2.5");
			 config.Distance = 2.5;
			 config.ELength = _that.EVisten().EPIXELS(parseFloat(4.0));
			 $(_that._thvimg).css("width",config.ELength);  _that.LvieWE(config.EboxLen,config.ELength);
			 $(_that._thyimg).css("width",config.ELength);  _that.LvieWE(config.EboxLen,config.ELength);
         	  $(".Dimecon a").text((config.ECMth).toFixed(3));
         	  _that.EventState().c(0); _that.EventState().b(0); ng = 0; ny = 0;
		});
		$(_DelSureBtn).click(function(){
			$(_DelSure).hide();
		});
		$(_SDimeChong).click(function(){  //删除确定
			 var a=$(".Dimecon input.ScureInput").val();  //获取文本框的东西
			 $("td[data-name='"+a+"']").parent("tr").remove();  //通过文本框的内容获取元素
			 $(".DelSure").hide();
			 socket.emit('delete info',{ data : a }); //发送服务器文本框的内容
			 $(".Dimecon input.ScureInput").val("");   //使用完清空文本框s
			 alert("删除成功");
		});
		$(".dpart .ly").click(function(){  //保存服务器按钮
			alert("保存成功");
			var serText=$(".dpart .commun input").val();
			socket.emit('updata config',{ data : serText }); //发送服务器文本框的内容
		});
		$(".searchBtn").click(function(){  //信息查找
			var val=$(".searchbox input").val();//获取搜索框内容
			$("table tr").not("thead tr").remove();
			if(val==""){//如果文本框每值，默认查找全部
				socket.emit('show eyesInfo',{ state : "1" }); //发送打开配置文件
			}
			else{
				socket.emit('search info',{ data : val }); //发送服务器文本框的内容
			}
		
		})
	},

	SeachQuery : function(){
	         var tr = $(".testReport .Resbox .rg");
	         var inp = "";
	         var i = 0;
	         var trval = "";
	         var _that = this;
	         $(".searchbox input").bind("input", function() { 
				inp = $(this).val();
				for(i=0;i<tr.length;i++){
					trval = tr.eq(i);
					//console.log(trval)
					if((trval.text()).indexOf(inp)<0){
						trval.parent().hide();
					}else{
						trval.parent().show();
					}
				}
				}); 

	         $(".Dimecon input").bind("input",function(){
	         	  config.Distance = $(this).val();
	         	  $(_that._resary).click();
	         	  $(".Dimecon a").text((config.ECMth).toFixed(3));
	         	  _that.EventState().c(0); _that.EventState().b(0); ng = 0; ny = 0;
	         });
	         $(".ScureInput").bind("input",function(){  //确认删除框 删除按钮出现消失判断
	         	  if($(this).val() != ""){
	         	  	 $(".DelSure .DimeChong").show();
	         	  }
	         	  else{
	         	  	 $(".DelSure .DimeChong").hide();
	         	  }
	         });

	},

	//事件状态
	EventState : function(){
	   	 var _that = this,P="";
		 function a(O){ $(_that._thsm).parent().removeClass("active").eq(O).addClass("active"); _that.InizFun();  }   //	   _that.Navdiscolor().recove();		var Tup =$(".dpart .visVaE img");  //图片设置Tup.css("width",LengPX);    //导航的事件状态  参数是选中哪个 例如 O = 6  _that.EVisten().EPIXELS(txt); _that.EVisten().EPIXELS(txt); 
		 function b(O,U){ _that.ERandom(0,U);  var txt =$(_that._thvi).eq(O).text(); $(_that._thvi).removeClass("active").eq(O).addClass("active"); config.ELength = _that.EVisten().EPIXELS(parseFloat(txt));    $(_that._thvimg).css("width",config.ELength);  $(_that._thvimg).css("height",config.ELength); _that.LvieWE(config.EboxLen,config.ELength); }   // 视力表E    参数是选中哪个 例如 O = 6 
		 function c(O,U){ _that.ERandom(1,U); var txt =$(_that._thys).eq(O).text(); $(_that._thys).removeClass("active").eq(O).addClass("active"); config.ELength = _that.EVisten().EPIXELS(parseFloat(txt));    $(_that._thyimg).css("width",config.ELength);  $(_that._thyimg).css("height",config.ELength); _that.LvieWE(config.EboxLen,config.ELength);  }    // 夜视力表E  参数是选中哪个 例如 O = 6 
		 function d(O){ O == 14 ? $(_that._colorbtnNext).click():(O==15 ? $(_that._colorbtnPrev).click(): "" );  }    // 色盲图  14 下一个 15 上一个
		 function e(O){ O == 14 ? $(_that._redGreenNext).click():(O==15 ? $(_that._redGreenPrev).click(): "" );  }    // 红绿图  14 下一个 15 上一个
		 function f(){  }
		 return {
		 	a:a,
		 	b:b,
		 	c:c,
		 	d:d,
		 	e:e,
		 	f:f
		 }
	},

	//一开始视图的改变
	layout :function(){
		//30 下面的边距  outerHeight !
		config.WinWidth = $(document.body).width();
		config.WinHeight = $(document.body).height() + 30;
		// var ar = document.getElementById("afs");
		// 	console.log(ar.offsetHeight);	
		this.Lview();
	},

	//视力系统 视图操作
	Lview: function(){

		  //b b2 b3 b4 均是左右边框和内边框

		  var ucsection,w,h,b=30,b2=85,b3=62,b4=40;
		  config.MOKHeight == 1 ? ucsection = ".visualChat" : (config.MOKHeight == 2 ? (ucsection = ".nightVision"): config.MOKHeight == 6 ?(ucsection=".setUp"): ucsection="");
		 	       	  
		  var upart = $(ucsection+" .upart"), //右上边class
		 	 gturn = $(".gturn.pd"),             //右边class
		 	 dpart = $(".dpart"),             //右下边class
		 	 garound = $(".garound"),         //左边class
		 	 visVaE = $(".visVaE"),           //右下中间
		 	 header = $(".header");           //头部高度

		 w = config.WinWidth; h = config.WinHeight;
		 var gaw = garound.width() || 0;

		     upart.css("width",w-gaw-b2+config.HiddenWidth); 

		  var uph = upart.outerHeight(true),
		  	  gth = gturn.outerHeight(true),
		  	  dph = dpart.outerHeight(true),
		  	  gah = garound.outerHeight(true),
		  	  vih = visVaE.outerHeight(true),  //右下中间  
		  	  heh = header.outerHeight(true) || 0;
          
        

		  garound.css("height",h-heh-(b*2)-config.HiddenHeight); 
		  gturn.css("height",h-heh-(b*2)-b4-config.HiddenHeight);
		  gturn.css("width",w-gaw-b2+config.HiddenWidth); 
		 
		  dpart.css("width",w-gaw-b2+config.HiddenWidth);
		  visVaE.css("width",w-gaw-b2+config.HiddenWidth);
		  dpart.css("height",h-heh-(b*2)-uph-b3-config.HiddenHeight);
		  visVaE.css("height",h-heh-(b*2)-uph-b3-config.HiddenHeight);

		  config.EboxLen = w-gaw-b2;  //总宽

		  //E的边距
		  this.LvieWE(config.EboxLen,config.ELength);
	},


	LvieWE :function(TW,DW){
		//TW总宽度  DW E的宽度
		var Avg = (TW - DW * 3 ) / 7 ;
		$(".visualChat .visVaE img").css("margin","0 "+Avg);
		$(".nightVision .visVaE img").css("margin","0 "+Avg);
	},

	//画线 拖动
	xianDrap : function (width,height) {
	            //  var height = Math.abs(parseInt($(".han").eq(0).css("top")) - parseInt($(".han").eq(1).css("top"))); //红线内容高度
	            // var width = Math.abs(parseInt($(".lie").eq(0).css("left")) - parseInt($(".lie").eq(1).css("left"))); //红线内容宽度
	            var width=width || 360;
	            var height=height || 120;
	            $(".han").eq(1).css("top",height+80);
	            $(".lie").eq(1).css("left",width+100);
	 			config.ResolutionHigh = height;
				config.ResolutionWide = width;
	         

	            $(".t_tit span").eq(1).text(height+"px");   //打印
	            $(".t_tit span").eq(0).text(width+"px");
	            var move = false;//移动标记
	            var _x, _y;//鼠标离控件左上角的相对位置
	            var drap = null;
	            $(".drap").mousedown(function (e) {
	                e.preventDefault();
	                move = true;
	                _x = e.pageX - parseInt($(this).css("left"));	
	                _y = e.pageY - parseInt($(this).css("top"));
	                drap = $(this);
	            });
	            $(document).mousemove(function (e) {
	                e.preventDefault();
	                if (move) {
	                    var x = e.pageX - _x;
	                    var y = e.pageY - _y;
	                    var opa = drap.parent();
	                    if (drap.hasClass("han")) {  //行
	                        if (y < 22) { //范围限制
	                            y = 22;
	                        }
	                        else if (y > opa.height() - drap.height()-22) {
	                            y = opa.height() - drap.height()-22;
	                        }
	                        drap.css({ "top": y });
	                        var height = Math.abs(parseInt($(".han").eq(0).css("top")) - parseInt($(".han").eq(1).css("top")));
	                        $(".t_tit span").eq(1).text(height+"px");
	           				config.ResolutionHigh = height;

	                    }
	                    else { //列
	                        if (x < 22) {//范围限制
	                            x = 22;
	                        }
	                        else if (x > opa.width() - drap.width()-22) {
	                            x = opa.width() - drap.width()-22;
	                        }
	                        drap.css({ "left": x });
	                        var width = Math.abs(parseInt($(".lie").eq(0).css("left")) - parseInt($(".lie").eq(1).css("left")));
	                        $(".t_tit span").eq(0).text(width+"px");
	                     
	                        config.ResolutionWide = width;
	                    }
	                }
		            }).mouseup(function () {
		                move = false;
		            });
    }

}





    // var socket = io.connect('http://localhost:3000');
    //       socket.on('char message',function(data){
    //             console.log(data);   //别人给你发送的信息
    //       });

    //       $("#and").click(function(){
    //           socket.emit('char message', { my: 'one' });
    //       })