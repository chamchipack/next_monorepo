import { Button, ButtonBase, Modal, Typography } from "@mui/material";
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
import { studentDataModel } from "@/config/type/default/students";
import { sessionDataModel } from "@/config/type/default/session";
import db from "@/api/module";
import json2xlsx from "@/config/utils/xlsx";
import AlertModal from "@/components/v2/Alert/Modal";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";
import { DaysOfWeek } from "@/config/type/default/attendance";
type Schema =
  | "student"
  | "session"
  | "class"
  | "attendance"
  | "payment"
  | "instructor";

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

    const writeExcelFile = async () => {
      const { data = [] } = await db.search(schema, { options: {} });
      if (!data.length) return;

      const exception = ["id", "flexibleSchedule"];

      const result = data.map((item: any, index: number) => {
        const form: any = { 순번: index + 1 };
        // const flat: any = flattenObject(item);

        Object.entries(item).forEach(([k, v]: [string, any]) => {
          if (sessionDataModel[k] && !exception.includes(k)) {
            switch (k) {
              case "lessonTimes":
                form[sessionDataModel[k]] = Object.entries(v)
                  .map(([key, time]) => {
                    const { stime = "", etime = "" } = time as {
                      stime: string;
                      etime: string;
                    };
                    return `${DaysOfWeek[key]}: ${stime} ~ ${etime}`;
                  })
                  .join(", ");
                break;
              case "regularDays":
                form[sessionDataModel[k]] = Array.isArray(v)
                  ? v.map((item) => DaysOfWeek[item]).join(", ")
                  : DaysOfWeek[v] || "";
                break;
              case "type":
                form[sessionDataModel[k]] = v === "lesson" ? "레슨" : "수업";
                break;
              default:
                form[sessionDataModel[k]] = v;
            }
          }
        });
        return form;
      });

      json2xlsx(result, "세션엑셀");
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
      } catch (e) {
        toast.error("오류가 발생했습니다.");
      }
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
              onClick={writeExcelFile}
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

          {buttonOptions.modify && selectedRowId && editAccessState ? (
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
