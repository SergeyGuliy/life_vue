import Vue from "vue";
import store from "../store/index";

Vue.prototype.$openModal = function(modalName, data = {}) {
  store.dispatch("modals/setModal", {
    component: modalName,
    data: data
  });

  return new Promise(function(resolve, reject) {
    let callback = data => {
      if (data.detail !== null) {
        resolve(data.detail);
      } else {
        reject();
      }
      window.removeEventListener("modalClose", callback);
    };
    window.addEventListener("modalClose", callback);
  });
};
