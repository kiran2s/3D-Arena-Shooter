var flash_red = 0;

var max_health = 4;
var health_left = 4;
var score = 0;
var flash_duration = 1000; //1000 ms

var square_buf = [];
var health_bar_size = vec3(.45,0.15,.3);
var square_vertices = [
	1, -1,  1, 1,
    -1, -1,  1, 1,
     1,  1,  1, 1,
    -1,  1,  1, 1
];
var ortho_width = 16;
var ortho_height = 9;
var ortho_depth = 10;
var half_ortho_width = ortho_width/2;
var half_ortho_height = ortho_height/2;
var half_ortho_depth = ortho_depth/2;
var orthoMatrix = ortho(-half_ortho_width, half_ortho_width, -half_ortho_height, half_ortho_height, -half_ortho_depth, half_ortho_depth);

function bindsquareVertexBuffer()
{

	square_buf = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, square_buf );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(square_vertices), gl.STATIC_DRAW );
}

function drawHealthBar(shakex, shakey)
{

	var size_of_health_bar = scaleM(health_bar_size[0], health_bar_size[1], health_bar_size[2]);
	//size_of_health_bar = mult(scaleM(0.3,0.3,0.3), size_of_health_bar);
	var initialBar = translate (-half_ortho_width + health_bar_size[0]+shakex,half_ortho_height - health_bar_size[1] -shakey,0);
	initialBar = mult (initialBar, size_of_health_bar);
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	projectionMatrix = orthoMatrix;
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );
	
	gl.uniform4fv( ambientProductLoc,flatten(vec4 (0,1,0,1)));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( initialBar ));
	
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	if (health_left > 0)
	{
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	}
	for (var i = 0; i < health_left-1; i++)
	{
		initialBar = mult (translate (health_bar_size[0]*2+.1, 0, 0), initialBar);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( initialBar));
				
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);

	}

	if (currGun == PISTOL)
		Display_Ammo_Count(pistol.currAmmo, pistol.ammoCapacity,  vec4 (1,1,0,1),  vec4 (0,0,0,1),  vec4 (1,0,0,1), shakex, shakey);
	else if (currGun == SHOTGUN)
		Display_Ammo_Count(shotgun.currAmmo, shotgun.ammoCapacity,  vec4 (1,1,0,1),  vec4 (0,0,0,1),  vec4 (1,0,0,1), shakex, shakey);
	else
		Display_Ammo_Count(rpg.currAmmo, rpg.ammoCapacity,  vec4 (1,1,0,1),  vec4 (0,0,0,1),  vec4 (1,0,0,1), shakex, shakey);
	
	Display_Score(shakex, shakey);
}

function write_number(number, location, scale, color)
{
	var segment_array = [];
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	projectionMatrix = orthoMatrix;
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );
	
	var widthdiv2 = 1;
	var heightdiv2 = .35;
	
	segment_array[0] = scaleM(widthdiv2, heightdiv2, 1);
	segment_array[1] = mult(translate (0, widthdiv2*2, 0), segment_array[0]);
	segment_array[2] = mult(translate (0, -widthdiv2*2, 0), segment_array[0]);
	var horizonBar = mult(rotate (90, 0, 0, 1), segment_array[0]);
	segment_array[3] = mult(translate (-widthdiv2, heightdiv2*2.5, 0), horizonBar);
	segment_array[4] = mult(translate (widthdiv2, heightdiv2*2.5, 0), horizonBar);
	segment_array[5] = mult(translate (-widthdiv2, -heightdiv2*2.5, 0), horizonBar);
	segment_array[6] = mult(translate (widthdiv2, -heightdiv2*2.5, 0), horizonBar);
	
	for (var i = 0; i < 7; i++)
	{
		segment_array[i] = mult (scaleM(scale, scale, scale), segment_array[i]);
		segment_array[i] = mult (translate (location), segment_array[i]);
	}
	
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	gl.uniform4fv( ambientProductLoc,flatten(color));
	//top segment
	if (number==0 || number==2 || number==3 || number==5 || number==6 || number==7 || number==8 || number==9)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(segment_array[1]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	}
	//bottom segment
	if (number==0 || number==2 || number==3 || number==5 || number==6 || number==8 || number==9)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(segment_array[2]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	}
	//left-top segment
	if (number==0 || number==4 || number==5 || number==6 || number==8 || number==9)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(segment_array[3]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	}	
	//right-top segment
	if (number==0 || number==1 || number==2 || number==3 || number==4 || number==7 || number==8 || number==9)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(segment_array[4]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	}		
	//left-bot segment
	if (number==0 || number==2 || number==6 || number==8)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(segment_array[5]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	}	
	//right-bot segment
	if (number==0 || number==1 || number==3 || number==4 || number==5 || number==6 || number==7 || number==8 || number==9)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(segment_array[6]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	}	
	//middle segment
	if (number==2 || number==3 || number==4 || number==5 || number==6 || number==8 || number==9)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( segment_array[0]));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	}
	
}

function Display_Ammo_Count (ammo_in_clip, ammo_left, color1, color_slash, color2, shakex, shakey)
{
	var middle_of_ammo_display = vec3(half_ortho_width - 1.2 + shakex, -half_ortho_height+.6-shakey, half_ortho_depth-.1);
	write_number(Math.floor(ammo_in_clip/10), add(middle_of_ammo_display, vec3(-1,0,0)), .1, color1);
	write_number(Math.floor(ammo_in_clip%10), add(middle_of_ammo_display, vec3(-.6,0,0)), .1, color1);
	//slash
	var slash = scaleM(2.4, .35, 0);
	slash = mult (scaleM(.13, .13, .13), slash);
	slash = mult(rotate (45, 0, 0,1), slash);
	slash = mult(translate(middle_of_ammo_display),slash);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(slash));
	gl.uniform4fv( ambientProductLoc,flatten(color_slash));
	
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	
	write_number(Math.floor(ammo_left/10), add(middle_of_ammo_display, vec3(.4,-.16,0)), .08, color2);
	write_number(Math.floor(ammo_left%10), add(middle_of_ammo_display, vec3(.7,-.16,0)), .08, color2);	
}

function Display_Score(shakex, shakey)
{
	var middleOfScoreDisplay = vec3(half_ortho_width - 0.5 + shakex, 4 - shakey, half_ortho_depth - 0.1);
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	var s2d = score;
	var shiftAmt = 0.0;
	do
	{
		write_number(Math.floor(s2d%10), add(middleOfScoreDisplay, vec3(shiftAmt, 0.0, 0.0)), .1, vec4 (1,0.5,0,1));
		s2d = Math.floor(s2d/10);
		shiftAmt -= 0.4;
	} while(s2d != 0)
}

function draw_pistol_crosshair()
{
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	projectionMatrix = orthoMatrix;
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );
	
	var crosshair_segment = scaleM(1.1,.2,1);
	crosshair_segment = mult(crosshair_segment, scaleM(.3,.3,.3));
	gl.uniform4fv( ambientProductLoc,flatten(vec4 (1,1,1,.2)));
	//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_segment ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	var crosshair_array = [];
	crosshair_array[0] = mult(translate(-.5,0,0), crosshair_segment);
	crosshair_array[1] = mult(translate(.5,0,0), crosshair_segment);
	crosshair_array[2] = mult(rotate(90,0,0,1), crosshair_array[0]);
	crosshair_array[3] = mult(rotate(90,0,0,1), crosshair_array[1]);
	
	for (var i = 0; i < 4; i++)
	{
		crosshair_array[i]= mult(scaleM(0.3,0.3,0.3), crosshair_array[i]);
		crosshair_array[i]= mult(translate(.05,0,0), crosshair_array[i]);
	}
	gl.enable( gl.BLEND );
	gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	gl.disable(gl.DEPTH_TEST);
		

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[0] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[1] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[2] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[3] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	
	gl.enable(gl.DEPTH_TEST);
	gl.disable( gl.BLEND );

}

