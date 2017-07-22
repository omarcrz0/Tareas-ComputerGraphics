
//Global variables that MUST be saved 
var canvas ;
var ctx ;
var currentLoad ;
var sol = 44367 ;
var level ;
var Coords = {
	isDragging: false
}
var selected ;
var objects = []
var img = []

function initListeners()
{
	canvas.addEventListener("mousedown", mouseDown, false) ;
	canvas.addEventListener("mousemove", mouseMove, false) ;
	canvas.addEventListener("mouseup", mouseUp, false) ;
	// canvas.addEventListener("touchstart", test, false) ;
} 

// function test(event)
// {
// 	insertRect(200,200,200,300) ;
// }
function init() {
	canvas = document.getElementById("canvas") 
	ctx = canvas.getContext("2d") ;

	initListeners() ;

	mainMenu() ;
	currentLoad = "mainMenu";
	// // difficultySelect() ;
	// // currentLoad = "difficultySelect" ;

	// addFigures() ;

	// currentLoad = "Level";

	var source = ["imgs/Levels/Level1.png", "imgs/extra/wood.jpg", "imgs/extra/rotate.jpg"] ;
	
    for(i = 0; i <source.length;i++)
    {
    img[i] = new Image() ;
    img[i].onload = function() {

        } ;
    }

    for(i =0 ; i < source.length ; i++) 
    {
        img[i].src = source[i];
    } 
	
	
	// window["lala"]() ;
}

function mouseDown(event)
{

	
	if(currentLoad == "mainMenu")
	{
		clickMenu(event) ;

	}
	else if(currentLoad == "Instructions")
	{

	}
	else if(currentLoad == "difficultySelect") 
	{

		clickDifficulty(event) ;

	}
	else if(currentLoad == "Level") 
	{
		clickLevel(event) ;
	}
}

function clickMenu(event){
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;
	if(isInsideEllipse(150,75, x, y,canvas.width/2, canvas.height/2 +30 ))
		difficultySelect() ;
}
function clickDifficulty(event) {
	
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;
	if(isInsideEllipse(75,30, x, y,100, 50 ))
		mainMenu() ;

	if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4+40))
	{
		addFigures() ;
		level = 1 ; 	
		Level() ;
	}
	else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*2+40))
	{
		addFigures() ;
		level = 2;
		Level() ;
	}
	else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*3+40))
	{
		addFigures() ;
		level = 3;
		Level() ;
	}	
}


	
function mouseUp(event)
{

	if(currentLoad == "Level") 
	{
		if(Coords.isDragging)
		{

			Coords.isDragging = false; 
			canvasPos = canvas.getBoundingClientRect() ;
			x = event.clientX - canvasPos.left ;
			y = event.clientY - canvasPos.top ;
			x = x - Coords.dragCoord[0][0] ; 
			y = Coords.dragCoord[0][1] - y  ;

			//Grid idea for X
			if(objects[selected].type == "rectangle"&&objects[selected].info == 1)
			{
				objects[selected].posX = objects[selected].posX+x ;
				objects[selected].posY = objects[selected].posY-y ;
			}

			else
			{
				if((objects[selected].posX+x)%10 > 5) 
					objects[selected].posX = Math.ceil(((objects[selected].posX+x)/10))*10
				else
					objects[selected].posX= Math.floor(((objects[selected].posX+x)/10))*10

				//Grid idea for Y
				if((objects[selected].posY-y)%10 > 5) 
					objects[selected].posY = Math.ceil(((objects[selected].posY-y)/10))*10 ;
				else
					objects[selected].posY = Math.floor(((objects[selected].posY-y)/10))*10 ;
			}

			Level() ;
			
			console.log("\nSolution") ;
			for(i =0 ; i < objects.length; i++)
				console.log(objects[i].posX, objects[i].posY, objects[i].type, objects[i].rot*180/Math.PI, objects[i].info) ;

				var data = ctx.getImageData(0,0,canvas.width, canvas.height) ;
			var pix = data.data
			
			counter =0 ;
			for(i =0 ; i < pix.length ; i++)
				if(pix[i] == 0 && pix[1+i] == 0&& pix[2+i]==0)
					counter++ ;

			pct = counter/(sol) * 100 
			if (pct< 2)
				alert("lvl completed");  
			console.log(pct )
		}

	}
}

