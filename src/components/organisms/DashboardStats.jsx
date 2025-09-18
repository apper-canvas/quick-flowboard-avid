import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { userService } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Projects from "@/components/pages/Projects";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    activeProjects: 0,
    teamMembers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projects, users] = await Promise.all([
        projectService.getAll(),
        userService.getAll()
      ]);

      let totalTasks = 0;
      let completedTasks = 0;
      let overdueTasks = 0;
      const projectProgress = [];
      const recentTasks = [];

      // Calculate project statistics
      for (const project of projects) {
        const tasks = await taskService.getByProject(project.Id);
        const completed = tasks.filter(task => task.status === "done").length;
        const overdue = tasks.filter(task => 
          task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done"
        ).length;
        
        totalTasks += tasks.length;
        completedTasks += completed;
        overdueTasks += overdue;

        projectProgress.push({
          project: project.name,
          progress: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
          totalTasks: tasks.length,
          completedTasks: completed
        });

        // Add recent tasks
        const recent = tasks
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map(task => ({
            ...task,
            projectName: project.name,
            assignee: users.find(u => u.Id === task.assigneeId)
          }));
        
        recentTasks.push(...recent);
      }

      // Sort and limit recent activity
      const sortedRecentTasks = recentTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

      // Sort projects by progress
      const sortedProjects = projectProgress
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 5);

      setStats({
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        overdueTasks,
        activeProjects: projects.filter(p => p.status === "active").length,
        teamMembers: users.length
      });

      setRecentActivity(sortedRecentTasks);
      setTopProjects(sortedProjects);

      // Prepare chart data
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const inProgressTasks = totalTasks - completedTasks - overdueTasks;

      setChartData({
        donut: {
          series: [completedTasks, inProgressTasks, overdueTasks],
          options: {
            chart: { type: "donut", height: 280 },
            labels: ["Completed", "In Progress", "Overdue"],
            colors: ["#10b981", "#2563eb", "#ef4444"],
            legend: { position: "bottom" },
            plotOptions: {
              pie: {
                donut: {
                  size: "65%",
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: "Total Tasks",
                      fontSize: "14px",
                      color: "#6b7280"
                    }
                  }
                }
              }
            }
          }
        },
        bar: {
          series: [{
            name: "Progress",
            data: sortedProjects.map(p => p.progress)
          }],
          options: {
            chart: { type: "bar", height: 300 },
            colors: ["#2563eb"],
            xaxis: {
              categories: sortedProjects.map(p => p.project)
            },
            yaxis: {
              max: 100,
              labels: {
                formatter: (val) => `${val}%`
              }
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: false
              }
            }
          }
        }
      });

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="cards" count={8} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: "FolderOpen",
      color: "primary",
      change: "+2 this month"
    },
    {
      title: "Active Projects", 
      value: stats.activeProjects,
      icon: "Play",
      color: "success",
      change: "Currently running"
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "CheckSquare",
      color: "primary",
      change: `${stats.completedTasks} completed`
    },
    {
      title: "Overdue Tasks",
      value: stats.overdueTasks,
      icon: "AlertTriangle",
      color: "error",
      change: "Need attention"
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: "Users",
      color: "primary",
      change: "Active users"
    },
    {
      title: "Completion Rate",
      value: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`,
      icon: "TrendingUp",
      color: "success",
      change: "Overall progress"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-surface border rounded-xl p-6 glassmorphism task-card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary">{stat.title}</p>
                <p className="text-3xl font-bold gradient-text mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={24} className={`text-${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="lg:col-span-1 bg-surface border rounded-xl p-6 glassmorphism"
        >
          <h3 className="text-lg font-semibold gradient-text mb-4">Task Distribution</h3>
          {chartData.donut && (
            <Chart
              options={chartData.donut.options}
              series={chartData.donut.series}
              type="donut"
              height={280}
            />
          )}
        </motion.div>

{/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="lg:col-span-2 bg-surface border rounded-xl p-6 glassmorphism"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold gradient-text">Recent Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/notifications'}
              className="text-primary hover:text-primary/80"
            >
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((task, index) => (
              <div key={`${task.Id}-${index}`} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ApperIcon 
                      name={task.priority === "high" ? "AlertTriangle" : "CheckCircle2"} 
                      size={14} 
                      className="text-primary"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" size="sm">{task.projectName}</Badge>
                    <Badge 
                      variant={
                        task.priority === "high" ? "error" :
                        task.priority === "medium" ? "warning" : "success"
                      } 
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {task.assignee && (
                  <Avatar 
                    src={task.assignee.avatar} 
                    name={task.assignee.name} 
                    size="sm" 
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="bg-surface border rounded-xl p-6 glassmorphism"
      >
        <h3 className="text-lg font-semibold gradient-text mb-4">Top Projects by Progress</h3>
        {chartData.bar && (
          <Chart
            options={chartData.bar.options}
            series={chartData.bar.series}
            type="bar"
            height={300}
          />
        )}
      </motion.div>
    </div>
  );
};

export default DashboardStats;