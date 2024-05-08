import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LeisureGroups } from "../data/LeisureGroups";
import { useTranslation } from "react-i18next";

function GroupFilterSelector({ value, onChange }) {
    const { t } = useTranslation();

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="group-selector-label">{t("Group")}</InputLabel>
            <Select
                labelId="group-selector-label"
                id="group-selector"
                label={t("Group")}
                value={value}
                onChange={handleChange}
            >
                <MenuItem value={0}>{t("All")}</MenuItem>
                {LeisureGroups.map((group) =>
                    <MenuItem value={group.id} key={group.id}>{t(group.name)}</MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default GroupFilterSelector;