$(document).ready(function(){
	
	var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

  if(!AudioContext) {

    // Sorry, but the game won't work for you
    alert('Sorry, but the Web Audio API is not supported by your browser.'
    + ' Please, consider downloading the latest version of '
    + 'Google Chrome or Mozilla Firefox');

  } else {

    var audioCtx = new AudioContext();

    var frequencies = [220,261.63,329.63,422];

    var errOsc = audioCtx.createOscillator();
    errOsc.type = 'triangle';
    errOsc.frequency.value = 110;
    errOsc.start(0.0); //delay optional parameter is mandatory on Safari
    var errNode = audioCtx.createGain();
    errOsc.connect(errNode);
    errNode.gain.value = 0;
    errNode.connect(audioCtx.destination);

    var ramp = 0.05;
    var vol = 0.5;

    // create Oscillators
    var oscillators = frequencies.map(function(frq){
      var osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frq;
      osc.start(0.0); //delay optional parameter is mandatory on Safari
      return osc;
    });

    gainNodes = oscillators.map(function(osc){
      var g = audioCtx.createGain();
      osc.connect(g);
      g.connect(audioCtx.destination);
      g.gain.value = 0;
      return g;
    });
    
	  function playGoodTone(num){
			gainNodes[num].gain
		    .setValueAtTime(0.5, audioCtx.currentTime);
		  /*$scope.gainNodes[num].gain
		  .setValueAtTime(0, $scope.audioCtx.currentTime + 0.5	);	*/
		  
		};
		
		function stopGoodTones(){
		  gainNodes.forEach(function(g){
		    g.gain.linearRampToValueAtTime(0, audioCtx.currentTime);
		  });
		};
	  
    function playErrTone(){
      errNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + ramp);
    };

    function stopErrTone(){
      errNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ramp);
    };
    
		gameData = {};
		gameData.on = false;
		gameData.strict = false;
		gameData.N = 1;
		gameData.answer = [];
		
		$('.key').mousedown(function(){
			var num = $(this).attr('value');
			playGoodTone(num);
		});

		
		$('.key').mouseup(function(){
			stopGoodTones();
			var num = $(this).attr('value');
			if(num == gameData.answer[0]){
				gameData.answer.splice(0,1);
				if(gameData.answer.length==0){
					//refreshScreen(true);
					//next round
					$('#keys').removeClass('on').addClass('off');		
					gameData.N++;
					showMessage('&#10004',2);
					gameData.waitHndl = setTimeout(showSequence,1000);					
				}else{ 
					}
			}else{
				$('#keys').removeClass('on').addClass('off');		
				//refreshScreen(false);
				init();
				playErrTone();
				gameData.errToneTimer = setTimeout(function(){
					stopErrTone();
				},800);
				showMessage('&#10006',2);
				gameData.waitHndl = setTimeout(showSequence,1000);		
			}
		});
		
		function clearTimers(){
			clearInterval(gameData.meHndliv);
			clearInterval(gameData.meHndlto);
			clearInterval(gameData.waitHndl);
			clearInterval(gameData.seTimeriv);
			clearInterval(gameData.seTimerto);
		}
		
		function showMessage(message,num){//num必须>1
			$('#count').html('');
				gameData.meHndlto = setTimeout(function(){
					$('#count').html(message);
				},250);	
				var i = 1;		
			gameData.meHndliv = setInterval(function(){
				i++;
				$('#count').html('');
				gameData.meHndlto = setTimeout(function(){
					$('#count').html(message);
				},250);
				if(i == num){
					clearInterval(gameData.meHndliv);
				}
			},500);
		}
		
		function btnClassOff(){
				for(var j = 0;j<4;j++){					
					$('#key'+j).removeClass('flash'+j).addClass('btn'+j);
				}
		}
				
		function init(){				
				//gameData.strict = ($('#strict').attr('checked') == 'checked');
				//console.log($('#strict').attr('checked'));
				if(gameData.strict){
					gameData.N = 1;
				}
				gameData.answer = [];		
				$('#keys').removeClass('on').addClass('off');		
				btnClassOff();
				stopGoodTones();
				stopErrTone();
				clearTimers();
		}
		
		function showSequence(){
			$('#count').html(gameData.N);
				var keys = [0,1,2,3];
				gameData.answer = [];
				for(var i=0;i<gameData.N;i++){
					var n = Math.round(Math.random()*3);
					gameData.answer.push(keys[n]);			
				}			
				var j = 0;
				gameData.seTimeriv = setInterval(function(){
					//key flash and sound
					playGoodTone(gameData.answer[j]);
					$('#key'+gameData.answer[j]).removeClass('btn'+gameData.answer[j]).addClass('flash'+gameData.answer[j]);
					gameData.seTimerto = setTimeout(function(){
							stopGoodTones();
							$('#key'+gameData.answer[j]).removeClass('flash'+gameData.answer[j]).addClass('btn'+gameData.answer[j]);
							j++;	
							if(j == gameData.N){
								clearInterval(gameData.seTimeriv);
								$('#keys').removeClass('off').addClass('on');		
							}			
					},490);					
				},1000);
		}
		
		$('#strict').click(function(){
			gameData.strict = !gameData.strict;
			if(gameData.strict){
				$('#strict').removeClass('gray').addClass('yellow');
			}else{
				$('#strict').removeClass('yellow').addClass('gray');
			}
		});				
		
		$('#start').click(function(){
			init();
			showMessage(gameData.N,2);
			gameData.waitHndl = setTimeout(showSequence,1000);//1秒钟后，showMessage结束，开始显示当前序列
		});
		
		$('#sw').click(function(){
			gameData.on = !gameData.on;
			if(gameData.on){
				$('#pw-sw').addClass('turnup');
				$('#keysInPanel').removeClass('off').addClass('on');//start and strict clickable
				$('#keysInPanel label').removeClass('off').addClass('on');
				$('p#count').html('&#8212');

			}else{
				stopGoodTones();
				stopErrTone();
				clearTimers();
				btnClassOff();			
				$('#pw-sw').removeClass('turnup');
				$('#keysInPanel').removeClass('on').addClass('off');//start and strict clickable
				$('#keysInPanel label').removeClass('on').addClass('off');
				$('#keys').removeClass('on').addClass('off');		
				$('p#count').html('');	
				gameData.N = 1;
				gameData.answer = [];		
				$('#strict').removeClass('yellow').addClass('gray');
				gameData.strict = false;			
			}
		});
	}
});//ready ends
