"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Alert from "@mui/material/Alert";

import ProgressDialog from "package/src/Modal/ProgressModal";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Button,
  Avatar,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  AlertTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import AlertModal from "../../modal/AlertModal";

const defaultTheme = createTheme();

const Signin = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const onCloseAlert = () => setOpenAlert(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // const instance = loginSchema.safeParse({ id: email, password });
    // if (!instance.success) return alert("아이디 혹은 비밀번호를 입력해주세요");

    try {
      handleOpen();
      const result = await signIn("credentials", {
        redirect: false,
        username: email,
        password: password,
      });

      if (result?.ok) router.push("/workspace/student");
      else {
        handleClose();
        setOpenAlert(true);
      }
    } catch (error) {
      // alert("로그인 정보를 확인해주세요");
      handleClose();
      setOpenAlert(true);
    }
  };

  return (
    <Box
      sx={{
        opacity: 0.95,
        backgroundColor: "secondary.main",
        borderRadius: 5,
        boxShadow: 3,
        p: 2,
        maxWidth: "23rem",
        margin: "auto",
      }}
    >
      <ProgressDialog open={openModal} onClose={handleClose} />

      <AlertModal open={openAlert} onClose={onCloseAlert}>
        <Alert
          severity="error"
          onClose={onCloseAlert}
          sx={{
            background: (theme) => theme.palette.error.light,
            p: 2,
          }}
        >
          <AlertTitle sx={{ mb: 2 }}>Authorization Failed</AlertTitle>
          <Typography sx={{ color: "text.primary" }}>
            아이디와 비밀번호를 확인해주세요.
          </Typography>
        </Alert>
      </AlertModal>

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs" sx={{ width: "100%" }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%", // Container 최대 너비에 맞춰 조정
            }}
          >
            <Box
              component={motion.div}
              animate={{
                rotate: 360,
                transition: { duration: 2, repeat: Infinity },
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ color: "background.paper", fontWeight: "bold" }}
            >
              STUDIO CHAMCHI
            </Typography>
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="ID"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "background.default",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "background.default",
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="PW"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "background.default",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "background.default",
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  marginTop: "12px",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  backgroundColor: "primary.main",
                  opacity: 0.7,
                }}
                // onClick={(e) => onClickLogin(e, { email, password })}
              >
                로그인
              </Button>
            </Box>
            <Typography
              variant="subtitle2"
              color="background.default"
              align="center"
              sx={{ mt: 5 }}
            >
              {"Copyright © "} {new Date().getFullYear()}{" "}
              {" Chamchi Company. "}
            </Typography>
            <Typography
              variant="subtitle2"
              color="background.default"
              align="center"
              sx={{ mt: 5 }}
            >
              {"All rights reserved."}
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
};

export default Signin;
