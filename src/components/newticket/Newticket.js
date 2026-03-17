import React,{useEffect, useState} from "react";
import Title from "../header/Header";
import {useParams} from 'react-router';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { api } from "../../lib/api";

const Ticket=(props)=>{

    //Variable Declarartions
    const params =useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [ticket,setticket]=useState();

    //UseEffect to Get Single Ticket
    useEffect(()=>{
        api.get(`/tickets/${id}`)
        .then((res)=>{
            setticket(res.data)})
    },[id])

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
                api.delete(`/tickets/${id}`)
                .then((res)=>{
                    Swal.fire({icon: 'success', title: 'Ticket Removed Successfully'});
                navigate('/') 
            })
            }
          })
    }
    return(
        <>
        <Title/>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 items-stretch justify-between md:flex-row md:items-center">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={handlePrev}
              >
                Go Back
              </Button>
              <Button
                variant="default"
                className="bg-rose-600 hover:bg-rose-700 w-full md:w-auto"
                onClick={handleDelete}
              >
                Delete Ticket
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-slate-900/70 p-4 sm:p-6 shadow-lg space-y-4">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
                {ticket ? ticket.title : "Ticket Title"}
              </h1>
            </div>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <p className="font-semibold text-slate-100">Issue Date:</p>
                <p className="text-slate-300">
                  {ticket ? ticket.date : "Ticket Issue Date"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-100">Category:</p>
                <div className="flex flex-wrap gap-2">
                  {ticket
                    ? ticket.category.map((cat, i) => (
                        <Badge key={i} className="bg-slate-800 text-slate-50">
                          {cat}
                        </Badge>
                      ))
                    : "Ticket Category"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Description:</p>
                <p className="text-slate-300">
                  {ticket ? ticket.description : "Ticket Description"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-100">
                  Remarks Given By Mechanic:
                </p>
                <p className="text-slate-300">
                  {ticket && ticket.remarks
                    ? ticket.remarks
                    : "Remarks Not Given Any!"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <p className="font-semibold text-slate-100">Status:</p>
                <Badge
                  variant={
                    ticket && ticket.status === "open"
                      ? "warning"
                      : ticket && ticket.status === "completed"
                      ? "success"
                      : ticket && ticket.status === "closed"
                      ? "danger"
                      : "default"
                  }
                >
                  {ticket
                    ? ticket.status === "open"
                      ? "Open"
                      : ticket.status === "in_progress"
                      ? "In Progress"
                      : ticket.status === "completed"
                      ? "Completed"
                      : ticket.status
                    : "Ticket Status"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        </>
    );
}
export default Ticket;