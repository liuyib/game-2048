window.onload = function () {
	var aLiOneDimension = document.getElementById('omiddle-ul').getElementsByTagName('li');

	for (var i = 0; i < aLiOneDimension.length; i++) {
		aLiOneDimension[i].style.left = aLiOneDimension[i].offsetLeft + 'px';
		aLiOneDimension[i].style.top = aLiOneDimension[i].offsetTop + 'px';
	}
	for (var i = 0; i < aLiOneDimension.length; i++) {
		aLiOneDimension[i].style.position = 'absolute';
		aLiOneDimension[i].style.margin = '0';
	}

	//用于储存li对象的一维数组转换成二维数组
	var n = 0;
	var aLiTwoDimension = new Array();

	for (var i = 0; i < 4; i++) {
		aLiTwoDimension[i] = new Array(j);

		for (var j = 0; j < 4; j++) {
			aLiTwoDimension[i][j] = aLiOneDimension[n];
			n++;
		}
	}

	//生成从min到max的随机数，公式：Math.floor(Math.random()*(max-min+1)+min);
	//min是期望最小值，max是期望最大值

	//生成随机数
	var iNum1X = parseInt(Math.floor(Math.random() * 4));
	var iNum1Y = parseInt(Math.floor(Math.random() * 4));
	var iNum2X = parseInt(Math.floor(Math.random() * 4));
	var iNum2Y = parseInt(Math.floor(Math.random() * 4));

	//防止初始生成的数在同一个位置
	if ((iNum1X == iNum2X) && (iNum1Y == iNum2Y)) {
		window.location.reload();
	}
	else {
		aLiTwoDimension[iNum1X][iNum1Y].style.background = '#dac6ff';
		aLiTwoDimension[iNum1X][iNum1Y].style.opacity = 1;
		aLiTwoDimension[iNum1X][iNum1Y].style.filter = 'alpha(opacity = 100)';

		aLiTwoDimension[iNum2X][iNum2Y].style.background = '#dac6ff';
		aLiTwoDimension[iNum2X][iNum2Y].style.opacity = 1;
		aLiTwoDimension[iNum2X][iNum2Y].style.filter = 'alpha(opacity = 100)';
	}

	//用于储存数字的二维数组初始化
	var aNumTwoDimension = [[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]];

	//储存移动之前的数组，用于撤回
	var aReall = [[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]];

	//两个随机位置初始化
	aNumTwoDimension[iNum1X][iNum1Y] = 2;
	aNumTwoDimension[iNum2X][iNum2Y] = 2;

	aReall[iNum1X][iNum1Y] = 2;
	aReall[iNum2X][iNum2Y] = 2;

	//让两个随机位置显示
	var n = 0;
	for (var i = 0; i < 4; i++) {
		aLiTwoDimension[i] = new Array(j);

		for (var j = 0; j < 4; j++) {
			aLiTwoDimension[i][j] = aLiOneDimension[n];

			if ((i == iNum1X) && (j == iNum1Y)) {
				aLiTwoDimension[i][j].innerText = 2;
			}

			if ((i == iNum2X) && (j == iNum2Y)) {
				aLiTwoDimension[i][j].innerText = 2;
			}
			n++;
		}
	}

	//当前分数初始化
	var oCurrentScore = document.getElementById('currentscore');
	var iCurrentScore = 0;
	oCurrentScore.innerText = iCurrentScore;

	//最高分数初始化
	var oMaxScore = document.getElementById('maxscore');
	var iMaxScore = 0;

	//显示本地储存的最高分
	if (localStorage.getItem('bestScore') > 0) {
		oMaxScore.innerText = localStorage.getItem('bestScore');
	}
	else oMaxScore.innerText = 0;

	//移动次数初始化
	var oCurrentStep = document.getElementById('currentstep');
	var iStep = 0;
	oCurrentStep.innerText = iStep;

	//让结束框自适应屏幕大小，自动居中
	var oGameover = document.getElementById('gameover');
	oGameover.style.left = parseInt((document.documentElement.clientWidth - oGameover.offsetWidth) / 2) + 'px';

	//调整2/4频率选择框的位置
	var oDiy = document.getElementById('diy');
	oDiy.style.left = parseInt(((document.documentElement.clientWidth - oGameover.offsetWidth) / 7) * 5) + 'px';
	oDiy.style.top = parseInt(((document.documentElement.clientHeight - oGameover.offsetHeight) / 7) * 5) + 'px';

	var oMenu = document.getElementById('omenu');
	var oRange = document.getElementById('orange');
	var oNumber = document.getElementById('onumber');

	getStyle(oDiy, 'width');
	getStyle(oDiy, 'height');

	var turn = true;

	//2/4频率调整框出现动画
	oMenu.onclick = function () {
		if (turn == true) {
			chainMove(oDiy, 'width', 220, function () {
				chainMove(oDiy, 'height', 160);
			});

			turn = false;
		}
		else {
			oDiy.style.width = 0;
			oDiy.style.height = 0;

			turn = true;
		}
	}

	//滑动条改变数字也随之改变，同理数字改变滑动条也随之改变
	oRange.onchange = function () {
		oNumber.value = oRange.value;
	}
	oNumber.onchange = function () {
		oRange.value = oNumber.value;
	}

	//2和4的出现频率初始化
	var rate = oNumber.value;

	//向左移动（当iMove参数大于0时，不移动，等于0时，移动）
	function leftMove(arr, iMove) {
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < arr.length; j++) {
				//先找到notZeroSub（非零数），并给其下标赋值
				var notZeroSub = -1;
				for (var currentSub = j + 1; currentSub < arr.length; currentSub++) {  //从每行下标为1的数开始遍历
					if (arr[i][currentSub] !== 0) {  //找到非零数
						notZeroSub = currentSub;  //给非零数下标赋值
						break;
					}
				}

				if (notZeroSub !== -1) {
					if (arr[i][j] === 0) {  //遍历二维时，每轮遍历的首项为零
						arr[i][j] = arr[i][notZeroSub];
						arr[i][notZeroSub] = 0;
						j -= 1;

						iMove++;
					} else if (arr[i][j] === arr[i][notZeroSub]) {  //每轮遍历的首项与非零项数值相等，合并
						arr[i][j] = arr[i][j] * 2;
						iCurrentScore += arr[i][j];  //每次合并都会加相应的分数，eg：合成数字8，分数加8
						arr[i][notZeroSub] = 0;

						iMove++;
					}
				}
			}
		}
		return iMove;
	}

	//向右移动
	function rightMove(arr, iMove) {
		for (var i = 0; i < arr.length; i++) {
			for (var j = 3; j > -1; j--) {
				//先找到notZeroSub（非零数），并给其下标赋值
				var notZeroSub = -1;
				for (var currentSub = j - 1; currentSub > -1; currentSub--) {  //从每行下标为1的数开始遍历
					if (arr[i][currentSub] !== 0) {  //找到非零数
						notZeroSub = currentSub;  //给非零数下标赋值
						break;
					}
				}

				if (notZeroSub !== -1) {
					if (arr[i][j] === 0) {  //遍历二维时，每轮遍历的末项为零
						arr[i][j] = arr[i][notZeroSub];
						arr[i][notZeroSub] = 0;
						j += 1;

						iMove++;
					} else if (arr[i][j] === arr[i][notZeroSub]) {  //每轮遍历的末项与非零项数值相等，合并
						arr[i][j] = arr[i][j] * 2;
						iCurrentScore += arr[i][j];  //每次合并都会加相应的分数，eg：合成数字8，分数加8
						arr[i][notZeroSub] = 0;

						iMove++;
					}
				}
			}
		}
		return iMove;
	}

	//向上移动
	function upMove(arr, iMove) {
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < arr.length; j++) {
				//先找到notZeroSub（非零数），并给其下标赋值
				var notZeroSub = -1;
				for (var currentSub = i + 1; currentSub < arr.length; currentSub++) {  //从每行下标为1的数开始遍历
					if (arr[currentSub][j] !== 0) {  //找到非零数
						notZeroSub = currentSub;  //给非零数下标赋值
						break;
					}
				}

				if (notZeroSub !== -1) {
					if (arr[i][j] === 0) {  //遍历二维时，每轮遍历的首项为零
						arr[i][j] = arr[notZeroSub][j];
						arr[notZeroSub][j] = 0;
						j -= 1;

						iMove++;
					} else if (arr[i][j] === arr[notZeroSub][j]) {  //每轮遍历的首项与非零项数值相等，合并
						arr[i][j] = arr[i][j] * 2;
						iCurrentScore += arr[i][j];  //每次合并都会加相应的分数，eg：合成数字8，分数加8
						arr[notZeroSub][j] = 0;

						iMove++;
					}
				}
			}
		}
		return iMove;
	}

	//向下移动
	function downMove(arr, iMove) {
		for (var i = 3; i > -1; i--) {
			for (var j = 0; j < arr.length; j++) {
				//先找到notZeroSub（非零数），并给其下标赋值
				var notZeroSub = -1;
				for (var currentSub = i - 1; currentSub > -1; currentSub--) {  //从每行下标为1的数开始遍历
					if (arr[currentSub][j] !== 0) {  //找到非零数
						notZeroSub = currentSub;  //给非零数下标赋值
						break;
					}
				}

				if (notZeroSub !== -1) {
					if (arr[i][j] === 0) {  //遍历二维时，每轮遍历的末项为零
						arr[i][j] = arr[notZeroSub][j];
						arr[notZeroSub][j] = 0;
						j -= 1;

						iMove++;
					} else if (arr[i][j] === arr[notZeroSub][j]) {  //每轮遍历的末项与非零项数值相等，合并
						arr[i][j] = arr[i][j] * 2;
						iCurrentScore += arr[i][j];  //每次合并都会加相应的分数，eg：合成数字8，分数加8
						arr[notZeroSub][j] = 0;

						iMove++;
					}
				}
			}
		}
		return iMove;
	}

	//数字的二维坐标转换成一维坐标
	function XY_n(numX, numY) {
		if (numX == 0 && numY == 0)
			n = 0;
		else if (numX == 0 && numY == 1)
			n = 1;
		else if (numX == 0 && numY == 2)
			n = 2;
		else if (numX == 0 && numY == 3)
			n = 3;
		else if (numX == 1 && numY == 0)
			n = 4;
		else if (numX == 1 && numY == 1)
			n = 5;
		else if (numX == 1 && numY == 2)
			n = 6;
		else if (numX == 1 && numY == 3)
			n = 7;
		else if (numX == 2 && numY == 0)
			n = 8;
		else if (numX == 2 && numY == 1)
			n = 9;
		else if (numX == 2 && numY == 2)
			n = 10;
		else if (numX == 2 && numY == 3)
			n = 11;
		else if (numX == 3 && numY == 0)
			n = 12;
		else if (numX == 3 && numY == 1)
			n = 13;
		else if (numX == 3 && numY == 2)
			n = 14;
		else if (numX == 3 && numY == 3)
			n = 15;

		return n;
	}

	//储存移动前的分数
	var iBeforeScore = 0;

	for (var i = 0; i < aLiTwoDimension.length; i++) {
		for (var j = 0; j < aLiTwoDimension[i].length; j++) {
			document.onkeydown = function (event) {
				var event = event || window.event;   //兼容

				//改变方块中的数字（arrBlock控制方块的颜色和透明度，arrNum控制数字）
				function changeNum(arrBlock, arrNum) {
					var n = XY_n(i, j);

					if (arrNum[i][j] == 0) {
						arrBlock[n].innerText = null;
						arrBlock[n].style.backgroundColor = '#000';
						arrBlock[n].style.opacity = 0.1;
						arrBlock[n].style.filter = 'alpha(opacity = 10)';
					}
					else {
						arrBlock[n].innerText = arrNum[i][j];

						if (arrNum[i][j] != 0) {
							arrBlock[n].style.opacity = 1;
							arrBlock[n].style.filter = 'alpha(opacity = 100)';
						}

						//调整字体大小，确保数字很大时，能显示完全
						if (arrNum[i][j] <= 8192) {
							arrBlock[n].style.fontSize = '30px';
						}
						else arrBlock[n].style.fontSize = '20px';

						switch (arrNum[i][j]) {
							case 2: arrBlock[n].style.backgroundColor = '#dac6ff'; break;
							case 4: arrBlock[n].style.backgroundColor = '#84ffa3'; break;
							case 8: arrBlock[n].style.backgroundColor = '#a3fffe'; break;
							case 16: arrBlock[n].style.backgroundColor = '#95a9ff'; break;
							case 32: arrBlock[n].style.backgroundColor = '#ff7982'; break;
							case 64: arrBlock[n].style.backgroundColor = '#fe31e0'; break;
							case 128: arrBlock[n].style.backgroundColor = '#ff912f'; break;
							case 256: arrBlock[n].style.backgroundColor = '#51ff43'; break;
							case 512: arrBlock[n].style.backgroundColor = '#fff962'; break;
							case 1024: arrBlock[n].style.backgroundColor = '#ff7200'; break;
							case 2048: arrBlock[n].style.backgroundColor = '#1E90FF'; break;
							case 4096: arrBlock[n].style.backgroundColor = '#7FFF00'; break;
							case 8192: arrBlock[n].style.backgroundColor = '#FFEBCD'; break;
							case 16384: arrBlock[n].style.backgroundColor = '#FF8C00'; break;
							case 32768: arrBlock[n].style.backgroundColor = '#FF1493'; break;
							case 65536: arrBlock[n].style.backgroundColor = '#DC143C'; break;
							case 131072: arrBlock[n].style.backgroundColor = '#8B0000'; break;
							case 262114: arrBlock[n].style.backgroundColor = '#A52A2A'; break;
						}
					}
				}

				//在空白处随机生成新的数字
				function newNum(arrBlock, arrNum) {
					var iNumX = parseInt(Math.floor(Math.random() * 4));
					var iNumY = parseInt(Math.floor(Math.random() * 4));

					while (true) {
						if (arrNum[iNumX][iNumY] == 0) {
							var n = XY_n(iNumX, iNumY);

							var iNumHundred = parseInt(Math.floor(Math.random() * 100 + 1));

							//控制2和4出现的频率，默认设置为4:1
							rate = oNumber.value

							if (iNumHundred <= rate) {
								arrNum[iNumX][iNumY] = 2;
								arrBlock[n].innerText = 2;
								arrBlock[n].style.backgroundColor = '#dac6ff';
							}
							else {
								arrNum[iNumX][iNumY] = 4;
								arrBlock[n].innerText = 4;
								arrBlock[n].style.backgroundColor = '#84ffa3';
							}

							arrBlock[n].style.opacity = 1;
							arrBlock[n].style.filter = 'alpha(opacity = 100)';

							break;
						}

						iNumX = parseInt(Math.floor(Math.random() * 4));
						iNumY = parseInt(Math.floor(Math.random() * 4));
					}

				}

				//储存最高分
				function keepMaxScore() {
					if (iCurrentScore > iMaxScore) {
						iMaxScore = iCurrentScore;
						if (iMaxScore > localStorage.getItem('bestScore')) {
							localStorage.setItem('bestScore', iMaxScore);
							oMaxScore.innerText = localStorage.getItem('bestScore');
						}
					}
				}

				//判断游戏是否结束,iBool为true则游戏满足结束条件，否则游戏继续
				function gameOver(arrNum, score) {
					var iBool = true;
					var oGameoverScore = document.getElementById('ogameover-score');

					for (var i = 0; i < 4; i++) {
						for (var j = 0; j < 4; j++) {
							if (arrNum[i][j] == 0) {
								iBool = false;
							}

						}
					}

					//iBool==false时证明还有空位，则跳出函数，游戏继续，否则再判断是否还有能合并的数字
					if (iBool == false) {
						return;
					}
					else {
						var iGameover = 0;

						//向右移动
						for (var i = 0; i < 4; i++) {
							for (var j = 3; j > -1; j--) {
								var notZeroSub = -1;
								for (var currentSub = j - 1; currentSub > -1; currentSub--) {
									if (arrNum[i][currentSub] !== 0) {
										notZeroSub = currentSub;
										break;
									}
								}

								if (notZeroSub !== -1) {
									if (arrNum[i][j] === 0) {
										arrNum[i][j] = arrNum[i][notZeroSub];
										arrNum[i][notZeroSub] = 0;
										j += 1;
									} else if (arrNum[i][j] === arrNum[i][notZeroSub]) {
										arrNum[i][j] = arrNum[i][j] * 2;
										iCurrentScore += arrNum[i][j];
										arrNum[i][notZeroSub] = 0;

										iGameover++;
									}
								}
							}
						}

						//向下移动
						for (var i = 3; i > -1; i--) {
							for (var j = 0; j < 4; j++) {
								var notZeroSub = -1;
								for (var currentSub = i - 1; currentSub > -1; currentSub--) {
									if (arrNum[currentSub][j] !== 0) {
										notZeroSub = currentSub;
										break;
									}
								}

								if (notZeroSub !== -1) {
									if (arrNum[i][j] === 0) {
										arrNum[i][j] = arrNum[notZeroSub][j];
										arrNum[notZeroSub][j] = 0;
										j -= 1;
									} else if (arrNum[i][j] === arrNum[notZeroSub][j]) {
										arrNum[i][j] = arrNum[i][j] * 2;
										iCurrentScore += arrNum[i][j];
										arrNum[notZeroSub][j] = 0;

										iGameover++;
									}
								}
							}
						}

						//如果还能向右或者向下移动一次，那么游戏还没有结束，跳出函数，否则游戏结束
						if (iGameover != 0) {
							return;
						}

						//游戏结束，弹出结束窗口,输出玩家所得的分数
						oGameoverScore.innerText = score;
						elasticRubMove(oGameover, 150)
					}
				}

				if (event.keyCode == 37)  //左移
				{
					//保存移动之前的数组
					for (var i = 0; i < 4; i++) {
						for (var j = 0; j < 4; j++) {
							aReall[i][j] = aNumTwoDimension[i][j];
						}
					}

					//保存移动前的分数
					iBeforeScore = iCurrentScore;

					//iMove用于判断数字块是否可以移动或合并
					var iMove = 0;
					var m = leftMove(aNumTwoDimension, iMove);

					//iMove大于0，则数字块可以移动或合并
					if (m > 0) {
						//更新步数为可以撤回
						iClick = true;

						for (var i = 0; i < 4; i++) {
							for (var j = 0; j < 4; j++) {
								changeNum(aLiOneDimension, aNumTwoDimension);
							}
						}

						newNum(aLiOneDimension, aNumTwoDimension);

						iStep++;
						oCurrentStep.innerText = iStep;
						oCurrentScore.innerText = iCurrentScore;

						keepMaxScore();

						gameOver(aNumTwoDimension, iCurrentScore);
					}
				}
				else if (event.keyCode == 38)  //上移
				{
					//保存移动之前的数组
					for (var i = 0; i < 4; i++) {
						for (var j = 0; j < 4; j++) {
							aReall[i][j] = aNumTwoDimension[i][j];
						}
					}

					//保存移动前的分数
					iBeforeScore = iCurrentScore;

					//iMove用于判断数字块是否可以移动或合并
					var iMove = 0;
					var m = upMove(aNumTwoDimension, iMove);

					//iMove大于0，则数字块可以移动或合并
					if (m > 0) {
						//更新步数为可以撤回
						iClick = true;

						for (var i = 0; i < 4; i++) {
							for (var j = 0; j < 4; j++) {
								changeNum(aLiOneDimension, aNumTwoDimension);
							}
						}

						newNum(aLiOneDimension, aNumTwoDimension);

						iStep++;
						oCurrentStep.innerText = iStep;
						oCurrentScore.innerText = iCurrentScore;

						keepMaxScore();

						gameOver(aNumTwoDimension, iCurrentScore);
					}
				}
				else if (event.keyCode == 39)  //右移
				{
					//保存移动之前的数组
					for (var i = 0; i < 4; i++) {
						for (var j = 0; j < 4; j++) {
							aReall[i][j] = aNumTwoDimension[i][j];
						}
					}

					//保存移动前的分数
					iBeforeScore = iCurrentScore;

					//iMove用于判断数字块是否可以移动或合并
					var iMove = 0;
					var m = rightMove(aNumTwoDimension, iMove);

					//iMove大于0，则数字块可以移动或合并
					if (m > 0) {
						//更新步数为可以撤回
						iClick = true;

						for (var i = 0; i < 4; i++) {
							for (var j = 0; j < 4; j++) {
								changeNum(aLiOneDimension, aNumTwoDimension);
							}
						}

						newNum(aLiOneDimension, aNumTwoDimension);

						iStep++;
						oCurrentStep.innerText = iStep;
						oCurrentScore.innerText = iCurrentScore;

						keepMaxScore();

						gameOver(aNumTwoDimension, iCurrentScore);
					}
				}
				else if (event.keyCode == 40)  //下移
				{
					//保存移动之前的数组
					for (var i = 0; i < 4; i++) {
						for (var j = 0; j < 4; j++) {
							aReall[i][j] = aNumTwoDimension[i][j];
						}
					}

					//保存移动前的分数
					iBeforeScore = iCurrentScore;

					//iMove用于判断数字块是否可以移动或合并
					var iMove = 0;
					var m = downMove(aNumTwoDimension, iMove);

					//iMove大于0，则数字块可以移动或合并
					if (m > 0) {
						//更新步数为可以撤回
						iClick = true;

						for (var i = 0; i < 4; i++) {
							for (var j = 0; j < 4; j++) {
								changeNum(aLiOneDimension, aNumTwoDimension);
							}
						}

						newNum(aLiOneDimension, aNumTwoDimension);

						iStep++;
						oCurrentStep.innerText = iStep;
						oCurrentScore.innerText = iCurrentScore;

						keepMaxScore();

						gameOver(aNumTwoDimension, iCurrentScore);
					}
				}
			}
		}
	}

	//-----------------------音乐按钮----------------------
	var oMusicImg = document.getElementById('omusicimg');
	var oAudio = document.getElementById('oaudio');

	oMusicImg.onclick = function () {
		if (oMusicImg.src.match('stopmusic')) {
			oAudio.play();
			oMusicImg.src = 'images/music.png';
		}
		else {
			oAudio.pause();
			oMusicImg.src = 'images/stopmusic.png';
		}
	}

	//---------------------重新开始按钮---------------------
	var oRestartImg = document.getElementById('orestartimg');

	oRestartImg.onclick = function () {
		window.location.reload();
	}

	//---------------------撤回按钮------------------------
	var oRecallImg = document.getElementById('orecallimg');
	var iClick = true;

	oRecallImg.onclick = function () {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				function changeNum(arrBlock, arrNum) {
					var n = XY_n(i, j);

					if (arrNum[i][j] == 0) {
						arrBlock[n].innerText = null;
						arrBlock[n].style.backgroundColor = '#000';
						arrBlock[n].style.opacity = 0.1;
						arrBlock[n].style.filter = 'alpha(opacity = 10)';
					}
					else {
						arrBlock[n].innerText = arrNum[i][j];

						if (arrNum[i][j] != 0) {
							arrBlock[n].style.opacity = 1;
							arrBlock[n].style.filter = 'alpha(opacity = 100)';
						}

						if (arrNum[i][j] <= 8192) {
							arrBlock[n].style.fontSize = '30px';
						}
						else arrBlock[n].style.fontSize = '20px';

						switch (arrNum[i][j]) {
							case 2: arrBlock[n].style.backgroundColor = '#dac6ff'; break;
							case 4: arrBlock[n].style.backgroundColor = '#84ffa3'; break;
							case 8: arrBlock[n].style.backgroundColor = '#a3fffe'; break;
							case 16: arrBlock[n].style.backgroundColor = '#95a9ff'; break;
							case 32: arrBlock[n].style.backgroundColor = '#ff7982'; break;
							case 64: arrBlock[n].style.backgroundColor = '#fe31e0'; break;
							case 128: arrBlock[n].style.backgroundColor = '#ff912f'; break;
							case 256: arrBlock[n].style.backgroundColor = '#51ff43'; break;
							case 512: arrBlock[n].style.backgroundColor = '#fff962'; break;
							case 1024: arrBlock[n].style.backgroundColor = '#ff7200'; break;
							case 2048: arrBlock[n].style.backgroundColor = '#1E90FF'; break;
							case 4096: arrBlock[n].style.backgroundColor = '#7FFF00'; break;
							case 8192: arrBlock[n].style.backgroundColor = '#FFEBCD'; break;
							case 16384: arrBlock[n].style.backgroundColor = '#FF8C00'; break;
							case 32768: arrBlock[n].style.backgroundColor = '#FF1493'; break;
							case 65536: arrBlock[n].style.backgroundColor = '#DC143C'; break;
							case 131072: arrBlock[n].style.backgroundColor = '#8B0000'; break;
							case 262114: arrBlock[n].style.backgroundColor = '#A52A2A'; break;
						}
					}
				}

				changeNum(aLiOneDimension, aReall);

				//把保存的上一步的数组赋给当前数组（完成数组的更新）
				aNumTwoDimension[i][j] = aReall[i][j];
			}
		}

		//步数可以撤回，只执行一次
		if (iClick == true && iStep != 0) {
			iStep--;
			oCurrentStep.innerText = iStep;
		}

		oCurrentScore.innerText = iBeforeScore;

		//更新保存的当前分数
		iCurrentScore = iBeforeScore;

		//更新步数为不可撤回
		iClick = false;
	}

	//---------------游戏结束时的重新开始按钮--------------
	var oGameoverRestart = document.getElementById('ogameover-restart');
	var oGameover = document.getElementById('gameover');

	oGameoverRestart.onclick = function () {
		window.location.reload();
	}
}