import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { getAllCourses } from "../utils";

const Courses = () => {
  const [isFocused, setFocus] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        setData(response);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="courses">
      <h1 className="heading-h1">Get started by selecting a course.</h1>
      <p className="tagline">
        Learning paths are guided journeys through several learning activities
        that will help you gain the skills you need to help you grow your
        career. Click on the cards to learn more about each path.
      </p>
      <div
        className={`courses-search ${isFocused ? "focus" : ""}`}
        onClick={() => setFocus(true)}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="search"
          onBlur={() => setFocus(false)}
          name="search"
          placeholder="Search by course name."
        />
      </div>
      <div className="courses-container">
        {data &&
          data.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              courseId={course.id}
            />
          ))}
      </div>
    </div>
  );
};

export default Courses;
