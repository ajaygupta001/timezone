import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Import your preferred date picker library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Datepicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("UTC"); // Default timezone
  const [jsondata, setjsondata] = useState([]);
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const handleDateChange = (date) => {
    if (!date) {
      console.error("Invalid date:", date);
      return; // Prevent further execution if date is invalid
    }

    let formattedDate = moment(date, "YourDateFormatHere").format("DD/MM/YYYY");
    console.log(formattedDate); // Check the formatted date

    setSelectedDate(date); // Update the selected date state
    setjsondata((prevData) => [
      ...prevData,
      { date: formattedDate }, // Add formatted date to jsondata
    ]);
  };

  const navigateWeek = (direction) => {
    const increment = direction === "next" ? 7 : -7; // Increment or decrement by 7 days (1 week)
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + increment);
    setSelectedDate(newDate);
    // Fetch and load weekly data based on the newDate value here
  };

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
    // Update displayed times based on the selected timezone
    // Perform timezone conversion for fetched weekly data if applicable
  };

  // Function to convert time to selected timezone
  const convertToSelectedTimezone = (timeInUTC) => {
    const options = {
      timeZone: selectedTimezone,
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timeInUTC).toLocaleTimeString("en-US", options);
  };

  // Example data - replace this with your fetched weekly data
  const weeklyData = [
    { day: "Monday", time: "08:00:00" },
    { day: "Tuesday", time: "10:30:00" },
    // Add more days and times as needed...
  ];
  const times = [
    { label: "Event 1", time: "2024-01-03T10:00:00Z" },
    { label: "Event 2", time: "2024-01-04T15:30:00Z" },
    // Add more times with respective labels...
  ];

  // Function to generate time slots from 8 AM to 11 PM
  const generateTimeSlots = () => {
    const timeSlots = [];
    let time = new Date().setUTCHours(8, 0, 0, 0); // Start from 8 AM UTC
    const endTime = new Date().setUTCHours(23, 0, 0, 0); // End at 11 PM UTC

    while (time <= endTime) {
      timeSlots.push(new Date(time));
      time = new Date(time).setMinutes(new Date(time).getMinutes() + 30); // Increment by 30 minutes
    }

    return timeSlots;
  };

  const [schedule, setSchedule] = useState({
    Monday: generateTimeSlots(),
    Tuesday: generateTimeSlots(),
    Wednesday: generateTimeSlots(),
    Thursday: generateTimeSlots(),
    Friday: generateTimeSlots(),
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (day, index) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule[day][index].checked = !updatedSchedule[day][index].checked;
    setSchedule(updatedSchedule);
  };

  return (
    <div className="container mt-4">
      {/* First Part: Previous and Next buttons */}
      <div className="container d-flex justify-content-between">
        <div className="d-flex justify-content-start">
          <button
            className="btn btn-primary"
            onClick={() => navigateWeek("previous")}
          >
            Previous Week
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <h4>Select Date</h4>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            className="form-control"
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => navigateWeek("next")}
          >
            Next Week
          </button>
        </div>
      </div>
      {/* Second Part: Calendar and UTC Timezone */}
      <div className="col-md-12">
        <div className="mb-3">
          <h3 className="mt-3">Timezone</h3>
          <select
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            className="form-select"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
          <h4 className="mt-3">Times in {selectedTimezone}</h4>
          <ul className="list-group">
            {times.map((item, index) => (
              <li key={index} className="list-group-item">
                {item.label}: {convertToSelectedTimezone(item.time)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Third Part: Weekly Schedule */}
      <div className="container">
        <div className="row">
          <div className="col-md-12 border border-primary">
            <h2>Weekly Schedule</h2>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    {weekdays.map((day, index) => (
                      <th key={index}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(schedule).map((day, index) => (
                    <tr key={index}>
                      {weekdays.map((weekday, idx) => (
                        <td key={idx}>
                          {weekday === day && (
                            <ul className="list-group">
                              {schedule[day].map((timeSlot, idx) => (
                                <li key={idx} className="list-group-item">
                                  <input
                                    type="checkbox"
                                    checked={timeSlot.checked || false}
                                    onChange={() =>
                                      handleCheckboxChange(day, idx)
                                    }
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    {timeSlot.toUTCString().slice(17, 22)}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datepicker;
