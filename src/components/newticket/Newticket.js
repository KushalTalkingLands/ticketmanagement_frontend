import React,{useEffect, useState} from "react";
import Title from "../header/Header";
import "./newticket.css";
import {useParams} from 'react-router';
import axios from 'axios';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';

const Ticket=(props)=>{

    //Variable Declarartions
    const params =useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [ticket,setticket]=useState();

    //UseEffect to Get Single Ticket
    useEffect(()=>{
        axios.get(`http://localhost:3000/tickets/${id}`)
        .then((res)=>{
            console.log(res.data);
            setticket(res.data)})
    },[])

    //function to handle back button
    const handlePrev=()=>{
        navigate(`/`)
    }

    //Function to handle delete button
    const handleDelete=()=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#D85E54',
            cancelButtonColor:'#a2a7ab'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3000/tickets/${id}`)
                .then((res)=>{
                    Swal.fire({icon: 'success', title: 'Ticket Removed Successfully'});
                console.log(res.data);
                navigate('/') 
            })
            }
          })
    }
    return(
        <>
        <Title/>
        <div className="single-ticket-button">
            <button className="single-ticket-back-button" onClick={handlePrev}>Go Back</button>
            <button className="single-ticket-delete-button" onClick={handleDelete}>Delete Ticket</button>
        </div>
        <div className="single-ticket-main-div">
            <div className="single-ticket-head">
            <h1 className="single-ticket-title">{ticket ? ticket.title:"Ticket Title"}</h1>
            </div>
            <div className="single-ticket-info">
            <div className="single-ticket-date">
                <p className="single-ticket-text">Issue Date :-</p>
                <p className="single-ticket-info-text">{ticket ? ticket.date:"Ticket Issue Date"}</p>
            </div>
            <div className="single-ticket-category">
                <p className="single-ticket-text">Category :-</p>
                <div className="single-ticket-category-list">
                {ticket ? ticket.category.map((d,i)=>{
                    return(
                        <>
                        <p className="single-ticket-info-text">{ticket.category[i]}</p>
                        </>
                    )
                }):"Ticket Issue Date"}
                </div>
            </div>
            <div className="single-ticket-desc">
                <p className="single-ticket-text">Description :-</p>
                <p className="single-ticket-info-text">{ticket ? ticket.description:"Ticket Description"}</p>
            </div>
            <div className="single-ticket-desc">
                <p className="single-ticket-text">Remarks Given By Mechanic :-</p>
                <p className="single-ticket-info-text">{ticket.remarks ? ticket.remarks:"Remarks Not Given Any!"}</p>
            </div>
            <div className="single-ticket-status">
                <p className="single-ticket-text">Status :-</p>
                <p className="single-ticket-info-text-status">{ticket ? ticket.status:"Ticket Status"}</p>
            </div>
            </div>
        </div>
        </>
    );
}
export default Ticket;