"use client";
import React, { useState } from "react";
import Signin from "@/components/sign/Signin";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

function ResponsiveLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <Box
      component={motion.div}
      style={{ width: "100%", height: "100vh" }}
      sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}
    >
      {/* 데스크탑 및 태블릿에서의 배경 이미지 */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        >
          {/* 좌측에 우측 이미지를 붙이기 */}
          <div
            style={{
              position: "fixed",
              width: "50vw", // 화면의 50%를 차지
              height: "100vh",
              right: 0, // 우측에 붙이기
              top: 0,
              zIndex: -1,
            }}
          >
            <Image
              src="/image14.svg"
              alt="Background SVG"
              layout="fill"
              objectFit="cover"
              objectPosition="right" // 우측 끝에 붙이기
            />
          </div>

          {/* 우측에 좌측 이미지를 붙이기 */}
          <div
            style={{
              position: "fixed",
              width: "50vw", // 화면의 50%를 차지
              height: "100vh",
              left: 0, // 좌측에 붙이기
              top: 0,
              zIndex: -1,
            }}
          >
            <Image
              src="/image17.svg"
              alt="Background SVG"
              layout="fill"
              objectFit="cover"
              objectPosition="left" // 좌측 끝에 붙이기
            />
          </div>
        </Box>
      )}

      {/* 로그인 폼 */}
      <Box
        sx={{
          display: isMobile ? "none" : "flex",
          flex: 2,
          height: "100%",
        }}
      ></Box>
      <Box
        sx={{
          display: "flex",
          flex: 2,
          height: "100%",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Signin />
      </Box>

      {/* 모바일에서 백그라운드 이미지 */}
      {isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "50%",
              right: 0, // 모바일에서 우측에 붙이기
              top: 0,
            }}
          >
            <Image
              src="/image14.svg"
              alt="Background SVG"
              layout="fill"
              objectFit="cover"
              objectPosition="right" // 우측 끝에 붙이기
            />
          </div>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "50%",
              left: 0, // 모바일에서 좌측에 붙이기
              bottom: 0,
            }}
          >
            <Image
              src="/image17.svg"
              alt="Background SVG"
              layout="fill"
              objectFit="cover"
              objectPosition="left" // 좌측 끝에 붙이기
            />
          </div>
        </Box>
      )}
    </Box>
  );
}

export default ResponsiveLayout;
