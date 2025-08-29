import * as React from "react";
import Button from "@mui/material/Button";
import menuImage from "./assets/menuImage2.png";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { pink } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Link } from "react-router-dom";

const options = [
  "Dashboard",
  "Map",
  "Profile",
  "Settings",
  "alta optiune",
  "alta optiune",
];

const AppMenu = () => {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        height: 60,
        backgroundColor: "#4682A9",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton disableRipple>
          <img src={menuImage} alt="Lost & Found Logo" style={{ height: 35 }} />
        </IconButton>
        <Button
          size="small"
          sx={{
            color: "#fff",
            "&:hover": { backgroundColor: "#2563EB" },
          }}
        >
          Dashboard
        </Button>

        <Button
          size="small"
          sx={{
            color: "#fff",
            "&:hover": { backgroundColor: "#2563EB" },
          }}
        >
          Map
        </Button>
        <Button
          size="small"
          sx={{
            color: "#fff",
            "&:hover": { backgroundColor: "#2563EB" },
          }}
        >
          Profile
        </Button>

        <Autocomplete
          id="search-autocomplete"
          options={options}
          multiple
          freeSolo
          clearOnEscape
          sx={{ width: 600 }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search by key words..."
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  backgroundColor: "#fff",
                },
              }}
            />
          )}
          slotProps={{
            listbox: {
              sx: {
                maxHeight: 150,
                overflow: "auto", //dacă conținutul listei e mai mare decât 150px, se va afișa scrollbar automat
                fontSize: "0.8rem",
              },
            },
          }}
        />
      </Stack>
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <IconButton sx={{ mr: 2 }}>
          <Avatar sx={{ bgcolor: pink[300], cursor: "pointer" }}>N</Avatar>
        </IconButton>
      </Link>
    </Stack>
  );
};

export default AppMenu;
