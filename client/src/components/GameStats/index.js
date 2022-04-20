import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Grid, Typography } from "@mui/material";
import { GET_ME, GET_LEADERBOARD } from "../../util/queries";
import Profile from "../Profile";
import Leaderboard from "../Leaderboard";
import {
  ADD_USER_HIGHSCORE,
  ADD_LEADERBOARD_HIGHSCORE,
  DELETE_USER_SCORE,
  DELETE_LEADERBOARD_SCORE,
} from "../../util/mutations";

const GameOverStats = ({ gameState }) => {
  const currentScore = gameState.score;
  const { loading: loadingUser, data, refetch } = useQuery(GET_ME);
  const [addScore] = useMutation(ADD_USER_HIGHSCORE, {
    variables: { currentScore },
    refetchQueries: refetch,
  });
  const [deleteUserScore] = useMutation(DELETE_USER_SCORE);

  const [isHighScore, setIsHighScore] = useState({
    user: false,
    leaderboard: false,
  });

  useEffect(() => {
    console.log(loadingUser);
    if (!loadingUser) {
      let userDataScores = data?.me.highscores || [];
      const scores = userDataScores.map((user) => user.score);

      const lowestScore = scores[0] ? Math.min(...scores) : 0;
      console.log("user Data:", userDataScores);
      console.log("Score: ", scores.sort());
      console.log("Lowest Score: ", lowestScore);

      //if lowest score is beat or there are less than 5 scores...
      if (currentScore > lowestScore || scores.length < 5) {
        

        try {
          //if there are 5 or more scores, remove the lowest score
          if (scores.length >= 5) {
            console.log("Removing lowest score...");
            deleteUserScore();
          }
          setIsHighScore((old) => ({ ...old, user: true }));
          console.log("Adding...");
          //then add the new score
          addScore({
            variables: { score: currentScore },
          });
        } catch (e) {
          throw e;
        }
      }
    }
  }, [loadingUser]);

  const {
    loading: loadingLeaderboard,
    data: leaderboardData,
    refetch: leaderboardRefetch,
  } = useQuery(GET_LEADERBOARD);
  const [AddLeaderboardHighscore] = useMutation(ADD_LEADERBOARD_HIGHSCORE, {
    variables: { currentScore },
    refetchQueries: leaderboardRefetch,
  });

  useEffect(() => {
    console.log(loadingLeaderboard);
    if (!loadingLeaderboard) {
      console.log(leaderboardData);
      let leaderboardDataScores = leaderboardData?.leaderboard.highscores || [];
      console.log(leaderboardDataScores);
      const scores = leaderboardDataScores.map((user) => user.score);

      const lowestScore = scores[0] ? Math.min(...scores) : 0;
      console.log(leaderboardDataScores);
      console.log("LeaderboardScore: ", scores);
      console.log("Leaderboard Lowest Score: ", lowestScore);

      if (currentScore > lowestScore) {
        setIsHighScore((old) => ({ ...old, leaderboard: true }));
        console.log("Adding...");
        try {
          AddLeaderboardHighscore({
            variables: { score: currentScore },
          });
        } catch (e) {
          throw e;
        }
      }
    }
  }, [loadingLeaderboard]);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" sx={{ mt: 10, p: 2 }}>
        {isHighScore.user ? (
          <span>Personal highscore!</span>
        ) : '' }
        <br />
          {isHighScore.leaderboard ? (
          <span> You Made the Leaderboard!</span>
        ) : '' }
      </Typography>
      <Typography variant="subtitle1" align="center">
        Final Score: {currentScore}
      </Typography>
      <Grid container spacing={4} sx={{ padding: 6 }}>
        <Grid item xs={6} align="center">
          <Profile />
        </Grid>
        <Grid item xs={6} align="center">
          <Leaderboard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default GameOverStats;
