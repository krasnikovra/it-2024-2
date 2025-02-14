import { el } from "../node_modules/redom/dist/redom.es";
import mountWithHeader from "./utils/mountWithHeader.js";
import FormHeader from "./components/forms/FormHeader.jsx";
import Task from "./components/task/Task.jsx";

const testTasksData = [
  {
    name: "Первая задача",
    deadline: "01.01.2025"
  },
  {
    name: "Вторая задача с очень длинным названием",
    deadline: "30.03.2026"
  },
  {
    name: "Третья задача",
    deadline: "20.02.2025"
  },
]

const Tasks =
  <div>
    <div class="mb-3">
      <FormHeader text="Список задач"/>
    </div>
    <div class="tasks-list-container">
      {testTasksData.map((taskData, index) => 
        <Task name={taskData.name} deadline={taskData.deadline} key={`task-${index}`}/>
      )}
    </div>
  </div>;

mountWithHeader(
    document.getElementById("root"),
    Tasks
);
