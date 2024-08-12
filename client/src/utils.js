import { firestore } from "./firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const getAllCourses = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "courses"));
    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return courses;
  } catch (error) {
    console.error("Error getting courses", error);
    return [];
  }
};

export const addCourse = async (courseData) => {
  try {
    await setDoc(doc(firestore, "courses", courseData.courseId), courseData);

    console.log("Course added successfully");
  } catch (error) {
    console.error("Error adding course: ", error);
  }
};

// addCourse(courseData);
const kinematicsContent = [
  {
    sectionId: 1,
    content: [
      { type: "title", text: "Introduction to Speed and Velocity" },
      { type: "subheading", text: "Scalars" },
      {
        type: "paragraph",
        text: `Scalars are quantities that are fully described by a magnitude (or numerical value) alone.
           They do not have a direction associated with them. Examples of scalar quantities include length, 
           mass, time, speed, and distance. In kinematics, which is the study of motion, scalar quantities only 
           take on positive values. For instance, distance traveled or time elapsed can only be positive because 
           they are measured as a total quantity and do not have direction.`,
      },
      { type: "subheading", text: "Vectors" },
      {
        type: "paragraph",
        text: `Vectors, on the other hand, are quantities that have both magnitude and direction. Common examples
          of vector quantities include velocity, displacement, and acceleration. To fully define a vector, you need 
          to specify its origin and a positive direction. This directional component is essential for understanding
          the vector's full impact and behavior in different contexts. Vectors are often represented graphically by 
          arrows, where the length of the arrow indicates the magnitude and the arrowhead indicates the direction.`,
      },
      { type: "subheading", text: "Distance" },
      {
        type: "paragraph",
        text: `Distance is a scalar quantity and is defined as the total length covered by a moving body, 
          irrespective of the direction. The SI unit for distance is the meter (m). Because distance does not consider direction, 
          it simply measures how much ground an object has covered during its motion.`,
      },
      { type: "subheading", text: "Displacement" },
      {
        type: "paragraph",
        text: `Displacement is a vector quantity and is defined as the straight-line distance covered by a moving body 
          measured from a specific reference point in a stated direction. Like distance, the SI unit for displacement is
           the meter (m). However, unlike distance, displacement takes into account the direction from the starting point to 
           the ending point, providing a complete description of the object's change in position.`,
      },
      {
        type: "subheading",
        text: "Speed & Velocity",
      },
      {
        type: "paragraph",
        text: `Speed is a scalar quantity that measures the distance moved per unit of time. It gives no information about 
          the direction of motion, only how fast an object is moving. The SI unit for speed is meters per second (m/s). For example, 
          if a car travels 60 meters in 2 seconds, its speed would be 30 m/s, regardless of the direction of travel. Velocity is a vector
           quantity that measures the rate of change of displacement per unit time. It not only indicates how fast an object is moving but 
           also the direction of the movement. The SI unit for velocity is meters per second (m/s). Velocity can be represented with arrows,
            where the length of the arrow indicates the magnitude of the velocity, and the direction of the arrow indicates the direction 
            of motion. For instance, if a car moves 60 meters north in 2 seconds, its velocity would be 30 m/s north, providing a complete 
            picture of the car's motion.`,
      },
      {
        type: "latex", // `\\text{frac} = \\frac{1}{2}`
        text: "\\text{Velocity}=\\frac{\\text{displacement}}{\\text{total time taken}}",
      },
      {
        type: "latex",
        text: "\\text{Speed}=\\frac{\\text{distance}}{\\text{total time taken}}",
      },
      { type: "subheading", text: "Example 1." },
      {
        type: "paragraph",
        text: `Tan runs once around a 0.25km track in 2.0min and comes back to her
          starting position. What is the magnitude of her average speed? `,
      },
      {
        type: "latex",
        text: `
          \\begin{align*}
          \\text{Average Speed} &= \\frac{d}{t} \\newline 
          &= \\frac{0.25 \\text{ km}}{2 \\text{ min}} \\newline 
          &= \\frac{250 \\text{ m}}{120 \\text{ s}} \\newline 
          &= 2.08 \\text{ m s}^{-1} \\quad \\newline 
          &= 2.1 \\text{ m s}^{-1} \\quad (2 \\text{ s.f.}) \\newline 
          \\end{align*}
          `,
      },
    ],
  },
  {
    sectionId: 2,
    content: [
      { type: "title", text: "Acceleration" },
      {
        type: "paragraph",
        text: "4. Define acceleration as change in velocity per unit time; recall and use the equation: acceleration = change in velocity / time taken (a = ∆v / ∆t).",
      },
      {
        type: "paragraph",
        text: "5. State what is meant by, and describe examples of, uniform acceleration and non-uniform acceleration.",
      },
      {
        type: "paragraph",
        text: "6. Know that a deceleration is a negative acceleration and use this in calculations.",
      },
    ],
  },
  {
    sectionId: 3,
    content: [
      { type: "title", text: "Graphs and Motion" },
      {
        type: "paragraph",
        text: "7. Sketch, plot and interpret distance–time and speed–time graphs.",
      },
      {
        type: "paragraph",
        text: "8. Determine from the shape of a distance–time graph when an object is:\n(a) at rest\n(b) moving with constant speed\n(c) accelerating\n(d) decelerating.",
      },
      {
        type: "paragraph",
        text: "9. Determine from the shape of a speed–time graph when an object is:\n(a) at rest\n(b) moving with constant speed\n(c) moving with constant acceleration\n(d) moving with changing acceleration.",
      },
      {
        type: "paragraph",
        text: "10. State that the acceleration of free fall g for an object near to the surface of the Earth is approximately constant and is approximately 9.8 m/s².",
      },
    ],
  },
  {
    sectionId: 4,
    content: [
      { type: "title", text: "Calculations from Graphs" },
      {
        type: "paragraph",
        text: "11. Calculate speed from the gradient of a distance–time graph.",
      },
      {
        type: "paragraph",
        text: "12. Calculate the area under a speed–time graph to determine the distance travelled for motion with constant speed or constant acceleration.",
      },
      {
        type: "paragraph",
        text: "13. Calculate acceleration from the gradient of a speed–time graph.",
      },
    ],
  },
];

