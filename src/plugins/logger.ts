import { Message, RKPlugin } from '@remote-kakao/core';

class LoggerPlugin extends RKPlugin {
  override onMessage = async (msg: Message) => {
    this.log(`${(new Date()).toTimeString()}${msg.sender.name}: ${msg.content}`);
    
  };
}

export default LoggerPlugin;