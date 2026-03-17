import React,{useState,useEffect} from 'react';
import Title from '../../header/Header';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { api } from '../../../lib/api';

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
        try {
          const response = await api.get("/tickets");
          const { data } = response;
          setticket(data);
        } catch (error) {
          console.error(error);
        }
    }
    const handleOpenTicket=(e,id)=>{
        navigate(`tickets/${id}`);
    }
    
    return(
        <>
         <div className="space-y-4">
            <Title state={true}/>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {["Open", "InProgress", "Completed", "Closed"].map((status) => (
                <div key={status} className="space-y-3">
                  <h2 className="text-lg font-semibold text-slate-100">
                    {status === "InProgress" ? "In Progress" : status}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {ticket &&
                      ticket
                        .filter((t) => t.status === status)
                        .map((tkt) => (
                          <Card
                            key={tkt.id}
                            className="cursor-pointer bg-slate-900/70"
                            onClick={(e) => handleOpenTicket(e, tkt.id)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="line-clamp-2">
                                {tkt.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-1 space-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Issue Date:</span>
                                <span className="text-slate-100">
                                  {tkt.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-400">
                                  Current Status:
                                </span>
                                <Badge
                                  variant={
                                    status === "Open"
                                      ? "warning"
                                      : status === "Completed"
                                      ? "success"
                                      : status === "Closed"
                                      ? "danger"
                                      : "default"
                                  }
                                >
                                  {status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                  </div>
                </div>
              ))}
            </div>
         </div>
        </>
    );
}
export default Admin_dashboard;