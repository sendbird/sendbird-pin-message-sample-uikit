import React from "react";
import "./index.css";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Button,
  Link,
  Typography,
} from "@mui/material";

export default function FileMessage(props) {
  const { message, userId, channel, pinMessage } = props;

  const onDeleteMessage = () => {
    channel.deleteMessage(message);
  };

  return (
    <div className="file-message">
      <Card>
        <CardHeader
          avatar={
            message.sender ? (
              <Avatar alt="Fi" src={message.sender.profileUrl} />
            ) : (
              <Avatar className="file-message__avatar">Fi</Avatar>
            )
          }
          title={
            message.sender
              ? message.sender.nickname || message.sender.userId
              : "(No name)"
          }
          subheader = {
            channel.pinnedMessageIds.includes(message.messageId)? "Pinned File Message" : "File Message"
          }
        />
        <CardContent>
          <CardMedia
            title="File thumbnail"
            image={message.thumbnails[0] || message.url}
          />
          <Link href={message.url}>
            <Typography>Download</Typography>
          </Link>
        </CardContent>
        {message.sender && message.sender.userId === userId && (
          <CardActions>
            <Button
              variant="contained"
              size="small"
              onClick={() => onDeleteMessage(message)}
            >
              Delete
            </Button>
          </CardActions>
        )}
      </Card>
    </div>
  );
}
