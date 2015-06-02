//BOXES
var boxArray = [];
var boxCount = 0;

function Box(position, size)
{
	this.position = position;
	this.size = size;
	this.body;
	
	this.boxAmbient = vec4(0.8, 0.9, 1.0, 1.0);
	this.boxDiffuse = vec4(0.8, 0.9, 1.0, 1.0);
	this.boxSpecular = vec4(0.8, 1.0, 1.0, 1.0);
	this.boxShininess = 10.0;
	this.boxNormals = [
		vec4( -0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5, -0.0, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.0, -0.5, 0.0 )
	];
	
	this.createBody = function()
	{
		this.body = new Cube(mult(translate(position), scaleM(2*size[0], 2*size[1], 2*size[2])), 0, this.boxAmbient, 
							this.boxDiffuse, this.boxSpecular, this.boxShininess, true, 1);
		this.body.generateCube();
		this.body.createBuffers();
	}
	
	this.draw = function()
	{
		this.body.bindBuffers();
		this.body.render();
	}
}

function spawnBox(position, size)
{
	// Create a box
	var b = new Box(position, size);
	b.createBody();
	boxArray.push(b);
	boxCount++;
}

function loadLevel()
{
	//center platform
	spawnBox(vec3(0, 7.5, 0), vec3(6, 0.5, 6));
	
	//high platforms
	spawnBox(vec3(-19.5, 5.75, 0), vec3(14, 0.25, 2.5));
	spawnBox(vec3(19.5, 5.75, 0), vec3(14, 0.25, 2.5));
	spawnBox(vec3(0, 5.75, -19.5), vec3(2.5, 0.25, 14));
	spawnBox(vec3(0, 5.75, 19.5), vec3(2.5, 0.25, 14));
	
	//mid platforms
	spawnBox(vec3(-8, 3.75, -8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-8, 3.75, 8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(8, 3.75, -8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(8, 3.75, 8), vec3(2.5, 0.25, 2.5));
	
	//low platforms
	spawnBox(vec3(-13, 1.75, -8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-8, 1.75, -13), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-13, 1.75, 8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-8, 1.75, 13), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(13, 1.75, -8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(8, 1.75, -13), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(13, 1.75, 8), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(8, 1.75, 13), vec3(2.5, 0.25, 2.5));
	
	//center platform guard rails
	spawnBox(vec3(-5.5, 9, -5.5), vec3(0.5, 1, 0.5));
	spawnBox(vec3(-4.5, 8.5, -5.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(-5.5, 8.5, -4.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(-5.5, 9, 5.5), vec3(0.5, 1, 0.5));
	spawnBox(vec3(-4.5, 8.5, 5.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(-5.5, 8.5, 4.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(5.5, 9, -5.5), vec3(0.5, 1, 0.5));
	spawnBox(vec3(4.5, 8.5, -5.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(5.5, 8.5, -4.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(5.5, 9, 5.5), vec3(0.5, 1, 0.5));
	spawnBox(vec3(4.5, 8.5, 5.5), vec3(0.5, 0.5, 0.5));
	spawnBox(vec3(5.5, 8.5, 4.5), vec3(0.5, 0.5, 0.5));
	
	//center platform high columns	
	spawnBox(vec3(-5, 3.5, -5), vec3(1, 3.5, 1));
	spawnBox(vec3(-5, 3.5, 5), vec3(1, 3.5, 1));
	spawnBox(vec3(5, 3.5, -5), vec3(1, 3.5, 1));
	spawnBox(vec3(5, 3.5, 5), vec3(1, 3.5, 1));
	
	//mid platform large supports
	spawnBox(vec3(-8, 1.75, -8), vec3(2.5, 1.75, 2.5));
	spawnBox(vec3(-8, 1.75, 8), vec3(2.5, 1.75, 2.5));
	spawnBox(vec3(8, 1.75, -8), vec3(2.5, 1.75, 2.5));
	spawnBox(vec3(8, 1.75, 8), vec3(2.5, 1.75, 2.5));

	//low platform supports
	spawnBox(vec3(-13, 0.75, -8), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(-8, 0.75, -13), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(-13, 0.75, 8), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(-8, 0.75, 13), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(13, 0.75, -8), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(8, 0.75, -13), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(13, 0.75, 8), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(8, 0.75, 13), vec3(0.25, 0.75, 0.25));
	
	//far mid platforms
	spawnBox(vec3(-36, 4.25, 0), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(36, 4.25, 0), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(0, 4.25, -36), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(0, 4.25, 36), vec3(2.5, 0.25, 2.5));
	
	//far low platforms
	spawnBox(vec3(-34, 1.75, 5), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-34, 1.75, -5), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(34, 1.75, 5), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(34, 1.75, -5), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-5, 1.75, -34), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(-5, 1.75, 34), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(5, 1.75, -34), vec3(2.5, 0.25, 2.5));
	spawnBox(vec3(5, 1.75, 34), vec3(2.5, 0.25, 2.5));
	
	//far low platform supports
	spawnBox(vec3(-34, 0.75, -5), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(-5, 0.75, -34), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(-34, 0.75, 5), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(-5, 0.75, 34), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(34, 0.75, -5), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(5, 0.75, -34), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(34, 0.75, 5), vec3(0.25, 0.75, 0.25));
	spawnBox(vec3(5, 0.75, 34), vec3(0.25, 0.75, 0.25));
	
	//far mid large boxes
	spawnBox(vec3(-31, 2.75, 0), vec3(2.5, 2.75, 2.5));
	spawnBox(vec3(31, 2.75, 0), vec3(2.5, 2.75, 2.5));
	spawnBox(vec3(0, 2.75, -31), vec3(2.5, 2.75, 2.5));
	spawnBox(vec3(0, 2.75, 31), vec3(2.5, 2.75, 2.5));
	
	//random boxes
	spawnBox(vec3(-36, 2, -37), vec3(1.5, 2, 1.5));
	spawnBox(vec3(-37, 2, 36), vec3(1.5, 2, 1.5));
	spawnBox(vec3(37, 2, -36), vec3(1.5, 2, 1.5));
	spawnBox(vec3(36, 2, 37), vec3(1.5, 2, 1.5));
	
	//corner boxes
	spawnBox(vec3(-48, 0.25, -48), vec3(2, 0.5, 2));
	spawnBox(vec3(-48, 0.25, 48), vec3(2, 0.5, 2));
	spawnBox(vec3(48, 0.25, -48), vec3(2, 0.5, 2));
	spawnBox(vec3(48, 0.25, 48), vec3(2, 0.5, 2));
	
}