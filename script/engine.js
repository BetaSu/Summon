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

	// 音频模块
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
		soundLoadedCallback: function  (e) {
			this.soundsLoaded++;
		},
		soundLoadErrorCallback: function (e) {
			this.soundsFailedToLoad++;
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
		loadSound: function  (soundUrl) {
			var sound=new Audio(),
			me=this;
			sound.volume=0.3;
			sound.src=soundUrl;
			sound.addEventListener("canplay",function  (e) {
				me.soundLoadedCallback(e);
			});
			sound.addEventListener("error",function  (e) {
				me.soundLoadErrorCallback(e);
			})
			this.sounds[soundUrl]=sound;
		},
		loadSounds: function  () {
			if (this.soundsIndex<this.soundUrls.length) {
				this.loadSound(this.soundUrls[this.soundsIndex]);
				this.soundsIndex++;
			}
			return Math.floor((this.soundsLoaded+this.soundsFailedToLoad)/this.soundUrls.length*100);
		},
		queueSound: function  (soundUrl) {
			this.soundUrls.push(soundUrl);
		}
	}

	// 背景云朵相关
	var cloud={createCloud:createCloud,
		clearCloud:function  () {
			$('i').filter('.m-cloud').remove();
		}
	}; 

	//产生云朵 
	function createCloud () {
		function makeCloud (attr) {
			$('#g-window').append("<i class='m-cloud'></i>");
			var cloud=$('i.m-cloud:last');
			cloud.css({'top':attr.pos+'%','left':'-40%','width':attr.size+'%','height':attr.size+'%','zIndex':attr.z,'opacity':attr.opa});
			return cloud;
		}

		// 随机位置
		function ranPos () {
			var result=Math.floor(Math.random()*100);
			return result>15?result:ranPos();
		}

		// 随机大小、透明度、云朵类型
		function ranSize () {
			var box={1:{size:20,opa:0.3,z:1,type:1},2:{size:30,opa:0.5,z:2,type:2},3:{size:30,opa:0.7,z:3,type:3},4:{size:40,opa:1,z:4,type:4}};
			var result=Math.random()*10;
			if (result<2.5) {
				return box[1];
			} 
			if (result>=2.5&&result<5) {
				return box[2];
			} 
			if (result>5 &&result<7.5) {
				return box[3];
			}
			else {
				return box[4];
			}
		}

		// 随机速度
		function ranSpeed () {
			return Math.ceil(Math.random()*100);
		}

		var attr={};
		var sizeOpa=ranSize();
		attr.speed=ranSpeed();
		attr.pos=ranPos();
		attr.size=sizeOpa.size;
		attr.opa=sizeOpa.opa;
		attr.z=sizeOpa.z;
		attr.type=sizeOpa.type;
		return makeCloud(attr);
	}


	return {ImagesMode:ImagesMode,SoundsMode:SoundsMode,cloud:cloud}
})()