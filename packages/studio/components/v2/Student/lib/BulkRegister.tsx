import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";

interface BulkRegisterProps {}

export interface BulkRegisterHandle {
  onClickRegister: () => void;
}

const BulkRegister = forwardRef<BulkRegisterHandle, BulkRegisterProps>(
  (props, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
      }
    };

    const handleFileReset = () => {
      setSelectedFile(null);
    };

    const onClickRegister = useCallback(async () => {
      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const data = event.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: "binary" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log("Converted JSON:", json);
          }
        };

        reader.readAsBinaryString(selectedFile);
      } else {
        console.log("No file selected");
      }
    }, [selectedFile]);

    const downloadTemplate = () => {
      const worksheetData = [
        {
          이름: "이름",
          등록일: "2024-08-01",
          담당강사: "",
          수강타입: "레슨",
          결제타입: "정기결제",
          회차결제시전체회수: 0,
          수업요일: "월,수",
          시간: "14:00~14:30, 15:00~15:30",
        },
      ];
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    useImperativeHandle(ref, () => ({
      onClickRegister,
    }));

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        sx={{ my: 2 }}
      >
        <Button
          variant="contained"
          component="label"
          color="success"
          startIcon={<UploadFileIcon />}
          sx={{ color: "white" }}
        >
          엑셀 업로드하기
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {selectedFile && (
          <Box display="flex" alignItems="center" sx={{ my: 2 }}>
            <Typography variant="caption">{selectedFile.name}</Typography>
            <IconButton
              onClick={handleFileReset}
              color="error"
              aria-label="파일 초기화"
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        <Button
          variant="contained"
          component="label"
          color="info"
          onClick={downloadTemplate}
          startIcon={<SimCardDownloadIcon />}
          sx={{ mt: 2 }}
        >
          엑셀 양식 다운로드
        </Button>
      </Box>
    );
  }
);

export default BulkRegister;