const dynamicsCourseData = [
  {
    sectionId: 1,
    content: [
      { type: "title", text: "Mass and Inertia" },
      {
        type: "paragraph",
        text: "1. Mass is a measure of the quantity of matter in an object at rest relative to the observer.",
      },
      {
        type: "paragraph",
        text: "2. The mass of an object resists change from its state of rest or motion (inertia).",
      },
      {
        type: "paragraph",
        text: "3. Weights, and therefore masses, may be compared using a beam balance or equal-arm balance.",
      },
      {
        type: "paragraph",
        text: "4. Mass can be determined using an electronic balance.",
      },
      {
        type: "paragraph",
        text: "5. Weight can be measured using a force meter.",
      },
      {
        type: "paragraph",
        text: "6. Gravitational field strength is defined as force per unit mass. The equation is:",
      },
      {
        type: "equation",
        text: "gravitational \\ field \\ strength = \\frac{weight}{mass} \\, (g = \\frac{W}{m})",
      },
      {
        type: "paragraph",
        text: "This is equivalent to the acceleration of free fall.",
      },
      {
        type: "paragraph",
        text: "7. A gravitational field is a region in which a mass experiences a force due to gravitational attraction.",
      },
    ],
  },
  {
    sectionId: 2,
    content: [
      { type: "title", text: "Density" },
      {
        type: "paragraph",
        text: "1. Density is defined as mass per unit volume. The equation is:",
      },
      {
        type: "equation",
        text: "density = \\frac{mass}{volume} \\, (\\rho = \\frac{m}{V})",
      },
      {
        type: "paragraph",
        text: "2. To determine the density of a liquid, a regularly shaped solid, and an irregularly shaped solid which sinks in a liquid (volume by displacement), appropriate calculations are used.",
      },
    ],
  },
  {
    sectionId: 3,
    content: [
      { type: "title", text: "Forces: Balanced and Unbalanced" },
      {
        type: "paragraph",
        text: "1. Different types of force include weight (gravitational force), friction, drag, air resistance, tension (elastic force), electrostatic force, magnetic force, thrust (driving force), and contact force.",
      },
      {
        type: "paragraph",
        text: "2. Forces acting on an object can be identified and represented in free-body diagrams.",
      },
      {
        type: "paragraph",
        text: "3. Newton’s first law states: ‘an object either remains at rest or continues to move in a straight line at constant speed unless acted on by a resultant force’.",
      },
      {
        type: "paragraph",
        text: "4. A force may change the velocity of an object by changing its direction of motion or its speed.",
      },
      {
        type: "paragraph",
        text: "5. The resultant of two or more forces acting along the same straight line can be determined.",
      },
      { type: "paragraph", text: "6. The equation for resultant force is:" },
      {
        type: "equation",
        text: "resultant \\ force = mass \\times acceleration \\, (F = ma)",
      },
      {
        type: "paragraph",
        text: "7. Newton’s third law states: ‘when object A exerts a force on object B, then object B exerts an equal and opposite force on object A’.",
      },
      {
        type: "paragraph",
        text: "8. Newton’s third law describes pairs of forces of the same type acting on different objects.",
      },
    ],
  },
];

