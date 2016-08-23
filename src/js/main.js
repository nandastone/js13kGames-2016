import game from './game/game';
import keyboard from './game/keyboard';
import ui from './game/ui';
import map from './game/map';
import player from './game/player';

keyboard.init();

game.init();
game.addBody( ui );
game.addBody( map );
game.addBody( player );
// game.play();

window.game = game;
