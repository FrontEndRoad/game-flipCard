/* -------------------------------------------------------------
	@ 名称：JS翻牌小游戏
	@ 功能：游戏主体
	@ 版本：v1.0
	@ 作者：繁花落尽|cici
	@ 时间：2016/01/07
*/
//游戏主体
var game = (function($){
	var total = 15;
	var cardnum = 6;
    var gametime = [30, 20];                          // 每关的游戏时间
    var turntime = 3;                                 // 观看牌时间
    var level = 0;                                    // 当前关卡-->已闯
    var carddata = [];                                // 记录牌的数据
    var leveldata = [];                               // 当前关卡牌数据
    var is_lock = 0;                                  // 是否锁定
    var is_over = 0;                                  // 游戏结束
    var first = -1;                                   // 第一次翻开的卡
    var matchnum = 0;                                 // 配对成功次数
    var curtime = '';                                 //临时存储
    var et = null;

    init = function(){
        start();
    }

    // 开始游戏
    start = function(){
        reset();
        create(cardnum);
        show();

        var curtime = turntime;
        lt = setInterval(function(){
            if(curtime==0){
                clearInterval(lt);
                turnall();
                set_event();
                process();
                return ;
            }

            if(curtime==turntime){
                turnall();
            }

            curtime--;
        }, 1000)
    }


    // 随机抽取N张牌
    create = function(n){
        carddata = [];
        leveldata = [];
        
        // 创建所有牌
        for(var i=1; i<=total; i++){
            carddata.push(i);
        }
    
        // 抽取牌
        for(var i=0; i<n; i++){
            var curcard = carddata.splice(Math.random()*carddata.length, 1).pop();
            leveldata.push({'cardno':curcard,'turn':0}, {'cardno':curcard,'turn':0});
        }

        // 生成随机顺序游戏牌
        leveldata = shuffle(leveldata);
    }


    // 生成牌
    show = function(){
        var cardhtml = '';
        for(var i=0; i<leveldata.length; i++){
            cardhtml += '<div class="item flip viewport-flip" id="item' + i + '">';
            cardhtml += '<div class="list out"><img src="images/t' + leveldata[i]['cardno'] + '.jpg"></div>';
            cardhtml += '<div class="list flipInHori"><img src="images/blk.jpg"></div>';
            cardhtml += '</div>';

        }
        $('.gvIn').html(cardhtml);
    }


    // 全部翻转
    turnall = function(){
        for(var i=0; i<leveldata.length; i++){
            turn_animate(i);
        }
    }


    // 翻转动画
    turn_animate = function(key){
        var obj = $('#item'+key).find('.list');
        var cardfont, cardback;
        
        if(obj.eq(0).hasClass('out')){
            cardfont = obj.eq(1);
            cardback = obj.eq(0);
        }else{
            cardfont = obj.eq(0);
            cardback = obj.eq(1);
        }

       cardback.addClass('flipInHori in').removeClass('flipOutHori out');
		setTimeout(function(){
			cardfont.addClass('flipOutHori out').removeClass('flipInHori in');
		}, 200);
    }


    // 设置点击事件
    set_event = function(){
        $('.item').live('tap', function(){
        	var clas = $(this).hasClass('viewport-flip');
        	var id = $(this).attr('id');
        	if(clas){
        		turn(id);
        	}
        })
    }


    // 计时开始
    process = function(){
        is_lock = 0;
        var curtime = gametime[level];

        $('.time').html(curtime);

        et = setInterval(function(){
            if(matchnum==cardnum){
                clearInterval(et);
                et = null;
                return ;
            }
            curtime--;
            $('.time').html(curtime);
            
            //game over
            if(curtime<=0){
                clearInterval(et);
                et = null;
                is_over = 1;
                result(0);      //游戏失败
            }

        }, 1000);
    }


    // 翻牌
    turn = function(id){
        if(is_lock==1){
            return ;
        }

        var key = parseInt(id.replace('item',''));
    
        if(leveldata[key]['turn']==0){ // 未翻开
            if(first==-1){  // 第一次翻
                turn_animate(key);
                first = key;
                leveldata[key]['turn'] = 1;
            }else{  // 第二次翻
                turn_animate(key);
                leveldata[key]['turn'] = 1;
                check_turn(key);
            }
        }
    }


    // 检查是否翻牌成功
    check_turn = function(key){
        is_lock = 1;

        if(leveldata[first]['cardno']==leveldata[key]['cardno']){ // 配对成功
            matchnum ++;            

            if(matchnum==cardnum){
                setTimeout(function(){
                    levelup();
                }, 155);
            }

            first = -1;
            is_lock = 0;

        }else{ // 配对失败,将翻开的牌翻转

            setTimeout(function(){
                turn_animate(first);
                leveldata[first]['turn'] = 0;
                turn_animate(key);
                leveldata[key]['turn'] = 0;

                first = -1;
                
                if(is_over==0){
                    is_lock = 0;
                }

            }, 300);
        }
    }


    // 过关
    levelup = function(){
       if(level<gametime.length-1){
            level ++;
            $('.tsWrd').text(level);
            start();
        }else{
            clearInterval(lt);
            clearInterval(et);
            clear();
            result(1);  //可抽奖
        }
    }


    // 全部通关
    clear = function(){
        //level = 1;
        is_lock = 1;
        is_over = 0;
        first = -1;
        matchnum = 0;
        $('.gvIn').html('');
    }



    // 重置参数
    reset = function(){
        $('.time').text(gametime[level]);

        $('.gvIn').html('');

        clearInterval(et);
        et = null;

        is_lock = 1;
        is_over = 0;
        first = -1;
        matchnum = 0;
    }


    result = function(type){
		h5.slide($('.game'), $('.result'), 'moveToTop', 'moveFromBottom');
        if(type==0){
            $('.err').show();
		}else{
            $('.suc').show();
		}
    }	

    shuffle = function(arr){
    	var temp = [];
    	for(var i=0,len = arr.length; i<len; i++){
    		temp.push(arr.splice(Math.random()*arr.length, 1).pop())
    	}
    	return temp;
    }

    return this;
})(Zepto);
