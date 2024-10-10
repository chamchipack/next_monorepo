"use client";
import { useRecoilState } from "recoil";
import StudentDataGridAtom from "./hooks/state";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Skeleton,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import styles from "./student.module.css";

import SearchInput from "package/src/Interactive/Input/SearchInput";

const StudentFilter = () => {
  const theme = useTheme();
  const isMobile = useClientSize("sm");

  const searchKeywordRef = useRef<HTMLInputElement>(null);

  const [statusState, setStatusState] = useState({ O: false, R: false });
  const [clickStatus, setClickStatus] = useState(false);
  const [paymentState, setPaymentState] = useState({
    regular: false,
    package: false,
  });
  const [lessonPaidState, setLessonPaidState] = useState<boolean>(false);
  const [datagridStudentState, setDatagridStudentState] =
    useRecoilState(StudentDataGridAtom);

  const onClickStatusFilter = useCallback(
    (key: "O" | "R") => {
      const newStatus = { ...statusState, [key]: !statusState[key] };

      const result =
        newStatus.O && !newStatus.R
          ? true
          : !newStatus.O && newStatus.R
            ? false
            : null;

      setStatusState(newStatus);

      setDatagridStudentState({
        ...datagridStudentState,
        "currentStatus.like": result,
      });
    },
    [statusState, datagridStudentState, setDatagridStudentState]
  );

  const onClickPaymentFilter = useCallback(
    (key: "regular" | "package") => {
      const newStatus = { ...paymentState, [key]: !paymentState[key] };

      const result =
        newStatus.regular && !newStatus.package
          ? "regular"
          : !newStatus.regular && newStatus.package
            ? "package"
            : null;

      setPaymentState(newStatus);

      setDatagridStudentState({
        ...datagridStudentState,
        "paymentType.equal": result,
      });
    },
    [paymentState, datagridStudentState, setDatagridStudentState]
  );

  const onClickPackagePaymentRequiered = useCallback(
    (toggle: boolean) => {
      setLessonPaidState(toggle);
      const result = toggle ? !toggle : null;

      setDatagridStudentState({
        ...datagridStudentState,
        "lessonBasedPayment.isPaid.like": result,
      });
    },
    [lessonPaidState, datagridStudentState, setDatagridStudentState]
  );

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();
      setDatagridStudentState({
        ...datagridStudentState,
        "name.like": searchKeywordRef.current?.value,
      });
    }
  };

  const onClickInputBase = () => {
    if (clickStatus)
      setDatagridStudentState({
        ...datagridStudentState,
        "name.like": "",
      });
    setClickStatus(!clickStatus);
  };

  useEffect(() => {
    return () => {
      setDatagridStudentState({});
    };
  }, []);

  // if (!isRendering)
  //   return (
  //     <>
  //       <Box sx={{ display: "flex", flexDirection: "row" }}>
  //         <Skeleton sx={{ width: 100, height: 30, mr: 1 }} />
  //         <Skeleton sx={{ width: 100, height: 30, mr: 1 }} />
  //         <Skeleton sx={{ width: 100, height: 30 }} />
  //       </Box>
  //       <Skeleton sx={{ width: "100%", height: 30 }} />
  //     </>
  //   );

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          justifyContent: "space-between",
        }}
        sx={{ mt: isMobile ? 0 : 3 }}
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
                color: statusState.O ? "primary.main" : "text.disabled",
                border: (theme) =>
                  `1px solid ${statusState.O ? theme.palette.primary.main : theme.palette.text.disabled}`,
              }}
              onClick={() => {
                onClickStatusFilter("O");
              }}
            >
              재원
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
                color: statusState.R ? "info.main" : "text.disabled",
                border: (theme) =>
                  `1px solid ${statusState.R ? theme.palette.info.main : theme.palette.text.disabled}`,
              }}
              onClick={() => {
                onClickStatusFilter("R");
              }}
            >
              퇴원
            </Button>
          </Box>

          <>
            <Box
              sx={{
                background: (theme) => theme.palette.background.default,
                width: "100%",
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
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.8,
                  },
                  minWidth: "70px",
                  pl: 1,
                  pr: 1,
                  mr: 1,
                  borderRadius: 4,
                  color: "text.secondary",
                  borderColor: (theme) =>
                    paymentState.regular
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                  background: (theme) =>
                    paymentState.regular
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                }}
                onClick={() => {
                  onClickPaymentFilter("regular");
                }}
              >
                정기결제
              </Button>
              <Button
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.8,
                  },
                  minWidth: "70px",
                  pl: 1,
                  pr: 1,
                  mr: 1,
                  borderRadius: 4,
                  color: "text.secondary",
                  borderColor: (theme) =>
                    paymentState.package
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                  background: (theme) =>
                    paymentState.package
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                }}
                onClick={() => {
                  onClickPaymentFilter("package");
                }}
              >
                회차결제
              </Button>
            </Box>
            <div className={styles["responsive-web"]} style={{ width: "100%" }}>
              <Box
                sx={{
                  background: (theme) => theme.palette.background.default,
                  width: "100%",
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
                    "&:hover": {
                      bgcolor: theme.palette.info.light,
                      borderColor: theme.palette.info.light,
                      opacity: 0.8,
                    },
                    minWidth: "90px",
                    pl: 1,
                    pr: 1,
                    mr: 1,
                    borderRadius: 4,
                    color: lessonPaidState
                      ? "background.paper"
                      : "text.secondary",
                    borderColor: (theme) =>
                      lessonPaidState
                        ? theme.palette.info.main
                        : theme.palette.background.paper,
                    background: (theme) =>
                      lessonPaidState
                        ? theme.palette.info.main
                        : theme.palette.background.paper,
                  }}
                  onClick={() => {
                    onClickPackagePaymentRequiered(
                      lessonPaidState ? false : true
                    );
                  }}
                >
                  <CheckIcon
                    style={{ fontSize: 12 }}
                    sx={{
                      mr: 1,
                      fontSize: "12px",
                      color: (theme) => theme.palette.background.default,
                      background: theme.palette.warning.main,
                      borderRadius: 50,
                    }}
                  />
                  회차결제 필요여부
                </Button>
              </Box>
            </div>
          </>
          <div className={styles["responsive-mobile"]}>
            <IconButton
              onClick={onClickInputBase}
              sx={{
                border: (theme) =>
                  `1px solid ${clickStatus ? "black" : theme.palette.grey[200]}`,
                background: (theme) => (clickStatus ? "black" : "white"),
                borderRadius: "8px", // 약간의 곡선이 있는 정사각형
                width: 26, // 버튼의 가로/세로 크기를 동일하게 설정
                height: 26,
                "&:hover": {
                  backgroundColor: "#e0e0e0", // hover 시 배경색
                },
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: 20,
                  color: clickStatus ? "white" : "text.primary",
                }}
              />{" "}
            </IconButton>
          </div>
        </Grid>

        <div
          className={styles["responsive-web"]}
          style={{ justifyContent: "flex-end" }}
        >
          <SearchInput
            searchKeywordRef={searchKeywordRef}
            placeholder="이름을 입력해주세요"
            borderRadius={8}
            borderColor={theme.palette.primary.main}
            onSearchClick={() => {
              setDatagridStudentState({
                ...datagridStudentState,
                "name.like": searchKeywordRef.current?.value,
              });
            }}
            onKeyDown={handleKeyDownSearch}
            buttonColor="primary"
          />
        </div>
      </Box>

      {isMobile && clickStatus && (
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            width: "100%",
            padding: "1px 2px",
          }}
        >
          <InputBase
            inputRef={searchKeywordRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder="이름을 입력해주세요."
            inputProps={{ "aria-label": "search" }}
            onKeyDown={handleKeyDownSearch}
          />
          <IconButton
            sx={{ p: "4px" }}
            aria-label="search"
            onClick={() =>
              setDatagridStudentState({
                ...datagridStudentState,
                "name.like": searchKeywordRef.current?.value,
              })
            }
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.preventDefault()
            }
          >
            <SearchIcon sx={{ color: "text.primary" }} /> {/* 돋보기 아이콘 */}
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default StudentFilter;
