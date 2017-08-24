router = function(){
      //路由完成后的函数 页面到达

      var sb = function () {  config.MOKHeight = 1;  },
          ys = function () {  config.MOKHeight = 2;  },
          sm = function()  {  config.MOKHeight = 3;  },
          hl = function()  {  config.MOKHeight = 4;  },
          jc = function()  {  config.MOKHeight = 5;  },
          sz = function()  {  config.MOKHeight = 6;  };

      //路由的主操作
      var allroutes = function() {
            var route = window.location.hash.slice(2),
                sections = $('.section'),
                section;
            if ((section = sections.filter('[data-route=' + route + ']')).length) {
              sections.hide(0);
              section.show(0);
            }
            system.layout();
            
      };

      var routes = {
        '/sb': sb,
        '/ys': ys,
        '/sm': sm,
        '/hl':hl,
        '/jc':jc,
        '/sz':sz
      };

      var router = Router(routes);

      router.configure({
        on: allroutes
      });
      router.init();


}




      


      
