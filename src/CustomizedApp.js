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

  async function unpinMessage(message) {
    await channel.unpinMessage(message.messageId);
    let updatedPinnedMessagesList = pinnedMessages.filter((pinnedMessage) => {
      return pinnedMessage.messageId !== message.messageId;
    });
    setPinnedMessages(updatedPinnedMessagesList);
  }

  async function getPinnedMessageList() {
    setPinnedMessages([]);
    if (channel && channel.pinnedMessageIds) {
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
              pinMessage={pinMessage}
              unpinMessage={unpinMessage}
              pinnedMessages={pinnedMessages}
              setPinnedMessages={setPinnedMessages}
            />
          )}
          renderMessageInput={() => (
            <CustomizedMessageInput
              pinMessage={pinMessage}
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
            unpinMessage={unpinMessage}
            getPinnedMessageList={getPinnedMessageList}
            pinnedMessages={pinnedMessages}
            setPinnedMessages={setPinnedMessages}
          />
        </div>
      )}
    </div>
  );
}

export default CustomizedApp;
