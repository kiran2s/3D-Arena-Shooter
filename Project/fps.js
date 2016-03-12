function createMainLight()
{
	var lightPosition = vec4(0.0, 1000.0, 0.0, 1.0);
	var lightPositionArray = [lightPosition, lightPosition, lightPosition];
	var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
	var lightDiffuse = vec4(0.8, 0.7, 0.8, 1.0);
	var lightDiffuseArray = [lightDiffuse, vec4(0,0,0,1), vec4(0,0,0,1)];//+
	var lightSpecular = vec4(1.0, 0.8, 0.1, 1.0);
	var lightSpecularArray = [lightSpecular, vec4(0.0, 0.0, 0.0, 1), vec4(0.0, 0.0, 0.0, 1)];
	mainLight = new Light(lightPositionArray, lightAmbient, lightDiffuseArray, lightSpecularArray);
}

function createCube()
{
	var cubeAmbient = vec4(0.0, 1.0, 1.0, 1.0);
	var cubeDiffuse = vec4(0.0, 1.0, 1.0, 1.0);
	var cubeSpecular = vec4(1.0, 1.0, 1.0, 1.0);
	var cubeShininess = 10.0;
	var cubeNormals = [
		vec4( -0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5, -0.0, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.0, -0.5, 0.0 )
	];
	
	aCube = new Cube(mult(translate(0.0, 1.0, -5.0), scaleM(2.0, 2.0, 2.0)), cubeNormals, cubeAmbient, 
						cubeDiffuse, cubeSpecular, cubeShininess, true, 0);
	aCube.generateCube();
	aCube.createBuffers();
}

function createSphere()
{
	var instance = translate(0.0, 15.0, 0.0);
	var sphereAmbient = vec4(1.0, 0.5, 0.0, 1.0);
	var sphereDiffuse = vec4(1.0, 0.5, 0.0, 1.0);
	var sphereSpecular = vec4(0.9, 0.9, 0.9, 1.0);
	var sphereShininess = 100.0;
	
	aSphere = new Sphere(instance, sphereAmbient, sphereDiffuse, sphereSpecular, sphereShininess);
}

function createGuns()
{
	pistol = new Pistol();
	shotgun = new Shotgun();
	rpg = new Rpg();
}

function createGround()
{
	var cubeAmbient = vec4(1.0, 1.0, 1.0, 1.0);
	var cubeDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
	var cubeSpecular = vec4(1.0, 1.0, 1.0, 1.0);
	var cubeShininess = 10.0;
	var instance = mult(translate(0.0, -0.5, 0.0), scaleM(100, 1, 100));
	
	ground = new Cube(instance, 0, cubeAmbient, cubeDiffuse, cubeSpecular, cubeShininess, true, 2);
	ground.generateCube();
	ground.createBuffers();
}

function spawnEnemy(spawnLoc)
{
	// Create an enemy
	var e = new Enemy(spawnLoc);
	e.createBody();
	enemiesArray.push(e);
	enemyCount++;
}

