import React from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

interface Props {
  open: boolean;
  onClose: () => void;
  children: any;
}
const AlertModal = ({ open, onClose, children }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ background: "transparent" }}
        sx={{ width: "100%" }}
      >
        {children}
      </Box>
    </Dialog>
  );
};

export default AlertModal;
