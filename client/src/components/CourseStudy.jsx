import {
  Avatar,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useContext, useRef } from "react";
import Quizzes from "./Quizzes";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { courseData } from "../utils";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { UserContext } from "./UserContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CourseStudy = () => {
  const { courseId, subtopicId } = useParams();
  const [isNotes, setNotes] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(firestore, "courses", courseId));
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          setCourse(courseData);
        } else {
          console.log("No such course!");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    if (!course) {
      fetchCourse();
    }
  }, [courseId, subtopicId, course]);

  if (!course) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="course-study">
      <Sidebar progress={25} course={course} courseId={courseId} />
      <div className="main-content">
        <section className="course-app-bar">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <a href={`/dashboard/courses/${courseId}`}>{courseData.title}</a>
            <p>{course?.topics[subtopicId - 1].title}</p>
          </Breadcrumbs>
          <Button onClick={() => setNotes(!isNotes)}>
            {isNotes ? "Take a Quiz" : "Back to notes"}
          </Button>
        </section>
        {isNotes ? (
          <CourseContent
            topics={course?.topics[subtopicId - 1]}
            courseIds={{ courseId, sectionId: subtopicId }}
          />
        ) : (
          <Quizzes data={course?.topics[subtopicId - 1].subTopics} /> // pageContents
        )}
      </div>
    </div>
  );
};

export default CourseStudy;

