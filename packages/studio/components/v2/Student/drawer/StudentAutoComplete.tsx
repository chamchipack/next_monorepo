import { useEffect, useState } from "react";

import db from "@/api/module";
import { Autocomplete, Box, Chip, TextField } from "@mui/material";

import { DefaultType } from "@/config/type/DefaultType/type";
import { Assemble } from ".";

interface ClassType {
  id: string;
  name: string;
}

interface Props {
  setForm: React.Dispatch<React.SetStateAction<Assemble>>;
  form: Assemble;
}

const NameSearchAutocomplete = ({ form, setForm }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<DefaultType["member"][]>([]);
  const [classData, setClassData] = useState<ClassType[]>([]);

  const onSearchClassData = async (name: string | undefined) => {
    const { data = [] } = await db.search("class", {
      options: { "name.like": name },
    });
    setOptions(data);
  };

  const onLoadInitialClassData = async (
    classId: string | undefined
  ): Promise<{ id: string; name: string }> => {
    if (!classId) return { id: "", name: "" };

    const { data: { id = "", name = "" } = {} } = await db.single(
      "class",
      classId
    );
    return { id, name };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (form.student?.classId && form?.student?.classId.length) {
        const { id = "", name = "" } = await onLoadInitialClassData(
          form?.student?.classId[0]
        );
        if (id) setClassData([{ id, name }]);
      }
    };
    fetchData();
  }, [form.student?.classId]);

  useEffect(() => {
    if (inputValue) {
      const delayDebounceFn = setTimeout(() => {
        onSearchClassData(inputValue);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      // setOptions([]);
    }
  }, [inputValue]);

  const handleDelete = (member: ClassType) => {
    setClassData([]);

    setForm((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        classId: [],
      },
    }));
  };

  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <Autocomplete
        multiple
        freeSolo
        value={classData}
        onChange={(event, newValue) => {
          let selectedClass;
          if (typeof newValue[0] === "string") {
            selectedClass = { id: newValue[0], name: newValue[0] };
          } else {
            selectedClass = newValue[0] as ClassType;
          }

          setClassData([selectedClass]);
          setForm((prev) => ({
            ...prev,
            student: {
              ...prev.student,
              classId: [selectedClass.id],
            },
          }));
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          if (classData.length === 0) setInputValue(newInputValue);
        }}
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        renderTags={(value: readonly ClassType[], getTagProps) =>
          value.map((option: ClassType, index: number) => (
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
            label="과목명"
            placeholder="검색 후 선택해주세요"
            InputLabelProps={{
              sx: {
                fontSize: "14px", // 원하는 글씨 크기
              },
            }}
            InputProps={{
              ...params.InputProps,
              readOnly: classData.length >= 1,
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
