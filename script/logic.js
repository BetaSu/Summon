 $(function  () {
	var ImagesMode=engine.ImagesMode;
	var images=new ImagesMode();
	var ufoInterval;


	//添加图片
	images.queueImage("images/bkg.jpg");
	images.queueImage("images/cloud1.png");
	images.queueImage("images/cloud2.png");
	images.queueImage("images/cloud3.png");
	images.queueImage("images/cloud4.png");
	images.queueImage("images/logo.png");
	images.queueImage("images/ufo.png");
	images.queueImage("images/humo.png");
	images.queueImage("images/numbers.png");

	var resourceLoad=setInterval(function  (e) {
		var percentage=images.loadImages(),
		loading=$("#f-loading");
		loading.html("加载中 "+percentage+"%");
		
		if (percentage==100) {
			clearInterval(resourceLoad);
			images.imageReady=true;
			engine.cloud.createCloud();
			engine.logo.appearLogo();
			$('#g-window').append("<i class='f-ufo1'></i><i class='f-ufo2'></i>");
			var $ufo1=$('i.f-ufo1');
			engine.ufo($('#g-window'),$ufo1);
			var $ufo2=$('i.f-ufo2');
			engine.ufo($('#g-window'),$ufo2,'f-humo2');
			loading.html("点我继续").css({'animation':'flash 2s ease infinite,big 2s ease infinite','-webkit-animation':'flash 2s ease infinite,big 2s ease infinite','-moz-animation':'flash 2s ease infinite,big 2s ease infinite','-o-animation':'flash 2s ease infinite,big 2s ease infinite'})
			ufoInterval=setInterval(function  () {
				engine.cloud.createCloud();
			},3000);
		}
		if (images.imageReady ) {
			// 图片预加载成功后进行接下来的逻辑处理
			$('#f-loading').click(function  () {
					engine.slideDown();
					loading.fadeOut(function  () {
						engine.removeUfo();
						$('i').remove();
						ufoInterval=setInterval(function  () {
							engine.cloud.createCloud();
						},3000);
					});
					engine.creGame($('#g-game'));
					$('#g-game').show();
					$('#g-attri').show();
				})
		}	
	},20);

	
})