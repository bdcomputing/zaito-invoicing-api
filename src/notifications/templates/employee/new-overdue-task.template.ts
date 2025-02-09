import { Settings } from 'src/settings/interfaces/settings.interface';
import { Task } from 'src/task-manager/interfaces/task.interface';
import { User } from 'src/users/interfaces/user.interface';

export const NewOverdueTaskEmailTemplate = (payload: {
  settings: Settings;
  employee: User;
  task: Task;
}) => {
  const url = `${payload.settings.appURL}/tasks/${payload.task._id.toString()}`;
  const css = '';
  const template = `
  <p><b>  Dear ${payload.employee.name},</b></p>
  <p>
  A new task deadline has passed.
  </p>
  <b>Task Description:</b> <br>
  <blockquote >
    <p>${payload.task.description}</p>
  </blockquote>
  <p>
  <p style="margin-top: 30px; margin-bottom: 30px">
  <a
    href="${url}"
    target="_blank"
    style="
      padding: 8px 20px;
      background-color: #27963a;
      text-decoration: none;
      color: #060f3d;
      font-size: 14px;
      border-radius: 5px;
    "
  >
    View Task
  </a>
</p>
  Thank you for your attention to this matter. Kindly complete the task as soon as possible.<br>
  </p>
  <p>
  Best regards, <br>
  ${payload.settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
