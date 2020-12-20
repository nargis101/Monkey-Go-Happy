var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monkey , monkey_running, monkey_collide;
var banana, bananaImage, obstacle, obstacleImage, backgroundImg, groundImage, invisibleGround;
var bananaGroup, obstacleGroup;
var survivalTime = 0;
var score = 0;
var jumpSound, collectSound, hitSound;


function preload(){
  
  //loading monkey running animation
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkey_collide = loadAnimation("sprite_3.png");
  
  //loading banana and obstacle images
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  
  backgroundImg = loadImage("backgroundImg.jpg");
  groundImage = loadImage("ground.PNG");
  
  jumpSound = loadSound("jump.mp3");
  collectSound = loadSound("collect.mp3");
  hitSound = loadSound("hit.mp3");
  
}



function setup() {
  createCanvas(600, 400);
  
  //creating monkey
  monkey = createSprite(80, 315, 20, 20);
  monkey.scale = 0.09;
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collide", monkey_collide);
  
  
  //creating ground
  ground = createSprite(400,370,900,10);
  ground.velocityX = -4;
  ground.x = ground.width/2;
  ground.addImage(groundImage);
  ground.scale = 0.5;
  
  invisibleGround = createSprite(300,345,600,7);
  invisibleGround.visible = false;

  bananaGroup = createGroup();
  obstacleGroup = createGroup();
  
  monkey.setCollider("rectangle", 0, 0, 300, 500);
  //monkey.debug = true;


}


function draw() {
  background(backgroundImg);
  
  
  if(gameState === PLAY){
  
  bananas();
  obstacles();
  
  ground.velocityX = -(4+score/3); 
    
  if(ground.x > 600){
    ground.x = 300;
  }
    
  //ongoing ground
  if(ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //making monkey jump
  if(monkey.isTouching(ground) && keyDown("space") && monkey.y >= 120){
    monkey.velocityY = -17;
    jumpSound.play();
  }
  
  //gravity of monkey
  monkey.velocityY = monkey.velocityY + 0.8;
  
  
  //destroying banana if monkey is touching it
  if(monkey.isTouching(bananaGroup)){
    bananaGroup.destroyEach();
    score = score + 1;
    collectSound.play();
  }
    
  //monkey colliding with obstacles
  if(monkey.isTouching(obstacleGroup)){
    hitSound.play();
    gameState = END;
  }
  }
  
  
  if(gameState === END){
    //set velocity of each game object to 0
    ground.velocityX = 0;
 
    monkey.changeAnimation("collide", monkey_collide);
    
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    
    fill("red")
    stroke("black")
    textSize(30);
    text("GAMEOVER!!!", 200, 170);
    fill("black");
    textSize(15);
    text("Press 'space' to play again", 210, 200);
    
    
    if(keyDown("SPACE")) {      
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach();
      monkey.changeAnimation("running", monkey_running);
      score = 0;
      survivalTime = 0;
      gameState = PLAY;
    }
    
    
  }
  
  
  //monkey colliding with ground
  monkey.collide(invisibleGround);
  
  drawSprites();
  
  //displaying score and survival time
  fill("black");
  stroke("black")
  textSize(15);
  text("Banana's Collected: " + score, 180, 50);
  survivalTime = Math.ceil(frameCount/frameRate());
  text("Survival Time: " + survivalTime, 15, 50);
}


function bananas(){
  if(frameCount % 75 === 0){
    var banana = createSprite(600, 200, 50, 10);
    banana.y = Math.round(random(120, 200));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -(4+score/4);
    
    //assign lifetime to banana
    banana.lifetime = 150;

    bananaGroup.add(banana);
    }
  }


function obstacles(){
  if(frameCount % 250 === 0){
    var obstacle = createSprite(600, 322, 50, 10);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.12;
    obstacle.velocityX = -(4+score/4);
    
    //assign lifetime to obstacle
    obstacle.lifetime = 150;
    
    obstacleGroup.add(obstacle);
    }
  }