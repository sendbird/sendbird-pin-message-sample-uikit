import React, { useState } from "react";
import "./index.css";
import PinnedMessageList from "./PinnedMessageList";
import IconButton from "@mui/material/IconButton";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SettingsPinnedMessagesOption({
  userId,
  channel,
  updateUserMessage,
  unpinMessage,
  getPinnedMessageList,
  pinnedMessages,
  setPinnedMessages,
}) {
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  function showPinnedMessageList() {
    setShowPinnedMessages(!showPinnedMessages);
    if (showPinnedMessages) {
      getPinnedMessageList();
    }
  }

  return (
    <div>
      <div
        className="sendbird-channel-settings_pinned-messages"
        onClick={showPinnedMessageList}
      >
        <div
          className="sendbird-channel-settings__panel-icon-left sendbird-channel-settings__panel-pin-message sendbird-icon sendbird-icon-pin-message sendbird-icon-color--error"
          role="button"
          tabIndex="0"
        >
          <IconButton
            sx={{ color: "#7B53EF" }}
            aria-label="Example"
            className="pinned-message-list-button"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </IconButton>
        </div>
        <span className="sendbird-label sendbird-label--subtitle-1 sendbird-label--color-onbackground-1">
          Pinned Messages
        </span>
      </div>
      {showPinnedMessages && (
        <PinnedMessageList
          showPinnedMessageList={showPinnedMessageList}
          pinnedMessages={pinnedMessages}
          setPinnedMessages={setPinnedMessages}
          userId={userId}
          updateUserMessage={updateUserMessage}
          channel={channel}
          unpinMessage={unpinMessage}
        />
      )}
    </div>
  );
}