export const courseData = {
  courseId: "olevel_physics",
  title: "Physics - Grade 12",
  description: `This OLevel Physics course provides a comprehensive understanding of fundamental 
  physics concepts. It covers essential topics such as kinematics, dynamics, and graph interpretations,
   equipping students with the skills to solve problems and prepare for examinations. 
    The course is designed to build a strong foundation in physics, 
    making it ideal for those interested in science and preparing for OLevel exams.`,
  banner_img:
    "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/physics-banner.png?alt=media&token=0f855e57-0e20-4855-a8d5-7f033409d4e7",
  goals: [
    "Understand the basic principles of physics",
    "Apply physics concepts to solve problems",
    "Prepare for OLevel physics examinations",
  ],
  prerequisites: [
    "Basic math skills",
    "Interest in science",
    "Curiosity to learn",
  ],
  topics: [
    {
      title: "Introduction to Kinematics",
      description:
        "Learn the basics of motion, including speed, velocity, and acceleration.",
      duration: "5 hours",
      subTopics: kinematicsContent,
      details: [
        "Define and differentiate between scalar and vector quantities.",
        "Explain the concepts of distance, displacement, speed, velocity, and acceleration.",
        "Understand and apply the equations of motion to solve problems.",
      ],
    },
    {
      title: "Dynamics",
      description: "Learn about forces and their effects on motion.",
      duration: "5 hours",
      subTopics: dynamicsCourseData,
      details: [
        "Explain the concept of force and its unit of measurement.",
        "Describe and apply Newton's First Law of Motion.",
      ],
    },
  ],
};

