const signup = require("./models/signup");
const login = require("./models/login");
const help = require("./models/help");
const feedback = require("./models/feedback");
const { sign, verify } = require("jsonwebtoken");
var moment = require("moment");
const argon2 = require("argon2");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const buyandsell = require("./models/buyandsell");
const recieveorpay = require("./models/recieveorpay");
const banks = require("./models/banks");
const expense = require("./models/expense");
const openingbalance = require("./models/openingbalance");

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

dotenv.config();

const UsersVerification = async(username) => {
    const checkuser = await login.findOne({ username });

    if(checkuser.createdby === "no"){ //user is admin
        return username;
    }else{
        return checkuser.createdby; //user is not admin, but return username of admin
    }
}

const AboveEmail = () => {
    return (`<p align="center">
                <a href="https://mustiash.com.ng" target='__blank'>
                    <img style="width:70px;object-fit:cover;height:70px;border-radius:5px;"
                        src="https://files.textailng.com/textail-logo.png" alt="textail" />
                </a>
            </p>
            <p style="font-size:25px;font-family:sans-serif;color:rgb(107, 43, 8);text-align:center;">Yanchangi</p>
            <hr />`);
}

const BelowEmail = () => {
    return (`<p style="color:rgb(107, 43, 8);font-size:16px;text-align: center;">Follow us on Social Media</p>
            <p align="center">
                <a href="https://www.facebook.com/mustiashtechcompany" target='__blank'>
                    <img style="width:40px;object-fit:cover;height:40px;border-radius:5px;"
                        src="https://files.textailng.com/facebook-share.png" alt="facebook" />
                </a>
                <a href="https://www.instagram.com/mustiashtechcompany" target='__blank'>
                    <img style="width:40px;object-fit:cover;height:40px;border-radius:5px;margin-left:5px"
                        src="https://files.textailng.com/instagram-share.png" alt="instagram" />
                </a>
                <a href="https://www.twitter.com/mtechcompany" target='__blank'>
                    <img style="width:40px;object-fit:cover;height:40px;border-radius:5px;margin-left:5px"
                        src="https://files.textailng.com/twitter-share.png" alt="twitter" />
                </a>
                <a href="https://www.linkedin.com/in/mustiashtechcompany" target='__blank'>
                    <img style="width:40px;object-fit:cover;height:40px;border-radius:5px;margin-left:5px"
                        src="https://files.textailng.com/linkedin.png" alt="linkedin" />
                </a>
                <a href="https://www.youtube.com/" target='__blank'>
                    <img style="width:40px;object-fit:cover;height:40px;border-radius:5px;margin-left:5px"
                        src="https://files.textailng.com/youtube.png" alt="youtube" />
                </a>
                <a href="https://chat.whatsapp.com/" target='__blank'>
                    <img style="width:40px;object-fit:cover;height:40px;border-radius:5px;margin-left:5px"
                        src="https://files.textailng.com/whatsapp-share.png" alt="whatsapp" />
                </a>
            </p>
            <p style="color:rgb(107, 43, 8);font-size:15px;text-align:center;">Yanchangi is an online record keeping system for forex traders - <a href="https://mustiash.com.ng" target='__blank'>https://mustiash.com.ng</a>
            </p>`);
}

