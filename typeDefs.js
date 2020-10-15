const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query{
        accountInfo(username: String, jwtauth: String): AccountInfo!
        emailverified(username: String, jwtauth: String): Err

        buyandsellget(username: String, searchsupplier: String, searchcustomer: String, startc: Int, endc: Int, jwtauth: String): [BUYANDSELL]
        totalityforcustomer(username: String, customer: String, customeraccountno: String, jwtauth: String): TOTALITY
        totalityforsupplier(username: String, supplier: String, supplieraccountno: String, jwtauth: String): TOTALITY
        totalityforpayorrecievedcustomer(username: String, customer: String, customeraccountno: String, jwtauth: String): TOTALITY
        totalityforpayorrecievedsupplier(username: String, supplier: String, supplieraccountno: String, jwtauth: String): TOTALITY
        buyandsellgetcustomer(username: String, customer: String, customeraccountno: String, startc: Int, endc: Int, jwtauth: String): [BUYANDSELL]
        buyandsellgetsupplier(username: String, supplier: String, supplieraccountno: String, startc: Int, endc: Int, jwtauth: String): [BUYANDSELL]
        recieveorpayget(username: String, search: String, startc: Int, endc: Int, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
        recieveorpaygetcustomer(username: String, customer: String, customeraccountno: String, startc: Int, endc: Int, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
        recieveorpaygetsupplier(username: String, supplier: String, supplieraccountno: String, startc: Int, endc: Int, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
        allbanksget(username: String, jwtauth: String): [ALLBANKS]

        totalforcustomer(username: String, customer: String, customeraccountno: String, jwtauth: String): TOTALCUSTOMERANDSUPPLIER
        totalforsupplier(username: String, supplier: String, supplieraccountno: String, jwtauth: String): TOTALCUSTOMERANDSUPPLIER

        getallcustomers(username: String, jwtauth: String, searchcustomer: String, searchcustomeraccountno: String, start: Int, end: Int): [GETALLCUSTOMERSANDSUPPLIERS]
        getprevioususersinfo(username: String, jwtauth: String): [PREVIOUSUSERS]
        getallsuppliers(username: String, jwtauth: String, searchsupplier: String, searchsupplieraccountno: String, start: Int, end: Int): [GETALLCUSTOMERSANDSUPPLIERS]
    
        totaltransactions(username: String, jwtauth: String): TOTALTRANSACTIONS
        existingusers(username: String, jwtauth: String): [LOGINOTHERUSERS]
        getallavailablebanks(username: String, jwtauth: String): [ALLBANKS]

        expensesget(username: String, search: String, startc: Int, endc: Int, jwtauth: String): [EXPENSES]
        expensesgetsinglebank(username: String, bankname: String, bankaccountnumber: String, startc: Int, endc: Int, jwtauth: String): [EXPENSES]
        totalexpenses(username: String, jwtauth: String): EXPENSES
        totalexpensessinglebank(username: String, bankname: String, bankaccountnumber: String, jwtauth: String): EXPENSES

        openingbalanceget(username: String, search: String, startc: Int, endc: Int, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
    
        totalopeningbalance(username: String, jwtauth: String): EXPENSES
        accessverify(username: String, jwtauth: String): LOGINOTHERUSERS

        reconcileget(username: String, search: String, startc: Int, endc: Int, jwtauth: String): [RECONCILER]
        reconcilegetsinglebank(username: String, bankname: String, bankaccountnumber: String, startc: Int, endc: Int, jwtauth: String): [RECONCILER]
        totalsinglebankbalance(username: String, bankname: String, bankaccountnumber: String, jwtauth: String): TOTALCUSTOMERANDSUPPLIER
        totalityforpayorrecievedsinglebank(username: String, bankname: String, bankaccountnumber: String, jwtauth: String): TOTALITY
        recieveorpaygetsinglebank(username: String, bankname: String, bankaccountnumber: String, startc: Int, endc: Int, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
    }
    type RECONCILER{
        id: String
        username: String
        description: String
        amount: String
        sendorrecieved: String
        from: String
        bankname: String
        bankaccountnumber: String
        bankaccountname: String
        to: String
        bankname2: String
        bankaccountnumber2: String
        bankaccountname2: String
        date: String
    }
    type EXPENSES{
        id: String
        description: String
        amount: String
        bankname: String
        bankaccountnumber: String
        bankaccountname: String
        date: String
        totalamount: String
    }
    type LOGINOTHERUSERS{
        id: String
        username: String 
        createdby: String
        createbank: String 
        editbank: String 
        deletebank: String 
        createtransaction: String 
        edittransaction: String 
        deletetransaction: String 
        createrecieveorpay: String 
        editrecieveorpay: String 
        deleterecieveorpay: String
        createexpense: String 
        editexpense: String 
        deleteexpense: String 
        createopeningbalance: String 
        editopeningbalance: String 
        deleteopeningbalance: String
        createreconcile: String 
        editreconcile: String 
        deletereconcile: String
        listofcustomers: String 
        listofsuppliers: String
        date: String
    }
    type TOTALITY{
        amount: String 
        customerrate: String 
        customerngn: String 
        supplierrate: String 
        supplierngn: String 
        profit: String
        amountpay: String
        amountrecieved: String
    }
    type TOTALTRANSACTIONS{
        totalbalance: String 
        totaldebt: String 
        totaloverdraft: String 
        net: String 
        totalprofit: String
        totalexpense: String
        netprofit: String
    }
    type TOTALCUSTOMERANDSUPPLIER{
        totalbalance: String
        error: String
    }
    type RECIEVEDCUSTOMERANDSUPPLIER{
        id: String
        username: String
        amount: String
        chooseclient: String
        name: String
        recievedorpay: String
        fromorto: String
        bankname: String
        bankaccountnumber: String
        bankaccountname: String
        accountnumber: String
        date: String
    }
    type PREVIOUSUSERS{
        id: String 
        type: String 
        name: String 
        accountno: String
    }
    type GETALLCUSTOMERSANDSUPPLIERS{
        id: String
        customer: String
        customeraccountno: String
        supplier: String
        supplieraccountno: String
        balance: String
        date: String
        error: String
    }
    type ALLBANKS{
        id: String
        username: String
        bankname: String
        bankaccountnumber: String
        bankaccountname: String
        bankamount: String
        bankbalance: String
        date: String
    }
    type BUYANDSELL{
        id: String 
        username: String 
        amount1: String 
        rate1: String 
        ngn1: String 
        supplier: String 
        supplieraccountno: String
        customer: String
        customeraccountno: String
        amount2: String 
        rate2: String 
        ngn2: String 
        profit: String 
        amount: String 
        recievedorpay: String 
        fromorto: String 
        bankname: String 
        accountnumber: String
        date: String
    }
    type Err {
        newaccountnumber: String
        error: String
        balance: String
    }
    type Login {
        id: ID
        username: String
        password: String
        error: String
        token: String
    }
    type Account {
        id: ID
        firstname: String
        lastname: String 
        email: String
        phoneno: String
        country: String
        state: String 
        localgovt: String
        dateofbirth: String
        gender: String
        category: String
        username: String
        password: String
        error: String
    }

    type AccountInfo {
        id: ID
        fullname: String
        email: String
        phoneno: String
        country: String
        state: String
        localgovt: String
        gender: String
        username: String
        businessname: String
        picture: String
        emailverify: String
        error: String
        verifymembership: String
    }

    type AccountUpdate {
        fullname: String
        email: String
        phoneno: String
        country: String
        state: String
        localgovt: String
        gender: String
        username: String
        businessname: String
        picture: String
        error: String
    }

    type Mutation{

        loginAccount(username: String, password: String): Login!

        createAccount(fullname: String, email: String,
                    phoneno: String, gender: String, 
                    username: String, password: String): Account!

        accountUpdate(username: String, jwtauth: String, fullname: String, email: String,
            phoneno: String, country: String, state: String, 
            localgovt: String, dateofbirth: String, gender: String, 
            businessname: String, file: String): AccountUpdate

        usernameavailability(username: String): Err
        
        usershelp(username: String, sentmessage: String, jwtauth: String): Err
        usersfeedback(username: String, sentmessage: String, jwtauth: String): Err

        emailverification(username: String, verificationcode: String, jwtauth: String): Err
        
        newpasswordverification(username: String, verificationcode: String, newpassword: String): Err

        changeemail(username: String, email: String, jwtauth: String): Err

        buyandsellupdate(id: String, username: String, amount1: String, rate1: String, ngn1: String, supplier: String, supplieraccountno: String, customer: String, customeraccountno: String, rate2: String, ngn2: String, profit: String, jwtauth: String): Err
        buyandselldelete(id: String, username: String, jwtauth: String): Err
        buyandsellinsert(username: String, amount1: String, rate1: String, ngn1: String, supplier: String, supplieraccountno: String, customer: String, customeraccountno: String, rate2: String, ngn2: String, profit: String, jwtauth: String): Err

        recieveorpayupdate(id: String, username: String, amount: String, chooseclient: String, recievedorpay: String, fromorto: String, bankname: String, bankaccountnumber: String, bankaccountname: String, accountnumber: String, jwtauth: String): Err
        recieveorpaydelete(id: String, username: String, jwtauth: String): Err
        recieveorpayinsert(id: String, username: String, amount: String, chooseclient: String, recievedorpay: String, fromorto: String, bankname: String, bankaccountnumber: String, bankaccountname: String, accountnumber: String, jwtauth: String): Err
        addbanks(username: String, bankname: String, bankaccountnumber: String, bankaccountname: String, bankamount: String, jwtauth: String): Err
        bankupdate(id: String, username: String, bankname: String, bankaccountnumber: String, bankaccountname: String, bankamount: String, jwtauth: String): Err
        bankdelete(id: String, username: String, jwtauth: String): Err
        addnewuser(username: String, newusername: String, newpassword: String, createbank: String, editbank: String, deletebank: String, createtransaction: String, edittransaction: String, deletetransaction: String, createrecieveorpay: String, editrecieveorpay: String, deleterecieveorpay: String, createexpense: String, editexpense: String, deleteexpense: String, createopeningbalance: String, editopeningbalance: String, deleteopeningbalance: String, createreconcile: String, editreconcile: String, deletereconcile: String, listofcustomers: String, listofsuppliers: String, jwtauth: String): Err
        existingusersdelete(id: String, username: String, jwtauth: String): Err
        existingusersupdate(id: String, username: String, newusername: String, newpassword: String, createbank: String, editbank: String, deletebank: String, createtransaction: String, edittransaction: String, deletetransaction: String, createrecieveorpay: String, editrecieveorpay: String, deleterecieveorpay: String, createexpense: String, editexpense: String, deleteexpense: String, createopeningbalance: String, editopeningbalance: String, deleteopeningbalance: String, createreconcile: String, editreconcile: String, deletereconcile: String, listofcustomers: String, listofsuppliers: String, jwtauth: String): Err

        openingbalanceinsert(username: String, amount: String, chooseclient: String, name: String, accountnumber: String, jwtauth: String): Err
        openingbalanceupdate(id: String, username: String, amount: String, chooseclient: String, name: String, accountnumber: String, jwtauth: String): Err
        openingbalancedelete(id: String, username: String, jwtauth: String): Err

        expenses(username: String, amount: String, description: String, bankname: String, bankaccountnumber: String, bankaccountname: String, jwtauth: String): Err
        expensesupdate(id: String, username: String, amount: String, description: String, bankname: String, bankaccountnumber: String, bankaccountname: String, jwtauth: String): Err
        expensesdelete(id: String, username: String, jwtauth: String): Err

        generateaccountnumber(username: String, jwtauth: String): Err

        reconcileinsert(username: String, amount: String, description: String, sendorrecieved: String, from: String, bankname: String, bankaccountnumber: String, bankaccountname: String, to: String, bankname2: String, bankaccountnumber2: String, bankaccountname2: String, jwtauth: String): Err
        reconcileupdate(id: String, username: String, amount: String, description: String, sendorrecieved: String, from: String, bankname: String, bankaccountnumber: String, bankaccountname: String, to: String, bankname2: String, bankaccountnumber2: String, bankaccountname2: String, jwtauth: String): Err
        reconciledelete(id: String, username: String, jwtauth: String): Err

        allfilteredexpenses(username: String, fromdate: String, todate: String, bankname: String, bankaccountnumber: String, jwtauth: String): [EXPENSES]
        allfilteredrecievedorpay(username: String, fromdate: String, todate: String, bankname: String, bankaccountnumber: String, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
        allfilteredreconcile(username: String, fromdate: String, todate: String, bankname: String, bankaccountnumber: String, jwtauth: String): [RECONCILER]
        allfilteredbuyandsellcustomer(username: String, fromdate: String, todate: String, customer: String, customeraccountno: String, jwtauth: String): [BUYANDSELL]
        allfilteredbuyandsellsupplier(username: String, fromdate: String, todate: String, supplier: String, supplieraccountno: String, jwtauth: String): [BUYANDSELL]
        allfilteredrecieveorpaycustomer(username: String, fromdate: String, todate: String, customer: String, customeraccountno: String, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
        allfilteredrecieveorpaysupplier(username: String, fromdate: String, todate: String, supplier: String, supplieraccountno: String, jwtauth: String): [RECIEVEDCUSTOMERANDSUPPLIER]
    }
`;

module.exports = typeDefs;