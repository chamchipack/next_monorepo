import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import db from "@/api/module";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getColorForType } from "@/config/utils/hashColor/getHashColor";
import { Box, Button, ButtonBase, Typography } from "@mui/material";
import moment from "moment";
import DaySession from "./DaySession";
import {
  Session,
  initialSessionData,
  LessionTime,
  Day,
} from "@/config/type/default/session";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import SessionForm from "./SessionForm";
import AlertModal from "../Alert/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";

interface CalendarDataType {
  id: string;
  title: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  color: string;
}

const SessionComponent = () => {
  const [calendarData, setCalendarData] = useState<CalendarDataType[]>([]);
  const [session, setSession] = useState<Session[]>([]);
  const [selectedData, setSelectedData] = useState<Session>(initialSessionData);
  const [todaySession, setTodaySession] = useState<Session[]>([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const editAccessState = useRecoilValue(EditAccessAtom);

  const [isClicked, setIsClicked] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const [processing, setProcessing] = useState(false);

  const onLoadData = useCallback(async () => {
    try {
      const todayData: Session[] = [];

      const { data } = await db.search("session", { options: {} });
      setSession(data);

      const events: CalendarDataType[] = data.reduce(
        (acc: CalendarDataType[], item: any) => {
          const { id, name, regularDays = [], lessonTimes = {} } = item;
          if (regularDays.includes(moment().format("d"))) todayData.push(item);

          regularDays.forEach((day: string) => {
            const times = lessonTimes[day];
            if (times) {
              const { stime = "", etime = "" } = times;

              if (stime && etime) {
                acc.push({
                  id: `${id}`,
                  title: name,
                  daysOfWeek: [day],
                  startTime: `${stime}:00`,
                  endTime: `${etime}:00`,
                  color: getColorForType(name),
                });
              }
            }
          });

          return acc;
        },
        []
      );

      setTodaySession(todayData);

      setCalendarData(events);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }, [setCalendarData]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const { startStr = "", endStr = "" } = selectInfo;

    // 날짜 차이가 1일 이상이면 false 반환
    const diffInDays =
      (new Date(endStr).getTime() - new Date(startStr).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffInDays > 1) return;

    console.log("Single day or single period selected.");
    return true;
  };

  const onClickEventRow = (clickInfo: EventClickArg) => {
    setIsClicked(true);
    setIsFormChanged(false);
    const { event: { id = "", title = "" } = {} } = clickInfo;
    const selection: Session =
      session.find(({ id: _id = "" }) => id === _id) || initialSessionData;

    if (selection?.id) setSelectedData(selection);
  };

  const onClickSave = async () => {
    if (!selectedData?.id) return toast.error("선택된 세션이 없습니다!");

    const { regularDays = [], lessonTimes = {} } = selectedData;

    const filteredLessonTimes: LessionTime = {};

    regularDays.forEach((day) => {
      if (lessonTimes[day]) filteredLessonTimes[day as Day] = lessonTimes[day];
    });

    const submitForm = {
      id: selectedData?.id,
      regularDays: selectedData?.regularDays,
      lessonTimes: filteredLessonTimes,
    };

    try {
      await db.update("session", submitForm);

      toast.success("정상적으로 처리 되었습니다.");

      handleClose();

      setSelectedData(initialSessionData);
      setIsClicked(false);

      onLoadData();
    } catch {
      toast.error("저장에 실패했습니다!");
    }
  };

  const onClickDelete = async () => {
    if (!selectedData?.id) return;

    setProcessing(true);

    try {
      await db.delete("session", selectedData?.id);

      setProcessing(false);
      handleCloseDelete();
      setSelectedData(initialSessionData);
      setIsClicked(false);
      toast.success("정상적으로 처리 되었습니다.");
      onLoadData();
    } catch (e) {
      toast.error("오류가 발생했습니다.");
    }
  };

  const selectAllow = (selectInfo: any) => {
    // 항상 true를 반환하여 하나의 범위만 선택 가능하게 합니다.
    return true;
  };

  useEffect(() => {
    onLoadData();
  }, []);

  const memorizedCalendar = useMemo(() => {
    return (
      <FullCalendar
        key={JSON.stringify(calendarData)}
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "오늘로 이동",
          month: "월",
          week: "주",
          day: "일",
          list: "리스트",
        }}
        dayMaxEvents={3}
        editable={false}
        selectable={true}
        initialView="dayGridMonth"
        locale="ko"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        allDaySlot={false}
        events={calendarData}
        eventClick={onClickEventRow}
        select={handleDateSelect}
      />
    );
  }, [calendarData, onClickEventRow]);

  return (
    <>
      <Box
        sx={{
          height: "75vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          overflow: "hidden",
          p: 1,
        }}
      >
        <Box
          sx={{
            width: "70%",
            transition: "width 0.5s ease-in-out",
            overflow: "hidden",
            position: "relative",
            border: (theme) => `2px solid ${theme.palette.grey[100]}`,
            borderRadius: 5,
            p: 3,
            mr: 5,
          }}
        >
          {memorizedCalendar}
        </Box>

        <Box
          sx={{
            width: "30%",
            height: "100%",
            border: (theme) => `2px solid ${theme.palette.grey[100]}`,
            borderRadius: 5,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              {isClicked && (
                <ButtonBase
                  onClick={() => {
                    handleOpenDelete();
                    // setIsClicked(false);
                    // setSelectedData(initialSessionData);
                  }}
                >
                  <DeleteForeverIcon sx={{ color: "error.main" }} />
                </ButtonBase>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              {isClicked && (
                <ButtonBase
                  onClick={() => {
                    setIsClicked(false);
                    setSelectedData(initialSessionData);
                  }}
                >
                  <CloseIcon />
                </ButtonBase>
              )}
            </Box>
          </Box>
          {isClicked ? (
            <Box sx={{ height: "100%" }}>
              <Box sx={{ height: "80%" }}>
                <SessionForm form={selectedData} setForm={setSelectedData} />
              </Box>
              <Button
                disabled={!editAccessState}
                variant="contained"
                sx={{
                  background: (theme) => theme.palette.primary.main,
                  height: "40px",
                  width: "100%",
                }}
                onClick={handleOpen}
              >
                <Box style={{ width: "100%", justifyContent: "center" }}>
                  <Typography variant="h5" color="inherit" fontWeight="bold">
                    확인
                  </Typography>
                </Box>
              </Button>
            </Box>
          ) : (
            <>
              <DaySession sessions={todaySession} />
            </>
          )}
        </Box>
      </Box>

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => onClickSave()}
        title={`세션정보 수정하기`}
        content={`세션 정보를 변경하시겠습니까?`}
        processing={processing}
      >
        <Box sx={{ minWidth: 80, my: 2 }}></Box>
      </AlertModal>

      <AlertModal
        open={openDelete}
        handleClose={handleCloseDelete}
        onClickCheck={() => onClickDelete()}
        title={`세션정보 삭제`}
        content={`세션 정보를 삭제하시겠습니까?`}
        processing={processing}
      >
        <Box sx={{ minWidth: 80, my: 2 }}></Box>
      </AlertModal>
    </>
  );
};

export default SessionComponent;
