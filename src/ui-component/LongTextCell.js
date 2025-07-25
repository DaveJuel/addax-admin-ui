import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import truncate from 'html-truncate';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import formatTitle from 'utils/title-formatter';

const MAX_LENGTH = 100; // Number of visible characters before truncation

export const LongTextCell = ({ attribute, value }) => {
  const [open, setOpen] = useState(false);

  const cleanHTML = DOMPurify.sanitize(value || '');
  const truncatedHTML = truncate(cleanHTML, MAX_LENGTH);

  const isTruncated = cleanHTML.length > truncatedHTML.length;

  return (
    <>
      <div
        style={{ maxWidth: 300, wordBreak: 'break-word' }}
      />
      {isTruncated && (
        <Typography
          variant="body2"
          color="primary"
          onClick={() => setOpen(true)}
          style={{ cursor: 'pointer', marginTop: 4 }}
        >
          Click To Read
        </Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Full {formatTitle (attribute.name)}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
