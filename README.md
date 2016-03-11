# FPSgame
by Kiran Sivakumar, Jordan Miller, and Benjamin Statz

This project is a 3D arena-style first-person-shooter game for the
Firefox web browser developed using WebGL with no additional
supporting libraries.
The objective of the game is to use the 3 guns you have at your
disposal to emiminate as many enemies as possible before they
eliminate you.
There is one level in which waves of enemies (the cats)
spawn from each of the 4 corners. You start off at the middle
of the map. 

To play our game, please locate the fps.html file in the Project
folder and open it using the Firefox browser.

The green bars at the top left represent your health.
The number at the top right is your score. The numbers at the bottom
right are the current amount of ammo in the magazine and the maximum
ammo capacity of your current gun.

NOTE: Please use Firefox to play this game as it is the only known
browser that completely supports our game. A workaround needs to be done to allow textures to load on a Chrome. 

NOTE: Your aiming sensitivity might be too high or too low based on your mouse's settings and DPI. To alter the in-game mouse sensitivity:
1) Locate the globalVars.js file in the Project folder and open it using Notepad.
2) Find the var named "rotateAmt" and adjust its value accordingly (higher value for increased sensitivity).


CONTROLS:
Move the mouse while holding down the right mouse button to aim
(the right mouse button must be held inside the game view frame
of the browser in order for aiming to work).

Left mouse button to shoot.

W to move forward
S to move backwards
A to move left
D to move right

R to reload your current gun
F to switch weapons

Space bar to jump

-------------------------------------------------------------------------

NO additional supporting libraries were used (such as three.js, BabylonJS etc.).

3 weapons were implemented: a pistol, shotgun, and rocket launcher.
Cool lighting effects were implemented:
 - There is a main light present (like the sun).
 - Whenever you shoot an enemy, a red light source appears at the enemy.
	This light source only affects the enemy and objects close by to the
	enemy for a more realistic area of effect.
 - Whenever you shoot the gun, a quick muzzle flash lighting appears at the
	tip of the muzzle of your current gun.
	
Unique reload and recoil animations are present for each gun.

Collision detection is present in our game, disallowing the player and enemies
from moving through walls.
The player can jump onto the many platforms present in our level thanks to
the collision detection.

Bullets disappear when they hit an object / enemy or when they leave the bounds
of the map thanks to our hit detection implementation.

When a bullet hits an enemy, they lose some health. Likewise, when an enemy bullet
hits you, you lose a bar of health and the HUD shakes and the screen flashes red.

You have 4 bars of health.

All guns have unique and interesting crosshairs.

The size and speed of bullets varies from gun to gun, so choose your gun wisely for
the current situation. The shotgun even has a spread of bullets!

Textures have been used for the ground, obstacles / platforms around the level, 
and for the enemies.

--------------------------------------------------------------------------

We hope you enjoy our game! It was a lot of fun collaborating to develop it.
