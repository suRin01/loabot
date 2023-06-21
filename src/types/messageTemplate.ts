export type messageTemplate = {
    type:string;
    body:string;
    kalinkData?: kalinkCharacterData;
}

export type kalinkCharacterData = {
    title:         string,
    header:        string,
    gemList:       string,
    thumnail:      string,
    statList:      string,
    tripodList:    string,
    description:   string,
    summary:       string,
    envList:       string,
    summary_thu:   string,
    summary_desc:  string,
    }

export type chatroomData = {
    id:                    string;
    title:                 string;
    member_count:          number;
    display_member_images: string[];
}


export type chatData = {
    type:            string;
    lang:            string;
    isMobileBrowser: boolean;
    data: {
        appKey:     string;
        shortKey:   string;
        csrfToken:  string;
        checksum:   string;
        preview: {
            title:        string;
            description:  string;
            did:          string;
            service_name: string;
            service_icon: string;
            image_url:    string;
        },
        me:      chatroomData;
        friends: chatroomData[];
        chats:   chatroomData[];
    }

}


export type kalinkReqData = {
    app_key:    string;
    short_key:  string;
    _csrf:      string;
    checksum:   string;
    receiver:   string;
}