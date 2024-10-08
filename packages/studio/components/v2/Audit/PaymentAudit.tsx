import CustomNoRowsOverlay from "@/components/common/layout/overlay/DatagridOverlay";
import DefaultGrid from "@/components/schema/v2/DefaultGrid";
import EditAccessAtom from "@/config/type/access/state";
import { initialPaymentData, Payment } from "@/config/type/default/payment";
import { Box, Chip, Drawer, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import db from "@/api/module";
import PaymentAuditFilter from "./PaymentAuditFilter";
import PaymentDataGridAtom from "./state";
import DefaultToolbar from "./lib/DefaultToolbar";
import { buttonOptions, DrawerType, OpenType } from "./lib";
import PaymentDetailDrawer from "./lib/PaymentDetailDrawer";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import PaymentMobile from "./lib/PaymentMobile";

interface PaymentRows {
  rows: Payment[];
  total: number;
}

const PaymentAudit = () => {
  const [loading, setLoading] = useState(false);
  const isMobile = useClientSize("sm");
  const [rows, setRows] = useState<PaymentRows>({ rows: [], total: 0 });
  const [selectedRow, setSelectedRow] = useState<Payment>(initialPaymentData);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const [drawerType, setDrawertype] = useState<OpenType>(OpenType.none);
  const [drawerState, setDrawerState] = useState<DrawerType>(DrawerType.none);

  const editAccessState = useRecoilValue(EditAccessAtom);
  const [dataGridPaymentState, setDataGridPaymentState] =
    useRecoilState(PaymentDataGridAtom);

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
        field: "paymentDate",
        headerName: "결제일",
        width: 180,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "confirmationDate",
        headerName: "결제처리일",
        width: 180,
        headerAlign: "center",
        align: "center",
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
        headerName: "결제 처리인",
        width: 180,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "method",
        headerName: "결제수단",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const methodMap: Record<
            string,
            { label: string; color: "primary" | "info" | "success" | "warning" }
          > = {
            card: { label: "카드", color: "primary" },
            account: { label: "계좌", color: "info" },
            cash: { label: "현금", color: "success" },
            other: { label: "기타", color: "warning" },
          };

          const { label, color } = methodMap[params.row.method] || {
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
        field: "amount",
        headerName: "금액",
        width: 100,
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
        "payment",
        { pagination, options: { ...dataGridPaymentState } }
      );

      setRows({ rows: items, total: totalItems });
    } catch {}
    setLoading(false);
  }, [pagination, dataGridPaymentState]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const NoRowsMessageOverlay = () => (
    <CustomNoRowsOverlay message={"데이터가 존재하지 않습니다!"} />
  );

  useEffect(() => {
    getRows();
  }, [getRows]);

  const controlDialog = (toggle: OpenType) => {
    setDrawertype(toggle);

    if (toggle !== OpenType.none) setDrawerState(DrawerType.form);
  };

  const GridToolbar = () => (
    <DefaultToolbar
      buttonOptions={buttonOptions}
      setDrawertype={setDrawertype}
      selectedRowId={selectedRow.id}
      schema="payment"
      getRows={getRows}
      controlDialog={controlDialog}
    />
  );

  return (
    <>
      <PaymentAuditFilter />
      {isMobile ? (
        <PaymentMobile
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
                initialPaymentData;
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
            <PaymentDetailDrawer
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

export default PaymentAudit;
