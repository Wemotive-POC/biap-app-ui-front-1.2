import React, { useContext, useRef, useState, useEffect } from "react";

import { FormControl, MenuItem, Select } from "@mui/material";
import useStyles from "./style";

const MuiDropdown = ({ id, options, label, onSelect, selectedOption, sx }) => {
  const styles = useStyles();

  return (
    <FormControl fullWidth variant="outlined" size="medium">
      <Select
        id={id}
        sx={sx}
        value={selectedOption || ""}
        onChange={(e) => onSelect(e.target.value)}
        displayEmpty // This ensures the placeholder is shown when no selection is made
      >
        {/* This MenuItem acts as the placeholder */}
        <MenuItem value="">
          <span className={styles.dropdown_text}>{label}</span>
        </MenuItem>
        {options.map((option) => {
          return (
            <MenuItem value={option.value}>
              <span className={styles.dropdown_text}>{option.value}</span>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default MuiDropdown;
