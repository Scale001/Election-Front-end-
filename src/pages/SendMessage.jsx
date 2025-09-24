import { useState } from "react";
import { motion } from "motion/react";
import "../assets/styles/send-message.css";

import TextSend from "../component/SendTextContainer";
import ToggleSwitch from "../component/SendMesageTypeToggle";
import SendAudio from "../component/SendAudio";

export default function SendMessage() {
  const [isSendingText, setIsSendingText] = useState(true);

  return (
    <div className="send-message">
      <ToggleSwitch
        isSendingText={isSendingText}
        setIsSendingText={setIsSendingText}
      />
      {isSendingText && <TextSend />}
      {!isSendingText && <SendAudio />}
    </div>
  );
}
