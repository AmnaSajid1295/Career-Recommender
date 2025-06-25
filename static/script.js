document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizForm");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    if (!username) {
      resultDiv.innerHTML = "<p style='color:red;'>Please enter your name.</p>";
      return;
    }

    const selected = {};
    ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"].forEach((q) => {
      selected[q] = Array.from(document.querySelectorAll(`input[name=${q}]:checked`)).map(el => el.value);
    });

    if (Object.values(selected).some(arr => arr.length === 0)) {
      resultDiv.innerHTML = "<p style='color:red;'>Please answer all questions.</p>";
      return;
    }

    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: username, ...selected })
    });

    const data = await response.json();

    const roadmaps = {
      "Data Scientist": [
        "Learn Python and Pandas",
        "Take a beginner-friendly statistics course",
        "Try real-world datasets on Kaggle",
        "Build a data visualization dashboard"
      ],
      "AI Engineer": [
        "Master Python & NumPy",
        "Take a Machine Learning course (like Andrew Ng’s)",
        "Explore deep learning (PyTorch or TensorFlow)",
        "Build AI mini-projects (chatbots, image classifiers)"
      ],
      "UI/UX Designer": [
        "Learn Figma or Adobe XD",
        "Study UX principles and color theory",
        "Create portfolio projects",
        "Contribute to open-source design tools"
      ],
      "Software Developer": [
        "Learn a programming language (Python/Java)",
        "Understand data structures and algorithms",
        "Build small apps or games",
        "Practice coding on LeetCode or HackerRank"
      ],
      "Technical Writer": [
        "Improve technical writing skills",
        "Write documentation or tech blogs",
        "Learn Markdown and GitHub Docs",
        "Write tutorials for your projects"
      ],
      "Teacher": [
        "Pursue a degree in education",
        "Volunteer as a tutor or mentor",
        "Improve your public speaking",
        "Learn child development and pedagogy"
      ],
      "Doctor": [
        "Study biology, chemistry, and physics",
        "Prepare for medical entrance exams",
        "Volunteer at clinics",
        "Explore medical specializations"
      ],
      "Nurse": [
        "Get a nursing degree or diploma",
        "Learn first aid and basic patient care",
        "Volunteer at health camps",
        "Practice communication and empathy"
      ],
      "Journalist": [
        "Learn how to write clear news stories",
        "Follow current events",
        "Intern at a newspaper or magazine",
        "Study media ethics and law"
      ],
      "Artist": [
        "Take drawing and painting classes",
        "Build an art portfolio",
        "Join art contests or galleries",
        "Learn digital art tools"
      ],
      "Chef": [
        "Experiment with cooking different cuisines",
        "Join a culinary school",
        "Start a food blog or YouTube channel",
        "Intern at restaurants"
      ],
      "Athlete": [
        "Train regularly in your chosen sport",
        "Work with a coach",
        "Maintain a healthy diet and sleep routine",
        "Join local tournaments"
      ],
      "Fashion Designer": [
        "Learn about fashion trends and fabrics",
        "Practice sketching designs",
        "Create DIY outfits",
        "Join a fashion school"
      ],
      "Architect": [
        "Study math, physics, and art",
        "Learn architectural software (AutoCAD, SketchUp)",
        "Take part in design competitions",
        "Shadow architects or visit sites"
      ],
      "Content Creator": [
        "Choose your niche (tech, beauty, education, etc.)",
        "Use social media tools",
        "Learn video editing and storytelling",
        "Post consistently and build a brand"
      ],
      "Musician": [
        "Take music lessons",
        "Practice an instrument or vocals daily",
        "Record and share your music",
        "Collaborate with other musicians"
      ],
      "Lawyer": [
        "Study political science, history, or law",
        "Join debate or MUN clubs",
        "Understand the constitution and legal terms",
        "Intern at law firms"
      ],
      "Accountant": [
        "Learn accounting principles and Excel",
        "Practice with budgets and ledgers",
        "Understand taxes and finance laws",
        "Get certified (e.g., CA, CPA)"
      ],
      "Psychologist": [
        "Study psychology and human behavior",
        "Learn active listening and empathy",
        "Volunteer for mental health orgs",
        "Get certified as a counselor"
      ],
      "Environmental Scientist": [
        "Study environmental science or biology",
        "Join eco clubs or tree planting drives",
        "Collect data on local pollution or waste",
        "Explore GIS or environmental modeling"
      ]
    };

    const roadmap = roadmaps[data.top] || ["Start by exploring your interests and building projects."];

    resultDiv.innerHTML = `
      <h2>Hi ${username}!</h2>
      <p>🎯 Your best-fit career: <strong style="color:#4CAF50;">${data.top}</strong></p>
      <p>✨ You might also enjoy:</p>
      <ul><li>${data.alt1}</li><li>${data.alt2}</li></ul>
      <hr>
      <h3>🚀 How to get started as a ${data.top}:</h3>
      <ul>${roadmap.map(step => `<li>${step}</li>`).join('')}</ul>
    `;
  });
});
