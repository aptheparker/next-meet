import scheduleTable from "@/styles/scheduleTable.module.css";
import React, {useState, useEffect } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector';
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
// import { type } from './../template/User';
const className_div_theadtd = 'rounded-2xl p-3 pt-4 text-black';

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    fixedDate:Date[] | null;
    fixedTime:{startTime:String, lastTime:String} | null;
    isLogin:boolean;
    week:boolean|0;
    fixedSchedule:{schedule :[]};
    setFixedSchedule:Function;
}

const ScheduleTableConfirm = ({fixedDate, fixedTime, isLogin, week, fixedSchedule, setFixedSchedule}:MyComponentProps) => {
  // console.log(isLogin)


  const selectedWeekDay = fixedDate ? fixedDate: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]; 
 
  const DayList = [] as String[];

  // const dummyDateList = [] as String[];
  const dummyDateList = [] as Date[];
  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

  if(week){ // weekday 0-date, 1-week
    for(let i=0; i<selectedWeekDay.length; i++){
        switch(selectedWeekDay[i]){
            case "MON":
                DayList.push("월");
                break;
            case "TUE":
                DayList.push("화");
                break;
            case "WED":
                DayList.push("수");
                break;
            case "THU":
                DayList.push("목");
                break;
            case "FRI":
                DayList.push("금");
                break;
            case "SAT":
                DayList.push("토");
                break;
            case "SUN":
                DayList.push("일");
                break;
        }
    }
  }
  else{
    var today = new Date();
    var newDay = new Date(today);
    newDay.setDate(today.getDate()+3);
    while (today <= newDay) {
        // let week = WEEKDAY[today.getDay()];
        // dummyDateList.push(today.toISOString().split('T')[0]+'-'+week);
        // today.setDate(today.getDate() + 1);
        var newDate = new Date(today);
        dummyDateList.push(newDate);
        today.setDate(today.getDate()+1);
    }
   }

  const dummyTimePeriod = {startTime : "00:00", lastTime : "24:00"};

  const [dateList, setDateList] = useState(!fixedDate ? dummyDateList : fixedDate);
  // console.log(dateList);
  const [timePeriod, setTimePeriod] = useState(!fixedTime ? dummyTimePeriod : fixedTime);
  const startTimeHour:number = parseInt(timePeriod.startTime.split(':')[0])+parseFloat(timePeriod.startTime.split(':')[1]=='30'?'0.5':'0');
  const lastTimeHour:number = parseInt(timePeriod.lastTime.split(':')[0])+parseFloat(timePeriod.lastTime.split(':')[1]=='30'?'0.5':'0');
//   const periodLen = lastTimeHour-startTimeHour;
   
//    const [schedule, setSchedule] = useState({schedule :[]})
   
  const handleChange = (newSchedule:Date[]) => {
    setFixedSchedule({schedule:newSchedule})
    // console.log(fixedSchedule.schedule);
   }

//    console.log(fixedSchedule);

  return (
        <div className="overflow-hidden overflow-x-auto p-5 bg-[#f8f9fa] rounded">
          <div className={`${scheduleTable.table_spacing} border-separate table-scrolling`}>
            <ScheduleSelector
                selection={fixedSchedule.schedule}
                onChange={(newschedule)=>{handleChange(newschedule)}}
                startDate={dummyDateList[0]}
                numDays={week? DayList.length : dateList.length}
                minTime={startTimeHour}
                maxTime={lastTimeHour}
                hourlyChunks={2}
                renderDateLabel={(date) => {
                    if(!week){
                        let index = Math.abs(date.getTime() - dummyDateList[0].getTime());
                        index = Math.ceil(index / (1000 * 60 * 60 * 24));
                        if(index == 1 && date.getDate() == dummyDateList[0].getDate()){
                            index = 0;
                        }
                        return  <div>
                        {/* <div className={`text-center ${scheduleTable.th_width} ${className_div_theadtd} ${'bg-[#d9d9d9] h-fit'}`}> */}
                        {(dummyDateList[index].getMonth()+1)+'/'+dummyDateList[index].getDate()}
                        {/* <br/> */}
                        {'('+WEEKDAY[dummyDateList[index].getDay()]+")"}
                    </div>
                    }
                    else{
                        return <div style={{height:'25px', minWidth:"50px"}}>
                        {DayList.shift()}
                    </div>}}
                    }
                // renderDateLabel={(date) => {return week ? "ddd" : format(date, 'MM/dd', { locale: ko })}}
                timeFormat="h:mma"
                unselectedColor="#eee"
                hoveredColor="#a2cffe"
                selectedColor="#63c5da"
                rowGap="5px"
                columnGap="7px"
                // renderTimeLabel={(time)=>{handleTimeLabel(time)}}
            />
            
            </div>


        </div>
  );
};

export default ScheduleTableConfirm;