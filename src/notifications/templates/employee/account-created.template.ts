/* eslint-disable prettier/prettier */
import { UserInterface } from 'src/users/interfaces/user.interface';
import { SettingsInterface } from 'src/settings/interfaces/settings.interface';

export const EmployeeAccountCreatedEmailTemplate = (
  settings: SettingsInterface,
  employee: UserInterface,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h4><b>  Dear ${employee.name},</b></h4><br>
  <p>
  Welcome to the bdcomputinglimited family! We are thrilled to have you on board as part of our dynamic team, and we're looking forward to embarking on this exciting journey together. 
  </p>
  <br>

  <b>About bdcomputinglimited:</b> <br>
  <p>
  At bdcomputinglimited, we are committed to revolutionizing the insurance industry by providing innovative solutions that empower both our clients and our team members. Our state-of-the-art app is designed to streamline processes, enhance user experience, and ultimately make a positive impact on the lives of those we serve.
  </p>
  <br>
  <b>Your Onboarding Journey:</b> <br>
 <p>We understand that starting a new role can be both exhilarating and a bit overwhelming. Rest assured, our onboarding process is crafted to ensure a smooth transition and to familiarize you with all aspects of bdcomputinglimited.</p> 
  <ul>
  <li>
  <p>
  <b>Onboarding Schedule:</b> Attached to this email is your personalized onboarding schedule, outlining the key activities and training sessions planned for your first week. Please review it carefully, and don't hesitate to reach out if you have any questions or concerns.
  </p>
  </li>
  <li>
  <p>
  <b>Training and Support:</b> Our dedicated onboarding team is here to guide you through the ins and outs of the bdcomputinglimited app. You'll have access to comprehensive training materials, live demos, and support channels to ensure you feel confident and equipped to excel in your new role.
  </p>
  </li>
  </ul>
  <b>Get Ready for a Great Start:</b> <br>
  <p>
  As you prepare for your first day, here are a few tips to get the most out of your onboarding experience: <br>
  </p>
  <ol>
  <li>
  <p>
  <b>Connect with Your Team:</b> Reach out to your team members and introduce yourself. We're a friendly bunch, and we're excited to welcome you!
  </p>
  </li>
  <li>
  <p>
  <b>Explore the App:</b>
  Take some time to explore the bdcomputinglimited app on your own. Familiarize yourself with its features and functionalities. If you have any questions, jot them down—we're here to help.
  </p>
  </li>
  <li><b>Open Communication:</b>
  Communication is key at bdcomputinglimited. Don't hesitate to ask questions, share your ideas, and engage with your colleagues. Your insights are valuable to us.
  </li>
  </ol>
  <p>
  Once again, welcome to bdcomputinglimited! We believe that your skills and talents will contribute to our collective success, and we can't wait to see all the great things we'll achieve together. <br>
  </p>
  <p>
  If you have any pre-onboarding questions or concerns, feel free to reach out to Brian at brian@bdcomputinglimited.co.ke. <br>
  </p>
  <p>
  Get ready for an incredible journey with bdcomputinglimited! <br>
  </p>
  <p>
  Best regards, <br>
  bdcomputinglimited Team
  </p>
  </div>
  `;

  return { template, css };
};
