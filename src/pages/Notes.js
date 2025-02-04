import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent, IconButton,Tooltip, Dialog,Grid2, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Delete, ContentCopy, FavoriteBorder, Favorite } from "@mui/icons-material";

const API_URL = "https://rxxkvz-5000.csb.app/api/notes";

const Notes = () => {
  const navigate=useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const token = localStorage.getItem("token");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [image, setImage] = useState(null); // Store image for the specific note




  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";
  
      speechRecognition.onstart = () => setIsRecording(true);
      speechRecognition.onend = () => setIsRecording(false);
      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewNote((prev) => ({ ...prev, content: prev.content + " " + transcript }));
      };
  
      setRecognition(speechRecognition);
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);
  

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort notes by creation date (from old to new)
      const sortedNotes = response.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setNotes(sortedNotes);
      console.log(response.data);

    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };


const handleOpenCreateDialog = () => {
  setNewNote({ title: "", content: "" }); // Reset form
  setCreateDialogOpen(true);
};

const handleCloseCreateDialog = () => {
  setCreateDialogOpen(false);
};

const handleSaveNewNote = async () => {
  if (!newNote.title.trim() || !newNote.content.trim()) {
    alert("Title and content cannot be empty!");
    return;
  }

  try {
    const response = await axios.post(API_URL, newNote, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes([response.data.note, ...notes]);
    handleCloseCreateDialog();
  } catch (error) {
    console.error("Error creating note:", error);
  }
};

  

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleCopyNote = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleFavoriteToggle = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.map((note) => (note._id === id ? response.data : note)));
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
    setImage(null);
  };

  const handleUpdateNote = async (updatedNote) => {
    const formData = new FormData();
    formData.append("title", updatedNote.title);
    formData.append("content", updatedNote.content);
  
    if (image) {
      formData.append("image", image); // Append the image to FormData only if there's a change
    }
  
    try {
      const response = await axios.put(`${API_URL}/${updatedNote._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Update the note in the state only for the updated note
      setNotes(notes.map((note) => (note._id === updatedNote._id ? response.data : note)));
      setImage(null); // Clear image state after successful upload
      handleClose(); // Close the edit dialog
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const startRecording = () => {
    if (recognition) {
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };
  
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };
  

  const filteredNotes = notes.filter((note) =>
    note.title.includes(searchTerm) || note.content.includes(searchTerm)
  );

  const goToLogin = () => {
    navigate("/"); // Navigate to signup page when button is clicked
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
        Create Note
      </Button>
      <Button onClick={goToLogin}>Login</Button>
      <TextField label="Search Notes" variant="outlined"  margin="normal" onChange={handleSearch} />


      <Grid2 container spacing={2}>
        {filteredNotes.map((note) => (
          <Grid2 item xs={12} sm={4} md={6} key={note._id}>
            <Card onClick={() => handleOpenNote(note)} sx={{
              maxWidth: 345,
              marginBottom: 2,
              borderRadius: 2,
              boxShadow: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)", // Slight zoom effect on hover
                boxShadow: 6,
              },
              cursor: "pointer",
              }}>
              <CardContent sx={{ padding: 2 }}>
                <h3>{note.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tooltip title="Copy Content" arrow>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleCopyNote(note.content); }}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete Note" arrow>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}>
                    <Delete />
                  </IconButton>
                </Tooltip>

                <Tooltip title={note.favorite ? "Unfavorite" : "Favorite"} arrow>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(note._id); }}>
                    {note.favorite ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
          </div>
              </CardContent>
            </Card>   
          </Grid2>
        ))}
      </Grid2>
      <Dialog open={open} onClose={handleClose} fullWidth={isFullscreen} maxWidth={isFullscreen ? 'xl' : 'sm'}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={selectedNote?.title || ""}
            onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={selectedNote?.content || ""}
            onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
          />
         {selectedNote?.image && (
            <div style={{ marginTop: 20 }}>
              <img
                src={`https://rxxkvz-5000.csb.app/${selectedNote.image}`} // Correct image path
                alt="Note Image"
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </div>
          )}


        </DialogContent>
        {/* Image Upload */}
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginTop: 10 }}
          />
          {image && (
            <div style={{ marginTop: 10 }}>
              <img
                src={URL.createObjectURL(image)} // Temporary image preview
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </div>
          )}

        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
          </Button>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={() => handleUpdateNote(selectedNote)} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} fullWidth>
  <DialogTitle>Create Note</DialogTitle>
  <DialogContent>
    <TextField
      label="Title"
      fullWidth
      value={newNote.title}
      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
    />
    <TextField
      label="Content"
      fullWidth
      multiline
      rows={4}
      value={newNote.content}
      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
    />
    <Button onClick={startRecording} color="secondary" disabled={isRecording}>
  {isRecording ? "Recording..." : "Record Voice"}
</Button>
<Button onClick={stopRecording} color="error" disabled={!isRecording}>
  Stop
</Button>

  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseCreateDialog} color="secondary">Cancel</Button>
    <Button onClick={handleSaveNewNote} color="primary">Save</Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Notes;