function mouseMove(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	if(currentLoad == "difficultySelect") 
	{

		// // var description = ["The easy challenges include the exact amount of pieces required to draw "]
		// if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4+40))
		// {
		// 	difficultySelect() ;
		// 	getInfoSelector(canvas.width/2-200, canvas.height/4+40)
		// }
		// else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*2+40))
		// {
		// 	difficultySelect() ;
		// 	getInfoSelector(canvas.width/2-200, canvas.height/4*2+40) ;
		// }
		// else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*3+40))
		// {
		// 	difficultySelect() ;
		// 	getInfoSelector(canvas.width/2-200, canvas.height/4*3+40, true) ;
		// }	
	}

	else if(currentLoad == "Level") 
	{
		if(Coords.isDragging) ;
			relocateFig(x,y) ;//
		
	}	

}

function drawGeo(geo,stroke,x,y) {


	if(x == undefined)
	{
		x = 0 ; 
		y = 0 ;
	}
	if(geo.type == "rectangle") 
		// insertRect(geo.posX,geo.posY, geo.pixX, geo.pixY, geo.color, geo.skewX, geo.skewY, geo.rot) ;
		insertRectV2(geo.vA, geo.vB, geo.vC,geo.vD, geo.color, geo.posX+x, geo.posY-y)

	else if(geo.type == "triangle") 
		insertTriangle(geo.vA, geo.vB, geo.vC, geo.color, geo.posX+x, geo.posY-y,stroke)  ;

}

function clickLevel(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Click dificult select
	if(isInsideEllipse(40,18, x, y,50, 30 ))
	{
		difficultySelect() ;
		objects = [] ;
		return ;
	}

	else if(isInsideRectangle(300,200,50,50,x,y) && selected != undefined)
	{
		objects[selected].setRot(45) ;
		
	}
		else if(isInsideRectangle(100,200,50,50,x,y) && selected != undefined)
	{
		objects[selected].setRot(-45) ;
		
	
	}

	for(let i  = 0; i < objects.length;i++)
	{
		let object = objects[i] ;
	//Check if any piece has been clicked (triangles) 
		if(object.type == "triangle" && isInsideTriangle(object.getVertexPos(object.vA, object.posX,object.posY),
							object.getVertexPos(object.vB, object.posX,object.posY),
							object.getVertexPos(object.vC, object.posX,object.posY) ,x,y)) 
		{
			selected = i ;
			Coords.isDragging = true ;
			Coords.dragCoord= [[x,y]]
			return ;
		}
	

		else if(object.type == "rectangle" && isInsideRectangleV2(object,x ,y))
		{
			selected = i ;
			Coords.isDragging = true ;
			Coords.dragCoord = [[x,y]]
			return ;
		}
		
	}

	Level() ;

}



function addFigures() {

	var sideA = 80 ;
	var sideB = 100 ;

	objects.push(new Triangle([0,0], [sideA,sideA],[0,sideA],600,350, "green", 0,1)) ;
	objects[0].setRot(90) ;
 	objects.push(new Triangle([0,0], [sideA,sideA],[0,sideA],520,480, "green", 0,1)) ;

 	objects.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],770,460, "red" , 0,2)) ;
  
 	objects.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 640, 560, "orange", 0,3)) ;
 	objects[3].setRot(180)
 	objects.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,640, 350,"orange", 0,3) );


 	objects.push(new Rectangle(520,580,sideA,sideA,"yellow", 0, 0,0,1)) ;
 	objects.push(new Rectangle(690, 580, sideA, sideA, "blue", 0,-1,0,2)) ; 

 


}

