import Setter from "@/components/Setter";
import ScheduleTableSelecto from "@/components/ScheduleTableSelecto";
import ScheduleTableSelectoEdit from "@/components/ScheduleTableSelectoEdit";
import eventIdCSS from "@/styles/eventId.module.css";
import ScheduleResultBottom from "@/components/ScheduleResultBottom";
import ScheduleResultRight from "@/components/ScheduleResultRight";

import { FaList } from "react-icons/fa";

import { useState, useEffect } from "react";
import { throttle } from "lodash";

const EventPage = ()=>{
    const [isLogin, setIsLogin] = useState(false);
    const [schedule, setSchedule] = useState({schedule :[]})
    const [totalScheduleList, setTotalScheduleList] = useState({})
    const [name, setName] = useState("");
    const [showMember, setShowMember] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [totalMem, setTotalMem] = useState(4);

    const [width, setWidth] = useState();

    useEffect(()=>{
        if(typeof window !== "undefined"){
            setWidth(window.innerWidth);
        }
    }, [])

    // const handleResize = () => {
    //     setWidth(window.innerWidth);
    // };

    const handleResize = throttle(() => {
        setWidth(window.innerWidth);
    }, 200);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    console.log(showResult);

    return <div className="w-screen h-full min-h-screen ">
        <div className="(header space) w-screen h-20"></div>
        <Setter isLogin={isLogin} setIsLogin={setIsLogin} setName={setName} setTotalMem={setTotalMem} totalMem={totalMem}/>
        <div className="w-screen pt-5 px-20 pb-5">
            <div className="flex flex-row flex-nowrap items-center text-center gap-4 justify-center"> 
                {isLogin? <ScheduleTableSelectoEdit isLogin={isLogin} schedule={schedule} setSchedule={setSchedule} /> : ""}
                <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name} setShowMember={setShowMember} setShowResult={setShowResult} setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}/>
                {!isLogin && width > 768?
                <ScheduleResultRight setShowResult={setShowResult} showResult={showResult} showMember={showMember} scheduleList={totalScheduleList} totalMem={totalMem}/>:"" }
            </div>
        </div>
        {showResult ?
            width <= 768 | isLogin ? 
            <div className={`w-full fixed bottom-0 border-gray border-t-2`}>
                <ScheduleResultBottom setShowResult={setShowResult} showResult={showResult} showMember={showMember} scheduleList={totalScheduleList} totalMem={totalMem}/>
            </div> :
            ""
        : <div className="fixed bottom-2.5 right-2 rounded-full bg-[#eee] w-fit p-4 cursor-pointer">
            <FaList className="w-5 h-5"
                onClick={()=>setShowResult(true)}/>
        </div>}
    </div>
}

export default EventPage;