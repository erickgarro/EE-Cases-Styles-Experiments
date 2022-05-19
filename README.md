# EExp2  

### a.k.a. EE-Cases-Styles-Experiments-Frontend

This software was created as part of the Experimentation and Evaluation course of the BSc in Informatics at the Università della Svizzera italiana (USI) in Lugano, Switzerland.

This study focuses on the following two letter case styles: **Camel case** contains a collection of words separated by an uppercase character instead of a space. The capitalization of the first letter per word starts from the second word (e.g., thisIsCamelCase). **Kebab case**  comprises a collection of lowercase words separated by a hyphen (e.g., this-is-kebab-case). As part of our hypotheses, we wanted to test the effect of color on the readability of both cases, which we called **Color case**.

We developed a web application to extend our capacity to reach potential participants and automate the collection of results. Architectonically, we divided it into backend and frontend to separate concerns and improve maintainability.

**Type of study:** Experiment
**Number of factors:** Multi-Factor Design
_Within Subject Design_

If you wish to replicate the experiment, feel free to clone the repository.

Below you can find a description of the frontend and the instructions to set it up to run the experiment.

You can also need the [source code for the backend](https://github.com/erickgarro/EE-Cases-Styles-Experiments-Backtend) on Github.

### Frontend

The user interface (UI) was designed as a single-page application in a minimalistic style to reduce distracting elements that could interfere with the participants’ concentration during the experiments.

It was structured in the following stages:

1. **Introduction and informed consent explaining:**

- The purpose of the project in one sentence What data is collected, and how it is used.
- Anonymization of data Explanation of the rights of the participant.
- Consent request and collection of age, gender, and academic background of the participant Identification of the university, the course, and the researchers

2. **Quick tutorial instructions:**
The tutorial instructions consist of four steps. These describe what will appear on the screen and its position, the specifications on what the participant should do, and how to interact with the UI.

3. **Tutorial:**
This section aims to familiarize the participant with the visual, conceptual, and mechanical logic of the experiment. There are three tasks: one with a camel case, one with a kebab case, and one with a color camel case. The application gives feedback on the result of the participant’s selection.

4. **Experiment preamble:**
A quick pause to allow the participants to get mentally ready to perform the actual experiment.

5. **Experiment:**
Twenty randomized tasks functionally identical to the ones in the tutorial.

6. **Done:**
Thank you and share Used to thank the participant for joining the study Buttons to share the experiment’s URL by copying the URI to the clipboard, WhatsApp, and email.

React version 18.1.0 was used to allow dynamic generation of all HTML content. A combination of state control and local storage data persistence enabled the application to anonymously "remember" the user, the stage in which the participant is, the questions, the responses, and other flow control variables.

The React components and functionality, in general, were designed considering further implementation of additional style cases. However, simple modifications solely on the frontend are needed.

#### Frontend: Inner workings

The UI checks if an ID is already stored in the browser’s local storage upon loading the website. If it does not find one, it will request the backend to generate a random unique ID.

If there was a previous ID after the new ID is received, the UI checks if a stringified JSON object contains the tasks (questions) assigned to the user. If it does not find it, proceeds to ask the server to generate one. In the same way, it looks for the tasks for the tutorial.

On every click of the continue button that appears asking the user to proceed, the stage is updated to the next one, and at the same time, and persists it in the local storage.

Everything described above allows the application to show the content.

### Getting the source code

**For local execution:**
Open a terminal on your computer and navigate to the folder where you want to download the code. Then, type the following command:

`git clone https://github.com/erickgarro/EE-Cases-Styles-Experiments-Frontend.git`

The following folders will be created
`EE-Cases-Styles-Experiments-Frontend`

**For cloud execution:**
Follow your repository provider’s instructions to create a fork within your account.

### Environmental variables

You run the backend and the frontend locally, or on the cloud. You need to set the following environmental variables to access the backend:

For local execution:
`REACT_APP_SERVER=http://localhost:3000`

For cloud execution:
`REACT_APP_SERVER=<backend-server-URL>[<:PORT NUMBER>]`

The enclosing `< >` denote a required value and `[ ]` refer to an optional value. These characters must be excluded.

In case you run it locally and need help setting the variables, follow the instructions below corresponding to your system. To set them for a cloud, skip this section:

- [Linux](https://www.alibabacloud.com/blog/a-guide-on-environment-variable-configuration-in-linux_59842)

- [macOS](https://support.apple.com/guide/terminal/use-environment-variables-apd382cc5fa-4f58-4449-b20a-41c53c006f8f/mac)

- [Windows](https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html)

### Frontend setup  

If do not have a [Netlify](https://netlify.com) account, proceed and [open a new one](https://app.netlify.com/signup).

Then follow the step-by-step guide: [Deploying on Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/).

You can setup your environmental variable during the setup of your site, or afterward by accessing your at
`https://app.netlify.com/sites/\<sitename\>/settings/deploys#environment`

Netlify will build and deploy the site for you. In the account dashboard, the deployment status will be displayed indicating if the site is up and running.

You can now share your site’s URL with your participants.  

**For local execution:**

1. Navigate to the frontend folder by typing:
   `cd EE-Cases-Styles-Experiments-Frontend`

2. To download and install all the dependencies execute:  
    `yarn install`

3. Make sure you run the backend server prior to running the frontend. To start this server execute:  
    `yarn start`  

When notified that port 3000 is in use, type "Y" to initialize another port, most likely it will be `3001`.

The server is now accessible at [http://localhost:3001](http://localhost:3001)

**Important:** If you use the same computer for several participants, we recommend that you access the frontend by creating a new private/incognito window for each one, as the app is designed to prevent repeated participation by storing data in your browser's local storage.

If Yarn is not installed on your computer, follow [this guide](https://classic.yarnpkg.com/lang/en/docs/install).

### Running the applications on the cloud

The application was optimized to run on remote servers, specifically [Digital Ocean](https://digitalocea.com/) for the backend.

You are be able to run it using other providers but you might need to modify the code accordingly.

To start, you need to fork both repositories. If you have a GitHub account follow [this guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo) if needed, otherwise, you need to clone the repositories and push them as new ones where you do your version control.

In case you do not have Git installed, follow [this guide](https://github.com/git-guides/install-git).

The application assumes two researches will receive every participant’s results individually. The backend code can be modified to add or remove recipients, or to fully stop emails from being sent.

**You can now share your site's URL with your participants.**

<font size="2"> **Authors:**</font>
<font size="2">Erick Garro Elizondo</font>
<font size="2">Cindy Guerrero Toro</font>
<font size="2">@USI, Lugano, Switzerland</font>
