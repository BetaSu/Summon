var engine=(function  () {
	
	// 图片加载模块
	var ImagesMode=function  () {
	// 图片加载
	this.imageLoadingProgressCallback;
	this.images={};
	this.imageUrls=[];
	this.imagesLoaded=0;
	this.imagesFailedToLoad=0;
	this.imagesIndex=0;
	}

	ImagesMode.prototype={
			// 图片加载
		imageReady:false,
		getImage: function  (imageUrl) {
			return this.images[imageUrl];
		},
		imageLoadedCallback: function  (e) {
			this.imagesLoaded++;
		},
		imageLoadErrorCallback: function (e) {
			this.imagesFailedToLoad++;
		},
		loadImage: function  (imageUrl) {
			var image=new Image(),
			me=this;
			image.src=imageUrl;
			image.addEventListener("load",function  (e) {
				me.imageLoadedCallback(e);
			});
			image.addEventListener("error",function  (e) {
				me.imageLoadErrorCallback(e);
			})
			this.images[imageUrl]=image;
		},
		loadImages: function  () {
			if (this.imagesIndex<this.imageUrls.length) {
				this.loadImage(this.imageUrls[this.imagesIndex]);
				this.imagesIndex++;
			}
			return Math.floor((this.imagesLoaded+this.imagesFailedToLoad)/this.imageUrls.length*100);
		},
		queueImage: function  (imageUrl) {
			this.imageUrls.push(imageUrl);
		}
	}

	// 音频模块 未完成
	var SoundsMode=function  () {
		// 音频加载
		this.trigger=true;
		this.soundLoadingProgressCallback;
		this.sounds={};
		this.soundUrls=[];
		this.soundsLoaded=0;
		this.soundsFailedToLoad=0;
		this.soundsIndex=0;
	}

	SoundsMode.prototype={
		// 图片加载
		soundsReady:false,
		getSound: function  (soundUrl) {
			return this.sounds[soundUrl];
		},
		pause:function  (name) {
			var url="sounds/"+name+".ogg",
			sound=this.getSound(url);
			if (sound && !sound.paused) {
				sound.pause();
			} else {
				sound.play();
			}
		},
		mute:function  () {
			for (var i in this.sounds) {
				var sound=this.sounds[i];
				if(sound.duration>10) {
					if (sound.paused) sound.play();
					else sound.pause();
				} else 	sound.currentTime=0;	
			}
			this.trigger=!this.trigger;
		},
		play:function (name,loop) {
			if (this.trigger) {
				var url="sounds/"+name+".ogg",
				sound=this.getSound(url);
				if (sound) {
					sound.loop=loop;
					if (!sound.ended) {
						sound.currentTime=0;
						sound.play();
					}	
					else sound.play();
				}
			}
		},
		soundType: function  (soundUrl) {
			
		},
		loadSound: function  (soundUrl) {
			var sound=new Audio(),
			me=this;
			sound.volume=0.3;
			if (sound.canPlayType('audio/ogg')) {
				sound.src=soundUrl+'.ogg';
			}	else {sound.src=soundUrl+'.mp3'}
			
			this.sounds[soundUrl]=sound;
		},
		queueSound: function  (soundUrl) {
			this.soundUrls.push(soundUrl);
		}
	}

	// 背景云朵相关
	var cloud={createCloud:createCloud}; 

	//产生云朵 
	function createCloud () {
		function makeCloud (attr) {
			$('#g-window').append("<i class='m-cloud'></i>");
			var $cloud=$('i.m-cloud:last');
			$cloud.css({'top':attr.pos+'%','left':'-40%','backgroundImage':"url(images/cloud"+attr.num+".png)"})
			.addClass("f-cloud"+attr.appr);
			fly($cloud,attr);
		}

		// 随机位置
		function ranPos () {
			var result=Math.floor(Math.random()*100);
			return result>15&&result<60?result:ranPos();
		}

		// 1-4的随机数
		function ran1234 () {
			var result=Math.random()*10;
			if (result<2.5) {
				return 1;
			} 
			if (result>=2.5&&result<5) {
				return 2;
			} 
			if (result>5 &&result<7.5) {
				return 3;
			}
			else {
				return 4;
			}
		}

		// 随机移动完所需时间
		function ranTime () {
			var result=Math.floor(Math.random()*36000);
			return result>26000?result:ranTime();
		}

		//云朵飘动
		function fly ($cloud,attr) {
			$cloud.animate({left:'140%'},attr.usedTime,function  () {
				$cloud.remove();
			})
		}

		var attr={};
		attr.usedTime=ranTime();
		attr.pos=ranPos();
		attr.appr=ran1234();
		attr.num=ran1234();
		return makeCloud(attr);
	}

	// logo
	var logo={appearLogo:appearLogo};

	function appearLogo () {
		$('#g-window').append("<i class='f-logo'></i>");
		var $logo=$('i[class=f-logo]')
		$logo.animate({top:'0'},500).animate({top:'-10%'},300)
		.animate({top:'0'},190);
	}

	//背景元素向下移动，场景变换
	function slideDown () {
		$('#g-window').css('background-position','50% 50%');
		var $logo=$('i[class=f-logo]');
		$logo.animate({top:'+=100%'},300,function  () {
			$logo.remove();
		});
	}

	//主游戏


	return {ImagesMode:ImagesMode,SoundsMode:SoundsMode,cloud:cloud,logo:logo,slideDown:slideDown}
})()