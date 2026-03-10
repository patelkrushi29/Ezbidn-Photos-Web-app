import userApis from './user'

export default app => {
    app.get("/", (req, res) => {
        res.send("V-1.13.0 => Project server is running...");
    });
    app.use('/api/v1', userApis);
};
