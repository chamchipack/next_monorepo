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
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import PaymentDataGridAtom from "./state";
import { CircleSharp, SearchSharp } from "@mui/icons-material";
import MethodFilter from "./lib/MethodFilter";
import PaymentFilter from "./lib/PaymentFilter";
import moment from "moment";
import { useClientSize } from "package/src/hooks/useMediaQuery";

const PaymentAuditFilter = () => {
  const theme = useTheme();
  const isMobile = useClientSize("sm");
  const searchKeywordRef = useRef<HTMLInputElement>(null);
  const [paymentState, setPaymentState] = useState({
    regular: false,
    package: false,
  });

  const [dataGridPaymentState, setDataGridPaymentState] =
    useRecoilState(PaymentDataGridAtom);

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

      setDataGridPaymentState({
        ...dataGridPaymentState,
        "paymentType.equal": result,
      });
    },
    [paymentState, dataGridPaymentState, setDataGridPaymentState]
  );

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();
      setDataGridPaymentState({
        ...dataGridPaymentState,
        "studentName.like": searchKeywordRef.current?.value,
      });
    }
  };

  useEffect(() => {
    setDataGridPaymentState({
      "paymentDate.like": moment().format("YYYY-MM"),
    });
  }, []);

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
        }}
        sx={{ my: 2 }}
      >
        <Grid style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <PaymentFilter />
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
          <MethodFilter />
        </Grid>

        {!isMobile && (
          <FormControl
            size="small"
            style={{ marginLeft: "auto", maxWidth: "300px" }}
          >
            <OutlinedInput
              id="search"
              inputRef={searchKeywordRef}
              placeholder="결제 수강생의 이름을 입력해주세요"
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
                      setDataGridPaymentState({
                        ...dataGridPaymentState,
                        "studentName.like": searchKeywordRef.current?.value,
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

export default PaymentAuditFilter;
