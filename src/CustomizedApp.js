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
import PinnedMessage from "./PinnedMessage";

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
  }

  async function unpinMessage(message) {
    await channel.unpinMessage(message.messageId);
  }

  //called when a channel is selected -> each time a channels selected, load pinnedMsgs
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
          // if (pinnedMessages.length === 0) {
          //   console.log("2. If pinned messages IS 0, add message");
          //   setPinnedMessages((oldArray) => [...oldArray, message]);
          // }

          //if there is an array of pinnedMsgs,
          //go through pinnedMsgs & if msg.msgId isnt in there THEN ADD IT

          // OR
          //everytime getPinnedMsgList() is called, reset pinnedMsgs array with the messages

          //   var status = 'Not exist'
          //   for (var i = 0; i < pinnedMessages.length; i++) {
          //     console.log("3.Looping pinnedMsgs, msg=", pinnedMessages[i]);
          //     if (pinnedMessages[i].messageId === message.messageId) {
          //           console.log("4. SETTINGS STATUS TO EXIST");
          //       console.log(
          //         "5. pinnnedMsgID for loop=",
          //         pinnedMessages[i].messageId
          //       );
          //       console.log("6. Current MsgId checking=", message.messageId);
          //         status = 'Exist';
          //         break;
          //     }

          //   if(status === 'Not exist'){
          //     console.log('7. STATUS = NOT EXIST')
          //     setPinnedMessages((oldArray) => [...oldArray, message]);
          //   }
          // }

          // for (var i = 0; i < pinnedMessages.length; i++) {
          //   console.log("3.Looping pinnedMsgs, msg=", pinnedMessages[i]);
          //   if (pinnedMessages[i].messageId !== message.messageId) {
          //     console.log("4. pinnedMsg ID !== current msgId");
          //     console.log(
          //       "5. pinnnedMsgID for loop=",
          //       pinnedMessages[i].messageId
          //     );
          //     console.log("6. Current MsgId checking=", message.messageId);
          //     //Then add message to the array
          //     setPinnedMessages((oldArray) => [...oldArray, message]);
          //   }
          // }
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
          <PinnedMessage
            // message={message}
            userId={userId}
            channel={channel}
            updateUserMessage={updateUserMessage}
            sb={sb}
            pinMessage={pinMessage}
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
