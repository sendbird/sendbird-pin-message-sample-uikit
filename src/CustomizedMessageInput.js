import React, { useState } from "react";
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import { useChannelContext } from "@sendbird/uikit-react/Channel/context";

function CustomizedMessageInput({ pinMessage }) {
  const store = useSendbirdStateContext();
  const sendUserMessage = sendbirdSelectors.getSendUserMessage(store);
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(store);
  const channelStore = useChannelContext();
  const channel = channelStore?.currentGroupChannel;
  const disabled = channelStore?.disabled;
  const [inputText, setInputText] = useState("");
  const [sendingPinnedMessage, setSendingPinnedMessage] = useState("");
  const isInputEmpty = inputText.length < 1;

  const handleChange = (event) => {
    if (event?.target?.value?.startsWith(`/pin `)) {
      setInputText(event.target.value);
      setSendingPinnedMessage(true);
    } else {
      setInputText(event.target.value);
    }
  };

  const sendFileMessage_ = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      if (event.target.files[0].size > 1 * 1000 * 1000) {
        alert("Image size greater than 1 MB");
        return;
      }
      const params = {};
      params.file = event.target.files[0];
      sendFileMessage(channel, params)
        .onSucceeded((message) => {
          event.target.value = "";
        })
        .onFailed((error) => {
          console.log(error.stack);
        });
    }
  };

  const checkSendUserMessage = (event) => {
    if (sendingPinnedMessage) {
      sendPinnedMessage();
    } else {
      const params = {};
      params.message = inputText;
      sendUserMessage(channel, params)
        .onSucceeded((message) => {
          setInputText("");
        })
        .onFailed((error) => {
          console.log(error.message);
        });
    }
  };

  async function sendPinnedMessage() {
    const userMessageParams = {};
    userMessageParams.message = inputText.substring(5);
    sendUserMessage(channel, userMessageParams)
      .onSucceeded(async (message) => {
        pinMessage(message.messageId);
        setInputText("");
      })
      .onFailed((error) => {
        console.log(error.message);
      });
    setSendingPinnedMessage(false);
  }

  return (
    <div className="customized-message-input">
      <FormControl variant="outlined" disabled={disabled} fullWidth>
        <InputLabel htmlFor="customized-message-input">User Message</InputLabel>
        <OutlinedInput
          id="customized-message-input"
          type="txt"
          value={inputText}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.code === "Enter") {
              checkSendUserMessage();
            }
          }}
          labelwidth={105}
          endAdornment={
            <InputAdornment position="end">
              {isInputEmpty ? (
                <div className="customized-message-input__file-container">
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    className={"display: none"}
                    onChange={sendFileMessage_}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      disabled={disabled}
                    >
                      <AttachFileIcon
                        color={disabled ? "disabled" : "primary"}
                      />
                    </IconButton>
                  </label>
                </div>
              ) : (
                <IconButton disabled={disabled} onClick={checkSendUserMessage}>
                  <SendIcon color={disabled ? "disabled" : "primary"} />
                </IconButton>
              )}
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
}

export default CustomizedMessageInput;
