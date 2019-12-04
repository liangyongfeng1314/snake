window.onload = function(){
	// 游戏状态
	let gamestatus;
	// 开始界面
	let start = document.querySelector('.start');
	// 赢界面
	let win = document.querySelector('.win');
	// 失败界面
	let defeated = document.querySelector('.defeated');
	// 开始游戏
	document.querySelector('.start button').addEventListener('click',function(){
		start.style.cssText += ';display: none;';
		snake();
	});
	// 再玩一次
	// document.querySelector('.playAgain').addEventListener('click',function(){
	// 	win.style.cssText +=  ';opacity: 0;z-index:0;';
	// 	deleteBeforeEgg();
	// 	deleteBeforeSnakeHead();
	// 	deleteBeforeObstruction();
	// 	snake();
	// 	gamestatus = 'playing';
	// });
	// 再来一次
	document.querySelector('.tryAgain').addEventListener('click',function(){
		defeated.style.cssText +=  ';opacity: 0;z-index:0;';
		location.reload();
	});
	function snake(){
		// 默认分数
		let score = 0;
		// 分数改变区
		let totalScore = document.querySelector("#scores");
		// 蛇之草地
		let grasslandElement = document.querySelector('.snake-grassland');
		// 确定蛇的X轴和Y轴
		let snakeX = Math.floor(Math.random()*10);
		let snakeY = Math.floor(Math.random()*3+2);
		// 蛇身体每个部分
		let snakeArray = [
			{ 
				x:snakeX,
				y:snakeY
			}
		];
		// 障碍物
		let obstructionX;
		let obstructionY;
		obstructionProducting();
		// 蛋的x轴
		let eggX; 
		// 蛋的Y轴
		let eggY;
		// 初始化蛋
		eggProducting();
		
		let arrow = "ArrowRight"; // 默认是右移动
		// 初始化蛇的蛇头
		snakeArray.forEach((item,index)=>{
			// 蛇头放置的格子
			let snakeElement = grasslandElement.children[item.x].children[item.y];
			if(index === 0){ // 蛇头
				snakeElement.innerHTML = `<div class="snake snake-head"></div>`;
			}else{ // 蛇身
				snakeElement.innerHTML = `<div class="snake snake-body"></div>`;
			}
		})
		function MoveLoop(arrow){
			switch(arrow){ // 向上移
				case 'ArrowUp':
					deleteBeforeSnakeHead();
					snakemoveTop();
				break;
				case 'ArrowDown': // 向上移
					deleteBeforeSnakeHead();
					snakemoveBottom();
					
				break;
				case 'ArrowLeft': // 向左移
					deleteBeforeSnakeHead();
					snakemoveLeft();
					
				break;
				case 'ArrowRight': // 向右移
					deleteBeforeSnakeHead();
					snakemoveRight();
				break;
			}
			snakeArray.forEach((item,index)=>{
				// 确定存放的蛇头的格子
				let snakeElement = grasslandElement.children[item.x].children[item.y];
				if(index === 0){ // //蛇头
					snakeElement.innerHTML = `<div class="snake snake-head"></div>`;
				}else{ // 蛇身
					snakeElement.innerHTML = `<div class="snake snake-body"></div>`;
				}
			})
		}
		
		// 监听键盘释放按下
		document.addEventListener('keydown',function(event){
			arrow = event.key;
			if(gamestatus == 'winning' || gamestatus == 'defeated'){
				arrow = '';
			}
			MoveLoop(arrow);
		});
		let autoMove = setInterval(function(){
			MoveLoop(arrow);
		},1000)
		
	
		// 向上移动
		function snakemoveTop(){
			// 递增移动占据前一个位置
			let snakeArray2 = [];
			snakeArray.forEach((item,index)=>{
				if(index === 0){
					snakeArray2.push({
						x: snakeArray[index].x - 1,
						y: snakeArray[index].y
					})
				}else{
					snakeArray2.push({
						x: snakeArray[index - 1].x,
						y: snakeArray[index - 1].y
					})
				}
			})

			snakeArray = snakeArray2;
			console.log(snakeArray[snakeArray.length - 1].x);
			// 蛇是否吃到蛋
			if(snakeArray[0].x === eggX && snakeArray[0].y === eggY){
				// 蛇尾 - 蛇的数组 就是蛇尾的坐标了()
				let snakeTail = snakeArray[snakeArray.length - 1];  // 比如是snakeArray[1]蛇尾
				snakeArray.push({
					x: snakeTail.x + 1,
					y: snakeTail.y
				});
				// 蛇吃掉蛋再生成一个
				eggProducting();
			}
			// 如果是蛇头碰到蛇身 - game over
			headTouchTail();
			// 如果蛇头碰到障碍物 - game over
			defeated_obstruction();
			// 蛇碰到边界
			defeated_border();
		}
		// 向下移动
		function snakemoveBottom(){
			let snakeArray2 = [];
			snakeArray.forEach((item,index)=>{
				if(index === 0){
					snakeArray2.push({
						x: snakeArray[index].x + 1,
						y: snakeArray[index].y
					})
				}else{
					snakeArray2.push({
						x: snakeArray[index - 1].x,
						y: snakeArray[index - 1].y
					})
				}
			})
			snakeArray = snakeArray2;
			// 蛇是否吃到蛋
			if(snakeArray[0].x === eggX && snakeArray[0].y === eggY){
				// 蛇尾 - 蛇的数组 就是蛇尾的坐标了()
				let snakeTail = snakeArray[snakeArray.length - 1];  // 比如是snakeArray[1]蛇尾
				snakeArray.push({
					x: snakeTail.x - 1, 
					y: snakeTail.y
				});
				eggProducting();
			}
			// 如果是蛇头碰到蛇身 - game over
			headTouchTail();
			// 如果蛇头碰到障碍物 - game over
			defeated_obstruction();
			// 蛇碰到边界
			defeated_border();
		}
		// 向左移动
		function snakemoveLeft(){
			let snakeArray2 = [];
			snakeArray.forEach((item,index)=>{
				if(index === 0){
					snakeArray2.push({
						x: snakeArray[index].x,
						y: snakeArray[index].y - 1 
					})
				}else{
					snakeArray2.push({
						x: snakeArray[index - 1].x,
						y: snakeArray[index - 1].y
					})
				}
			})
			snakeArray = snakeArray2;
			if(snakeArray[0].x === eggX && snakeArray[0].y === eggY){
				
				// 蛇尾 - 蛇的数组 就是蛇尾的坐标了()
				let snakeTail = snakeArray[snakeArray.length - 1];  // 比如是snakeArray[1]蛇尾
				snakeArray.push({
					x: snakeTail.x, 
					y: snakeTail.y + 1
				});
				// 蛇吃掉蛋再生成一个
				eggProducting();
			}
			// 如果是蛇头碰到蛇身 - game over
			headTouchTail();
			// 如果蛇头碰到障碍物 - game over
			defeated_obstruction();
			// 蛇碰到边界
			defeated_border();
		}
		// 向右移动
		function snakemoveRight(){
			let snakeArray2 = [];
			snakeArray.forEach((item,index)=>{
				if(index === 0){
					snakeArray2.push({
						x: snakeArray[index].x,
						y: snakeArray[index].y +1
					})
				}else{
					snakeArray2.push({
						x: snakeArray[index - 1].x,
						y: snakeArray[index - 1].y
					})
				}
			})
			snakeArray = snakeArray2;
			if(snakeArray[0].x === eggX && snakeArray[0].y === eggY){
				// 蛇尾 - 蛇的数组 就是蛇尾的坐标了()
				let snakeTail = snakeArray[snakeArray.length - 1];  // 比如是snakeArray[1]蛇尾
				snakeArray.push({
					x: snakeTail.x,
					y: snakeTail.y - 1
				});
				// 蛇吃掉蛋再生成一个
				eggProducting();
			}
			// 如果是蛇头碰到蛇身 - game over
			headTouchTail();
			// 如果蛇头碰到障碍物 - game over
			defeated_obstruction();
			// 蛇碰到边界
			defeated_border();
		}
		// 生成蛋
		function eggProducting(){
			// 随机生成蛋的X坐标
			 eggX = Math.floor(Math.random()*10);
			// 随机生成蛋的Y轴坐标
			 eggY = Math.floor(Math.random()*10);
			// 确定存放蛋的格子
			let randomCellElement =  grasslandElement.children[eggX].children[eggY];

			randomCellElement.innerHTML = `<img src="egg.png" alt="" class="egg">`;
			snakeArray.forEach(function(item,index){
				// 如果蛋与蛇的各部分重叠重新生成一个蛋
				if(item.x === eggX && item.y === eggY){
					deleteBeforeEgg();
					eggProducting();
					// 如果与障碍物格子相同也是重新生成一个蛋
				}else if(obstructionX === eggX && obstructionY === eggY){
					deleteBeforeEgg(); // 删除前面的蛋
					deleteBeforeObstruction(); // 删除前面的障碍物
					eggProducting(); // 重新生成一个蛋
					obstructionProducting(); // 重新生成一个障碍物
				}else{
					// 不做任何处理
				}
			})
			// 分数达到50分
			if(score == 10){
				gamestatus = 'winning';
				win.style.cssText += ';opacity: 1.0;z-index: 1314';
				clearInterval(autoMove); // 清空它动
				arrow = ''; // 清空默认方向，这样就移动不了
			}
			// 每生产一次蛋，分数加一
			totalScore.innerHTML = score; 
			score+=1;

		}
		// 障碍物生成
		function obstructionProducting(){
			obstructionX = Math.floor(Math.random()*10);
			obstructionY = Math.floor(Math.random()*10);
			let randomObstructionElement =  grasslandElement.children[obstructionX].children[obstructionY];
			randomObstructionElement.innerHTML = `<embed src="obstruction.svg" class="obstruction"></embed>`;
		}
		// 蛇头碰到蛇身
		function headTouchTail(){
			snakeArray.forEach((item,index)=>{
				// 蛇头不比较
				if(index != 0){ 
					defeated_body(index);
				}
			})
		}
		// 蛇碰到身体
		function defeated_body(index){
			if(snakeArray[0].x  === snakeArray[index].x && 
				snakeArray[0].y === snakeArray[index].y){
				defeated.style.cssText = ';opacity: 1.0;z-index: 1314;';
				gamestatus = 'defeated';
				clearInterval(autoMove); // 清空它动
			}
		}
		// 蛇碰到障碍物
		function defeated_obstruction(){
			if(snakeArray[0].x === obstructionX && snakeArray[0].y === obstructionY){
				defeated.style.cssText = ';opacity: 1.0;z-index: 1314;';
				gamestatus = 'defeated';
				clearInterval(autoMove); // 清空它动
			}
		}
		function defeated_border(){
			if(snakeArray[0].y > 9){
				defeated.style.cssText = ';opacity: 1.0;z-index: 1314;';
				gamestatus = 'defeated';
				clearInterval(autoMove);
			}else if(snakeArray[0].y < 0){
				defeated.style.cssText = ';opacity: 1.0;z-index: 1314;';
				gamestatus = 'defeated';
				clearInterval(autoMove);
			}else if(snakeArray[0].x < 0){
				defeated.style.cssText = ';opacity: 1.0;z-index: 1314;';
				gamestatus = 'defeated';
				clearInterval(autoMove);
			}else if(snakeArray[0].x > 9){
				defeated.style.cssText = ';opacity: 1.0;z-index: 1314;';
				gamestatus = 'defeated';
				clearInterval(autoMove);
			}
		}
	}

	// 删除上一个蛇头
	function deleteBeforeSnakeHead(){
		document.querySelectorAll('.snake').forEach(function(item){
			item.parentElement.removeChild(item);
		});
	}
	// 删除前面的蛋
	function deleteBeforeEgg(){
		document.querySelectorAll('.egg').forEach(function(item){
			item.parentElement.removeChild(item);
		});	
	}
	// 删除前面的障碍物 Obstruction
	function deleteBeforeObstruction(){
		document.querySelectorAll('.obstruction').forEach(function(item){
			item.parentElement.removeChild(item);
		});	
	}
}
	