/*** Enemies ***/
function Enemy(position)
{
	this.lastShotTime = performance.now();
	this.bulletTime = 3000;
	this.initial_position = position;
	this.position = position;
	this.body;
	this.size = vec3(0.5, 0.5, 0.5);
	this.distance_covered = mat4();
	this.enemyAngle;
	this.speed = 0.1;
	this.health = 100;
	
	this.enemyAmbient = vec4(1.0, 1.0, 1.0, 1.0);
	this.enemyDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
	this.enemySpecular = vec4(1.0, 0.8, 0.1, 1.0);
	/*
	this.enemyAmbient = vec4(0.85, 0.65, 0.11, 1.0);
	this.enemyDiffuse = vec4(0.85, 0.65, 0.11, 1.0);
	this.enemySpecular = vec4(1.0, 0.8, 0.1, 1.0);
	*/
	this.enemyShininess = 10.0;
	this.enemyNormals = [
		vec4( -0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5,  0.5,  0.5, 0.0 ),
		vec4(  0.5, -0.0,  0.5, 0.0 ),
		vec4( -0.5, -0.0, -0.5, 0.0 ),
		vec4( -0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5,  0.5, -0.5, 0.0 ),
		vec4(  0.5, -0.0, -0.5, 0.0 )
	];
	
	this.bulletAmbient = vec4(1.0, 0.0, 1.0, 1.0);
	this.bulletDiffuse = vec4(0.0, 0.0, 1.0, 1.0);
	this.bulletSpecular = vec4(1.0, 0.0, 1.0, 1.0);
	this.bulletShininess = 30.0;
	this.bulletSize = 0.3;
	this.bulletSpeed = 0.3;
	
	this.createBody = function()
	{
		this.body = new Cube(mult(translate(position), scaleM(this.size[0]*2, this.size[1]*2, this.size[2]*2)), 0, this.enemyAmbient, 
							this.enemyDiffuse, this.enemySpecular, this.enemyShininess, true, 3);
		this.body.generateCube();
		this.body.createBuffers();
	}
	
	this.updatePosition = function()
	{
		var xDiff = (playerPos[0] - this.position[0]);
		var yDiff = (playerPos[1] - this.position[1]);
		var zDiff = (playerPos[2] - this.position[2]);
		var diff = vec3(xDiff, yDiff, zDiff);
		if (xDiff != 0 || yDiff != 0 || zDiff != 0)
			diff = normalize(diff);
		
		//save old position for collision detection
		var oldPosition = vec3(this.position[0], this.position[1], this.position[2]);
		
		// update position
		this.position[0] = this.position[0] + diff[0]/40;
		this.position[1] = this.position[1] + diff[1]/40;
		this.position[2] = this.position[2] + diff[2]/40;
		
		//collision detection
		//Get collision flags: left, right, bottom, top, back, front
		var collisions = getCollisions(this.position, oldPosition, this.size, boxArray);
		
		if (collisions[0] != 0)	{
			this.position[0] -= collisions[0];
		}
		if (collisions[1] != 0)	{
			this.position[0] -= collisions[1];
		}
		if (collisions[2] != 0)	{
			this.position[1] += collisions[2];
		}
		if (collisions[3] != 0)	{
			this.position[1] -= collisions[3];
		}
		if (collisions[4] != 0)	{
			this.position[2] -= collisions[4];
		}
		if (collisions[5] != 0)	{
			this.position[2] -= collisions[5];
		}
		
		this.body.instanceMatrix = mult(translate(this.position), scaleM(this.size[0]*2, this.size[1]*2, this.size[2]*2));
		
		var currTime = performance.now();
		var timeDiff = currTime - this.lastShotTime;
		if (timeDiff > this.bulletTime)
		{
			this.fireBullet();
			this.lastShotTime = performance.now();
		}
	}
	
	this.draw = function()
	{
		this.body.bindBuffers();
		this.body.render();
	}
	
	this.fireBullet = function()
	{
		b = new bullet(0, 0, this.position, this.bulletSpeed, this.bulletAmbient, 
						this.bulletDiffuse, this.bulletSpecular, 
						this.bulletShininess, this.bulletSize, ENEMY_BULLET_TYPE);
		enemyBulletsArray.push(b);
		enemyBulletCount++;
	}
}