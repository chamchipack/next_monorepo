import { Day, Session } from "@/config/type/default/session";
import { Alert, Box, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

interface Props {
  sessions: Session[];
}

const today: Day = moment().format("d") as Day;

const DaySession = ({ sessions }: Props) => {
  return (
    <>
      {!sessions.length ? (
        <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
          <Typography variant="body1">출석 대상자가 없습니다.</Typography>
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 3, position: "sticky" }}>
            <Typography color="text.primary">
              오늘 진행되는 수업 세션{" "}
              <Typography component="span" color="error.main">
                {sessions.length}{" "}
              </Typography>
              건
            </Typography>
          </Box>
          <Box sx={{ overflowY: "scroll", height: "90%" }}>
            {sessions.map(({ type = "", name = "", lessonTimes = {} }) => {
              const time = lessonTimes[today] ?? { stime: "", etime: "" };
              const _type = type === "lesson" ? "레슨" : "수업";
              return (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      border: (theme) => `2px solid ${theme.palette.grey[100]}`,
                      borderRadius: 3,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="info.main">
                        {_type}
                        <Typography
                          variant="subtitle2"
                          color="text.primary"
                          component="span"
                          sx={{ mx: 1 }}
                        >
                          {name}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {time?.stime ?? ""} ~ {time?.etime}
                      </Typography>
                    </Box>
                  </Box>
                </>
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};

export default DaySession;
