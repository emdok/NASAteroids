import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { GET_ME, GET_LEADERBOARD } from '../../util/queries';
import {
  ADD_USER_HIGHSCORE,
  ADD_LEADERBOARD_HIGHSCORE,
} from '../../util/mutations';

const GameOverStats = ({ gameState }) => {
  //states
  const [userScoreDisplay, setUserScoreDisplay] = useState([]);
  const [notification, setNotification] = useState(
    <span>Nothing here yet!</span>
  );

  //leaderboard data
  // const { data: leaderboardData } = useQuery(GET_LEADERBOARD);
  // const leaderboardHighscores = leaderboardData.leaderboard.highscores;

  //logged in user data
  const { data: userData } = useQuery(GET_ME);
  const userHighscores = userData.me.highscores;

  //current score
  const currentScore = gameState.score;

  //* ADD USER SCORE
  const [addUserHighscore] = useMutation(ADD_USER_HIGHSCORE);

  //Handle user score submit
  async function handleUserScoreSubmit() {
    //add userhighscore
    try {
      await addUserHighscore({
        variables: { score: currentScore },
      });
      // do we have more than 5 user highscores?
      // if (userHighscores.length >= 5) {
        //create array of userHighscores.score's and math.min
        const scores = userHighscores.map((highscore) => highscore.score);
        const lowestScore = Math.min(...scores);
        //find index of lowest score and delete
        const lowestTest = userHighscores.indexOf(lowestScore);
        console.log('index of lowest score?', lowestTest);
      // }
      setUserScoreDisplay(userHighscores);
    } catch (err) {
      console.error(err);
    }
  }

  // is user's current score higher than previous and 0?
  useEffect(() => {
    if (
      userHighscores.find(
        (score) => score >= currentScore || currentScore === 0
      )
    ) {
      setNotification(<span>Better luck next time!</span>);
    } else {
      handleUserScoreSubmit();
      setNotification(<span>Congratulations, new high score!</span>);
    }
  }, []);

  return (
    <TableContainer>
      <Table sx={{ textTransform: 'uppercase' }} aria-label="simple table">
        <TableBody>
          <TableRow key="GameStats" sx={{ '& td': { border: 0 } }}>
            <TableCell scope="row" align="left" sx={{ p: 0.25 }}>
              Final Score:
            </TableCell>
            <TableCell align="center" sx={{ p: 0.25 }}>
              {currentScore} points
            </TableCell>
            <TableCell align="center" sx={{ p: 0.25 }}>
              {notification}
            </TableCell>
            <TableCell align="center" sx={{ p: 0.25 }}>
              <ul>
                {Object.keys(userScoreDisplay).map((index) => {
                  const score = userScoreDisplay[index];
                  return userScoreDisplay ? (
                    <li>
                      ${score.date}, ${score.score}
                    </li>
                  ) : (
                    ''
                  );
                })}
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GameOverStats;
