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


	//ufo在背景中飞行，接受3个参数
	//parent：飞行元素所在父元素
	//which：指定飞行的元素
	//humoType:指定尾气的类型
	function ufo (parent,which,humoType) {
		w=parent.width(),
		h=parent.height();

		//新位置
		function newPos () {
			var nw=(1-Math.random())*w,
			nh=(1-Math.random())*h;
			return {left:nw+'px',top:nh+'px'}
		}
		//到新位置所用时间
		function newTime () {
			var time=Math.random()*6000;
			return time>1000?time:newTime();
		}

		//ufo的尾气
		function humo () {
			parent.append("<i class='f-humo'></i>");
			var $humo=$('i[class=f-humo]:last');
			if (humoType) $humo.addClass(humoType);
			$humo.css('left',which.css('left'));
			$humo.css('top',parseInt(which.css('top'))+40+'px');
			$humo.animate({opacity:0,width:0,height:0},1500,function  () {
				$(this).remove();
			})
			window.setTimeout(function  () {
				humo();
			},200)
		}

		// 移动
		function move () {
			var pos=newPos(),
			time=newTime();
			which.animate({left:pos.left,top:pos.top},time,function  () {
				move();
			});
		}
		humo();
		move();
	}

	//主游戏
	// 用于创建新游戏，接收一个参数$box
		// $box：指定游戏内容所在父元素
		function creGame ($box) {

			// a-b间的随机数，接收2个参数
			//a代表起始参数
			//b代表结束参数
			function ranatb (a,b) {
				var result=Math.floor(a+Math.random()*(b-a+1));
				return result;
			}

			var w=parseFloat($box.css('width'));

			//根据窗口宽度调整显示的方格数。
			function howManyBox () {
				if (w<180)	return 6;
				else return 7;
			}

			$box.css('height',w+'px');
			var itemW=w/howManyBox(),			//方格宽度
			itemIndex=0,						//方格索引
			itemTop=0,							//距父级顶部距离
			numArr=[],							//选中的数字
			targetNum;							//目标数字

			// 动态生成矩阵
			for (var j=0;j<w;j+=itemW) {
				for (var i=0;i<w;i+=itemW) {
					var num=ranatb(1,9);
					$box.append("<div class='f-item'></div>");
					var $item=$('div[class=f-item]:last');
					$item.css({left:i+'px',top:itemTop+'px',width:itemW+'px',height:itemW+'px'}).html(num).data({'num':num,'index':itemIndex++});
				}
				itemTop+=itemW;
			}

			/** 游戏动态生成表格后，调用CreTargetNum函数，函数根据剩余方格数量做判断
			* 当剩余方格多于3个时，随机选取3个方格将他们所含数值相加产生目标数字
			* 当剩余方格为1-2个时，将剩余方格所含数值相加产生目标数字
			* 当没有剩余方格时，触发游戏胜利条件。
			**/ 

			// 产生一个目标数字
			function CreTargetNum () {			
				var $items=$('div.f-item'),
				totalIndex=$items.last().index(),
				$items=$('div.f-item'),
				result=0;
	
				//产生一个目标索引,接收一个参数arr
				//arr：该数组中包含的数不会作为目标索引
				function targetIndex (arr) {
					var result=ranatb(0,totalIndex);
					if ($.type(arr)=='array' &&arr.length!=0) {
						var trigger=false;
						$.each(arr,function  (index,item) {
							if (item==result) {
								trigger=!trigger;
							}	
						})
						if (trigger) return targetIndex(arr);
					} 
					return result;
				}
				// 当剩余方格大于等于3个时
				if (totalIndex>=2) {
					var result1=targetIndex(),
					result2=targetIndex([result1]),
					result3=targetIndex([result1,result2]),
					num1=$items.eq(result1).data('num'),
					num2=$items.eq(result2).data('num'),
					num3=$items.eq(result3).data('num');
					result=num1+num2+num3;
					$('h3.targetNum').html(result);
					targetNum=result;
					return result;
				}
				// 当剩余1-2个方格时
				if (totalIndex>=0&&totalIndex<2) {
					$('div.f-item').each(function  (index,item) {
						result+=$(item).data('num');
						$('h3.targetNum').html(result);
						targetNum=result;
						return result;
					})
				}
				// 所有方格清除完时
				 else {
					console.log(totalIndex>=2);
					$('h3.targetNum').html('congratulation!');
				}	
		
			}

			//判断累加数值是否与目标数值相符以及后续操作
			function judge () {
				var totalNum=0;

				//匹配成功后消除方块
				function success () {
					$('div.f-click').remove();
				}

				// 累加值总和
				$.each(numArr,function  (index,item) {
					totalNum+=item;
				})

				//结果处理
				if (totalNum>targetNum) {
					numArr=[];
					$('div.f-item').removeClass('f-click');
				}
				if (totalNum==targetNum) {
					success();
					numArr=[];
					CreTargetNum();	
				}
			}

			//点击事件
			$('div.f-item').click(function  () {
				if (!$(this).hasClass('f-click')) {
					$(this).addClass('f-click');
					var num=$(this).data('num');
					numArr.push(num);
					judge();
				}	
			})

			// 生成第一个目标数值
			CreTargetNum()
		}

	return {ImagesMode:ImagesMode,SoundsMode:SoundsMode,cloud:cloud,logo:logo,slideDown:slideDown,ufo:ufo,creGame:creGame}
})()