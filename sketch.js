var topPipe,bottomPipe,topPipeGroup,bottomPipeGroup;
var bird,birdImage,pipeUp,pipeDown;
var food,foodGroup,foodImage,foodSound;
var bg,back;
var wingSound,endSound;
var START = 0;
var PLAY = 1;
var END = 2;
var gameState = START;
var pipeSpeed = -4;
var score = 0;
var restart,gameOver;

function preload(){
    bg = loadImage('images/back.gif');
    birdImage = loadImage('images/bird.png');
    pipeUp = loadImage('images/pipeNorth.png');
    pipeDown = loadImage('images/pipeSouth.png');
    resetImage = loadImage('images/restart.png');
    gameOverImage = loadImage('images/gameOver.png');
    startBg = loadImage('images/back2.png');
    foodImage = loadImage('images/food.png');
    
    wingSound = loadSound('images/wing.mp3');
    endSound = loadSound('images/hit.mp3');
    foodSound = loadSound('images/checkPoint.mp3');
}

function setup(){
    createCanvas(windowWidth,windowHeight);

    back = createSprite(0,0,displayWidth*5,displayHeight);
    back.addImage(bg);
    back.scale = 7;

    bird = createSprite(displayWidth/2-100,displayHeight/2);
    bird.addImage(birdImage);

    ground = createSprite(displayWidth/2,displayHeight-100,10000,10);
    ground.visible = false;

    topPipeGroup = new Group();
    bottomPipeGroup = new Group();
    foodGroup = new Group();

    restart = createSprite(displayWidth/2,displayHeight/2+45);
    restart.addImage('restart',resetImage);
    restart.visible = false;
    restart.scale = 0.4;

    gameOver = createSprite(displayWidth/2-250,displayHeight/2);
    gameOver.addImage('over',gameOverImage);
    gameOver.visible = false;

    textSize(30);
    textFont('Algerian');
    fill('red');
    stroke('black');
}

function draw(){
    if (gameState === START){
        background(startBg); 
        back.visible=false; 
        bird.visible=false; 
        var heading=createElement('h1'); 
        heading.html("Flappy Bird"); 
        heading.position(displayWidth/2-100,100); 
        var ins=createElement('h2'); 
        ins.html("Welcome to FLAPPY BIRD game ! Tap the 'Play' button given below to start . Press space key to make the bird fly. The faster you press the space key , the higher you go . Each time you press space key , it represents a wing flap and higher flight . Once you stop , you drop towards the ground . Your task is to fly from in between the pipes and score more.Each time you cross from between the pipes , you get 1 score . (BONUS score if you eat the food also.) If you fall on ground or touch any of the pipes , you lose.....You can restart the game by pressing the restart button. ENJOOYYY!!!!"); 
        ins.position(displayWidth/2-635,displayHeight/2-200); 
        var tell=createElement('h2'); 
        tell.html("Click on play nowww!!!"); 
        tell.position(displayWidth/2-100,displayHeight/2+20);

        var button=createButton("Play"); 
        button.position(displayWidth/2,displayHeight/2); 
        button.mousePressed(()=>{
             removeElements(); 
             gameState=PLAY; 
            })
        }

    if(gameState === PLAY){
        back.visible = true;
        bird.visible = true;

        back.velocityX = -2;

        if(touches.length>0 || keyDown('space')){
            bird.velocityY = -10;
            wingSound.play();
            touches = [];
        }

        bird.velocityY +=1;

        if(back.x<0){
            back.x = back.width/2;
        }

        spawnObstacles();
        scoring();

        if(foodGroup.isTouching(bird)){
            for(var k = 0; k<foodGroup.length ; k++){
                if(foodGroup[k].isTouching(bird)){
                    score += 1;
                    foodSound.play();
                    foodGroup[k].destroy();
                }
            }
        }

        if(topPipeGroup.isTouching(bird) || bottomPipeGroup.isTouching(bird)){
            gameState = END;
            endSound.play();
        }
        drawSprites();
        text('Score: '+score,displayWidth-200,100);
    }
    
    if(gameState === END){
        topPipeGroup.setVelocityXEach(0);
        bottomPipeGroup.setVelocityXEach(0);
        foodGroup.setVelocityXEach(0);
        back.velocityX = 0;
        
        restart.visible = true;
        gameOver.visible = true;
        
        topPipeGroup.setLifetimeEach(-1);
        bottomPipeGroup.setLifetimeEach(-1);
        foodGroup.setLifetimeEach(-1);
        bird.velocityY = 0;

        if(mousePressedOver(restart)){
            reset();
        }

        drawSprites();
        text('Score: '+score,displayWidth-200,100);
    }

    if(gameState === END){
        textFont('ArialBold');
        textSize(25);
        stroke(0);
        fill('purple');
        text('You lost! but you played very well. Do not worry we have restart button somewhere above ',displayWidth/2-635,displayHeight/2+100);
        text('Press it to play more and score more !!',displayWidth/2-630,displayHeight/2+150);
        text('Thank You for playing ',displayWidth/2-550,displayHeight/2+200);
        textSize(30);
        textFont('Algerian');
        fill('red');
        stroke(0);
        text('Your final score is '+score ,displayWidth/2+45,displayHeight/2+150);

    }
    
}

function spawnObstacles(){
    if((topPipeGroup.length === 0) || (topPipe.x<displayWidth-420)){
        var randomHeight = random(80,350);

        topPipe = createSprite(displayWidth-100,randomHeight-190);
        topPipe.addImage(pipeUp);
        topPipe.velocityX = pipeSpeed;

        bottomPipe = createSprite(topPipe.x ,displayHeight-180+(randomHeight-190));
        bottomPipe.addImage(pipeDown);
        bottomPipe.velocityX = topPipe.velocityX;

        topPipe.lifetime = displayWidth/2;
        bottomPipe.lifetime = displayWidth/2;

        //creating food in between pipes at random positions
        if(Math.round(random(1,6)) % 2 === 0){
            var food = createSprite(topPipe.x , randomHeight+random(20,170));
            food.addImage(foodImage);
            food.scale = 0.2;
            food.velocityX = topPipe.velocityX;

            foodGroup.add(food);
        }

        topPipeGroup.add(topPipe);
        bottomPipeGroup.add(bottomPipe);
    }
}

function scoring(){
    for(var i=0 ; i<topPipeGroup.length; i++){
        if(bird.x-topPipeGroup[i].x <= 4 && bird.x-topPipeGroup[i].x > 4 + pipeSpeed){
            score = score+1;
        }
        if(score % 2 === 0){
            pipeSpeed = -2;
            topPipeGroup.setVelocityXEach(pipeSpeed);
            bottomPipeGroup.setVelocityXEach(pipeSpeed);
        }
    }
}

function reset(){
    gameState = PLAY;
    restart.visible = false;
    gameOver.visible = false;

    topPipeGroup.destroyEach();
    bottomPipeGroup.destroyEach();
    foodGroup.destroyEach();
    score = 0;
    bird.x = displayWidth/2-100;
    bird.y = displayHeight/2 ;

    pipeSpeed = -4;
}