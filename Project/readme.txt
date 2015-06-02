README:

Changed Enemy class to have function fireBullet() as a member function.

Changed Bullet class to have function drawEnemyBullet() as a member function
(initially was called enemy_fire_bullet()).

Changed Enemy class to have its own bullet characteristics (instead of borrowing
from RPG).

Changed bullet speeds.

Changed player and camera beginning y position to 1.5.

Fixed placement of ground, cube, and enemies.
Enemies are now 2x2x2
Fixed hardcoding of enemy size (when detecting enemy-bullet collision 
(nested for-loop) in render()) and player height (when shooting).

-------------------

TODO:

Implement Jordan's UI, lighting, and 3D enemy shooting.

UI - ammo, crosshairs, health, shaking, enemy lighting, muzzle lighting, 3D enemy shooting

Merge with Ben's code
Create rounds (waves of enemies)