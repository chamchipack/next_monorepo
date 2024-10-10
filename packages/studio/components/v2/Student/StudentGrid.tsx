"use client";
import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Drawer,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import DefaultGrid from "@/components/schema/v2/DefaultGrid";
import DefaultToolbar from "./lib/DefaultToolbar";
import CustomNoRowsOverlay from "@/components/common/layout/overlay/DatagridOverlay";
import AntSwitch from "package/src/Interactive/AntSwitch";
import { GridColDef } from "@mui/x-data-grid";
import { useStudentData } from "./hooks/hook";
import { OpenType, DrawerType, buttonOptions } from "./hooks";
import EditAccessAtom from "@/config/type/access/state";
import { initialStudentData } from "@/config/type/default/students";
import Form from "./drawer/DrawerForm";
import db from "@/api/module";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import StudentMobile from "./lib/StudentMobile";

const StudentGrid = ({ total = 0 }) => {
  const isMobile = useClientSize("sm");

  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const [selectedRow, setSelectedRow] = useState(initialStudentData);
  const [drawerType, setDrawertype] = useState<OpenType>(OpenType.none);
  const [drawerState, setDrawerState] = useState<DrawerType>(DrawerType.none);

  const editAccessState = useRecoilValue(EditAccessAtom);

  const {
    data = { rows: [], total },
    isLoading,
    refetch,
  } = useStudentData("student", pagination);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const controlDialog = (toggle: OpenType) => {
    setDrawertype(toggle);
    if (toggle !== OpenType.none) setDrawerState(DrawerType.form);

    if (toggle === "update") {
      const row =
        data.rows.find(({ id = "" }) => selectedRow.id === id) ??
        initialStudentData;
      setSelectedRow(row);
    }
  };

  const GridToolbar = () => (
    <DefaultToolbar
      buttonOptions={buttonOptions}
      setDrawertype={setDrawertype}
      selectedRowId={selectedRow.id}
      schema="student"
      getRows={() => {
        refetch();
      }}
      controlDialog={controlDialog}
    />
  );

  const NoRowsMessageOverlay = () => (
    <CustomNoRowsOverlay message={"데이터가 존재하지 않습니다!"} />
  );

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
        field: "enrollmentDate",
        headerName: "등록일",
        width: 150,
        headerAlign: "center",
        align: "left",
      },
      {
        field: "type",
        headerName: "수강 타입",
        width: 100,
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
        field: "currentStatus",
        headerName: "등록상태",
        type: "string",
        width: 100,
        headerAlign: "left",
        align: "center",
        renderCell: ({ row: { id, currentStatus = "" } = {} }) => (
          <AntSwitch
            trackColor="text.disabled"
            checked={currentStatus}
            onClick={async () => {
              try {
                await db.update("student", {
                  id,
                  currentStatus: currentStatus ? false : true,
                });
                // Refresh data after update
              } catch (e) {
                console.error(e);
              }
            }}
          />
        ),
      },
      {
        field: "lastPaymentDate",
        headerName: "최근결제일",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: ({ row: { regularPayment = {} } = {} }) => {
          return regularPayment?.lastPaymentDate ?? "-";
        },
      },
      {
        field: "regularPayment",
        headerName: "다음 예상결제일",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: ({ row: { regularPayment = {} } = {} }) => {
          return regularPayment?.nextDueDate ?? "-";
        },
      },
      {
        field: "lessonBasePayment",
        headerName: "회차 결제여부",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: ({
          row: { paymentType, lessonBasedPayment = {} } = {},
        }) => {
          if (paymentType === "package")
            return lessonBasedPayment?.isPaid ? (
              <CheckIcon sx={{ color: "success.main" }} />
            ) : (
              <NotificationImportantIcon sx={{ color: "error.main" }} />
            );
          else return "";
        },
      },
    ],
    []
  );

  return (
    <div>
      {!isMobile ? (
        <>
          <Box sx={{ ml: 1, mb: 1, mt: isMobile ? 2 : 0 }}>
            <Typography
              component="span"
              variant="subtitle2"
              color="secondary.dark"
            >
              # 결과 {data.total} 건
            </Typography>
          </Box>
          {isLoading ? (
            <Skeleton sx={{ width: "100%", height: 250 }} />
          ) : (
            <DefaultGrid
              slots={{
                noRowsOverlay: NoRowsMessageOverlay,
                toolbar: GridToolbar,
              }}
              paginationMode="server"
              loading={isLoading}
              rows={{ total: data.total, data: data.rows }}
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
                  data.rows.find(({ id = "" }) => rowId === id) ??
                  initialStudentData;
                setSelectedRow(row);
              }}
            />
          )}
        </>
      ) : (
        <StudentMobile
          data={data}
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
          <Box
            sx={{
              background: "white",
              width: isMobile ? 350 : 400,
              height: "100%",
            }}
          >
            <Form
              row={
                drawerType === OpenType.create
                  ? initialStudentData
                  : selectedRow
              }
              setDrawerState={setDrawerState}
              type={drawerType}
              getRows={refetch}
            />
          </Box>
        )}
      </Drawer>
    </div>
  );
};

export default StudentGrid;
