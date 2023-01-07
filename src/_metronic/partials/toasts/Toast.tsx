import React, { SyntheticEvent } from 'react';
import { Alert, AlertColor, AlertTitle, Slide, SlideProps, Snackbar } from '@mui/material';

type Props = {
  isShow: boolean;
  content: string;
  type: AlertColor;
  onClose: (event: Event | SyntheticEvent<Element, Event>) => void;
};
type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction='left' />;
}

const Toast: ({ isShow, content, type, onClose }: Props) => JSX.Element = ({
  isShow,
  content,
  type,
  onClose,
}) => {
  console.log('toast', isShow, content, type, onClose);
  return isShow ? (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={TransitionLeft}
      open={isShow}
      onClose={onClose}>
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        <AlertTitle>New Message</AlertTitle>
        {content} — <strong>check it out!</strong>
      </Alert>
    </Snackbar>
  ) : (
    <></>
  );
};

export {Toast};