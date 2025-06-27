const express=require("express");
const path=require("path");
const session=require("express-session");
const moment=require("moment");
const bodyParser = require('body-parser');
const axios=require("axios");
const collection=require("./config");
const app=express();
app.use(session({
    secret: 'mindyou',  // Keep this secret safe
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: null
     } 
  }));
//convery data to json
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.set('view engine', 'ejs');



app.get('/',(req,res)=>{
    res.render("login");

});

app.get('/signup',(req,res)=>{
    res.render("signup");
});


//register user
app.post("/signup",async(req,res)=>{
    const data = {
        username: req.body.username ,
        //second username is same as the name attribute in the html form
        password: req.body.password,
        email:req.body.email_user,
        net_balance:500,
        earning:[],
        spent:[],
        //quiz_index:0

    }
    const exs=await collection.findOne({username: data.username});
    if(exs){
        res.send("username not available");
    }
    else{
    const userdata=await collection.insertMany(data);
    res.redirect("/")
    console.log(userdata);
    }

});


//login
app.post('/', async (req, res) => {
    try {
        const check = await collection.findOne({ username: req.body.username });
        
        if (!check) {
            return res.send("User not found");  // ✅ return here
        }

        const password = req.body.password;
        if (check.password !== password) {
            return res.send("Incorrect password");  // ✅ return here too
        }

        req.session.user = check;
        console.log(req.session.user);
        return res.redirect('/es');  // ✅ also return here for safety
    } catch (err) {
        console.error(err);
        return res.send("Wrong details");  // ✅ return here as well
    }
});


//leaderboard
app.get('/lb',async(req,res)=>{
    try{
        const users=await collection.find()
        .sort({net_balance:-1})
        res.render("leaderboard",{users});
    }
    catch{
        res.send("ERROR");
    }
});

app.get('/finance-blogs',async(req,res)=>{
    try{
        const response = await axios.get('https://newsapi.org/v2/everything?q=finance&apiKey=7d99d7c2cb304013bd3e6a05ec5fbf6a',{
            params:{
                q:'finance',
                apiKey: '7d99d7c2cb304013bd3e6a05ec5fbf6a'
            }
        });
        const blogs=response.data.articles;
        console.log(response.data);
        res.render('finance-blogs',{blogs});
    }
    catch(error){
        res.status(500).send("ERROR");
    }
});


