/*** Classes ***/

// Light class
function Light(position, ambient, diffuse, specular)
{
	this.position = position;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
}

// Cube class
function Cube(instanceMatrix, normals, ambient, diffuse, specular, shininess, useViewMatrix, tnum)
{
	this.originalNormalsValue = normals;
	
	this.instanceMatrix = instanceMatrix;
	
	this.normals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	if (normals != 0)
	{
		this.normals = normals;
	}

	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
	this.useViewMatrix = useViewMatrix;
	
	this.normalsArray = [];
	this.nBuffer;
	
	this.numVertices = 36;
	
	this.generateCube = function()
	{
		if (this.originalNormalsValue == 0)
			return;
		this.quad(1, 0, 3, 2);
		this.quad(2, 3, 7, 6);
		this.quad(3, 0, 4, 7);
		this.quad(6, 5, 1, 2);
		this.quad(4, 5, 6, 7);
		this.quad(5, 4, 0, 1);
	};
	
	this.quad = function(a, b, c, d)
	{
		this.normalsArray.push(this.normals[a]);
		this.normalsArray.push(this.normals[b]);
		this.normalsArray.push(this.normals[c]);
		this.normalsArray.push(this.normals[a]);
		this.normalsArray.push(this.normals[c]);
		this.normalsArray.push(this.normals[d]);
	};
	
	this.createBuffers = function()
	{
		if (this.originalNormalsValue == 0)
			return;
		else
		{
			this.nBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW);
		}
	};
	
	this.bindBuffers = function()
	{
		if (this.originalNormalsValue == 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, cube_nBuffer);
			gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);	
		}
		else
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
			gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);	
		}
		
		gl.bindBuffer(gl.ARRAY_BUFFER, cube_vBuffer);
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, cube_tBuffer);
		gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
	};
	
	this.render = function(useViewMatrix)
	{
		// Get lighting matrix products for cube
		ambientProduct = mult(mainLight.ambient, this.ambient);
		var diffuseProductArray=[];
		diffuseProductArray[0] = mult(mainLight.diffuse[0], this.diffuse);//+
		diffuseProductArray[1] = mult(mainLight.diffuse[1], this.diffuse);//+
		diffuseProductArray[2] = mult(mainLight.diffuse[2], this.diffuse);//+
		var specularProductArray=[];
		specularProductArray[0] = mult(mainLight.specular[0], this.specular);//+
		specularProductArray[1] = mult(mainLight.specular[1], this.specular);//+
		specularProductArray[2] = mult(mainLight.specular[2], this.specular);//+
		gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
		gl.uniform4fv(diffuseProductLoc, flatten(diffuseProductArray));
		gl.uniform4fv(specularProductLoc, flatten(specularProductArray));
		gl.uniform1f(shininessLoc, this.shininess);
		gl.uniform4fv(lightPositionLoc, flatten(mainLight.position));
		
		// Position
		if (this.useViewMatrix)
		{
			modelViewMatrix = mult(viewMatrix, this.instanceMatrix);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(rotate(-rotationX, xAxis), modelViewMatrix)));
			//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		}
		else
		{
			var instance = mult(modelViewMatrix, this.instanceMatrix);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instance));
		}
		
		texNum = tnum;
		gl.uniform1i(texNumLoc, texNum);
		
		gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
	};
}

// Sphere class
function Sphere(instanceMatrix, ambient, diffuse, specular, shininess)
{
	this.instanceMatrix = instanceMatrix;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;

	this.bindBuffers = function()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, sphere_nBuffer);
		gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, sphere_vBuffer);
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, sphere_tBuffer);
		gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
	};	
	
	this.render = function()
	{
		// Get lighting matrix products for cube
		ambientProduct = mult(mainLight.ambient, this.ambient);
		var diffuseProductArray=[];
		diffuseProductArray[0] = mult(mainLight.diffuse[0], this.diffuse);
		diffuseProductArray[1] = mult(mainLight.diffuse[1], this.diffuse);
		diffuseProductArray[2] = mult(mainLight.diffuse[2], this.diffuse);
		var specularProductArray=[];
		specularProductArray[0] = mult(mainLight.specular[0], this.specular);
		specularProductArray[1] = mult(mainLight.specular[1], this.specular);
		specularProductArray[2] = mult(mainLight.specular[2], this.specular);//+
		gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
		gl.uniform4fv(diffuseProductLoc, flatten(diffuseProductArray));
		gl.uniform4fv(specularProductLoc, flatten(specularProductArray));
		gl.uniform1f(shininessLoc, this.shininess);
		gl.uniform4fv(lightPositionLoc, flatten(mainLight.position));

		modelViewMatrix = mult(viewMatrix, this.instanceMatrix);
		//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(rotate(-rotationX, xAxis), modelViewMatrix)));
		
		texNum = 0;
		gl.uniform1i(texNumLoc, texNum);
		
		gl.drawArrays(gl.TRIANGLES, 0, sphere_numVertices);
	};
}

