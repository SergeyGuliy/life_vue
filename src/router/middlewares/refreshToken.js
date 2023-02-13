// import { store } from "../../store/index";
// import {API_login} from "@api/auth";
// import { myVue } from "@main";

import { useAuth } from "../../composable/useAuth";

export async function refreshTokenMiddleware(to) {
  const { refreshToken } = useAuth();
  // if (store.state.user.user) {
  //   return;
  // }
  if (["Auth", "Closer"].includes(to.name)) {
    return;
  }

  await refreshToken();
}
