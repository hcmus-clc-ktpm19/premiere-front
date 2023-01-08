import React from 'react';
import { Alert } from '@mui/material';

type Props = {
  isShow: boolean;
  content: string | undefined;
  type: 'success' | 'danger' | 'warning' | 'info';
};
const AlertModal: ({ isShow, content, type }: Props) => false | (() => JSX.Element | null) = ({
  isShow,
  content,
  type,
}) => {
  return (
    isShow &&
    (() => {
      switch (type) {
        case 'success':
          return (
            <Alert variant='filled' severity='success'>
              {content}
            </Alert>
          );
        case 'warning':
          return (
            <Alert variant='filled' severity='warning'>
              {content}
            </Alert>
          );
        case 'danger':
          return (
            <Alert variant='filled' severity='error'>
              {content}
            </Alert>
          );
        case 'info':
          return (
            <Alert variant='filled' severity='info'>
              {content}
            </Alert>
          );
        default:
          return null;
      }
    })
  );
};

export { AlertModal };
