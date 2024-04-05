//imports

//should add a "resign" option to the game board UI to check end-game logic

/*
handle end game
    - update game data with "result"
    - update player win/loss/tie record 
    - (optional) add a boardDifficulty to gameBoard and use that to calculate Player rating
*/


/*
 -----PURE EMBELISHMENT -- not necessary!!------
    calculatePlayerRating(boardDifficulty, result, pointDif, P_winner, P_loser){
        Maybe use boardDifficulty, game result (win/loss/tie), point differential, 
        opponent rating, to re-calculate new player rating
        calculate boardDifficulty by the first 4 desert locations
        assign 0.5 multiplier to tie, 1.0 to Win

        board difficulty can be based on cascading math
        like this --> https://docs.google.com/spreadsheets/d/1KVfBl_Dp_lMngMY4iAcqNeJu2ChjwcpzLwwPszWe_4k/edit#gid=978404652
        
    }
*/