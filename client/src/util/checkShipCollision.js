import getDistance from '../util/getDistance'
import { playSound } from '../util/playSound'

function checkShipCollision(globalPlayer, setGlobalPlayer, setGameState, asteroids) {
    const { x, y, xB, yB, spriteDim, alive, invnsTimer } = globalPlayer;
//if player is alive and is not invincible, check for collision
    if (alive && invnsTimer <= 0) {
        Object.keys(asteroids).map((asteroid) => {
            const a = asteroids[asteroid];
            if (a.alive) {
                //radius is hard coded
                //player radius should be smaller than ship
                const d = spriteDim; //d = {w: int, h: int}
                const plrRadius = 30;
                const astRadius = [21, 62, 124];
                const r = astRadius[a.size];
                const dist = plrRadius + r;
                const lineA = getDistance(x + (d.w / 2), a.x + r, y + (d.h / 2), a.y + r)
                const lineB = (x !== xB && y !== yB) ? getDistance(xB + (d.w / 2), a.x + r, yB + (d.h / 2), a.y + r) : 200;
                const lineC = (a.x !== a.xB && a.y !==a.yB) ? getDistance(x + (d.w / 2), a.xB + r, y + (d.h / 2), a.yB + r) : 200;
                const lineD = (a.x !== a.xB && a.y !==a.yB) ? getDistance(xB + (d.w / 2), a.xB + r, yB + (d.h / 2), a.yB + r) : 200;

                //if length of any line is smaller than (player radius + asteroid radius) we have a collision
                if (lineA < dist || lineB < dist || lineC < dist || lineD < dist) {
                    //update state -1 live or gameover = 1
                    setGameState(old => {
                        //check if gameover
                        if (old.lives <= 1) {
                            playSound('gameover')
                            //kill player. set alive to false
                            setGlobalPlayer(old => ({ ...old, x: 906, y: 478, xB: 906, yB: 478, vx: 0, vy: 0, dir: 90, alive: false }));
                            setTimeout(() => {
                                window.location = "/";
                            }, 8000);
                            //return uosated gameState
                            return ({ ...old, lives: 0, gameOver: 1 });
                        } else {
                            playSound('player_die')
                            setGlobalPlayer(old => ({ ...old, x: 906, y: 478, xB: 906, yB: 478, vx: 0, vy: 0, dir: 90, invnsTimer: 300 }));
                            //return uosated gameState
                            return ({ ...old, lives: old.lives - 1 });
                        }

                    });
                    return false;
                }
            }
            return false;
        });
    }

};

export default checkShipCollision;