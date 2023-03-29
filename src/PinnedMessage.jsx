import React, { useState } from "react";
import "./index.css";
import UserMessage from "./MessageItems/UserMessage";

export default function PinnedMessage({
  message,
  userId,
  channel,
  updateUserMessage,
  sb,
  pinMessage,
  unpinMessage,
  getPinnedMessageList,
  pinnedMessages
}) {
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  //const [pinnedMessages, setPinnedMessages] = useState([]);
   function showPinnedMessageList() {
    setShowPinnedMessages(!showPinnedMessages);
    // if(showPinnedMessages === true){
    //   console.log('showPinnedMessages is TRUE')
    //   getPinnedMessageList()
    // }
  }


//array keeps adding duplicates

//function gets called 2x
  // async function getPinnedMessageList(){

  //   console.log('Inside getPinnedMessage')
  //   //for each message Id -> get messageObj & add it to an array IF IT DOESNT EXIST
  //   await Promise.all(
  //     channel.pinnedMessageIds.map(async (messageId) => {
  //       const params = {
  //         messageId: messageId,
  //         channelType: channel.channelType,
  //         channelUrl: channel.url,
  //       };
  //       const message = await sb.message.getMessage(params);

  //    if(pinnedMessages.length == 0){
  //     console.log('pinned messages IS 0, so add message')
  //     setPinnedMessages((oldArray) => [...oldArray, message])
  //    }

  //    //keeps looping multiple times
  //       for (var i = 0; i < pinnedMessages.length; i++) {
  //         console.log("Looping pinnedMsgs to check", i);
  //         if (pinnedMessages[i].messageId !== message.messageId) {
  //          console.log('current pinnned msg ID=',pinnedMessages[i].messageId)
  //          console.log('MY MESSAGE ID RN=', message.messageId)
  //          //Then add message to the array
  //           setPinnedMessages((oldArray) => [...oldArray, message]);
  //         }
  //       }


  //     })
  //   );
  // }

  return (
    <div
      className="sendbird-channel-settings_pinned-messages"
      onClick={showPinnedMessageList}
    >
      <div
        className="sendbird-channel-settings__panel-icon-left sendbird-channel-settings__panel-pin-message sendbird-icon sendbird-icon-pin-message sendbird-icon-color--error"
        role="button"
        tabIndex="0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <path
            className="icon-leave_svg__fill"
            d="M32 5.333a2.667 2.667 0 01.311 5.316l-.311.018H10.667a2.67 2.67 0 00-2.65 2.355L8 13.333v37.334a2.667 2.667 0 002.356 2.648l.31.018H32a2.667 2.667 0 01.311 5.316l-.311.018H10.667a8.001 8.001 0 01-7.987-7.53l-.013-.47V13.333a8 8 0 017.53-7.986l.47-.014H32zm17.634 13.893l.252.222 10.666 10.666a2.666 2.666 0 01.222 3.52l-.222.252-10.666 10.666a2.666 2.666 0 01-3.993-3.52l.221-.251 4.78-4.782L20 36a2.667 2.667 0 01-.311-5.315l.311-.018h33.56l-7.446-7.448a2.668 2.668 0 01-.221-3.52l.221-.251a2.666 2.666 0 013.52-.222z"
            fill="#000"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>
      <span className="sendbird-label sendbird-label--subtitle-1 sendbird-label--color-onbackground-1">
        Pinned Messages
      </span>
      {showPinnedMessages && pinnedMessages.length !== 0 && (
        <div>
          {pinnedMessages.map(function (message) {
            return (
              <div key={message.messageId} className="sendbird-channel-settings_pin-messag-wrapper">
              <UserMessage
                message={message}
                userId={userId}
                updateUserMessage={updateUserMessage}
                channel={channel}
                sb={sb}
                pinMessage={pinMessage}
                unpinMessage
              />
              </div>
            );
          })}
        </div>
      )}
      {showPinnedMessages && pinnedMessages.length === 0 && (
        <div>
          <h4>No pinned messages</h4>
        </div>
      )}
    </div>
  );
}
