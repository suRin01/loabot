
Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, '');
const scriptName = 'tcpBot';
const config = {
    address: '192.168.0.132',
    port: 7050,
    packageNames: ['com.kakao.talk'],
    userIds: [0],
};




function onNotificationPosted(sbn) {
    //set up tcp client
    var socket = new java.net.Socket(config.address, config.port);
    var input = socket.getInputStream();
    var output = socket.getOutputStream();
    var reader = new java.io.BufferedReader(new java.io.InputStreamReader(input));
    var writer = new java.io.PrintWriter(output, true);
    if(socket === null || input === null || output === null || writer === null ){
        Log.d("소켓 생성 중 에러 발생.")
        return;
    }


    const packageName                   = sbn.getPackageName();
    const userId                        = sbn.getUser().hashCode();
    if (!config.packageNames.includes(packageName) || !config.userIds.includes(userId))
        return;
    const noti                          = sbn.getNotification();
    const actions                       = noti.actions;
    const bundle                        = noti.extras;
    if (!actions ||!bundle ||
        bundle.getString('android.template') !== 'android.app.Notification$MessagingStyle')
        return;
    const senderName                    = bundle.getString('android.title');
    const bundleSubText                 = bundle.getString('android.subText')
    const bundleSubTextorSummaryText    = bundleSubText !== null && bundleSubText !== undefined ? bundleSubText : bundle.getString('android.summaryText');
    const roomName                      = bundleSubTextorSummaryText !== null && bundleSubTextorSummaryText !== undefined ? bundleSubTextorSummaryText : senderName;
    const androidText                   = bundle.get('android.text');
    const content                       = androidText.toString();
    const containsMention               = androidText instanceof android.text.SpannableString;
    const isGroupChat                   = bundle.getBoolean('android.isGroupConversation');
    const messageBundle                 = bundle.getParcelableArray('android.messages')[0];
    const senderPerson                  = messageBundle.get('sender_person');
    const senderHash                    = senderPerson.getKey();
    const time                          = messageBundle.getLong('time');
    const roomId                        = sbn.getTag();
    const logId                         = java.lang.Long.toString(bundle.getLong('chatLogId'));
    const chatData = {
        appData:{
            packageName: packageName,
            userId: userId,
        },
        chatData:{
            roomName: roomName,
            roomId: roomId,
            senderName: senderName,
            senderHash: senderHash,
            bundleSubText: bundleSubText,
            bundleSubTextorSummaryText: bundleSubTextorSummaryText,
            containsMention: containsMention,
            isGroupChat: isGroupChat,
            content: content,
            time: time,

        },
        logId: logId,

    }

    writer.println(JSON.stringify(chatData));
    var line = reader.readLine();
    Log.d(line);


    socket.close();
}
