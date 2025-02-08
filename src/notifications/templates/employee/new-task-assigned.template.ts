import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { TaskInterface } from 'src/task-manager/interfaces/task.interface';
import { UserInterface } from 'src/users/interfaces/user.interface';

export const NewTaskAssignedEmailTemplate = (payload: {
  settings: SettingsInterface;
  employee: UserInterface;
  task: TaskInterface;
}) => {
  const url = `${payload.settings.appURL}/tasks/${payload.task._id.toString()}`;
  const css = '';
  const template = `
  <p><b>  Dear ${payload.employee.name},</b></p>
  <p>
  A new task has been assigned to you.
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
  Thank you for your attention to this matter. We look forward to receiving the task update.<br>
  </p>
  <p>
  Best regards, <br>
  ${payload.settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