function draw_shotgun_crosshair()
{
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	projectionMatrix = orthoMatrix;
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );
	
	var crosshair_segment = scaleM(1.1,.2,1);
	crosshair_segment = mult(crosshair_segment, scaleM(.3,.3,.3));
	gl.uniform4fv( ambientProductLoc,flatten(vec4 (1,1,1,.2)));
	var crosshair_array = [];
	crosshair_array[0] = mult(translate(.5,0,0), crosshair_segment);
	crosshair_array[1] = mult(rotate(45,0,0,1), crosshair_array[0]);
	crosshair_array[0] = mult(rotate(-45,0,0,1), crosshair_array[0]);
	crosshair_array[2] = mult(translate(-.5,0,0), crosshair_segment);
	crosshair_array[3] = mult(rotate(45,0,0,1), crosshair_array[2]);
	crosshair_array[2] = mult(rotate(-45,0,0,1), crosshair_array[2]);
	crosshair_array[0] =  mult(translate(-1,.15,0), crosshair_array[0]);
	crosshair_array[1] =  mult(translate(-1,-.15,0), crosshair_array[1]);
	crosshair_array[2] =  mult(translate(1,-.15,0), crosshair_array[2]);
	crosshair_array[3] =  mult(translate(1,.15,0), crosshair_array[3]);
	
	for (var i = 0; i < 4; i++)
	{
		crosshair_array[i]= mult(scaleM(0.7,0.7,0.7), crosshair_array[i]);
		crosshair_array[i]= mult(translate(.05,0,0), crosshair_array[i]);
	}
	gl.enable( gl.BLEND );
	gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	gl.disable(gl.DEPTH_TEST);
		

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[0] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[1] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[2] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[3] ));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);	
	
	gl.enable(gl.DEPTH_TEST);
	gl.disable( gl.BLEND );
	
}

function draw_rpg_crosshair()
{
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	projectionMatrix = orthoMatrix;
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );
	
	var crosshair_segment = scaleM(1.1,.2,1);
	crosshair_segment = mult(crosshair_segment, scaleM(.3,.3,.3));
	var vertical_crosshair_segment = mult (rotate(90, 0, 0,1), crosshair_segment);
	gl.uniform4fv( ambientProductLoc,flatten(vec4 (1,1,1,.2)));
	var crosshair_array = [];
	crosshair_array[0] = mult(scaleM(2,1,1), crosshair_segment);
	crosshair_array[0] = mult(translate(-1.0,0,0), crosshair_array[0]);
	crosshair_array[1] = mult(translate(-2,0,0), vertical_crosshair_segment);
	crosshair_array[2] = mult(scaleM(1,.6,1), vertical_crosshair_segment);
	crosshair_array[2] = mult(translate(-1.6,0,0), crosshair_array[2]);

	for (var j = 0; j < 3; j++)
	{
		for (var i = 0; i < 3; i++)
		{
			crosshair_array[3+i+3*j]= mult(rotate(90,0,0,1), crosshair_array[i+3*j]);
		}
	}
	
	for (var i = 0; i < 12; i++)
	{
		crosshair_array[i]= mult(scaleM(0.7,0.7,0.7), crosshair_array[i]);
		crosshair_array[i]= mult(translate(0.05,0,0), crosshair_array[i]);
	}
	gl.enable( gl.BLEND );
	gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	gl.disable(gl.DEPTH_TEST);
		
	for (var i = 0; i < 12; i++)
	{
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( crosshair_array[i] ));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	}
	gl.enable(gl.DEPTH_TEST);
	gl.disable( gl.BLEND );
	
}

function flash_screen(duration, flash_rate)
{
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	
	if (duration >= flash_duration)
	{
		return 0;
	}
	if (Math.floor(duration/flash_rate)%2 == 0)
	{
		gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
		gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		
		projectionMatrix = orthoMatrix;
		gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
		gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );
	
		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		gl.disable(gl.DEPTH_TEST);
		gl.uniform4fv( ambientProductLoc,flatten(vec4 (1,0,0, 0.5) ));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( scaleM(half_ortho_width, half_ortho_height, 1)));
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
		gl.enable(gl.DEPTH_TEST);
		gl.disable( gl.BLEND );
	}
	return 1;
}

function red_screen_of_death()
{
	texNum = 0;
	gl.uniform1i(texNumLoc, texNum);
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, square_buf);
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	projectionMatrix = orthoMatrix;
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4() ) );

	gl.enable( gl.BLEND );
	gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	gl.disable(gl.DEPTH_TEST);
	gl.uniform4fv( ambientProductLoc,flatten(vec4 (1,0,0, 1) ));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten( scaleM(half_ortho_width, half_ortho_height, 1)));
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
	gl.enable(gl.DEPTH_TEST);
	gl.disable( gl.BLEND );
}
