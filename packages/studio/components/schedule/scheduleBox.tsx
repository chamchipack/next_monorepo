'use client'
import {
    DateSelectArg,
    EventClickArg,
    EventDropArg,
    DatesSetArg,
} from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import { styled } from "@mui/system";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import ScheduleDrawer from "@/components/common/drawer/ScheduleDrawer";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "@/config/axios/axios";
import fetchCall from '@/config/utils/fetchFormMaker'
import { ScheduleItem, MemberItem } from "@/config/type/types"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { recoilMembers, refreshScheduleState } from "@/recoil/recoilState";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import '@/styles/styles.module.css'

interface onLoadData<T> {
    (startStr: T, endStr: T, type: T): void;
}

interface CurrentDates {
    start: string;
    end: string;
}

const weeks = [
    { text: "일", value: 0 },
    { text: "월", value: 1 },
    { text: "화", value: 2 },
    { text: "수", value: 3 },
    { text: "목", value: 4 },
    { text: "금", value: 5 },
    { text: "토", value: 6 },
];

interface ScheduleProps {
    left: boolean;
    center: boolean;
    right: boolean;
}

const Schedule = ({ height, scheduleProps, drawerCtrl }: { height: string, scheduleProps: ScheduleProps, drawerCtrl: boolean }) => {
    const memberState = useRecoilValue(recoilMembers);
    const refreshSchedule = useRecoilValue(refreshScheduleState);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [members, setMembers] = useState<MemberItem[]>([]);
    const [currentDates, setCurrentDates] = useState<CurrentDates>({ start: '', end: '' });
    const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
    const [currentSchedule, setCurrentSchedule] = useState<ScheduleItem>({
        id: "",
        start: "",
        end: "",
        title: "",
        memberId: "",
        daysOfWeek: [],
        isRecurring: false,
        startRecur: "",
        endRecur: "",
        startTime: "",
        endTime: "",
        color: "",
        status: "D",
    });
    const [color, setColor] = useState<string>("");

    const clearState = () => {
        resetCurrentSchedule("", "");
        setSelectedWeeks([]);
        setColor("");
    };

    const resetCurrentSchedule = (startStr: string, endStr: string) =>
        setCurrentSchedule({
            id: "",
            start: startStr,
            end: endStr,
            title: "",
            memberId: "",
            daysOfWeek: [],
            isRecurring: false,
            startRecur: "",
            endRecur: "",
            startTime: "",
            endTime: "",
            color: "",
            status: "D",
        });

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const { startStr = "", endStr = "" } = selectInfo;
        const end = moment(endStr).subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")
        resetCurrentSchedule(moment(startStr).format("YYYY-MM-DD HH:mm:ss"), end);
        setDrawerOpen(true);
    };

    const onClickDetailPopup = (clickInfo: EventClickArg) => {
        setDrawerOpen(true);
        const { event: { id = "", title = "" } = {} } = clickInfo;
        const { memberId = "", color = "", status = "", isRecurring, daysOfWeek = [], start = "", end = "", startTime, endTime, startRecur = "", endRecur = "", } = schedule.find(({ id: _id }) => id === _id) || {};
        if (isRecurring && daysOfWeek.length) {
            setSelectedWeeks(
                weeks
                    .filter(({ value = 0 }: { value: number }) => daysOfWeek.includes(value))
                    .map(({ value }) => value)
            );
        }
        const _sdate = `${startRecur} ${startTime}`
        const _edate = `${endRecur} ${endTime}`

        setCurrentSchedule({
            id,
            title,
            start: moment(start ? start : _sdate).format("YYYY-MM-DD HH:mm:ss"),
            end: moment(end ? end : _edate).format("YYYY-MM-DD HH:mm:ss"),
            startRecur: moment(startRecur).format("YYYY-MM-DD HH:mm:ss"),
            endRecur: moment(endRecur).format("YYYY-MM-DD HH:mm:ss"),
            memberId,
            daysOfWeek: selectedWeeks,
            isRecurring: isRecurring || false,
            startTime: "",
            endTime: "",
            color,
            status,
        });
        setColor(color || "default");
    };

    useEffect(() => {
        const fetchName = async () => {
            const response = await fetch('/api/members', {
                method: 'POST', // 요청 메서드 지정
                body: JSON.stringify({ data: 'sdf' }), // JavaScript 객체를 JSON 문자열로 변환
            });
            // const response = await fetch('/api/members');
            const data = await response.json();
        };

        // fetchName();
    }, []);

    const onClickDropEvent = async (dropInfo: EventDropArg) => {
        if (!drawerCtrl) return toast.error("현재모드는 드랍해도 저장되지 않습니다!");

        const { view: { activeStart, activeEnd }, event: { id = "", title = "", start = "", end = "" } = {} } = dropInfo;
        const { isRecurring } = schedule.find(({ id: _id }) => id === _id) || {};

        if (isRecurring) {
            dropInfo.revert();
            return toast.error("반복주기는 드랍으로 변경할수없습니다");
        }
        const edate = !isNaN(Date.parse(String(end)))
            ? moment(end).format("YYYY-MM-DD HH:mm:ss")
            : "";

        const data = { id, title, sdate: moment(start).format("YYYY-MM-DD HH:mm:ss"), edate, name: title };

        try {
            await fetchCall.put(`/api/schedules`, data)
            clearState();
            toast.success("성공적으로 저장되었습니다");
            onLoadData(moment(activeStart).format('YYYY-MM-DD'), moment(activeEnd).format('YYYY-MM-DD'), 'dayGridMonth')
        } catch (error) {
            toast.error("저장에 실패했습니다!");
        }
    };

    const onClickSave = async () => {
        const { id = "", memberId = "", title = "", start = "", end = "", isRecurring } = currentSchedule || {};
        const { name: memberName = '' } = members.find(({ id = '' }) => memberId === id) || {}

        if (!start) return toast.error("시작일을 지정해주세요!");
        if (!title) return toast.error("일정명을 입력해주세요!");

        const sdate = moment(start).format("YYYY-MM-DD HH:mm:ss");
        const edate = !isNaN(Date.parse(end)) ? moment(end).format("YYYY-MM-DD HH:mm:ss") : "";
        const data = { memberName, memberId, color, title, sdate, edate, name: title, isRecurring, daysOfWeek: isRecurring ? selectedWeeks : [], status: "D" };
        if (sdate === edate) return toast.error('시작일과 종료일을 다르게 입력해주세요')
        if (moment(sdate).format('HH:mm') === moment(edate).format('HH:mm')) return toast.error('시작 및 종료일 시간을 변경해주세요')

        try {
            if (!id) await fetchCall.post("/api/schedules", data);
            else await fetchCall.put("/api/schedules", Object.assign(data, { id }));
        } catch (error) {
            toast.error("저장에 실패했습니다!");
            return;
        }

        const { start: _start = '', end: _end = '' } = currentDates

        clearState();
        setDrawerOpen(false);
        toast.success("성공적으로 저장되었습니다");
        onLoadData(moment(_start).format('YYYY-MM-DD'), moment(_end).format('YYYY-MM-DD'), 'dayGridMonth')
    };

    const onClickResize = async (drag: EventResizeDoneArg) => {
        const { event: { id = "", title = "", start = "", end = "" } = {} } = drag;
        const { isRecurring } = schedule.find(({ id: _id }) => id === _id) || {};

        if (isRecurring) {
            drag.revert();
            return toast.error("반복주기는 드랍으로 변경할수없습니다");
        }
        const data = {
            id,
            title,
            sdate: moment(start).format("YYYY-MM-DD HH:mm:ss"),
            edate: moment(end).format("YYYY-MM-DD HH:mm:ss"),
            name: title,
        };

        try {
            await fetchCall.put(`/api/schedules`, data)
            clearState();
            toast.success("성공적으로 저장되었습니다");
        } catch (error) {
            toast.error("저장에 실패했습니다!");
        }
    };

    const onClickDelete = async () => {
        const firmed = confirm('일정을 삭제하시겠습니까?')
        if (!firmed) return
        const { id = "" } = currentSchedule || {};

        try {
            await fetchCall.delete(`/api/schedules?id=${id}`)
            toast.success("성공적으로 삭제되었습니다");
        } catch (error) {
            toast.error("삭제 도중 에러가 발생했습니다");
            return;
        }
        const { start: _start = '', end: _end = '' } = currentDates

        clearState();
        setDrawerOpen(false);
        onLoadData(moment(_start).format('YYYY-MM-DD'), moment(_end).format('YYYY-MM-DD'), 'dayGridMonth')
    };

    const onClickChangeDate = (arg: DatesSetArg) => {
        const { startStr, endStr, view: { type } } = arg;
        setCurrentDates({ start: startStr, end: endStr })

        onLoadData(
            moment(startStr || "").format("YYYY-MM-DD"),
            moment(endStr || "").format("YYYY-MM-DD"),
            type
        );

    };

    const onLoadMembers = async () => {
        let params = `status = "O"`
        const filter = encodeURIComponent(params);
        const { data: { items = [] } = {} } = await fetchCall.get(`/api/members?perPage=1000&filter=${filter}`)

        const result: MemberItem[] = items.map(({ id, name, age, gender }: { id: string; name: string; age: string; gender: string; }) => ({
            id, name, age, gender
        })
        );
        setMembers(result);
    };

    const onLoadData: onLoadData<string> = async (startStr, endStr, type) => {
        const params = `status="D" && (sdate <= "${endStr}" && edate >= "${startStr}") || (sdate <= "${startStr}" && edate >= "${endStr}")`

        const filter = encodeURIComponent(params);
        const { data: { items = [] } = {} } = await fetchCall.get(`/api/schedules?perPage=1000&filter=${filter}`)

        const result: ScheduleItem[] = items.map(
            ({
                id,
                color,
                sdate,
                edate,
                title,
                memberId,
                daysOfWeek,
                isRecurring,
            }: {
                id: string;
                sdate: string;
                edate: string;
                title: string;
                memberId: string;
                daysOfWeek: string[];
                isRecurring: boolean;
                color: string;
            }) => {
                let sdf: number[] = []
                if (daysOfWeek.length) sdf = daysOfWeek.map(item => +item)
                if (isRecurring)
                    return {
                        id,
                        color,
                        title,
                        memberId,
                        startTime: moment(sdate).format('HH:mm:ss'),
                        endTime: moment(edate).format('HH:mm:ss'),
                        daysOfWeek: sdf,
                        startRecur: moment(sdate).format('YYYY-MM-DD'),
                        endRecur: moment(edate).format('YYYY-MM-DD'),
                        isRecurring,
                    };
                else
                    return {
                        id,
                        color,
                        start: sdate,
                        end: edate,
                        title,
                        memberId,
                        isRecurring,
                    };
            }
        );
        setSchedule(result);
    };

    // useEffect(() => {
    //     if (refreshSchedule) {

    //         const { end = '', start = '' } = currentDates
    //         onLoadData(moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), 'dayGridMonth')
    //     }
    // }, [refreshSchedule]);

    useEffect(() => {
        const { end = '', start = '' } = currentDates
        if (end && start) onLoadData(moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), 'dayGridMonth')
        onLoadMembers();
    }, []);


    return (
        <div className="p-3" style={{ height: height }}>
            <FullCalendar
                height="100%"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                headerToolbar={{
                    left: scheduleProps?.left ? "prev,next today" : "",
                    center: scheduleProps?.center ? "title" : "",
                    right: scheduleProps?.right ? "dayGridMonth,timeGridWeek,timeGridDay,listWeek" : "",
                }}
                buttonText={{
                    today: '오늘로 이동',
                    month: '월',
                    week: '주',
                    day: '일',
                    list: '리스트'
                }}
                dayMaxEvents={4}
                datesSet={onClickChangeDate}
                editable={true}
                selectable={true}
                initialView="dayGridMonth"
                locale="ko"
                events={schedule}
                select={handleDateSelect}
                eventClick={onClickDetailPopup}
                eventDrop={onClickDropEvent}
                eventResize={onClickResize}
            />
            {
                drawerCtrl && (
                    <ScheduleDrawer onClickDelete={onClickDelete} onClickSave={onClickSave} currentSchedule={currentSchedule} color={color} setColor={setColor} selectedWeeks={selectedWeeks} setSelectedWeeks={setSelectedWeeks} members={members} setCurrentSchedule={setCurrentSchedule} open={drawerOpen} anchor={'right'} setDrawerState={setDrawerOpen} />
                )
            }

        </div>
    )
}

export default Schedule