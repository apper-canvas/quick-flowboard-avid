import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TaskCard from "@/components/molecules/TaskCard";
import Modal from "@/components/molecules/Modal";
import CreateTaskForm from "@/components/molecules/CreateTaskForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { userService } from "@/services/api/userService";
import { columnService } from "@/services/api/columnService";

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadBoardData();
    }
  }, [projectId]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [columnsData, tasksData, usersData] = await Promise.all([
        columnService.getByProject(parseInt(projectId)),
        taskService.getByProject(parseInt(projectId)),
        userService.getAll()
      ]);

      setColumns(columnsData);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load board data:", err);
      setError("Failed to load project board");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setShowCreateTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(selectedTask.Id, taskData);
      setTasks(prev => prev.map(t => t.Id === selectedTask.Id ? updatedTask : t));
      setShowTaskDetail(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      setShowTaskDetail(false);
      setSelectedTask(null);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setActiveColumnId(columnId);
  };

  const handleDragLeave = () => {
    setActiveColumnId("");
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setActiveColumnId("");
    
    if (!draggedTask || draggedTask.status === columnId) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = await taskService.update(draggedTask.Id, {
        ...draggedTask,
        status: columnId
      });
      
      setTasks(prev => prev.map(t => t.Id === draggedTask.Id ? updatedTask : t));
      toast.success("Task moved successfully");
    } catch (error) {
      console.error("Failed to move task:", error);
      toast.error("Failed to move task");
    } finally {
      setDraggedTask(null);
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId));
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  if (loading) {
    return <Loading type="kanban" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadBoardData} />;
  }

  if (!columns.length) {
    return (
      <Empty
        title="No board columns found"
        description="This project doesn't have any board columns set up yet."
        icon="Columns"
      />
    );
  }

  return (
    <>
      <div className="flex gap-6 p-6 min-h-[calc(100vh-4rem)] overflow-x-auto">
        {columns.map((column) => {
          const columnTasks = getTasksForColumn(column.id);
          const isActive = activeColumnId === column.id;
          
          return (
            <div
              key={column.id}
              className={`flex-shrink-0 w-80 ${isActive ? "drop-zone-active" : ""}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="bg-surface rounded-xl border p-4 h-fit glassmorphism">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="font-semibold text-gray-900">{column.name}</h3>
                    <Badge variant="default" size="sm">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setActiveColumnId(column.id);
                      setShowCreateTask(true);
                    }}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>

                <div className="space-y-3 min-h-[200px] group">
                  <AnimatePresence>
                    {columnTasks.map((task) => (
                      <motion.div
                        key={task.Id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        onDragEnd={() => setDraggedTask(null)}
                        className={draggedTask?.Id === task.Id ? "opacity-50" : ""}
                      >
                        <TaskCard
                          task={task}
                          user={getUserById(task.assigneeId)}
                          onEdit={(task) => {
                            setSelectedTask(task);
                            setShowTaskDetail(true);
                          }}
                          isDragging={draggedTask?.Id === task.Id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {columnTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ApperIcon name="Plus" size={24} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">No tasks yet</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveColumnId(column.id);
                          setShowCreateTask(true);
                        }}
                        className="mt-2 text-gray-500 hover:text-primary"
                      >
                        Add task
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTask}
        onClose={() => {
          setShowCreateTask(false);
          setActiveColumnId("");
        }}
        title="Create New Task"
        size="lg"
      >
        <CreateTaskForm
          projectId={projectId}
          columnId={activeColumnId}
          onSubmit={handleCreateTask}
          onCancel={() => {
            setShowCreateTask(false);
            setActiveColumnId("");
          }}
        />
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showTaskDetail}
        onClose={() => {
          setShowTaskDetail(false);
          setSelectedTask(null);
        }}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <>
            <CreateTaskForm
              projectId={projectId}
              initialData={selectedTask}
              onSubmit={handleUpdateTask}
              onCancel={() => {
                setShowTaskDetail(false);
                setSelectedTask(null);
              }}
            />
            <div className="mt-6 pt-6 border-t">
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this task?")) {
                    handleDeleteTask(selectedTask.Id);
                  }
                }}
                className="gap-2"
              >
                <ApperIcon name="Trash2" size={16} />
                Delete Task
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default KanbanBoard;