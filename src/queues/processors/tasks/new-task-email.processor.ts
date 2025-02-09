import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { QueuesEnum } from '../../enums/queues.enum';
import { Logger } from '@nestjs/common';
import { Task } from 'src/task-manager/interfaces/task.interface';
import { User } from 'src/users/interfaces/user.interface';
import { Job } from 'bull';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { SettingsService } from 'src/settings/services/settings.service';
import { SendEmail } from 'src/notifications/interfaces/email.interface';
import { Settings } from 'src/settings/interfaces/settings.interface';
import { NewTaskAssignedEmailTemplate } from 'src/notifications/templates/employee/new-task-assigned.template';
import {
  NotificationChannelsEnum,
  NotificationTypeEnum,
} from 'src/notifications/enums/notification.enum';
import { getNotificationSubscriptionStatus } from 'src/notifications/helpers/get-notification-subscription-index.helper';

@Processor(QueuesEnum.SEND_EMAIL_ON_TASK_CREATED)
export class NewTaskCreatedEmailProcessor {
  private readonly logger = new Logger(NewTaskCreatedEmailProcessor.name);
  /**
   * Creates an instance of NewTaskCreatedEmailProcessor.
   * @param {SettingsService} settingsService
   * @param {NotificationsService} notificationsService
   * @memberof NewTaskCreatedEmailProcessor
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Process()
  async sendEmail(job: Job) {
    const data: { task: Task; user: User } = job.data;
    const { user, task } = data;
    // check of the user has subscribed
    const hasSubscribed = getNotificationSubscriptionStatus({
      user,
      channel: NotificationChannelsEnum.EMAIL,
      notificationType: NotificationTypeEnum.TASKS,
    });

    if (hasSubscribed) {
      // send the email
      const settings: Settings = (await this.settingsService.getSettings())
        .data;
      const mail: SendEmail = {
        html: NewTaskAssignedEmailTemplate({ settings, employee: user, task }),
        recipient: user.email,
        textAlignment: 'left',
        hasHero: false,
        subject: `New Task assigned`,
      };
      this.notificationsService.dispatchEmail(mail);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Sending email  to ${job.data.user.email}`);
  }
  // Listeners
  @OnQueueCompleted()
  async onCompleted(job: Job) {
    this.logger.log(`Email sent to ${job.data.user.email}`);
  }
}
