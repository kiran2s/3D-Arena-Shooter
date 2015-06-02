/*** Bullets ***/

function rotate_y_axis(vector, degrees)
{
	var result = vec3();
	result[0] = vector[0]*Math.cos(radians(degrees)) + vector[2]*Math.sin(radians(degrees));
	result[1] = vector[1];
	result[2] = -vector[0]*Math.sin(radians(degrees)) + vector[2]*Math.cos(radians(degrees));
	return result;
}

function bullet(rotation_y, rotation_x, position, speed, ambient, diffuse, specular, shininess, size, type)
{
	this.type = type;
	this.distance_covered = mat4();
	this.rotationy = rotation_y;
	this.rotationx = rotation_x;
	this.initial_position = position;
	this.speed = speed;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
	this.size = size;
	this.point = 0;
	this.last_point = 0;
	this.muzzleFlash = 1;
	
	this.drawBullet = function()
	{
		this.last_point = this.point;
		this.distance_covered = mult(translate (0 * this.speed,0 * this.speed, -1*this.speed), this.distance_covered);
		var temp;
		if (this.type == PISTOL)
			temp = mult (translate (0.13 , this.initial_position[1] - 0.09, -0.8), mat4());
		else if (this.type == SHOTGUN)
			temp = mult (translate (0.13 , this.initial_position[1] - 0.10, -0.8), mat4());
		else
			temp = mult (translate (0.13 , this.initial_position[1] - 0.05, -1.0), mat4());
		temp = mult (this.distance_covered, temp);
		
		temp = mult (rotate (this.rotationy, yAxis), temp);

		var tempvec = vec3(0,0,0);
		tempvec[0] = 1*Math.cos(radians(-this.rotationy));
		tempvec[1] = 0;
		tempvec[2] = 1*Math.sin(radians(-this.rotationy));
		temp = mult (rotate (this.rotationx, tempvec[0], tempvec[1], tempvec[2]), temp);
		temp = mult (translate(this.initial_position[0], this.initial_position[1], this.initial_position[2]), temp);
		
		//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(temp));
	
		temp = mult(temp, translate(0, -this.initial_position[1], 0));
		temp = mult(temp, scaleM(0.8 * this.size, 0.8 * this.size, 2 * this.size));
		this.point = vec3(temp[0][3],
							temp[1][3],
							temp[2][3]);

		var s = new Sphere(temp, this.ambient, this.diffuse, this.specular, this.shininess);
		s.bindBuffers();
		s.render();
	}
	
	this.drawEnemyBullet = function()
	{
		var xdivz = (-this.initial_position[0] + playerPos[0])/(-this.initial_position[2] + playerPos[2]);
		var angle = 360/Math.PI/2*Math.atan(xdivz);
		if ((-this.initial_position[2] + playerPos[2])<0)
			angle +=180;
		if (this.rotationy == 0)
		{
			this.rotationy = angle;
		}

		this.distance_covered = mult (translate (0 * this.speed,0 * this.speed, 1*this.speed), this.distance_covered);
		
		var temp = mult( rotate (this.rotationy, 0, 1, 0),(this.distance_covered));
		temp = mult(translate(this.initial_position), temp);
		temp = mult(temp, scaleM(0.8 * this.size, 0.8 * this.size, 2 * this.size));
		
		this.point = vec3(temp[0][3],
								temp[1][3],
								temp[2][3]);
								
		var s = new Sphere(temp, this.ambient, this.diffuse, this.specular, this.shininess);
		s.bindBuffers();
		s.render();
	}
	
	this.hit_by_bullet = function(objectPoint, dimensions)
	{
		var dist2 = 0;
		for (var i = 0; i < 3; i++)
		{
			if (this.point[i] < objectPoint[i] - dimensions[i])
			{
				dist2 = dist2  + ((this.point[i] - (objectPoint[i] - dimensions[i]))*(this.point[i] - (objectPoint[i] - dimensions[i]))) ;
			}
			else if (this.point[i] > objectPoint[i] + dimensions[i])
			{
				dist2 = dist2  + ((this.point[i] - (objectPoint[i] + dimensions[i]))*(this.point[i] - (objectPoint[i] + dimensions[i])));
			}
		}
		
		if (dist2 < (this.size)*(this.size))
			return 1;
		else
			return 0;
	}
	
	this.isOutOfBounds = function()
	{
		if (this.point[0] > 3*ARENA_SIZE || this.point[0] < -3*ARENA_SIZE ||
			this.point[1] > 3*ARENA_SIZE || this.point[1] < -3*ARENA_SIZE || 
			this.point[2] > 3*ARENA_SIZE || this.point[2] < -3*ARENA_SIZE)
		{
			return 1;
		}
		return 0;
	}
}

