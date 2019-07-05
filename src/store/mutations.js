export const setUser = (state,data) =>{
    state.user = data;   //把请求的数据放入state里用来存储用户信息的user
}
export const setUserToken = (state,data) =>{
    state.setUser = data;   //把请求的token放入state里用来存储token
}