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
// import {
//   sendbirdSelectors,
//   useSendbirdStateContext,
// } from "@sendbird/uikit-react/";
import GroupChannelHandler from "@sendbird/uikit-react/handlers/GroupChannelHandler";
import { useChannelContext } from "@sendbird/uikit-react/Channel/context";

export default function UserMessage(props) {
  const {
    message,
    userId,
    updateUserMessage,
    channel,
    sb,
    pinMessage, //-> remove if pinMessage function stays in this file
    unpinMessage,
  } = props;
  const [messageText, changeMessageText] = useState(message.message);
  const [messageOptions, setMessageOptions] = useState(false);
  const [pressedUpdate, setPressedUpdate] = useState(false);
  const channelStore = useChannelContext();
  const messagesDispatcher = channelStore?.messagesDispatcher;
  //const store = useSendbirdStateContext();
  //const onPinnedMessageUpdated = sendbirdSelectors.onPinnedMessageUpdated(store);

  const clickedDropdown = () => {
    if (message.sender.userId === userId) {
      setMessageOptions(!messageOptions);
    }
  };

  // let UNIQUE_HANDLER_ID = `${message.messageId}`;
  // const groupChannelHandler = new GroupChannelHandler();
  // sb.groupChannel.addGroupChannelHandler(
  //   UNIQUE_HANDLER_ID,
  //   groupChannelHandler
  // );
  // groupChannelHandler.onPinnedMessageUpdated = async (channel, event) => {
  //  // console.log("channel", channel);
  //   //console.log("event=", event);
  //   console.log('msgg ids',channel.pinnedMesageIds);
  //   messagesDispatcher({
  //     type: "ON_MESSAGE_UPDATED",
  //     payload: { channel, message },
  //   });
  // };

  async function onPinMessage(message) {
    // const pinned =
    await channel.pinMessage(message.messageId);
    // console.log("pinned response=", pinned);
    console.log("Succeeded, msg=", message);
    // console.log('pinned message ids=', channel.pinnedMessageIds);

    //if message  isPinnedMessage true, then design message like X

    // updateUserMessage(channel, message.messageId)
    // .then((message) => {
    //   console.log("message=", message);
    // })
    // .catch((error) => {
    //   console.log("error=", error);
    // });

    setMessageOptions(!messageOptions);
  }

  const onDeleteMessage = () => {
    channel.deleteMessage(message);
  };

  return (
    <div className="user-message">
      <Card>
        <CardHeader
          avatar={
            message.sender ? (
              <Avatar alt="Us" src={message.sender.plainProfileUrl} />
            ) : (
              <Avatar className="user-message__avatar">Us</Avatar>
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
            <div className="user-message__text-area">
              <TextField
                multiline
                variant="filled"
                rowsMax={4}
                value={messageText}
                onChange={(event) => {
                  changeMessageText(event.target.value);
                }}
              />
            </div>
          )}
        </CardContent>
        <button className="user-message__options-btn" onClick={clickedDropdown}>
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
                        updateUserMessage(message.messageId, messageText)
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
                    !channel.pinnedMessageIds.includes(message.messageId) && (
                      <li
                        id="suggest_task_button"
                        className="suggest_task_button"
                        onClick={() => onPinMessage(message)}
                      >
                        <span className="suggest_task_button">Pin Message</span>
                      </li>
                    )}
                  {!pressedUpdate &&
                    channel.pinnedMessageIds.includes(message.messageId) && (
                      <li
                        id="suggest_task_button"
                        className="suggest_task_button"
                        onClick={() => {
                          unpinMessage(message);
                          setMessageOptions(!messageOptions);
                        }}
                      >
                        <span className="suggest_task_button">
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
