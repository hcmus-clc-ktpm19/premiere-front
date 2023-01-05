import React, {FC, SyntheticEvent} from 'react';
import {Alert, AlertColor, AlertTitle, Slide, SlideProps, Snackbar} from "@mui/material";
import {Link} from "react-router-dom";


type Props = {
  isShow: boolean;
  content: string;
  type: AlertColor;
  onClose: (event: Event | SyntheticEvent<Element, Event>) => void;
  destination: string;
};
type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}
const Toast: FC<Props> = ({isShow, content, type, onClose, destination = '/'}) => {
  console.log("Toast", isShow, content, type, onClose, destination);
  return (
      isShow && (
          <Snackbar
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
              TransitionComponent={TransitionLeft}
              open={isShow}
              onClose={onClose}>
            <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
              <AlertTitle>New Message</AlertTitle>
              {content} —
              <Link to={destination}><strong> check it out!</strong></Link>
            </Alert>
          </Snackbar>
      )
  );
};

export {Toast};