import React from "react";
import Card from "@mui/material/Card";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ title, courseId }) => {
  const navigate = useNavigate();
  return (
    <div
      className="course-card"
      onClick={() => navigate(`/dashboard/courses/${courseId}`)}
    >
      <Card>
        <div className="card-content">
          <img
            src={
              courseId.toLowerCase().includes("biology")
                ? "/images/biology-icon.png"
                : `https://img.icons8.com/?size=50&id=8xtrxmH4E7sp&format=png&color=000000`
            }
            alt="physics icon"
          />
          <p className="card-course-name">{title}</p>

          <div className="course-progress">
            <p className="course-progress-p">33% complete</p>
            <LinearProgress value={33} variant="determinate" />
          </div>

          <p className="course-producer">Managed by Tanulok</p>
        </div>
      </Card>
    </div>
  );
};

export default CourseCard;
