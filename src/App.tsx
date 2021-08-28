import React, {useEffect, useState} from 'react';
import {Input, MIDIFilter, MIDINote, useMIDI, useMIDINote} from "@react-midi/hooks";
import {Keyboard} from "./Keyboard";

function App() {
  return <MidiApp/>
}

export const useMIDINotes = (input: Input, filter: MIDIFilter = {}) => {
  const [notes, setNotes] = useState<MIDINote[]>([]);
  const value = useMIDINote(input, filter);
  useEffect(() => {
    if (!input) return;
    if (value?.on) setNotes(notes => [...notes, value]);
    else setNotes(notes => notes.filter((n) => n.note !== value.note)); // Note off, remove note from array (maybe check for channel?)
  }, [input, value]);
  return notes;
};

const MidiApp = () => {
  const midi = useMIDI();

  const notes = useMIDINotes(midi.inputs[0], {channel: 1})
  return (
    <div style={{display: "flex",  flexDirection: "column"}}>
      <Keyboard pressedKeys={notes?.map(note => note.note) ?? []}/>
    </div>
  );
}

export default App;
