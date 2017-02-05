	$scope.on = false;
	$scope.N = 1;
	$scope.answer = [];
	$scope.timerFlag = false;
	
	$scope.chkValue = {
		onOff:false,
		strict:false,
	};
	
	$scope.keyDown = function(val){
		playGoodTone(val-1);
	}
	$scope.keyClick = function(val){
		
		stopGoodTones();
		playGoodTone(val-1);
		//cancel the keyInterval
		//self.clearInterval(keyInterval);
		if(val==$scope.answer[0]){
			$scope.answer.splice(0,1);
			if($scope.answer.length==0){
				refreshScreen(true);
			}else{ 
				}
		}
		else{
			refreshScreen(false);
		}
	}
	

	$scope.chkClick = function(val){
		console.log(val);
		if(val == 0){					//on/off button clicked			
			if($scope.chkValue.onOff){
				init();
			}else{
				off();
			}
		}
	}
	
	$scope.start = function (){			//event for click start
				stopGoodTones();
				stopErrTone();
				var screenObj = document.getElementById('keys');
				screenObj.setAttribute('class','off');
				if($scope.chkValue.strict){
					$scope.N = 1;					
				}
				$scope.answer = [];
				btnClassOff();	
				if($scope.timerFlag){
					clearInterval($scope.timer1);	
					}				
				getSequence();		
	}
	
	function init(){
		$scope.on = true;
		$scope.N = 1;
		var screenObj = document.getElementById('count');
		screenObj.innerHTML = '&#8212';
		$scope.answer = [];
		var screenObj = document.getElementById('keysInPanel');
		screenObj.setAttribute('class','on');	
		loadSound();			
	}
	


	function playGoodTone(num){
		$scope.gainNodes[num].gain
	    .setValueAtTime(0.5, $scope.audioCtx.currentTime);
	  /*$scope.gainNodes[num].gain
	  .setValueAtTime(0, $scope.audioCtx.currentTime + 0.5	);	*/
	  
	};
	
	function stopGoodTones(){
	  $scope.gainNodes.forEach(function(g){
	    g.gain.linearRampToValueAtTime(0, $scope.audioCtx.currentTime);
	  });
	};
  
  function playErrTone(){
  $scope.errNode.gain.linearRampToValueAtTime(0.5, $scope.audioCtx.currentTime);
  };

  function stopErrTone(){
    $scope.errNode.gain.linearRampToValueAtTime(0, $scope.audioCtx.currentTime);
  };
  	    
	function off(){
		stopGoodTones();
		stopErrTone();
		$scope.N = 1;
		var screenObj = document.getElementById('count');
		screenObj.innerHTML = '';
		btnClassOff();
		$scope.answer = [];
		$scope.chkValue.strict = false;
		$scope.on = false;
		if($scope.timerFlag){
		clearInterval($scope.timer1);	
		}	
		var screenObj = document.getElementById('keys');
		screenObj.setAttribute('class','off');
		var screenObj = document.getElementById('keysInPanel');
		screenObj.setAttribute('class','off');
		
	}

	function btnClassOff(){
		for(var i = 1;i<5;i++){					
			document.getElementById('key'+i).setAttribute('class','btn'+i);					
			document.getElementById('key'+i).style.transition = 'background 0s';
		}
	}
	
	function refreshScreen(val){
		document.getElementById('keys').setAttribute('class','off');
		
		if(val){//correct keys input over
						$scope.N++;
						
						//hint for showing	
						var i = 0;
						var screenObj = document.getElementById('count');
						screenObj.innerHTML = '&#10004';
						var screenTimer = setInterval(function(){
							screenObj.style.display = i++%2?'none':'block';
								if(i>4){
									screenObj.innerHTML = $scope.N;
									getSequence();
									clearInterval(screenTimer);
								}
							},200);	
						
		}else{	//wrong key input		
					playErrTone();
					if($scope.chkValue.strict){
							$scope.N = 1;
						}	
						//hint for showing	
						var i = 0;
						var screenObj = document.getElementById('count');
						screenObj.innerHTML = '&#10006';
						var screenTimer = setInterval(function(){
							console.log('screenTimer '+i);
							screenObj.style.display = i++%2?'none':'block';
								if(i>4){
									screenObj.innerHTML = $scope.N;
									getSequence();
									stopErrTone();
									clearInterval(screenTimer);
								}
							},150);	
		}
	}
	
	function getSequence(){
		//disable the keys
		//document.getElementById('keys').setAttribute('class','off');
		
		//hint for showing	
		var screenObj = document.getElementById('count');
		screenObj.innerHTML = $scope.N;
		var i = 0;
		var screenTimer = setInterval(function(){
			console.log('screenTimer '+i);
			screenObj.style.display = i++%2?'none':'block';
				if(i>4){
					showAnswer();
					clearInterval(screenTimer);
				}
			},200);	
	}
	
	function showAnswer(){
				var keys = [1,2,3,4];
				$scope.answer = [];
				for(var i=0;i<$scope.N;i++){
					var n = Math.round(Math.random()*3);
					$scope.answer.push(keys[n]);			
				}
				
				//show the keys
				
				var i = 0;
				playGoodTone($scope.answer[i]-1);
				document.getElementById('key'+$scope.answer[i]).setAttribute('class','flash'+$scope.answer[i]);
				$scope.timerFlag = true;
				
				$scope.timer1 = setInterval(function(){
						
						console.log('Timer '+i+' done');
						i++;
						if(i<$scope.N*2){
							if(i%2 == 0){
								playGoodTone($scope.answer[i/2]-1);
								document.getElementById('key'+$scope.answer[i/2]).setAttribute('class','flash'+$scope.answer[i/2]);
								
							}else{
								stopGoodTones();
								document.getElementById('key'+$scope.answer[(i-1)/2]).style.transition = 'background 0.4s';
								document.getElementById('key'+$scope.answer[(i-1)/2]).setAttribute('class','btn'+$scope.answer[(i-1)/2]);					
							}	
						}else{
							document.getElementById('keys').setAttribute('class','on');
							
							document.getElementById('key1').style.transition = 'background 0s';
							document.getElementById('key2').style.transition = 'background 0s';
							document.getElementById('key3').style.transition = 'background 0s';
							document.getElementById('key4').style.transition = 'background 0s';
							
							/*var keyInterval = self.setInterval(function(){
								//warn();
								console.log('keyInterval over!');
							},3000);*/
							$scope.timerFlag = false;
							clearInterval($scope.timer1);
						}
					},500);			
		}

});