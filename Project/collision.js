//COLLISION DETECTION
const g = 0.01;
const JUMP_VEL = 0.25;
const PLAYER_DIMENSIONS = vec3(1, 2, 1);

var yVel = 0;
var inAir = false;

function testIntersection(i, testPos, dimensions, objectList) 
{
	var pmin = subtract(testPos, dimensions);
	var pmax = add(testPos, dimensions);
	var bmin = subtract(objectList[i].position, objectList[i].size);
	var bmax = add(objectList[i].position, objectList[i].size);
	
	var overlap = [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
	
	//values 3-8: the amount of overlap, or 0 if there is none
	if (pmax[0] > bmin[0]) overlap[3] = pmax[0] - bmin[0];	//player is to the left of box
	if (pmin[0] < bmax[0]) overlap[4] = pmin[0] - bmax[0];	//player is to the right of box
	if (pmax[1] > bmin[1]) overlap[5] = pmax[1] - bmin[1];	//player is below box
	if (pmin[1] < bmax[1]) overlap[6] = pmin[1] - bmax[1];	//player is above box
	if (pmax[2] > bmin[2]) overlap[7] = pmax[2] - bmin[2];	//player is behind of box
	if (pmin[2] < bmax[2]) overlap[8] = pmin[2] - bmax[2];	//player is in front of box
	
	if (!overlap[3] || !overlap[4]) overlap[0] = 0;
	if (!overlap[5] || !overlap[6]) overlap[1] = 0;
	if (!overlap[7] || !overlap[8]) overlap[2] = 0;
		
	return overlap;
}

function getCollisions(currPos, prevPos, dimensions, objectList)
{
	//0-5: whether a collision has occurred at (left, right, bottom, top, back, front)
	//6-11: index of object that caused the collision
	var collisions = [ 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1 ];
	
	for (var i = 0; i < objectList.length; i++)
	{
		//status values
		//0-2: overlap on respective axes (1 = overlapping, 0 = not overlapping)
		//3-8: if player location is at (right/left/top/bottom/front/back) relative to box, give distance
		var overlap = testIntersection(i, vec3(currPos[0], currPos[1], currPos[2]), dimensions, objectList);
		var prevOverlap = testIntersection(i, vec3(prevPos[0], prevPos[1], prevPos[2]), dimensions, objectList);
		
		if (overlap[0] && overlap[1] && overlap[2])
		{
			//FACE COLLISIONS (AKA "PROPER" COLLISIONS)
			if (!prevOverlap[0] && prevOverlap[1] && prevOverlap[2]) {
				if (!prevOverlap[3]) {		//left
					//console.log("left");
					collisions[0] = overlap[3];
					collisions[6] = i;
				}
				else if (!prevOverlap[4]) {	//right
					//console.log("right");
					collisions[1] = overlap[4];
					collisions[7] = i;
				}
			}
			else if (prevOverlap[0] && !prevOverlap[1] && prevOverlap[2]) {
				if (!prevOverlap[5]) {		//bottom
					//console.log("bottom");
					collisions[2] = overlap[5];
					collisions[8] = i;
				}
				else if (!prevOverlap[6]) {	//top
					//console.log("top");
					collisions[3] = overlap[6];
					collisions[9] = i;
				}
			}
			else if (prevOverlap[0] && prevOverlap[1] && !prevOverlap[2]) {
				if (!prevOverlap[7]) {		//back
					//console.log("back");
					collisions[4] = overlap[7];
					collisions[10] = i;
				}
				else if (!prevOverlap[8]) {	//front
					//console.log("front");
					collisions[5] = overlap[8];
					collisions[11] = i;
				}
			}
			//EDGE COLLISIONS
			else if (!prevOverlap[0] && prevOverlap[1] && !prevOverlap[2]) {	//only y overlap
				if (!prevOverlap[7]) {		//back
					collisions[4] = overlap[7];
					collisions[10] = i;
				}
				else if (!prevOverlap[8]) {	//front
					collisions[11] = i;
				}
			}
			else if (prevOverlap[0] && !prevOverlap[1] && !prevOverlap[2]) {	//only x overlap
				if (!prevOverlap[7]) {		//back
					collisions[4] = overlap[7];
					collisions[10] = i;
				}
				else if (!prevOverlap[8]) {	//front
					collisions[5] = overlap[8];
					collisions[11] = i;
				}
			}
			else if (!prevOverlap[0] && !prevOverlap[1] && prevOverlap[2]) {	//only z overlap
				if (!prevOverlap[3]) {		//left
					collisions[0] = overlap[3];
					collisions[6] = i;
				}
				else if (!prevOverlap[4]) {	//right
					collisions[1] = overlap[4];
					collisions[7] = i;
				}
			}
			//CORNER COLLISIONS
			else {
				collisions[0] = 1;
				collisions[1] = 1;
				collisions[2] = 1;
				collisions[3] = 1;
				collisions[4] = 1;
				collisions[5] = 1;
				collisions[6] = i;
				collisions[7] = i;
				collisions[8] = i;
				collisions[9] = i;
				collisions[10] = i;
				collisions[10] = i;
			}
		}
	}
	return collisions;
}