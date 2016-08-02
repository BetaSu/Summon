$(function  () {
	var ImagesMode=engine.ImagesMode;
	var images=new ImagesMode();

	//添加图片
	images.queueImage("images/bkg.jpg");
	images.queueImage("images/cloud1.png");
	images.queueImage("images/cloud2.png");
	images.queueImage("images/cloud3.png");
	images.queueImage("images/cloud4.png");

	var resourceLoad=setInterval(function  (e) {
		var percentage=images.loadImages(),
		loading=$("#f-loading");
		loading.html("加载中 "+percentage+"%");
		
		if (percentage==100) {
			clearInterval(resourceLoad);
			images.imageReady=true;
			var fail=images.imagesFailedToLoad;
			loading.html("点击继续").css({'animation':'flash 2s ease infinite,big 2s ease infinite','-webkit-animation':'flash 2s ease infinite,big 2s ease infinite','-moz-animation':'flash 2s ease infinite,big 2s ease infinite','-o-animation':'flash 2s ease infinite,big 2s ease infinite'})
		}
		if (images.imageReady ) {
			// 图片预加载成功后进行接下来的逻辑
			$('#g-window').click(function  () {
					$(this).css('background-position','50% 50%');
					loading.fadeOut();
				})
		}	
	},20);

	
})