/*** Global Variables ***/

/////////////

var canvas;
var gl;

var vNormal;
var vPosition;

/*** Movement ***/
var lastMouseX = 0;
var lastMouseY = 0;
var mousedown_flag = 0;
var rotationX = 0;
var rotationY = 0;

var keysPressed = [];

// Player position
var initPlayerX = 0.0;
var initPlayerY = 1.5;
var initPlayerZ = 0.0;
var playerPos = vec3(initPlayerX, initPlayerY, initPlayerZ);

var bulletsArray = [];
var bulletCount = 0;

var enemyBulletsArray = [];
var enemyBulletCount = 0;

var enemiesArray = [];
var enemyCount = 0;
//////////////////////////////////////

/*** GL buffers ***/
// Cube
var cubeVertices = [
	vec4( -0.5, -0.5,  0.5, 1.0 ),
	vec4( -0.5,  0.5,  0.5, 1.0 ),
	vec4(  0.5,  0.5,  0.5, 1.0 ),
	vec4(  0.5, -0.5,  0.5, 1.0 ),
	vec4( -0.5, -0.5, -0.5, 1.0 ),
	vec4( -0.5,  0.5, -0.5, 1.0 ),
	vec4(  0.5,  0.5, -0.5, 1.0 ),
	vec4(  0.5, -0.5, -0.5, 1.0 )
];

var cubeGlobalNormals = [
	vec4( -0.5, -0.5,  0.5, 0.0 ),
	vec4( -0.5,  0.5,  0.5, 0.0 ),
	vec4(  0.5,  0.5,  0.5, 0.0 ),
	vec4(  0.5, -0.5,  0.5, 0.0 ),
	vec4( -0.5, -0.5, -0.5, 0.0 ),
	vec4( -0.5,  0.5, -0.5, 0.0 ),
	vec4(  0.5,  0.5, -0.5, 0.0 ),
	vec4(  0.5, -0.5, -0.5, 0.0 )
];

var cube_pointsArray = [];
var cube_normalsArray = [];
var sphere_pointsArray = [];
var sphere_normalsArray = [];

var cube_vBuffer;
var cube_nBuffer;
var sphere_vBuffer;
var sphere_nBuffer;

var sphere_numVertices = 0;

//textures
var texNum;
var texNumLoc;

var cube_textureArray = [];
var cube_tBuffer;

var sphere_textureArray = [];
var sphere_tBuffer;

var texCoord = [
	vec2(0, 0),
	vec2(0, 1),
	vec2(1, 1),
	vec2(1, 0)
];

function generateCube()
{
	cubeFace(1, 0, 3, 2);
	cubeFace(2, 3, 7, 6);
	cubeFace(3, 0, 4, 7);
	cubeFace(6, 5, 1, 2);
	cubeFace(4, 5, 6, 7);
	cubeFace(5, 4, 0, 1);
}

function cubeFace(a, b, c, d)
{
	cube_pointsArray.push(cubeVertices[a]);
	cube_pointsArray.push(cubeVertices[b]);
	cube_pointsArray.push(cubeVertices[c]);
	cube_pointsArray.push(cubeVertices[a]);
	cube_pointsArray.push(cubeVertices[c]);
	cube_pointsArray.push(cubeVertices[d]);
	
	cube_normalsArray.push(cubeGlobalNormals[a]);
	cube_normalsArray.push(cubeGlobalNormals[b]);
	cube_normalsArray.push(cubeGlobalNormals[c]);
	cube_normalsArray.push(cubeGlobalNormals[a]);
	cube_normalsArray.push(cubeGlobalNormals[c]);
	cube_normalsArray.push(cubeGlobalNormals[d]);
	
	cube_textureArray.push(texCoord[0]);
	cube_textureArray.push(texCoord[1]);
	cube_textureArray.push(texCoord[2]);
	cube_textureArray.push(texCoord[0]);
	cube_textureArray.push(texCoord[2]);
	cube_textureArray.push(texCoord[3]);
}

function createCubeBuffers()
{
	cube_vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cube_vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(cube_pointsArray), gl.STATIC_DRAW);
	
	cube_nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cube_nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(cube_normalsArray), gl.STATIC_DRAW);
	
	cube_tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cube_tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(cube_textureArray), gl.STATIC_DRAW);
}

// Sphere
function generateSphere()
{
	var va = vec4(0.0, 0.0, -1.0, 1.0);
	var vb = vec4(0.0, 0.942809, 0.333333, 1.0);
	var vc = vec4(-0.816497, -0.471405, 0.333333, 1.0);
	var vd = vec4(0.816497, -0.471405, 0.333333, 1.0);
	var n = 4;
	
	divideTriangle(va, vb, vc, n);
	divideTriangle(vd, vc, vb, n);
	divideTriangle(va, vd, vb, n);
	divideTriangle(va, vc, vd, n);
}

