'use client'
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// 초기 데이터
const initialTasks = {
  tasks: {
    'task-1': { id: 'task-1', content: '내용 1' },
    'task-2': { id: 'task-2', content: '내용 2' },
    'task-3': { id: 'task-3', content: '내용 3' },
    'task-4': { id: 'task-4', content: '내용 4' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '할 일',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: '진행 중',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: '완료',
      taskIds: [],
    },
  },
  // 컬럼 순서
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const KanbanBoard = () => {
  const [state, setState] = useState(initialTasks);
  const [taskCounter, setTaskCounter] = useState(5); // 새로운 태스크 ID를 위한 카운터

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    // 다른 컬럼으로 이동하는 로직
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  const addTask = (columnId) => {
    const newTaskId = `task-${taskCounter}`;
    const newTask = {
      id: newTaskId,
      content: `새로운 내용 ${taskCounter}`,
    };

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          taskIds: [...state.columns[columnId].taskIds, newTaskId],
        },
      },
    };

    setState(newState);
    setTaskCounter(taskCounter + 1);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'center', height: '90vh', padding: '2rem' }}>
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

          return (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? '#cfbafc' : '#f7f7f7',
                    padding: '10px',
                    width: 350,
                    minHeight: 500,
                    marginRight: 8,
                    borderRadius: '8px',
                  }}
                >
                  <div style={{
                    background: '#fff', // 타이틀 박스 배경색
                    padding: '10px',
                    borderRadius: '4px', // 타이틀 박스 라운드 코너
                    marginBottom: '20px', // 타이틀과 컨텐츠 사이의 여백
                    boxShadow: '0px 1px 2px rgba(0,0,0,0.1)', // 타이틀 박스에 그림자 추가
                  }}>
                    <h3 style={{ margin: 0 }}>{column.title}</h3>
                  </div>
                  {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: '15px',
                              margin: '0 0 8px 0',
                              minHeight: '70px', // 높이 조정으로 설명 텍스트를 위한 공간 확보
                              backgroundColor: snapshot.isDragging ? 'lightgreen' : '#ffffff',
                              color: 'black',
                              borderRadius: '4px',
                              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                              display: 'flex',
                              flexDirection: 'column', // 내용을 열 방향으로 쌓음
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span>{task.content}</span>
                              <div>
                                <IconButton size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </div>
                            </div>
                            <div style={{ color: '#d2d2d2', fontSize: '0.875rem' }}> 
                              {task.desc || '설명 없음'} 
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <Button startIcon={<AddIcon />} onClick={() => addTask(column.id)}>
                    새로운 일 추가
                  </Button>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
