import React, { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import blankUser from "../../Assets/Images/icon/blank-profile.jpg";
import { singleSpaces } from '../../api/spaces';
import { DESKIE_API as API } from '../../config';
import penIcon from "../../Assets/Images/icon/pencil-01.png";
import spaceIcon from "../../Assets/Images/icon/spaceAvatar.png";
import Layout from '../Layout/Layout';
import { Link, useParams } from 'react-router-dom';
import EditSpaces from './EditSpaces';



const ViewSpaces = () => {
    const { id } = useParams();
    const [spacesDetails, setSpacesDetails] = useState<any>({});
    const [spacesId, setSpacesId] = useState('');
    const [updateShow, setUpdateShow] = useState(false);
    const handleUpdateClose = () => setUpdateShow(false);

    useEffect(() => {
        if (id) {
            singleSpaces(id).then((data) => {
                setSpacesDetails(data.data && data.data);
            })
        }

    }, []);

    const spacesUpdate = (spacesId: string) => {
        setSpacesId(spacesId);
        setUpdateShow(true);
    }

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="invoiceHeading">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 ms-2">
                                <li className="breadcrumb-item"><Link to="/assets">Assets</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{spacesDetails.name}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="spacesDetailsBox">
                        <div className="topLine">
                            <div className="memberName">
                                <Link to="/assets" className='backDashboard'><FontAwesomeIcon icon={faArrowLeft} /></Link>
                                <h6> {spacesDetails.name}</h6>
                            </div>
                            <div className="editBtn">
                                <button onClick={() => spacesUpdate(spacesDetails.id)}><img src={penIcon} alt="edit" /> Edit Asset</button>
                            </div>
                        </div>
                        <div className="spacesInfo">
                            <div className="leftSpacesImage">
                                {spacesDetails.space_image ?
                                    <img src={`${API}/${spacesDetails.space_image}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <img src={spaceIcon} width="100px" height="100px" alt="shop" />
                                }
                            </div>
                            <div className="rightSpacesContent">
                                <div className="spacesHeadingBox">
                                    <h6>{spacesDetails.name}
                                        <span className='deskType'>
                                            {spacesDetails.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                            {spacesDetails.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                            {spacesDetails.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                        </span>
                                    </h6>
                                    <h6>${spacesDetails.rate}</h6>
                                </div>
                                <div className="spacesDescription">
                                    <div className='spacesMiddle'>
                                        <div className="spacesSize">
                                            <h6>Size</h6>
                                            <p>{spacesDetails.size}</p>
                                        </div>
                                        <div className="spacesType" style={{ borderLeft: '1px solid rgba(234, 236, 240, 1)' }}>
                                            <h6>Type</h6>
                                            <span className='deskType'>
                                                {spacesDetails.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                                {spacesDetails.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                                {spacesDetails.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="spacesNotes">
                                        <h6>Notes</h6>
                                        <p>{spacesDetails.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            <EditSpaces spacesId={spacesId} updateShow={updateShow} setUpdateShow={setUpdateShow} handleUpdateClose={handleUpdateClose} />
        </>
    )
}

export default ViewSpaces