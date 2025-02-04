import React from "react";

const NoteCard = ({ note, onDelete, onRename, onFavorite }) => {

  
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      {note.image && <img src={note.image} alt="Note" />}
      <div className="actions">
        <button onClick={() => onRename(note)}>Rename</button>
        <button onClick={() => onDelete(note._id)}>Delete</button>
        <button onClick={() => onFavorite(note._id)}>
          {note.favorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;


