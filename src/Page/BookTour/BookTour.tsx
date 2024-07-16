import React, { useState, useEffect } from 'react';
import "./BookTour.css"
import { singleProfile } from '../../api/settings';
import { DESKIE_API as API } from '../../config';
import logo from "../../Assets/Images/logo/logo.svg";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import calenderIcon from "../../Assets/Images/icon/calendar-date.svg";
import calenderActiveIcon from "../../Assets/Images/icon/calendar-date-active.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import { v4 as uuidv4 } from 'uuid';
import { showNotifications } from '../../CommonFunction/toaster';
import { tourAdd, tourTime } from '../../api/tour';
import confirmIcon from "../../Assets/Images/icon/check-circle.svg"
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DayCellContentArg } from '@fullcalendar/core';

const BookTour = () => {
    const [profile, setProfile] = useState<any>();
    const [selectDate, setSelectDate] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectDay, setSelectDay] = useState("");
    const [selectTime, setSelectTime] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [dateChoose, setDateChoose] = useState(true);
    const [tourInfo, setTourInfo] = useState(false);
    const [confirmBook, setConfirmBook] = useState(false);
    const [tourDate, setTourDate] = useState("");
    const [bookTourDate, setBookTourDate] = useState([]);

    const bookTimes = ["9 AM", "10 AM", "11 AM", "12 AM", "1 PM", "2 PM", "3 PM", "4 PM"];

    const isTimeBooked = (time: string, bookedTimes:any) => {
        return bookedTimes.includes(time) ? "booked" : "";
    };

    useEffect(() => {
        singleProfile().then((data) => {
            setProfile(data.data);
        })

    }, [])

    const handleDateClick = (arg: DateClickArg) => {
        setSelectedDate(arg.dateStr);
    };

    const handleSelect = (info: any) => {
        setTourDate(info.startStr);
        const selectedDate = info.start;
        const date = new Date(selectedDate);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setSelectDay(dayOfWeek);
        setSelectDate(formattedDate);
        tourTime(info.startStr).then((data) => {
            setBookTourDate(data)
        })
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };

    const dateAdd = () => {
        setDateChoose(false)
        setTourInfo(true)
    }

    const saveTour = () => {
        let invoiceInfo = {
            "id": uuidv4(),
            "tour_day": selectDay,
            "tour_date": tourDate,
            "tour_time": selectTime,
            "name": name,
            "phone": phoneNumber,
            "email": email
        }
        tourAdd(invoiceInfo).then((data) => {
            if (data.statusCode !== 201) {
                showNotifications("error", data.message);
            }
            else {
                showNotifications("success", data.message);
                setTourInfo(false)
                setConfirmBook(true)
            }
        })
    }

    const dayCellClassNames = (arg: DayCellContentArg) => {
        const formattedDate = arg.date.toISOString().substring(0, 10);
        
        if (!selectedDate && formattedDate === new Date(new Date().getTime() - 24 * 3600 * 1000).toISOString().substring(0, 10)) {
            return ['selected-date'];
        }
        
        if (selectedDate) {
            const oneDayBefore = new Date(new Date(selectedDate).getTime() - 24 * 3600 * 1000).toISOString().substring(0, 10);
            
            if (formattedDate === oneDayBefore) {
                return ['selected-date'];
            }
        }

        return [];
    };

    return (
        <section className='bookTour'>
            <ToastContainer />
            <div className="signUpBox">
                <div className="logo mb-4">
                    {profile && profile.company_logo_dark ?
                        <img src={`${API}/${profile.company_logo_dark}`} alt="logo" />
                        : <img src={logo} alt="logo" />
                    }
                </div>
                {dateChoose ? <>
                    <div className="bookCalender">
                        <h6>Book a Tour</h6>
                        <div className="selectBook">
                            <div className="selectDate tourView">
                                <FullCalendar
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    weekends={true}
                                    select={handleSelect}
                                    dateClick={handleDateClick}
                                    selectable={true}
                                    dayCellClassNames={dayCellClassNames}
                                    headerToolbar={{
                                        left: '',
                                        center: 'prev,title,next',
                                        right: ""
                                    }}
                                />
                            </div>
                            <div className="selectTime">
                                {selectDay ? <div className="selectedDate">
                                    <div className='dateTime'>
                                        <img src={calenderActiveIcon} alt="calender" />
                                        <div className='w-100 d-flex align-items-center justify-content-between' style={{marginLeft: '16px'}}>
                                            <div>
                                                <p>{selectDay}</p>
                                                <p>{selectDate}</p>
                                            </div>
                                            <div>
                                                <p>{selectTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="chooseDate">
                                    <img src={calenderIcon} alt="calender" />
                                    <p>Pick a Date</p>
                                </div>}


                                <div className="pickTime">
                                    <h4>Pick a Time</h4>
                                    {bookTimes.map((time) => (
                                        <button
                                            key={time}
                                            onClick={()=> isTimeBooked(time, bookTourDate) === 'booked' ?   null : setSelectTime(time)  }
                                            className={`
                                            ${selectTime === time ? 'activeTime' : ""} 
                                            ${isTimeBooked(time, bookTourDate) ? 'booked' : ""}
                                          `}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                    {/* <button className={selectTime === "9 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("9 AM")}>9 AM</button>
                                    <button className={selectTime === "10 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("10 AM")}>10 AM</button>
                                    <button className={selectTime === "11 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("11 AM")}>11 AM</button>
                                    <button className={selectTime === "12 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("12 AM")}>12 AM</button>
                                    <button className={selectTime === "1 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("1 PM")}>1 PM</button>
                                    <button className={selectTime === "2 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("2 PM")}>2 PM</button>
                                    <button className={selectTime === "3 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("3 PM")}>3 PM</button>
                                    <button className={selectTime === "4 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("4 PM")}>4 PM</button>
                                */}
                                </div>
                            </div>
                        </div>
                        <div className="bookTourBtn">
                            {/* <button className="back"><FontAwesomeIcon icon={faArrowLeft} /> Back</button> */}
                            <button className="next" onClick={dateAdd}>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                        </div>
                    </div>
                </> : ""}
                {tourInfo ? <><div className="bookInfo">
                    <h6>Book a Tour</h6>
                    <div className='selectTime mb-3'>
                        <div className="selectedDate">
                            <img src={calenderActiveIcon} alt="calender" />
                            <div className='dateTime mb-0'>
                                <div>
                                    <p>{selectDay}</p>
                                    <p>{selectDate}</p>
                                </div>
                                <div>
                                    <p>{selectTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="memberInput">
                        <label>Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} placeholder='Enter name' className='form-control' required />
                    </div>
                    <div className="numberInput">
                        <label>Phone Number</label>
                        <PhoneInput country={'us'} disableCountryCode={false} onChange={(value) => handlePhoneChange(value)} />
                    </div>
                    <div className="memberInput">
                        <label>Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter email address' className='form-control' required />
                    </div>
                    <div className="bookTourBtn">
                        <button className="back"><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                        <button className="next" onClick={saveTour}>Submit</button>
                    </div>
                </div></> : ""}

                {confirmBook ? <div className="bookInfo">
                    <div className='text-center mb-3'>
                        <img src={confirmIcon} alt="confirm" />
                    </div>
                    <h6>Tour Confirmed!</h6>
                    <div className='selectTime mt-4'>
                        <div className="selectedDate">
                            <img src={calenderActiveIcon} alt="calender" />
                            <div className='dateTime mb-0'>
                                <div>
                                    <p>{selectDay}</p>
                                    <p>{selectDate}</p>
                                </div>
                                <div>
                                    <p>{selectTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bookTourBtn" style={{marginTop: '32px'}}>
                        <Link to="/" className="next">Back to website</Link>
                    </div>
                </div> : ""}


            </div>
        </section>
    )
}

export default BookTour