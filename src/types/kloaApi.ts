export interface korlarkResponse {
    merchants: merchant[]
}

export interface merchant {
    id: number,
    state: number,
    user: userInfo,
    server: number,
    continent: string,
    items: item[],
    created_at: string,
    updated_at: string | null,
    heart_count: number,
    is_hearted: null

}
export interface item {
    type: number,
    content: string,

}

export interface userInfo {
    id: number,
    nickname: string,
    stove: stoveInfo,
}

export interface stoveInfo {
    nickname: string,
    server: number,
    job: number,
}