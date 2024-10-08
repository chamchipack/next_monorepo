import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const ModalComponent = ({ open, onClose, title, children }: any) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          background: (theme) => theme.palette.background.default,
          fontSize: 14,
          pt: 3,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        style={{
          width: "500px",
          height: "45vh",
          paddingLeft: "3rem",
          paddingRight: "3rem",
        }}
        sx={{
          background: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
