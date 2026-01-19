'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  RadioButtonUnchecked,
  Send,
} from '@mui/icons-material';

interface SubmitTestDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredQuestions: number;
  loading?: boolean;
}

const SubmitTestDialog: React.FC<SubmitTestDialogProps> = ({
  open,
  onClose,
  onConfirm,
  totalQuestions,
  answeredQuestions,
  loading = false,
}) => {
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const hasUnanswered = unansweredQuestions > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: hasUnanswered ? 'warning.main' : 'primary.main',
        }}
      >
        <Warning />
        Xác nhận nộp bài
      </DialogTitle>

      <DialogContent dividers>
        {hasUnanswered ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn còn câu hỏi chưa trả lời. Các câu này sẽ được tính là sai.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            Bạn đã trả lời tất cả các câu hỏi!
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn nộp bài không?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sau khi nộp, bạn sẽ không thể chỉnh sửa câu trả lời.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Câu đã trả lời"
              secondary={`${answeredQuestions} / ${totalQuestions} câu`}
            />
          </ListItem>
          {hasUnanswered && (
            <ListItem>
              <ListItemIcon>
                <RadioButtonUnchecked color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Câu chưa trả lời"
                secondary={`${unansweredQuestions} câu`}
              />
            </ListItem>
          )}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Kiểm tra lại
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={hasUnanswered ? 'warning' : 'primary'}
          startIcon={<Send />}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Đang nộp...' : 'Nộp bài'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitTestDialog;