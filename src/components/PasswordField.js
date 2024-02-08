import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

function SecretField({ id, name, autoComplete, label, value, onChange, onBlur, error, helperText }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            autoComplete={autoComplete}
            id={id}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            helperText={helperText}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                        >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}

export default SecretField;