const Sidebar = ({ progress, course, courseId }) => {
  return (
    <div className="course-sidebar">
      <div className="sidebar-progress">
        <p>{progress}% complete</p>
        <LinearProgress variant="determinate" value={progress} />
      </div>
      <h3 className="course-study-heading">
        <i className="bx bx-home"></i> Course Overview
      </h3>
      <Divider />

      <div className="subtopics-container">
        {course.topics.map((topic, index) => (
          <div className="sidebar-entry" key={index}>
            <div className="circle-check">
              <i className="bx bx-check"></i>
            </div>
            <a
              href={`/dashboard/courses/${courseId}/${index + 1}`}
              className="no-wrap-link"
            >
              {topic.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseContent = ({ topics, courseIds }) => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState(0);
  const [openCommentDialog, setCommentDialog] = useState(false);
  const [openChatDialog, setChatDialog] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedIndex = useRef(null);
  const [selectedText, setSelectedText] = useState("");
  const { user } = useContext(UserContext);

  const numPages = topics.subTopics.length;
  const [currentPage, setPage] = useState(0);
  const [pageContents, setPageContents] = useState(null);

  useEffect(() => {
    const fetchCommentsAndSetContents = async () => {
      if (!topics) return;

      try {
        const comments = await getComments(
          user.uid,
          courseIds.courseId,
          courseIds.sectionId,
          currentPage
        );
        const pageData = insertCommentsIntoContent(
          topics?.subTopics[currentPage].content,
          comments
        );
        setPageContents(pageData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentsAndSetContents();
  }, [currentPage]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPosition(rect.top - 40);
      setToolbarVisible(true);
      // Selected item index
      let parentElement = selection.focusNode.parentNode;
      while (
        parentElement &&
        !parentElement.classList.contains("course-page")
      ) {
        if (parentElement.parentNode.classList.contains("course-page")) {
          break;
        }
        parentElement = parentElement.parentNode;
      }

      // Get the index of the parent element within course-page children
      const index = Array.from(parentElement.parentNode.childNodes).indexOf(
        parentElement
      );

      selectedIndex.current = index;
      console.log("Selected Index:", index);
    } else {
      setToolbarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleNext = () => {
    setPage((prevSection) => Math.min(prevSection + 1, numPages - 1));
  };

  const handlePrevious = () => {
    setPage((prevSection) => Math.max(prevSection - 1, 0));
  };

  if (!pageContents) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="course-content">
      {toolbarVisible && (
        <Toolbar
          top={toolbarPosition}
          setCommentDialog={setCommentDialog}
          setChatDialog={setChatDialog}
        />
      )}
      {/* Dialogs */}
      <CommentDialog
        open={openCommentDialog}
        setOpen={setCommentDialog}
        index={selectedIndex.current}
        pageContents={pageContents}
        setPageContents={setPageContents}
        courseIds={{ ...courseIds, currentPage }}
      />

      <ChatDialog
        open={openChatDialog}
        setOpen={setChatDialog}
        setPageContents={setPageContents}
        index={selectedIndex.current}
        pageContents={pageContents}
        selectedText={selectedText}
        courseIds={{ ...courseIds, currentPage }}
      />

      <div className="project-markdown">
        <CoursePage pageContent={pageContents} />
      </div>

      <div className="course-controls">
        <Button
          variant="contained"
          size="small"
          disabled={currentPage <= 0}
          onClick={handlePrevious}
        >
          <i className="fa-solid fa-angles-left"></i> &nbsp;Previous
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={currentPage >= numPages - 1}
          onClick={handleNext}
        >
          Next &nbsp;<i className="fa-solid fa-angles-right"></i>
        </Button>
      </div>
    </div>
  );
};

const Toolbar = ({ top, setCommentDialog, setChatDialog }) => {
  return (
    <div className="icons-toolbar" style={{ top: `calc(0rem + ${top}px)` }}>
      {/* <IconButton
        children={
          <Avatar>
            <i className="fa-solid fa-highlighter"></i>
          </Avatar>
        }
      /> */}
      <IconButton
        children={
          <Avatar>
            <i className="fa-regular fa-comment"></i>
          </Avatar>
        }
        onClick={() => setCommentDialog(true)}
      />
      <IconButton
        children={
          <Avatar>
            <i className="fa-solid fa-robot"></i>
          </Avatar>
        }
        onClick={() => setChatDialog(true)}
      />
    </div>
  );
};

const CommentDialog = ({
  pageContents,
  open,
  setOpen,
  index,
  setPageContents,
  courseIds,
}) => {
  const [comment, setComment] = useState("");
  const { user } = useContext(UserContext);
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNote = async () => {
    if (!index) return;

    if (comment.trim()) {
      const newContent = [...pageContents];
      newContent.splice(index + 1, 0, {
        type: "comment",
        text: comment,
      });

      setPageContents(newContent);

      addComment({
        position: index,
        currentPage: courseIds.currentPage,
        sectionId: courseIds.sectionId,
        courseId: courseIds.courseId,
        text: comment,
        userId: user.uid,
        type: "comment",
      });

      handleClose();
    }
    setComment("");
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="comment-dialog-heading">
          Add Notes / Comments
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p className="comment-dialog-desc">
              Add notes as you read through, so that you can refer to them
              later.
            </p>
          </DialogContentText>
          <TextField
            autoFocus
            value={comment}
            required
            margin="dense"
            id="name"
            name="notes"
            label="Add Notes"
            fullWidth
            variant="standard"
            multiline
            onChange={(e) => setComment(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "Poppins",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Poppins",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="comment-dialog-btns">
            Cancel
          </Button>
          <Button onClick={handleAddNote} className="comment-dialog-btns">
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const ChatDialog = ({
  open,
  setOpen,
  index,
  pageContents,
  setPageContents,
  selectedText,
  courseIds,
}) => {
  const [message, setMessage] = useState(selectedText);
  const [history, setHistory] = useState([]);
  const [summarizing, setSummarize] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setHistory([]);
  };

  useEffect(() => {
    setMessage(selectedText);
  }, [selectedText]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setHistory([
        ...history,
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: data.text }] },
      ]);
      setMessage("");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while sending the message. Please try again.");
    }
    setLoading(false);
  };

  const summarizeChat = async () => {
    console.log("index inside of summarize", index);
    if (index == null) return;
    setSummarize(true);

    const message = `Please summarize our chat by highlighting the key points discussed, 
    eliminating any conversational elements. The summary should be grammatical correct paragraph 
    that is easy to understand as if it were notes taken by a student.`;

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // data.text
      const newContent = [...pageContents];
      newContent.splice(index + 1, 0, {
        type: "ai-chat",
        text: data.text,
      });
      setPageContents(newContent);
      addComment({
        position: index,
        currentPage: courseIds.currentPage,
        sectionId: courseIds.sectionId,
        courseId: courseIds.courseId,
        text: data.text,
        userId: user.uid,
        type: "ai-chat",
      });

      setMessage("");
    } catch (error) {
      setSummarize(false);
      console.error("An error occurred:", error);
      // alert("An error occurred while sending the message. Please try again.");
    }
    handleClose();
    setSummarize(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="comment-dialog-heading">
          Hi, Im Tan 😊
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p className="comment-dialog-desc">
              Note, the chat is not saved once you leave the chat the
              conversation is lost. But can save a summary of the text.
            </p>
            {loading && <div className="send-message-loader"></div>}
          </DialogContentText>
          {history.map((entry, index) => (
            <ChatMessage
              key={index}
              user={entry.role === "user"}
              message={entry.parts[0].text}
            />
          ))}
          <div className="chat-message-send-wrapper">
            <TextField
              autoFocus
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="dense"
              id="name"
              name="notes"
              label="Message Tan"
              fullWidth
              variant="standard"
              multiline
              sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Poppins",
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              children={
                <Avatar>
                  <i className="bx bx-send"></i>
                </Avatar>
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="comment-dialog-btns">
            Cancel
          </Button>
          <Button onClick={summarizeChat} className="comment-dialog-btns">
            {summarizing ? "Summarizing..." : "Summarize"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const ChatMessage = ({ user, message }) => {
  return (
    <div className="chat-message-courses">
      {user ? (
        <Avatar />
      ) : (
        <Avatar>
          <i className="fa-solid fa-robot"></i>
        </Avatar>
      )}
      {user ? (
        <p className="chat-message-course-p">{message}</p>
      ) : (
        <div className="ai-answers">
          <ReactMarkdown children={message} remarkPlugins={[remarkGfm]} />
        </div>
      )}
      {/* <p className="chat-message-course-p">{message}</p> */}
    </div>
  );
};

const CoursePage = ({ pageContent }) => {
  return (
    <div className="course-page">
      {pageContent.map((item, index) => {
        switch (item.type) {
          case "title":
            return <h2 key={index}>{item.text}</h2>;
          case "subheading":
            return <h3 key={index}>{item.text}</h3>;
          case "paragraph":
            return <p key={index}>{item.text}</p>;
          case "image":
            return (
              <div className="course-page-img-container">
                <img key={index} src={item.url} alt={item.alt} />
                <p>{item.caption}</p>
              </div>
            );
          case "latex":
            return <BlockMath key={index}>{item.text}</BlockMath>;
          case "list":
            return (
              <div key={index}>
                <p>{item.text}</p>
                <ul className="page-list-items">
                  {item.list_items.map((li, idx) => (
                    <li key={idx}>{li}</li>
                  ))}
                </ul>
              </div>
            );
          case "comment":
            return (
              <p key={index} className="user-comment">
                {item.text}
              </p>
            );
          case "ai-chat":
            return (
              <p key={index} className="ai-chat-comment">
                {item.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

async function addComment(commentData) {
  try {
    const docRef = await addDoc(collection(firestore, "comments"), commentData);
    return docRef;
  } catch (error) {
    console.error("Error adding comment: ", error);
    // throw error;
  }
}

async function getComments(userId, courseId, sectionId, currentPage) {
  try {
    // Create a query against the collection
    const q = query(
      collection(firestore, "comments"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      where("sectionId", "==", sectionId),
      where("currentPage", "==", currentPage)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract data from query snapshot
    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return comments;
  } catch (error) {
    console.error("Error getting comments: ", error);
    throw error; // Rethrow the error if you want it to be handled further up the call stack
  }
}

function insertCommentsIntoContent(pageContent, comments) {
  // Create a shallow copy of the pageContent array
  const newPageContent = pageContent.slice();

  // Sort comments by position to ensure correct order of insertion
  comments.sort((a, b) => a.position - b.position);

  // Insert each comment into the new array
  comments.forEach((comment) => {
    const commentObj = {
      type: comment.type,
      text: comment.text,
    };
    newPageContent.splice(comment.position + 1, 0, commentObj);
  });

  return newPageContent;
}
