import { useRecoilState } from "recoil";
import AttendanceDataAtom from "./state";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  useTheme,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { CircleSharp, SearchSharp } from "@mui/icons-material";

const Model = [
  {
    text: "날짜검색",
    value: "date",
    icon: ApartmentIcon,
    theme: "warning",
  },
  {
    text: "이름검색",
    value: "name",
    icon: DirectionsCarIcon,
    theme: "info",
  },
];

const AttendanceFilter = () => {
  const theme = useTheme();
  const [category, setCategory] = useState<string>("date");

  const onClickCategoryButton = async (item: string) => {
    const result = item === category ? "" : item;
    setCategory(result);
  };
  const searchKeywordRef = useRef<HTMLInputElement>(null);

  const [attendanceDataState, setAttendanceDataState] =
    useRecoilState(AttendanceDataAtom);

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();
      setAttendanceDataState({
        "name.like": searchKeywordRef.current?.value,
      });
    }
  };

  return (
    <>
      {category === "date" ? (
        <FormControl fullWidth size="small">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mx: 1,
            }}
          >
            <TextField
              id="schedule-end"
              type="date"
              value={attendanceDataState["attendanceDate"]}
              onChange={(e) =>
                setAttendanceDataState({
                  attendanceDate: e.target.value as string,
                })
              }
              sx={{
                borderColor: "#d2d2d2",
                borderRadius: 1,
                height: 40,
              }}
              InputProps={{
                style: { height: 40 },
              }}
            />
          </Box>
        </FormControl>
      ) : (
        <FormControl
          size="small"
          style={{ marginLeft: "auto", maxWidth: "300px" }}
        >
          <OutlinedInput
            id="search"
            inputRef={searchKeywordRef}
            placeholder="수강생 이름을 입력해주세요"
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
                    setAttendanceDataState({
                      ...attendanceDataState,
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
      {/* </Box> */}
    </>
  );
};

export default AttendanceFilter;