function Pistol()
{	
	this.BARREL_WIDTH = 0.05;
	this.BARREL_HEIGHT = 0.05;
	this.BARREL_LENGTH = 0.38;

	this.GRIP_WIDTH = 0.05;
	this.GRIP_HEIGHT = 0.12;
	this.GRIP_LENGTH = 0.05;

	this.SIGHTS_WIDTH = 0.01;
	this.SIGHTS_HEIGHT = 0.02;
	this.SIGHTS_LENGTH = 0.05;
	
	this.recoilAnimationTime = 220;
	this.switchOutAnimationTime = 600;
	this.switchInAnimationTime = 600;
	this.reloadAnimationTime = 2000;
	this.angle = 0;
	
	this.matrixStack = [];
	
	this.barrelAmbient = vec4(0.9, 0.9, 0.9, 1.0);
	this.barrelDiffuse = vec4(0.9, 0.9, 0.9, 1.0);
	this.barrelSpecular = vec4(0.4, 0.4, 0.4, 1.0);
	this.barrelShininess = 10.0;
	
	this.gripAmbient = vec4(0.9, 0.6, 0.125, 1.0);
	this.gripDiffuse = vec4(0.9, 0.6, 0.125, 1.0);
	this.gripSpecular = vec4(0.9, 0.6, 0.125, 1.0);
	this.gripShininess = 40.0;
	
	this.sightsAmbient = vec4(0.9, 0.9, 0.9, 1.0);
	this.sightsDiffuse = vec4(0.4, 0.55, 0.4, 1.0);
	this.sightsSpecular = vec4(1.0, 1.0, 1.0, 1.0);
	this.sightsShininess = 15.0;
	
	this.bulletAmbient = vec4(0.4, 0.4, 0.4, 1.0);
	this.bulletDiffuse = vec4(0.0, 0.0, 0.0, 0.0);
	this.bulletSpecular = vec4(0.4, 0.4, 0.4, 1.0);
	this.bulletShininess = 30.0;
	this.bulletSize = 0.05;
	this.bulletSpeed = 0.85;
	
	this.ammoCapacity = 20;
	this.currAmmo = 20;
	
	this.reloadCube = new Cube(translate(0.0, 0.0, 0.0), 0, vec4(0.0, 0.0, 0.0, 1.0), this.bulletDiffuse, this.bulletSpecular, this.bulletShininess, false, 0);
	this.reloadCube.generateCube();
	this.reloadCube.createBuffers();
	
	this.instance;
	
	this.barrelNormals = [
		vec4( -0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	this.gripNormals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	this.sightsNormals = [
		vec4( -0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5, -0.0, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.0, -0.5, 0.0 )
	];
	
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.barrel = new Cube(this.instance, 0, this.barrelAmbient, this.barrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.barrel.generateCube();
	this.barrel.createBuffers();
	
	this.instance = translate(0.0, 0.5 * this.GRIP_HEIGHT, -0.5 * this.GRIP_LENGTH);
	this.instance = mult(this.instance, scaleM(this.GRIP_WIDTH, this.GRIP_HEIGHT, this.GRIP_LENGTH));
	this.grip = new Cube(this.instance, this.gripNormals, this.gripAmbient, this.gripDiffuse, this.gripSpecular, this.gripShininess, false, 0);
	this.grip.generateCube();
	this.grip.createBuffers();
	
	this.instance = translate(0.0, 0.5 * this.SIGHTS_HEIGHT, -0.5 * this.SIGHTS_LENGTH);
	this.instance = mult(this.instance, scaleM(this.SIGHTS_WIDTH, this.SIGHTS_HEIGHT, this.SIGHTS_LENGTH));
	this.sights = new Cube(this.instance, this.sightsNormals, this.sightsAmbient, this.sightsDiffuse, this.sightsSpecular, this.sightsShininess, false, 0);
	this.sights.generateCube();
	this.sights.createBuffers();
	
	this.render = function()
	{	
		modelViewMatrix = translate(0.13, -0.11, -0.3);
		if (inRecoilAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.recoilAnimationTime)
			{
				shellFallingAudio.play();
				inRecoilAnimation = false;
				this.angle = 0;
			}
			else
			{
				this.angle = 7.5 - 7.5 * (timeDiff / this.recoilAnimationTime);
				modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, this.angle/400));
			}
		}
		else if (inSwitchOutAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.switchOutAnimationTime)
			{
				inSwitchOutAnimation = false;
				inSwitchInAnimation = true;
				animationBeginTime = performance.now();
				currGun++;
				if (currGun > NUM_GUNS)
					currGun = 1;
			}
			else
			{
				this.angle = 80 * (timeDiff / this.switchOutAnimationTime);
			}
		}
		else if (inSwitchInAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.switchInAnimationTime)
			{
				inSwitchOutAnimation = false;
				inSwitchInAnimation = false;
			}
			else
			{
				this.angle = 80 - 80 * (timeDiff / this.switchInAnimationTime);
			}
		}
		else if (inReloadAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.reloadAnimationTime)
			{
				pistol.currAmmo = pistol.ammoCapacity;
				inReloadAnimation = false;
				this.angle = 0;
			}
			else
			{
				if (timeDiff < this.reloadAnimationTime / 4)
				{
					this.angle = 50 * (timeDiff / this.reloadAnimationTime);
					modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.angle/110, -this.angle/150));
				}
				else if (timeDiff < ((2 * this.reloadAnimationTime) / 4))
				{
					pistolReloadAudio.play();
					modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.angle/110, -this.angle/150));
					this.reloadCube.instanceMatrix = mult(modelViewMatrix, translate(-0.03, 0.45 - this.GRIP_HEIGHT - timeDiff/1000, 0.0));
					this.reloadCube.instanceMatrix = mult(this.reloadCube.instanceMatrix, scaleM(this.GRIP_WIDTH, this.GRIP_HEIGHT, this.GRIP_LENGTH));
					this.reloadCube.bindBuffers();
					this.reloadCube.render();
				}
				else if (timeDiff < ((3 * this.reloadAnimationTime) / 4))
				{
					pistolReloadAudio.play();
					modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.angle/110, -this.angle/150));
					this.reloadCube.instanceMatrix = mult(modelViewMatrix, translate(-0.03, -1.4 - this.GRIP_HEIGHT + timeDiff/1000, 0.0));
					this.reloadCube.instanceMatrix = mult(this.reloadCube.instanceMatrix, scaleM(this.GRIP_WIDTH, this.GRIP_HEIGHT, this.GRIP_LENGTH));
					this.reloadCube.bindBuffers();
					this.reloadCube.render();
				}
				else
				{
					this.angle = 50 - 50 * (timeDiff / this.reloadAnimationTime);
					modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.angle/110, -this.angle/150));
				}
			}
		}
		
		if (inSwitchOutAnimation || inSwitchInAnimation)
		{
			modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.3));
		}
		modelViewMatrix = mult(modelViewMatrix, rotate(this.angle, xAxis));
		if (inSwitchOutAnimation || inSwitchInAnimation)
		{
			modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, -0.3));
		}
		
		this.matrixStack.push(modelViewMatrix);
		this.barrel.bindBuffers();
		this.barrel.render();
		
		modelViewMatrix = mult(modelViewMatrix, translate(0.0, -this.GRIP_HEIGHT, 0.0));
		this.grip.bindBuffers();
		this.grip.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.BARREL_HEIGHT, -(this.BARREL_LENGTH - this.SIGHTS_LENGTH)));
		this.sights.bindBuffers();
		this.sights.render();
		modelViewMatrix = this.matrixStack.pop();
	};
}

