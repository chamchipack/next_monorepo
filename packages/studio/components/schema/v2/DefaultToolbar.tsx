import { Button, ButtonBase, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { forwardRef, useEffect, useRef, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import QueueIcon from "@mui/icons-material/Queue";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { ButtonOptions, OpenType } from "@/components/v2/Student/hooks";
import { studentDataModel } from "@/config/type/default/students";
import db from "@/api/module";
import json2xlsx from "@/config/utils/xlsx";
import AlertModal from "@/components/v2/Alert/Modal";
import BulkRegister, {
  BulkRegisterHandle,
} from "@/components/v2/Student/lib/BulkRegister";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import { getIsEditable } from "@/config/menu-configure/menu-config";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";
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
    const bulkRegisterRef = useRef<BulkRegisterHandle>(null);
    const handleExternalClick = () => {
      if (bulkRegisterRef.current) {
        bulkRegisterRef.current.onClickRegister();
      }
    };

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [relatedSessions, setRelatedSessions] = useState<any[]>([]); // 상태로 저장
    const editAccessState = useRecoilValue(EditAccessAtom);

    const [bulkOpen, setBulkOpen] = useState(false);
    const handleBulkOpen = () => setBulkOpen(true);
    const handleBulkClose = () => setBulkOpen(false);

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

      const exception = ["id"];

      const result = data.map((item: any, index: number) => {
        const form: any = { 순번: index + 1 };
        const flat: any = flattenObject(item);

        Object.entries(flat).forEach(([k, v]: [string, any]) => {
          if (studentDataModel[k] && !exception.includes(k)) {
            switch (k) {
              case "currentStatus":
                form[studentDataModel[k]] = v ? "재원" : "퇴원";
                break;
              case "paymentType":
                form[studentDataModel[k]] =
                  v === "lesson" ? "회차결제" : "정기결제";
                break;
              case "lessonBasedPayment.isPaid":
                form[studentDataModel[k]] = v ? "결제됨" : "미결제";
                break;
              case "type":
                form[studentDataModel[k]] = v === "lesson" ? "레슨" : "수업";
                break;
              default:
                form[studentDataModel[k]] = v;
            }
          }
        });
        return form;
      });

      json2xlsx(result, "수강생엑셀");
    };

    const onClickDelete = async (id: string) => {
      if (!id) return;

      if (relatedSessions.length)
        return toast.error(
          "연결된 수업이 있어 삭제가 불가능합니다. 먼저 수업을 삭제해주세요"
        );
      setLoading(true);

      try {
        await db.delete(schema, id);
        await delay(1000);

        setLoading(false);
        handleClose();
        setRelatedSessions([]);
        toast.success("정상적으로 처리 되었습니다.");
      } catch (e) {}
    };

    const onClickDeleteSession = async (session: any) => {
      const { id = "" } = session;

      if (!id) return;

      try {
        await db.delete("session", id);
        await db.update("student", { id: selectedRowId, sessionId: [] });
        await delay(1000);
        setRelatedSessions(
          relatedSessions.filter(({ id: _id = [] }) => _id !== id)
        );

        toast.success("정상적으로 세션이 삭제되었습니다.");
      } catch {}
    };

    const fetchRelatedSessions = async () => {
      if (selectedRowId && open) {
        const { data: items = [] } = await db.search("session", {
          options: { "studentId.like": selectedRowId },
        });
        setRelatedSessions(items);
      }
    };

    useEffect(() => {
      fetchRelatedSessions();
    }, [selectedRowId, open]);

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
                handleBulkOpen();
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

        {bulkOpen && (
          <AlertModal
            open={bulkOpen}
            handleClose={handleBulkClose}
            onClickCheck={() => {
              handleExternalClick();
              // if (selectedRowId) onClickDelete(selectedRowId);
            }}
            title={`일괄등록`}
            content={`수강생 데이터를 일괄로 등록합니다.`}
            processing={loading}
          >
            <BulkRegister ref={bulkRegisterRef} />
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
            >
              {relatedSessions.length > 0 && (
                <Box
                  sx={{
                    maxWidth: "100%",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    하단에, 선택된 수강생이 설정된 수업세션이 있습니다
                  </Typography>

                  <Typography
                    component="div"
                    variant="caption"
                    color="text.secondary"
                  >
                    아래 삭제버튼 클릭시{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      color="error.main"
                    >
                      경고문구 없이 즉시 삭제됩니다.
                    </Typography>
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: (theme) => theme.palette.info.light,
                      p: 1,
                      pl: 2,
                      height: 30,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption">
                      {relatedSessions[0]?.name} 수업
                    </Typography>
                    <Box sx={{ width: 30 }}>
                      <ButtonBase
                        onClick={() => {
                          onClickDeleteSession(relatedSessions[0]);
                        }}
                        sx={{
                          background: (theme) =>
                            theme.palette.background.default,
                          borderRadius: 2,
                          p: 0.5,
                        }}
                      >
                        <DeleteForeverIcon
                          sx={{ color: "error.main", fontSize: 18 }}
                        />
                      </ButtonBase>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </AlertModal>
        )}
      </>
    );
  }
);

export default DefaultToolbar;
