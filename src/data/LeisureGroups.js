import i18next from "i18next";

const LeisureGroupsId = {
    movie: 1,
    serial: 2,
    book: 3,
    game: 4,
    music: 5,
    place: 6,
    sport: 7,
    other: 8
};

export const LeisureGroupsNames = {
    1: i18next.t("Movie"),
    2: i18next.t("Serial"),
    3: i18next.t("Book"),
    4: i18next.t("Game"),
    5: i18next.t("Music"),
    6: i18next.t("Place"),
    7: i18next.t("Sport"),
    8: i18next.t("Other")
};

export const LeisureGroups = [
    { id: LeisureGroupsId.movie, name: i18next.t("Movie") },
    { id: LeisureGroupsId.serial, name: i18next.t("Serial") },
    { id: LeisureGroupsId.book, name: i18next.t("Book") },
    { id: LeisureGroupsId.game, name: i18next.t("Game") },
    { id: LeisureGroupsId.music, name: i18next.t("Music") },
    { id: LeisureGroupsId.place, name: i18next.t("Place") },
    { id: LeisureGroupsId.sport, name: i18next.t("Sport") },
    { id: LeisureGroupsId.other, name: i18next.t("Other") }
];