function Shotgun()
{
	this.BARREL_WIDTH = 0.03;
	this.BARREL_HEIGHT = 0.04;
	this.BARREL_LENGTH = 0.5;

	this.GRIP_WIDTH = 0.055;
	this.GRIP_HEIGHT = 0.18;
	this.GRIP_LENGTH = 0.05;
	
	this.recoilAnimationTime = 700;
	this.switchOutAnimationTime = 1000;
	this.switchInAnimationTime = 1000;
	this.reloadAnimationTime = 700;
	this.angle = 0;
	
	this.matrixStack = [];
	
 	this.barrelAmbient = vec4(1.0, 0.7, 0.125, 1.0);
	this.barrelDiffuse = vec4(1.0, 0.7, 0.125, 1.0);
	this.barrelSpecular = vec4(1.0, 0.7, 0.125, 1.0);
	this.barrelShininess = 15.0;
	
	this.gripAmbient = vec4(0.7, 0.4, 0.1, 1.0);
	this.gripDiffuse = vec4(0.7, 0.4, 0.1, 1.0);
	this.gripSpecular = vec4(0.3, 0.1, 0.0, 1.0);
	this.gripShininess = 30.0;
	
	this.bulletAmbient = vec4(0.4, 0.4, 0.4, 1.0);
	this.bulletDiffuse = vec4(0.0, 0.0, 0.0, 0.0);
	this.bulletSpecular = vec4(0.4, 0.4, 0.4, 1.0);
	this.bulletShininess = 30.0;
	this.bulletSize = 0.04;
	this.bulletSpeed = 0.75;
	
	this.ammoCapacity = 2;
	this.currAmmo = 2;
	
	this.instance;
	
	this.barrelNormals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	this.gripNormals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	// Left barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.leftBarrel = new Cube(this.instance, 0, this.barrelAmbient, this.barrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.leftBarrel.generateCube();
	this.leftBarrel.createBuffers();
	
	// Left barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.rightBarrel = new Cube(this.instance, 0, this.barrelAmbient, this.barrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.rightBarrel.generateCube();
	this.rightBarrel.createBuffers();
	
	// Grip
	this.instance = translate(0.0, -0.5 * this.GRIP_HEIGHT, -0.5 * this.GRIP_LENGTH);
	this.instance = mult(this.instance, scaleM(this.GRIP_WIDTH, this.GRIP_HEIGHT, this.GRIP_LENGTH));
	this.grip = new Cube(this.instance, this.gripNormals, this.gripAmbient, this.gripDiffuse, this.gripSpecular, this.gripShininess, false, 0);
	this.grip.generateCube();
	this.grip.createBuffers();
	
	this.render = function()
	{	
		modelViewMatrix = translate(0.13, -0.11, -0.34);
		if (inRecoilAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.recoilAnimationTime)
			{
				shellFallingAudio.play();
				inRecoilAnimation = false;
				this.angle = 0;
			}
			else
			{
				this.angle = 10 - 10 * (timeDiff / this.recoilAnimationTime);
				modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, this.angle/200));
			}
		}
		else if (inSwitchOutAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.switchOutAnimationTime)
			{
				inSwitchOutAnimation = false;
				inSwitchInAnimation = true;
				animationBeginTime = performance.now();
				currGun++;
				if (currGun > NUM_GUNS)
					currGun = 1;
			}
			else
			{
				this.angle = 100 * (timeDiff / this.switchOutAnimationTime);
			}
		}
		else if (inSwitchInAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.switchInAnimationTime)
			{
				inSwitchOutAnimation = false;
				inSwitchInAnimation = false;
			}
			else
			{
				this.angle = 100 - 100 * (timeDiff / this.switchInAnimationTime);
			}
		}
		else if (inReloadAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.reloadAnimationTime)
			{
				shotgun.currAmmo = shotgun.ammoCapacity;
				inReloadAnimation = false;
				this.angle = 0;
			}
			else
			{
				this.angle = 360 * (timeDiff / this.reloadAnimationTime);
			}
		}
		
		if (inSwitchOutAnimation || inSwitchInAnimation)
		{
			modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.3));
		}
		modelViewMatrix = mult(modelViewMatrix, rotate(this.angle, xAxis));
		if (inSwitchOutAnimation || inSwitchInAnimation)
		{
			modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, -0.3));
		}
		this.matrixStack.push(modelViewMatrix);
		
		modelViewMatrix = mult(modelViewMatrix, translate(-0.7 * this.BARREL_WIDTH, 0.0, 0.0));
		this.leftBarrel.bindBuffers();
		this.leftBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.7 * this.BARREL_WIDTH, 0.0, 0.0));
		this.rightBarrel.bindBuffers();
		this.rightBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.BARREL_HEIGHT, 0.0));
		modelViewMatrix = mult(modelViewMatrix, rotate(-60, xAxis));
		this.grip.bindBuffers();
		this.grip.render();

		modelViewMatrix = this.matrixStack.pop();
	};
}

