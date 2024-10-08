import CustomNoRowsOverlay from "@/components/common/layout/overlay/DatagridOverlay";
import DefaultGrid from "@/components/schema/v2/DefaultGrid";
import { Box, Button, Chip, Drawer, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DrawerType, initialData, OpenType, Row } from "./lib";
import {
  initialInstructorData,
  Instructor,
} from "@/config/type/default/instructor";
import db from "@/api/module";
import DefaultToolbar from "./lib/GridToolbar";
import { buttonOptions } from "./lib";
import InstructorForm from "./lib/InstructorForm";
import AlertModal from "../Alert/Modal";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";

interface InstructorRows {
  rows: Instructor[];
  total: number;
}

const InstructorGrid = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<InstructorRows>({ rows: [], total: 0 });
  const [selectedRow, setSelectedRow] = useState<Row>(initialData);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const [drawerType, setDrawertype] = useState<OpenType>(OpenType.none);
  const [drawerState, setDrawerState] = useState<DrawerType>(DrawerType.none);
  const editAccessState = useRecoilValue(EditAccessAtom);

  const getRows = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { items = [], totalItems = 0 } = {} } = await db.search(
        "instructor",
        { pagination, options: {} }
      );
      setRows({ rows: items, total: totalItems });
    } catch {}
    setLoading(false);
  }, [pagination]);

  useEffect(() => {
    getRows();
  }, [getRows]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "아이디",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "username",
        headerName: "이름",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "isAdmin",
        headerName: "관리자여부",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
          <Chip
            sx={{ borderWidth: 2 }}
            size="small"
            variant="outlined"
            label={params.row.isAdmin ? "관리자" : "일반 사용자"}
            color={params.row.isAdmin ? "info" : "warning"}
          />
        ),
      },
    ],
    []
  );

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const controlDialog = (toggle: OpenType) => {
    setDrawertype(toggle);

    if (toggle !== OpenType.none) setDrawerState(DrawerType.form);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { id = "", name, isAdmin, username, auth = {} } = selectedRow || {};
    const base64Encoded = btoa(
      unescape(encodeURIComponent(JSON.stringify(auth)))
    );
    const form = {
      id,
      name,
      isAdmin,
      username,
      menuAccess: base64Encoded,
    };
    try {
      if (id) await db.update("instructor", form);
      else await db.create("instructor", form);

      toast.success("정상적으로 처리 되었습니다.");
      handleClose();
      getRows();
    } catch {
      toast.error("저장에 실패했습니다.");
    }
    setLoading(false);
    setDrawerState(DrawerType.none);
  };

  const GridToolbar = () => (
    <DefaultToolbar
      buttonOptions={buttonOptions}
      setDrawertype={setDrawertype}
      selectedRowId={selectedRow.id}
      schema="instructor"
      getRows={getRows}
      controlDialog={controlDialog}
    />
  );

  const NoRowsMessageOverlay = () => (
    <CustomNoRowsOverlay message={"데이터가 존재하지 않습니다!"} />
  );
  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Typography component="span" variant="subtitle2" color="secondary.dark">
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
            rows.rows.find(({ id = "" }) => rowId === id) ?? initialData;

          const add = Object.assign(row, { auth: {} });
          setSelectedRow(add);
        }}
      />

      <Drawer
        open={DrawerType.none !== drawerState}
        onClose={(e, reason: "backdropClick" | "escapeKeyDown") => {
          if (["backdropClick", "escapeKeyDown"].includes(reason)) {
            setDrawerState(DrawerType.none);
            setSelectedRow(initialData);
          }
        }}
        anchor="right"
      >
        {DrawerType.none !== drawerState && (
          <Box sx={{ background: "white", width: 400, height: "100%", p: 3 }}>
            <Box sx={{ height: "90%" }}>
              <InstructorForm form={selectedRow} setForm={setSelectedRow} />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  background: (theme) => theme.palette.background.paper,
                  height: "40px",
                  width: "40%",
                }}
                onClick={() => {
                  setDrawerState(DrawerType.none);
                }}
              >
                <Box style={{ width: "100%", justifyContent: "center" }}>
                  <Typography
                    variant="h5"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    취소
                  </Typography>
                </Box>
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: (theme) => theme.palette.primary.main,
                  height: "40px",
                  width: "40%",
                }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Box style={{ width: "100%", justifyContent: "center" }}>
                  <Typography variant="h5" color="inherit" fontWeight="bold">
                    저장
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => handleSubmit()}
        title={`강사 정보 저장`}
        content={`선택한 정보를 저장하시겠습니까?`}
        processing={loading}
      >
        <Box sx={{ minWidth: 80, my: 2 }}></Box>
      </AlertModal>
    </>
  );
};

export default InstructorGrid;
