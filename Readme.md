Instructions Guide:

Navigate to the code folder and open the terminal.

Install the dependencies and run the frontend by running the following command: yarn && yarn dev

Start the backend Docker container by running the following command: docker-compose -f docker-compose.yml up -d

Open the application in your browser by visiting http://localhost:3000.

Sign in to the application using the details.

Submit the form with random details by visiting http://localhost:3000/form.

To export data to your spreadsheets, follow these steps:

Go to the "Responses" section.
Click on "Export data".
Enter your spreadsheets ID and click on "Export".
To visualize data, open Kibana in your browser by visiting http://localhost:5601.
In the Search box, type "Index Pattern" and click on "Create Index Pattern".
Enter "form_saved" in the Name field and click on "Create Index Pattern".
To stress test or benchmark the application, execute the Python script by running the following command: python script.py

To check for ingested data, go to "Analytics" and click on "Discover".