import React from "react";
import UserMessage from "./UserMessage";
import PinnedMessage from "./PinnedMessage";
export default function PinnedMessageList({
  showPinnedMessageList,
  pinnedMessages,
  userId,
  updateUserMessage,
  channel,
  sb,
  unpinMessage,
  getPinnedMessageList,
}) {
  return (
    <div className="bg-modal" style={{ display: "flex" }}>
      <div className="modal-content pinned_message_list">
        <div
          className="pinned_message_list_close_btn"
          onClick={() => showPinnedMessageList(false)}
        >
          +
        </div>
        <h3 id="pinned_message_list_title">Pinned Messages</h3>
        {pinnedMessages.length !== 0 &&
          pinnedMessages.map(function (message) {
            return (
              <div
                key={message.messageId}
                className="sendbird-channel-settings_pin-message-wrapper"
              >
                <PinnedMessage
                  getPinnedMessageList={getPinnedMessageList}
                  message={message}
                  userId={userId}
                  updateUserMessage={updateUserMessage}
                  channel={channel}
                  sb={sb}
                  unpinMessage={unpinMessage}
                />
              </div>
            );
          })}
        {pinnedMessages.length === 0 && (
          <h4 className="no-pinned-messages-title">No pinned messages</h4>
        )}
      </div>
    </div>
  );
}
