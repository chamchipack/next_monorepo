import { Dialog } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const ProgressDialog = ({ open, onClose }: any) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="loading-dialog-title"
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden",
        },
      }}
    >
      <CircularProgress
        size={100}
        style={{ margin: "auto", display: "block", color: "white" }}
      />
    </Dialog>
  );
};

export default ProgressDialog;
