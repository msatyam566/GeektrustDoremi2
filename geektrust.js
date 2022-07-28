const fs = require("fs");
const filename = process.argv[2];
const moment = require('moment')

//======================Model Plans====================//

let rechargePlans = {
    
    MUSIC: {
        FREE: {
            amount: 0,
            time: 1
        },
        PERSONAL: {
            amount: 100,
            time: 1
        },
        PREMIUM: {
            amount: 250,
            time: 3
        }
    },
     VIDEO: {
        FREE: {
            amount: 0,
            time: 1
    },
        PERSONAL: {
            amount: 200,
            time: 0
        },
        PREMIUM: {
            amount: 500,
            time: 3
        }
    },
    PODCAST: {
        FREE: {
            amount: 0,
            time: 1
        },
        PERSONAL: {
            amount: 100,
            time: 1
        },
        PREMIUM: {
            amount: 300,
            time: 2
        }
    }
}
let topUpRecharges = {
    FOUR_DEVICE: {
        amount: 50,
        device: 4
    },
    TEN_DEVICE: {
        amount: 100,
        device: 10
    },

}

//-=========================controller Part==========================//

let subscriptionPlans = {};
let listofPlans = [];
let totalPrice = 0;
let rechargeList = [];


data = fs.readFileSync(process.argv[2]).toString();
const addTop = (device, num) => {
    if (subscriptionPlans.date == 'NULL') {
        console.log('ADD_topUpRecharges_FAILED INVALID_DATE');
        return;
    }
    if (listofPlans.length === 0) {
        console.log('ADD_topUpRecharges_FAILED SUBSCRIPTIONS_NOT_FOUND');
        return;
    }
    let checkSub = rechargeList.find(item => item == device + '_' + num)
    if (checkSub) {
        console.log('ADD_topUpRecharges_FAILED DUPLICATE_topUpRecharges');
        return;
    }
    let topInfo = topUpRecharges[device];
    let topPrice = topInfo.amount * num;
    totalPrice = totalPrice + topPrice;
    rechargeList.push(device + '_' + num);
}


function printInfo(){
    if (listofPlans.length === 0) {
        console.log('SUBSCRIPTIONS_NOT_FOUND');
        return;
    }
    for (i = 0; i < listofPlans.length; i++) {
        console.log('RENEWAL_REMINDER ' + listofPlans[i].type + ' ' + listofPlans[i].lastDate);
    }
    console.log('RENEWAL_AMOUNT ' + totalPrice);
}


//=========================checking subscriptions============================//

function subScrip(type, plan){
    let planDetails = rechargePlans[type];
    let month = planDetails[plan.trim()].time
    if (subscriptionPlans.date == 'NULL') {
        console.log('ADD_SUBSCRIPTION_FAILED INVALID_DATE');
        return;
    }
    let lastDate = moment(subscriptionPlans.date, "DD-MM-YYYY").add(month, 'M').format('DD-MM-YYYY');
    let obj = {
        type,
        plan,
        startDate: subscriptionPlans.date,
        lastDate: moment(lastDate, "DD-MM-YYYY").subtract(10, 'days').format('DD-MM-YYYY')
    }
    let checkSub = listofPlans.find(item => item.type.trim() == type.trim())
    if (checkSub) {
        console.log('ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY');
        return;
    }
    if (!checkSub) {
        listofPlans.push(obj);
        totalPrice = totalPrice + planDetails[plan.trim()].amount
    }

}
//=================================main file===========================//

function mainFile(dataEntry) {
    var input = dataEntry.toString().split("\n")
    for (i = 0; i < input.length; i++) {
        if (input) {
            var input = input[i].split(' ')
            switch (input[0]) {
                case 'START_SUBSCRIPTION':
                    dateAdd(input[1].trim());
                    break;
                case 'ADD_SUBSCRIPTION':
                    subScrip(input[1], input[2]);
                    break;
                case 'ADD_topUpRecharges':
                    addTop(input[1], input[2]);
                    break;
                case 'PRINT_RENEWAL_DETAILS':
                    printInfo()
                    break;

            }
        }
    }
}



//==========================adding Date===============================//

function dateAdd(dateSt){
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (dateSt.match(regex) === null) {
        console.log('DATE is INVALID');
        subscriptionPlans.date = 'NULL';
        return "NULL";
    }
    const [day, month, year] = dateSt.split('-');
    const dateFormat = `${year}-${month}-${day}`;
    const date = new Date(dateFormat);
    const timestamp = date.getTime();
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        console.log('DATEis INVALID');
        subscriptionPlans.date = 'NULL';
        return "NULL";
    }
    subscriptionPlans.date = dateSt;
}



mainFile(data);



module.exports = { mainFile }










