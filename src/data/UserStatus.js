import i18next from "i18next";

export const UserStatusNames = {
    0: i18next.t("Active"),
    1: i18next.t("Blocked"),
    2: i18next.t("Deleted")
};

export const UserStatus = {
    active: 0,
    blocked: 1,
    deleted: 2
};