"use client";
import CustomNoRowsOverlay from "@/components/common/layout/overlay/DatagridOverlay";
import DefaultGrid from "@/components/schema/v2/DefaultGrid";
import { Class, initialClassData } from "@/config/type/default/class";
import { Box, Button, Chip, Drawer, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DrawerType, OpenType, buttonOptions } from "./index";
import db from "@/api/module";
import moment from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
import DefaultToolbar from "./GridToolbar";
import EditAccessAtom from "@/config/type/access/state";
import ClassDataGridAtom from "./state";
import ClassForm from "./lib/ClassForm";

interface ClassRows {
  rows: Class[];
  total: number;
}

const ClassGrid = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ClassRows>({ rows: [], total: 0 });
  const [selectedRow, setSelectedRow] = useState<Class>(initialClassData);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const [drawerType, setDrawertype] = useState<OpenType>(OpenType.none);
  const [drawerState, setDrawerState] = useState<DrawerType>(DrawerType.none);
  const editAccessState = useRecoilValue(EditAccessAtom);

  const [datagridClassState] = useRecoilState(ClassDataGridAtom);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "이름",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "price",
        headerName: "가격",
        width: 150,
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
        "class",
        { pagination, options: { ...datagridClassState } }
      );

      setRows({ rows: items, total: totalItems });
    } catch {}
    setLoading(false);
  }, [pagination, datagridClassState]);

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
      schema="class"
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
            rows.rows.find(({ id = "" }) => rowId === id) ?? initialClassData;
          setSelectedRow(row);
        }}
      />

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
            <ClassForm
              row={
                drawerType === OpenType.create ? initialClassData : selectedRow
              }
              setDrawerState={setDrawerState}
              type={drawerType}
              getRows={getRows}
            />

            {/* <Button
              variant="contained"
              sx={{
                background: (theme) => theme.palette.primary.main,
                height: "40px",
                width: "100%",
              }}
              // onClick={handleOpen}
            >
              <Box style={{ width: "100%", justifyContent: "center" }}>
                <Typography variant="h5" color="inherit" fontWeight="bold">
                  저장
                </Typography>
              </Box>
            </Button> */}
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default ClassGrid;
