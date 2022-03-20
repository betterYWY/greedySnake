//引入样式
import './style/index.less';

// 定义食物类
class Food{
    // 
    element: HTMLElement

    constructor() {
        // 获取页面中的food元素，！非空断言，表示不可能为空
        this.element = document.getElementById('food')! 
    }

    get X(){
        return this.element.offsetLeft
    }

    get Y(){
        return this.element.offsetTop
    }
    //修改食物位置
    change(){
        let top = Math.round(Math.random() * 29) * 10
        let left = Math.round(Math.random() * 29) * 10
        this.element.style.left = top + 'px'
        this.element.style.top = left + 'px'
    }
}

//定义记分牌
class ScorePanel{
    score = 0
    level = 1
    scoreEle: HTMLElement
    levelEle: HTMLElement

    constructor(){
        this.scoreEle = document.getElementById('score')!
        this.levelEle = document.getElementById('level')!
    }
    //加分方法
    addScore(){
        this.scoreEle.innerHTML = ++this.score + ''
        if(this.score % 10 === 0){
            this.levelUp()
        }
    }

    //提升等级的方法
    levelUp(){
        if(this.level < 10){
            this.levelEle.innerHTML = ++this.level + ''
        }
        
    }
}
 
//蛇类
class Snake{
    //蛇容器
    element:HTMLElement
    //蛇头
    head: HTMLElement
    //蛇身(包括蛇头)
    bodies: HTMLCollection
    constructor(){
        this.element = document.getElementById('snake')!
        this.head = document.querySelector('#snake > div')!
        this.bodies = document.getElementById('snake')?.getElementsByTagName('div')!
    }

    // 获取蛇头的坐标
    get X(){
        return this.head.offsetLeft
    }
    get Y(){
        return this.head.offsetTop
    }
    //设置蛇头的坐标
    set X(value:number){
        if(this.X === value){
            return
        }
        if(value < 0 || value >290){
            throw new Error('蛇撞墙了')
        }
        this.moveBody()
        this.head.style.left = value + 'px'
        this.checkEatSelf()
    }
    set Y(value:number){
        if(this.Y === value){
            return
        }
        if(value < 0 || value >290){
            throw new Error('蛇撞墙了')
        }
        this.moveBody()
        this.head.style.top = value + 'px'
        this.checkEatSelf()
    }


    //蛇增加身体的方法
    addBody(){
        // 向element中添加div
        this.element.insertAdjacentHTML('beforeend','<div></div>')
    }
    //蛇身移动的方法
    moveBody(){
        for(let i=this.bodies.length-1; i>0; i--){
            let X = (this.bodies[i-1] as HTMLElement).offsetLeft;
            let Y = (this.bodies[i-1] as HTMLElement).offsetTop;
            (this.bodies[i] as HTMLElement).style.left = X +'px';
            (this.bodies[i] as HTMLElement).style.top = Y +'px';
        }
    }
    //检查是否撞到自己
    checkEatSelf(){
        for(let i=1;i<this.bodies.length; i++){
            let bd = this.bodies[i] as HTMLElement
            if(bd.offsetTop === this.Y && bd.offsetLeft === this.X){
                throw new Error('撞到自己了')
            }
        }
    }
    

}


//游戏控制器
class GameControl{
    snake: Snake
    food: Food
    scorelPanel: ScorePanel
    //存储蛇的移动方向
    direction: string = 'ArrowRight'
    //记录游戏是否结束
    isLive = true

    constructor(){
        this.snake = new Snake()
        this.food = new Food()
        this.scorelPanel = new ScorePanel()

        this.init()
    }
    //游戏的初始方法
    init(){
        document.addEventListener('keydown',this.keydownHandler.bind(this))
        
        this.run()
    }
    // 键盘按下的响应函数
    keydownHandler(event:KeyboardEvent){
        if(((this.direction === 'ArrowRight') && (event.key !== 'ArrowLeft')) ||
        ((this.direction === 'ArrowLeft') && (event.key !== 'ArrowRight')) ||
        ((this.direction === 'ArrowUp') && (event.key !== 'ArrowDown')) ||
        ((this.direction === 'ArrowDown') && (event.key !== 'ArrowUp'))
        ){
            this.direction = event.key
        }
        // this.direction = event.key
    }
    //控制蛇移动的方法
    run(){
        //获取蛇目前坐标
        let X = this.snake.X
        let Y = this.snake.Y

        switch(this.direction){
            case "ArrowUp": 
            case "up":
                Y -= 10;
                break
            case "ArrowDown":
            case "Down": 
                Y += 10
                break
            case "ArrowLeft":
            case "Left": 
                X -= 10
                break
            case "ArrowRight":
            case "Right":
                X += 10
                break
        }
       this.checkEat(X,Y)



        try{
            this.snake.X = X
            this.snake.Y = Y
            this.isLive && setTimeout(this.run.bind(this),300 - (this.scorelPanel.level - 1 ) * 30)
        }catch(e:any){
            alert(e.message)
            this.isLive = false
        }
        
    }
    //检查蛇是否吃到食物
    checkEat(X: number,Y: number){
       if(X === this.food.X && Y === this.food.Y){
        this.food.change()
        this.scorelPanel.addScore()
        this.snake.addBody()
       } 
    }

}
const gc = new GameControl()