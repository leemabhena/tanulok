import React from "react";
import Navigation from "./Navigation";
import { Routes, Route } from "react-router-dom";
import StudyAI from "./StudyAI";
import Courses from "./Courses";
import CourseDetails from "./CourseDetails";
import CourseStudy from "./CourseStudy";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Navigation />
      <Routes>
        <Route path="ai" element={<StudyAI />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="courses/:courseId/:subtopicId" element={<CourseStudy />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
