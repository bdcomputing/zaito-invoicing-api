import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { appName, logo } from 'src/shared/constants/constants';

export const mailHeaderTemplate = (
  data: { title: string },
  settings: SettingsInterface,
) => {
  const template = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
    <link href="https://db.onlinewebfonts.com/c/076abc8ba1bb38a0713dec3b63b880e4?family=Trip+Sans" rel="stylesheet" type="text/css"/>
  </head>
  <body style="padding: 0; margin: 0; box-sizing: border-box; ">
    <main
      style="
        font-family: "Trip Sans", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
          sans-serif;
        font-weight: 400;
        line-height: normal;
      "
    >
      <div
        class="header"
        style="
          height: max-content;
          background-color: #fff;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div
          class="left"
          style="
            display: flex;
            align-items: center;
            justify-content: flex-start;
          "
          height="120px"
        >
          <img src="${
            settings.branding.logo ? settings.branding.logo : `${logo}`
          }" alt="${appName} Logo" style="width: 120px; object-fit: contain;" />
        </div>
      </div>
      <div
        class="body"
        style="padding: 10px 20px; background-color: #fff;"
      >
    `;

  return template;
};
