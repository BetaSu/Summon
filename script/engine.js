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
	return {ImagesMode:ImagesMode,SoundsMode:SoundsMode}
})()