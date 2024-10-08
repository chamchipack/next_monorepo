import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const ProgressDialog = ({ open, onClose, title, children }: any) => {
  return (
    <Dialog 
          open={open} onClose={onClose}
          aria-labelledby="loading-dialog-title"
          PaperProps={{
          style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden', // 스크롤바가 나타나지 않도록 설정
          },
          }}
    >
        <CircularProgress size={100} style={{ margin: 'auto', display: 'block', color: 'white' }} />
    </Dialog>
  );
};

export default ProgressDialog;