function Rpg()
{
	this.BACK_BARREL_WIDTH = 0.04;
	this.BACK_BARREL_HEIGHT = 0.04;
	this.BACK_BARREL_LENGTH = 0.25;
	
	this.BARREL_WIDTH = 0.045;
	this.BARREL_HEIGHT = 0.045;
	this.BARREL_LENGTH = 0.6;

	this.GRIP_WIDTH = 0.05;
	this.GRIP_HEIGHT = 0.15;
	this.GRIP_LENGTH = 0.05;
	
	this.recoilAnimationTime = 1500;
	this.switchOutAnimationTime = 1500;
	this.switchInAnimationTime = 1500;
	this.reloadAnimationTime = 4500;
	this.angle = 0;
	
	this.matrixStack = [];
	
	this.barrelAmbient = vec4(0.0, 1.0, 0.875, 1.0);
	this.barrelDiffuse = vec4(0.0, 0.8, 0.7, 1.0);
	this.lowerBarrelDiffuse = vec4(0.0, 0.3, 0.2625, 1.0);
	this.barrelSpecular = vec4(0.0, 0.3, 0.2625, 1.0);
	this.barrelShininess = 15.0;
	
	this.backBarrelAmbient = vec4(1.0, 0.2, 0.0, 1.0);
	this.backBarrelDiffuse = vec4(1.0, 0.2, 0.0, 1.0);
	this.backBarrelSpecular = vec4(0.5, 0.5, 0.5, 1.0);
	this.backBarrelShininess = 10.0;
	
	this.gripAmbient = vec4(0.9, 0.9, 0.9, 1.0);
	this.gripDiffuse = vec4(0.4, 0.55, 0.4, 1.0);
	this.gripSpecular = vec4(1.0, 1.0, 1.0, 1.0);
	this.gripShininess = 15.0;
	
	this.bulletAmbient = vec4(1.0, 0.27, 0.0, 1.0);
	this.bulletDiffuse = vec4(1.0, 0.27, 0.0, 1.0);
	this.bulletSpecular = vec4(1.0, 0.27, 0.0, 1.0);
	this.bulletShininess = 30.0;
	this.bulletSize = 0.2;
	this.bulletSpeed = 0.5;
	
	this.ammoCapacity = 1;
	this.currAmmo = 1;
	
	this.instance;
	this.originalInstance;
	
	this.upperBarrelNormals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	this.lowerBarrelNormals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	this.gripNormals = [
		vec4( -0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5,  0.0,  0.5, 0.0 ),
		vec4(  0.5, -0.5,  0.5, 0.0 ),
		vec4( -0.5, -0.5, -0.5, 0.0 ),
		vec4( -0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5,  0.0, -0.5, 0.0 ),
		vec4(  0.5, -0.5, -0.5, 0.0 )
	];
	
	// Back barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, rotate(45, zAxis));
	this.instance = mult(this.instance, scaleM(this.BACK_BARREL_WIDTH, this.BACK_BARREL_HEIGHT, this.BACK_BARREL_LENGTH));
	this.backBarrel = new Cube(this.instance, 0, this.backBarrelAmbient, this.backBarrelDiffuse, this.backBarrelSpecular, this.backBarrelShininess, false, 0);
	this.backBarrel.generateCube();
	this.backBarrel.createBuffers();
	
	// Left lower barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, rotate(45, zAxis));
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.leftLowerBarrel = new Cube(this.instance, this.lowerBarrelNormals, this.barrelAmbient, this.lowerBarrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.leftLowerBarrel.generateCube();
	this.leftLowerBarrel.createBuffers();
	
	// Right lower barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, rotate(45, zAxis));
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.rightLowerBarrel = new Cube(this.instance, this.lowerBarrelNormals, this.barrelAmbient, this.lowerBarrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.rightLowerBarrel.generateCube();
	this.rightLowerBarrel.createBuffers();
	
	// Left upper barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, rotate(45, zAxis));
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.leftUpperBarrel = new Cube(this.instance, 0, this.barrelAmbient, this.barrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.leftUpperBarrel.generateCube();
	this.leftUpperBarrel.createBuffers();
	
	// Right upper barrel
	this.instance = translate(0.0, 0.5 * this.BARREL_HEIGHT, -0.5 * this.BARREL_LENGTH);
	this.instance = mult(this.instance, rotate(45, zAxis));
	this.instance = mult(this.instance, scaleM(this.BARREL_WIDTH, this.BARREL_HEIGHT, this.BARREL_LENGTH));
	this.rightUpperBarrel = new Cube(this.instance, 0, this.barrelAmbient, this.barrelDiffuse, this.barrelSpecular, this.barrelShininess, false, 0);
	this.rightUpperBarrel.generateCube();
	this.rightUpperBarrel.createBuffers();
	
	// Grip
	this.instance = translate(0.0, -0.5 * this.GRIP_HEIGHT, -0.5 * this.GRIP_LENGTH);
	this.instance = mult(this.instance, scaleM(this.GRIP_WIDTH, this.GRIP_HEIGHT, this.GRIP_LENGTH));
	this.grip = new Cube(this.instance, 0, this.gripAmbient, this.gripDiffuse, this.gripSpecular, this.gripShininess, false, 0);
	this.grip.generateCube();
	this.grip.createBuffers();
	
	this.render = function()
	{	
		modelViewMatrix = translate(0.13, -0.09, -0.28);
		if (inRecoilAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.recoilAnimationTime)
			{
				inRecoilAnimation = false;
				this.angle = 0;
			}
			else
			{
				this.angle = 6 - 6 * (timeDiff / this.recoilAnimationTime);
				modelViewMatrix = mult(modelViewMatrix, translate(0, 0, this.angle/65));
			}
		}
		else if (inSwitchOutAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.switchOutAnimationTime)
			{
				inSwitchOutAnimation = false;
				inSwitchInAnimation = true;
				animationBeginTime = performance.now();
				currGun++;
				if (currGun > NUM_GUNS)
					currGun = 1;
			}
			else
			{
				this.angle = 100 * (timeDiff / this.switchOutAnimationTime);
			}
		}
		else if (inSwitchInAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.switchInAnimationTime)
			{
				inSwitchOutAnimation = false;
				inSwitchInAnimation = false;
			}
			else
			{
				this.angle = 100 - 100 * (timeDiff / this.switchInAnimationTime);
			}
		}
		else if (inReloadAnimation)
		{
			var currTime = performance.now();
			var timeDiff = currTime - animationBeginTime;
			if (timeDiff > this.reloadAnimationTime)
			{
				this.backBarrel.instanceMatrix = this.originalInstance;
				rpg.currAmmo = rpg.ammoCapacity;
				inReloadAnimation = false;
				this.angle = 0;
			}
			else
			{
				if (timeDiff < this.reloadAnimationTime / 4)
				{
					this.originalInstance = this.backBarrel.instanceMatrix;
					this.angle = - 220 * (timeDiff / this.reloadAnimationTime);
				}
				else if (timeDiff < ((2 * this.reloadAnimationTime) / 4))
				{
					rpgReloadAudio.play();
					this.backBarrel.instanceMatrix = mult(this.backBarrel.instanceMatrix, translate(0.0, 0.0, 0.04));
				}
				else if (timeDiff < ((3 * this.reloadAnimationTime) / 4))
				{
					playReloadAudio();
					this.backBarrel.instanceMatrix = mult(this.backBarrel.instanceMatrix, translate(0.0, 0.0, -0.04));
				}
				else
				{
					this.angle = -220 + 220 * (timeDiff / this.reloadAnimationTime);
				}
			}
		}
		
		if (inSwitchOutAnimation || inSwitchInAnimation)
		{
			modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.3));
		}
		modelViewMatrix = mult(modelViewMatrix, rotate(this.angle, xAxis));
		if (inSwitchOutAnimation || inSwitchInAnimation)
		{
			modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, -0.3));
		}
		this.matrixStack.push(modelViewMatrix);
		
		modelViewMatrix = mult(modelViewMatrix, translate(-0.70 * this.BARREL_WIDTH, 0.0, 0.0));
		this.leftLowerBarrel.bindBuffers();
		this.leftLowerBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.70 * this.BARREL_WIDTH, 0.0, 0.0));
		this.rightLowerBarrel.bindBuffers();
		this.rightLowerBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(-0.70 * this.BARREL_WIDTH, 1.4 * this.BARREL_HEIGHT, 0.0));
		this.leftUpperBarrel.bindBuffers();
		this.leftUpperBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.70 * this.BARREL_WIDTH, 1.4 * this.BARREL_HEIGHT, 0.0));
		this.rightUpperBarrel.bindBuffers();
		this.rightUpperBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.70 * this.BARREL_HEIGHT, this.BACK_BARREL_LENGTH));
		this.backBarrel.bindBuffers();
		this.backBarrel.render();
		
		modelViewMatrix = this.matrixStack.pop();
		this.matrixStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, translate(0.0, this.BARREL_HEIGHT, -0.7 * this.BARREL_LENGTH));
		this.grip.bindBuffers();
		this.grip.render();

		modelViewMatrix = this.matrixStack.pop();
	};
}
