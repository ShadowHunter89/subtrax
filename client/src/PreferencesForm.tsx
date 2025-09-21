import React, { useState } from "react";
import { Box, TextField, Button, Typography, Chip } from "@mui/material";

export interface PreferencesFormProps {
  onSubmit: (prefs: {
    preferredCategories: string[];
    budget: number;
    frequency: string;
  }) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onSubmit }) => {
  const [categories, setCategories] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);
  const [frequency, setFrequency] = useState<string>("");
  const [chips, setChips] = useState<string[]>([]);

  const handleAddCategory = () => {
    if (categories && !chips.includes(categories)) {
      setChips([...chips, categories]);
      setCategories("");
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    setChips(chips.filter(chip => chip !== chipToDelete));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ preferredCategories: chips, budget, frequency });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2} mb={2}>
      <Typography variant="subtitle1">Preferences</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={1}>
        <TextField
          label="Add Category"
          value={categories}
          onChange={e => setCategories(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? (handleAddCategory(), e.preventDefault()) : undefined}
        />
        <Button onClick={handleAddCategory} variant="outlined">Add</Button>
      </Box>
      <Box mb={1}>
        {chips.map(chip => (
          <Chip key={chip} label={chip} onDelete={() => handleDeleteChip(chip)} sx={{ mr: 1 }} />
        ))}
      </Box>
      <TextField
        label="Budget ($)"
        type="number"
        value={budget}
        onChange={e => setBudget(Number(e.target.value))}
        fullWidth
        sx={{ mb: 1 }}
      />
      <TextField
        label="Frequency (e.g. monthly)"
        value={frequency}
        onChange={e => setFrequency(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <Button type="submit" variant="contained">Apply Preferences</Button>
    </Box>
  );
};

export default PreferencesForm;
