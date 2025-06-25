from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

CAREERS = {
    "Data Scientist": ["data", "math", "logic", "ai", "research"],
    "Software Developer": ["coding", "logic", "solo", "backend"],
    "UI/UX Designer": ["design", "creativity", "visuals", "frontend"],
    "AI Engineer": ["ai", "math", "automation", "deep learning"],
    "Technical Writer": ["writing", "communication", "clarity"],
    "Teacher": ["communication", "education", "kids", "public"],
    "Lawyer": ["public", "reading", "justice", "debate"],
    "Doctor": ["health", "bio", "helping", "patient", "medicine"],
    "Nurse": ["helping", "team", "health", "bio", "patience"],
    "Entrepreneur": ["risk", "leadership", "business", "freedom"],
    "Accountant": ["math", "money", "accuracy", "detail"],
    "Actor": ["drama", "public", "creative", "expression"],
    "Journalist": ["writing", "public", "research", "travel"],
    "Artist": ["painting", "imagination", "visuals", "solo"],
    "Athlete": ["sports", "physical", "competitive", "discipline"],
    "Chef": ["cooking", "creative", "practical", "food"],
    "Fashion Designer": ["creativity", "style", "visual", "trends"],
    "Psychologist": ["listening", "helping", "research", "mental"],
    "Architect": ["design", "drawing", "math", "structure"],
    "Content Creator": ["video", "writing", "creativity", "social media"],
    "Musician": ["music", "rhythm", "creative", "performance"],
    "Environmental Scientist": ["nature", "data", "biology", "fieldwork"]
}


def init_db():
    conn = sqlite3.connect('responses.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        q1 TEXT, q2 TEXT, q3 TEXT, q4 TEXT, q5 TEXT,
        top TEXT, alt1 TEXT, alt2 TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    name = data.get("name", "User")
    all_answers = data.get("q1", []) + data.get("q2", []) + data.get("q3", []) + data.get("q4", []) + data.get("q5", [])

    scores = {}
    for career, tags in CAREERS.items():
        match_score = sum(1 for tag in tags if tag in all_answers)
        scores[career] = match_score

    top3 = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
    top_career = top3[0][0] if top3 else "General Technologist"
    alt1 = top3[1][0] if len(top3) > 1 else "Software Tester"
    alt2 = top3[2][0] if len(top3) > 2 else "DevOps Engineer"

    conn = sqlite3.connect('responses.db')
    c = conn.cursor()
    c.execute("INSERT INTO responses (name, q1, q2, q3, q4, q5, top, alt1, alt2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              (name, ','.join(data['q1']), ','.join(data['q2']), ','.join(data['q3']),
               ','.join(data['q4']), ','.join(data['q5']), top_career, alt1, alt2))
    conn.commit()
    conn.close()

    return jsonify({"top": top_career, "alt1": alt1, "alt2": alt2})

if __name__ == '__main__':
    app.run(debug=True)
