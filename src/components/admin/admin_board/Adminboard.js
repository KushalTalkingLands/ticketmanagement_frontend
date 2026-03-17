import React, { useState, useEffect, useMemo } from 'react';
import Title from '../../header/Header';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { api } from '../../../lib/api';

const COLUMNS = [
  {
    key: 'open',
    label: 'Open',
    columnClass: 'bg-yellow-50/80 border-yellow-400',
    badgeVariant: 'warning',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    columnClass: 'bg-blue-50/80 border-blue-400',
    badgeVariant: 'default',
  },
  {
    key: 'completed',
    label: 'Completed',
    columnClass: 'bg-green-50/80 border-green-400',
    badgeVariant: 'success',
  },
];

const formatElapsedTime = (createdAt) => {
  if (!createdAt) return null;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return null;

  const diffMs = Date.now() - created.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0 && minutes <= 0) return '⏱ just now';
  if (hours <= 0) return `⏱ ${minutes}m`;
  return `⏱ ${hours}h ${minutes}m`;
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

const Admin_dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [draggedId, setDraggedId] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getSomeDataWithAsync();
  }, []);

  async function getSomeDataWithAsync() {
    try {
      const response = await api.get('/tickets');
      const { data } = response;
      setTickets(
        (data || []).map((t) => ({
          ...t,
          // Normalize status from legacy values if needed
          status:
            t.status === 'Open'
              ? 'open'
              : t.status === 'InProgress'
              ? 'in_progress'
              : t.status === 'Completed'
              ? 'completed'
              : t.status,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  const technicians = useMemo(() => {
    const names = new Set();
    (tickets || []).forEach((t) => {
      if (t.technician?.name) {
        names.add(t.technician.name);
      }
    });
    return Array.from(names);
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return (tickets || []).filter((t) => {
      const matchesSearch =
        !searchTerm ||
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vehicle?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTechnician =
        technicianFilter === 'all' ||
        t.technician?.name === technicianFilter;

      const matchesStatusFilter =
        statusFilter === 'all' || t.status === statusFilter;

      return matchesSearch && matchesTechnician && matchesStatusFilter;
    });
  }, [tickets, searchTerm, technicianFilter, statusFilter]);

  const handleOpenTicket = (e, id) => {
    e.preventDefault();
    navigate(`tickets/${id}`);
  };

  const handleDragStart = (e, ticketId) => {
    setDraggedId(ticketId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    setActiveColumn(columnKey);
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = async (e, columnKey) => {
    e.preventDefault();
    const id = draggedId || e.dataTransfer.getData('text/plain');
    setActiveColumn(null);
    setDraggedId(null);
    if (!id || isUpdating) return;

    const prevTickets = tickets;
    const optimisticallyUpdated = tickets.map((t) =>
      t.id === id ? { ...t, status: columnKey } : t,
    );

    setTickets(optimisticallyUpdated);
    setIsUpdating(true);

    try {
      await api.patch(`/tickets/${id}`, {
        status: columnKey,
      });
    } catch (error) {
      console.error(error);
      // Rollback on failure
      setTickets(prevTickets);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Title state={true} />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-200">
            Admin overview of all tickets in a Kanban-style board.
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Input
              placeholder="Search by title or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full max-w-xs bg-slate-900/60 text-slate-50 placeholder:text-slate-400"
            />
            <select
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              className="h-9 rounded-md border border-slate-600 bg-slate-900/80 px-2 text-sm text-slate-100"
            >
              <option value="all">All technicians</option>
              {technicians.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-slate-600 bg-slate-900/80 px-2 text-sm text-slate-100"
            >
              <option value="all">All statuses</option>
              {COLUMNS.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <div
              key={column.key}
              className={`flex min-h-[260px] flex-col gap-3 rounded-xl border p-3 transition-colors ${
                column.columnClass
              } ${
                activeColumn === column.key
                  ? 'ring-2 ring-sky-400/70 ring-offset-2 ring-offset-slate-900/40'
                  : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.key)}
              onDrop={(e) => handleDrop(e, column.key)}
              onDragLeave={handleDragLeave}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {column.label}
                </h2>
                <span className="text-xs font-medium text-slate-700">
                  {
                    filteredTickets.filter((t) => t.status === column.key)
                      .length
                  }{' '}
                  tickets
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {filteredTickets
                  .filter((t) => t.status === column.key)
                  .map((tkt) => {
                    const elapsed = formatElapsedTime(
                      tkt.createdAt || tkt.date,
                    );

                    return (
                      <Card
                        key={tkt.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tkt.id)}
                        onClick={(e) => handleOpenTicket(e, tkt.id)}
                        className={`cursor-pointer bg-slate-900/80 text-slate-50 transition-all ${
                          draggedId === tkt.id
                            ? 'scale-[0.97] opacity-60 shadow-lg ring-2 ring-sky-400/70'
                            : 'hover:scale-[1.01] hover:shadow-md'
                        }`}
                      >
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                          <CardTitle className="line-clamp-2 text-sm font-semibold">
                            {tkt.title}
                          </CardTitle>
                          <Badge variant={column.badgeVariant} className="ml-2">
                            {column.label}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-1 text-xs text-slate-300">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-slate-400">Vehicle</span>
                              <span className="font-medium text-slate-100">
                                {tkt.vehicle || '—'}
                              </span>
                            </div>
                            {elapsed && (
                              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-100">
                                {elapsed}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[11px] font-semibold uppercase text-slate-100">
                                {tkt.technician?.avatar ? (
                                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                  <img
                                    src={tkt.technician.avatar}
                                    alt={tkt.technician.name || 'Technician'}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  getInitials(tkt.technician?.name)
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] text-slate-400">
                                  Technician
                                </span>
                                <span className="text-xs font-medium text-slate-100">
                                  {tkt.technician?.name || 'Unassigned'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                {filteredTickets.filter((t) => t.status === column.key).length ===
                  0 && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-400/40 bg-white/40 text-xs text-slate-500">
                    Drop tickets here to move them to {column.label}.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin_dashboard;