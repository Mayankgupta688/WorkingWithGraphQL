var express = require("express");
var express_graphql = require("express-graphql");
var buildScheme = require("graphql").buildSchema;
var bankList = require("./applicationData").bankList;
var accountList = require("./applicationData").accountList;

var app = express();







var schema = buildScheme(`



    type Query {
        GetBankList: [Bank]
        GetBank(includeId: Int): Bank
        GetOtherBank(excludeId: Int): [Bank]
        GetData(name: String!): String
        GetTotalAccountNumber: Int
        SearchAccount(accountId: Int!): [Account]
        GetTotalBankNumber: Int
        GetTotalBankNumberStartingWith(startLetter: String): [Bank]
        GetDetailsForBankWithAccountCount: [BankDetails]
    }

    type BankDetails {
        bankName: String
        accountCount: Int
    }

    type Bank {
        bankId: Int,
        bankName: String
        employeeCount: Int,
        customerCount: Int,
        revenue: String,
        accounts: [Account]
    }

    type Account {
        accountId: Int!,
        bankId: Int!,
        accountOwner: String
    }
























    type ContainsFilter {
        contains: String!
    }

    type Mutation {
        deleteAccount(id: Int!): String
        updateAccountOwner(id: Int!, updatedOwner: String!): String
    }

    

    
`);

app.use("/graphql", express_graphql({
    schema: schema,
    rootValue: {

        SearchAccount: (args) => {
            var singleAccount = accountList.filter((account) => account.accountId == args.accountId)[0]
            var bankIdToQuery = singleAccount.bankId
            return accountList.filter((account) => account.bankId == bankIdToQuery)
        },

        GetData: (args) => {
            return "Hello " + args.name
        },

        GetTotalAccountNumber: () => {
            return accountList.length;
        }, 

        GetTotalBankNumber: () => {
            return bankList.length;
        }, 


        GetOtherBank: (param) => {
            var bankFilteredList = []

            // SQL Query

            // APUI Query

            // fIle System Access

            // I nmemory Data...

            for(let i=0; i< bankList.length; i++) {
                if(bankList[i].bankId != param.excludeId) {
                    bankFilteredList.push(bankList[i])
                }
                
            }

            return bankFilteredList
        },






        GetBankList: () => {
            for(var i=0; i< bankList.length; i++) {
                bankList[i].accounts = accountList.filter(accounts => accounts.bankId == bankList[i].bankId)
            }
            return bankList
        }, 






        GetBank: (param) => {
            return bankList.filter(acc => acc.bankId == param.includeId)[0]
        }, 
        deleteBank: (param) => {
            bankList = bankList.filter(acc => acc.bankId != param.id)
            return "Success";
        }, updateAccountOwner: (args) => {
            accountList = accountList.map((account) => {
                if(account.accountId == args.id) {
                    account.accountOwner = args.updatedOwner
                }
                return account
            })

            return "Owner Updated";
        }
    },
    graphiql: true
}))

app.listen(4000, () => "Express GraphQL Server up and running..");