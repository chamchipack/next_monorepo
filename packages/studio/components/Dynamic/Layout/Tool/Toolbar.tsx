"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Popper, Paper, Fade } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Components as DynamicList } from "@/components/Dynamic";

type Widget = {
  name: string;
  id: string;
  component: () => Promise<React.ComponentType<any>>;
};

type EntriesWidget = [string, Widget[]];

const Toolbar = ({
  setSelectedWidgets,
  onClickSaveLayout,
  onClickCancel,
  setToggle,
}: {
  onClickSaveLayout: () => void;
  onClickCancel: () => void;
  setSelectedWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);
  const [widgetList, setWidgetList] = useState<EntriesWidget[]>([]);
  const anchorRef = useRef(null);
  const popperRef = useRef(null);

  useEffect(() => {
    const list: EntriesWidget[] = Object.entries(DynamicList);

    setWidgetList(list);
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const onClickCanceRedirect = () => {
    setWidgetList([]);
    onClickCancel();
  };

  const handleClickOutside = (event: any) => {
    if (
      anchorRef.current &&
      !anchorRef.current.contains(event.target) // &&
      // popperRef.current &&
      // !popperRef.current.contains(event.target) // Popper 내부 참조 검사 추가
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onClickSelect = (data: Widget) => {
    setSelectedWidgets((prevWidgets) => [...prevWidgets, data]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        border: "2px solid #d2d2d2",
        borderRadius: "10px",
      }}
    >
      <Button
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AddIcon />
        <Typography variant="caption">위젯 선택</Typography>
      </Button>
      <Button
        ref={anchorRef}
        onClick={onClickSaveLayout}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <SaveIcon />
        <Typography variant="caption">저장 하기</Typography>
      </Button>
      <Button
        ref={anchorRef}
        onClick={onClickCanceRedirect}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ArrowBackIcon />
        <Typography variant="caption">뒤로 가기</Typography>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="right-start"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              ref={popperRef}
              sx={{
                border: "1px solid #d2d2d2",
                boxShadow: 3,
                borderRadius: "10px",
                width: "250px",
                marginLeft: "10px",
                padding: "10px",
                backgroundColor: "white",
              }}
            >
              {widgetList.map(([title, data]) => (
                <>
                  <Typography variant="body1">{title}</Typography>
                  {data.map((_data: Widget) => (
                    <Box
                      key={_data.id}
                      sx={{
                        width: "100%",
                        height: "50px",
                        margin: "10px 0 0 0",
                        background: "#f2f2f2",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        sx={{ width: "100%" }}
                        onClick={() => {
                          onClickSelect(_data);
                        }}
                      >
                        {_data.name}
                      </Button>
                    </Box>
                  ))}
                </>
              ))}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Toolbar;
