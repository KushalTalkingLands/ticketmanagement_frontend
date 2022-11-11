import React,{useEffect, useState} from "react";
import Title from "../header/Header";
import "./newticket.css";
import {useParams} from 'react-router';
import axios from 'axios';

const Ticket=(props)=>{
    const params =useParams();
    const id = params.id;
    const [ticket,setticket]=useState();
    useEffect(()=>{
        axios.get(`http://localhost:3000/tickets/${id}`)
        .then((res)=>{
            console.log(res.data);
            setticket(res.data)})
    },[])
    return(
        <>
        <Title/>
        <div className="single-ticket-button">
            <button className="single-ticket-back-button">Go Back</button>
            <button className="single-ticket-delete-button">Delete Ticket</button>
        </div>
        <div className="single-ticket-main-div">
            <div className="single-ticket-head">
            <h1>{ticket ? ticket.title:"Ticket Title"}</h1>
            </div>
            <div className="single-ticket-date">
                <p className="single-ticket-text">Issue Date :</p>
                <p>{ticket ? ticket.date:"Ticket Issue Date"}</p>
            </div>
            <div className="single-ticket-category">
                <p className="single-ticket-text">Category :</p>
                <div className="single-ticket-category-list">
                {ticket ? ticket.category.map((d,i)=>{
                    return(
                        <>
                        <p>{ticket.category[i]}</p>
                        </>
                    )
                }):"Ticket Issue Date"}
                </div>
            </div>
            <div className="single-ticket-desc">
                <p className="single-ticket-text">Description</p>
                <p>{ticket ? ticket.description:"Ticket Description"}</p>
            </div>
        </div>
        </>
    );
}
export default Ticket;