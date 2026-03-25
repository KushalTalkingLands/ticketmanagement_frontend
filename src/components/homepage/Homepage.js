import React, { useEffect, useState } from "react";
import Title from "../header/Header";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { api } from "../../lib/api";

const HomePage = () => {
  //All the variable declarations
    const [ticket, setticket] = useState();
    const [showPopup, setshowPopup] = useState(false);
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [tags, setTags] = useState([]);
    const [vehicle, setVehicle] = useState("");
    const [completedate, setcompletedate] = useState(Date.now());
    const navigate = useNavigate();
    var currdate = new Date();
    var currentDate = currdate.toISOString().slice(0, 10);

  //Use-Effect to get tickets on first time load
    useEffect(() => {
      getSomeDataWithAsync();
    }, []);
    
    //Function to get data 
    async function getSomeDataWithAsync() {
      try {
        const response = await api.get("/tickets/my");
        const { data } = response;
        setticket(data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Unable to load tickets",
          text: "Please make sure you are logged in.",
        });
      }
    }
    //Function to open Pop-up
    const togglePopup = () => {
      setshowPopup(true);
    };
    //Fucntion to close Pop-Up
    const ClosePopup = () => {
      setshowPopup(false);
    };
    //Function to handle title of ticket
    const handleTitle = (e) => {
      const newTitle = e.target.value;
      settitle(newTitle);
    };
    //Function to handle description of ticket
    const handleDescription = (e) => {
      const newDesc = e.target.value;
      setdescription(newDesc);
    };
    //Function to handle vehicle
    const handleVehicle = (e) => {
      setVehicle(e.target.value);
    };
    //Function to handle date of ticket
    const handleCompleteDate = (e) => {
      const newDate = e.target.value;
      setcompletedate(newDate);
    };
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
      //Function to navigate to single-ticket page
      const handleOpenTicket = (e, id) => {
        navigate(`tickets/${id}`);
      };

      //data format to sumbmit
      const data = {
        title: title,
        description: description,
        vehicle: vehicle,
        date: completedate,
        category: tags,
        status: "open",
      };

      //Fucntion to handle Submit of Ticket
      const handleTicketSubmit = async (e) => {
      e.preventDefault();
        try {
          const res = await api.post("/tickets", data);
          if (res.status === 201) {
            setTags([]);
            settitle("");
            setcompletedate("");
            setVehicle("");
            setdescription("");
            setshowPopup(false);
            const refreshed = await api.get("/tickets/my");
            setticket(refreshed.data);
            Swal.fire({
              icon: "success",
              title: "Ticket Added Successfully",
            });
          }
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Could not create ticket",
          });
        }
    };

    const allTickets = (ticket || []).map((t) => ({
      ...t,
      status:
        t.status === "Open"
          ? "open"
          : t.status === "InProgress"
          ? "in_progress"
          : t.status === "Completed"
          ? "completed"
          : t.status,
    }));
    const openCount = allTickets.filter((t) => t.status === "open").length;
    const inProgressCount = allTickets.filter((t) => t.status === "in_progress").length;
    const completedCount = allTickets.filter((t) => t.status === "completed").length;
    const closedCount = allTickets.filter((t) => t.status === "closed").length;
      
    return(
        <>
          <div className="space-y-6">
            <Title />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)] items-start">
              {/* Left overview / stats column */}
              <section className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 px-5 py-6 shadow-xl">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                  <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />
                  <div className="relative space-y-3">
                    <h2 className="text-xl font-semibold text-slate-50 flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm">
                        ✓
                      </span>
                      Service overview
                    </h2>
                    <p className="text-sm text-slate-400 max-w-md">
                      Create, track and resolve service tickets for your customers in one place.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-xs sm:text-sm">
                    <p className="text-slate-400">Open</p>
                    <p className="mt-1 text-lg font-semibold text-amber-300">
                      {openCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-3 text-xs sm:text-sm">
                    <p className="text-slate-400">In Progress</p>
                    <p className="mt-1 text-lg font-semibold text-sky-300">
                      {inProgressCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-xs sm:text-sm">
                    <p className="text-slate-400">Completed</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      {completedCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-xs sm:text-sm">
                    <p className="text-slate-400">Closed</p>
                    <p className="mt-1 text-lg font-semibold text-rose-300">
                      {closedCount}
                    </p>
                  </div>
                </div>
              </section>

              {/* Right tickets column */}
              <section className="space-y-4">
                <div className="flex flex-col gap-3 items-start justify-between rounded-xl border border-border bg-slate-900/60 px-4 py-4 md:flex-row md:items-center">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-slate-50">
                      Ticket Raised
                    </h1>
                    <p className="text-sm text-slate-400">
                      View and manage all your service tickets.
                    </p>
                  </div>
                  <Button
                    className="bg-primary text-white shadow-md hover:bg-primary/90 px-5 py-2 rounded-lg text-sm font-semibold w-full md:w-auto"
                    onClick={togglePopup}
                  >
                    Raise a Ticket
                  </Button>
                </div>

            <Dialog open={showPopup} onOpenChange={setshowPopup}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl text-slate-50">
                    Raise a New Ticket
                  </DialogTitle>
                  <p className="text-xs text-slate-400 mt-1">
                    Tell us what&apos;s happening with your vehicle so a technician can help.
                  </p>
                </DialogHeader>
                <form
                  className="mt-4 space-y-5"
                  onSubmit={handleTicketSubmit}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-100">
                      Ticket title
                    </p>
                    <Input
                      type="text"
                      required
                      placeholder="Short summary of the issue"
                      value={title}
                      onChange={handleTitle}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-100">
                      Vehicle
                    </p>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Hyundai i20, KA01 AB 1234"
                      value={vehicle}
                      onChange={handleVehicle}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <div className="flex flex-col items-start gap-2 w-full">
                      <p className="text-sm font-semibold text-slate-100">Category</p>
                      <div className="flex min-h-[3rem] w-full flex-wrap items-center gap-2 rounded-md border border-border bg-slate-900/60 px-2 py-1">
                        <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
                          {tags &&
                            tags.map((tag, index) => (
                              <li key={index} className="inline-flex h-7 items-center rounded-md bg-slate-800 px-2 text-xs font-medium text-white gap-1">
                                <span>
                                  {tag}
                                </span>
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
                          placeholder="Type and press enter to add tags"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full">
                      <p className="text-sm font-semibold text-slate-100">
                        Issue Date
                      </p>
                      <Input
                        type="date"
                        name="ticket-issue-date"
                        className="h-10 w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 text-sm text-slate-50"
                        value={completedate}
                        onChange={handleCompleteDate}
                        max={currentDate}
                        min={currentDate}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <Textarea
                      className="w-full min-h-[120px] bg-slate-950/70 border border-slate-700 text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                      placeholder="Describe the issue in detail (symptoms, when it started, etc.)"
                      value={description}
                      onChange={handleDescription}
                      required
                      rows={6}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border border-slate-600 text-slate-100 hover:bg-slate-800"
                        onClick={ClosePopup}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-primary text-white hover:bg-primary/90"
                      disabled={
                        !title || !description || !completedate || !tags.length
                      }
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {ticket &&
                ticket.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer bg-slate-900/70"
                    onClick={(e) => handleOpenTicket(e, item.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2">
                        {item.title}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <p>Issue Date:</p>
                          <p className="text-slate-100">
                            {item.date}
                          </p>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <p className="text-slate-400">
                          Current Status:
                        </p>
                        <Badge
                          variant={
                            item.status === "open"
                              ? "warning"
                              : item.status === "completed"
                              ? "success"
                              : item.status === "closed"
                              ? "danger"
                              : "default"
                          }
                        >
                          {item.status === "open"
                            ? "Open"
                            : item.status === "in_progress"
                            ? "In Progress"
                            : item.status === "completed"
                            ? "Completed"
                            : item.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
              </section>
            </div>
          </div>
        </>
      );
}

export default HomePage;