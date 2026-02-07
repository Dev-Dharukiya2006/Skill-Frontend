import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const RoadmapContext = createContext();

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};

export const RoadmapProvider = ({ children }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchRoadmap();
    }
  }, [isAuthenticated]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/roadmaps');
      setRoadmap(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch roadmap:', error);
      }
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentWeek = async () => {
    try {
      const response = await axios.get('/api/roadmaps/current-week');
      setCurrentWeek(response.data.data);
    } catch (error) {
      console.error('Failed to fetch current week:', error);
    }
  };

  const createRoadmap = async (targetRole) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/roadmaps', { targetRole });
      setRoadmap(response.data.data);
      toast.success('Roadmap generated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create roadmap';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateTaskCompletion = async (weekId, taskId, completed) => {
    try {
      const response = await axios.put(
        `/api/roadmaps/tasks/${weekId}/${taskId}`,
        { completed }
      );
      setRoadmap(response.data.data);
      toast.success(completed ? 'Task completed!' : 'Task marked incomplete');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteRoadmap = async () => {
    try {
      await axios.delete('/api/roadmaps');
      setRoadmap(null);
      setCurrentWeek(null);
      toast.success('Roadmap deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete roadmap';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    roadmap,
    currentWeek,
    loading,
    fetchRoadmap,
    fetchCurrentWeek,
    createRoadmap,
    updateTaskCompletion,
    deleteRoadmap
  };

  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
};
