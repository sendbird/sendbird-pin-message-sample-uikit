import React from "react";
import './index.css'
import { Card, CardHeader, CardContent, Typography, Avatar } from "@mui/material";

export default function AdminMessage(props) {
  const { message, channel , pinMessage} = props;
  return (
    <div className="admin-message">
      <Card>
      <CardHeader
          subheader = {
            channel.pinnedMessageIds.includes(message.messageId)? "Pinned Admin Message" : "Admin Message"
          }
        />
        <CardContent>
          <Avatar alt="Us" src="https://mpng.subpng.com/20180402/rqq/kisspng-computer-icons-logo-symbol-clip-art-administrator-5ac2ab29825f65.316448641522707241534.jpg" />
          {/* <Typography color="textSecondary">Admin message</Typography> */}
          <Typography variant="body2" component="p">
            {message.message}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}