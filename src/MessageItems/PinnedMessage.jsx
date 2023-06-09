import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import "./index.css";

export default function PinnedMessage(props) {
  const {
    pinnedMessages,
    setPinnedMessages,
    message,
    userId,
    updateUserMessage,
    channel,
    unpinMessage,
  } = props;
  const [messageText, changeMessageText] = useState(message.message);
  const [messageOptions, setMessageOptions] = useState(false);
  const [pressedUpdate, setPressedUpdate] = useState(false);

  const clickedDropdown = () => {
    if (message.sender.userId === userId) {
      setMessageOptions(!messageOptions);
    }
  };

  const onDeleteMessage = () => {
    channel.deleteMessage(message);
    let updatedPinnedMessagesList = pinnedMessages.filter((pinnedMessage) => {
      return pinnedMessage.messageId !== message.messageId;
    });
    setPinnedMessages(updatedPinnedMessagesList);
  };

  async function updateMessageText(messageId, messageText) {
    const userMessageParams = {};
    userMessageParams.message = messageText;
    await updateUserMessage(channel, messageId, userMessageParams)
      .then((message) => {
        let updatedPinnedMessagesList = pinnedMessages.map((pinnedMessage) => {
          return pinnedMessage.messageId !== messageId
            ? pinnedMessage
            : message;
        });
        setPinnedMessages(updatedPinnedMessagesList);
      })
      .catch((error) => {
        console.log("error=", error);
      });
    setPressedUpdate(false);
    setMessageOptions(!messageOptions);
  }

  return (
    <div className="pinned-message">
      <Card>
        <CardHeader
          avatar={
            message.sender ? (
              <Avatar alt="Us" src={message.sender.plainProfileUrl} />
            ) : (
              <Avatar className="pinned-message__avatar">Us</Avatar>
            )
          }
          title={
            message.sender
              ? message.sender.nickname || message.sender.userId
              : "(No name)"
          }
          subheader={
            channel.pinnedMessageIds.includes(message.messageId)
              ? "Pinned Message"
              : undefined
          }
        />
        <CardContent>
          {!pressedUpdate && (
            <Typography variant="body2" component="p">
              {message.message}
            </Typography>
          )}
          {pressedUpdate && (
            <div className="pinned-message__text-area">
              <TextField
                multiline
                variant="filled"
                rowsmax={4}
                value={messageText}
                onChange={(event) => {
                  changeMessageText(event.target.value);
                }}
              />
            </div>
          )}
        </CardContent>
        <button className="pinned-message__options-btn" onClick={clickedDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path
              className="icon-more_svg__fill"
              d="M32 45.333a5.333 5.333 0 110 10.666 5.333 5.333 0 010-10.666zM32 28a5.333 5.333 0 110 10.668A5.333 5.333 0 0132 28zm0-17.333c2.946 0 5.333 2.387 5.333 5.333S34.946 21.333 32 21.333 26.667 18.946 26.667 16s2.387-5.333 5.333-5.333z"
              fill="#000"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
        {messageOptions && (
          <div className="message-options-wrap">
            <ul className="sendbird_dropdown_menu">
              {message.sender && message.sender.userId === userId && (
                <div>
                  {pressedUpdate && (
                    <li
                      className="dropdown__menu-item"
                      onClick={() =>
                        updateMessageText(message.messageId, messageText)
                      }
                    >
                      <span className="dropdown__menu-item-text">Save</span>
                    </li>
                  )}
                  {pressedUpdate && (
                    <li
                      className="dropdown__menu-item"
                      onClick={() => setPressedUpdate(false)}
                    >
                      <span className="dropdown__menu-item-text">Cancel</span>
                    </li>
                  )}

                  {!pressedUpdate && (
                    <li
                      className="dropdown__menu-item"
                      onClick={() => {
                        setPressedUpdate(true);
                      }}
                    >
                      <span className="dropdown__menu-item-text">Edit</span>
                    </li>
                  )}
                  {!pressedUpdate && (
                    <li
                      className="dropdown__menu-item"
                      onClick={() => onDeleteMessage(message)}
                    >
                      <span className="dropdown__menu-item-text">Delete</span>
                    </li>
                  )}
                  {!pressedUpdate &&
                    channel.pinnedMessageIds.includes(message.messageId) && (
                      <li
                        id="unpin_message_button"
                        className="unpin_message_button"
                        onClick={() => {
                          unpinMessage(message);
                          setMessageOptions(!messageOptions);
                        }}
                      >
                        <span className="unpin_message_text">
                          Unpin Message
                        </span>
                      </li>
                    )}
                </div>
              )}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