function divideTriangle(a, b, c, count) 
{
	if (count > 0) 
	{
		var ab = mix( a, b, 0.5);
		var ac = mix( a, c, 0.5);
		var bc = mix( b, c, 0.5);

		ab = normalize(ab, true);
		ac = normalize(ac, true);
		bc = normalize(bc, true);

		divideTriangle( a, ab, ac, count - 1);
		divideTriangle( ab, b, bc, count - 1);
		divideTriangle( bc, c, ac, count - 1);
		divideTriangle( ab, bc, ac, count - 1);
	}
	else 
	{ 
		triangle( a, b, c );
	}
}

function triangle(a, b, c)
{
	sphere_pointsArray.push(vec4(a[0],a[1], a[2], 1.0));
	sphere_pointsArray.push(vec4(b[0],b[1], b[2], 1.0));
	sphere_pointsArray.push(vec4(c[0],c[1], c[2], 1.0));
 
	sphere_normalsArray.push(vec4(a[0],a[1], a[2], 0.0));
	sphere_normalsArray.push(vec4(b[0],b[1], b[2], 0.0));
	sphere_normalsArray.push(vec4(c[0],c[1], c[2], 0.0));
	
	sphere_textureArray.push(texCoord[0]);
	sphere_textureArray.push(texCoord[0]);
	sphere_textureArray.push(texCoord[0]);
	
	//add number of vertices to the sphere's counter
	sphere_numVertices += 3;
};

function createSphereBuffer()
{
	sphere_nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere_nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere_normalsArray), gl.STATIC_DRAW);
	
	sphere_vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere_vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere_pointsArray), gl.STATIC_DRAW);
	
	sphere_tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere_tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere_textureArray), gl.STATIC_DRAW);
}

////////////////////////////////////////
var aCube;
var aSphere;
var ground;

var NUM_GUNS = 3;
var pistol;
var shotgun;
var rpg;
var mainLight;
var muzzleFlash;

const ARENA_SIZE = 50;

// Colors
var vertexColors = [
    vec4( 0.3, 0.3, 0.3, 1.0 ),  // grey (0)
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (1)
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (2)
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (3)
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (4)
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (5)
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white (6)
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (7)
	vec4( 0.2, 0.2, 0.2, 1.0 ),  // dark grey (8)
];

/*** Lighting matrices ***/
var ambientProduct, diffuseProduct, specularProduct;
var ambientProductLoc, diffuseProductLoc, specularProductLoc;
var lightPositionLoc;
var shininessLoc;

///////////////////////////////////////
var PISTOL = 1;
var SHOTGUN = 2;
var RPG = 3;
var ENEMY_BULLET_TYPE = 4;

var currGun = PISTOL;

///////////////////////////////

var inRecoilAnimation = false;
var inSwitchOutAnimation = false;
var inSwitchInAnimation = false;
var inReloadAnimation = false;
var animationBeginTime;

var pistolShotAudio = document.getElementById('pistolshot');
var shotgunShotAudio = document.getElementById('shotgunshot');
var rpgShotAudio = document.getElementById('rocketshot');
var shellFallingAudio = document.getElementById('shellfalling');
var shotgunReloadAudio = document.getElementById('shotgunreload');
var pistolReloadAudio = document.getElementById('pistolreload');
var rpgReloadAudio = document.getElementById('rpgreload');
var hurtAudio = document.getElementById('hurt');
var catAudio = document.getElementById('cataudio');
var themeAudio = document.getElementById('theme');

themeAudio.play();
///////////////////////////////////////////////

// Perspective projection information
var maxFovy = 120.0
var aspect = 1280/720;
var fovy = 40.0;
var near = 0.2;
var far = 1000.0;

// Initial "camera location"
var initCamX = 0.0;
var initCamY = -1.5;
var initCamZ = 0.0;

// Amount to translate and rotate camera on user input
var translateAmt = 0.1;
var rotateAmt = 1.4;

var prevRenderTime = performance.now();
var prevEnemySpawnTime = performance.now() - 20000;
var diffEnemySpawnTime = 40000;

var prevLightSwitchTime = performance.now();
var diffLightSwitchTime = 400;

// Axes
var xAxis = vec3(1, 0, 0);
var yAxis = vec3(0, 1, 0);
var zAxis = vec3(0, 0, 1);

// Matrices
var viewMatrixLoc, modelViewMatrixLoc, projectionMatrixLoc;
var transMatrix;
var viewMatrix;
var instanceMatrix;
var modelViewMatrix;
var projectionMatrix;
