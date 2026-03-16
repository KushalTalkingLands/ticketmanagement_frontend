import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import Title from '../../header/Header';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

const AdminSingleTicket =()=>{
    //Variable Declarartions
    const params =useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [ticket,setticket]=useState();
    const [title]=useState();
    const [description,setdescription]=useState();
    const [tags, setTags] = useState([]);
    const [remarks, setRemarks] = useState();
    const[status, setStatus] = useState();
    const [completedate,setcompletedate]=useState(Date.now());

    //UseEffect to Get Single Ticket
    useEffect(()=>{
        axios.get(`http://localhost:3000/tickets/${id}`)
        .then((res)=>{
            console.log(res.data);
            setticket(res.data);
            setTags(res.data.category);
            setcompletedate(res.data.date);
            setdescription(res.data.description);
            setStatus(res.data.status);
            setRemarks(res.data.remarks);
        })
    },[id])

    //function to handle back button
    const handlePrev=()=>{
        navigate(`/admin`)
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
    
    //Function to handle description of ticket
    const handleDescription=(e)=>{
        const newDesc = e.target.value;
        setdescription(newDesc)
    }
    const handleStatus=(e)=>{
        const newstatus=e.target.value;
        setStatus(newstatus);
    }
    const handleRemarks=(e)=>{
        const newDesc = e.target.value;
        setRemarks(newDesc)
    }
    //Function to handle date of ticket
    const handleCompleteDate=(e)=>{
        const newDate = e.target.value;
        setcompletedate(newDate)
    }
    //Function to handle category
    const removeTags = (indexToRemove) => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
      };
      const addTags = (e) => {
        if (e.key === "Enter") {
          if (e.target.value !== "") {
            setTags([...tags, e.target.value]);
            e.target.value = "";
          }
        }
      };
      //data format to sumbmit
      const data={
        title:title,
        description:description,
        date:completedate,
        category:tags,
        status:status,
        remarks:remarks,
      }

      //Fucntion to handle Submit of Ticket
      const handleUpdateTicket=(e)=>{
        e.preventDefault();
        axios.patch(`http://localhost:3000/tickets/${id}`,data)
        .then((res)=>{
            if(res.status===200){
            // setTags([]);settitle("");setcompletedate("");setdescription("");
            Swal.fire({icon: 'success', title: 'Ticket Updated Successfully'});
            }
        })
        .catch((err)=>{console.log(err)})
      }
      console.log(status);

    return(
        <>
        <Title state={true}/>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-3 items-stretch justify-between md:flex-row md:items-center">
            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePrev}>
                Go Back
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700"
                onClick={handleDelete}
              >
                Delete Ticket
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-slate-900/70 p-4 sm:p-6 shadow-lg space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
                {ticket ? ticket.title : "Ticket Title"}
              </h1>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <div className="flex flex-col items-start gap-2 w-full">
                  <p className="text-sm font-semibold text-slate-100">
                    Category
                  </p>
                  <div className="flex min-h-[3rem] w-full flex-wrap items-center gap-2 rounded-md border border-border bg-slate-900/60 px-2 py-1">
                    <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
                      {tags &&
                        tags.map((tag, index) => (
                          <li
                            key={index}
                            className="inline-flex h-7 items-center rounded-md bg-slate-800 px-2 text-xs font-medium text-white gap-1"
                          >
                            <span>{tag}</span>
                            <span
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] cursor-pointer"
                              onClick={() => removeTags(index)}
                            >
                              ×
                            </span>
                          </li>
                        ))}
                    </ul>
                    <Input
                      type="text"
                      className="border-none bg-transparent px-0 h-8 text-xs"
                      onKeyUp={(event) =>
                        event.key === "Enter" ? addTags(event) : null
                      }
                      placeholder="Type and press enter to add new tags"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <p className="text-sm font-semibold text-slate-100">
                    Issue Date
                  </p>
                  <Input
                    type="date"
                    className="h-10 w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 text-sm text-slate-50"
                    value={completedate}
                    onChange={handleCompleteDate}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-100">
                  Description
                </p>
                <Textarea
                  className="w-full min-h-[120px]"
                  placeholder="Description "
                  value={description}
                  onChange={handleDescription}
                  required
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-100">
                  Remarks Given
                </p>
                <Textarea
                  className="w-full min-h-[120px]"
                  placeholder="Remarks(if any..)"
                  value={remarks}
                  onChange={handleRemarks}
                  required
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-100">Status</p>
                <div
                  className="flex flex-wrap gap-4 text-sm text-slate-200"
                  onChange={handleStatus}
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={status === "Open"}
                      value="Open"
                      name="status"
                    />
                    Open
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={status === "InProgress"}
                      value="InProgress"
                      name="status"
                    />
                    In Progress
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={status === "Completed"}
                      value="Completed"
                      name="status"
                    />
                    Completed
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={status === "Closed"}
                      value="Closed"
                      name="status"
                    />
                    Closed
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={handlePrev}>
                  Go Back
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={handleDelete}
                >
                  Delete Ticket
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleUpdateTicket}
                >
                  Update Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
        </>
    );
}
export default AdminSingleTicket;