import {
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
import { DrawerType, OpenType, buttonOptions } from "../hooks";
import { Student } from "@/config/type/default/students";
import { useEffect, useState } from "react";
import DefaultToolbar from "./DefaultToolbar";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";
import { initialStudentData } from "@/config/type/default/students";
import AntSwitch from "package/src/Interactive/AntSwitch";
import db from "@/api/module";

interface Props {
  data: { rows: Student[]; total: number };
  selectedRow: Student;
  setSelectedRow: React.Dispatch<React.SetStateAction<Student>>;
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerType>>;
  page: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  controlDialog: (type: OpenType) => void;
}

const StudentMobile = ({
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
    setSelectedRow(initialStudentData);
  };

  const regularDate = ({
    lastPaymentDate = "",
    nextDueDate = "",
  }: {
    lastPaymentDate: string;
    nextDueDate: string;
  }) => {};

  if (rendering)
    <>
      {[...Array(3)].map((_, index) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={20}
            sx={{ mb: 0.5, mr: 0.5 }}
          />
        </Box>
      ))}
    </>;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mt: 3,
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
      <Grid
        container
        spacing={2}
        sx={{
          overflowY: "auto",
          minHeight: 500,
          height: "100%",
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
                  setSelectedRow(initialStudentData);
                else setSelectedRow(item);
              }}
              sx={{
                pb: 1,
                maxWidth: "100%",
                background: (theme) => alpha(theme.palette.grey[100], 0.6),
                border: (theme) =>
                  item.id === selectedRow.id
                    ? `2px solid ${theme.palette.info.main}`
                    : `1px solid ${theme.palette.background.default}`,
                borderRadius: 5,
                height: 140,
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
                    {item.name}
                  </Typography>
                  <Chip
                    sx={{ borderWidth: 2 }}
                    size="small"
                    variant="outlined"
                    label={
                      item.paymentType === "regular" ? "정기결제" : "회차결제"
                    }
                    color={item.paymentType === "regular" ? "info" : "warning"}
                  />
                </Box>

                <Box>
                  <AntSwitch
                    trackColor="text.disabled"
                    checked={item.currentStatus}
                    onClick={async () => {
                      try {
                        await db.update("student", {
                          id: item.id,
                          currentStatus: item.currentStatus ? false : true,
                        });
                        // Refresh data after update
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  />
                </Box>
                {item?.paymentType === "regular" ? (
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                    <>
                      <Typography
                        gutterBottom
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        최근 정기결제일{" "}
                        <Typography
                          variant="caption"
                          color="text.primary"
                          component="span"
                        >
                          {item?.regularPayment?.lastPaymentDate ?? ""}
                        </Typography>
                      </Typography>

                      <Typography
                        gutterBottom
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        다음 정기결제일{" "}
                        <Typography
                          variant="caption"
                          color="text.primary"
                          component="span"
                        >
                          {item?.regularPayment?.nextDueDate ?? ""}
                        </Typography>
                      </Typography>
                    </>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: "flex", flexDirection: "row", mt: 3 }}>
                      <Typography
                        gutterBottom
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        남은 레슨 회수{" "}
                        <Typography
                          variant="caption"
                          color="text.primary"
                          component="span"
                        >
                          {item?.lessonBasedPayment?.total ?? 0}회
                        </Typography>
                      </Typography>
                    </Box>
                  </>
                )}
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
  );
};

export default StudentMobile;
