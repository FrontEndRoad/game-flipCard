/* -------------------------------------------------------------
	@ 名称：JS翻牌小游戏
	@ 功能：游戏主体
	@ 版本：v1.0
	@ 作者：繁花落尽|cici
	@ 时间：2016/01/07
*/
var h5 = new Cici('flipcard/');
	h5.init();
	
$('.btn').on('tap', function(){
	var t = $(this).attr('data-type');
	var o1 = $('.index'), o2 = '';
	if(t&&t!=undefined){
		if(t=='start'){
			o2 = $('.game');
			setTimeout(function(){
				game.init();
			}, 1100);
		}else if(t=='rule'){
			o2 = $('.rule');
		}else if(t=='home'){
			o1 = $('.rule');
			o2 = $('.index');
		}else if(t=='again'){
			o1 = $('.result');
			o2 = $('.index');
			$('.res').fadeOut(300);
		}
		h5.slide(o1, o2, 'moveToTop', 'moveFromBottom');
	}else{
		var con = confirm('分享到朋友圈！');
        if(con){
            location.reload();
        }
	}
})