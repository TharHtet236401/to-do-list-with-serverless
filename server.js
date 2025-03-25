import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import expressEjsLayouts from 'express-ejs-layouts';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!API_URL) {
    throw new Error('API_URL is not defined in environment variables');
}

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressEjsLayouts);
app.set('layout', 'layout');

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend

// Get all tasks and render the page
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const tasks = Array.isArray(response.data) ? response.data : 
                     (response.data.tasks || response.data.Items || []);
        res.render('index', { 
            title: 'Task Manager',
            tasks: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error.response?.data || error.message);
        res.render('index', { 
            title: 'Task Manager',
            tasks: [],
            error: 'Failed to fetch tasks'
        });
    }
});

// API endpoints
app.get("/tasks", async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const tasks = Array.isArray(response.data) ? response.data : 
                     (response.data.tasks || response.data.Items || []);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.response?.data || error.message);
        res.status(500).json({ 
            message: 'Failed to fetch tasks',
            error: error.message 
        });
    }
});

// Create a new task
app.post("/tasks", async (req, res) => {
    try {
        const { name } = req.body;
        const response = await axios.post(API_URL, { name });
        res.json(response.data);
    } catch (error) {
        console.error('Error creating task:', error.response?.data || error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update a task
app.put("/tasks", async (req, res) => {
    try {
        const { id, name, completed } = req.body;
        const response = await axios.put(API_URL, { id, name, completed });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
app.delete("/tasks", async (req, res) => {
    try {
        const { id } = req.body;
        const response = await axios.delete(API_URL, { data: { id } });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
