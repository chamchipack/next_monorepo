import CustomNoRowsOverlay from "@/components/common/layout/overlay/DatagridOverlay";
import DefaultGrid from "@/components/schema/v2/DefaultGrid";
import EditAccessAtom from "@/config/type/access/state";
import { Box, Chip, Drawer, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import db from "@/api/module";
import PaymentAuditFilter from "./PaymentAuditFilter";
import AttendanceDataGridAtom from "./lib/state";
import DefaultToolbar from "./lib/DefaultToolbar";
import { buttonOptions, DrawerType, OpenType } from "./lib";
import {
  Attendance,
  initialAttendanceData,
  AttendanceDataModel,
} from "@/config/type/default/attendance";
import AttendanceAuditFilter from "./lib/AttendanceAuditFilter";
import AttendDetailDrawer from "./lib/AttendDetailDrawer";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import AttendanceMobile from "./lib/AttendanceMobile";

interface AttendanceRows {
  rows: Attendance[];
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

const AttendanceAuditGrid = () => {
  const isMobile = useClientSize("sm");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AttendanceRows>({ rows: [], total: 0 });
  const [selectedRow, setSelectedRow] = useState<Attendance>(
    initialAttendanceData
  );
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const [drawerType, setDrawertype] = useState<OpenType>(OpenType.none);
  const [drawerState, setDrawerState] = useState<DrawerType>(DrawerType.none);

  const editAccessState = useRecoilValue(EditAccessAtom);
  const [dataGridAttendanceState, setDataGridAttendanceState] = useRecoilState(
    AttendanceDataGridAtom
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "studentName",
        headerName: "이름",
        width: 100,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "attendanceDate",
        headerName: "출석일",
        width: 180,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "confirmationDate",
        headerName: "출석처리일시",
        width: 180,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "dayOfWeek",
        headerName: "수강 요일",
        width: 130,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          if (!params.row.dayOfWeek) return null;
          return (
            <Chip
              sx={{ borderWidth: 2, mr: 1 }}
              size="small"
              variant="outlined"
              label={weeks[params.row.dayOfWeek]}
              color={
                ["0", "6"].includes(params.row.dayOfWeek)
                  ? "error"
                  : "secondary"
              }
            />
          );
        },
      },
      {
        field: "paymentType",
        headerName: "수강정보",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
          <Chip
            sx={{ borderWidth: 2 }}
            size="small"
            variant="outlined"
            label={
              params.row.paymentType === "regular" ? "정기결제" : "회차결제"
            }
            color={params.row.paymentType === "regular" ? "info" : "warning"}
          />
        ),
      },
      {
        field: "confirmationId",
        headerName: "출석 처리인",
        width: 180,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "status",
        headerName: "출석 상태",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const methodMap: Record<
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

          const { label, color } = methodMap[params.row.status] || {
            label: "알수없음",
            color: "default" as "primary",
          };

          return (
            <Chip
              sx={{ borderWidth: 2 }}
              size="small"
              variant="outlined"
              label={label}
              color={color}
            />
          );
        },
      },
      {
        field: "excusedDate",
        headerName: "보강날짜",
        width: 180,
        headerAlign: "center",
        align: "center",
      },
    ],
    []
  );

  const getRows = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { items = [], totalItems = 0 } = {} } = await db.search(
        "attendance",
        {
          pagination,
          options: { ...dataGridAttendanceState },
          sort: { key: "attendanceDate", method: "desc" },
        }
      );

      setRows({ rows: items, total: totalItems });
    } catch {}
    setLoading(false);
  }, [pagination, dataGridAttendanceState]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const NoRowsMessageOverlay = () => (
    <CustomNoRowsOverlay message={"데이터가 존재하지 않습니다!"} />
  );

  useEffect(() => {
    getRows();
  }, [getRows, dataGridAttendanceState]);

  const controlDialog = (toggle: OpenType) => {
    setDrawertype(toggle);

    if (toggle !== OpenType.none) setDrawerState(DrawerType.form);
  };

  const GridToolbar = () => (
    <DefaultToolbar
      buttonOptions={buttonOptions}
      setDrawertype={setDrawertype}
      selectedRowId={selectedRow.id}
      schema="attendance"
      getRows={getRows}
      controlDialog={controlDialog}
    />
  );

  return (
    <>
      <AttendanceAuditFilter />
      {isMobile ? (
        <AttendanceMobile
          data={rows}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          setDrawerState={setDrawerState}
          page={pagination.page}
          pageSize={pagination.perPage}
          handlePageChange={handlePageChange}
          controlDialog={controlDialog}
        />
      ) : (
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
                initialAttendanceData;
              setSelectedRow(row);
            }}
          />
        </>
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
          <Box sx={{ background: "white", width: 400, height: "100%" }}>
            <AttendDetailDrawer
              row={selectedRow}
              setDrawerState={setDrawerState}
              type={drawerType}
              getRows={getRows}
            />
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default AttendanceAuditGrid;
