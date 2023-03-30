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
    pinMessage,
    unpinMessage,
    pinnedMessages,
    setPinnedMessages,
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
          pinMessage={pinMessage}
          unpinMessage={unpinMessage}
          pinnedMessages={pinnedMessages}
          setPinnedMessages={setPinnedMessages}
        />
      );
    }
    return () => <div />;
  }, [message, userId, channel, updateUserMessage, pinMessage]);

  return (
    <div id={message.messageId} className="customized-message-item">
      <MessageHOC />
      <br />
    </div>
  );
}
