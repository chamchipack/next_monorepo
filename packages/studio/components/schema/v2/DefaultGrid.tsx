import {
  DataGrid,
  GridColDef,
  GridFeatureMode,
  GridLocaleText,
  GridPaginationModel,
  GridRowModel,
  GridRowParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { useEffect, useState, forwardRef } from "react";

interface Rows {
  total: number;
  data: GridRowModel[];
}

interface Pagination {
  page: number;
  perPage: number;
}

interface Props {
  columns: GridColDef[];
  rows: Rows;
  paginationMode: GridFeatureMode;
  slots: any;
  page: number;
  loading: boolean;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  onRowDoubleClick: (params: GridRowParams) => void;
  onRowSelectionModelChange: (selectionModel: GridRowSelectionModel) => void;
}

const DefaultGrid = forwardRef(
  ({
    rows,
    columns,
    page,
    pageSize,
    onPageChange,
    setPagination,
    ...props
  }: Props) => {
    const handleChangePage = (
      event: React.ChangeEvent<unknown>,
      newPage: number
    ) => {
      onPageChange(newPage);
    };

    const handlePageChange = (model: GridPaginationModel) => {
      setPagination({ page: model.page + 1, perPage: model.pageSize });
    };

    const localeText: Partial<GridLocaleText> = {
      footerRowSelected: (count) => `${count.toLocaleString()}개의 행 선택`,
      MuiTablePagination: {
        labelRowsPerPage: "페이지 당 행:", // 여기에 원하는 텍스트로 변경
      },
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            {...props}
            rowCount={rows.total}
            rows={rows.data}
            columns={columns}
            paginationModel={{ page: page - 1, pageSize }}
            onPaginationModelChange={handlePageChange}
            localeText={localeText}
            sx={{
              height: 700,
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: (theme) => theme.palette.primary.light,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", mt: 1, justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(rows.total / pageSize)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </Box>
    );
  }
);

export default DefaultGrid;
