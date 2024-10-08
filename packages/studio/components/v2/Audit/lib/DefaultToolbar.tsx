import {
  Button,
  ButtonBase,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { forwardRef, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import QueueIcon from "@mui/icons-material/Queue";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { ButtonOptions, OpenType } from "@/components/v2/Student/hooks";
import { PaymentDataModel, Payment } from "@/config/type/default/payment";
import {
  AttendanceDataModel,
  Attendance,
  DaysOfWeek,
} from "@/config/type/default/attendance";
import db from "@/api/module";
import json2xlsx from "@/config/utils/xlsx";
import AlertModal from "@/components/v2/Alert/Modal";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";
import moment from "moment";
type Schema =
  | "student"
  | "session"
  | "class"
  | "attendance"
  | "payment"
  | "instructor";

type DataForm = Payment[] | Attendance[];

interface Props {
  buttonOptions: ButtonOptions;
  setDrawertype: React.Dispatch<React.SetStateAction<OpenType>>;
  selectedRowId: string | undefined;
  schema: Schema;
  getRows: () => void;
  controlDialog: (type: OpenType) => void;
}
const DefaultToolbar = forwardRef(
  ({
    buttonOptions,
    setDrawertype,
    selectedRowId,
    schema,
    getRows,
    controlDialog,
  }: Props) => {
    const session = useSession();
    const editAccessState = useRecoilValue(EditAccessAtom);

    const [exportDate, setExportDate] = useState({
      sdate: moment().subtract(1, "month").format("YYYY-MM-DD"),
      edate: moment().format("YYYY-MM-DD"),
    });

    const [openExcel, setOpenExcel] = useState(false);
    const handleExcelOpen = () => setOpenExcel(true);
    const handleExcelClose = () => setOpenExcel(false);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      getRows();
    };

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const onClickDialog = (type: OpenType) => {
      controlDialog(type);
    };

    function flattenObject(obj: any, parentKey = "", result: any = {}): any {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = parentKey ? `${parentKey}.${key}` : key;

          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            flattenObject(obj[key], newKey, result);
          } else {
            result[newKey] = obj[key];
          }
        }
      }
      return result;
    }

    const makePaymentExcel = async (data: DataForm) => {
      const exception = ["id", "classId", "studentId", "sessionId"];
      const method: { [key: string]: string } = {
        card: "카드",
        cash: "현금",
        account: "계좌",
        other: "기타",
      };

      const payment = data.map((item: any, index: number) => {
        const form: any = { 순번: index + 1 };

        Object.entries(item).forEach(([k, v]: [string, any]) => {
          if (PaymentDataModel[k] && !exception.includes(k)) {
            switch (k) {
              case "method":
                form[PaymentDataModel[k]] = method[v as string];
                break;
              case "paymentType":
                form[PaymentDataModel[k]] =
                  v !== "regular" ? "회차결제" : "정기결제";
                break;
              default:
                form[PaymentDataModel[k]] = v;
            }
          }
        });
        return form;
      });

      json2xlsx(payment, "결제이력");
    };
    const makeAttendanceExcel = async (data: DataForm) => {
      const exception = ["id", "classId", "studentId", "sessionId"];
      const status: { [key: string]: string } = {
        present: "정상출석",
        late: "지각",
        excused: "보강",
        absent: "결석",
      };
      const attendanceExcel = data.map((item: any, index: number) => {
        const form: any = { 순번: index + 1 };

        Object.entries(item).forEach(([k, v]: [string, any]) => {
          if (AttendanceDataModel[k] && !exception.includes(k)) {
            switch (k) {
              case "dayOfWeek":
                form[AttendanceDataModel[k]] = DaysOfWeek[v as string] || "";
                break;
              case "status":
                form[AttendanceDataModel[k]] = status[v as string];
                break;
              case "paymentType":
                form[AttendanceDataModel[k]] =
                  v !== "regular" ? "회차결제" : "정기결제";
                break;
              default:
                form[AttendanceDataModel[k]] = v;
            }
          }
        });
        return form;
      });

      json2xlsx(attendanceExcel, "출석이력");
    };

    const writeExcelFile = async () => {
      const { sdate = "", edate = "" } = exportDate;
      if (!sdate || !edate) return toast.error("기간을 선택해주세요!");

      const form = schema === "payment" ? "paymentDate" : "attendanceDate";
      const dateFormat = {
        [`${form}.lte`]: moment(edate).add(1, "day").format("YYYY-MM-DD"),
        [`${form}.gte`]: moment(sdate).format("YYYY-MM-DD"),
      };

      const { data = [] } = await db.search(schema, {
        options: { ...dateFormat },
      });
      if (!data.length) return;

      const dataset: DataForm = data;

      if (schema === "payment") makePaymentExcel(dataset);
      if (schema === "attendance") makeAttendanceExcel(dataset);

      setOpenExcel(false);
    };

    const onClickDelete = async (id: string) => {
      if (!id) return;

      setLoading(true);

      try {
        await db.delete(schema, id);
        await delay(1000);

        setLoading(false);
        handleClose();
        toast.success("정상적으로 처리 되었습니다.");
      } catch (e) {}
    };

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            mt: 1,
          }}
        >
          {buttonOptions.excel && (
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
                borderColor: "success.main",
                color: "success.main",
              }}
              // onClick={writeExcelFile}
              onClick={() => setOpenExcel(true)}
            >
              <DocumentScannerIcon
                style={{ fontSize: 16 }}
                sx={{
                  mr: 1,
                  background: (theme) => theme.palette.success.main,
                  color: "background.default",
                  borderRadius: 50,
                }}
              />
              엑셀출력
            </Button>
          )}

          {buttonOptions.batchExcel && (
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
                borderColor: "warning.main",
                color: "warning.main",
              }}
              onClick={() => {
                // onClickDialog("batch");
              }}
            >
              <QueueIcon
                style={{ fontSize: 16 }}
                sx={{
                  mr: 1,
                  background: (theme) => theme.palette.warning.main,
                  color: "background.default",
                  borderRadius: 50,
                }}
              />
              일괄등록
            </Button>
          )}

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

          {buttonOptions.modify &&
          selectedRowId &&
          session?.data?.user?.isAdmin ? (
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

          {buttonOptions.delete && selectedRowId && editAccessState ? (
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
                borderColor: "error.main",
                color: "error.main",
              }}
              onClick={handleOpen}
            >
              <DeleteForeverIcon
                style={{ fontSize: 16 }}
                sx={{
                  mr: 1,
                  background: (theme) => theme.palette.error.main,
                  color: "background.default",
                  borderRadius: 50,
                }}
              />
              삭제
            </Button>
          ) : null}
        </Box>

        {openExcel && (
          <AlertModal
            open={openExcel}
            handleClose={handleExcelClose}
            onClickCheck={() => {
              writeExcelFile();
              // if (selectedRowId) onClickDelete(selectedRowId);
            }}
            title={`엑셀 출력`}
            content={`엑셀 출력 기간을 선택해주세요`}
            processing={loading}
          >
            <Box
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", mx: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  시작일
                </Typography>
                <TextField
                  id="schedule-end"
                  type="date"
                  value={exportDate.sdate ?? ""}
                  onChange={(e) => {
                    setExportDate((prev) => ({
                      ...prev,
                      sdate: e.target.value as string,
                    }));
                  }}
                  sx={{
                    borderColor: "#d2d2d2",
                    borderRadius: 1,
                    height: 20,
                    fontSize: 12,
                  }}
                  InputProps={{
                    style: { color: "black", height: 30, fontSize: 12 },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  종료일
                </Typography>
                <TextField
                  id="schedule-end"
                  type="date"
                  value={exportDate.edate ?? ""}
                  onChange={(e) => {
                    setExportDate((prev) => ({
                      ...prev,
                      edate: e.target.value as string,
                    }));
                  }}
                  sx={{
                    borderColor: "#d2d2d2",
                    borderRadius: 1,
                    height: 20,
                    fontSize: 12,
                  }}
                  InputProps={{
                    style: { color: "black", height: 30, fontSize: 12 },
                  }}
                />
              </Box>
            </Box>
          </AlertModal>
        )}

        {open && (
          <AlertModal
            open={open}
            handleClose={handleClose}
            onClickCheck={() => {
              if (selectedRowId) onClickDelete(selectedRowId);
            }}
            title={`데이터 삭제`}
            content={`선택된 데이터는 영구적으로 삭제됩니다.`}
            processing={loading}
          >
            <Box
              sx={{
                my: 2,
                display: "flex",
                justifyContent: "center",
              }}
            ></Box>
          </AlertModal>
        )}
      </>
    );
  }
);

export default DefaultToolbar;
