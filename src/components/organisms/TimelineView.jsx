import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { userService } from "@/services/api/userService";

const TimelineView = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    if (projectId) {
      loadTimelineData();
    }
  }, [projectId]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, usersData] = await Promise.all([
        taskService.getByProject(parseInt(projectId)),
        userService.getAll()
      ]);

      // Filter tasks that have due dates
      const tasksWithDates = tasksData.filter(task => task.dueDate);
      setTasks(tasksWithDates);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load timeline data:", err);
      setError("Failed to load timeline");
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId));
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "done": return "success";
      case "inprogress": return "primary";
      case "todo": return "default";
      default: return "default";
    }
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return format(taskDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    });
  };

  if (loading) {
    return <Loading type="timeline" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTimelineData} />;
  }

  if (!tasks.length) {
    return (
      <Empty
        title="No scheduled tasks"
        description="Tasks with due dates will appear here in a timeline view."
        icon="Calendar"
      />
    );
  }

  return (
    <div className="p-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold gradient-text">Project Timeline</h2>
          <Badge variant="primary" size="sm">
            {tasks.length} tasks
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <span className="px-4 py-2 text-sm font-medium">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="bg-surface rounded-xl border glassmorphism overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b bg-gray-50">
          <div className="p-4 text-sm font-medium text-gray-700 border-r">
            Task
          </div>
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`p-4 text-center border-r last:border-r-0 ${
                format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-700"
              }`}
            >
              <div className="text-xs text-gray-500">{format(day, "EEE")}</div>
              <div className="text-sm font-medium">{format(day, "d")}</div>
            </div>
          ))}
        </div>

        {/* Timeline Rows */}
        <div className="divide-y">
          {tasks.map((task, taskIndex) => {
            const user = getUserById(task.assigneeId);
            const taskDate = new Date(task.dueDate);
            const isOverdue = taskDate < new Date() && task.status !== "done";
            
            return (
              <div key={task.Id} className="grid grid-cols-8 hover:bg-gray-50 transition-colors">
                {/* Task Info */}
                <div className="p-4 border-r">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={getPriorityColor(task.priority)} 
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                        <Badge 
                          variant={getStatusColor(task.status)} 
                          size="sm"
                        >
                          {task.status}
                        </Badge>
                      </div>
                      {user && (
                        <div className="flex items-center gap-1 mt-2">
                          <Avatar 
                            src={user.avatar} 
                            name={user.name} 
                            size="sm" 
                          />
                          <span className="text-xs text-gray-600">
                            {user.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Days */}
                {weekDays.map((day, dayIndex) => {
                  const isTaskDay = format(taskDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`p-4 border-r last:border-r-0 relative ${
                        format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                          ? "bg-gray-50"
                          : ""
                      }`}
                    >
                      {isTaskDay && (
                        <div 
                          className={`w-full h-2 rounded-full ${
                            isOverdue 
                              ? "bg-gradient-to-r from-error to-error/80" 
                              : task.status === "done"
                              ? "bg-gradient-to-r from-success to-success/80"
                              : "bg-gradient-to-r from-primary to-primary/80"
                          }`}
                          title={`${task.title} - ${format(taskDate, "MMM d, yyyy")}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full"></div>
          <span className="text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-gradient-to-r from-success to-success/80 rounded-full"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-gradient-to-r from-error to-error/80 rounded-full"></div>
          <span className="text-gray-600">Overdue</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;