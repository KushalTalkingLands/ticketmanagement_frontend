import react, { useEffect,useState } from 'react';
import Title from '../header/Header';
import "./homepage.css";
import axios from 'axios';
import {Link,useNavigate} from 'react-router-dom';
const HomePage =()=>{

    const [ticket,setticket]=useState();
    const [showPopup,setshowPopup]=useState(false);
    const [title,settitle]=useState();
    const [description,setdescription]=useState();
    const [tags, setTags] = useState([]);
    const [completedate,setcompletedate]=useState(Date.now());
    const navigate = useNavigate();


    useEffect(()=>{
        getSomeDataWithAsync();
    },[])
    
    async function getSomeDataWithAsync() {
        
        const response = await axios.get("http://localhost:3000/tickets");
    
        console.log(response)
        const { data } = response;
        console.log(data);
        setticket(data);
    }
    const togglePopup=()=>{
        setshowPopup(true);
    }
    const ClosePopup=()=>{
        setshowPopup(false);
    }
    const handleTitle=(e)=>{
        const newTitle = e.target.value;
        settitle(newTitle)
    }
    const handleDescription=(e)=>{
        const newDesc = e.target.value;
        setdescription(newDesc)
    }
    const handleCompleteDate=(e)=>{
        const newDate = e.target.value;
        setcompletedate(newDate)
    }
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

      const handleOpenTicket=(e,id)=>{
        navigate(`tickets/${id}`);
      }

      const data={
        title:title,
        description:description,
        date:completedate,
        category:tags,
        status:"open"
      }

      const handleTicketSubmit=(e)=>{
        e.preventDefault();
        axios.post("http://localhost:3000/tickets",data)
        .then((res)=>{
            if(res.status===201){
            setTags([]);settitle("");setcompletedate("");setdescription("");setshowPopup(false);
            axios.get("http://localhost:3000/tickets")
            .then((res)=>{setticket(res.data)})
            }
        })
        .catch((err)=>{console.log(err)})
      }
      
    return(
        <>
        <div className='ticket-main-div'>
            <Title/>
            <div className='ticket-header'>
                <h1 className='ticket-header-text'>Ticket Raised:</h1>
                <button className='ticketadd-button' onClick={togglePopup}>Raise a Ticket</button>
            </div>
            {showPopup === true ? 
            (<>
            <div className='popup'>
                    <div className='popup_inner'>
                      <div className="projectmedia-document-form-main">
                        <p className="projectmedia-documenttitleform-text">
                          Raise A New Ticket
                        </p>
                        <input
                            type="text"
                            required
                            className="projectmedia-information-input"
                            placeholder="Title of the Ticket"
                            value={title}
                            onChange={handleTitle}
                        />
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
                        placeholder="Type and press enter to add tags"
                      />
                      
                    </div>
                  </div>
                  <div className='ticket-date-parent'>
                  <p className="projectmedia-information-text">
                      Issue Date
                    </p>
                    <input
                        type="date"
                        name="ticket-issue-date"
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
                  <div className="projectmedia-document-buttons">
                          <button onClick={ClosePopup} className="projectmedia-document-cancel-btn">Cancel</button>
                          <button className="projectmedia-document-Update-btn" onClick={handleTicketSubmit}>Submit</button>
                        </div>
                        </div>
                      </div>

                    </div>
            </>
            ):(<></>)
        }
        <div className='TicketDisplay'>
                {ticket && ticket.map((d,i)=>{
                    return (
                        <>
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
                          </div>
                        </>
                      )
                })}
            </div>
        </div>
        </>
    );
}

export default HomePage;