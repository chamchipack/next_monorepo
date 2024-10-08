import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Popover,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";

import { useRecoilState } from "recoil";
import PaymentDataGridAtom from "../state";

// import RentHashtagAtom from "./state/Hashtag";

interface RentRentDataGridStates {
  where: Record<string, unknown>;
}

interface Props {
  setDataGridPaymentState: React.Dispatch<
    React.SetStateAction<RentRentDataGridStates>
  >;
}

const MethodFilter = ({ }) => {
  // const [hashtagState, setHashtagState] = useRecoilState(RentHashtagAtom);
  const [dataGridPaymentState, setDataGridPaymentState] =
    useRecoilState(PaymentDataGridAtom);

  const theme = useTheme();
  const [category, setCategory] = useState<string[]>([]);

  const [anchorSts, setAnchorSts] = useState<HTMLButtonElement | null>(null);

  const handleClickSts = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorSts(event.currentTarget);
  };

  const handleCloseSts = () => setAnchorSts(null);

  const openSts = Boolean(anchorSts);
  const idSts = openSts ? "simple-popoversts" : undefined;

  const onClickCategoryButton = async (item: string) => {
    let data: string[] = [];
    if (category.includes(item)) data = category.filter((f) => f !== item);
    else data = [...category, item];

    setCategory(data);

    const { "method.or": method, ...rest } = dataGridPaymentState;

    if (!data.length) setDataGridPaymentState({ ...rest });
    else setDataGridPaymentState({ ...rest, "method.or": data });
  };

  return (
    <>
      <Box>
        <Button
          size="small"
          sx={{
            minWidth: 140,
            color: "text.primary",
            borderRadius: 4,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
          onClick={handleClickSts}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontSize="13px"
          >
            결제방법
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.disabled"
            sx={{ mx: 0.7 }}
          >
            {" "}
            |
          </Typography>
          <Typography variant="subtitle2" color="info.main" fontSize="13px">
            선택
            <Typography
              component="span"
              color="info.main"
              fontSize="13px"
              sx={{ ml: 0.5 }}
            >
              {!category.length ? "전체" : category.length}
            </Typography>
          </Typography>
        </Button>
        <Popover
          id={idSts}
          open={openSts}
          anchorEl={anchorSts}
          onClose={handleCloseSts}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              background: (theme) => theme.palette.background.default,
              p: 2,
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <Box
              sx={{
                borderBottom: (theme) =>
                  `2px solid ${theme.palette.secondary.light}`,
                p: 1,
              }}
            >
              <Typography variant="h6" sx={{ color: "text.secondary" }}>
                결제방법
              </Typography>
            </Box>
            <Box style={{ display: "flex", flexWrap: "wrap" }} sx={{ mt: 1 }}>
              {[
                { value: "card", name: "카드" },
                { value: "cash", name: "현금" },
                { value: "account", name: "계좌입금" },
                { value: "other", name: "기타" },
              ].map((item) => (
                <Box key={item.name}>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{
                      pl: 1,
                      pr: 1,
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                        opacity: 0.8,
                      },
                      borderColor: category.includes(item.value)
                        ? theme.palette.primary.main
                        : "#D2D2D2",
                      color: category.includes(item.value)
                        ? "primary.contrastText"
                        : theme.palette.text.secondary,
                      bgcolor: category.includes(item.value)
                        ? theme.palette.primary.main
                        : theme.palette.grey["A100"],
                      borderRadius: 4,
                      mr: 0.5,
                      mb: 1,
                    }}
                    onClick={async () => {
                      onClickCategoryButton(item.value);
                    }}
                  >
                    {item.name}
                    {category.includes(item.value) ? (
                      <CloseIcon sx={{ ml: 0.5, fontSize: "15px" }} />
                    ) : null}
                  </Button>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                borderTop: (theme) =>
                  `2px solid ${theme.palette.secondary.light}`,
                display: "flex",
                flexDirection: "row",
              }}
            ></Box>
          </Box>
        </Popover>
      </Box>
    </>
  );
};

export default MethodFilter;
