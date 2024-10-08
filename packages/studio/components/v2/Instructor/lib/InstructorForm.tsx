import menuConfig from "@/config/menu-configure/menu-config";
import { Instructor } from "@/config/type/default/instructor";
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Row } from ".";

interface Props {
  form: Row;
  setForm: React.Dispatch<React.SetStateAction<Row>>;
}

type Menu = {
  [key: string]: { access: boolean; editable: boolean };
};

const authSet: Menu = menuConfig.reduce((acc, { _id = "" }) => {
  Object.assign(acc, { [_id]: { access: false, editable: false } });
  return acc;
}, {});

const InstructorForm = ({ form, setForm }: Props) => {
  const [menu, setMenu] = useState(menuConfig);
  const [auth, setAuth] = useState(authSet);

  useEffect(() => {
    if (!form?.menuAccess) return setAuth({});

    let access = JSON.parse(
      decodeURIComponent(escape(atob(form?.menuAccess || "")))
    );
    setAuth(access);
  }, [form?.menuAccess]);

  useEffect(() => {
    if (JSON.stringify(form.auth) !== JSON.stringify(auth)) {
      setForm({ ...form, auth });
    }
  }, [auth]);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginBottom: 2,
          p: 1,
          borderRadius: 4,
          // background: (theme) => alpha(theme.palette.grey[100], 0.5),
        }}
      >
        <Box sx={{ width: "100%", marginBottom: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="유저 ID"
            type="text"
            fullWidth
            variant="standard"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value as string })
            }
          />
        </Box>

        <Box sx={{ width: "100%", marginBottom: 4 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="유저명"
            type="text"
            fullWidth
            variant="standard"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value as string })
            }
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Typography variant="subtitle2">관리자여부</Typography>
          <Checkbox
            checked={form?.isAdmin}
            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 4,
          }}
        >
          <FormControl component="fieldset" variant="standard" fullWidth>
            <FormLabel component="legend">
              <Typography variant="subtitle1">접근메뉴선택</Typography>
            </FormLabel>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                my: 3,
                alignItems: "center",
              }}
            >
              <Typography sx={{ width: "40%" }} variant="subtitle2">
                메뉴
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                  textAlign: "center",
                }}
              >
                <FormLabel component="legend">
                  <Typography variant="subtitle2">페이지 권한</Typography>
                </FormLabel>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                  textAlign: "center",
                }}
              >
                <FormLabel component="legend">
                  <Typography variant="subtitle2">등록/수정 권한</Typography>
                </FormLabel>
              </Box>
            </Box>
            {menu.map(({ _id, title }) => (
              <Box
                key={_id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 0,
                  alignItems: "center",
                }}
              >
                <Typography sx={{ width: "40%" }}>{title}</Typography>
                <Checkbox
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      [_id]: { ...auth[_id], access: e.target.checked },
                    })
                  }
                  checked={auth[_id]?.access || false}
                  size="small"
                  color="secondary"
                  sx={{ width: "30%", justifyContent: "center" }}
                />
                <Checkbox
                  size="small"
                  sx={{ width: "30%", justifyContent: "center" }}
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      [_id]: { ...auth[_id], editable: e.target.checked },
                    })
                  }
                  checked={auth[_id]?.editable || false}
                />
              </Box>
            ))}
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default InstructorForm;
