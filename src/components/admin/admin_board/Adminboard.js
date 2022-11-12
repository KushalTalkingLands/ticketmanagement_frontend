import React,{useState,useEffect} from 'react';
import Title from '../../header/Header';
import axios from 'axios';
import "./adminboard.css";
import { useNavigate } from 'react-router';

const Admin_dashboard=()=>{

    //Variable Declaration
    const [ticket,setticket]=useState();
    const navigate = useNavigate();
    //Use-Effect to get tickets on first time load
    useEffect(()=>{
        getSomeDataWithAsync();
    },[])
    
    //Function to get data 
    async function getSomeDataWithAsync() {
        
        const response = await axios.get("http://localhost:3000/tickets");
    
        const { data } = response;
        setticket(data);
    }
    const handleOpenTicket=(e,id)=>{
        navigate(`tickets/${id}`);
    }
    
    return(
        <>
         <div className='ticket-main-div'>
            <Title state={true}/>
            <div className='admin-ticket-segregation-div'>
                <div className='admin-ticket-open-status'>
                <div className='TicketDisplay-admin'>
                <h2 className='admin-status-open'>Open</h2>
                {ticket && ticket.map((d,i)=>{
                    return (
                        <>
                        {ticket[i].status === 'Open' ?
                          <div className="ticket-show" onClick={(e) => handleOpenTicket(e, ticket[i].id)}>
                            <h2 className="ticket-name">{ticket[i].title}</h2>
                            <div className='ticket-date-div'>
                            <p className='ticket-date-title'>Issue Date :</p>
                            <p className='ticket-date'>{ticket[i].date}</p>
                            </div>
                            <div className='ticket-status-div'>
                            <p className='ticket-status-title'>Current Status:</p>
                            <p className='ticket-status'>{ticket[i].status}</p>
                            </div>
                          </div>:""
                }
                        </>
                      )
                })}
            </div>
                </div>
                <div className='admin-ticket-inprogress-status'>
                <div className='TicketDisplay-admin'>
                <h2 className='admin-status-Inprogress'>InProgress</h2>
                {ticket && ticket.map((d,i)=>{
                    return (
                        <>
                        {ticket[i].status === 'InProgress' ?
                          <div className="ticket-show" onClick={(e) => handleOpenTicket(e, ticket[i].id)}>
                            <h2 className="ticket-name">{ticket[i].title}</h2>
                            <div className='ticket-date-div'>
                            <p className='ticket-date-title'>Issue Date :</p>
                            <p className='ticket-date'>{ticket[i].date}</p>
                            </div>
                            <div className='ticket-status-div'>
                            <p className='ticket-status-title'>Current Status:</p>
                            <p className='ticket-status'>{ticket[i].status}</p>
                            </div>
                          </div>:""
                }
                        </>
                      )
                })}
            </div>
                </div>
                <div className='admin-ticket-completed-status'>
                <div className='TicketDisplay-admin'>
                <h2 className='admin-status-complete'>Completed</h2>
                {ticket && ticket.map((d,i)=>{
                    return (
                        <>
                        {ticket[i].status === 'Completed' ?
                          <div className="ticket-show" onClick={(e) => handleOpenTicket(e, ticket[i].id)}>
                            <h2 className="ticket-name">{ticket[i].title}</h2>
                            <div className='ticket-date-div'>
                            <p className='ticket-date-title'>Issue Date :</p>
                            <p className='ticket-date'>{ticket[i].date}</p>
                            </div>
                            <div className='ticket-status-div'>
                            <p className='ticket-status-title'>Current Status:</p>
                            <p className='ticket-status'>{ticket[i].status}</p>
                            </div>
                          </div>:""
                }
                        </>
                      )
                })}
            </div>
                </div>
                <div className='admin-ticket-reviewandclose-status'>
                <div className='TicketDisplay-admin'>
                    <h2 className='admin-status-closed'>Closed</h2>
                {ticket && ticket.map((d,i)=>{
                    return (
                        <>
                        {ticket[i].status === 'Closed' ?
                          <div className="ticket-show" onClick={(e) => handleOpenTicket(e, ticket[i].id)}>
                            <h2 className="ticket-name">{ticket[i].title}</h2>
                            <div className='ticket-date-div'>
                            <p className='ticket-date-title'>Issue Date :</p>
                            <p className='ticket-date'>{ticket[i].date}</p>
                            </div>
                            <div className='ticket-status-div'>
                            <p className='ticket-status-title'>Current Status:</p>
                            <p className='ticket-status'>{ticket[i].status}</p>
                            </div>
                          </div>:""
                }
                        </>
                      )
                })}
            </div>
                </div>
            </div>
        </div>
        </>
    );
}
export default Admin_dashboard;