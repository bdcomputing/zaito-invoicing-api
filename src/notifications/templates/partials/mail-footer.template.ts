import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { appName } from 'src/shared/constants/constants';

export const mailFooterTemplate = (settings: SettingsInterface) => {
  const currentYear = new Date().getFullYear();
  return `
  </div>
  <div
    class="footer"
    style="
      height: fit-content;
      background-color: #f5f2f0;
      padding: 20px 20px;
      color: #011847;
    "
  > 
    <div class="row">
        <p
          style="
            font-size: 14px;
            padding: 0;
            margin: 0 0 14px;
          "
        >
          &copy; ${currentYear}
          <a
            href="${settings.appURL}"
            style="text-decoration: none; color: #060f3d"
          >
          ${appName}. All Rights Reserved
          </a>
        </p>
        <p
          style="
            font-size: 12px;
            padding: 0;
            margin: 0;
            margin-bottom: 12px;
          "
        >
          To ensure delivery to your inbox, please add
          <a href="mailto:${settings.mail.auth.user}" style="color: #060f3d"
            >${settings.mail.auth.user}</a
          >
          to your address book
        </p>
        <p
          style="
            font-size: 11px;
            padding: 0;
            margin: 0;
            margin-bottom: 12px;
          "
        >
          You can
          <a
            href="${settings.appURL}"
            target="_blank"
            rel="noopener noreferrer"
            style="color: #060f3d"
            >unsubscribe</a
          >
          here and stop receiving these alert emails
        </p>
        <p style="font-size:11px; text-wrap: initial">
          This email cannot receive replies. This email is confidential and intended for the addressee only. Please delete if that is not you.
          This email message and any file(s) transmitted with it is intended solely for the individual or entity to whom it is addressed and may 
          contain confidential and/or legally privileged information which confidentiality and/or privilege is not lost or waived by reason of mistaken transmission. 
          If you have received this message by error you are not authorized to view disseminate distribute or copy the message without the written consent of  ${settings.general.company} 
          and are requested to contact the sender by telephone or e-mail and destroy the original. Although  ${settings.general.company} takes all reasonable precautions to ensure that this 
          message and any file transmitted with it is virus free,  ${settings.general.company} accepts no liability for any damage that may be caused by any virus transmitted by this email.
          </p>
      </div>
    </div>
  </div>
</main>
</body>
</html>
`;
};