window.onload = function init()
{
	canvas = document.getElementById("gl-canvas");
	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
	
	// Set WebGL viewport
	gl.viewport(0, 0, canvas.width, canvas.height);
	// Set color to clear to to be blue
	gl.clearColor(0.0, 0.75, 1.0, 1.0);
	
	// Enable z-buffer
	gl.enable(gl.DEPTH_TEST);
	
	// Initialize shaders
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	
	/*******************************************/
	
	// Generate a generic cube
	generateCube();
	// Create buffers for cubes
	createCubeBuffers();
	
	// Generate a generic sphere
	generateSphere();
	// Create vertex and normal buffers for spheres
	createSphereBuffer();
	
	// Create an enemy
	var e = new Enemy();
	
	// Set initial view position
	viewMatrix = translate(initCamX, initCamY, initCamZ);
	
	// Vertex normal variable to be sent to shader
	vNormal = gl.getAttribLocation(program, "vNormal");
	gl.enableVertexAttribArray(vNormal);
    
	// Vertex position variable to be sent to shader
	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.enableVertexAttribArray(vPosition);
	
	// Texture coordinate variable to be sent to shader
	vTexCoord = gl.getAttribLocation(program, "vTexCoord");
	gl.enableVertexAttribArray(vTexCoord);
	
	// Get locations of uniform variables in shader.
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program, "specularProduct");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
	
	muzzleFlash = gl.getUniformLocation (program, "muzzleFlash"); 
	gl.uniform1i (muzzleFlash, 0);
	
	// Create ground
	createGround();
	
	// Create the main light of the world
	createMainLight();

	// Create guns
	createGuns();
	
	// Create a sphere in the world
	createSphere();
	
	//create a square for the ui
	bindsquareVertexBuffer();
	
	// Create all terrain boxes
	loadLevel();
	
	/*** Movement ***/
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
	
	document.onmousemove = handleMouseMove;
	document.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	
	/*** TEXTURES ***/
	var img_metal = document.getElementById("img_metal");
	var img_grass = document.getElementById("img_grass");
	var img_cat = document.getElementById("img_cat");
	
	var texMetal, texGrass, texCat;
	
	texMetal = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texMetal);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img_metal);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	
	texGrass = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texGrass);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img_grass);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	
	texCat = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texCat);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img_cat);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	
	//assign texture objects, connect to samplers in fragment shader
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texMetal);
	gl.uniform1i(gl.getUniformLocation(program, "tex_metal"), 0);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texGrass);
	gl.uniform1i(gl.getUniformLocation(program, "tex_grass"), 1);
	
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texCat);
	gl.uniform1i(gl.getUniformLocation(program, "tex_cat"), 2);
	
	texNumLoc = gl.getUniformLocation(program, "texNum");
	
	//don't render.  obviously.
	render();
}

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Send the projection and view matrices to the shaders
	projectionMatrix = perspective(fovy, aspect, near, far);
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
	var currRenderTime = performance.now();
	var diffTime = currRenderTime - prevRenderTime;
	var currTranslateAmt = (60 * diffTime * translateAmt) / 1000;
	prevRenderTime = currRenderTime;
	
	var diffEnemyTime = currRenderTime - prevEnemySpawnTime;
	if (diffEnemyTime > diffEnemySpawnTime)
	{
		if (diffEnemySpawnTime > 20000)
			diffEnemySpawnTime -= 2000;
		spawnEnemy(vec3(-48.0, 2.0, -48.0));
		spawnEnemy(vec3(-48.0, 2.0, 48.0));
		spawnEnemy(vec3(48.0, 2.0, -48.0));
		spawnEnemy(vec3(48.0, 2.0, 48.0));
		prevEnemySpawnTime = performance.now();
	}

	var diffLightTime = currRenderTime - prevLightSwitchTime;
	if (diffLightTime > diffLightSwitchTime)
	{
		mainLight.position[1] = mainLight.position[0];
		mainLight.diffuse[1] = vec4(0,0,0,1);
		mainLight.specular[1] = vec4(0,0,0,1);
		prevLightSwitchTime = performance.now();
	}
	else if (diffLightTime > diffLightSwitchTime/2) //when it starts to rapdily decay time
	{
		mainLight.diffuse[1] = vec4(mainLight.diffuse[1][0]/1.1, mainLight.diffuse[1][1]/1.1, mainLight.diffuse[1][2]/1.1, 1);
		mainLight.specular[1] = vec4(mainLight.specular[1][0]/1.1, mainLight.specular[1][1]/1.1, mainLight.specular[1][2]/1.1, 1);
	}
	
	
	if ((keysPressed[87] == 1 && keysPressed[65] == 1) || (keysPressed[87] == 1 && keysPressed[68] == 1) 
		|| (keysPressed[83] == 1 && keysPressed[65] == 1) || (keysPressed[83] == 1 && keysPressed[68] == 1))
	{
		currTranslateAmt /= 1.414;
	}
	
	
	// Switch weapons
	if (keysPressed[70] == 1) // F
	{
		if (!inSwitchOutAnimation && !inSwitchInAnimation && !inReloadAnimation)
		{
			inRecoilAnimation = false;
			inSwitchOutAnimation = true;
			inSwitchInAnimation = false;
			animationBeginTime = performance.now();
		}
	}
	// Reload
	if (keysPressed[82] == 1) // R
	{
		if (!inSwitchOutAnimation && !inSwitchInAnimation && !inReloadAnimation)
		{
			if ((currGun == PISTOL && pistol.currAmmo < pistol.ammoCapacity) || 
				(currGun == SHOTGUN && shotgun.currAmmo < shotgun.ammoCapacity) || 
				(currGun == RPG && rpg.currAmmo < rpg.ammoCapacity))
			{
				inRecoilAnimation = false;
				inSwitchOutAnimation = false;
				inSwitchInAnimation = false;
				inReloadAnimation = true;
				if (currGun == PISTOL)
				{
					//playReloadAudio();
				}
				else if (currGun == SHOTGUN)
				{
					playReloadAudio();
				}
				//else
					//rpg.currAmmo = rpg.ammoCapacity;
				animationBeginTime = performance.now();
			}
		}
	}
	
	// Determine the view matrix, altered by user input
	// Save current position before updating
	var prevPos = vec3(playerPos[0], playerPos[1], playerPos[2]);
	
	// Determine the view matrix, altered by user input
	// Move forward
	if (keysPressed[87] == 1) // W
	{
		viewMatrix = mult(translate(0, 0, currTranslateAmt), viewMatrix);
		var yRotation = rotate_y_axis(vec3( 0, 0, -currTranslateAmt), rotationY);
		playerPos = add (yRotation, playerPos);
	}
	// Move back
	if (keysPressed[83] == 1) // S
	{
		viewMatrix = mult(translate(0, 0, -currTranslateAmt), viewMatrix);
		var yRotation = rotate_y_axis(vec3( 0, 0, currTranslateAmt), rotationY);
		playerPos = add (yRotation, playerPos);
	}
	// Move left
	if (keysPressed[65] == 1) // A
	{
		viewMatrix = mult(translate(currTranslateAmt, 0, 0), viewMatrix);
		var yRotation = rotate_y_axis(vec3( -currTranslateAmt, 0, 0), rotationY);
		playerPos = add (yRotation, playerPos);
	}
	// Move right
	if (keysPressed[68] == 1) // D
	{
		viewMatrix = mult(translate(-currTranslateAmt, 0, 0), viewMatrix);
		var yRotation = rotate_y_axis(vec3( currTranslateAmt, 0, 0), rotationY);
		playerPos = add (yRotation, playerPos);
	}
	//Jump
	var justJumped = false;
	if (keysPressed[32] == 1) //space
	{
		if (!inAir)
		{
			yVel -= JUMP_VEL;
			inAir = true;
			justJumped = true;
		}
	}
	//Update y position, correct for ground
    yVel += g;
	if (playerPos[1] <= initPlayerY && !justJumped)
	{
        inAir = false;
		viewMatrix = mult(translate(0, playerPos[1] - initPlayerY, 0), viewMatrix);
        playerPos[1] = initPlayerY;
        yVel = 0;
    }
	viewMatrix = mult(translate(vec3(0, yVel, 0)), viewMatrix);
	playerPos[1] -= yVel;
	
	if (keysPressed[76] == 1)
	{
		console.log(playerPos);
	}
	
	//Get collision flags: left, right, bottom, top, back, front
	var collisions = getCollisions(vec3(playerPos[0], playerPos[1], playerPos[2]), vec3(prevPos[0], prevPos[1], prevPos[2]), PLAYER_DIMENSIONS, boxArray);

	if (collisions[0] != 0)
	{
		viewMatrix = mult(translate(collisions[0] * Math.cos(radians(rotationY)), 0, collisions[0] * Math.sin(radians(rotationY))), viewMatrix);
		playerPos[0] -= collisions[0];
	}
	if (collisions[1] != 0)
	{
		viewMatrix = mult(translate(collisions[1] * Math.cos(radians(rotationY)), 0, collisions[1] * Math.sin(radians(rotationY))), viewMatrix);
		playerPos[0] -= collisions[1];
	}
	if (collisions[2] != 0)
	{
		viewMatrix = mult(translate(vec3(0, collisions[2], 0)), viewMatrix);
		playerPos[1] -= collisions[2];
		yVel = 0;
	}
	if (collisions[3] != 0)
	{
		viewMatrix = mult(translate(vec3(0, collisions[3], 0)), viewMatrix);
		playerPos[1] -= collisions[3];
		yVel = 0;
		inAir = false;
	}
	if (collisions[4] != 0)
	{
		viewMatrix = mult(translate(collisions[4] * -Math.sin(radians(rotationY)), 0, collisions[4] * Math.cos(radians(rotationY))), viewMatrix);
		playerPos[2] -= collisions[4];
	}
	if (collisions[5] != 0)
	{
		viewMatrix = mult(translate(collisions[5] * -Math.sin(radians(rotationY)), 0, collisions[5] * Math.cos(radians(rotationY))), viewMatrix);
		playerPos[2] -= collisions[5];
	}
	
	//Get collisions with enemies
	var enemyCollisions = getCollisions(vec3(playerPos[0], playerPos[1], playerPos[2]), vec3(prevPos[0], prevPos[1], prevPos[2]), PLAYER_DIMENSIONS, enemiesArray);
	for (var q = 0; q < 6; q++)
	{
		if (enemyCollisions[q] != 0)
		{
			//console.log("GET REKT M8");
		}
	}

	// Send view matrix to shaders
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mult(rotate(-rotationX, xAxis), viewMatrix)));
	
	// Render the ground
	ground.bindBuffers();
	ground.render();
	
	// Render a sphere for perspective
	aSphere.bindBuffers();
	aSphere.render();
	
	var hit;
	
	// Draw bullets and check if bullets collided with anything
	for (var i = 0; i < bulletCount; i++)
	{
		hit = false;
		bulletsArray[i].drawBullet();
		if (bulletsArray[i].muzzleFlash == 1)
		{
			mainLight.position[2] = vec4(bulletsArray[i].point, 1);
			mainLight.diffuse[2] = vec4(1, 1, 1, 1.0);
			mainLight.specular[2] = mainLight.specular[0];
			bulletsArray[i].muzzleFlash = 0;
		}
		else
		{
			mainLight.diffuse[2] = vec4(mainLight.diffuse[2][0]/2, mainLight.diffuse[2][1]/2, mainLight.diffuse[2][2]/2, 1);
			mainLight.specular[2] = vec4(mainLight.specular[2][0]/2, mainLight.specular[2][1]/2, mainLight.specular[2][2]/2, 1);
		}
		
		if (bulletsArray[i].isOutOfBounds() == 1 || bulletsArray[i].hit_by_bullet(vec3(0,1,-5), vec3(1,1,1)) == 1)
		{
			bulletsArray.splice(i,1);
			bulletCount--;
			i--;
		}
		else
		{
			for (var j = 0; j < enemyCount; j++)
			{
				if (bulletsArray[i].hit_by_bullet(enemiesArray[j].position, vec3(enemiesArray[j].size[0], enemiesArray[j].size[1], enemiesArray[j].size[2])) == 1)
				{
					if (bulletsArray[i].type == PISTOL)
					{
						enemiesArray[j].health -= 10;
					}
					else if(bulletsArray[i].type == SHOTGUN) 
					{
						enemiesArray[j].health -= 10;
					}
					else
					{
						enemiesArray[j].health -= 100;
					}
					mainLight.position[1] = vec4(bulletsArray[i].last_point, 1);
					mainLight.diffuse[1] = vec4(1.0, 0.2, 0.0, 1.0);
					mainLight.specular[1] = mainLight.specular[0];
					prevLightSwitchTime = performance.now();
					
					bulletsArray.splice(i,1);
					bulletCount--;
					i--;
					
					if (enemiesArray[j].health <= 0)
					{
						catAudio.pause();
						catAudio.currTime = 1000;
						catAudio.play();
						catAudio.currTime = 1000;
						enemiesArray.splice(j,1);
						enemyCount--;
						j--;
						score++;
					}
					hit = true;
					break;
				}
			}
			if (hit == false)
			{
				for (var k = 0; k < boxCount; k++)
				{
					if (bulletsArray[i].hit_by_bullet(boxArray[k].position, boxArray[k].size) == 1)
					{
						bulletsArray.splice(i,1);
						bulletCount--;
						i--;
						break;
					}
				}
			}
		}
	}
	
	// Draw enemy bullets
	for (var i = 0; i < enemyBulletCount; i++)
	{
		enemyBulletsArray[i].drawEnemyBullet();
		if (enemyBulletsArray[i].hit_by_bullet(playerPos, vec3(1.0, 1.0, 1.0)))
		{
			enemyBulletsArray.splice(i,1);
			enemyBulletCount--;
			i--;
			health_left--;
			flash_red = 1;
			if (health_left >= 0) 
			{
				hurtAudio.pause();
				hurtAudio.currTime = 0;
				hurtAudio.play();
			}
		}
		else if (enemyBulletsArray[i].isOutOfBounds() == 1)
		{
			enemyBulletsArray.splice(i,1);
			enemyBulletCount--;
			i--;
		}
		else
		{
			for (var k = 0; k < boxCount; k++)
			{
				if (enemyBulletsArray[i].hit_by_bullet(boxArray[k].position, boxArray[k].size) == 1)
				{
					enemyBulletsArray.splice(i,1);
					enemyBulletCount--;
					i--;
					break;
				}
			}
		}
	}
	
	// Draw enemies
	for (var i = 0; i < enemyCount; i++)
	{
		enemiesArray[i].updatePosition();
		enemiesArray[i].draw();
	}
	
	// Draw boxes
	for (var i = 0; i < boxCount; i++)
	{
		boxArray[i].draw();
	}
	
	// Render the player's gun
	gl.uniform1i (muzzleFlash, 1);
	if (currGun == PISTOL)
	{
		pistol.render();
	}
	else if (currGun == SHOTGUN)
	{
		shotgun.render();
	}
	else if (currGun == RPG)
	{
		rpg.render();
	}
	gl.uniform1i (muzzleFlash, 0);
	
	//draw health bars for ui
	if (flash_red != 0)
	{
		flash_red += diffTime;
		if (flash_screen(flash_red, 250) == 0)
			flash_red = 0;
		drawHealthBar(0.1*Math.sin(flash_red/50),0.05*Math.cos(flash_red/50));
	}
	else
	{
		drawHealthBar(0,0);
	}
	if (currGun == PISTOL)
	{
		draw_pistol_crosshair();
	}
	else if (currGun == SHOTGUN)
	{
		draw_shotgun_crosshair();
	}
	else if (currGun == RPG)
	{
		draw_rpg_crosshair();
	}
	
	if (health_left <= 0)
	{
		red_screen_of_death();
	}
	

	window.requestAnimFrame(render);
}

function playGunFireAudio()
{
	if (health_left <= 0)
	{
		return;
	}
	if (currGun == PISTOL)
	{
		pistolShotAudio.pause();
		pistolShotAudio.currentTime = 0;
		pistolShotAudio.play();
	}
	else if (currGun == SHOTGUN)
	{
		shotgunShotAudio.pause();
		shotgunShotAudio.currentTime = 0;
		shotgunShotAudio.play();
	}
	else if (currGun == RPG)
	{
		rpgShotAudio.pause();
		rpgShotAudio.currentTime = 0;
		rpgShotAudio.play();
	}
}

function playReloadAudio()
{
	if (currGun == PISTOL)
	{
		pistolReloadAudio.pause();
		pistolReloadAudio.currentTime = 0;
		pistolReloadAudio.play();
	}
	else if (currGun == SHOTGUN)
	{
		shotgunReloadAudio.pause();
		shotgunReloadAudio.currentTime = 0;
		shotgunReloadAudio.play();
	}
	else if (currGun == RPG)
	{
		rpgReloadAudio.pause();
		rpgReloadAudio.currentTime = 0;
		rpgReloadAudio.play();
	}
}