const resolvers = {
    Query: { //fetching

        accountInfo: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {

                username = await UsersVerification(username);

                const b = await signup.findOne({ username: username }); // find the username in signup document
                
                if (b == null) { // not their
                    return { error: "yesso" }
                } else {
                    return b;
                }

            } else {
                return { error: "yesna" }
            }
        },

        emailverified: async (_, { username, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    const verifier = await signup.findOne({ username: username });

                    if (verifier.emailverify === "yes") {
                        return { error: "verified" };
                    } else if (verifier.emailcodesent === undefined) {
                        return { error: "codenotsent" };
                    } else if (verifier.emailcodesent !== undefined) {
                        return { error: "codesent" };
                    }

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "verifyerror" };
            }

        },
        
        buyandsellget: async (_, { username, searchsupplier, searchcustomer, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const bas = await buyandsell.find({ username: username, 'supplier': { $regex: searchsupplier, $options: "i" }, 'customer': { $regex: searchcustomer, $options: "i" } }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return bas;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalityforcustomer: async (_, { username, customer, customeraccountno, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {
                    
                    username = await UsersVerification(username);

                    let amount = 0;
                    let customerrate = 0;
                    let customerngn = 0;
                    let supplierrate = 0;
                    let supplierngn = 0;
                    let profit = 0;
                    let size = 0;

                    const tfc = await buyandsell.find({ username, customer, customeraccountno });

                    await tfc.forEach((e) => {
                        amount += parseFloat(e.amount1);
                        customerrate += parseFloat(e.rate2);
                        customerngn += parseFloat(e.ngn2);
                        supplierrate += parseFloat(e.rate1);
                        supplierngn += parseFloat(e.ngn1);
                        profit += parseFloat(e.profit);
                    });

                    size = tfc.length;

                    customerrate = customerrate / size;
                    supplierrate = supplierrate / size;

                    customerrate = customerrate.toFixed(1);
                    supplierrate = supplierrate.toFixed(1);

                    return {amount: amount, customerrate: customerrate, customerngn: customerngn, supplierrate: supplierrate, supplierngn: supplierngn, profit: profit};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalityforsupplier: async (_, { username, supplier, supplieraccountno, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let amount = 0;
                    let customerrate = 0;
                    let customerngn = 0;
                    let supplierrate = 0;
                    let supplierngn = 0;
                    let profit = 0;
                    let size = 0;

                    const tfc = await buyandsell.find({ username, supplier, supplieraccountno });

                    await tfc.forEach((e) => {
                        amount += parseFloat(e.amount1);
                        customerrate += parseFloat(e.rate2);
                        customerngn += parseFloat(e.ngn2);
                        supplierrate += parseFloat(e.rate1);
                        supplierngn += parseFloat(e.ngn1);
                        profit += parseFloat(e.profit);
                    });

                    size = tfc.length;

                    customerrate = customerrate / size;
                    supplierrate = supplierrate / size;

                    customerrate = customerrate.toFixed(1);
                    supplierrate = supplierrate.toFixed(1);

                    return {amount: amount, customerrate: customerrate, customerngn: customerngn, supplierrate: supplierrate, supplierngn: supplierngn, profit: profit};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalityforpayorrecievedcustomer: async (_, { username, customer, customeraccountno, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let amountpay = 0;
                    let amountrecieved = 0;

                    const tfc = await recieveorpay.find({ username, fromorto: customer, accountnumber: customeraccountno });

                    await tfc.forEach((e) => {
                        if(e.recievedorpay === "pay"){
                            amountpay += parseFloat(e.amount);
                        }
                        if(e.recievedorpay === "recieved"){
                            amountrecieved += parseFloat(e.amount);
                        }
                    });

                    return {amountpay: amountpay, amountrecieved: amountrecieved};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalityforpayorrecievedsupplier: async (_, { username, supplier, supplieraccountno, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let amountpay = 0;
                    let amountrecieved = 0;

                    const tfc = await recieveorpay.find({ username, fromorto: supplier, accountnumber: supplieraccountno });

                    await tfc.forEach((e) => {
                        if(e.recievedorpay === "pay"){
                            amountpay += parseFloat(e.amount);
                        }
                        if(e.recievedorpay === "recieved"){
                            amountrecieved += parseFloat(e.amount);
                        }
                    });

                    return {amountpay: amountpay, amountrecieved: amountrecieved};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        buyandsellgetcustomer: async (_, { username, customer, customeraccountno, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const bas = await buyandsell.find({ username, customer, customeraccountno }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return bas;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        buyandsellgetsupplier: async (_, { username, supplier, supplieraccountno, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const bas = await buyandsell.find({ username, supplier, supplieraccountno }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return bas;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        recieveorpayget: async (_, { username, search, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const rop = await recieveorpay.find({ username: username, 'fromorto': { $regex: search, $options: "i" } }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return rop;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        recieveorpaygetcustomer: async (_, { username, customer, customeraccountno, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const rop = await recieveorpay.find({ username, fromorto: customer, accountnumber: customeraccountno }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return rop;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        recieveorpaygetsupplier: async (_, { username, supplier, supplieraccountno, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const rop = await recieveorpay.find({ username, fromorto: supplier, accountnumber: supplieraccountno }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return rop;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalforcustomer: async (_, { username, customer, customeraccountno, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let amountpay = 0;
                    let amountrecieved = 0;
                    let ngn = 0;
                    let totalbalance = 0;
                    let totalopeningbalance = 0;

                    const tfc = await recieveorpay.find({ username, fromorto: customer, accountnumber: customeraccountno });
                    
                    const tfc2 = await buyandsell.find({ username, customer, customeraccountno });

                    const tob = await openingbalance.find({ username, name: customer, accountnumber: customeraccountno });

                    await tfc.forEach((e) => {
                        if(e.recievedorpay === "pay"){
                            amountpay += parseFloat(e.amount);
                        }else if(e.recievedorpay === "recieved"){
                            amountrecieved += parseFloat(e.amount);
                        }
                    });

                    await tfc2.forEach((e) => {
                        ngn += parseFloat(e.ngn2);
                    });

                    await tob.forEach((e) => {
                        totalopeningbalance += parseFloat(e.amount);
                    });

                    totalbalance = totalopeningbalance + ngn - amountrecieved + amountpay;

                    return {totalbalance: totalbalance};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalforsupplier: async (_, { username, supplier, supplieraccountno, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let amountpay = 0;
                    let amountrecieved = 0;
                    let ngn = 0;
                    let totalbalance = 0;
                    let totalopeningbalance = 0;

                    const tfc = await recieveorpay.find({ username, fromorto: supplier, accountnumber: supplieraccountno });
                    
                    const tfc2 = await buyandsell.find({ username, supplier, supplieraccountno });

                    const tob = await openingbalance.find({ username, name: supplier, accountnumber: supplieraccountno });

                    await tfc.forEach((e) => {
                        if(e.recievedorpay === "pay"){
                            amountpay += parseFloat(e.amount);
                        }else if(e.recievedorpay === "recieved"){
                            amountrecieved += parseFloat(e.amount);
                        }
                    });

                    await tfc2.forEach((e) => {
                        ngn += parseFloat(e.ngn1);
                    });

                    await tob.forEach((e) => {
                        totalopeningbalance += parseFloat(e.amount);
                    });

                    totalbalance = totalopeningbalance + ngn - amountpay + amountrecieved;

                    return {totalbalance: totalbalance};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        allbanksget: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let allbanks = [];
                    let banklist = [];

                    let count = 0;
                    let supplierrecievercount = 0;
                    let customerrecievercount = 0;
                    let supplierpayercount = 0;
                    let customerpayercount = 0;
                    let expensecount = 0;
                    let total = 0;

                    const banker = await banks.find({ username: username });
                    const recieverorpayer = await recieveorpay.find({ username: username });
                    const expenses = await expense.find({ username });
                    
                    await banker.forEach((e) => {
                        banklist.push({id: e._id, bankname: e.bankname, bankaccountnumber: e.bankaccountnumber, bankaccountname: e.bankaccountname, bankbalance: e.bankamount, date: e.date});
                    });

                    //console.log(banklist);

                    await banklist.forEach((e) => {
                        recieverorpayer.forEach((a) => {
                            if(a.bankname === banklist[count].bankname &&
                                a.bankaccountnumber === banklist[count].bankaccountnumber &&
                                a.bankaccountname === banklist[count].bankaccountname && 
                                a.chooseclient === "supplier" && a.recievedorpay === "recieved"){
                                    supplierrecievercount += parseFloat(a.amount);
                            }else if(a.bankname === banklist[count].bankname &&
                                a.bankaccountnumber === banklist[count].bankaccountnumber &&
                                a.bankaccountname === banklist[count].bankaccountname && 
                                a.chooseclient === "customer" && a.recievedorpay === "recieved"){
                                    customerrecievercount += parseFloat(a.amount);
                            }else if(a.bankname === banklist[count].bankname &&
                                a.bankaccountnumber === banklist[count].bankaccountnumber &&
                                a.bankaccountname === banklist[count].bankaccountname && 
                                a.chooseclient === "supplier" && a.recievedorpay === "pay"){
                                    supplierpayercount += parseFloat(a.amount);
                            }else if(a.bankname === banklist[count].bankname &&
                                a.bankaccountnumber === banklist[count].bankaccountnumber &&
                                a.bankaccountname === banklist[count].bankaccountname && 
                                a.chooseclient === "customer" && a.recievedorpay === "pay"){
                                    customerpayercount += parseFloat(a.amount);
                            }
                        });

                        expenses.forEach((a) => {
                            if(a.bankname === banklist[count].bankname &&
                                a.bankaccountnumber === banklist[count].bankaccountnumber &&
                                a.bankaccountname === banklist[count].bankaccountname){
                                    expensecount += parseFloat(a.amount);
                            }
                        });

                        total = parseFloat(banklist[count].bankbalance) + supplierrecievercount + customerrecievercount - supplierpayercount - customerpayercount - expensecount;

                        allbanks.push({...banklist[count], bankamount: total, bankbalance: banklist[count].bankbalance, date: e.date});

                        supplierrecievercount = 0;
                        customerrecievercount = 0;
                        supplierpayercount = 0;
                        customerpayercount = 0;
                        expensecount = 0;
                        total = 0;
                        count += 1;
                    });

                    return allbanks.reverse();

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        getallcustomers: async (_, { username, jwtauth, searchcustomer, searchcustomeraccountno, start, end }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);
                    
                    let all_bas = [];

                    const bas = await openingbalance.find({ username: username, 'name': { $regex: searchcustomer, $options: "i" }, 'accountnumber': { $regex: searchcustomeraccountno, $options: "i" } }).hint({ $natural: -1 }).skip(start).limit(end);

                    await bas.forEach((e) => {
                        if(e.chooseclient === "customer"){
                            all_bas.push({id: e._id, customer: e.name, customeraccountno: e.accountnumber});
                        }
                    });

                    return all_bas;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        getallsuppliers: async (_, { username, jwtauth, searchsupplier, searchsupplieraccountno, start, end }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let all_gas = [];

                    const gas = await openingbalance.find({ username: username, 'name': { $regex: searchsupplier, $options: "i" }, 'accountnumber': { $regex: searchsupplieraccountno, $options: "i" } }).hint({ $natural: -1 }).skip(start).limit(end);

                    await gas.forEach((e) => {
                        if(e.chooseclient === "supplier"){
                            all_gas.push({id: e._id, supplier: e.name, supplieraccountno: e.accountnumber});
                        }
                    });

                    return all_gas;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        getprevioususersinfo: async (_, { username, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let all_history = [];

                    const history = await openingbalance.find({ username: username }).hint({ $natural: -1 });

                    await history.forEach((e) => {
                        all_history.push({id: e._id, type: e.chooseclient, name: e.name, accountno: e.accountnumber});
                    });

                    return all_history;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "verifyerror" };
            }

        },

        totaltransactions: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const tbanks = await banks.find({ username });
                    const tbuyandsell = await buyandsell.find({ username });
                    const trecieve = await recieveorpay.find({ username, recievedorpay: "recieved" });
                    const tpay = await recieveorpay.find({ username, recievedorpay: "pay" });
                    const fullrecieveorpay = await recieveorpay.find({ username });
                    const expenses = await expense.find({ username });
                    const openingbalances = await openingbalance.find({ username });

                    //Total Balance
                    let supplierrecievercount = 0;
                    let customerrecievercount = 0;
                    let supplierpayercount = 0;
                    let customerpayercount = 0;
                    let total = 0;
                    let totalbalance = 0;
                    let totalexpense = 0;
                    let totalopeningbalancesupplier = 0;
                    let totalopeningbalancecustomer = 0;

                    await tbanks.forEach((e) => {
                        total += parseFloat(e.bankamount);
                    });

                    await fullrecieveorpay.forEach((a) => {
                        if(a.chooseclient === "supplier" && a.recievedorpay === "recieved"){
                                supplierrecievercount += parseFloat(a.amount);
                        }else if(a.chooseclient === "customer" && a.recievedorpay === "recieved"){
                                customerrecievercount += parseFloat(a.amount);
                        }else if(a.chooseclient === "supplier" && a.recievedorpay === "pay"){
                                supplierpayercount += parseFloat(a.amount);
                        }else if(a.chooseclient === "customer" && a.recievedorpay === "pay"){
                                customerpayercount += parseFloat(a.amount);
                        }
                    });

                    await expenses.forEach((e) => {
                        totalexpense += parseFloat(e.amount);
                    });

                    await openingbalances.forEach((e) => {
                        if(e.chooseclient === "supplier"){
                            totalopeningbalancesupplier += parseFloat(e.amount);
                        }else if(e.chooseclient === "customer"){
                            totalopeningbalancecustomer += parseFloat(e.amount);
                        }
                    });

                    totalbalance = total + supplierrecievercount + customerrecievercount - supplierpayercount - customerpayercount - totalexpense;

                    //Total Debt - Supplier
                    let totaldebt = 0;
                    let totaldebtsupplierngn = 0;
                    let totaldebtpay = 0;
                    let totaldebtrecieved = 0;

                    await tbuyandsell.forEach((e) => {
                        totaldebtsupplierngn += parseFloat(e.ngn1);
                    });

                    await tpay.forEach((e) => {
                        if(e.chooseclient === "supplier"){
                            totaldebtpay += parseFloat(e.amount);
                        }
                    });

                    await trecieve.forEach((e) => {
                        if(e.chooseclient === "supplier"){
                            totaldebtrecieved += parseFloat(e.amount);
                        }
                    });

                    totaldebt = totalopeningbalancesupplier + totaldebtsupplierngn - totaldebtpay + totaldebtrecieved;

                    //Total Overdraft - Customer
                    let totaloverdraft = 0;
                    let totaloverdraftcustomerngn = 0;
                    let totaloverdraftpay = 0;
                    let totaloverdraftrecieved = 0;

                    await tbuyandsell.forEach((e) => {
                            totaloverdraftcustomerngn += parseFloat(e.ngn2);
                    });

                    await tpay.forEach((e) => {
                        if(e.chooseclient === "customer"){
                            totaloverdraftpay += parseFloat(e.amount);
                        }
                    });

                    await trecieve.forEach((e) => {
                        if(e.chooseclient === "customer"){
                            totaloverdraftrecieved += parseFloat(e.amount);
                        }
                    });

                    totaloverdraft = totalopeningbalancecustomer + totaloverdraftcustomerngn - totaloverdraftrecieved + totaloverdraftpay;

                    //Total net
                    let net = 0;

                    net = totalbalance + totaloverdraft - totaldebt;

                    //Total profit
                    let totalprofit = 0;

                    await tbuyandsell.forEach((e) => {
                        totalprofit += parseFloat(e.profit);
                    });

                    let netprofit = 0;

                    netprofit = totalprofit - totalexpense;

                    return {totalbalance: totalbalance, totaldebt: totaldebt, totaloverdraft: totaloverdraft, net: net, totalprofit: totalprofit, totalexpense: totalexpense, netprofit: netprofit};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        existingusers: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const eu = await login.find({ createdby: username }).hint({ $natural: -1 });

                    return eu;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        getallavailablebanks: async (_, { username, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {

                username = await UsersVerification(username);
                
                const b = await banks.find({ username: username });

                return b;

            } else {
                return { error: "verifyerror" };
            }

        },

        expensesget: async (_, { username, search, startc, endc, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {

                username = await UsersVerification(username);
                
                const e = await expense.find({ username: username, description: { $regex: search, $options: "i" } }).hint({ $natural: -1 }).skip(startc).limit(endc);

                return e;

            } else {
                return { error: "verifyerror" };
            }

        },

        totalexpenses: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let total = 0;

                    const e = await expense.find({ username });

                    await e.forEach((a) => {
                        total += parseFloat(a.amount);
                    })

                    return {totalamount: total};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        openingbalanceget: async (_, { username, search, startc, endc, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const ob = await openingbalance.find({ username: username, 'name': { $regex: search, $options: "i" } }).hint({ $natural: -1 }).skip(startc).limit(endc);

                    return ob;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        totalopeningbalance: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let total = 0;

                    const e = await openingbalance.find({ username });

                    await e.forEach((a) => {
                        total += parseFloat(a.amount);
                    })

                    return {totalamount: total};

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        accessverify: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    const l = await login.findOne({ username });

                    return l;

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

    },
    Mutation: { //adding

        loginAccount: async (_, { username, password }) => {

            const log = await login.findOne({ username: username }); //verifying username exist

            if (log === null) { // checking if it doesn't exist
                return { error: "yes", username: "error", token: "error" };
            }

            if (await argon2.verify(log.password, password + username + process.env.PasswordToken)) {
                const token = await sign({ username: username }, process.env.Verify, { expiresIn: "1 days" }); //creating a jwt that last for 2 days, 30 seconds

                return { error: "no", username: username, token: token };
            } else {
                return { error: "yes", username: "error", token: "error" };
            }

        },

        createAccount: async (_, { fullname, email, phoneno, gender, username, password }) => {

            const logcheck = await signup.findOne({ username: username }); //checking if the signup username already exist

            if (logcheck != null) {
                return { error: "exist" }; //already a user with the username
            }

            const hashedPassword = await argon2.hash(password + username + process.env.PasswordToken);

            try {
                const su = new signup({ fullname, email, phoneno, gender, username }); //putting info to the signup document
                const log = new login({ username: username, password: hashedPassword }); //putting info to the login document
                await su.save();
                await log.save();
                return { error: "no" }
            } catch (e) {
                return { error: "yes" }
            }

        },

        accountUpdate: async (_, { username, jwtauth, fullname, email, phoneno, country, state, localgovt, gender, businessname, file }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {
                    const emailaddress = await signup.findOne({ username: username });

                    if (emailaddress.emailverify === "no") {
                        return { error: "emailnotverified" };
                    }

                    if (emailaddress.email !== email) {
                        if (emailaddress.emailverify === "yes") {
                            return { error: "emailverified" };
                        }
                    }

                    await signup.updateOne({ username: username }, { $set: { fullname, email, phoneno, country, state, localgovt, gender, businessname, picture: file } });

                    const signer = await signup.findOne({ username: username });

                    return { picture: signer.picture, error: "no" };

                } catch (e) {
                    return { error: "yes" }
                }
            } else {
                return { error: "errorwhileupdating" };
            }

        },

        usernameavailability: async (_, { username }) => {

            try {

                if (username === "") {
                    return { error: "noinput" };
                }

                const user = await login.findOne({ username: username });
                if (user === null) {
                    return { error: "available" };
                } else {
                    return { error: "notavailable" };
                }
            } catch (e) {
                return { error: "yes" };
            }

        },

        usershelp: async (_, { username, sentmessage, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {

                try {
                    const h = new help({ username: username, sentmessage: sentmessage });
                    await h.save();
                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" }
                }

            } else {
                return { error: "verifyerror" }
            }

        },

        usersfeedback: async (_, { username, sentmessage, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {

                try {
                    const f = new feedback({ username: username, sentmessage: sentmessage });
                    await f.save();
                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" }
                }

            } else {
                return { error: "verifyerror" }
            }

        },

        emailverification: async (_, { username, verificationcode, jwtauth }) => {

            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const user = await signup.findOne({ username: username });

                    if (verificationcode === undefined) {
                        //Start - Send Email Here
                        let codesent = await Math.random().toString().slice(2,);

                        // create reusable transporter object using the default SMTP transport
                        let transporter = await nodemailer.createTransport({
                            host: process.env.EmailHost,
                            port: 465,
                            secure: true, // true for 587, false for other ports
                            auth: {
                                user: process.env.EmailUser,
                                pass: process.env.EmailPass,
                            },
                        });

                        // send mail with defined transport object
                        await transporter.sendMail({
                            from: process.env.Email, // sender address
                            to: user.email, // list of receivers
                            subject: "Verification Code", // Subject line
                            text: `Copy and Paste this code: ${codesent}`, // plain text body
                            html: `${AboveEmail()}<p style="text-align:center">Copy and Paste the code below to verify</p>
                                    <p style="text-align:center;color:rgb(197, 34, 13);font-size:17px;">${codesent}</p>${BelowEmail()}`, // html body
                        }).catch((e) => {
                            return { error: e };
                        });

                        //End
                        if (user.emailcodesent === undefined) {
                            await signup.updateOne({ username: username }, { $set: { emailcodesent: codesent } });
                            return { error: "send" };
                        } else {
                            await signup.updateOne({ username: username }, { $set: { emailcodesent: codesent } });
                            return { error: "resend" };
                        }
                    }

                    if (verificationcode !== user.emailcodesent) {
                        return { error: "incorrect" };
                    }

                    if (verificationcode === user.emailcodesent) {
                        await signup.updateOne({ username: username }, { $set: { emailverify: "yes" } });

                        return { error: "verified" };
                    }

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "verifyerror" };
            }

        },

        newpasswordverification: async (_, { username, verificationcode, newpassword }) => {

            try {

                username = await UsersVerification(username);

                const user = await signup.findOne({ username: username });

                if (user === null) {
                    return { error: "usernamenotfound" };
                }

                if (user.createdby !== "no") {
                    return { error: "notadmin" };
                }

                if (verificationcode === undefined) {
                    //Start - Send Email Here
                    let codesent = await Math.random().toString().slice(2,);

                    // create reusable transporter object using the default SMTP transport
                    let transporter = await nodemailer.createTransport({
                        host: process.env.EmailHost,
                        port: 465,
                        secure: true, // true for 587, false for other ports
                        auth: {
                            user: process.env.EmailUser,
                            pass: process.env.EmailPass,
                        },
                    });

                    // send mail with defined transport object
                    await transporter.sendMail({
                        from: process.env.Email, // sender address
                        to: user.email, // list of receivers
                        subject: "Verification Code", // Subject line
                        text: `Copy and Paste this code: ${codesent}`, // plain text body
                        html: `${AboveEmail()}<p style="text-align:center">Copy and Paste the code below to verify</p>
                                <p style="text-align:center;color:rgb(197, 34, 13);font-size:17px;">${codesent}</p>${BelowEmail()}`, // html body
                    }).catch((e) => {
                        return { error: e };
                    });

                    //End

                    const gen_token = username + codesent + process.env.ResetPasswordToken;

                    const token = await argon2.hash(gen_token); //generate new token for security

                    if (user.forgotpasswordcodesent === undefined || user.forgotpasswordcodesent === "no") {
                        await signup.updateOne({ username: username }, { $set: { forgotpasswordcodesent: "yes", forgotpasswordvcode: codesent, forgotpasswordtoken: token } });
                        return { error: "send" };
                    } else {
                        await signup.updateOne({ username: username }, { $set: { forgotpasswordcodesent: "yes", forgotpasswordvcode: codesent, forgotpasswordtoken: token } });
                        return { error: "resend" };
                    }
                }

                if (verificationcode !== undefined && verificationcode !== "no") {
                    if (verificationcode !== user.forgotpasswordvcode) {
                        return { error: "incorrect" };
                    }

                    if (verificationcode === user.forgotpasswordvcode) {
                        await signup.updateOne({ username: username }, { $set: { forgotpasswordverified: "yes" } });

                        return { error: "verified" };
                    }
                }

                if (newpassword !== undefined) {

                    if (user.forgotpasswordvcode === "no" || user.forgotpasswordcodesent === "no" || user.forgotpasswordverified === "no") {
                        return { error: "hacker" };
                    }

                    const verify_token = username + user.forgotpasswordvcode + process.env.ResetPasswordToken;

                    if (await argon2.verify(user.forgotpasswordtoken, verify_token)) {

                        const hashedPassword = await argon2.hash(newpassword + username + process.env.PasswordToken);
                        //const hashedPassword = await argon2.hash(newpassword);

                        await login.updateOne({ username: username }, { $set: { password: hashedPassword } });

                        await signup.updateOne({ username: username }, { $set: { forgotpasswordvcode: "no", forgotpasswordcodesent: "no", forgotpasswordverified: "no" } });

                        return { error: "set" };
                    } else {
                        return { error: "hacker" };
                    }
                }

            } catch (e) {
                return { error: "yes" };
            }

        },

        changeemail: async (_, { username, email, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const getemail = await signup.findOne({ username: username });

                    if (getemail.emailverify === "yes") {
                        return { error: "verified" };
                    }

                    await signup.updateOne({ username: username }, { $set: { email: email } });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        buyandsellupdate: async (_, { id, username, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    //Check if a supplier exist in opening balance
                    const checksupplier = await openingbalance.findOne({ username: username, accountnumber: supplieraccountno });
                    if(checksupplier !== null){
                        if(checksupplier.name !== supplier){
                            return { error: "supplieraccountnodoesmatch" }; 
                        }
                    }else{
                        return { error: "accountnodontexist" };
                    }

                    //Check if a customer exist in opening balance
                    const checkcustomer = await openingbalance.findOne({ username: username, accountnumber: customeraccountno });
                    if(checkcustomer !== null){
                        if(checkcustomer.name !== customer){
                            return { error: "customeraccountnodoesmatch" }; 
                        }
                    }else{
                        return { error: "accountnodontexist" };
                    }

                    await buyandsell.updateOne({ _id: id, username: username }, { $set: { amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit } });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        buyandselldelete: async (_, { id, username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await buyandsell.deleteOne({ _id: id, username: username });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        buyandsellinsert: async (_, { username, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    //Check if a supplier exist in opening balance
                    const checksupplier = await openingbalance.findOne({ username: username, accountnumber: supplieraccountno });
                    if(checksupplier !== null){
                        if(checksupplier.name !== supplier){
                            return { error: "supplieraccountnodoesmatch" }; 
                        }
                    }else{
                        return { error: "supplieraccountnodontexist" };
                    }

                    //Check if a customer exist in opening balance
                    const checkcustomer = await openingbalance.findOne({ username: username, accountnumber: customeraccountno });
                    if(checkcustomer !== null){
                        if(checkcustomer.name !== customer){
                            return { error: "customeraccountnodoesmatch" }; 
                        }
                    }else{
                        return { error: "customeraccountnodontexist" };
                    }

                    const buyandsellcurrency = new buyandsell({ username, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit });

                    await buyandsellcurrency.save();

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        recieveorpayupdate: async (_, { id, username, amount, chooseclient, recievedorpay, fromorto, bankname, bankaccountnumber, bankaccountname, accountnumber, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    //Check if a supplier/customer exist in opening balance
                    const check = await openingbalance.findOne({ username: username, accountnumber: accountnumber });
                    if(check !== null){
                        if(check.name !== fromorto){
                            if(check.chooseclient === "supplier"){
                                return { error: "supplieraccountnodoesmatch" }; 
                            }  
                            if(check.chooseclient === "customer"){
                                return { error: "customeraccountnodoesmatch" }; 
                            }
                        }
                    }else{
                        if(chooseclient === "supplier"){
                            return { error: "supplieraccountnodontexist" }; 
                        }  
                        if(chooseclient === "customer"){
                            return { error: "customeraccountnodontexist" }; 
                        }
                    }

                    await recieveorpay.updateOne({ _id: id, username: username }, { $set: { amount, chooseclient, recievedorpay, fromorto, bankname, bankaccountnumber, bankaccountname, accountnumber } });

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        recieveorpaydelete: async (_, { id, username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await recieveorpay.deleteOne({ _id: id, username: username });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        recieveorpayinsert: async (_, { username, amount, chooseclient, recievedorpay, fromorto, bankname, bankaccountnumber, bankaccountname, accountnumber, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    //Check if a supplier/customer exist in opening balance
                    const check = await openingbalance.findOne({ username: username, accountnumber: accountnumber });
                    if(check !== null){
                        if(check.name !== fromorto){
                            if(check.chooseclient === "supplier"){
                                return { error: "supplieraccountnodoesmatch" }; 
                            }  
                            if(check.chooseclient === "customer"){
                                return { error: "customeraccountnodoesmatch" }; 
                            }
                        }
                    }else{
                        if(chooseclient === "supplier"){
                            return { error: "supplieraccountnodontexist" }; 
                        }  
                        if(chooseclient === "customer"){
                            return { error: "customeraccountnodontexist" }; 
                        }
                    }

                    const recieveorpayenter = new recieveorpay({ username, amount, chooseclient, recievedorpay, fromorto, bankname, bankaccountnumber, bankaccountname, accountnumber });

                    await recieveorpayenter.save();

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        addbanks: async (_, { username, bankname, bankaccountnumber, bankaccountname, bankamount, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const banker = await banks.findOne({ username, bankname, bankaccountnumber });

                    if (banker === null) {
                        const addbank = new banks({ username, bankname, bankaccountnumber, bankaccountname, bankamount });
                        await addbank.save();
                    } else {
                        return { error: "exist" };
                    }

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        bankupdate: async (_, { id, username, bankname, bankaccountnumber, bankaccountname, bankamount, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await banks.updateOne({ _id: id, username: username }, { $set: { bankname, bankaccountnumber, bankaccountname, bankamount } });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        bankdelete: async (_, { id, username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await banks.deleteOne({ _id: id, username: username });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        addnewuser: async (_, { username, newusername, newpassword, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const checkifexist = await login.findOne({ username: newusername });

                    if (checkifexist === null) {

                        const hashedPassword = await argon2.hash(newpassword + newusername + process.env.PasswordToken);
                        
                        const adduser = new login({ username: newusername, password: hashedPassword, createdby: username, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance });
                        await adduser.save();

                    } else {
                        return { error: "exist" };
                    }                    

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        existingusersdelete: async (_, { id, username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {     

                    username = await UsersVerification(username);

                    await login.deleteOne({_id: id, createdby: username });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        existingusersupdate: async (_, { id, username, newusername, newpassword, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    if (newpassword === "") {
                        
                        await login.updateOne({_id: id, createdby: username }, {$set: { username: newusername, createdby: username, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance }});

                        return { error: "no" };

                    } else {

                        const hashedPassword = await argon2.hash(newpassword + newusername + process.env.PasswordToken);
                        
                        await login.updateOne({_id: id, createdby: username }, {$set: { username: newusername, password: hashedPassword, createdby: username, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance }});

                        return { error: "passwordchange" };
                    }                    

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        openingbalanceinsert: async (_, { username, amount, chooseclient, name, accountnumber, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    //Check if a supplier or customer account no is taken and should not be given to someone else
                    const check = await openingbalance.findOne({ username, accountnumber });
                    if(check !== null){
                        if(check.name !== name){
                            if(check.chooseclient === "supplier"){
                                return { error: "supplieraccountnotaken" }; 
                            }else if(check.chooseclient === "customer"){
                                return { error: "customeraccountnotaken" };
                            }
                        }
                    }

                    const openingbalancer = new openingbalance({ username, amount, chooseclient, name, accountnumber });

                    await openingbalancer.save();

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        openingbalancedelete: async (_, { id, username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await openingbalance.deleteOne({ _id: id, username: username });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        openingbalanceupdate: async (_, { id, username, amount, chooseclient, name, accountnumber, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    //Check if a supplier or customer account no is taken and should not be given to someone else
                    const check = await openingbalance.findOne({ username, accountnumber });
                    if(check !== null){
                        if(check.name !== name){
                            if(check.chooseclient === "supplier"){
                                return { error: "supplieraccountnotaken" }; 
                            }else if(check.chooseclient === "customer"){
                                return { error: "customeraccountnotaken" };
                            }
                        }
                    }

                    await openingbalance.updateOne({ _id: id, username: username }, { $set: { amount, chooseclient, name, accountnumber } });

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        expenses: async (_, { username, amount, description, bankname, bankaccountnumber, bankaccountname, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    const expenser = new expense({ username, amount, description, bankname, bankaccountnumber, bankaccountname });

                    await expenser.save();

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        expensesdelete: async (_, { id, username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await expense.deleteOne({ _id: id, username: username });

                    return { error: "no" };
                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        expensesupdate: async (_, { id, username, amount, description, bankname, bankaccountnumber, bankaccountname, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    await expense.updateOne({ _id: id, username: username }, { $set: { amount, description, bankname, bankaccountnumber, bankaccountname } });

                    return { error: "no" };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

        generateaccountnumber: async (_, { username, jwtauth }) => {
            const tokenverification = await verify(jwtauth, process.env.Verify); //verifying the token

            if (tokenverification.username !== username) {
                return { error: "changetoken" };
            }

            if (tokenverification) {
                try {

                    username = await UsersVerification(username);

                    let allexistingaccountnumber = [];
                    let newaccountnumber = 0;

                    let gan = await openingbalance.find({ username });

                    await gan.forEach((e) => {
                        allexistingaccountnumber.push(e.accountnumber);
                    });

                    for(let i of allexistingaccountnumber){
                        if(parseFloat(i) > newaccountnumber){
                            newaccountnumber = parseFloat(i);
                        }
                    }

                    newaccountnumber = newaccountnumber + 1;

                    if(newaccountnumber === 1){
                        newaccountnumber = 1000;
                    }

                    return { newaccountnumber: newaccountnumber };

                } catch (e) {
                    return { error: "yes" };
                }
            } else {
                return { error: "errortoken" };
            }
        },

    }
}

module.exports = resolvers;