import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Award,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { user } = useAuth();
  const { roadmap, currentWeek, fetchRoadmap, fetchCurrentWeek } = useRoadmap();

  useEffect(() => {
    if (user) {
      fetchRoadmap();
      if (roadmap) {
        fetchCurrentWeek();
      }
    }
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return 'from-green-500 to-emerald-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-orange-600';
  };

  const progressData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [roadmap?.completedTasks || 0, (roadmap?.totalTasks || 1) - (roadmap?.completedTasks || 0)],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(148, 163, 184, 0.3)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(148, 163, 184, 0.5)'
      ],
      borderWidth: 2
    }]
  };

  const phaseProgressData = roadmap ? {
    labels: roadmap.phases.map(p => p.name),
    datasets: [{
      label: 'Progress (%)',
      data: roadmap.phases.map(p => p.progress),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 2,
      borderRadius: 8
    }]
  } : null;

  if (!roadmap) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Let's create your personalized learning roadmap
              </p>
            </div>

            <Link to="/profile" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Your Roadmap</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your progress and stay on target
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Job Readiness Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Job Readiness
            </h3>
            <Award className="w-5 h-5 text-red-500" />
          </div>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(roadmap.jobReadinessScore)}`}>
            {roadmap.jobReadinessScore}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getScoreBgColor(roadmap.jobReadinessScore)}`}
              style={{ width: `${roadmap.jobReadinessScore}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Overall Progress
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-4xl font-bold mb-2">
            {roadmap.progress}%
          </div>
          <p className="text-sm text-slate-500">
            {roadmap.completedTasks} of {roadmap.totalTasks} tasks completed
          </p>
        </motion.div>

        {/* Current Week */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Current Week
            </h3>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-4xl font-bold mb-2">
            Week {currentWeek?.currentWeek || 1}
          </div>
          <p className="text-sm text-slate-500">
            of {roadmap.totalDuration} weeks
          </p>
        </motion.div>

        {/* Consistency Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Consistency
            </h3>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-4xl font-bold mb-2">
            {roadmap.consistencyScore}%
          </div>
          <p className="text-sm text-slate-500">
            Keep up the good work!
          </p>
        </motion.div>
      </div>

      {/* Charts and Current Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-bold mb-4">Task Completion</h3>
          <div className="w-full max-w-xs mx-auto">
            <Doughnut 
              data={progressData}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Phase Progress */}
        {phaseProgressData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h3 className="text-lg font-bold mb-4">Phase Progress</h3>
            <Bar
              data={phaseProgressData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Current Week Tasks */}
      {currentWeek?.weeklyGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">This Week's Goals</h3>
            <Link to="/roadmap" className="text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">{currentWeek.weeklyGoal.phase}</h4>
            <div className="flex flex-wrap gap-2">
              {currentWeek.weeklyGoal.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {currentWeek.weeklyGoal.tasks.slice(0, 3).map((task, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  task.completed
                    ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle2
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      task.completed ? 'text-green-600' : 'text-slate-300'
                    }`}
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold mb-1">{task.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {task.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
