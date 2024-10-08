import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import SessionDataGridAtom from "./state";
import { CircleSharp, SearchSharp } from "@mui/icons-material";
import DateFilter from "./DateFilter";
import { useClientSize } from "package/src/hooks/useMediaQuery";

const SessionFilter = () => {
  const isMobile = useClientSize("sm");
  const searchKeywordRef = useRef<HTMLInputElement>(null);
  const [typeStatus, setTypeStatus] = useState("lesson");

  const [datagridSessionState, setDatagridSessionState] =
    useRecoilState(SessionDataGridAtom);

  const onClickTypeFilter = (type: string) => {
    setTypeStatus(type);

    setDatagridSessionState({
      ...datagridSessionState,
      "type.like": type,
    });
  };

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();
      setDatagridSessionState({
        ...datagridSessionState,
        "name.like": searchKeywordRef.current?.value,
      });
    }
  };

  useEffect(() => {
    return () => {
      setDatagridSessionState({});
    };
  }, []);

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
        }}
        sx={{ mb: 1 }}
      >
        <Grid style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              background: (theme) => theme.palette.background.default,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              fullWidth
              size="medium"
              variant="outlined"
              sx={{
                minWidth: "50px",
                pl: 1,
                pr: 1,
                mr: 1,
                borderRadius: 4,
                color:
                  typeStatus === "lesson" ? "primary.main" : "text.disabled",
                border: (theme) =>
                  `1px solid ${typeStatus === "lesson" ? theme.palette.primary.main : theme.palette.text.disabled}`,
              }}
              onClick={() => {
                onClickTypeFilter("lesson");
              }}
            >
              레슨
            </Button>
            <Button
              fullWidth
              size="medium"
              variant="outlined"
              sx={{
                minWidth: "50px",
                pl: 1,
                pr: 1,
                mr: 1,
                borderRadius: 4,
                color: typeStatus === "class" ? "info.main" : "text.disabled",
                border: (theme) =>
                  `1px solid ${typeStatus === "class" ? theme.palette.info.main : theme.palette.text.disabled}`,
              }}
              onClick={() => {
                onClickTypeFilter("class");
              }}
            >
              수업
            </Button>
          </Box>
        </Grid>
        <DateFilter />

        {!isMobile && (
          <FormControl
            size="small"
            style={{ marginLeft: "auto", maxWidth: "300px" }}
          >
            <OutlinedInput
              id="search"
              inputRef={searchKeywordRef}
              placeholder="레슨(이름), 수업명을 입력해주세요"
              sx={{
                borderRadius: 8,
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
                "> fieldset": { border: 0 },
              }}
              type="text"
              onKeyDown={handleKeyDownSearch}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setDatagridSessionState({
                        ...datagridSessionState,
                        "name.like": searchKeywordRef.current?.value,
                      })
                    }
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                      e.preventDefault()
                    }
                    aria-label="search"
                  >
                    <SearchSharp color="primary" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        )}
      </Box>
    </>
  );
};

export default SessionFilter;
