<Grid item className="draw_finishmain">
  <Grid item className="drawfinish_color">
    <Grid
      container
      direction="column"
      justifyContent="center"
      justifyItems="center"
      alignItems="center"
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        justifyItems="center"
        alignItems="center"
      >
        <Grid item>{/* <IoTimerOutline /> */}</Grid>
        <Grid item className="timesup">
          Time's Up
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        justifyItems="center"
        alignItems="center"
        className="wordwas_cont"
      >
        <Grid item className="wordwas">
          The word was
        </Grid>
        <Grid item className="actual_word">
          Umbrella
        </Grid>
      </Grid>
      <Grid container direction="column" className="name_pts_pts">
        <Grid item>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            justifyItems="center"
            alignItems="center"
            className="name_ptscont"
          >
            <Grid item className="name_score">
              name
            </Grid>
            <Grid item className="pts_score">
              +200
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            justifyItems="center"
            alignItems="center"
            className="name_ptscont"
          >
            <Grid item className="name_score">
              Alu Kapoor
            </Grid>
            <Grid item className="pts_score">
              +200
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Grid>;