// image include url & alt
const heartContent = [
  {
    sectionId: 1,
    content: [
      { type: "title", text: "The human heart" },
      {
        type: "paragraph",
        text: `The heart is a fist-sized organ that pumps blood throughout your body. It's your 
                circulatory system's main organ. Muscle and tissue make up this powerhouse organ.
                Your heart contains four muscular sections (chambers) that briefly hold blood before moving it. 
                Electrical impulses make your heart beat, moving blood through these chambers. Your brain and nervous 
                system direct your heart's function.`,
      },
      {
        type: "image",
        url: "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/heart-overview-outside.jpeg?alt=media&token=717f44dc-36fe-4850-ba6f-0dfded6f82b3",
        alt: "the human heart.",
        caption:
          "Your heart is a muscular organ that pumps blood to your body. View 3D model in tanulok3d",
      },
      {
        type: "subheading",
        text: "What is the function of the heart?",
      },
      {
        type: "paragraph",
        text: "Your heart's main function is to move blood throughout your body. Blood brings oxygen and nutrients to your cells. It also takes away carbon dioxide and other waste so other organs can dispose of them.",
      },
      {
        type: "list",
        text: "Your heart also:",
        list_items: [
          "Controls the rhythm and speed of your heart rate.",
          "Maintains your blood pressure.",
        ],
      },
      {
        type: "list",
        text: "Your heart works with these body systems to control your heart rate and other body functions:",
        list_items: [
          "Nervous system: Your nervous system helps control your heart rate. It sends signals that tell your heart to beat slower during rest and faster during stress.",
          "Endocrine system: Your endocrine system sends out hormones. These hormones tell your blood vessels to constrict or relax, which affects your blood pressure. Hormones from your thyroid gland can also tell your heart to beat faster or slower.",
        ],
      },
      {
        type: "subheading",
        text: "Anatomy",
      },
      {
        type: "list",
        text: "The parts of your heart are like the parts of a building. Your heart anatomy includes:",
        list_items: [
          "Walls",
          "Chambers that are like rooms.",
          "Valves that open and close like doors to the rooms",
          "Blood vessels like plumbing pipes that run through a building.",
          "An electrical conduction system like electrical power that runs through a building.",
        ],
      },
      {
        type: "image",
        url: "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/heart-inside.jpeg?alt=media&token=63f58b60-b722-4c93-96d9-82b9c65737d8",
        alt: "the anatomy of the human heart.",
        caption:
          "Blood moves through chambers inside your heart. View 3d model in tanulok3d.",
      },
    ],
  },
];

