import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import Title from '../../header/Header';
import "./admin-single-ticket.css";

const AdminSingleTicket =()=>{
    //Variable Declarartions
    const params =useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [ticket,setticket]=useState();
    const [title,settitle]=useState();
    const [description,setdescription]=useState();
    const [tags, setTags] = useState([]);
    const [remarks, setRemarks] = useState();
    const[status, setStatus] = useState();
    const [key, setKey] = useState();
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
    },[])

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
        
        <div className="single-ticket-main-div">
            <div className="single-ticket-head">
            <h1 className="single-ticket-title">{ticket ? ticket.title:"Ticket Title"}</h1>
            </div>
            <div className="projectmedia-document-form-main">
                        <div className='ticket-date-category'>
                        <div className="projectmedia-information-propType">
                    <p className="projectmedia-information-text">
                      Category
                    </p>
                    <div className="projectmedia-tags-input">
                      <ul className="projectmedia-tags">
                        {tags &&
                          tags.map((tag, index) => (
                            <li key={index} className="projectmedia-tag">
                              <span className="projectmedia-tag-title">
                                {tag}
                              </span>
                              <span
                                className="projectmedia-tag-close-icon"
                                onClick={() => removeTags(index)}
                              >
                                x
                              </span>
                            </li>
                          ))}
                      </ul>
                      <input
                        type="text"
                        onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
                        placeholder="Type and press enter to add new tags"
                      />
                      
                    </div>
                  </div>
                  <div className='ticket-date-parent'>
                  <p className="projectmedia-information-text">
                      Issue Date
                    </p>
                    <input
                        type="date"
                        className="ticket-date-input"
                        value={completedate}
                        onChange={handleCompleteDate}
                      />
                  </div>
                  </div>
                  <div className="projectmedia-document-form-about">
                          <textarea
                            className="projectmedia-document-about"
                            placeholder="Description "
                            value={description}
                            onChange={handleDescription}
                            required
                            rows="6"
                            cols="41"
                          />
                        </div>
                        <div className="projectmedia-document-form-about">
                        <p className="single-ticket-text">Remarks Given:</p>
                          <textarea
                            className="projectmedia-document-about"
                            placeholder="Remarks(if any..)"
                            value={remarks}
                            onChange={handleRemarks}
                            required
                            rows="6"
                            cols="41"
                          />
                        </div>
                        <div className='admin-singleticket-status'>
                        <p className="single-ticket-text">Status :</p>
                        <div onChange={handleStatus}>
                            <input type="radio" checked={status=== "Open"} value="Open" name="status" /> Open
                            <input type="radio" checked={status=== "InProgress"} value="InProgress" name="status" /> In Progress
                            <input type="radio" checked={status=== "Completed"} value="Completed" name="status" /> Completed
                            <input type="radio" checked={status=== "Closed"} value="Closed" name="status" /> Closed
                        </div>
                    </div>
                  <div className="admin-single-ticket-buttons">
                        <button className="admin-single-ticket-back-button" onClick={handlePrev}>Go Back</button>
                         <button className="admin-single-ticket-delete-button" onClick={handleDelete}>Delete Ticket</button>
                          <button className="admin-single-ticket-Update-btn" onClick={handleUpdateTicket}>Update Ticket</button>
                        </div>
                        </div>
        </div>
        </>
    );
}
export default AdminSingleTicket;