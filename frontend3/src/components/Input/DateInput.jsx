import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DateInput(props) {
  const { value, onChange, label, name, fullHeight = false } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={label}
          value={value}
          onChange={(newValue) =>
            onChange({ target: { name: name, value: newValue } })
          }
          name={name}
          sx={{
            width: "100%",
          }}
          slotProps={{
            textField: {
              InputProps: {
                style: { height: fullHeight ? "100%" : "70%" },
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
