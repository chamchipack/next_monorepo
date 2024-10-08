import CustomNoRowsOverlay from "@/components/common/layout/overlay/DatagridOverlay";
import DefaultGrid from "@/components/schema/v2/DefaultGrid";
import {
  Session,
  initialSessionData,
  LessionTime,
  TimeSet,
  Day,
} from "@/config/type/default/session";
import { Box, Button, Chip, Drawer, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DrawerType, OpenType, buttonOptions } from ".";
import SessionForm from "../SessionForm";
import db from "@/api/module";
import moment from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
import SessionDataGridAtom from "./state";
import DefaultToolbar from "./GridToolbar";
import EditAccessAtom from "@/config/type/access/state";
import AlertModal from "../../Alert/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import SessionFilter from "./SessionFilter";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import useIsRendering from "package/src/hooks/useRenderStatus";
import SessionMobile from "../SessionMobile";

interface SessionRows {
  rows: Session[];
  total: number;
}

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

const SessionGrid = () => {
  const isMobile = useClientSize("sm");
  const isRendering = useIsRendering();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SessionRows>({ rows: [], total: 0 });
  const [selectedRow, setSelectedRow] = useState<Session>(initialSessionData);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const [drawerType, setDrawertype] = useState<OpenType>(OpenType.none);
  const [drawerState, setDrawerState] = useState<DrawerType>(DrawerType.none);
  const editAccessState = useRecoilValue(EditAccessAtom);

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [datagridSessionState, setDatagridSessionState] =
    useRecoilState(SessionDataGridAtom);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "이름",
        width: 100,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "type",
        headerName: "수강 타입",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
          <Chip
            sx={{ borderWidth: 2 }}
            size="small"
            variant="outlined"
            label={params.row.type === "lesson" ? "레슨" : "클래스"}
            color={params.row.type === "lesson" ? "primary" : "success"}
          />
        ),
      },
      {
        field: "regularDays",
        headerName: "수강일",
        width: 130,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          if (!params.row.regularDays) return null;
          return params.row.regularDays.map((item: string) => (
            <Chip
              sx={{ borderWidth: 2, mr: 1 }}
              size="small"
              variant="outlined"
              label={weeks[item]}
              color={["0", "6"].includes(item) ? "error" : "info"}
            />
          ));
        },
      },
      {
        field: "lessonTimes",
        headerName: "수강 시간",
        width: 280,
        headerAlign: "center",
        align: "right",
        renderCell: (params) => {
          if (!params.row.lessonTimes) return null;
          return Object.entries(params.row.lessonTimes).map(
            ([k = "", lessonTime = {}]) => {
              const { stime = "", etime = "" } = lessonTime as {
                stime: string;
                etime: string;
              };
              return (
                <Typography variant="caption" sx={{ mx: 1 }}>
                  <Typography
                    variant="caption"
                    component="span"
                    color={["0", "6"].includes(k) ? "error.main" : "info.main"}
                  >
                    {weeks[k]} :{" "}
                  </Typography>
                  {`${stime as string} ~ ${etime as string}`}
                </Typography>
              );
            }
          );
        },
      },
    ],
    []
  );

  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedRow?.id) return toast.error("선택된 세션이 없습니다!");
    const { regularDays = [], lessonTimes = {} } = selectedRow;

    const filteredLessonTimes: LessionTime = {};

    regularDays.forEach((day) => {
      if (lessonTimes[day]) filteredLessonTimes[day as Day] = lessonTimes[day];
    });

    const submitForm = {
      id: selectedRow?.id,
      regularDays: selectedRow?.regularDays,
      lessonTimes: filteredLessonTimes,
    };

    try {
      await db.update("session", submitForm);

      toast.success("정상적으로 처리 되었습니다.");

      handleClose();

      setSelectedRow(initialSessionData);

      getRows();
      setDrawerState(DrawerType.none);
    } catch (e) {
      toast.error("저장에 실패했습니다!");
    }
    setLoading(false);
  };

  const getRows = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { items = [], totalItems = 0 } = {} } = await db.search(
        "session",
        { pagination, options: { ...datagridSessionState } }
      );

      setRows({ rows: items, total: totalItems });
    } catch {}
    setLoading(false);
  }, [pagination, datagridSessionState]);

  useEffect(() => {
    getRows();
  }, [getRows]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const controlDialog = (toggle: OpenType) => {
    setDrawertype(toggle);

    if (toggle !== OpenType.none) setDrawerState(DrawerType.form);
  };

  const GridToolbar = () => (
    <DefaultToolbar
      buttonOptions={buttonOptions}
      setDrawertype={setDrawertype}
      selectedRowId={selectedRow.id}
      schema="session"
      getRows={getRows}
      controlDialog={controlDialog}
    />
  );
  const NoRowsMessageOverlay = () => (
    <CustomNoRowsOverlay message={"데이터가 존재하지 않습니다!"} />
  );

  return (
    <>
      <SessionFilter />
      {!isMobile ? (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography
              component="span"
              variant="subtitle2"
              color="secondary.dark"
            >
              # 결과 {rows.total ?? 0} 건
            </Typography>
          </Box>
          <DefaultGrid
            slots={{
              noRowsOverlay: NoRowsMessageOverlay,
              toolbar: GridToolbar,
            }}
            paginationMode="server"
            loading={loading}
            rows={{ total: rows.total, data: rows.rows }}
            columns={columns}
            page={pagination.page}
            pageSize={pagination.perPage}
            onPageChange={handlePageChange}
            setPagination={setPagination}
            pageSizeOptions={[10, 20, 30]}
            onRowDoubleClick={(row) => {
              if (!editAccessState) return;
              setDrawertype(OpenType.update);
              setDrawerState(DrawerType.form);
            }}
            onRowSelectionModelChange={([rowId = ""]) => {
              if (!rowId) return;
              const row =
                rows.rows.find(({ id = "" }) => rowId === id) ??
                initialSessionData;
              setSelectedRow(row);
            }}
          />
        </>
      ) : (
        <SessionMobile
          data={rows}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          setDrawerState={setDrawerState}
          page={pagination.page}
          pageSize={pagination.perPage}
          handlePageChange={handlePageChange}
          controlDialog={controlDialog}
        />
      )}

      <Drawer
        open={DrawerType.none !== drawerState}
        onClose={(e, reason: "backdropClick" | "escapeKeyDown") => {
          if (["backdropClick", "escapeKeyDown"].includes(reason)) {
            setDrawerState(DrawerType.none);
          }
        }}
        anchor="right"
      >
        {DrawerType.none !== drawerState && (
          <Box sx={{ background: "white", width: 400, height: "100%", p: 3 }}>
            <SessionForm
              form={
                drawerType === OpenType.create
                  ? initialSessionData
                  : selectedRow
              }
              setForm={setSelectedRow}
            />

            <Button
              variant="contained"
              sx={{
                background: (theme) => theme.palette.primary.main,
                height: "40px",
                width: "100%",
              }}
              onClick={handleOpen}
            >
              <Box style={{ width: "100%", justifyContent: "center" }}>
                <Typography variant="h5" color="inherit" fontWeight="bold">
                  저장
                </Typography>
              </Box>
            </Button>
          </Box>
        )}
      </Drawer>

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => handleSubmit()}
        title={`세션정보 저장`}
        content={`선택한 정보를 저장하시겠습니까?`}
        processing={loading}
      >
        <Box sx={{ minWidth: 80, my: 2 }}></Box>
      </AlertModal>
    </>
  );
};

export default SessionGrid;
