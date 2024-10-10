import React, { RefObject } from "react";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { CircleSharp, SearchSharp } from "@mui/icons-material";

interface SearchInputProps {
  searchKeywordRef: RefObject<HTMLInputElement>;
  placeholder?: string;
  borderRadius?: number;
  borderColor?: string; // 색상 값을 직접 받음
  onSearchClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputStyles?: SxProps<Theme>;
  buttonColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "disabled"
    | "error"
    | "action"
    | "info"
    | "success"
    | "warning";
}

const SearchInput = ({
  searchKeywordRef,
  placeholder = "검색어를 입력해주세요",
  borderRadius = 8,
  borderColor = "#1976d2", // 기본 색상을 파란색으로 설정
  onSearchClick,
  onKeyDown,
  inputStyles,
  buttonColor = "primary",
}: SearchInputProps) => {
  return (
    <FormControl
      size="small"
      style={{
        marginLeft: "auto",
        maxWidth: "300px",
      }}
    >
      <OutlinedInput
        id="search"
        inputRef={searchKeywordRef}
        placeholder={placeholder}
        sx={{
          borderRadius: borderRadius,
          border: `2px solid ${borderColor}`, // 직접 받은 색상 값 적용
          "> fieldset": { border: 0 },
          ...inputStyles, // 추가적인 스타일 적용 가능
        }}
        type="text"
        onKeyDown={onKeyDown}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={onSearchClick}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                e.preventDefault()
              }
              aria-label="search"
            >
              <SearchSharp color={buttonColor} />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchInput;
