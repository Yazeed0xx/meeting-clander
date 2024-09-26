"use client";
import React, { useEffect, useState } from "react";
import { Calendar, globalizeLocalizer } from "react-big-calendar";
import globalize from "globalize";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = globalizeLocalizer(globalize);

export default function Datepicker() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    person: "",
    second: "",
    title: "",
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        console.log("Fetched events:", data); // Log fetched events
        setEvents(
          data.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const eventToAdd = {
      person: newEvent.person,
      second: newEvent.second, // Ensure this is being passed
      title: newEvent.title,
      start: new Date(newEvent.start), // Ensure valid date format
      end: new Date(newEvent.end), // Ensure valid date format
    };

    console.log("Adding event:", eventToAdd); // Log new event to be added

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToAdd),
      });

      if (res.ok) {
        const addedEvent = await res.json();
        console.log("Added event:", addedEvent); // Log added event
        setEvents([
          ...events,
          {
            ...addedEvent,
            start: new Date(addedEvent.start),
            end: new Date(addedEvent.end),
          },
        ]);
        setNewEvent({
          person: "",
          second: "",
          title: "",
          start: new Date(),
          end: new Date(),
        });
      } else {
        console.error("Failed to add event:", res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Styling events in the calendar
  // const eventStyleGetter = (event) => {
  //   return {
  //     style: {
  //       backgroundColor: "#3174ad",
  //       color: "white",
  //     },
  //   };
  // };

  // Custom component to render events in the calendar
  const EventComponent = ({ event }) => {
    console.log("Event data:", event); // Log the event to check all fields

    return (
      <span>
        <strong>{event.title}</strong> <br />
        <em>{event.person || "No person"}</em> <br />
        <em>{event.second || "No second person"}</em> <br />
        {event.start && event.end && (
          <>
            {event.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {event.end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </>
        )}
      </span>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Calendar</h1>

      <div className="mb-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          popup={true}
          // components={{
          //   event: EventComponent,
          // }}
          // eventPropGetter={eventStyleGetter}
        />
      </div>

      <form onSubmit={handleAddEvent}>
        <label>Person:</label>
        <input
          type="text"
          value={newEvent.person}
          onChange={(e) => setNewEvent({ ...newEvent, person: e.target.value })}
          required
        />

        <label>Second:</label>
        <input
          type="text"
          value={newEvent.second}
          onChange={(e) => setNewEvent({ ...newEvent, second: e.target.value })}
          required
        />
        <label>title:</label>
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          required
        />

        <label>Start Date:</label>
        <input
          type="datetime-local"
          value={new Date(newEvent.start).toISOString().slice(0, 16)}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          required
        />

        <label>End Date:</label>
        <input
          type="datetime-local"
          value={new Date(newEvent.end).toISOString().slice(0, 16)}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          required
        />

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}
