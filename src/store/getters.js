//  const getters = {
//   device: state => state.app.device,
//   theme: state => state.app.theme,
//   color: state => state.app.color,
//   token: state => state.user.token,
//   avatar: state => state.user.avatar,
//   nickname: state => state.user.name,
//   welcome: state => state.user.welcome,
//   roles: state => state.user.roles,
//   userInfo: state => state.user.info,
//   addRouters: state => state.permission.addRouters,
//   multiTab: state => state.app.multiTab,


// }
// export default getters

export const user = state => state.user;
export const setuser = state => state.setuser;
export const device = state => state.app.device;
export const theme = state => state.app.theme;
export const color = state => state.app.color;
export const token = state => state.user.token;
export const avatar = state => state.user.avatar;
export const nickname = state => state.user.name;
export const welcome = state => state.user.welcome;
export const roles = state => state.user.roles;
export const userInfo = state => state.user.info;
export const addRouters = state => state.permission.addRouters;
export const multiTab = state => state.app.multiTab;

