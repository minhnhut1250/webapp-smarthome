module.exports = function (app) {
   app.get('/admin/setup', (req, res) => {
      res.send("Now you will setup devices of your home");
   });
}