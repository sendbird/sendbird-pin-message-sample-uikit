import React, { useEffect, useState } from "react";
import {
  ChannelList,
  Channel,
  ChannelSettings,
  sendbirdSelectors,
  useSendbirdStateContext,
} from "@sendbird/uikit-react/";
import CustomizedMessageItem from "./CustomizedMessageItem";
import CustomizedMessageInput from "./CustomizedMessageInput";
import SettingsPinnedMessagesOption from "./SettingsPinnedMessagesOption";

function CustomizedApp({ userId, sb }) {
  const [showSettings, setShowSettings] = useState(false);
  const [channel, setChannel] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const channelUrl = channel ? channel.url : "";
  var channelChatDiv = document.getElementsByClassName("channel-chat")[0];
  const store = useSendbirdStateContext();
  const updateUserMessage = sendbirdSelectors.getUpdateUserMessage(store);

  const renderSettingsBar = () => {
    channelChatDiv.style.width = "52%";
    channelChatDiv.style.cssFloat = "left";
  };

  const hideSettingsBar = () => {
    channelChatDiv.style.width = "76%";
    channelChatDiv.style.cssFloat = "right";
  };

  async function pinMessage(message) {
    await channel.pinMessage(message.messageId);
    getPinnedMessageList();
  }

  //Error -> react-dom.development.js:86 Warning: Cannot update a component (`Accordion`) while rendering a different component (`Context.Consumer`).
  // To locate the bad setState() call inside `Context.Consumer`, follow the stack trace as described in
  async function unpinMessage(message) {
    await channel.unpinMessage(message.messageId);
    getPinnedMessageList();
  }

  //each time a channels selected, load pinnedMsgs
  async function getPinnedMessageList() {
    //everytime this func is called, reset pinnedMessages so you can get updated list of msgs
    setPinnedMessages([]);
    if (channel && channel.pinnedMessageIds) {
      console.log("1. Calling getPinnedMessageList");
      console.log("1A. channel.pinnedMessageIds", channel.pinnedMessageIds);
      await Promise.all(
        channel.pinnedMessageIds.map(async (messageId) => {
          const params = {
            messageId: messageId,
            channelType: channel.channelType,
            channelUrl: channel.url,
          };
          const message = await sb.message.getMessage(params);
          setPinnedMessages((oldArray) => [...oldArray, message]);
        })
      );
    }
  }

  useEffect(() => {
    getPinnedMessageList();
  }, [channel]);

  return (
    <div className="channel-wrap">
      <div className="channel-list">
        <ChannelList
          onChannelSelect={(channel) => {
            setChannel(channel);
          }}
        />
      </div>
      <div className="channel-chat">
        <Channel
          channelUrl={channelUrl}
          onChatHeaderActionClick={() => {
            setShowSettings(!showSettings);
            renderSettingsBar();
          }}
          renderMessage={({ message }) => (
            <CustomizedMessageItem
              message={message}
              userId={userId}
              channel={channel}
              updateUserMessage={updateUserMessage}
              sb={sb}
              pinMessage={pinMessage}
              unpinMessage={unpinMessage}
              getPinnedMessageList={getPinnedMessageList}
            />
          )}
          renderMessageInput={() => (
            <CustomizedMessageInput
              sb={sb}
              getPinnedMessageList={getPinnedMessageList}
            />
          )}
        />
      </div>
      {showSettings && (
        <div className="channel-settings">
          <ChannelSettings
            channelUrl={channelUrl}
            onCloseClick={() => {
              setShowSettings(false);
              hideSettingsBar();
            }}
          />
          <SettingsPinnedMessagesOption
            userId={userId}
            channel={channel}
            updateUserMessage={updateUserMessage}
            sb={sb}
            unpinMessage={unpinMessage}
            getPinnedMessageList={getPinnedMessageList}
            pinnedMessages={pinnedMessages}
          />
        </div>
      )}
    </div>
  );
}

export default CustomizedApp;
