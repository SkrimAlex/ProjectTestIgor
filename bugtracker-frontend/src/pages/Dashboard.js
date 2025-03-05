import { useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function BugManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [assignedTo, setAssignedTo] = useState("");
  const [labels, setLabels] = useState([]);
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);
  const [bugId, setBugId] = useState(""); // ID багу для видалення
  const [createdBugId, setCreatedBugId] = useState(""); // Змінна для відображення ID створеного багу

  const handleCreateBug = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title); // Перевірте, чи є значення для title
    formData.append('description', description); // Перевірте, чи є значення для description
    formData.append('priority', priority);
    formData.append('status', status);
    formData.append('assignedTo', assignedTo);
    formData.append('labels', labels.join(', '));
    formData.append('comments', comments);
    if (file) {
      formData.append('file', file);
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/bugs", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      alert(response.data.message);
      setCreatedBugId(response.data.bugId);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Open");
      setAssignedTo("");
      setLabels([]);
      setComments("");
      setFile(null);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  
  

  const handleDeleteBug = async () => {
    if (!bugId) {
      alert("Please provide a Bug ID");
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:3000/api/bugs/${bugId}`);
      alert(response.data.message);
      setBugId(""); // Очищаємо ID після видалення
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Create Bug</h2>
      <form onSubmit={handleCreateBug}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Labels"
          value={labels}
          onChange={(e) => setLabels(e.target.value.split(", "))}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button type="submit">Create Bug</button>
      </form>

      {createdBugId && (
        <div>
          <h3>Created Bug ID: {createdBugId}</h3>
        </div>
      )}

      <h2>Delete Bug</h2>
      <input
        type="text"
        placeholder="Enter Bug ID to delete"
        value={bugId}
        onChange={(e) => setBugId(e.target.value)}
      />
      <button onClick={handleDeleteBug}>Delete Bug</button>
    </div>
  );
}

export default BugManager;
