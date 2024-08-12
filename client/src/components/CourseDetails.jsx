import {
  Button,
  Card,
  Grid,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { firestore } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import Footer from "./Footer";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(firestore, "courses", courseId));
        if (courseDoc.exists()) {
          setCourse(courseDoc.data());
        } else {
          console.log("No such course!");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="course-details">
      <section className="hero">
        <Grid container>
          <Grid item md={6}>
            <h1 className="course-title">{course.title}</h1>
            <p className="course-description">{course.description}</p>
            <Link to={`/dashboard/courses/${courseId}/1`} state={{ course }}>
              <Button variant="outlined" className="start-course">
                Start course
              </Button>
            </Link>
          </Grid>
          <Grid item md={6}>
            <div className="course-banner">
              <img src={course.banner_img} alt="physics wallpaper" />
            </div>
          </Grid>
        </Grid>
      </section>
      <section className="prerequisites-container">
        <Grid container>
          <Grid item md={6}>
            <PrerequisitesCard
              title="Course goals"
              icon="/images/goal-icon.png"
              items={course.goals}
            />
          </Grid>
          <Grid item md={6}>
            <PrerequisitesCard
              title="Prerequisites"
              icon="/images/check-icon.png"
              items={course.prerequisites}
            />
          </Grid>
        </Grid>
      </section>
      <section className="topics">
        {course.topics.map((topic, index) => (
          <TopicItem
            key={index}
            title={`Topic ${index + 1} : ${topic.title}`}
            shortDesc={topic.description}
            subtopicsCount={topic.subTopics.length}
            duration={topic.duration}
            tasks={topic.details}
            course={course}
            index={index}
            courseId={courseId}
          />
        ))}
      </section>
      <Footer />
    </div>
  );
};

export default CourseDetails;

const PrerequisitesCard = ({ title, items, icon }) => {
  return (
    <Card className="prerequisite-card">
      <div className="prerequsites">
        <h3 className="prerequisites-title">{title}</h3>
        <Grid container>
          <Grid item md={8}>
            <ul className="prerequisites-list">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Grid>
          <Grid item md={4}>
            <img src={icon} alt={title} />
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

// Topic 1: Measurement & Physical quantieties

const TopicItem = ({
  title,
  subtopicsCount,
  duration,
  shortDesc,
  tasks,
  courseId,
  index,
  course,
  progress,
}) => {
  return (
    <div className="topic-container">
      <Link
        to={`/dashboard/courses/${courseId}/${index + 1}`}
        state={{ course }}
        className="topic-heading"
      >
        {title}
      </Link>
      <p className="topic-duration">
        {subtopicsCount} Sub-topics | Duration: {duration}
      </p>
      <p className="topic-desc">{shortDesc}</p>
      <ul className="task-list">
        {tasks.map((task, id) => (
          <li key={id}>{task}</li>
        ))}
      </ul>
      {/* <div className="topic-progress">
        <p>{progress}% complete.</p>
        <LinearProgress variant="determinate" value={progress} />
      </div> */}
    </div>
  );
};
