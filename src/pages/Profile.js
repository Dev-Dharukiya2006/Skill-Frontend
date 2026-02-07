import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Target, Clock, Award, Plus, X, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { useNavigate } from 'react-router-dom';

const jobRoles = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Android Developer'
];

const skillLevels = ['beginner', 'intermediate', 'advanced'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { roadmap, createRoadmap, deleteRoadmap } = useRoadmap();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experienceLevel: user?.experienceLevel || 'beginner',
    weeklyTimeAvailability: user?.weeklyTimeAvailability || 10
  });

  const [newSkill, setNewSkill] = useState({ name: '', level: 'beginner' });
  const [skills, setSkills] = useState(user?.skills || []);
  const [generating, setGenerating] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill }]);
      setNewSkill({ name: '', level: 'beginner' });
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('/api/users/profile', {
        ...formData,
        skills
      });
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!formData.targetRole) {
      toast.error('Please select a target role first');
      return;
    }

    if (skills.length === 0) {
      toast.error('Please add at least one current skill');
      return;
    }

    setGenerating(true);
    
    // First save profile
    await handleSaveProfile();
    
    // Then generate roadmap
    const result = await createRoadmap(formData.targetRole);
    
    setGenerating(false);

    if (result.success) {
      navigate('/roadmap');
    }
  };

  const handleDeleteRoadmap = async () => {
    if (window.confirm('Are you sure you want to delete your current roadmap?')) {
      await deleteRoadmap();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your profile and generate your learning roadmap
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Personal Information</span>
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary text-sm"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!editing}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Target Role</label>
            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleInputChange}
              disabled={!editing}
              className="input-field"
            >
              <option value="">Select a role</option>
              {jobRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                disabled={!editing}
                className="input-field"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Weekly Time (hours)</label>
              <input
                type="number"
                name="weeklyTimeAvailability"
                value={formData.weeklyTimeAvailability}
                onChange={handleInputChange}
                disabled={!editing}
                min="1"
                max="168"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {editing && (
          <button
            onClick={handleSaveProfile}
            className="btn-primary mt-6"
          >
            Save Changes
          </button>
        )}
      </motion.div>

      {/* Skills Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-bold flex items-center space-x-2 mb-6">
          <Award className="w-6 h-6" />
          <span>Current Skills</span>
        </h2>

        {/* Skill List */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-lg flex items-center space-x-2"
            >
              <span className="font-medium">{skill.name}</span>
              <span className="text-xs opacity-70">({skill.level})</span>
              {editing && (
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="hover:text-red-900 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Skill */}
        {editing && (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Skill name"
              className="input-field flex-1"
            />
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              className="input-field w-full sm:w-40"
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddSkill}
              className="btn-secondary flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Roadmap Actions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-bold flex items-center space-x-2 mb-6">
          <Target className="w-6 h-6" />
          <span>Learning Roadmap</span>
        </h2>

        {roadmap ? (
          <div>
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800 rounded-lg mb-4">
              <p className="text-green-700 dark:text-green-400 font-medium">
                You have an active roadmap for {roadmap.targetRole}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                {roadmap.progress}% complete • {roadmap.totalDuration} weeks total
              </p>
            </div>
            <button
              onClick={handleDeleteRoadmap}
              className="btn-secondary flex items-center space-x-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Roadmap</span>
            </button>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Generate a personalized learning roadmap based on your current skills and target role.
            </p>
            <button
              onClick={handleGenerateRoadmap}
              disabled={generating || !formData.targetRole || skills.length === 0}
              className="btn-primary flex items-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
            {(!formData.targetRole || skills.length === 0) && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Please set a target role and add your current skills first
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
