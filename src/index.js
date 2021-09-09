const express = require('express');
const departmentRoute = require('./routes/department');

const app = express();
const port = process.env.port || 8080;

app.use(express.json());
app.use("/department", departmentRoute)

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