let user = {
    credit_score: 600, // Starting credit score
    net_balance: 1000, // Initial balance
  };
  
  // Events Data
  const events = [
    {
      event: "Your car broke down! What will you do?",
      options: [
        { 
          choice: "Use credit card to pay for repairs.", 
          credit_score: 5, 
          net_balance: -300, 
          impact: "You gain 5 credit score points for timely payment, but you spend 300 units from your balance." ,
          help:true
        },
        { 
          choice: "Borrow money from a friend.", 
          credit_score: -5, 
          net_balance: 0, 
          impact: "Your credit score drops by 5 points due to lack of formal repayment history, but your balance remains unchanged." ,
          help:false
        },
        { 
          choice: "Delay the repair and save money.", 
          credit_score: -10, 
          net_balance: 100, 
          impact: "Your credit score decreases by 10 points for neglecting urgent repairs, but you save 100 units." ,
          help:false
        },
      ],
    },
    {
      event: "You received a bonus at work! What will you do?",
      options: [
        { 
          choice: "Invest in stocks.", 
          credit_score: 10, 
          net_balance: 500, 
          impact: "You gain 10 credit score points for wise financial planning and 500 units from returns." ,
          help:true
        },
        { 
          choice: "Spend it all on shopping.", 
          credit_score: -10, 
          net_balance: -200, 
          impact: "Your credit score drops by 10 points for impulsive spending, and you lose 200 units." ,
          help:false
        },
        { 
          choice: "Save it in your account.", 
          credit_score: 5, 
          net_balance: 300, 
          impact: "Your credit score increases by 5 points for saving, and you gain 300 units in balance." ,
          help:false
        },
      ],
    },
    {
      event: "Your credit card bill is due tomorrow. What will you do?",
      options: [
        { 
          choice: "Pay it in full.", 
          credit_score: 10, 
          net_balance: -200, 
          impact: "You gain 10 credit score points for paying on time, but your balance decreases by 200 units." ,
          help:true
        },
        { 
          choice: "Pay the minimum amount.", 
          credit_score: -5, 
          net_balance: -50, 
          impact: "Your credit score drops by 5 points due to partial payment, and you lose 50 units from your balance." ,
          help:false
        },
        { 
          choice: "Skip this month's payment.", 
          credit_score: -20, 
          net_balance: 0, 
          impact: "Your credit score drops by 20 points for missing payment, but your balance remains unchanged." ,
          help:false
        },
      ],
    },
   
        {
          event: "You need to pay for an emergency medical procedure. What will you do?",
          options: [
            { 
              choice: "Use health insurance to cover the costs.", 
              credit_score: 10, 
              net_balance: -1000, 
              impact: "Your credit score increases by 10 points due to proper health coverage, but your balance decreases by 1000 units." ,
              help:true
            },
            { 
              choice: "Borrow money from family members.", 
              credit_score: -5, 
              net_balance: 0, 
              impact: "Your credit score drops by 5 points because of informal borrowing, but your balance remains the same." ,
              help:false
            },
            { 
              choice: "Put it on your credit card.", 
              credit_score: -10, 
              net_balance: -500, 
              impact: "Your credit score drops by 10 points due to high credit card debt, and your balance decreases by 500 units." ,
              help:false
            },
          ],
        },
        {
          event: "You’re offered a new job with a higher salary. What will you do?",
          options: [
            { 
              choice: "Accept the offer and move to the new city.", 
              credit_score: 15, 
              net_balance: 1000, 
              impact: "You gain 15 credit score points and a 1000 unit boost to your balance from the salary increase." ,
              help:true
            },
            { 
              choice: "Reject the offer and stay in your current job.", 
              credit_score: 0, 
              net_balance: 0, 
              impact: "No change to your credit score or balance." ,
              help:false
            },
            { 
              choice: "Accept the offer but keep the current job too.", 
              credit_score: -10, 
              net_balance: 500, 
              impact: "Your credit score decreases by 10 points due to work overload, and you gain 500 units from your new salary." ,
              help:false
            },
          ],
        },
        {
          event: "You’ve been offered an early retirement plan. What will you do?",
          options: [
            { 
              choice: "Take the plan and retire early.", 
              credit_score: 10, 
              net_balance: 2000, 
              impact: "Your credit score increases by 10 points for careful financial planning, and you gain 2000 units from the retirement funds." ,
              help:true
            },
            { 
              choice: "Continue working to maximize your savings.", 
              credit_score: 0, 
              net_balance: 1000, 
              impact: "No change to your credit score, but you save 1000 units by continuing to work." ,
              help:false
            },
            { 
              choice: "Reject the offer and keep working at full salary.", 
              credit_score: -5, 
              net_balance: 0, 
              impact: "Your credit score drops by 5 points, but your balance remains unchanged." ,
              help:false
            },
          ],
        },
        {
          event: "A friend asks you to invest in their business. What will you do?",
          options: [
            { 
              choice: "Invest carefully after researching the business.", 
              credit_score: 10, 
              net_balance: 1000, 
              impact: "You gain 10 credit score points for making a wise investment, and your balance increases by 1000 units." ,
              help:true
            },
            { 
              choice: "Invest immediately without research.", 
              credit_score: -5, 
              net_balance: -500, 
              impact: "Your credit score drops by 5 points due to hasty decisions, and you lose 500 units from your balance." ,
              help:false
            },
            { 
              choice: "Decline the investment offer.", 
              credit_score: 0, 
              net_balance: 0, 
              impact: "No change to your credit score or balance." ,
              help:false
            },
          ],
        },
        {
          event: "Your car insurance is up for renewal. What will you do?",
          options: [
            { 
              choice: "Pay the full premium for the year upfront.", 
              credit_score: 5, 
              net_balance: -600, 
              impact: "You gain 5 credit score points for planning ahead, but your balance decreases by 600 units." ,
              help:true
            },
            { 
              choice: "Pay the monthly premium.", 
              credit_score: 0, 
              net_balance: -60, 
              impact: "No change in credit score, but your balance decreases by 60 units each month." ,
              help:false
            },
            { 
              choice: "Skip the renewal and take a risk.", 
              credit_score: -20, 
              net_balance: 0, 
              impact: "Your credit score drops by 20 points for neglecting insurance, and your balance remains unchanged." ,
              help:false
            },
          ],
        },
        {
          event: "Your home is in need of repairs. What will you do?",
          options: [
            { 
              choice: "Get a loan and complete the repairs.", 
              credit_score: 10, 
              net_balance: -2000, 
              impact: "Your credit score increases by 10 points for investing in property, and you borrow 2000 units for repairs." ,
              help:true
            },
            { 
              choice: "Delay the repairs and save money.", 
              credit_score: -5, 
              net_balance: 500, 
              impact: "Your credit score drops by 5 points for neglecting your property, but you save 500 units." ,
              help:false
            },
            { 
              choice: "Do the repairs yourself, which takes longer.", 
              credit_score: -10, 
              net_balance: 100, 
              impact: "Your credit score drops by 10 points due to the time investment, but you save 100 units." ,
              help:false
            },
          ],
        },
        {
          event: "You need to upgrade your phone. What will you do?",
          options: [
            { 
              choice: "Upgrade to a new model using your savings.", 
              credit_score: 5, 
              net_balance: -700, 
              impact: "You gain 5 credit score points for making a planned purchase, but your balance decreases by 700 units." ,
              help:true
            },
            { 
              choice: "Take a loan to buy the phone.", 
              credit_score: -5, 
              net_balance: -700, 
              impact: "Your credit score drops by 5 points due to debt, and your balance decreases by 700 units." ,
              help:false
            },
            { 
              choice: "Keep your old phone for now.", 
              credit_score: 0, 
              net_balance: 0, 
              impact: "No change to your credit score or balance." ,
              help:false
            },
          ],
        },
        {
          event: "You’re considering renting a place. What will you do?",
          options: [
            { 
              choice: "Sign a lease with a secure long-term agreement.", 
              credit_score: 10, 
              net_balance: -1200, 
              impact: "You gain 10 credit score points for stability, but your balance decreases by 1200 units for the deposit." ,
              help:true
            },
            { 
              choice: "Rent month-to-month for flexibility.", 
              credit_score: 0, 
              net_balance: -400, 
              impact: "No change in credit score, but you pay 400 units per month." ,
              help:false
            },
            { 
              choice: "Rent with no contract to avoid commitment.", 
              credit_score: -10, 
              net_balance: -400, 
              impact: "Your credit score drops by 10 points due to instability, and your balance decreases by 400 units." ,
              help:false
            },
          ],
        },
        {
          event: "You’ve been offered a credit card with a high limit. What will you do?",
          options: [
            { 
              choice: "Accept it but use it responsibly for emergencies.", 
              credit_score: 10, 
              net_balance: 0, 
              impact: "You gain 10 credit score points for responsible use, and there’s no immediate effect on your balance." ,
              help:true
            },
            { 
              choice: "Accept and use it for non-essential purchases.", 
              credit_score: -10, 
              net_balance: -500, 
              impact: "Your credit score drops by 10 points due to overuse, and your balance decreases by 500 units." ,
              help:false
            },
            { 
              choice: "Reject the offer altogether.", 
              credit_score: 0, 
              net_balance: 0, 
              impact: "No change in credit score or balance." ,
              help:false
            },
          ],
        },
    
    
  ];
  
  
  // Helper to get a random event
  const getRandomEvent = () => events[Math.floor(Math.random() * events.length)];
  
  // Routes
  app.get("/credit",async (req, res) => {
    if (!req.session.user) {
        return res.send("Login first!");
      }
    const randomEvent = getRandomEvent();
    res.render("credit", { user, event: randomEvent });
  });
  
  app.post("/submit", async(req, res) => {
    const { selectedOption } = req.body; // Get selected option index from the form
    const randomEvent = getRandomEvent();
  
    const chosenOption = randomEvent.options[selectedOption];
   
    user.credit_score += parseInt(chosenOption.credit_score, 10);
    user.net_balance += parseInt(chosenOption.net_balance, 10);
    if(chosenOption.help===true){
        var check= await collection.findOne({username:req.session.user.username});
        check.net_balance+=10;
        check.earning.push({ amount: 10, timestamp: new Date() });
        check.save();
        console.log(check.net_balance);
    }
  
  
    if (user.credit_score <= 0) {
      return res.render("gameover", { user });
    }
  
    res.render("credit", { user, event: getRandomEvent() });
  });
  
  // Reset Route
  app.post("/reset", (req, res) => {
    user = { credit_score: 600, net_balance: 1000 }; // Reset user stats
    res.redirect("/credit");
  });


  app.get('/es', async (req, res) => {
    if(!req.session.user){
        res.send("Please Login");
    }

    try {
      const check = await collection.findOne({username:req.session.user.username});  // Fetch the first user (you can adjust this to fetch based on your logic)
  
     
  
      const oneMonthAgo = moment().subtract(1, 'months').toDate();
      let totalEarnings = 0;
      let totalSpent = 0;
  
      // Calculate total earnings and spent for the last month
      check.earning.forEach(entry => {
        if (entry.timestamp >= oneMonthAgo) {
          totalEarnings += entry.amount;  // Add earnings within the last month
        }
      });
  
      check.spent.forEach(entry => {
        if (entry.timestamp >= oneMonthAgo) {
          totalSpent += entry.amount;  // Add spent within the last month
        }
      });
  const u=check.username;
  const n=check.net_balance;
      // Render the EJS file and pass the total earnings and spent
      res.render('dashboard', {
        totalEarnings,
        totalSpent,u,n
      });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
  

 
  
  // New API endpoint to get the earnings and spendings data
  app.get('/api/earnings-and-spendings', async (req, res) => {
    if(!req.session.user){
        res.send("Login Please");
    }
    
    
    try {
      // Fetch user data (change the criteria to your specific use case)
      const user = await collection.findOne({ username: req.session.user.username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract earnings and spendings (from your schema)
      const earnings = user.earning.map(entry => ({
        amount: entry.amount,
        timestamp: entry.timestamp,
      }));
  
      const spendings = user.spent.map(entry => ({
        amount: entry.amount,
        timestamp: entry.timestamp,
      }));
  
      // Send the data as JSON
      res.json({
        earnings,
        spendings
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.get('/balance', async (req, res) => {
    if(!req.session.user){
        res.send("Login Please");
    }
    try {
        

        // Find user and sort earnings by timestamp
        const check = await collection.findOne({ username: req.session.user.username });
        if (!check) return res.status(404).send('User not found');

        const sortedEarnings = check.earning.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Render the EJS file with earnings data
        res.render('balance', { username: check.username, earnings: sortedEarnings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/expense', async (req, res) => {
    if(!req.session.user){
        res.send("Login Please");
    }
    try {
        

        // Find user and sort earnings by timestamp
        const check = await collection.findOne({ username: req.session.user.username });
        if (!check) return res.status(404).send('User not found');

        const sortedMoney = check.spent.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Render the EJS file with earnings data
        res.render('expense', { username: check.username, expense: sortedMoney });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/confirm', (req, res) => {
    const entryFee = 50; // Set the required entry fee
    res.render('confirm', { entryFee });
  });
  
  app.post('/confirm', async (req, res) => {
   if(!req.session.user){
    res.send("Login First");
   }
    const entryFee = 50; // Match the entry fee
  
    try {
        const check = await collection.findOne({ username: req.session.user.username });

  
      // Check if the user has enough balance
      if (check.net_balance >= entryFee) {
        // Deduct the entry fee
        check.net_balance -= entryFee;
        check.spent.push({ amount: entryFee, timestamp: new Date() });
        await check.save();
  
        // Redirect to the game page
        res.redirect('/credit');
      } else {
        // Redirect back with an error message
        res.redirect('/error?message=Insufficient balance to play the game.');
      }
    } catch (error) {
      console.error('Error processing the confirmation:', error);
      res.redirect('/error?message=Something went wrong. Please try again.');
    }
  });
  

  app.get('/tax',async(req,res)=>{
    res.render("tax");
  })

  app.post('/api/update-balance', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    try {
      const check = await collection.findOne({ username: req.session.user.username });
  
      if (!check) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { totalAmount, savingsAmount } = req.body;
  
      if (savingsAmount >= totalAmount * 0.2) {
        check.net_balance += 100;
        check.earning.push({ amount: 100, timestamp: new Date() });
        await check.save(); // Save the document
        return res.status(200).json({ message: "Balance updated successfully", bonus: 100 });
      } else {
        return res.status(200).json({ message: "No bonus awarded", bonus: 0 });
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app.get('/confirmsecond', (req, res) => {
    const entryFee = 50; // Set the required entry fee
    res.render('confirmsecond', { entryFee });
  });
  app.post('/confirmsecond', async (req, res) => {
    if(!req.session.user){
     res.send("Login Please");
    }
     const entryFee = 50; // Match the entry fee
   
     try {
         const check = await collection.findOne({ username: req.session.user.username });
 
   
       // Check if the user has enough balance
       if (check.net_balance >= entryFee) {
         // Deduct the entry fee
         check.net_balance -= entryFee;
         check.spent.push({ amount: entryFee, timestamp: new Date() });
         await check.save();
   
         // Redirect to the game page
         res.redirect('/tax');
       } else {
         // Redirect back with an error message
         res.redirect('/error?message=Insufficient balance to play the game.');
       }
     } catch (error) {
       console.error('Error processing the confirmation:', error);
       res.redirect('/error?message=Something went wrong. Please try again.');
     }
   });
   app.get('/game',async(req,res)=>{
    res.render("game");
   });
const port=5000;
app.listen(port,()=>{
    console.log(`Server running on port :  ${port}`);
});

