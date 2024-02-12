import { Tooltip, Zoom, tooltipClasses } from "@mui/material";
import styled from "styled-components";

function BasicTooltip({ children, className, ...props }) {
    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip 
            {...props} 
            classes={{ popper: className }} 
            TransitionComponent={Zoom}
            placement="top" 
            arrow
        />
    ))(() => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: "#FF5F00",
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#161B1D",
            border: "2px solid #FF5F00",
            maxWidth: 200
        },
    }));

    return (
        <CustomTooltip {...props} className={className}>
            {children}
        </CustomTooltip>
    );
}

export default BasicTooltip;
