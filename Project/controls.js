/*** Controls ***/

function handleMouseMove(event)
{
	if (mousedown_flag == 0)
		return;
   
	var currentX = event.clientX;
	var currentY = event.clientY;
	
	var dX = currentX - lastMouseX;
	var dY = currentY - lastMouseY;
	
	// Rotate right
	if (dX > 0)
	{
		viewMatrix = mult (rotate (rotateAmt, yAxis), viewMatrix);
		rotationY -= rotateAmt;
	}
	// Rotate left
	else if (dX < 0)
	{
		viewMatrix = mult (rotate (-rotateAmt, yAxis), viewMatrix);
		rotationY += rotateAmt;
	}

	// Rotate up
	if (dY > 0)
	{
		rotationX -= rotateAmt;
		if (rotationX <= -90)
			rotationX = -90;
	}
	// Rotate down
	else if (dY < 0)
	{
		rotationX += rotateAmt;
		if (rotationX >= 90)
			rotationX = 90;
	}

	lastMouseX = currentX;
	lastMouseY = currentY;
}

function handleMouseDown(event)
{
	// Right click
	if(event.button == 2)
	{
		mousedown_flag = 1;
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
	}
	// Shoot
	if(event.button == 0)
	{
		if (!inRecoilAnimation && !inSwitchOutAnimation && !inSwitchInAnimation && !inReloadAnimation)
		{
			var b;
			if (currGun == PISTOL)
			{
				pistol.currAmmo--;
				if (pistol.currAmmo >= 0)
				{
					playGunFireAudio();
					animationBeginTime = performance.now();
					inRecoilAnimation = true;
					b = new bullet(rotationY, rotationX, vec3(playerPos[0], playerPos[1], playerPos[2]), pistol.bulletSpeed, pistol.bulletAmbient, 
									pistol.bulletDiffuse, pistol.bulletSpecular, 
									pistol.bulletShininess, pistol.bulletSize, PISTOL);
					bulletsArray.push(b);
					bulletCount++;
				}
				else
					pistol.currAmmo = 0;
			}
			else if (currGun == SHOTGUN)
			{
				shotgun.currAmmo--;
				if (shotgun.currAmmo >= 0)
				{
					playGunFireAudio();
					animationBeginTime = performance.now();
					inRecoilAnimation = true;
					b = new bullet(rotationY + 1.7*0.6, rotationX + 1.7*1, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY - 1.7*0.6, rotationX + 1.7*1, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY - 1.7*1, rotationX - 1.7*0.5, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY - 1.7*1.5, rotationX, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY + 1.7*1.5, rotationX, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY + 1.7*1, rotationX - 1.7*0.5, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY + 1.7*0.3, rotationX - 1.7*0.8, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY - 1.7*0.3, rotationX - 1.7*0.8, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
					b = new bullet(rotationY, rotationX + 0.4, vec3(playerPos[0], playerPos[1], playerPos[2]), shotgun.bulletSpeed, shotgun.bulletAmbient, 
									shotgun.bulletDiffuse, shotgun.bulletSpecular, 
									shotgun.bulletShininess, shotgun.bulletSize, SHOTGUN);
					bulletsArray.push(b);
					bulletCount++;
				}
				else
					shotgun.currAmmo = 0;
			}
			else
			{
				rpg.currAmmo--;
				if (rpg.currAmmo >= 0)
				{
					playGunFireAudio();
					animationBeginTime = performance.now();
					inRecoilAnimation = true;
					b = new bullet(rotationY, rotationX, vec3(playerPos[0], playerPos[1], playerPos[2]), rpg.bulletSpeed, rpg.bulletAmbient, 
									rpg.bulletDiffuse, rpg.bulletSpecular, 
									rpg.bulletShininess, rpg.bulletSize, RPG);
					bulletsArray.push(b);
					bulletCount++;
				}
				else
					rpg.currAmmo = 0;
			}
		}
	}
}	

function handleMouseUp(event)
{
	if(event.button == 2)
		mousedown_flag = 0;
}

function handleKeyDown(event)
{		
	keysPressed[event.keyCode] = 1;
	
	if (event.keyCode == 87)
		keysPressed[83] = 0;
	else if (event.keyCode == 83)
		keysPressed[87] = 0;
	
	if (event.keyCode == 65)
		keysPressed[68] = 0;
	else if (event.keyCode == 68)
		keysPressed[65] = 0;
}

function handleKeyUp(event) 
{
	// // if (event.keyCode == 74 || event.keyCode == 75)
		// // left_right_flag = 0;
	
	keysPressed[event.keyCode] = 0;
}