const brainContent = [
  {
    sectionId: 1,
    content: [
      { type: "title", text: "The human brain" },
      {
        type: "paragraph",
        text: `The brain is a complex organ that controls thought, memory, emotion, touch, motor skills, vision, 
              breathing, temperature, hunger and every process that regulates our body. Together, the brain and spinal 
              cord that extends from it make up the central nervous system, or CNS.`,
      },
      {
        type: "subheading",
        text: "What is the brain made of?",
      },
      {
        type: "paragraph",
        text: `Weighing about 3 pounds in the average adult, the brain is about 60% fat. The remaining 40% is a combination of water, protein, carbohydrates and salts. The brain itself is a not a muscle. It contains blood vessels and nerves, including neurons and glial cells.`,
      },
      {
        type: "subheading",
        text: "What is the gray matter and white matter?",
      },
      {
        type: "paragraph",
        text: "Gray and white matter are two different regions of the central nervous system. In the brain, gray matter refers to the darker, outer portion, while white matter describes the lighter, inner section underneath. In the spinal cord, this order is reversed: The white matter is on the outside, and the gray matter sits within.",
      },
      {
        type: "image",
        url: "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/brain%20spine%20gray%20and%20white%20matter.jpg?alt=media&token=7568bbdd-ade9-4003-aa89-e33edb9aa253",
        alt: "the human brain.",
        caption: "Available in tanulok3d",
      },
      {
        type: "paragraph",
        text: "Gray matter is primarily composed of neuron somas (the round central cell bodies), and white matter is mostly made of axons (the long stems that connects neurons together) wrapped in myelin (a protective coating). The different composition of neuron parts is why the two appear as separate shades on certain scans.",
      },
      {
        type: "subheading",
        text: "Neuron Anatomy",
      },
      {
        type: "image",
        url: "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/neuron%20anatomy%20diagram.jpg?alt=media&token=badfbb54-ab0e-4358-997d-9b32287b1118",
        alt: "neuron anatomy.",
        caption: "Available in tanulok3d",
      },
      {
        type: "paragraph",
        text: "Each region serves a different role. Gray matter is primarily responsible for processing and interpreting information, while white matter transmits that information to other parts of the nervous system.",
      },
      {
        type: "subheading",
        text: "How does the brain work?",
      },
      {
        type: "paragraph",
        text: `The brain sends and receives chemical and electrical signals throughout the body. Different signals control different processes, and your brain interprets each. Some make you feel tired, for example, while others make you feel pain.
              Some messages are kept within the brain, while others are relayed through the spine and across the body’s vast network of nerves to distant extremities. To do this, the central nervous system relies on billions of neurons (nerve cells).
              `,
      },
      {
        type: "subheading",
        text: "Main Parts of the Brain and Their Functions",
      },
      {
        type: "paragraph",
        text: `At a high level, the brain can be divided into the cerebrum, brainstem and cerebellum.
`,
      },
      {
        type: "image",
        url: "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/brain%20main%20parts.png?alt=media&token=ab0f6776-4e9d-4661-ac52-a122e4b77eb7",
        alt: "main parts of the brain.",
        caption: "Available in tanulok3d",
      },
      {
        type: "subheading",
        text: "Cerebrum",
      },
      {
        type: "paragraph",
        text: `The cerebrum (front of brain) comprises gray matter (the cerebral cortex) and white matter at its center. The largest part of the brain, the cerebrum initiates and coordinates movement and regulates temperature. Other areas of the cerebrum enable speech, judgment, thinking and reasoning, problem-solving, emotions and learning. Other functions relate to vision, hearing, touch and other senses.
`,
      },
      {
        type: "subheading",
        text: "Cerebral Cortex",
      },
      {
        type: "paragraph",
        text: `Cortex is Latin for “bark,” and describes the outer gray matter covering of the cerebrum. The cortex has a large surface area due to its folds, and comprises about half of the brain's weight.
The cerebral cortex is divided into two halves, or hemispheres. It is covered with ridges (gyri) and folds (sulci). The two halves join at a large, deep sulcus (the interhemispheric fissure, AKA the medial longitudinal fissure) that runs from the front of the head to the back. The right hemisphere controls the left side of the body, and the left half controls the right side of the body. The two halves communicate with one another through a large, C-shaped structure of white matter and nerve pathways called the corpus callosum. The corpus callosum is in the center of the cerebrum.
`,
      },
      {
        type: "subheading",
        text: "Brainstem",
      },
      {
        type: "list",
        text: "The brainstem (middle of brain) connects the cerebrum with the spinal cord. The brainstem includes the midbrain, the pons and the medulla.",
        list_items: [
          "Midbrain. The midbrain (or mesencephalon) is a very complex structure with a range of different neuron clusters (nuclei and colliculi), neural pathways and other structures. These features facilitate various functions, from hearing and movement to calculating responses and environmental changes. The midbrain also contains the substantia nigra, an area affected by Parkinson's disease that is rich in dopamine neurons and part of the basal ganglia, which enables movement and coordination.",
          "Pons. The pons is the origin for four of the 12 cranial nerves, which enable a range of activities such as tear production, chewing, blinking, focusing vision, balance, hearing and facial expression. Named for the Latin word for “bridge,” the pons is the connection between the midbrain and the medulla",
          "Medulla. At the bottom of the brainstem, the medulla is where the brain meets the spinal cord. The medulla is essential to survival. Functions of the medulla regulate many bodily activities, including heart rhythm, breathing, blood flow, and oxygen and carbon dioxide levels. The medulla produces reflexive activities such as sneezing, vomiting, coughing and swallowing.",
        ],
      },
      {
        type: "paragraph",
        text: `The spinal cord extends from the bottom of the medulla and through a large opening in the bottom of the skull. Supported by the vertebrae, the spinal cord carries messages to and from the brain and the rest of the body.
`,
      },
      {
        type: "subheading",
        text: "Cerebellum",
      },
      {
        type: "paragraph",
        text: `The cerebellum (“little brain”) is a fist-sized portion of the brain located at the back of the head, below the temporal and occipital lobes and above the brainstem. Like the cerebral cortex, it has two hemispheres. The outer portion contains neurons, and the inner area communicates with the cerebral cortex. Its function is to coordinate voluntary muscle movements and to maintain posture, balance and equilibrium. New studies are exploring the cerebellum's roles in thought, emotions and social behavior, as well as its possible involvement in addiction, autism and schizophrenia.`,
      },
    ],
  },
];

