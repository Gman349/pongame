//get elements

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//static variables

const width = canvas.width;
const height = canvas.height;

// build play area
ctx.fillStyle = "black";
ctx.fillRect(0,0,width,height);

// ~~~BALL~~~

// dictate the size of the ball
const ball_size = 10;
// dictate starting position
var ball_move;

// horizontal and vertical rate of change
var x_speed;
var y_speed;

function init_ball() {
    ball_move = {x: 20 , y:10};
    x_speed = 4;
    y_speed = 2; 
}


// ~~~PADDLE~~~
//size of paddles
const paddle_width = 5;
const paddle_height = 30;
const paddle_offset = 10;
// paddle offset from top of canvas
var left_paddle_top = 30;
var right_paddle_top = 30;

paddle_speed = 1.918;

function track_ball() {
    //create condensed ball that is only the top and bottom
    var ball = {
        top: ball_move.y,
        bottom: ball_move.y + ball_size
    }
    //create condensed left paddle that is only the top and bottom
    var left_paddle = {
        top: left_paddle_top,
        bottom: left_paddle_top + paddle_height
    }

    if (ball.top < left_paddle.top) {
        left_paddle_top -= paddle_speed;
    }
    if (ball.bottom > left_paddle.bottom) {
        left_paddle_top += paddle_speed;
    }
}

// ~~~Score~~~

//left and right score variables
var left_score = 0;
var right_score = 0;
var game_over = false;

function update_score() {
    //draw score
    ctx.font = "30px monospace";
    ctx.textAlign ="left";
    ctx.fillText(left_score.toString(),50,50);
    ctx.textAlign ="right";
    ctx.fillText(right_score.toString(),width - 50,50);

    if (game_over) {
    ctx.fillStyle = "white";
    ctx.font = "30px monospace"
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER",width/2,height/2);
    }
    
}


// ~~~Gameplay~~~
// collisions
//ball collisions
function ball_collide() {
    //creates local object that indicates the location of the sides of the ball
    var ball = { 
        left: ball_move.x,
        right: ball_move.x + ball_size,
        top: ball_move.y,
        bottom: ball_move.y + ball_size
    }

    var left_paddle = { //indicates location of left paddle
        left:paddle_offset,
        right:paddle_offset + paddle_width,
        top: left_paddle_top,
        bottom: left_paddle_top + paddle_height
    }

    
    var right_paddle = {  //indicates location of right paddle
        left:width - paddle_offset - paddle_width,
        right:width - paddle_offset,
        top:right_paddle_top,
        bottom:right_paddle_top + paddle_height
    }

    //if ball collides with left/right edge of play area
    if (ball.left < 0 || ball.right > width) {
        x_speed = -x_speed;//reverse direction
        init_ball();
        //if strike left wall, increase right score, otherwise increment left score
        ball.left < 0 ? right_score++ : left_score++;

        if (left_score == 10 || right_score == 10) {
            game_over = true;
        }

    }
    //if ball collides with top/bottom edge of play area
    if (ball.top <0 || ball.bottom > height) {
        y_speed = -y_speed;//reverse direction
    }
    if (paddle_collide(ball,left_paddle)) { //left paddle collide
        let distance_from_top = ball.top - left_paddle_top;
        let distance_from_bottom = left_paddle.bottom - ball.bottom;
        adjust_angle(distance_from_top,distance_from_bottom);
        x_speed = Math.abs(X_speed);
    }
    if (paddle_collide(ball,right_paddle)) { //right paddle collide 
        let distance_from_top = ball.top - left_paddle_top;
        let distance_from_bottom = left_paddle.bottom - ball.bottom;
        adjust_angle(distance_from_top,distance_from_bottom);
        x_speed = Math.abs(X_speed);
    }



    
}

function adjust_angle(distance_from_top, distance_from_bottom) {
    if(distance_from_top < 0) {
        //if ball hits near top of paddle, reduce y speed
        y_speed -= 0.5;
    }else if (distance_from_bottom < 0) {
        //if ball hit near bottom of paddle, increase y speed
        y_speed += 0.5;
    };
}


function paddle_collide(chk_ball,chk_paddle) {

    if (chk_ball.left < chk_paddle.right && chk_ball.right> chk_paddle.left && chk_ball.top < chk_paddle.bottom && chk_ball.bottom > chk_paddle.top) {
        x_speed = -x_speed
    } 

}

//draws the current state of canvas
function draw() {

    // build play area
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    //draw/redraw ball
    ctx.fillStyle = "white";
    ctx.fillRect(ball_move.x,ball_move.y,ball_size,ball_size);
    //draw/redraw paddles
    ctx.fillRect(paddle_offset,left_paddle_top,paddle_width,paddle_height);//left
    ctx.fillRect((width - paddle_offset - paddle_width),right_paddle_top,paddle_width,paddle_height);//right
    update_score();
}
//update the ball's current xy coordinate
function update_ball() {
    ball_move.x += x_speed;
    ball_move.y += y_speed;
}

//main game loop
init_ball();
function game_loop() {
    if (!game_over) {
        ball_collide();
        track_ball();
        setTimeout(game_loop, 30);
    }
    update_ball();
    draw();

}


//right paddle movement
document.addEventListener("mousemove",(event) => {

    right_paddle_top = event.offsetY;

})



// call main loop to start the game

game_loop();

