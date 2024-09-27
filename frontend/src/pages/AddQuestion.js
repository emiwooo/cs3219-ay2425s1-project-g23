import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import Select from 'react-select';
import './AddQuestion.css';

const AddQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState('easy'); // Default to 'easy'
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/categories`);
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, [baseUrl]);

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions.map((option) => option.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!title || !description || selectedCategories.length === 0) {
      setError('Please fill in all required fields and select at least one category.');
      return;
    }

    // Map selected category names to category IDs for submission
    const selectedCategoryIds = selectedCategories.map((name) => {
      const category = categories.find((cat) => cat.name === name);
      return category ? category.id : null;
    }).filter((id) => id); // Filter out null/undefined IDs

    const newQuestion = {
      title,
      description,
      complexity,
      categories: selectedCategoryIds, // Use category IDs for submission
    };

    console.log('Submitting new question:', newQuestion); // Log the new question object

    try {
      const response = await fetch(`${baseUrl}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      console.log('Response status:', response.status); // Log response status
      console.log('Response statusText:', response.statusText); // Log response statusText

      if (!response.ok) {
        const errorText = await response.text(); // Get error message from response
        console.error('Response error text:', errorText); // Log error text
        throw new Error(`Failed to add question: ${response.status} ${response.statusText}`);
      }

      const result = await response.json(); // Log the response JSON from backend
      console.log('Result from server:', result); // Check what the server returned

      // Display a success message and clear the form
      alert('Question added successfully!');
      setTitle('');
      setDescription('');
      setComplexity('easy');
      setSelectedCategories([]);
    } catch (error) {
      console.error('Error adding question:', error);
      setError('Failed to add question. Please check the console for more details.');
    }
  };

  return (
    <Container className="add-question-page">
      <Row>
        <Col>
          <h2>Add New Question</h2>
          {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="complexity" className="mt-3">
              <Form.Label>Complexity</Form.Label>
              <Form.Control
                as="select"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="categories" className="mt-3">
              <Form.Label>Categories</Form.Label>
              <Select
                isMulti
                options={categories.map((category) => ({
                  value: category.name,
                  label: category.name,
                }))}
                value={selectedCategories.map((name) => ({
                  value: name,
                  label: name,
                }))}
                onChange={handleCategoryChange}
                placeholder="Select categories..."
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add Question
            </Button>
            <Button
              variant="secondary"
              className="mt-3 ms-2"
              onClick={() => navigate(-1)} // Navigate back to the previous page
            >
              Cancel
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddQuestion;