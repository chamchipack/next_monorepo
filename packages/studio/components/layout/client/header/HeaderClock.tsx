import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

const HeaderClock = () => {
  const [headerTime, setHeaderTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHeaderTime(`${formattedDate}  ${formattedTime}  |`);
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{
          color: "text.primary",
        }}
      >
        {headerTime}
      </Typography>
    </>
  );
};

export default HeaderClock;
