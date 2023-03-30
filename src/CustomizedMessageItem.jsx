import React, { useMemo } from "react";
import AdminMessage from "./MessageItems/AdminMessage";
import FileMessage from "./MessageItems/FileMessage";
import UserMessage from "./MessageItems/UserMessage";
import "./index.css";

export default function CustomizedMessageItem(props) {
  const {
    message,
    userId,
    channel,
    updateUserMessage,
    sb,
    pinMessage,
    unpinMessage,
    getPinnedMessageList,
  } = props;

  const MessageHOC = useMemo(() => {
    if (message.isAdminMessage && message.isAdminMessage()) {
      return () => (
        <AdminMessage
          message={message}
          channel={channel}
          pinMessage={pinMessage}
          unpinMessage={unpinMessage}
        />
      );
    } else if (message.isFileMessage && message.isFileMessage()) {
      return () => (
        <FileMessage
          message={message}
          userId={userId}
          channel={channel}
          pinMessage={pinMessage}
          unpinMessage={unpinMessage}
        />
      );
    } else if (message.isUserMessage && message.isUserMessage()) {
      return () => (
        <UserMessage
          message={message}
          userId={userId}
          updateUserMessage={updateUserMessage}
          channel={channel}
          sb={sb}
          pinMessage={pinMessage}
          unpinMessage={unpinMessage}
          getPinnedMessageList={getPinnedMessageList}
        />
      );
    }
    return () => <div />;
  }, [message, userId, channel, updateUserMessage, sb, pinMessage]);

  return (
    <div id={message.messageId} className="customized-message-item">
      <MessageHOC />
      <br />
    </div>
  );
}
