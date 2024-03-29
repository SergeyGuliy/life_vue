import { cloneDeep } from "lodash";

import { API_updateUserSettings } from "@api";
import { useStoreUser } from "@stores";

export class ProfileSettingsParser {
  constructor(userData) {
    this.profileSettings = {
      avatarBig: userData?.avatarBig || "",
      avatarSmall: userData?.avatarSmall || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      country: userData?.country || "",
    };
    this.chatSettings = {
      global: {
        isTurnedOn: userData.userSettings.globalIsTurnedOn,
        autoplay: userData.userSettings.globalAutoplay,
        soundSelected: userData.userSettings.globalSoundSelected,
      },
      room: {
        isTurnedOn: userData.userSettings.roomIsTurnedOn,
        autoplay: userData.userSettings.roomAutoplay,
        soundSelected: userData.userSettings.roomSoundSelected,
      },
      private: {
        isTurnedOn: userData.userSettings.privateIsTurnedOn,
        autoplay: userData.userSettings.privateAutoplay,
        soundSelected: userData.userSettings.privateSoundSelected,
      },
    };
  }

  get getProfileSettings() {
    return cloneDeep(this.profileSettings);
  }
  get getChatSettings() {
    return cloneDeep(this.chatSettings);
  }

  static get nameMap() {
    return {
      profileSettings: {
        email: "profileSettings.email",
        phone: "profileSettings.phone",
        firstName: "profileSettings.firstName",
        lastName: "profileSettings.lastName",
        country: "profileSettings.country",
      },
      chatSettings: {
        global: {
          isTurnedOn: "userSettings.globalIsTurnedOn",
          autoplay: "userSettings.globalAutoplay",
          soundSelected: "userSettings.globalSoundSelected",
        },
        room: {
          isTurnedOn: "userSettings.roomIsTurnedOn",
          autoplay: "userSettings.roomAutoplay",
          soundSelected: "userSettings.roomSoundSelected",
        },
        private: {
          isTurnedOn: "userSettings.privateIsTurnedOn",
          autoplay: "userSettings.privateAutoplay",
          soundSelected: "userSettings.privateSoundSelected",
        },
      },
    };
  }

  static parseUserSettings(data) {
    const dataToReturn = {};
    const entries = (obj) => Object.entries(obj);

    entries(data).forEach(([key1, value1]) => {
      if (!this.nameMap[key1] && typeof this.nameMap[key1] !== "object") return;

      entries(value1).forEach(([key2, value2]) => {
        const field = this.nameMap[key1][key2];

        if (field && typeof field === "object") {
          entries(value2).forEach(([key3]) => {
            const keys = this.nameMap[key1][key2][key3].split(".");
            dataToReturn[keys[0]] = {
              ...dataToReturn[keys[0]],
              [keys[1]]: value2[key3],
            };
          });
        }
        if (field && typeof field === "string") {
          const keys = this.nameMap[key1][key2].split(".");
          dataToReturn[keys[0]] = {
            ...dataToReturn[keys[0]],
            [keys[1]]: value2,
          };
        }
      });
    });
    return dataToReturn;
  }

  static async pushNewUserSettings(data) {
    const dataToReturn = this.parseUserSettings(data);

    return await API_updateUserSettings(dataToReturn)
      .then((data) => useStoreUser().updateUserSettings(data))
      .catch((e) => console.log(e));
  }
}
