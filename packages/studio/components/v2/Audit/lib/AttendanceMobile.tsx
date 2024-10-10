import {
  Alert,
  alpha,
  Box,
  Button,
  CardContent,
  Chip,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConstructionIcon from "@mui/icons-material/Construction";
import { DrawerType, OpenType, buttonOptions } from ".";
import { Attendance } from "@/config/type/default/attendance";
import { useEffect, useState } from "react";
import DefaultToolbar from "./DefaultToolbar";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";
import { initialAttendanceData } from "@/config/type/default/attendance";

const weeks: {
  [key in string]: string;
} = {
  "0": "일",
  "1": "월",
  "2": "화",
  "3": "수",
  "4": "목",
  "5": "금",
  "6": "토",
};

const check: Record<
  string,
  {
    label: string;
    color: "secondary" | "warning" | "success" | "error";
  }
> = {
  present: { label: "정상출석", color: "success" },
  late: { label: "지각", color: "warning" },
  excused: { label: "보강", color: "secondary" },
  absent: { label: "결석", color: "error" },
};

interface Props {
  data: { rows: Attendance[]; total: number };
  selectedRow: Attendance;
  setSelectedRow: React.Dispatch<React.SetStateAction<Attendance>>;
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerType>>;
  page: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  controlDialog: (type: OpenType) => void;
}

const AttendanceMobile = ({
  data,
  page,
  pageSize,
  selectedRow,
  setSelectedRow,
  handlePageChange,
  controlDialog,
}: Props) => {
  const editAccessState = useRecoilValue(EditAccessAtom);
  const [rendering, setRendering] = useState(false);

  const onClickDialog = (type: OpenType) => {
    controlDialog(type);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    handlePageChange(newPage);
    setSelectedRow(initialAttendanceData);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mt: 1,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            component="span"
            variant="subtitle2"
            color="secondary.dark"
          >
            # 결과 {data.total} 건
          </Typography>
        </Box>
        <Box>
          {buttonOptions.register && editAccessState && (
            <Button
              variant="outlined"
              size="medium"
              sx={{
                pl: 1,
                pr: 1,
                mr: 0.5,
                mb: 1,
                borderRadius: 1,
                border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                borderColor: "info.main",
                color: "info.main",
              }}
              onClick={() => {
                onClickDialog(OpenType.create);
              }}
            >
              <AddIcon
                style={{ fontSize: 16 }}
                sx={{
                  mr: 1,
                  background: (theme) => theme.palette.info.main,
                  color: "background.default",
                  borderRadius: 50,
                }}
              />
              등록
            </Button>
          )}

          {buttonOptions.modify && selectedRow.id && editAccessState ? (
            <Button
              variant="outlined"
              size="medium"
              sx={{
                pl: 1,
                pr: 1,
                mr: 0.5,
                mb: 1,
                borderRadius: 1,
                border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                borderColor: "primary.main",
                color: "primary.main",
              }}
              onClick={() => {
                onClickDialog(OpenType.update);
              }}
            >
              <ConstructionIcon
                style={{ fontSize: 16 }}
                sx={{
                  mr: 1,
                  background: (theme) => theme.palette.primary.main,
                  color: "background.default",
                  borderRadius: 50,
                }}
              />
              수정
            </Button>
          ) : null}
        </Box>
      </Box>
      {!data.rows.length ? (
        <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
          <Typography variant="body1">검색 결과가 없습니다.</Typography>
        </Alert>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            sx={{
              overflowY: "hidden",
              minHeight: 400,
            }}
          >
            {data.rows.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`_${item.id}`}
                sx={{ mb: 1, px: 1 }}
              >
                <Box
                  onClick={() => {
                    if (selectedRow?.id === item.id)
                      setSelectedRow(initialAttendanceData);
                    else setSelectedRow(item);
                  }}
                  sx={{
                    pb: 1,
                    maxWidth: "100%",
                    background: (theme) => alpha(theme.palette.info.light, 0.1),
                    border: (theme) =>
                      item.id === selectedRow.id
                        ? `2px solid ${theme.palette.info.main}`
                        : `1px solid ${theme.palette.background.default}`,
                    borderRadius: 5,
                    height: 120,
                  }}
                >
                  <CardContent
                    sx={{
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        component="div"
                        color="text.primary"
                      >
                        {item.studentName}
                      </Typography>
                      <Chip
                        sx={{ borderWidth: 2 }}
                        size="small"
                        variant="outlined"
                        label={
                          item.paymentType === "regular"
                            ? "정기결제"
                            : "회차결제"
                        }
                        color={
                          item.paymentType === "regular" ? "info" : "primary"
                        }
                      />
                    </Box>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      출석일 {item?.attendanceDate}
                    </Typography>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      처리일 {item?.confirmationDate}
                    </Typography>

                    <Chip
                      sx={{ width: 75, mt: 1, height: 20, borderWidth: 2 }}
                      size="small"
                      variant="outlined"
                      label={check[item?.status]?.label}
                      color={check[item?.status]?.color}
                    />
                  </CardContent>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", mt: 1, justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(data.total / pageSize)}
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default AttendanceMobile;
