import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { resourceBook, singleResource } from '../../api/resource';
import Layout from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import penIcon from "../../Assets/Images/icon/pencil-01.png";
import spaceIcon from "../../Assets/Images/icon/spaceAvatar.png";
import { DESKIE_API as API } from '../../config';
import "./ViewResource.css"
import { faEye } from '@fortawesome/free-regular-svg-icons';
import calenderIcon from "../../Assets/Images/icon/calendar-check-01.svg"
import ResourceBooking from '../ResourceBooking/ResourceBooking';
import { formatResourceDate } from '../../CommonFunction/Function';

const MemberResource = () => {
    const { id } = useParams();
    const location = useLocation();
    const pathParts = location.pathname.split('/');


    const [resourceDetails, setResourceDetails] = useState<any>({});
    const [bookList, setBookList] = useState<any[]>([]);
    const [paymentShow, setPaymentShow] = useState(false);
    const handlePaymentClose = () => setPaymentShow(false);
    const handlePaymentShow = () => setPaymentShow(true);
    useEffect(() => {
        if (id) {
            singleResource(id).then((data) => {
                setResourceDetails(data)
            })
            resourceBook(id).then((data) => {
                setBookList(data)
            })
        }
    }, [paymentShow]);
    return (
        <Layout>
            <div className='mainContent'>
                <div className="resourcesMember">
                    <div className="memberBox">
                        <div className="topLine">
                            <div className="memberName">
                                <Link to={pathParts[1] === "resources" ? "/resources" : "/my-resources"} className='backDashboard'><FontAwesomeIcon icon={faArrowLeft} /></Link>
                                <h6> {resourceDetails.name}</h6>
                            </div>
                            <div className="editBtn">
                            <button onClick={handlePaymentShow}><FontAwesomeIcon icon={faPlus} /> Reserve</button>
                            </div>
                        </div>
                        <div className="resourceDescription">
                            <div className="resourceInfo">
                                <div className="memberMiniBox">
                                    <div className="resourceName">
                                        <h6>Capacity</h6>
                                        <p>{resourceDetails.capacity}</p>
                                    </div>
                                    <div className="resourceName">
                                        <h6>Type</h6>
                                        <div className='resourceType'>
                                            {resourceDetails.type === "meeting" ? <span className='meeting'>Meeting Space</span> : ""}
                                            {resourceDetails.type === "equipment" ? <span className='equipment'>Equipment</span> : ""}
                                            {resourceDetails.type === "workspace" ? <span className='workspace'>Workspace</span> : ""}
                                            {resourceDetails.type === "other" ? <span className='other'>Other</span> : ""}
                                        </div>
                                    </div>
                                    <div className="resourceName">
                                        <h6>Rate (Members)</h6>
                                        <p>{resourceDetails.member_rate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="resourceImg mt-4">
                                {resourceDetails.image ?
                                    <img src={`${API}/${resourceDetails.image}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <img src={spaceIcon} width="100px" height="100px" alt="shop" />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="upcomingListResources memberBook">
                        <div className="resourceImage">
                            <div className="resourceBooking mt-3">
                                <div className="bookingHeading">
                                    <h6><img src={calenderIcon} alt="edit" /> Upcoming Booking</h6>
                                </div>
                                {bookList && bookList.map((resource) => <div className="bookingPerson">
                                    <img src={`${API}/${resource.resource_image}`} alt="edit" />
                                    <div>
                                        <p>{resource.resource_name}</p>
                                        <span>{formatResourceDate(resource.book_date)}</span>
                                    </div>
                                    <button><FontAwesomeIcon icon={faEye} /></button>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <ResourceBooking resourceDetails={resourceDetails} paymentShow={paymentShow} setPaymentShow={setPaymentShow} handlePaymentClose={handlePaymentClose} />
            </div>
        </Layout>
    )
}

export default MemberResource