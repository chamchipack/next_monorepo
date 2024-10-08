import { useEffect, useState } from "react";

import db from "@/api/module";
import { Autocomplete, Box, Chip, TextField } from "@mui/material";

import { DefaultType } from "@/config/type/DefaultType/type";
import { Session } from "@/config/type/default/session";

interface ArrayType {
  id: string;
  name: string;
}

interface Props {
  setForm: React.Dispatch<React.SetStateAction<Session>>;
  form: Session;
  multiple: boolean;
}

const NameSearchAutocomplete = ({ form, setForm, multiple }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<DefaultType["member"][]>([]);
  const [studentData, setStudentData] = useState<ArrayType[]>([]);

  const onSearchStudentData = async (name: string | undefined) => {
    const { data = [] } = await db.search("student", {
      options: { "name.like": name },
    });
    setOptions(data);
  };

  const onLoadInitialClassData = async (
    studentId: string | undefined
  ): Promise<{ id: string; name: string }> => {
    if (!studentId) return { id: "", name: "" };

    const { data: { id = "", name = "" } = {} } = await db.single(
      "student",
      studentId
    );
    return { id, name };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (form.studentId && form?.studentId.length) {
        const { id = "", name = "" } = await onLoadInitialClassData(
          form?.studentId[0]
        );
        if (id) setStudentData([{ id, name }]);
      }
    };
    fetchData();
  }, [form?.studentId]);

  useEffect(() => {
    if (inputValue) {
      const delayDebounceFn = setTimeout(() => {
        onSearchStudentData(inputValue);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      // setOptions([]);
    }
  }, [inputValue]);

  const handleDelete = (member: ArrayType) => {
    setStudentData([]);

    setForm((prev) => ({
      ...prev,
      studentId: [],
    }));
  };

  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <Autocomplete
        disabled={form?.type === "lesson"}
        multiple
        freeSolo
        value={studentData}
        onChange={(event, newValue) => {
          let selectedClass;
          if (typeof newValue[0] === "string") {
            selectedClass = { id: newValue[0], name: newValue[0] };
          } else {
            selectedClass = newValue[0] as ArrayType;
          }

          setStudentData([selectedClass]);
          setForm((prev) => ({
            ...prev,
            studentId: [selectedClass?.id as string],
          }));
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          if (studentData.length === 0) setInputValue(newInputValue);
        }}
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        renderTags={(value: readonly ArrayType[], getTagProps) =>
          value.map((option: ArrayType, index: number) => (
            <Chip
              variant="outlined"
              label={option?.name}
              {...getTagProps({ index })}
              onDelete={() => handleDelete(option)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="수강생 명"
            placeholder="검색 후 선택해주세요"
            InputLabelProps={{
              sx: {
                fontSize: "14px", // 원하는 글씨 크기
              },
            }}
            InputProps={{
              ...params.InputProps,
              readOnly: studentData.length >= 1,
              sx: {
                pt: 1,
                pb: 1,
                // "& .MuiOutlinedInput-notchedOutline": {
                //   border: "none",
                // },
                // "&:hover .MuiOutlinedInput-notchedOutline": {
                //   border: "none",
                // },
                // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                //   border: "none",
                // },
                "& .MuiOutlinedInput-root": {
                  borderBottom: (theme) =>
                    `1px solid ${theme.palette.text.secondary}`,
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default NameSearchAutocomplete;
