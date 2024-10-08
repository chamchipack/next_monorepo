import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Popover, Switch, Typography, alpha, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { useState } from "react";

interface AttendanceDataGridStates {
    "paymentType.equal"?: string | null; //
    "status.or"?: string[];
    "studentName.like"?: string;
    "attendanceDate.like"?: string;
}

interface Props {
    setDataGridAttendanceState: React.Dispatch<React.SetStateAction<AttendanceDataGridStates>>;
}

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 40,
    height: 20,
    padding: 0,
    display: "flex",
    "&:active": {
        "& .MuiSwitch-thumb": {
            width: 15,
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
            transform: "translateX(9px)",
        },
    },
    "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "primary.main",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 16,
        height: 16,
        borderRadius: 14,
        transition: theme.transitions.create(["width"], {
            duration: 200,
        }),
    },
    "& .MuiSwitch-track": {
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor: theme.palette.text.disabled,
        boxSizing: "border-box",
    },
}));

const DateFilter = ({ setDataGridAttendanceState }: Props) => {
    const theme = useTheme();

    const [sdateTargetValue, setSdateTargetValue] = useState(null);
    const [edateTargetValue, setEdateTargetValue] = useState(null);
    const [isOpensdate, setIsOpensdate] = useState<boolean>(true);

    const [dateAsUnixNumber, setDateAsUnixNumber] = useState({ sdate: 0, edate: 0 });

    const [isOnAdditionalDate, setIsOnAdditionalDate] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [anchorEdate, setAnchorEdate] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickEdate = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEdate(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const onResetDateSearch = () => {
        const { sdate = 0, edate = 0 } = dateAsUnixNumber;

        if (!sdate) return;
    };

    const onChangeStartDate = (date: any) => {
        setSdateTargetValue(date);

        const sdate = new Date(date).getTime();
        const edate = new Date(edateTargetValue as any).getTime();
        // setDateAsUnixNumber({ sdate, edate: edate ? edate : sdate + 24 * 60 * 60 * 1000 });
        setDateAsUnixNumber({ sdate, edate });
    };

    const onChangeEndDate = (date: any) => {
        setEdateTargetValue(date);

        const sdate = new Date(sdateTargetValue as any).getTime();
        const edate = new Date(date).setDate(new Date(date).getDate() + 1);

        setDateAsUnixNumber({ sdate, edate });
    };

    const onClickSearch = () => {
        const { sdate = 0, edate = 0 } = dateAsUnixNumber;

        if (!sdate && !edate)
            return setDataGridAttendanceState((prev) => ({
                ...prev,
                "attendanceDate.like": "",
                "attendanceDate.lte": "",
                "attendanceDate.gte": ""
            }));

        if (sdate >= edate && sdate && edate) return;

        const data: any = {};

        const start = moment(sdate).format('YYYY-MM-DD')
        const end = moment(edate).format('YYYY-MM-DD')

        if (sdate && edate) {
            data["attendanceDate.gte"] = start;
            data["attendanceDate.lte"] = end;
        } else if (sdate) data["attendanceDate.like"] = start;
        else if (edate) data["attendanceDate.like"] = end;

        if (Object.keys(data).length > 0) {
            setDataGridAttendanceState((prev) => ({
                ...prev,
                ...data
            }));
        }
    };

    const onClickRefresh = () => {
        setDateAsUnixNumber({ sdate: 0, edate: 0 });
        setSdateTargetValue(null);
        setEdateTargetValue(null);
    };
    const onClickCancel = () => {
        handleClose();
        onClickRefresh();
        setIsOnAdditionalDate(false);
        return setDataGridAttendanceState((prev) => ({
            ...prev,
            "attendanceDate.like": "",
            "attendanceDate.lte": "",
            "attendanceDate.gte": ""
        }));
    };

    return (
        <>
            <Box
                sx={{
                    borderRadius: 1,
                    border: (theme) => `1px solid ${alpha(theme.palette.grey[400], 0.15)}`,
                    mr: 1
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box style={{ display: "flex", flexDirection: "row" }} sx={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
                        <Button
                            size="medium"
                            onClick={handleClick}
                            sx={{ pl: 1, pr: 1, color: "text.primary", width: 90 }}
                        >
                            날짜 선택
                        </Button>
                        {sdateTargetValue && (
                            <Button
                                size="medium"
                                aria-describedby={id}
                                sx={{ color: "text.primary", pointerEvents: "none", }}
                            >
                                {sdateTargetValue ? dayjs(sdateTargetValue).format("YY.MM.DD") : "YY.MM.DD"}
                            </Button>
                        )}

                        {edateTargetValue && (
                            <>
                                {sdateTargetValue && <Typography component="span">~</Typography>}
                                <Button
                                    size="medium"
                                    aria-describedby={id}
                                    sx={{ color: "text.primary", pointerEvents: "none" }}
                                >
                                    {edateTargetValue ? dayjs(edateTargetValue).format("YY.MM.DD") : "YY.MM.DD"}
                                </Button>
                            </>
                        )}
                    </Box>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.92),
                                display: "flex",
                                justifyContent: isOnAdditionalDate ? "space-between" : "center",
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            <Box sx={{ flexBasis: !isOnAdditionalDate ? "100%" : "45%" }}>
                                <Button
                                    size="medium"
                                    aria-describedby={id}
                                    sx={{
                                        color: "text.primary",
                                        fontSize: "14px",
                                        width: "100%",
                                        border: (theme) =>
                                            `0.5px solid ${isOpensdate ? theme.palette.primary.dark : theme.palette.text.disabled}`,
                                        p: 1,
                                    }}
                                    onClick={() => {
                                        setIsOpensdate(true);
                                    }}
                                >
                                    {sdateTargetValue ? dayjs(sdateTargetValue).format("YY.MM.DD") : "YY.MM.DD"}
                                </Button>
                            </Box>

                            {!isOnAdditionalDate ? null : (
                                <>
                                    <Box sx={{ flexBasis: "10%" }}></Box>
                                    <Box sx={{ flexBasis: "45%" }}>
                                        <Button
                                            size="medium"
                                            aria-describedby={id}
                                            sx={{
                                                color: "text.primary",
                                                fontSize: "14px",
                                                width: "100%",
                                                border: (theme) =>
                                                    `0.5px solid ${!isOpensdate ? theme.palette.primary.dark : theme.palette.text.disabled}`,
                                                p: 1,
                                            }}
                                            onClick={() => {
                                                setIsOpensdate(false);
                                            }}
                                        >
                                            {edateTargetValue ? dayjs(edateTargetValue).format("YY.MM.DD") : "YY.MM.DD"}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "right",
                                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.92),
                                px: 1,
                            }}
                        >
                            <Button sx={{ color: "text.secondary" }} onClick={onClickRefresh}>
                                초기화
                                <RefreshIcon />
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.92),
                            }}
                        >
                            {isOpensdate ? (
                                <DateCalendar
                                    value={sdateTargetValue}
                                    onChange={onChangeStartDate}
                                    sx={{
                                        "& .MuiPickersCalendarHeader-root": {
                                            color: (theme) => theme.palette.text.primary,
                                        },
                                        "& .MuiPickersDay-root": {
                                            color: (theme) => theme.palette.text.secondary,
                                        },
                                        "& .MuiTypography-root": {
                                            color: (theme) => theme.palette.text.disabled,
                                            fontWeight: 600,
                                        },
                                    }}
                                />
                            ) : (
                                <DateCalendar
                                    value={edateTargetValue}
                                    onChange={onChangeEndDate}
                                    minDate={dayjs(dateAsUnixNumber.sdate)}
                                    sx={{
                                        "& .MuiPickersCalendarHeader-root": {
                                            color: (theme) => theme.palette.text.primary,
                                        },
                                        "& .MuiPickersDay-root": {
                                            color: (theme) => theme.palette.text.secondary,
                                        },
                                        "& .MuiTypography-root": {
                                            color: (theme) => theme.palette.text.disabled,
                                            fontWeight: 600,
                                        },
                                    }}
                                />
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    pl: 2,
                                    pr: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="body2">종료일</Typography>
                                </Box>
                                <Box>
                                    <AntSwitch
                                        checked={isOnAdditionalDate}
                                        onClick={() => {
                                            setIsOnAdditionalDate(!isOnAdditionalDate);
                                            setIsOpensdate(false);
                                            if (isOnAdditionalDate) onResetDateSearch();
                                            else setEdateTargetValue(null);
                                        }}
                                        inputProps={{ "aria-label": "ant design" }}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 2,
                                }}
                            >
                                <Button
                                    size="small"
                                    onClick={onClickCancel}
                                    sx={{
                                        width: "40%",
                                        p: 1,
                                        backgroundColor: theme.palette.grey[300],
                                        color: "common.white",
                                    }}
                                >
                                    취소
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        handleClose();
                                        if (isOnAdditionalDate && sdateTargetValue)
                                            handleClickEdate({
                                                currentTarget: anchorEl,
                                            } as React.MouseEvent<HTMLButtonElement>);
                                        onClickSearch();
                                    }}
                                    sx={{
                                        width: "40%",
                                        p: 1,
                                        backgroundColor: theme.palette.grey[100],
                                        color: "text.primary",
                                    }}
                                >
                                    확인
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
                </LocalizationProvider>
            </Box>
        </>
    );
};

export default DateFilter;