function setFigures(x,y) {

	for(let i =0; i < objects.length; i++)
	{
		if( x == undefined )
		{
			x = 0 ;
			y = 0 ;
		}
		if(i != selected)
			drawGeo(objects[i],false) ;
	}

	//if a figure has been selected, relocate it's position based on mouse coords
	if(selected != undefined) 
		drawGeo(objects[selected],false, x,y) ;
}

function relocateFig(x,y) 
{
	if(Coords.isDragging)
	{

		x = x - Coords.dragCoord[0][0] ; 
		y = Coords.dragCoord[0][1] - y  ;
		
		Level(x,y) ;
	}
}


function Level(x,y)
{
	//Reset canvas, add background color 
	currentLoad = "Level" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0,0,1,0,0) ; 

	ctx.drawImage(img[1],0,0, canvas.width, canvas.height) ;
	// drawGrid(15,15) ;
	// addTitle(480,10) ;
	insertEllipse(50, 30 , 40,18, 0, 0, 2*Math.PI, true, "#64EC42", "Level Select", false,0,5,"10", "black" ) ;

	insertRect(300,200, 50,50, "blue") ;

	insertRect(100,200, 50,50, "green" );
	// ctx.drawImage(img[2], 0,0,50,50)
	
	window["solution"+level.toString()]() ; 

	setFigures(x,y) ;

}


function solution1()
{

	var sideA = 80 ;
	var sideB = 100 ;
	var sol = []

	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],150,600, "black", 0))
	sol[0].setRot(90)
	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],330,620, "black", 0))
	sol.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],280,570, "black" , 0,2)) ;
	sol[2].setRot(270) ;
	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 340, 530, "black", 0,3)) ;
	sol[3].setRot(180) ;
 	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,280, 470,"black", 0,3) );
	sol.push(new Rectangle(340,320,sideA,sideA,"black", 0, 0,0,1)) ;
	sol[5].setRot(45) ;
 	sol.push(new Rectangle(180, 570, sideA, sideA, "black", 0,-1,0,2)) ; 


 	for(i =0 ; i < sol.length; i++)
 		drawGeo(sol[i], true) 
 	
}

function solution2()
{
	var sideA = 80 ;
	var sideB = 100 ;
	var sol = []

	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],250,760, "black", 0))
	sol[0].setRot(270)
	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],480,670, "black", 0))
	sol[1].setRot(180)
	sol.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],290,720, "black" , 0,2)) ;
	sol[2].setRot(180) ;
	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 380, 430, "black", 0,3)) ;
	sol[3].setRot(45) ;
 	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,290, 620,"black", 0,3) );
	sol[4].setRot(-135)
	sol.push(new Rectangle(320,300,sideA,sideA,"black", 0, 0,0,1)) ;
	sol[5].setRot(45) ;
 	sol.push(new Rectangle(240, 430, sideA, sideA, "black", 0,-1,0,2)) ; 
 	sol[6].setRot(45)

 	for(i =0 ; i < sol.length; i++)
 		drawGeo(sol[i], true) 
 	
}

function solution3()
{
	var sideA = 80 ;
	var sideB = 100 ;
	var sol = []

	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],180,540, "black", 0))
	sol[0].setRot(90)
	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],240,600, "black", 0))
	sol[1].setRot(0)
	sol.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],260,400, "black" , 0,2)) ;
	sol[2].setRot(180) ;
	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 280, 430, "black", 0,3)) ;
	sol[3].setRot(315) ;
 	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,280, 500,"black", 0,3) );
	sol[4].setRot(45)
	sol.push(new Rectangle(340,320,sideA,sideA,"black", 0, 0,0,1)) ;
	sol[5].setRot(45) ;
 	sol.push(new Rectangle(380, 470, sideA, sideA, "black", 0,-1,0,2)) ; 
 	sol[6].setRot(0)

 	for(i =0 ; i < sol.length; i++)
 		drawGeo(sol[i], true) 
 	
}