const digestiveSystemContent = [];
const respiratorySystemContent = [];
const eyesContent = [];

const biology_data = {
  courseId: "olevel_biology",
  title: "Biology - Grade 12",
  description: `This OLevel Biology course provides an in-depth understanding of essential biological systems. 
  It covers fundamental topics such as the heart, brain, digestive system, respiratory system, and eyes, 
  equipping students with the knowledge to excel in exams. 
  The course is designed to build a strong foundation in biology, making it ideal for those preparing for OLevel exams.`,
  banner_img:
    "https://firebasestorage.googleapis.com/v0/b/tanulok-440eb.appspot.com/o/biology-banner.png?alt=media&token=a185bdf8-740b-4917-a0ba-b202931cb5cc",
  goals: [
    "Understand the basic principles of biology.",
    "Learn about the human body's key systems and organs.",
    "Prepare for OLevel biology examinations.",
  ],
  prerequisites: [
    "Basic science knowledge",
    "Interest in biology and life sciences",
    "Curiosity to learn about the human body",
  ],
  topics: [
    {
      title: "The Heart",
      description: "Explore the structure and function of the human heart.",
      duration: "4 hours",
      subTopics: heartContent,
      details: [
        "Understand the anatomy of the heart, including chambers, valves, and vessels.",
        "Learn the cardiac cycle and how blood circulates through the body.",
        "Explore common cardiovascular diseases and their prevention.",
      ],
    },
    {
      title: "The Brain",
      description:
        "Study the human brain and its role in controlling bodily functions.",
      duration: "4.5 hours",
      subTopics: brainContent,
      details: [
        "Learn the major parts of the brain and their functions.",
        "Understand how neurons communicate through synapses.",
        "Explore the nervous system's role in sensation and movement.",
      ],
    },

    // {
    //   title: "Digestive System",
    //   description:
    //     "Learn about the organs and processes involved in digestion.",
    //   duration: "5 hours",
    //   subTopics: digestiveSystemContent,
    //   details: [
    //     "Understand the anatomy of the digestive system, including the stomach, intestines, and accessory organs.",
    //     "Learn the process of digestion and nutrient absorption.",
    //     "Explore common digestive disorders and their impact on health.",
    //   ],
    // },
    // {
    //   title: "Respiratory System",
    //   description:
    //     "Discover the function and structure of the respiratory system.",
    //   duration: "4 hours",
    //   subTopics: respiratorySystemContent,
    //   details: [
    //     "Understand the anatomy of the lungs and airways.",
    //     "Learn how gas exchange occurs in the alveoli.",
    //     "Explore the mechanics of breathing and respiratory health.",
    //   ],
    // },
    // {
    //   title: "The Eyes",
    //   description: "Examine the structure and function of the human eye.",
    //   duration: "3.5 hours",
    //   subTopics: eyesContent,
    //   details: [
    //     "Learn the anatomy of the eye, including the retina, lens, and optic nerve.",
    //     "Understand how the eye processes light to create vision.",
    //     "Explore common eye conditions and how they affect vision.",
    //   ],
    // },
  ],
};

export { biology_data };

// [
//   {
//     question: "string",
//     answers: [
//       {
//         answer: "string",
//         isCorrect: "true",
//         explanation: "string",
//       },
//       {
//         answer: "string",
//         isCorrect: "true",
//         explanation: "string",
//       },
//       {
//         answer: "string",
//         isCorrect: "true",
//         explanation: "string",
//       },
//       {
//         answer: "string",
//         isCorrect: "true",
//         explanation: "string",
//       },
//     ],
//   },
// ];
